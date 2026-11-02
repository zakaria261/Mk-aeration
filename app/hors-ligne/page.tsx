import type { Metadata } from "next";
import { AirFlow } from "@/components/drawing";

export const metadata: Metadata = {
  title: "Hors connexion",
  robots: { index: false, follow: false },
};

export default function Offline() {
  return (
    <main id="contenu" className="wrap state-page">
      <p className="label">Réseau indisponible</p>
      <h1>
        Pas de réseau
        <br />
        <em>sur ce chantier.</em>
      </h1>
      <p>
        Les pages déjà consultées restent accessibles. Reconnectez-vous pour
        voir le reste, ou appelez-nous directement.
      </p>
      <div className="state-actions">
        <a className="btn btn-primary btn-lg" href="tel:+33768476126">
          07 68 47 61 26
        </a>
        <a className="btn btn-ghost btn-lg" href="/">
          Réessayer
        </a>
      </div>
      <AirFlow label="En attente" />
    </main>
  );
}
