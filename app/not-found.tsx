import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <main id="contenu" className="wrap state-page">
      <p className="label">Erreur 404</p>
      <h1>
        Un petit
        <br />
        <em>courant d’air.</em>
      </h1>
      <p>Cette page n’existe pas ou a changé d’adresse.</p>
      <Link href="/" className="btn btn-primary btn-lg">
        Retour à l’accueil
        <ArrowRight size={19} />
      </Link>
    </main>
  );
}
