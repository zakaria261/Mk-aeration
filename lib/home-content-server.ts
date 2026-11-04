import "server-only";
import { unstable_cache } from "next/cache";
import { cmsDb } from "./cms-db";
import { defaultHomeContent, readHomeContent, type HomePageRecord } from "./home-content";

export async function editableHomePage(): Promise<HomePageRecord> {
  const rows = await cmsDb()`SELECT draft,published,version,updated_at FROM cms_pages WHERE key='home'`;
  const row = rows[0];
  return row ? {
    draft: readHomeContent(row.draft),
    published: row.published ? readHomeContent(row.published) : null,
    version: Number(row.version),
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  } : { draft: defaultHomeContent, published: null, version: 0, updated_at: null };
}

export const publicHomeContent = unstable_cache(async () => {
  if (!process.env.DATABASE_URL) return defaultHomeContent;
  try {
    const rows = await cmsDb()`SELECT published FROM cms_pages WHERE key='home' AND published IS NOT NULL`;
    return rows[0] ? readHomeContent(rows[0].published) : defaultHomeContent;
  } catch {
    console.error("Home page content is temporarily unavailable; using the published site defaults.");
    return defaultHomeContent;
  }
}, ["cms-home-v1"], { revalidate: 60, tags: ["cms-home"] });
