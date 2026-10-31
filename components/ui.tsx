import { Photo } from "@/components/photo";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import { projects, faqs } from "@/lib/content";
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
    <div className={`section-label ${light ? "label-light" : ""}`}>
      <span className="label-line" />
      {children}
      {number && <span className="section-number">{number}</span>}
    </div>
  );
}
export function ProjectCard({
  project,
  index = 0,
}: {
  project: (typeof projects)[number];
  index?: number;
}) {
  return (
    <Link href={`/realisations/${project.slug}`} className="project-card">
      <div className="project-image">
        <Photo
          sizes="(max-width: 600px) calc(100vw - 44px), (max-width: 1392px) 30vw, 400px"
          src={project.image}
          alt={project.alt}
          width="900"
          height="900"
          loading="lazy"
        />
        <span className="project-tag">{project.category}</span>
        <span className="project-arrow">
          <ArrowUpRight size={23} />
        </span>
      </div>
      <div className="project-caption">
        <div>
          <small>{project.place}</small>
          <h3>{project.title}</h3>
        </div>
        <span className="project-index">0{index + 1}</span>
      </div>
    </Link>
  );
}
export function FAQ() {
  return (
    <section className="faq-section section-space">
      <div className="container faq-layout">
        <div>
          <SectionLabel>VOS QUESTIONS</SectionLabel>
          <h2>TOUT SIMPLEMENT.</h2>
          <p>
            Une question sur votre chantier ?<br />
            Nous sommes là pour en parler.
          </p>
          <a className="text-link" href="tel:+33768476126">
            Appelez-nous <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <Plus size={21} />
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
    <section className="page-intro">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Accueil</Link>
          <ArrowRight size={12} />
          <span>{label}</span>
        </div>
        <SectionLabel>{label.toUpperCase()}</SectionLabel>
        <div className="page-intro-grid">
          <h1>{title}</h1>
          <p>{children}</p>
        </div>
      </div>
    </section>
  );
}
