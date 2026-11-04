import "server-only";
import { unstable_cache } from "next/cache";
import { cmsDb } from "./cms-db";
import {
  defaultSiteContent,
  siteContentSchema,
  publicSnapshot,
  type SiteRecord,
} from "./site-content";
import type { Metadata } from "next";
export async function editableSite(): Promise<SiteRecord> {
  const rows =
    await cmsDb()`SELECT draft,published,version,updated_at FROM cms_site_settings WHERE key='site'`;
  const r = rows[0];
  return r
    ? {
        draft: siteContentSchema.parse(r.draft),
        published: r.published ? siteContentSchema.parse(r.published) : null,
        version: Number(r.version),
        updatedAt: new Date(r.updated_at).toISOString(),
      }
    : {
        draft: defaultSiteContent,
        published: null,
        version: 0,
        updatedAt: null,
      };
}
export const publicSite = unstable_cache(
  async () => {
    if (!process.env.DATABASE_URL) return publicSnapshot(defaultSiteContent);
    try {
      const rows =
        await cmsDb()`SELECT published FROM cms_site_settings WHERE key='site' AND published IS NOT NULL`;
      return publicSnapshot(
        rows[0]
          ? siteContentSchema.parse(rows[0].published)
          : defaultSiteContent,
      );
    } catch {
      console.error(
        "Published site settings unavailable; using verified defaults.",
      );
      return publicSnapshot(defaultSiteContent);
    }
  },
  ["mk-site-v1"],
  { revalidate: 60, tags: ["cms-site"] },
);
export async function pageMetadata(
  key: keyof typeof defaultSiteContent.pages,
  path: string,
): Promise<Metadata> {
  const c = (await publicSite()).pages[key];
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: path },
    openGraph: { title: c.title, description: c.description, url: path },
  };
}
