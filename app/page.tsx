import { Photo } from "@/components/photo";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  Wind,
  Fan,
  CookingPot,
  MapPin,
  Check,
} from "lucide-react";
import { services, projects, company } from "@/lib/content";
import { FeaturedProject } from "@/components/featured-project";
import { ContactBanner } from "@/components/site-shell";
import { SectionLabel, ProjectCard, FAQ } from "@/components/ui";
export default function Home() {
  return (
    <main id="contenu">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="status-dot" /> RÉSEAUX AÉRAULIQUES · CTA · VMC
            </div>
            <h1>
              L’AIR SAIN.
              <br />
              LE TRAVAIL
              <br />
              <span>BIEN FAIT.</span>
            </h1>
            <p>
              <strong>
                Réseaux aérauliques, gaines de ventilation, soufflage et
                extraction.
              </strong>{" "}
              Raccordement de CTA et installation de VMC pour vos bâtiments
              tertiaires et industriels.
            </p>
            <div className="hero-actions">
              <Link href="/devis" className="button">
                Parlons de votre projet <ArrowUpRight size={21} />
              </Link>
              <a
                className="hero-phone"
                href={company.tel}
                aria-label={`Appelez MK Aération au ${company.phone}`}
              >
                <Phone size={19} />
                <span>
                  Un contact direct<strong>{company.phone}</strong>
                </span>
              </a>
            </div>
            <div className="hero-local">
              <MapPin size={16} />
              <span>
                De la Drôme aux Alpes.
                <br />
                <strong>Au plus près de vos chantiers.</strong>
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <Photo
              className="hero-photo"
              sizes="(max-width: 600px) 100vw, (max-width: 1392px) 52vw, 720px"
              src="/images/annecy-panorama.webp"
              alt="Installation de ventilation et centrale double flux réalisée par MK Aération sur une toiture à Annecy"
              width="1800"
              height="1350"
              fetchPriority="high"
            />
            <div className="hero-image-top">
              <span>LE SAVOIR-FAIRE SUR LE TERRAIN</span>
              <span className="cross-mark">+</span>
            </div>
            <svg
              className="air-lines"
              viewBox="0 0 700 600"
              fill="none"
              aria-hidden="true"
            >
              <path d="M-40 460C110 460 70 190 250 190S410 470 740 300" />
              <path d="M-40 484C130 484 85 214 250 214S425 494 740 324" />
              <path d="M-40 508C150 508 100 238 250 238S440 518 740 348" />
            </svg>
            <div className="hero-project">
              <div>
                <small>CHANTIER À LA UNE</small>
                <strong>FIER Annecy</strong>
                <span>Raccordement CTA double flux</span>
              </div>
              <Link
                href="/realisations/fier-annecy"
                aria-label="Découvrir le chantier FIER Annecy"
              >
                <ArrowUpRight size={29} />
              </Link>
            </div>
            <div className="hero-photo-index">INSTALLATION MK AÉRATION</div>
          </div>
        </div>
      </section>
      <div className="trade-strip">
        <div className="container">
          <span>
            <Wind />
            Réseaux aérauliques
          </span>
          <span>
            <Fan />
            CTA & VMC
          </span>
          <span>
            <CookingPot />
            Soufflage & extraction
          </span>
          <span className="strip-last">
            <MapPin />
            26 · 38 · 69 · 74
          </span>
        </div>
      </div>
      <section className="expertise-home section-space">
        <div className="container">
          <SectionLabel number="01 / 04">NOTRE MÉTIER</SectionLabel>
          <div className="section-heading">
            <h2>
              À CHAQUE BÂTIMENT,
              <br />
              SON <span className="text-blue">SOUFFLE.</span>
            </h2>
            <p>
              Gaines circulaires et rectangulaires, réseaux de soufflage et
              d’extraction, CTA et VMC : nous adaptons la pose aux contraintes
              de chaque bâtiment tertiaire, industriel ou professionnel.
            </p>
          </div>
          <div className="expertise-grid">
            <div className="service-list">
              {services.map((s) => (
                <Link key={s.id} href={`/expertises#${s.id}`}>
                  <span className="service-number">{s.number}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.short}</p>
                  </div>
                  <ArrowUpRight size={25} />
                </Link>
              ))}
              <Link href="/expertises" className="text-link all-services">
                Découvrir nos expertises <ArrowRight size={19} />
              </Link>
            </div>
            <div className="expertise-photo">
              <Photo
                src="/images/grenoble-gaines-rectangulaires.webp"
                alt="Gaines aérauliques rectangulaires installées dans les réservations de la toiture à Grenoble"
                width="1000"
                height="1000"
                loading="lazy"
              />
              <span>
                <span className="status-dot" /> LA PRÉCISION, JUSQUE DANS LES
                DÉTAILS.
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="projects-home section-space">
        <div className="container">
          <SectionLabel number="02 / 04" light>
            NOS RÉALISATIONS
          </SectionLabel>
          <div className="section-heading">
            <h2>
              DU CONCRET.
              <br />
              SUR LE TERRAIN.
            </h2>
            <div>
              <p>
                Des installations réelles. Des contraintes résolues. Découvrez
                le travail de nos équipes sur les chantiers.
              </p>
              <Link className="text-link" href="/realisations">
                Tous nos chantiers <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
          <FeaturedProject />
          <div className="projects-grid">
            {projects
              .filter((p) =>
                ["htc-la-boisse", "yottacity", "fier-annecy"].includes(p.slug),
              )
              .map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i + 1} />
              ))}
          </div>
        </div>
      </section>
      <section className="about-home section-space">
        <div className="container about-home-grid">
          <div className="about-visual">
            <Photo
              src="/images/annecy-cta.webp"
              alt="Réseau de ventilation installé en toiture par MK Aération"
              width="1000"
              height="1000"
              loading="lazy"
            />
            <div className="about-photo-note">
              <Wind size={32} />
              <span>
                LE GOÛT DU
                <br />
                <strong>TRAVAIL BIEN FAIT.</strong>
              </span>
            </div>
          </div>
          <div className="about-copy">
            <SectionLabel number="03 / 04">L’ESPRIT MK AÉRATION</SectionLabel>
            <h2>
              UNE ÉQUIPE.
              <br />
              UN MÉTIER.
              <br />
              <span className="text-blue">DE L’ENGAGEMENT.</span>
            </h2>
            <p>
              Chez MK Aération, la qualité de l’air commence par la qualité de
              la pose. Nous mettons notre savoir-faire au service des projets de
              ventilation, avec une attention portée à chaque raccordement.
            </p>
            <p>
              Basés à Saint-Rambert-d’Albon, nous accompagnons vos chantiers
              dans la Drôme, l’Isère, le Rhône et la Haute-Savoie.
            </p>
            <div className="about-points">
              <span>
                <Check size={17} /> Une expertise de terrain
              </span>
              <span>
                <Check size={17} /> Un interlocuteur à votre écoute
              </span>
              <span>
                <Check size={17} /> Des solutions adaptées au chantier
              </span>
            </div>
            <Link href="/entreprise" className="text-link">
              Découvrir l’entreprise <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>
      <section className="region-section">
        <div className="container region-layout">
          <div>
            <SectionLabel number="04 / 04">NOTRE TERRAIN D’ACTION</SectionLabel>
            <h2>
              ANCRÉS DANS LA DRÔME.
              <br />
              MOBILES DANS LA RÉGION.
            </h2>
            <p>
              Votre chantier se situe dans l’un de ces départements ?<br />
              Faisons le point sur vos besoins.
            </p>
            <Link className="text-link" href="/devis">
              Étudier mon projet <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="region-list">
            {[
              ["26", "Drôme"],
              ["38", "Isère"],
              ["69", "Rhône"],
              ["74", "Haute-Savoie"],
            ].map(([n, name]) => (
              <div key={n}>
                <span>{n}</span>
                <strong>{name}</strong>
                <ArrowUpRight size={20} />
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
