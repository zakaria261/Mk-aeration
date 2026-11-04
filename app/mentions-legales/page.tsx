import type { Metadata } from "next";
import Link from "next/link";
import { publicSite } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";
export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Identité de l’éditeur MK Aération, coordonnées et hébergement du site.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};
export default async function Legal() {
  const c = companyLinks((await publicSite()).company);
  return (
    <main id="contenu" className="wrap legal">
      <h1>Mentions légales</h1>
      <h2>Éditeur</h2>
      <p>
        {c.legalName}
        <br />
        {c.legalForm}
        <br />
        {c.address}
        <br />
        {c.city}, France
      </p>
      <dl className="legal-identifiers">
        <div>
          <dt>SIREN</dt>
          <dd>{c.siren}</dd>
        </div>
        <div>
          <dt>SIRET du siège</dt>
          <dd>{c.siret}</dd>
        </div>
        <div>
          <dt>TVA intracommunautaire</dt>
          <dd>{c.vat}</dd>
        </div>
        <div>
          <dt>Directeur de publication</dt>
          <dd>{c.publisher}</dd>
        </div>
      </dl>
      <p>
        <a href={c.tel}>{c.phone}</a>
        <br />
        <a href={`mailto:${c.email}`}>{c.email}</a>
      </p>
      <p>
        <a
          href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${c.siren}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consulter l’immatriculation dans l’Annuaire des entreprises
        </a>
      </p>
      <h2>Hébergement</h2>
      {siteUrl.includes("chatgpt.site") ? (
        <p>
          Cette version est hébergée par le service Sites d’OpenAI, sur
          l’infrastructure de Cloudflare.{" "}
          <a href="https://openai.com/policies/">
            Informations sur l’hébergeur
          </a>
          .
        </p>
      ) : (
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Avenue #4133
          <br />
          Covina, CA 91723, États-Unis.
          <br />
          <a href="https://vercel.com/legal/privacy-notice">
            Coordonnées et informations de l’hébergeur
          </a>
          .
        </p>
      )}
      <h2>Contenus et photographies</h2>
      <p>
        Les photographies de chantier et l’identité de MK Aération présentent
        ses activités. Leur reproduction nécessite l’autorisation du titulaire
        des droits. Les vues de projet et visuels de présentation sont
        identifiés comme tels.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Les modalités de traitement des demandes sont décrites dans la{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </main>
  );
}
