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
            LE TERRAIN.
            <br />
            <span className="text-blue">AU QUOTIDIEN.</span>
          </>
        }
      >
        L’avancement des chantiers, les gestes du métier et les nouvelles de
        l’équipe MK Aération.
      </PageIntro>
      <section className="container news-list-section">
        {posts.length ? (
          <div className="news-grid">
            {posts.map((p) => (
              <NewsCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <div className="news-empty">
            <span className="eyebrow">À SUIVRE</span>
            <h2>
              LES PROCHAINES NOUVELLES
              <br />
              ARRIVENT DU TERRAIN.
            </h2>
            <p>
              Retrouvez dès maintenant les photos et les interventions de notre
              équipe dans les réalisations.
            </p>
            <Link href="/realisations" className="text-link">
              Découvrir nos chantiers <ArrowUpRight size={19} />
            </Link>
          </div>
        )}
      </section>
      <ContactBanner />
    </main>
  );
}
