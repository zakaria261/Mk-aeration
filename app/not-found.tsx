import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <main id="contenu" className="container not-found">
      <span className="eyebrow">ERREUR 404</span>
      <h1>
        UN PETIT
        <br />
        COURANT D’AIR.
      </h1>
      <p>Cette page n’existe pas ou a changé d’adresse.</p>
      <Link href="/" className="button">
        Retour à l’accueil
        <ArrowRight size={19} />
      </Link>
    </main>
  );
}
