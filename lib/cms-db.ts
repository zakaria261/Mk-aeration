import "server-only";
import { neon } from "@neondatabase/serverless";

export function cmsDb() {
  if (!process.env.DATABASE_URL) throw new Error("CMS_DATABASE_UNAVAILABLE");
  return neon(process.env.DATABASE_URL);
}
export const cmsConfigured = () =>
  Boolean(
    process.env.DATABASE_URL &&
      process.env.NEON_AUTH_BASE_URL &&
      process.env.NEON_AUTH_COOKIE_SECRET,
  );
