import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publicNews } from "@/lib/cms-posts";
import { PageIntro } from "@/components/ui";
import { NewsCard } from "@/components/news-card";
import { ContactBanner } from "@/components/site-shell";
export const revalidate = 60;
export const metadata: Metadata = {
  title: "Actualités des chantiers",
  description:
    "Les nouvelles de l’équipe MK Aération : avancement des chantiers, réalisations et vie de l’entreprise.",
};
export default async function News() {
  const posts = await publicNews();
  return (
    <main id="contenu">
      <PageIntro
        label="Actualités"
        title={
          <>
            Le carnet
            <br />
            <em>de chantier.</em>
          </>
        }
      >
        L’avancement des chantiers, les gestes du métier et les nouvelles de
        l’équipe, publiés directement depuis le terrain.
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
