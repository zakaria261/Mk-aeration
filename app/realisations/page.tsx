import { publicSite, pageMetadata } from "@/lib/site-content-server";
import type { Metadata } from "next";
import { PageIntro, SectionLabel } from "@/components/ui";
import { ProjectGallery } from "@/components/project-gallery";
import { ContactBanner } from "@/components/site-shell";
import { allProjects, projectCardData } from "@/lib/cms-posts";
import { MontBlancFeature } from "@/components/mont-blanc-feature";

export const generateMetadata = () =>
  pageMetadata("realisations", "/realisations");
export const revalidate = 60;

export default async function Realisations() {
  const settings = await publicSite();
  const projects = await allProjects();
  const others = projects.filter((p) => p.slug !== "tunnel-du-mont-blanc");
  return (
    <main id="contenu">
      <PageIntro label="Réalisations" title={settings.pages.realisations.title}>
        {settings.pages.realisations.description}
      </PageIntro>
      <section className="wrap featured">
        <MontBlancFeature />
      </section>
      <section className="wrap gallery section" aria-labelledby="gallery-title">
        <SectionLabel number={String(others.length).padStart(2, "0")}>
          Toutes nos références
        </SectionLabel>
        <h2 id="gallery-title" className="sr-only">
          Toutes nos références
        </h2>
        <ProjectGallery projects={others.map(projectCardData)} />
      </section>
      <section className="commitment section" aria-labelledby="commit-title">
        <div className="wrap commitment-grid">
          <SectionLabel light>Ce que montrent nos chantiers</SectionLabel>
          <h2 id="commit-title">
            Du réseau principal
            <br />
            <em>au détail de pose.</em>
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
