import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Fragment } from "react";
import { Photo } from "./photo";
import { ContactForm } from "./contact-form";
import {
  companyLinks,
  defaultSiteContent,
  type SiteContent,
} from "@/lib/site-content";
import { FAQ } from "./ui";
import { NewsCard } from "./news-card";
import { type Project } from "@/lib/content";
import {
  companyPresentation,
  companySignature,
  defaultHomeContent,
  homePhotos,
  type HomeContent,
} from "@/lib/home-content";
import type { TeamPost } from "@/lib/cms-types";

export function PublicHome({
  content,
  references,
  news,
  settings = defaultSiteContent,
  preview = false,
}: {
  content: HomeContent;
  references: Project[];
  news: TeamPost[];
  settings?: SiteContent;
  preview?: boolean;
}) {
  const company = companyLinks(settings.company);
  const services = settings.services.filter((s) => s.published);
  const photo = settings.home.heroImage
    ? { ...settings.home.heroImage, label: settings.home.heroImage.alt }
    : homePhotos.find((item) => item.src === content.heroImage) ||
      homePhotos[0];
  const suppliedHero = [
    "/images/mk-aeration-hero.webp",
    "/images/mk-aeration-hero-landscape.webp",
  ].includes(photo.src);
  const heroPhoto = suppliedHero ? homePhotos[0] : photo;
  const originalPoster =
    suppliedHero &&
    content.heroTitle === defaultHomeContent.heroTitle &&
    content.heroAccent === defaultHomeContent.heroAccent &&
    content.heroDescription === defaultHomeContent.heroDescription;
  const selection = references
    .filter(
      (p) =>
        p.slug !== "pose-hotte-cuisine-professionnelle" &&
        p.slug !== "tunnel-du-mont-blanc" &&
        (p.coverKind === "chantier" ||
          p.media.some((m) => m.kind === "chantier")),
    )
    .slice(0, 3);
  const sections = {
    about: (
      <section
        className="lp-about lp-section"
        id="entreprise"
        aria-labelledby="about-title"
      >
        <div className="lp-container">
          <div className="lp-section-kicker">
            <span>01 / L’entreprise</span>
            <span>La précision, par nature.</span>
          </div>
          <div className="lp-about-grid">
            <div className="lp-about-visual">
              <figure className="lp-about-photo">
                <Photo
                  src="/images/htc-la-boisse-descentes.webp"
                  alt="Gaines et descentes de ventilation installées par MK Aération sur le chantier HTC La Boisse"
                  width={1152}
                  height={1536}
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 44vw"
                />
                <figcaption>
                  <span className="lp-photo-dot" /> Sur le terrain · HTC La
                  Boisse
                </figcaption>
              </figure>
              <div className="lp-since">
                <span>Le savoir-faire</span>
                <strong>MK.</strong>
                <span>Depuis 2021</span>
              </div>
            </div>
            <div className="lp-about-copy">
              <p className="lp-eyebrow">L’exigence à chaque étape</p>
              <h2 id="about-title">
                {content.benefitsTitle === defaultHomeContent.benefitsTitle ? (
                  <>
                    Le savoir-faire de terrain.
                    <br />
                    <span>L’exigence du détail.</span>
                  </>
                ) : (
                  content.benefitsTitle
                )}
              </h2>
              <div className="lp-company-text">
                <p>{content.benefitsIntro}</p>
                {companyPresentation.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="lp-company-signature">{companySignature}</p>
              {settings.credentials
                .filter((v) => v.published && v.confirmed)
                .map((v) => (
                  <p className="verified-credential" key={v.title}>
                    {v.title}
                  </p>
                ))}
              {settings.testimonials
                .filter((v) => v.published && v.authorized)
                .map((v) => (
                  <blockquote className="verified-testimonial" key={v.author}>
                    <p>{v.quote}</p>
                    <cite>{v.author}</cite>
                  </blockquote>
                ))}
              <Link href="/entreprise" className="lp-text-link">
                Découvrir MK Aération{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    proof: (
      <section
        className="lp-proof"
        aria-label="MK Aération en quelques repères"
      >
        <div className="lp-container lp-proof-grid">
          {settings.credibility
            .filter((c) => c.published && c.confirmed)
            .map((c) => (
              <div key={c.label}>
                <strong>{c.value}</strong>
                <span>{c.label}</span>
              </div>
            ))}
        </div>
      </section>
    ),
    flagship: (
      <section className="lp-flagship lp-section" aria-labelledby="mont-title">
        <div className="lp-container">
          <div className="lp-section-kicker">
            <span>02 / Une référence emblématique</span>
            <span>France — Italie</span>
          </div>
          <div className="lp-flagship-grid">
            <figure className="lp-flagship-photo">
              <div className="lp-flagship-image">
                <Photo
                  src="/images/mont-blanc-entree.webp"
                  alt="L’entrée française du tunnel du Mont-Blanc à Chamonix, photographiée par Rémih"
                  width={1600}
                  height={1200}
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 56vw"
                />
                <span className="lp-image-tag">
                  Infrastructures · Haute-Savoie
                </span>
              </div>
              <figcaption>
                Vue de l’ouvrage ·{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Tunnel_du_Mont-Blanc_entr%C3%A9e_nord.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Rémih
                </a>{" "}
                ·{" "}
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY-SA 4.0
                </a>{" "}
                · format optimisé
              </figcaption>
            </figure>
            <div className="lp-flagship-copy">
              <p className="lp-eyebrow">L’expertise en conditions exigeantes</p>
              <h2 id="mont-title">
                Tunnel du
                <br />
                <span>Mont-Blanc.</span>
              </h2>
              <p>
                Un ouvrage singulier. Des contraintes bien réelles. Pendant huit
                mois, MK Aération est intervenue au cœur du tunnel du
                Mont-Blanc.
              </p>
              <ul className="lp-scope">
                <li>
                  <Check size={16} aria-hidden="true" /> Ventilation d’un local
                  électrique
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> Réseaux PVC et
                  préparation du supportage
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> Interventions de nuit
                  dans les zones techniques
                </li>
              </ul>
              <div className="lp-flagship-fact">
                <strong>
                  8 <span>mois</span>
                </strong>
                <p>
                  de travaux sur une
                  <br />
                  infrastructure transalpine
                </p>
              </div>
              <Link
                href="/realisations/tunnel-du-mont-blanc"
                className="lp-text-link"
              >
                Découvrir notre intervention{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    projects: (
      <section
        className="lp-section lp-projects"
        id="realisations"
        aria-labelledby="projects-title"
      >
        <div className="lp-container">
          <div className="lp-section-head">
            <div>
              <p className="lp-eyebrow">Des projets, des preuves</p>
              <h2 id="projects-title">
                Notre savoir-faire.
                <br />
                <span>Sur le terrain.</span>
              </h2>
            </div>
            <div className="lp-section-aside">
              <p>
                Des réseaux installés, des contraintes maîtrisées.
                <br />
                Découvrez le travail de nos équipes en images.
              </p>
              <Link href="/realisations" className="lp-text-link">
                Toutes nos réalisations{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="lp-project-grid">
            {selection.map((p, i) => {
              const actual =
                p.coverKind !== "chantier"
                  ? p.media.find((m) => m.kind === "chantier")
                  : undefined;
              return (
                <Link
                  className="lp-project"
                  href={`/realisations/${p.slug}`}
                  key={p.slug}
                >
                  <div className="lp-project-photo">
                    <Photo
                      src={actual?.src || p.image}
                      alt={actual?.alt || p.alt}
                      width={actual?.width || p.imageWidth || 900}
                      height={actual?.height || p.imageHeight || 900}
                      loading="lazy"
                      sizes="(max-width: 767px) 100vw, 33vw"
                      style={{ objectPosition: p.imagePosition }}
                    />
                    <span className="lp-image-tag">{p.sector}</span>
                    <span className="lp-project-open">
                      <ArrowUpRight size={23} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="lp-project-body">
                    <p>
                      <span>0{i + 1}</span>
                      {p.category}
                    </p>
                    <h3>{p.title}</h3>
                    <span>
                      <MapPin size={13} aria-hidden="true" />
                      {p.place}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    ),
    services: (
      <section
        className="lp-services lp-section"
        id="expertises"
        aria-labelledby="services-title"
      >
        <div className="lp-container">
          <div className="lp-section-head">
            <div>
              <p className="lp-eyebrow">03 / Nos expertises</p>
              <h2 id="services-title">
                Une vision d’ensemble.
                <br />
                <span>La précision en détail.</span>
              </h2>
            </div>
            <p>
              Du réseau aéraulique au raccordement des équipements, un
              savoir-faire technique au service de votre installation.
            </p>
          </div>
          <div className="lp-service-grid">
            {services.map((s, i) => (
              <Link
                className="lp-service"
                href={`/expertises/${s.id}`}
                key={s.id}
              >
                <div className="lp-service-photo">
                  <Photo
                    src={s.image.src}
                    alt={s.image.alt}
                    width={s.image.width}
                    height={s.image.height}
                    sizes="(max-width: 767px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <span>0{i + 1}</span>
                </div>
                <div className="lp-service-body">
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                  <span className="lp-card-link">
                    Explorer cette expertise{" "}
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="lp-project-prompt">
            <div>
              <span className="lp-photo-dot" />
              <p>
                Un projet neuf ou une réhabilitation ?
                <strong>Construisons la bonne solution ensemble.</strong>
              </p>
            </div>
            <Link href="/devis" className="lp-text-link">
              Étudier mon projet <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    ),
    news: news.length > 0 && (
      <section className="lp-section lp-news" aria-labelledby="news-title">
        <div className="lp-container">
          <div className="lp-section-head">
            <div>
              <p className="lp-eyebrow">La vie de l’entreprise</p>
              <h2 id="news-title">Le carnet de chantier.</h2>
            </div>
            <Link href="/actualites" className="lp-text-link">
              Toutes les actualités{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="log-list">
            {news.slice(0, 2).map((post) => (
              <NewsCard post={post} key={post.id} />
            ))}
          </div>
        </div>
      </section>
    ),
    faq: <FAQ phone={company.phone} tel={company.tel} />,
    contact: (
      <section
        className="lp-contact"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="lp-container lp-contact-grid">
          <div className="lp-contact-copy">
            <p className="lp-eyebrow">Passons au concret</p>
            <h2 id="contact-title">{content.contactTitle}</h2>
            <p>{content.contactDescription}</p>
            <div className="lp-contact-details">
              <a className="lp-contact-direct" href={company.tel}>
                <span>
                  <Phone size={20} aria-hidden="true" />
                </span>
                <div>
                  <small>Un échange direct avec notre équipe</small>
                  {company.phone}
                </div>
                <ArrowUpRight size={21} aria-hidden="true" />
              </a>
              <a className="lp-contact-mail" href={`mailto:${company.email}`}>
                <Mail size={17} aria-hidden="true" />
                {company.email}
              </a>
            </div>
            <p className="lp-contact-location">
              <MapPin size={17} aria-hidden="true" />
              {company.city}
              <br />
              {company.areas.join(" · ")}
            </p>
          </div>
          <div className="lp-contact-form">
            <p className="lp-form-heading">
              Présentez-nous votre projet{" "}
              <ArrowUpRight size={20} aria-hidden="true" />
            </p>
            <ContactForm preview={preview} />
          </div>
        </div>
      </section>
    ),
  };
  return (
    <main id="contenu" className="landing">
      <section
        className={`lp-hero ${originalPoster ? "lp-hero-original-mobile" : ""}`}
        aria-labelledby="hero-title"
      >
        <picture className="lp-hero-backdrop">
          {originalPoster && (
            <source
              media="(max-width: 767px)"
              srcSet="/images/mk-aeration-hero-480.webp 480w, /images/mk-aeration-hero.webp 720w"
              sizes="100vw"
            />
          )}
          <Photo
            className="lp-hero-background"
            src={heroPhoto.src}
            alt={originalPoster ? "" : heroPhoto.alt}
            width={heroPhoto.width}
            height={heroPhoto.height}
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
        </picture>
        <div className="lp-hero-shade" aria-hidden="true" />
        <div className="lp-container lp-hero-content">
          <div className="lp-hero-message">
            <span className="lp-hero-tricolor" aria-hidden="true" />
            <h1 id="hero-title">
              {content.heroTitle === defaultHomeContent.heroTitle ? (
                <>
                  L’expertise
                  <br />
                  des réseaux
                </>
              ) : (
                content.heroTitle
              )}
              <span>{content.heroAccent}</span>
            </h1>
            <span className="lp-hero-rule" aria-hidden="true" />
            <p className="lp-hero-description">{content.heroDescription}</p>
          </div>
          <div className="lp-hero-conversion">
            <p className="lp-hero-signature">
              La maîtrise de l’air,
              <br />
              <span>au service de vos projets.</span>
            </p>
            <div className="lp-hero-actions">
              <Link
                href="/expertises"
                className="lp-hero-primary"
                aria-label="Découvrir nos solutions"
              >
                Découvrir nos solutions{" "}
                <ArrowRight size={22} aria-hidden="true" />
              </Link>
              <Link href="/devis" className="lp-hero-secondary">
                {settings.home.primaryLabel}{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <a
          className="lp-hero-scroll"
          href="#entreprise"
          aria-label="Découvrir MK Aération"
        >
          <ArrowDown size={21} aria-hidden="true" />
        </a>
        <svg
          className="lp-hero-wave"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 43C400 146 900 100 1440 0V100H0Z"
            fill="#0799df"
            opacity=".6"
          />
          <path d="M0 64C440 132 915 120 1440 18V100H0Z" fill="#0961ba" />
          <path d="M0 83C480 130 1050 112 1440 51V100H0Z" fill="#084b95" />
        </svg>
      </section>
      <div className="lp-trades" aria-label="Nos domaines d’intervention">
        <div className="lp-container">
          <span>
            La maîtrise de l’air,
            <br />
            <strong>à chaque échelle.</strong>
          </span>
          <p>Réseaux aérauliques</p>
          <span className="lp-trades-plus" aria-hidden="true">
            +
          </span>
          <p>Traitement d’air</p>
          <span className="lp-trades-plus" aria-hidden="true">
            +
          </span>
          <p>Ventilation mécanique</p>
        </div>
      </div>
      {settings.home.sections.map((key) => (
        <Fragment key={key}>{sections[key]}</Fragment>
      ))}
    </main>
  );
}
