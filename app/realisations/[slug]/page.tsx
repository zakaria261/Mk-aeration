import { Photo } from "@/components/photo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { projects, projectMediaLabels } from "@/lib/content";
import { ContactBanner } from "@/components/site-shell";
import { SectionLabel } from "@/components/ui";
import { ProjectVideo } from "@/components/project-video";
import { allProjects, getPublicPosts } from "@/lib/cms-posts";
import { PublicationView } from "@/components/publication-view";
export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await allProjects()).find((p) => p.slug === slug);
  return {
    title: p ? `Chantier ${p.title}` : "Chantier introuvable",
    description: p
      ? (projects.some((original) => original.slug === slug)
          ? p.description
          : p.intro
        ).slice(0, 400)
      : undefined,
    ...(p
      ? {
          openGraph: {
            title: `${p.title} — MK Aération`,
            description: (projects.some((original) => original.slug === slug)
              ? p.description
              : p.intro
            ).slice(0, 400),
            images: [{ url: p.image, alt: p.alt }],
          },
        }
      : {}),
  };
}
export default async function Project({ params }: Props) {
  const { slug } = await params;
  if (!projects.some((original) => original.slug === slug)) {
    const post = (await getPublicPosts()).find(
      (p) => p.slug === slug && p.kind === "realisation",
    );
    if (!post) notFound();
    return (
      <main id="contenu">
        <div className="container">
          <PublicationView
            draft={post.published!}
            kind="realisation"
            date={post.published_at}
          />
        </div>
        <ContactBanner />
      </main>
    );
  }
  const references = await allProjects();
  const p = references.find((p) => p.slug === slug);
  if (!p) notFound();
  const next = references[(references.indexOf(p) + 1) % references.length];
  const hero = p.media[0];
  const photos = p.video ? p.media : p.media.slice(1);
  return (
    <main id="contenu">
      <section className="project-detail-intro container">
        <Link href="/realisations" className="text-link">
          <ArrowLeft size={17} />
          Toutes les réalisations
        </Link>
        <div className="project-detail-heading">
          <div>
            <SectionLabel>
              {p.sector.toUpperCase()} · {p.category.toUpperCase()}
            </SectionLabel>
            <h1>{p.title.toUpperCase()}</h1>
          </div>
          <p>{p.place}</p>
        </div>
      </section>
      {p.video ? (
        <section className="container project-film-lead">
          <ProjectVideo video={p.video} />
          <div className="project-film-intro">
            <SectionLabel>EN DIRECT DU CHANTIER</SectionLabel>
            <h2>{p.intro.toUpperCase()}</h2>
            {p.figures && (
              <dl className="project-figures">
                {p.figures.map((figure) => (
                  <div key={figure.label}>
                    <dt>{figure.value}</dt>
                    <dd>{figure.label}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p>{p.description}</p>
            <Link
              href={`/devis?service=${p.category === "Extraction" ? "extraction" : "vmc"}`}
              className="button"
            >
              Parlons de votre chantier <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      ) : (
        <figure className="container project-main-media">
          <Photo
            className={`project-detail-hero ${hero.height > hero.width ? "project-detail-portrait" : ""}`}
            sizes="(max-width: 1392px) 100vw, 1280px"
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            fetchPriority="high"
          />
          <figcaption className="project-media-caption">
            <span>{projectMediaLabels[hero.kind]}</span>
            {hero.caption}
          </figcaption>
        </figure>
      )}
      <section className="container project-story section-space">
        <div>
          <SectionLabel>LE CHANTIER</SectionLabel>
          <h2>
            {p.video
              ? "UNE POSE PRÉCISE. À CHAQUE ÉTAPE."
              : p.intro.toUpperCase()}
          </h2>
          <p>{p.objective || p.description}</p>
        </div>
        <aside>
          <span className="eyebrow">NOTRE INTERVENTION</span>
          <ul className="check-list">
            {p.scope.map((s) => (
              <li key={s}>
                <Check size={17} />
                {s}
              </li>
            ))}
          </ul>
          <Link className="button" href="/devis">
            Un projet similaire ?<ArrowUpRight size={20} />
          </Link>
        </aside>
      </section>
      {p.stages && (
        <section className="project-stages section-space">
          <div className="container">
            <SectionLabel>LES ÉTAPES DE LA RÉHABILITATION</SectionLabel>
            <h2>
              DE L’EXISTANT
              <br />
              <span className="text-blue">AUX NOUVEAUX RÉSEAUX.</span>
            </h2>
            <ol>
              {p.stages.map((stage, index) => (
                <li key={stage.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
      {photos.length > 0 && (
        <section className="container project-photo-section">
          <SectionLabel>LE CHANTIER EN IMAGES</SectionLabel>
          <div
            className={`project-photo-grid${p.video ? " project-photo-grid-portrait" : ""}`}
          >
            {photos.map((m) => (
              <figure key={m.src}>
                <Photo
                  src={m.src}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  loading="lazy"
                  sizes="(max-width: 600px) 100vw, 45vw"
                />
                <figcaption className="project-media-caption">
                  <span>{projectMediaLabels[m.kind]}</span>
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <div className="container next-project">
        <span>LE CHANTIER SUIVANT</span>
        <Link href={`/realisations/${next.slug}`}>
          {next.title}
          <ArrowUpRight />
        </Link>
      </div>
      <ContactBanner />
    </main>
  );
}
