const configured =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

// Vercel's production hostname is stable across preview deployments.
export const siteUrl = new URL(
  configured
    ? configured.startsWith("http")
      ? configured
      : `https://${configured}`
    : "https://mk-aeration.zak26140000.chatgpt.site",
).origin;
