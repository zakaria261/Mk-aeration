import { PublicHome } from "@/components/public-home";
import { allProjects, publicNews } from "@/lib/cms-posts";
import { publicHomeContent } from "@/lib/home-content-server";

import { publicSite } from "@/lib/site-content-server";

export const revalidate = 60;

export default async function Home() {
  const [references, news, content, settings] = await Promise.all([
    allProjects(),
    publicNews(),
    publicHomeContent(),
    publicSite(),
  ]);
  return (
    <PublicHome
      references={references}
      news={news}
      content={content}
      settings={settings}
    />
  );
}

export async function generateMetadata() {
  const c = await publicHomeContent();
  return {
    title: { absolute: `${c.heroTitle} ${c.heroAccent} | MK Aération` },
    description: c.heroDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: `${c.heroTitle} ${c.heroAccent} | MK Aération`,
      description: c.heroDescription,
      url: "/",
    },
  };
}
