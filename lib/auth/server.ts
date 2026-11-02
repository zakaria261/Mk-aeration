import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";

let instance: ReturnType<typeof createNeonAuth> | undefined;
export function teamAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !secret) throw new Error("CMS_AUTH_UNAVAILABLE");
  return (instance ??= createNeonAuth({
    baseUrl,
    cookies: { secret, sessionDataTtl: 60 },
  }));
}
