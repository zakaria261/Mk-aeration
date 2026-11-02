import { cmsDb } from "@/lib/cms-db";
import {
  requireMember,
  requireAdmin,
  checkMutationOrigin,
  readCmsJson,
  cmsErrorResponse,
  CmsError,
} from "@/lib/cms-access";
import { memberSchema } from "@/lib/cms-validation";

export async function GET() {
  try {
    const member = await requireMember();
    requireAdmin(member);
    const members =
      await cmsDb()`SELECT email,name,role,active FROM cms_members ORDER BY created_at`;
    return Response.json(
      { members },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
export async function POST(request: Request) {
  try {
    checkMutationOrigin(request);
    const member = await requireMember();
    requireAdmin(member);
    const parsed = memberSchema.safeParse(await readCmsJson(request));
    if (!parsed.success)
      throw new CmsError(
        400,
        "Renseignez un nom et une adresse e-mail valides.",
      );
    const next = parsed.data;
    if (next.email === member.email && (!next.active || next.role !== "admin"))
      throw new CmsError(
        400,
        "Vous ne pouvez pas désactiver votre propre accès administrateur.",
      );
    await cmsDb()`INSERT INTO cms_members(email,name,role,active) VALUES(${next.email},${next.name},${next.role},${next.active}) ON CONFLICT(email) DO UPDATE SET name=EXCLUDED.name,role=EXCLUDED.role,active=EXCLUDED.active`;
    await cmsDb()`INSERT INTO cms_events(actor_email,action) VALUES(${member.email},${`member:${next.active ? "activate" : "disable"}:${next.email}`})`;
    return Response.json({ ok: true });
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
