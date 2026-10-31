import type { Metadata } from "next";
import { ArrowUpRight, Wind } from "lucide-react";
import Link from "next/link";
import { PageIntro, SectionLabel } from "@/components/ui";
import { ProjectGallery } from "@/components/project-gallery";
import { ContactBanner } from "@/components/site-shell";
export const metadata: Metadata = {
  title: "Nos réalisations",
  description:
    "Découvrez les chantiers MK Aération : FIER Annecy, légumerie de Vourney, plateforme Lidl et Métropole de Grenoble.",
};
export default function Realisations() {
  return (
    <main id="contenu">
      <PageIntro
        label="Réalisations"
        title={
          <>
            LA PREUVE.
            <br />
            <span className="text-blue">PAR LE TERRAIN.</span>
          </>
        }
      >
        Des bâtiments différents. La même exigence dans la pose. Entrez dans les
        coulisses de nos installations.
      </PageIntro>
      <section className="container gallery-section">
        <ProjectGallery />
      </section>
      <section className="grenoble-section section-space">
        <div className="container grenoble-grid">
          <div
            className="technical-visual"
            aria-label="Illustration technique du chantier, sans photographie"
          >
            <div className="technical-grid" />
            <Wind size={96} strokeWidth={0.8} />
            <strong>13</strong>
            <span>COLONNES DE VENTILATION</span>
            <small>SCHÉMA D’INTENTION · MÉTROPOLE DE GRENOBLE</small>
          </div>
          <div>
            <SectionLabel>JOURNAL DE CHANTIER</SectionLabel>
            <h2>
              MÉTROPOLE
              <br />
              DE GRENOBLE.
            </h2>
            <p>
              Les 13 colonnes circulaires et rectangulaires sont en place, du
              R+2 jusqu’à la terrasse. Une étape concrète sur ce chantier de
              ventilation.
            </p>
            <p>
              La prochaine étape : raccorder les réseaux aux centrales de
              traitement d’air.
            </p>
            <Link className="text-link" href="/devis">
              Un chantier similaire ? Parlons-en <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}
