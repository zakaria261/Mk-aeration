import { publicSite, pageMetadata } from "@/lib/site-content-server";
import { PageIntro } from "@/components/ui";
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
        <h2 id="gallery-title" className="gallery-title">
          Toutes nos réalisations
        </h2>
        <ProjectGallery projects={others.map(projectCardData)} />
      </section>
      <ContactBanner />
    </main>
  );
}
