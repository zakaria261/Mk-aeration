import { randomUUID } from "node:crypto";
import { cmsDb } from "@/lib/cms-db";
import {
  requireMember,
  checkMutationOrigin,
  readCmsJson,
  cmsErrorResponse,
  CmsError,
} from "@/lib/cms-access";
import { emptyDraft } from "@/lib/cms-types";
import { isContentKind } from "@/lib/cms-posts";

export async function GET() {
  try {
    const member = await requireMember();
    const posts =
      await cmsDb()`SELECT * FROM cms_posts WHERE (owner_email=${member.email} OR ${member.role === "admin"}) ORDER BY updated_at DESC LIMIT 100`;
    return Response.json(
      { posts },
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
    const data = await readCmsJson(request);
    if (!isContentKind(data.kind))
      throw new CmsError(400, "Choisissez une réalisation ou une actualité.");
    const id = randomUUID();
    const slug = `${data.kind === "realisation" ? "chantier" : "actualite"}-${id.slice(0, 8)}`;
    const rows =
      await cmsDb()`INSERT INTO cms_posts(id,kind,slug,owner_email,draft) VALUES(${id},${data.kind},${slug},${member.email},${JSON.stringify(emptyDraft)}::jsonb) RETURNING *`;
    return Response.json({ post: rows[0] }, { status: 201 });
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
