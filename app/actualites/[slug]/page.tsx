import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicNews } from "@/lib/cms-posts";
import { PublicationView } from "@/components/publication-view";
import { ContactBanner } from "@/components/site-shell";
type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await publicNews()).find((p) => p.slug === slug);
  if (!post) return { title: "Actualité introuvable" };
  return {
    title: post.published!.title,
    description: post.published!.summary,
    openGraph: {
      type: "article",
      images: [{ url: `/media/${post.published!.coverId}` }],
    },
  };
}
export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  const post = (await publicNews()).find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <main id="contenu">
      <div className="container">
        <PublicationView
          draft={post.published!}
          kind="actualite"
          date={post.published_at}
        />
      </div>
      <ContactBanner />
    </main>
  );
}
