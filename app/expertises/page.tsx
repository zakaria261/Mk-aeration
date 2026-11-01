import { Photo } from "@/components/photo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { services } from "@/lib/content";
import { PageIntro, SectionLabel, FAQ } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
export const metadata: Metadata = {
  title: "Nos expertises",
  description:
    "Réseaux aérauliques et gaines de ventilation : pose de réseaux de soufflage et d’extraction, raccordement CTA, installation VMC et grilles de diffusion.",
};
export default function Expertises() {
  return (
    <main id="contenu">
      <PageIntro
        label="Expertises"
        title={
          <>
            L’AIR CIRCULE.
            <br />
            <span className="text-blue">LE SAVOIR-FAIRE AUSSI.</span>
          </>
        }
      >
        Pose de réseaux aérauliques et de gaines de ventilation, réseaux de
        soufflage et d’extraction, CTA et VMC : notre savoir-faire accompagne
        chaque étape de l’installation.
      </PageIntro>
      <div className="container expertise-anchor-nav">
        {services.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            <span>{s.number}</span>
            {s.title}
            <ArrowRight size={16} />
          </a>
        ))}
      </div>
      {services.map((s, i) => (
        <section
          className={`service-detail section-space ${i % 2 ? "surface" : ""}`}
          id={s.id}
          key={s.id}
        >
          <div className="container service-detail-grid">
            <div className="service-detail-photo">
              <Photo
                src={s.image}
                alt={s.alt}
                width="1000"
                height="1000"
                loading="lazy"
              />
              <span>EXPERTISE / {s.number}</span>
            </div>
            <div>
              <SectionLabel>NOTRE SAVOIR-FAIRE</SectionLabel>
              <h2>{s.title.toUpperCase()}</h2>
              <h3>{s.short}</h3>
              <p>{s.description}</p>
              <ul className="check-list">
                {s.details.map((d) => (
                  <li key={d}>
                    <Check size={17} />
                    {d}
                  </li>
                ))}
              </ul>
              <Link className="button" href={`/devis?service=${s.id}`}>
                Parlons de votre installation <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      ))}
      <section className="process-section section-space">
        <div className="container">
          <SectionLabel>DU BESOIN AU CHANTIER</SectionLabel>
          <h2>ON AVANCE ENSEMBLE.</h2>
          <div className="process-grid">
            {[
              [
                "01",
                "On échange",
                "Vous nous expliquez votre besoin, votre bâtiment et les contraintes du projet.",
              ],
              [
                "02",
                "On étudie",
                "Nous précisons les éléments techniques et le périmètre de notre intervention.",
              ],
              [
                "03",
                "On réalise",
                "Notre équipe installe les réseaux et effectue les raccordements prévus.",
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
      <FAQ />
      <ContactBanner />
    </main>
  );
}
