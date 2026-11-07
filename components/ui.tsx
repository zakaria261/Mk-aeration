import { Photo } from "@/components/photo";
import Link from "next/link";
import { ArrowUpRight, Plus, Play } from "lucide-react";
import { faqs, type ProjectCardData } from "@/lib/content";

export function SectionLabel({
  children,
  number,
  light = false,
}: {
  children: React.ReactNode;
  number?: string;
  light?: boolean;
}) {
  return (
    <p className={`label ${light ? "label-light" : ""}`}>
      {number && <span className="label-num">{number}</span>}
      {children}
    </p>
  );
}

export function ProjectCard({
  project,
  priority = false,
  sizes = "(max-width: 720px) 82vw, (max-width: 1080px) 46vw, 30vw",
}: {
  project: ProjectCardData;
  index?: number;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link href={`/realisations/${project.slug}`} className="pcard">
      <div
        className={`pcard-media ${project.coverKind === "presentation" ? "is-presentation" : ""}`}
      >
        <Photo
          sizes={sizes}
          src={project.image}
          alt={project.alt}
          width={project.imageWidth || 900}
          height={project.imageHeight || 900}
          loading={priority ? "eager" : "lazy"}
          style={{ objectPosition: project.imagePosition }}
        />
        {project.video && (
          <span className="pcard-chip">
            <Play size={11} fill="currentColor" aria-hidden="true" /> Vidéo ·{" "}
            {project.video.duration}
          </span>
        )}
      </div>
      <div className="pcard-body">
        <h3>{project.title}</h3>
        <p>
          {project.sector} · {project.place}
        </p>
      </div>
    </Link>
  );
}

export function FAQ({
  phone = "07 68 47 61 26",
  tel = "tel:+33768476126",
}: {
  phone?: string;
  tel?: string;
}) {
  return (
    <section className="faq section" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <SectionLabel>Questions fréquentes</SectionLabel>
          <h2 id="faq-title">Avant de lancer le chantier.</h2>
          <p>
            Une question qui n’est pas ici ? Le plus simple reste de nous
            appeler.
          </p>
          <a className="link-arrow" href={tel}>
            {phone} <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>
                <span>{f.q}</span>
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="intro">
      <div className="wrap">
        <nav className="crumbs mono" aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>
        <div className="intro-grid">
          <h1>{title}</h1>
          <p>{children}</p>
        </div>
      </div>
    </section>
  );
}
