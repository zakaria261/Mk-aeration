import { cmsDb } from "@/lib/cms-db";
import {
  requireAdmin,
  requireMember,
  checkMutationOrigin,
  readCmsJson,
  CmsError,
  cmsErrorResponse,
} from "@/lib/cms-access";
export async function GET() {
  try {
    requireAdmin(await requireMember());
    const contacts =
      await cmsDb()`SELECT id,reference,name,email,phone,message,status,created_at FROM cms_contacts ORDER BY created_at DESC LIMIT 100`;
    return Response.json(
      { contacts },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
export async function PATCH(request: Request) {
  try {
    checkMutationOrigin(request);
    requireAdmin(await requireMember());
    const d = await readCmsJson(request, 1000);
    if (
      !/^[a-f0-9-]{36}$/.test(d.id) ||
      !["new", "replied", "archived"].includes(d.status)
    )
      throw new CmsError(400, "Demande invalide.");
    const rows =
      await cmsDb()`UPDATE cms_contacts SET status=${d.status} WHERE id=${d.id} RETURNING id`;
    if (!rows.length) throw new CmsError(404, "Demande introuvable.");
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
export async function DELETE(request: Request) {
  try {
    checkMutationOrigin(request);
    requireAdmin(await requireMember());
    const d = await readCmsJson(request, 500);
    if (!/^[a-f0-9-]{36}$/.test(d.id))
      throw new CmsError(400, "Demande invalide.");
    const rows =
      await cmsDb()`DELETE FROM cms_contacts WHERE id=${d.id} RETURNING id`;
    if (!rows.length) throw new CmsError(404, "Demande introuvable.");
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
