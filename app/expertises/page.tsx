import { Photo } from "@/components/photo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { services, projects } from "@/lib/content";
import { ProjectVideo } from "@/components/project-video";
import { PageIntro, SectionLabel, FAQ } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
import { DuctSymbol } from "@/components/drawing";

export const metadata: Metadata = {
  title: "Nos expertises",
  description:
    "Réseaux aérauliques et gaines de ventilation : pose de réseaux de soufflage et d’extraction, raccordement CTA, installation VMC et grilles de diffusion.",
};

const symbols = { reseaux: "round", vmc: "unit", extraction: "supply" } as const;

export default function Expertises() {
  const hotte = projects.find((p) => p.slug === "pose-hotte-cuisine-professionnelle")!;
  return (
    <main id="contenu">
      <PageIntro
        label="Expertises"
        title={
          <>
            L’air circule.
            <br />
            <em>Le savoir-faire aussi.</em>
          </>
        }
      >
        Pose de réseaux aérauliques et de gaines de ventilation, réseaux de
        soufflage et d’extraction, CTA et VMC : notre savoir-faire accompagne
        chaque étape de l’installation.
      </PageIntro>

      <nav className="wrap anchors" aria-label="Nos trois métiers">
        {services.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            <span className="mono">{s.number}</span>
            {s.title}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        ))}
      </nav>

      {services.map((s, i) => (
        <section
          className={`service section ${i % 2 ? "surface" : ""}`}
          id={s.id}
          key={s.id}
          aria-labelledby={`${s.id}-title`}
        >
          <div className={`wrap service-grid ${i % 2 ? "is-flipped" : ""}`}>
            <figure className="service-photo">
              <Photo
                src={s.image}
                alt={s.alt}
                width="1000"
                height="1000"
                loading={i === 0 ? "eager" : "lazy"}
                sizes="(max-width: 1080px) 100vw, 48vw"
              />
              <figcaption className="mono">Photo de chantier · Rep. {s.number}</figcaption>
            </figure>
            <div className="service-copy">
              <div className="service-symbol">
                <DuctSymbol kind={symbols[s.id as keyof typeof symbols]} size={52} />
                <span className="mono">Rep. {s.number}</span>
              </div>
              <h2 id={`${s.id}-title`}>{s.title}</h2>
              <p className="service-lead">{s.short}</p>
              <p>{s.description}</p>
              <ul className="checks">
                {s.details.map((d) => (
                  <li key={d}>
                    <Check size={17} aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="service-actions">
                <Link className="btn btn-primary" href={`/devis?service=${s.id}`}>
                  Parlons de votre installation <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
                {s.id === "vmc" && (
                  <Link className="link-arrow" href="/realisations/rehabilitation-vmc-21-appartements">
                    La réhabilitation de 21 appartements <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                )}
                {s.id === "extraction" && (
                  <a className="link-arrow" href="#hottes-professionnelles">
                    La pose d’une hotte en vidéo <ArrowRight size={17} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="film-feature section" id="hottes-professionnelles" aria-labelledby="hotte-title">
        <div className="wrap film-lead">
          <ProjectVideo video={hotte.video!} />
          <div className="film-copy">
            <SectionLabel>Cuisines professionnelles</SectionLabel>
            <h2 id="hotte-title">
              La pose d’une hotte,
              <br />
              <em>sur le terrain.</em>
            </h2>
            <p>{hotte.description}</p>
            <ul className="checks">
              {hotte.scope.map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="service-actions">
              <Link className="btn btn-light" href="/devis?service=extraction">
                Votre projet de hotte <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="link-arrow" href={`/realisations/${hotte.slug}`}>
                Voir cette intervention <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="process section" aria-labelledby="process-title">
        <div className="wrap">
          <SectionLabel>Du besoin au chantier</SectionLabel>
          <h2 id="process-title">On avance ensemble.</h2>
          <ol className="steps">
            {[
              ["On échange", "Vous nous expliquez votre besoin, votre bâtiment et les contraintes du projet."],
              ["On étudie", "Nous précisons les éléments techniques et le périmètre de notre intervention."],
              ["On réalise", "Notre équipe installe les réseaux et effectue les raccordements prévus."],
            ].map(([t, d], i) => (
              <li key={t}>
                <span className="mono">Étape {String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <FAQ />
      <ContactBanner />
    </main>
  );
}
