import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MapPin, Phone } from "lucide-react";
import { Photo } from "./photo";
import { ContactForm } from "./contact-form";
import { Fragment } from "react";
import {
  companyLinks,
  defaultSiteContent,
  type SiteContent,
} from "@/lib/site-content";
import { FAQ } from "./ui";
import { NewsCard } from "./news-card";
import { type Project } from "@/lib/content";
import { homePhotos, type HomeContent } from "@/lib/home-content";
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
      homePhotos[1];
  const selection = references
    .filter(
      (p) =>
        p.coverKind === "chantier" &&
        p.slug !== "pose-hotte-cuisine-professionnelle",
    )
    .slice(0, 3);
  const sections = {
    proof: (
      <section className="lp-proof" aria-label="Des références concrètes">
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
        <div className="lp-container lp-flagship-grid">
          <figure className="lp-flagship-photo">
            <Photo
              src="/images/mont-blanc-presentation.webp"
              alt="Tunnel du Mont-Blanc — visuel de présentation fourni par MK Aération"
              width={1461}
              height={720}
              loading="lazy"
              sizes="(max-width: 767px) calc(100vw - 40px), 57vw"
            />
            <figcaption>
              Visuel de présentation fourni par MK Aération.
            </figcaption>
          </figure>
          <div className="lp-flagship-copy">
            <p className="lp-eyebrow">France / Italie</p>
            <h2 id="mont-title">Tunnel du Mont-Blanc</h2>
            <p>
              Huit mois de travaux : ventilation d’un local électrique,
              conduites PVC et supportage, avec des interventions de nuit.
            </p>
            <Link
              href="/realisations/tunnel-du-mont-blanc"
              className="lp-text-link"
            >
              Voir le chantier <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
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
              <h2 id="services-title">Nos expertises</h2>
            </div>
          </div>
          <div className="lp-service-grid">
            {services.map((s) => {
              return (
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
                      sizes="(max-width: 767px) 120px, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="lp-service-body">
                    <h3>{s.title}</h3>
                    <p>{s.short}</p>
                    <span className="lp-card-link">
                      Découvrir <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="lp-project-prompt">
            <p>Une installation à prévoir ?</p>
            <div>
              <Link href="/devis" className="lp-button">
                Demander un devis <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <a href={company.tel} className="lp-prompt-phone">
                <Phone size={17} aria-hidden="true" />
                {company.phone}
              </a>
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
              <h2 id="projects-title">Nos réalisations</h2>
            </div>
            <Link href="/realisations" className="lp-text-link">
              Toutes nos réalisations{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="lp-project-grid">
            {selection.map((p) => (
              <Link
                className="lp-project"
                href={`/realisations/${p.slug}`}
                key={p.slug}
              >
                <div className="lp-project-photo">
                  <Photo
                    src={p.image}
                    alt={p.alt}
                    width={p.imageWidth || 900}
                    height={p.imageHeight || 900}
                    loading="lazy"
                    sizes="(max-width: 767px) calc(100vw - 40px), 33vw"
                    style={{ objectPosition: p.imagePosition }}
                  />
                </div>
                <div className="lp-project-body">
                  <p>{p.category}</p>
                  <h3>{p.title}</h3>
                  <span>{p.place}</span>
                  <ArrowUpRight size={23} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    ),
    about: (
      <section className="lp-about lp-section" aria-labelledby="about-title">
        <div className="lp-container lp-about-grid">
          <figure className="lp-about-photo">
            <Photo
              src="/images/htc-la-boisse-descentes.webp"
              alt="Réseaux de ventilation posés sur le chantier HTC La Boisse"
              width={1152}
              height={1536}
              loading="lazy"
              sizes="(max-width: 767px) calc(100vw - 40px), 45vw"
            />
            <figcaption>HTC La Boisse · Réseaux aérauliques</figcaption>
          </figure>
          <div className="lp-about-copy">
            <h2 id="about-title">{content.benefitsTitle}</h2>
            <p>{content.benefitsIntro}</p>
            <ul className="lp-about-points">
              <li>
                <Check size={19} aria-hidden="true" />
                <span>Supportage et raccordements soignés</span>
              </li>
              <li>
                <Check size={19} aria-hidden="true" />
                <span>Coordination avec les autres corps de métier</span>
              </li>
              <li>
                <Check size={19} aria-hidden="true" />
                <span>Un interlocuteur direct</span>
              </li>
            </ul>
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
              Découvrir l’entreprise{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <div className="lp-about-location">
              <MapPin size={19} aria-hidden="true" />
              <p>{company.city}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    news: news.length > 0 && (
      <section className="lp-section lp-news" aria-labelledby="news-title">
        <div className="lp-container">
          <div className="lp-section-head">
            <div>
              <h2 id="news-title">Actualités</h2>
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
      <section className="lp-contact" aria-labelledby="contact-title">
        <div className="lp-container lp-contact-grid">
          <div>
            <h2 id="contact-title">{content.contactTitle}</h2>
            <p>{content.contactDescription}</p>
            <a className="lp-contact-direct" href={company.tel}>
              <Phone size={20} aria-hidden="true" />
              {company.phone}
            </a>
          </div>
          <ContactForm preview={preview} />
        </div>
      </section>
    ),
  };
  return (
    <main id="contenu" className="landing">
      <section
        className={`lp-hero ${photo.src.includes("mont-blanc") ? "lp-hero-presentation" : ""}`}
        aria-labelledby="hero-title"
      >
        <picture>
          {photo.src === "/images/annecy-panorama.webp" && (
            <source
              type="image/avif"
              srcSet="/images/annecy-panorama-480.avif 480w, /images/annecy-panorama-800.avif 800w, /images/annecy-panorama-1800.avif 1800w"
              sizes="100vw"
            />
          )}
          <Photo
            className="lp-hero-background"
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
        </picture>
        <div className="lp-container lp-hero-inner">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">MK Aération · De la Drôme aux Alpes</p>
            <h1 id="hero-title">
              {content.heroTitle}
              <br />
              <span>{content.heroAccent}</span>
            </h1>
            <p className="lp-hero-description">{content.heroDescription}</p>
            <div className="lp-actions">
              <Link href="/devis" className="lp-button">
                {settings.home.primaryLabel}{" "}
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <Link href="#realisations" className="lp-hero-link">
                {settings.home.secondaryLabel}{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="lp-hero-caption">
            <span>
              {photo.src.includes("mont-blanc")
                ? "Visuel de présentation"
                : "Photo de chantier"}
            </span>
            <strong>{photo.label}</strong>
          </div>
        </div>
      </section>

      {settings.home.sections.map((key) => (
        <Fragment key={key}>{sections[key]}</Fragment>
      ))}
    </main>
  );
}
