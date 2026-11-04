import { siteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";
import { allProjects, publicNews } from "@/lib/cms-posts";
import { publicSite } from "@/lib/site-content-server";
export const revalidate = 60;
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, news, settings] = await Promise.all([
    allProjects(),
    publicNews(),
    publicSite(),
  ]);
  return [
    "",
    "/expertises",
    "/realisations",
    "/actualites",
    "/entreprise",
    "/devis",
    "/contact",
    ...settings.services.map((s) => `/expertises/${s.id}`),
    ...projects.map((p) => `/realisations/${p.slug}`),
    ...news.map((p) => `/actualites/${p.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/devis" ? 0.9 : 0.7,
  }));
}
