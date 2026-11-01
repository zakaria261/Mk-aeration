import { Photo } from "@/components/photo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Check } from "lucide-react";
import { company } from "@/lib/content";
import { PageIntro, SectionLabel } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
export const metadata: Metadata = {
  title: "L’entreprise",
  description:
    "Basée à Saint-Rambert-d’Albon, MK Aération installe vos systèmes de ventilation dans les départements 26, 38, 69 et 74.",
};
export default function Entreprise() {
  return (
    <main id="contenu">
      <PageIntro
        label="L’entreprise"
        title={
          <>
            LE SENS DU DÉTAIL.
            <br />
            <span className="text-blue">L’ESPRIT D’ÉQUIPE.</span>
          </>
        }
      >
        Nous sommes MK Aération. Une entreprise de réseaux aérauliques qui croit
        aux choses simples : écouter, bien préparer et bien poser.
      </PageIntro>
      <section className="container company-photo">
        <Photo
          sizes="(max-width: 1392px) 100vw, 1280px"
          src="/images/annecy-panorama.webp"
          alt="Vue d’ensemble d’un chantier de ventilation MK Aération en toiture"
          width="1800"
          height="1350"
          fetchPriority="high"
        />
        <span>DE LA TECHNIQUE. ET UNE ÉQUIPE SUR LE TERRAIN.</span>
      </section>
      <section className="section-space">
        <div className="container company-story">
          <SectionLabel>NOTRE CONVICTION</SectionLabel>
          <div>
            <h2>
              LA QUALITÉ DE L’AIR
              <br />
              COMMENCE PAR
              <br />
              <span className="text-blue">LA QUALITÉ DU GESTE.</span>
            </h2>
            <div className="company-text">
              <p>
                Un réseau aéraulique, c’est une succession de détails qui
                comptent. Un passage à anticiper. Une transition à adapter. Un
                raccordement à réaliser avec précision.
              </p>
              <p>
                Notre savoir-faire couvre la pose de gaines de ventilation
                circulaires et rectangulaires, les réseaux de soufflage et
                d’extraction, le raccordement des CTA et l’installation de VMC.
                Nous entretenons cette expertise par la formation continue et le
                travail sur le terrain.
              </p>
              <p>
                Chaque projet est l’occasion de mettre cette expérience au
                service du confort et de la qualité de l’air intérieur.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="values-section surface section-space">
        <div className="container">
          <SectionLabel>CE QUI NOUS ANIME</SectionLabel>
          <div className="values-grid">
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
              <div key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space" id="zone">
        <div className="container zone-grid">
          <div>
            <SectionLabel>PROCHES DE VOS CHANTIERS</SectionLabel>
            <h2>
              ICI, C’EST
              <br />
              <span className="text-blue">NOTRE TERRAIN.</span>
            </h2>
            <p>
              Depuis Saint-Rambert-d’Albon, nous intervenons dans quatre
              départements d’Auvergne-Rhône-Alpes.
            </p>
            <a
              href={company.maps}
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              Nous situer <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="zone-departments">
            {[
              ["26", "Drôme", "Saint-Rambert-d’Albon · Valence"],
              ["38", "Isère", "Grenoble · Vienne"],
              ["69", "Rhône", "Lyon et son agglomération"],
              ["74", "Haute-Savoie", "Annecy et ses environs"],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
                <Check size={20} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="company-contact container">
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
