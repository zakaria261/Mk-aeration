import { requireTeamPage } from "@/lib/cms-access";
import { redirect } from "next/navigation";
import { editableSite } from "@/lib/site-content-server";
import { editableHomePage } from "@/lib/home-content-server";
import { allProjects, publicNews } from "@/lib/cms-posts";
import { SiteProvider } from "@/components/site-provider";
import { PublicHome } from "@/components/public-home";
import Link from "next/link";
import { Brand } from "@/components/site-shell";
export default async function Preview() {
  if ((await requireTeamPage()).role !== "admin") redirect("/equipe");
  const [settings, home, projects, news] = await Promise.all([
    editableSite(),
    editableHomePage(),
    allProjects(),
    publicNews(),
  ]);
  return (
    <SiteProvider content={settings.draft}>
      <aside className="preview-banner">
        Aperçu privé des brouillons enregistrés ·{" "}
        <Link href="/equipe/reglages">Retour à la gestion</Link>
      </aside>
      <header className="preview-site-logo">
        <Brand />
      </header>
      <PublicHome
        settings={settings.draft}
        content={home.draft}
        references={projects}
        news={news}
        preview
      />
    </SiteProvider>
  );
}
