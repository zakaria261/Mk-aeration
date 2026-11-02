import { revalidateTag, revalidatePath } from "next/cache";
import { cmsDb } from "@/lib/cms-db";
import {
  requireMember,
  requireAdmin,
  checkMutationOrigin,
  readCmsJson,
  cmsErrorResponse,
  CmsError,
} from "@/lib/cms-access";
import { editablePost, verifyMedia } from "@/lib/cms-posts";
import {
  draftSchema,
  publicationIssues,
  contentSlug,
} from "@/lib/cms-validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try {
    checkMutationOrigin(request);
    const member = await requireMember();
    const { id } = await params;
    const post = await editablePost(id, member);
    const data = await readCmsJson(request);
    if (!Number.isInteger(data.version) || data.version !== post.version)
      throw new CmsError(
        409,
        "Cette publication a été modifiée ailleurs. Rechargez-la avant de poursuivre.",
      );
    const actions = [
      "save",
      "submit",
      "publish",
      "unpublish",
      "archive",
      "restore",
    ];
    if (!actions.includes(data.action))
      throw new CmsError(400, "Action non reconnue.");
    if (["publish", "unpublish", "archive", "restore"].includes(data.action))
      requireAdmin(member);
    if (post.status === "archived" && data.action !== "restore")
      throw new CmsError(400, "Restaurez d’abord cette publication.");
    const parsed = draftSchema.safeParse(data.draft);
    if (!parsed.success)
      throw new CmsError(
        400,
        "Vérifiez les textes et les légendes : un champ dépasse la longueur autorisée.",
      );
    const draft = parsed.data;
    await verifyMedia(draft, id);
    if (["publish", "submit"].includes(data.action)) {
      const issues = publicationIssues(draft);
      if (issues.length)
        return Response.json(
          { error: issues.join(" "), issues },
          { status: 400 },
        );
    }
    const status = (
      {
        save: "draft",
        submit: "review",
        publish: "published",
        unpublish: "draft",
        archive: "archived",
        restore: "draft",
      } as Record<string, string>
    )[data.action];
    const published =
      data.action === "publish"
        ? draft
        : ["unpublish", "archive"].includes(data.action)
          ? null
          : post.published;
    const slug =
      data.action === "publish" && !post.published_at
        ? contentSlug(draft.title, id)
        : post.slug;
    const rows =
      await cmsDb()`UPDATE cms_posts SET draft=${JSON.stringify(draft)}::jsonb,status=${status},slug=${slug},published=${published ? JSON.stringify(published) : null}::jsonb,published_at=CASE WHEN ${data.action === "publish"} THEN now() ELSE published_at END,version=version+1,updated_at=now() WHERE id=${id} AND version=${post.version} RETURNING *`;
    if (!rows.length)
      throw new CmsError(
        409,
        "Une autre modification vient d’être enregistrée. Rechargez cette publication.",
      );
    await cmsDb()`INSERT INTO cms_events(actor_email,action,post_id) VALUES(${member.email},${data.action},${id})`;
    if (["publish", "unpublish", "archive"].includes(data.action)) {
      revalidateTag("cms-public", { expire: 0 });
      revalidatePath("/", "layout");
    }
    return Response.json({ post: rows[0] });
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
