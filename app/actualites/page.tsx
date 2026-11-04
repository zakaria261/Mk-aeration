import { publicSite, pageMetadata } from "@/lib/site-content-server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publicNews } from "@/lib/cms-posts";
import { PageIntro } from "@/components/ui";
import { NewsCard } from "@/components/news-card";
import { ContactBanner } from "@/components/site-shell";
export const revalidate = 60;
export const generateMetadata = () => pageMetadata("actualites", "/actualites");
export default async function News() {
  const settings = await publicSite();
  const posts = await publicNews();
  return (
    <main id="contenu">
      <PageIntro label="Actualités" title={settings.pages.actualites.title}>
        {settings.pages.actualites.description}
      </PageIntro>
      <section className="wrap news-page section">
        {posts.length ? (
          <div className="log-list">
            {posts.map((p) => (
              <NewsCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="label">À suivre</p>
            <h2>
              Les prochaines nouvelles
              <br />
              <em>arrivent du terrain.</em>
            </h2>
            <p>
              Retrouvez dès maintenant les photos et les interventions de notre
              équipe dans les réalisations.
            </p>
            <Link href="/realisations" className="link-arrow">
              Découvrir nos chantiers <ArrowUpRight size={19} />
            </Link>
          </div>
        )}
      </section>
      <ContactBanner />
    </main>
  );
}
