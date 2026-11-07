import { companyPresentation, companySignature } from "@/lib/home-content";
import { publicSite, pageMetadata } from "@/lib/site-content-server";
import { Photo } from "@/components/photo";
import { companyLinks } from "@/lib/site-content";
import { PageIntro } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
export const generateMetadata = () => pageMetadata("entreprise", "/entreprise");
const values = [
  [
    "La précision",
    "Des installations soignées, avec une attention portée aux réseaux, aux transitions et aux raccordements.",
  ],
  [
    "L’écoute",
    "Un échange direct pour comprendre votre besoin et les contraintes propres à votre chantier.",
  ],
  [
    "Le collectif",
    "Un travail d’équipe, en lien avec les intervenants du projet, pour faire avancer le chantier.",
  ],
] as const;
export default async function Entreprise() {
  const settings = await publicSite();
  const company = companyLinks(settings.company);
  return (
    <main id="contenu">
      <PageIntro label="L’entreprise" title={settings.pages.entreprise.title}>
        {settings.pages.entreprise.description}
      </PageIntro>
      <figure className="wrap company-photo">
        <Photo
          sizes="(max-width: 1392px) 100vw, 1280px"
          src="/images/annecy-panorama.webp"
          alt="Vue d’ensemble d’un chantier de ventilation MK Aération en toiture"
          width="1800"
          height="1350"
          fetchPriority="high"
        />
        <figcaption>Chantier FIER · Annecy</figcaption>
      </figure>
      <section className="split-list" aria-labelledby="conviction-title">
        <div className="wrap">
          <div className="split-head">
            <h2 id="conviction-title">
              La qualité de l’air commence par <em>la qualité du geste.</em>
            </h2>
            <div className="split-text">
              {companyPresentation.map((paragraph, i) => (
                <p key={paragraph} className={i === 0 ? "split-lead" : ""}>
                  {paragraph}
                </p>
              ))}
              <p>
                <strong>{companySignature}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="values-band" aria-labelledby="values-title">
        <div className="wrap">
          <h2 id="values-title">Ce qui nous anime</h2>
          <ul className="values-cols">
            {values.map(([title, text]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="split-list" id="zone" aria-labelledby="zone-title">
        <div className="wrap">
          <div className="split-head">
            <h2 id="zone-title">
              Ici, c’est <em>notre terrain.</em>
            </h2>
            <div className="split-text">
              <p>
                Basée à <strong>{company.city}</strong>, notre équipe intervient
                sur vos chantiers dans les départements suivants. Contactez-nous
                pour confirmer la faisabilité de votre déplacement.
              </p>
              <ul className="zone-list">
                {company.areas.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <p className="zone-address">
                {company.address}
                <br />
                {company.city}
              </p>
              <a
                href={company.maps}
                className="lp-cta"
                target="_blank"
                rel="noreferrer"
              >
                Nous situer
              </a>
            </div>
          </div>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}
