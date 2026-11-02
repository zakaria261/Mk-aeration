import { createHash } from "node:crypto";
import { teamAuth } from "@/lib/auth/server";
import { cmsDb } from "@/lib/cms-db";
import {
  checkMutationOrigin,
  readCmsJson,
  cmsErrorResponse,
  CmsError,
} from "@/lib/cms-access";

type Context = { params: Promise<{ path: string[] }> };
export async function GET(request: Request, context: Context) {
  const { path } = await context.params;
  if (path.join("/") !== "get-session")
    return Response.json({ error: "Not found" }, { status: 404 });
  try {
    return await teamAuth().handler().GET(request, context);
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
export async function POST(request: Request, context: Context) {
  try {
    checkMutationOrigin(request);
    const { path } = await context.params;
    const action = path.join("/");
    if (
      ![
        "email-otp/send-verification-otp",
        "sign-in/email-otp",
        "sign-out",
      ].includes(action)
    )
      throw new CmsError(404, "Action introuvable.");
    if (action !== "sign-out") {
      const data = await readCmsJson(request.clone(), 3000);
      const email =
        typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
      const members =
        await cmsDb()`SELECT email FROM cms_members WHERE email=${email} AND active=true`;
      if (!members.length)
        throw new CmsError(
          403,
          "Cette adresse n’a pas d’accès actif. Contactez le responsable MK Aération.",
        );
      if (action === "email-otp/send-verification-otp") {
        if (data.type !== "sign-in")
          throw new CmsError(400, "Type de code non autorisé.");
        const ip =
          process.env.VERCEL === "1"
            ? request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
            : "local";
        const bucket = Math.floor(Date.now() / 600000);
        const key = createHash("sha256")
          .update(
            `${process.env.NEON_AUTH_COOKIE_SECRET}:${email}:${ip}:${bucket}`,
          )
          .digest("hex");
        const count =
          await cmsDb()`INSERT INTO cms_rate_limits(key,count,expires_at) VALUES(${key},1,now()+interval '20 minutes') ON CONFLICT(key) DO UPDATE SET count=cms_rate_limits.count+1 RETURNING count`;
        if (count[0].count > 3)
          throw new CmsError(
            429,
            "Plusieurs codes ont été demandés. Attendez 10 minutes avant de réessayer.",
          );
      }
    }
    return await teamAuth().handler().POST(request, context);
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
