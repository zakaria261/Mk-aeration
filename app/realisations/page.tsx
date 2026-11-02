import type { Metadata } from "next";
import { PageIntro, SectionLabel } from "@/components/ui";
import { ProjectGallery } from "@/components/project-gallery";
import { FeaturedProject } from "@/components/featured-project";
import { ContactBanner } from "@/components/site-shell";
export const metadata: Metadata = {
  title: "Chantiers & réalisations aérauliques",
  description:
    "Réhabilitation VMC de 3 immeubles et 21 appartements, pose de hotte, Forum de Grenoble, Mont-Blanc : les photos et vidéos des interventions MK Aération.",
};
export default function Realisations() {
  return (
    <main id="contenu">
      <PageIntro
        label="Réalisations"
        title={
          <>
            CHANTIERS.
            <br />
            <span className="text-blue">AÉRAULIQUES.</span>
          </>
        }
      >
        Du bâtiment tertiaire au site industriel : réseaux aérauliques, gaines
        de ventilation, soufflage, extraction et raccordements aux CTA. Le
        travail de nos équipes, en images.
      </PageIntro>
      <section className="container featured-case-section">
        <FeaturedProject light />
      </section>
      <section className="container gallery-section">
        <SectionLabel>TOUTES NOS RÉFÉRENCES</SectionLabel>
        <ProjectGallery />
      </section>
      <section className="project-commitment section-space">
        <div className="container">
          <SectionLabel>CE QUE MONTRENT NOS CHANTIERS</SectionLabel>
          <h2>
            DU RÉSEAU PRINCIPAL
            <br />
            <span className="text-blue">AU DÉTAIL DE POSE.</span>
          </h2>
          <p>
            Colonnes aérauliques en terrasse, raccordements de CTA, transitions
            de gaines ou grilles de soufflage intégrées au sol : chaque chantier
            demande une implantation précise et une bonne coordination avec les
            autres corps d’état.
          </p>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}
