import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/expertises",
    "/realisations",
    "/entreprise",
    "/devis",
    ...projects.map((p) => `/realisations/${p.slug}`),
  ].map((path) => ({
    url: `https://mk-aeration.zak26140000.chatgpt.site${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/devis" ? 0.9 : 0.7,
  }));
}
