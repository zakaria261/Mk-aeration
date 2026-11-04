import { companyPresentation, companySignature } from "@/lib/home-content";
import { publicSite, pageMetadata } from "@/lib/site-content-server";
import { Photo } from "@/components/photo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Check } from "lucide-react";
import { companyLinks } from "@/lib/site-content";
import { PageIntro, SectionLabel } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
export const generateMetadata = () => pageMetadata("entreprise", "/entreprise");
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
        <figcaption className="mono">
          Photo de chantier · FIER, Annecy
        </figcaption>
      </figure>
      <section className="section">
        <div className="wrap company-story">
          <SectionLabel>Notre conviction</SectionLabel>
          <div>
            <h2>
              La qualité de l’air commence par <em>la qualité du geste.</em>
            </h2>
            <div className="company-text">
              {companyPresentation.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                <strong>{companySignature}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="values surface section">
        <div className="wrap">
          <SectionLabel>Ce qui nous anime</SectionLabel>
          <ol className="steps">
            {[
              [
                "01",
                "La précision",
                "Des installations soignées, avec une attention portée aux réseaux, aux transitions et aux raccordements.",
              ],
              [
                "02",
                "L’écoute",
                "Un échange direct pour comprendre votre besoin et les contraintes propres à votre chantier.",
              ],
              [
                "03",
                "Le collectif",
                "Un travail d’équipe, en lien avec les intervenants du projet, pour faire avancer le chantier.",
              ],
            ].map(([n, t, d]) => (
              <li key={n}>
                <span className="mono">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section" id="zone">
        <div className="wrap zone-grid">
          <div>
            <SectionLabel>Proches de vos chantiers</SectionLabel>
            <h2>
              Ici, c’est
              <br />
              <em>notre terrain.</em>
            </h2>
            <p>
              Notre équipe intervient dans les zones indiquées ci-dessous.
              Contactez-nous pour confirmer la faisabilité de votre déplacement.
            </p>
            <a
              href={company.maps}
              className="link-arrow"
              target="_blank"
              rel="noreferrer"
            >
              Nous situer <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="zone-departments">
            {company.areas
              .map((name, i) => [String(i + 1).padStart(2, "0"), name, ""])
              .map(([n, t, d]) => (
                <div key={n}>
                  <span className="mono">{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                  <Check size={20} aria-hidden="true" />
                </div>
              ))}
          </div>
        </div>
      </section>
      <section className="company-contact wrap">
        <div>
          <MapPin />
          <span>
            {company.address}
            <br />
            {company.city}
          </span>
        </div>
        <a href={company.tel}>
          <Phone />
          {company.phone}
          <ArrowUpRight size={19} />
        </a>
        <Link href="/devis">
          Décrivez-nous votre projet
          <ArrowUpRight size={19} />
        </Link>
      </section>
      <ContactBanner />
    </main>
  );
}
