import { revalidatePath, revalidateTag } from "next/cache";
import { cmsDb } from "@/lib/cms-db";
import {
  checkMutationOrigin,
  cmsErrorResponse,
  CmsError,
  readCmsJson,
  requireAdmin,
  requireMember,
} from "@/lib/cms-access";
import { editableHomePage } from "@/lib/home-content-server";
import { homeContentSchema } from "@/lib/home-content";

export async function GET() {
  try {
    requireAdmin(await requireMember());
    return Response.json(
      { page: await editableHomePage() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    checkMutationOrigin(request);
    const member = await requireMember();
    requireAdmin(member);
    const data = await readCmsJson(request, 12000);
    if (
      !["save", "publish"].includes(data.action) ||
      !Number.isInteger(data.version) ||
      data.version < 0
    )
      throw new CmsError(400, "Action ou version de page invalide.");
    const parsed = homeContentSchema.safeParse(data.content);
    if (!parsed.success)
      throw new CmsError(
        400,
        "Vérifiez les textes et choisissez une photo d’accueil dans la sélection proposée.",
      );
    const sql = cmsDb();
    const content = JSON.stringify(parsed.data);
    const publishing = data.action === "publish";
    const rows =
      data.version === 0
        ? await sql`WITH changed AS (INSERT INTO cms_pages(key,draft,published) VALUES('home',${content}::jsonb,${publishing ? content : null}::jsonb) ON CONFLICT(key) DO NOTHING RETURNING version,updated_at), logged AS (INSERT INTO cms_site_history(actor_email,action,snapshot) SELECT ${member.email},${"home:" + data.action},${content}::jsonb FROM changed RETURNING id) SELECT version,updated_at FROM changed`
        : await sql`WITH changed AS (UPDATE cms_pages SET draft=${content}::jsonb,published=CASE WHEN ${publishing} THEN ${content}::jsonb ELSE published END,version=version+1,updated_at=now() WHERE key='home' AND version=${data.version} RETURNING version,updated_at), logged AS (INSERT INTO cms_site_history(actor_email,action,snapshot) SELECT ${member.email},${"home:" + data.action},${content}::jsonb FROM changed RETURNING id) SELECT version,updated_at FROM changed`;
    if (!rows.length)
      throw new CmsError(
        409,
        "Cette page a été modifiée ailleurs. Rechargez-la avant de poursuivre ; votre saisie reste affichée.",
      );
    if (publishing) {
      revalidateTag("cms-home", { expire: 0 });
      revalidatePath("/");
    }
    return Response.json(
      {
        version: Number(rows[0].version),
        updated_at: rows[0].updated_at,
        published: publishing,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
