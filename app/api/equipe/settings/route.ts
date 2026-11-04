import { revalidatePath, revalidateTag } from "next/cache";
import { cmsDb } from "@/lib/cms-db";
import {
  CmsError,
  checkMutationOrigin,
  cmsErrorResponse,
  readCmsJson,
  requireAdmin,
  requireMember,
} from "@/lib/cms-access";
import { editableSite } from "@/lib/site-content-server";
import {
  siteContentSchema,
  publicationProblems,
  publishedMedia,
} from "@/lib/site-content";
export async function GET() {
  try {
    requireAdmin(await requireMember());
    return Response.json(
      { page: await editableSite() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
export async function PATCH(request: Request) {
  try {
    checkMutationOrigin(request);
    const member = await requireMember();
    requireAdmin(member);
    const data = await readCmsJson(request, 80000);
    if (
      !["save", "publish"].includes(data.action) ||
      !Number.isInteger(data.version) ||
      data.version < 0
    )
      throw new CmsError(400, "Action ou version invalide.");
    const parsed = siteContentSchema.safeParse(data.content);
    if (!parsed.success)
      throw new CmsError(400, parsed.error.issues[0].message);
    const content = parsed.data,
      publishing = data.action === "publish";
    const media = publishedMedia(content);
    if (publishing) {
      const issues = publicationProblems(content);
      if (issues.length) throw new CmsError(400, issues[0]);
      if (media.length) {
        const ready =
          await cmsDb()`SELECT id FROM cms_media WHERE id=ANY(${media}::uuid[]) AND ready=true`;
        if (ready.length !== media.length)
          throw new CmsError(
            400,
            "Une image n’est pas prête. Réimportez-la avant de publier.",
          );
      }
    }
    const text = JSON.stringify(content);
    const sql = cmsDb();
    const rows =
      data.version === 0
        ? await sql`WITH changed AS (INSERT INTO cms_site_settings(key,draft,published,published_media,updated_by) VALUES('site',${text}::jsonb,${publishing ? text : null}::jsonb,${publishing ? media : []}::uuid[],${member.email}) ON CONFLICT DO NOTHING RETURNING version), logged AS (INSERT INTO cms_site_history(actor_email,action,snapshot) SELECT ${member.email},${data.action},${text}::jsonb FROM changed RETURNING id) SELECT version FROM changed`
        : await sql`WITH changed AS (UPDATE cms_site_settings SET draft=${text}::jsonb,published=CASE WHEN ${publishing} THEN ${text}::jsonb ELSE published END,published_media=CASE WHEN ${publishing} THEN ${media}::uuid[] ELSE published_media END,updated_by=${member.email},updated_at=now(),version=version+1 WHERE key='site' AND version=${data.version} RETURNING version), logged AS (INSERT INTO cms_site_history(actor_email,action,snapshot) SELECT ${member.email},${data.action},${text}::jsonb FROM changed RETURNING id) SELECT version FROM changed`;
    if (!rows.length)
      throw new CmsError(
        409,
        "Le contenu a changé sur un autre appareil. Rechargez la page ; votre saisie reste affichée.",
      );
    if (publishing) {
      revalidateTag("cms-site", { expire: 0 });
      revalidatePath("/", "layout");
    }
    return Response.json(
      { version: Number(rows[0].version) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
