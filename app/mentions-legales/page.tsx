import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};
export default function Mentions() {
  return (
    <main id="contenu" className="container legal">
      <span className="eyebrow">INFORMATIONS DU SITE</span>
      <h1>MENTIONS LÉGALES</h1>
      <h2>ÉDITEUR</h2>
      <p>
        MK Aération
        <br />2 route des Champs
        <br />
        26140 Saint-Rambert-d’Albon, France
        <br />
        Téléphone : <a href="tel:+33768476126">07 68 47 61 26</a>
        <br />
        E-mail :{" "}
        <a href="mailto:mk.aeration@hotmail.com">mk.aeration@hotmail.com</a>
      </p>
      <p className="legal-note">
        Cette version de présentation doit être complétée avant son ouverture au
        public avec la dénomination juridique exacte de l’éditeur, sa forme
        juridique, son numéro d’immatriculation, les informations de TVA
        applicables et le nom du directeur de la publication.
      </p>
      <h2>HÉBERGEMENT</h2>
      <p>
        Cette version est mise à disposition via le service Sites d’OpenAI et
        s’appuie sur l’infrastructure technique de Cloudflare. Les coordonnées
        légales de l’hébergeur devront être confirmées pour la version publique
        définitive.
      </p>
      <h2>CONTENUS ET PHOTOGRAPHIES</h2>
      <p>
        Les photographies de chantier et l’identité de MK Aération sont
        utilisées pour présenter ses activités. Toute reproduction de ces
        éléments doit faire l’objet d’une autorisation de leur titulaire.
      </p>
      <h2>DONNÉES PERSONNELLES</h2>
      <p>
        Les modalités d’utilisation des données du formulaire sont décrites dans
        notre <Link href="/confidentialite">page de confidentialité</Link>.
      </p>
    </main>
  );
}
