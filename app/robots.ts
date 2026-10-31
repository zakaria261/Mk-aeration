import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: "https://mk-aeration.zak26140000.chatgpt.site/sitemap.xml",
  };
}
