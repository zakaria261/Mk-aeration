import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Phone,
} from "lucide-react";
import { Fragment } from "react";
import { Photo } from "./photo";
import { ContactForm } from "./contact-form";
import { PageMotion } from "./page-motion";
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
  homeSectors,
  type HomeContent,
} from "@/lib/home-content";
import type { TeamPost } from "@/lib/cms-types";

function Emphasis({ text }: { text: string }) {
  return text
    .split("**")
    .map((part, i) =>
      i % 2 ? (
        <strong key={i}>{part}</strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );
}

export function PublicHome({
  content,
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
  const photo = settings.home.heroImage
    ? { ...settings.home.heroImage, label: settings.home.heroImage.alt }
    : homePhotos.find((item) => item.src === content.heroImage) ||
      homePhotos[0];
  const suppliedHero = [
    "/images/mk-aeration-hero.webp",
    "/images/mk-aeration-hero-landscape.webp",
  ].includes(photo.src);
  const heroPhoto = suppliedHero
    ? homePhotos.find(
        (item) => item.src === "/images/mk-aeration-hero-landscape.webp",
      )!
    : photo;
  const originalPoster =
    suppliedHero &&
    content.heroTitle === defaultHomeContent.heroTitle &&
    content.heroAccent === defaultHomeContent.heroAccent &&
    content.heroDescription === defaultHomeContent.heroDescription;
  const sections = {
    about: (
      <section
        className="lp-about lp-section"
        id="entreprise"
        aria-labelledby="about-title"
      >
        <div className="lp-container">
          <div className="lp-about-copy" data-reveal="0">
            <div className="lp-about-title">
              <h2 id="about-title">
                {content.benefitsTitle === defaultHomeContent.benefitsTitle ? (
                  <>
                    Le savoir‑faire de terrain.
                    <br />
                    <span>L’exigence du détail.</span>
                  </>
                ) : (
                  content.benefitsTitle
                )}
              </h2>
            </div>
            <div className="lp-about-body">
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
              <Link href="/entreprise" className="lp-cta">
                Découvrir MK Aération
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    // La clé « proof » est conservée pour l’ordre des sections déjà enregistré :
    // elle affiche désormais les secteurs d’activité (sans chiffres clés).
    proof: (
      <section
        className="lp-sectors lp-section"
        id="secteurs"
        aria-label="Nos secteurs d’activité"
      >
        <div className="lp-container">
          <div className="lp-sector-list">
            {homeSectors.map((s) => (
              <article
                className="lp-sector"
                id={s.id}
                key={s.id}
                aria-labelledby={`sector-${s.id}`}
              >
                <div className="lp-sector-copy" data-reveal="0">
                  <h3 id={`sector-${s.id}`}>{s.title}</h3>
                  {s.paragraphs.map((text) => (
                    <p className="lp-sector-text" key={text}>
                      <Emphasis text={text} />
                    </p>
                  ))}
                  <a href="#contact" className="lp-cta">
                    Contactez-nous
                  </a>
                </div>
                <figure className="lp-sector-photo" data-reveal="100">
                  <Photo
                    src={s.image.src}
                    alt={s.image.alt}
                    width={s.image.width}
                    height={s.image.height}
                    loading="lazy"
                    sizes="(max-width: 767px) 100vw, 46vw"
                  />
                  <figcaption>
                    <Link href={s.caption.href}>{s.caption.label}</Link>
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    flagship: (
      <section className="lp-flagship lp-section" aria-labelledby="mont-title">
        <div className="lp-container">
          <div className="lp-flagship-grid">
            <figure className="lp-flagship-photo" data-reveal="0">
              <div className="lp-flagship-image">
                <Photo
                  src="/images/mont-blanc-presentation.webp"
                  alt="Entrée du tunnel du Mont-Blanc au pied des Alpes, visuel de présentation MK Aération"
                  width={1461}
                  height={720}
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 56vw"
                />
              </div>
            </figure>
            <div className="lp-flagship-copy" data-reveal="100">
              <div className="lp-flagship-title">
                <h2 id="mont-title">
                  Tunnel du
                  <br />
                  <span>Mont-Blanc.</span>
                </h2>
              </div>
              <div className="lp-flagship-detail">
                <p>
                  Un ouvrage singulier. Des contraintes bien réelles. Pendant
                  huit mois, MK Aération est intervenue au cœur du tunnel du
                  Mont-Blanc.
                </p>
                <ul className="lp-scope">
                  <li>
                    <Check size={16} aria-hidden="true" /> Ventilation d’un
                    local électrique
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
                  className="lp-cta"
                >
                  Découvrir notre intervention
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
    // Réalisations et expertises : présentées sur leurs propres pages.
    projects: null,
    services: null,
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
              <NewsCard post={post} key={post.id} showImage={false} />
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
          <div className="lp-contact-copy" data-reveal="0">
            <h2 id="contact-title">{content.contactTitle}</h2>
            <p className="lp-contact-lead">
              <strong>
                Réseaux aérauliques, CTA, VMC, soufflage ou extraction ?
              </strong>{" "}
              {content.contactDescription}
            </p>
            <dl className="lp-contact-list">
              <div>
                <dt>Téléphone</dt>
                <dd>
                  <a className="lp-contact-phone" href={company.tel}>
                    {company.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </dd>
              </div>
              <div>
                <dt>Adresse</dt>
                <dd>
                  <a href={company.maps} target="_blank" rel="noreferrer">
                    {company.address}
                    <br />
                    {company.city}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Zone d’intervention</dt>
                <dd>{company.areas.join(" · ")}</dd>
              </div>
            </dl>
            <a className="lp-contact-call" href={company.tel}>
              <Phone size={17} aria-hidden="true" />
              Appeler MK Aération
            </a>
          </div>
          <div className="lp-contact-form" data-reveal="100">
            <ContactForm preview={preview} />
          </div>
        </div>
      </section>
    ),
  };
  return (
    <main id="contenu" className="landing">
      <PageMotion />
      <section
        className={`lp-hero ${suppliedHero ? "lp-hero-photo-hd" : ""} ${originalPoster ? "lp-hero-original-mobile" : ""}`}
        aria-labelledby="hero-title"
      >
        <picture className="lp-hero-backdrop">
          {originalPoster && (
            <source
              media="(max-width: 767px)"
              srcSet="/images/mk-aeration-hero-480.webp 480w, /images/mk-aeration-hero-800.webp 800w, /images/mk-aeration-hero.webp 900w"
              sizes="100vw"
            />
          )}
          <Photo
            className="lp-hero-background"
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            width={heroPhoto.width}
            height={heroPhoto.height}
            loading="eager"
            fetchPriority="high"
            sizes={suppliedHero ? "(min-width: 768px) 72vw, 100vw" : "100vw"}
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
      {settings.home.sections.map((key) => (
        <Fragment key={key}>{sections[key]}</Fragment>
      ))}
    </main>
  );
}
