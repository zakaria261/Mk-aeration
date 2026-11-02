import { siteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";
import { allProjects, publicNews } from "@/lib/cms-posts";
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, news] = await Promise.all([allProjects(), publicNews()]);
  return [
    "",
    "/expertises",
    "/realisations",
    "/actualites",
    "/entreprise",
    "/devis",
    ...projects.map((p) => `/realisations/${p.slug}`),
    ...news.map((p) => `/actualites/${p.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/devis" ? 0.9 : 0.7,
  }));
}
