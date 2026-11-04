import { pageMetadata } from "@/lib/site-content-server";
import Link from "next/link";
import { QuoteForm } from "@/components/quote-form";
import { SectionLabel } from "@/components/ui";
export const generateMetadata = () => pageMetadata("contact", "/devis");
export default function Devis() {
  return (
    <main id="contenu" className="quote-page">
      <div className="wrap">
        <div className="quote-header">
          <nav className="crumbs mono" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Demander un devis</span>
          </nav>
          <SectionLabel>Votre projet commence ici</SectionLabel>
          <div className="quote-header-grid">
            <h1>
              Donnons de l’air
              <br />
              <em>à votre projet.</em>
            </h1>
            <p>
              Quelques détails, vos coordonnées.
              <br />
              La première étape pour construire une réponse adaptée à votre
              chantier.
            </p>
          </div>
        </div>
        <QuoteForm />
      </div>
    </main>
  );
}
