import { PublicHome } from "@/components/public-home";
import { allProjects, publicNews } from "@/lib/cms-posts";
import { publicHomeContent } from "@/lib/home-content-server";

export const revalidate = 60;

export default async function Home() {
  const [references, news, content] = await Promise.all([
    allProjects(), publicNews(), publicHomeContent(),
  ]);
  return <PublicHome references={references} news={news} content={content} />;
}
