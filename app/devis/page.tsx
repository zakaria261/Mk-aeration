import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SectionLabel } from "@/components/ui";
export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Décrivez votre projet de ventilation en quelques étapes. Contactez MK Aération au 07 68 47 61 26 ou demandez un devis en ligne.",
};
export default function Devis() {
  return (
    <main id="contenu" className="quote-page">
      <div className="container">
        <div className="quote-header">
          <div className="breadcrumb">
            <Link href="/">Accueil</Link>
            <ArrowRight size={12} />
            <span>Demander un devis</span>
          </div>
          <SectionLabel>VOTRE PROJET COMMENCE ICI</SectionLabel>
          <div className="quote-header-grid">
            <h1>
              DONNONS DE L’AIR
              <br />
              <span className="text-blue">À VOTRE PROJET.</span>
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
