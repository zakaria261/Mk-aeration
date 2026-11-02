import "server-only";
import { redirect } from "next/navigation";
import { teamAuth } from "./auth/server";
import { cmsConfigured, cmsDb } from "./cms-db";
import type { TeamMember } from "./cms-types";
import { isSameOrigin } from "./request-security";

export class CmsError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function currentMember(): Promise<TeamMember | null> {
  if (!cmsConfigured()) return null;
  const { data: session } = await teamAuth().getSession();
  if (!session?.user?.email || !session.user.emailVerified) return null;
  const rows =
    await cmsDb()`SELECT email,name,role,active FROM cms_members WHERE email=${session.user.email.toLowerCase()} AND active=true`;
  return (rows[0] as TeamMember | undefined) ?? null;
}
export async function requireMember() {
  const member = await currentMember();
  if (!member)
    throw new CmsError(
      401,
      "Connectez-vous avec une adresse autorisée par MK Aération.",
    );
  return member;
}
export async function requireTeamPage() {
  const member = await currentMember();
  if (!member) redirect("/connexion");
  return member;
}
export function requireAdmin(member: TeamMember) {
  if (member.role !== "admin")
    throw new CmsError(403, "Cette action est réservée à l’administrateur.");
}
export function checkMutationOrigin(request: Request) {
  if (!isSameOrigin(request))
    throw new CmsError(403, "Origine de la demande non autorisée.");
}
export async function readCmsJson(
  request: Pick<Request, "headers" | "body">,
  limit = 80000,
) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new CmsError(415, "Format de demande non pris en charge.");
  if (Number(request.headers.get("content-length") || 0) > limit)
    throw new CmsError(413, "Cette publication est trop volumineuse.");
  const reader = request.body?.getReader();
  if (!reader) throw new CmsError(400, "Demande vide.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw new CmsError(413, "Cette publication est trop volumineuse.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  const raw = new TextDecoder().decode(bytes);
  try {
    return JSON.parse(raw);
  } catch {
    throw new CmsError(400, "Demande illisible.");
  }
}
export function cmsErrorResponse(error: unknown) {
  if (error instanceof CmsError)
    return Response.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  console.error(
    "Team operation failed",
    error instanceof Error ? error.message.slice(0, 160) : "Unknown failure",
  );
  return Response.json(
    {
      error:
        "L’enregistrement est momentanément indisponible. Votre saisie reste affichée ; réessayez.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
