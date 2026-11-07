import { Photo } from "@/components/photo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { projects, projectMediaLabels } from "@/lib/content";
import { ContactBanner } from "@/components/site-shell";
import { SectionLabel } from "@/components/ui";
import { ProjectVideo } from "@/components/project-video";
import { allProjects, getPublicPosts } from "@/lib/cms-posts";
import { PublicationView } from "@/components/publication-view";
import { MontBlancSpecs } from "@/components/mont-blanc-feature";
import { Cote } from "@/components/drawing";
export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await allProjects()).find((p) => p.slug === slug);
  return {
    alternates: { canonical: `/realisations/${slug}` },
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
        <div className="wrap">
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
  const ref = String(references.indexOf(p) + 1).padStart(2, "0");
  return (
    <main id="contenu" className="project">
      <section className="wrap project-head">
        <nav className="crumbs mono" aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <Link href="/realisations">Réalisations</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{p.title}</span>
        </nav>
        <p className="label">
          <span className="label-num">{ref}</span>
          {p.sector} · {p.category}
        </p>
        <h1>{p.title}</h1>
        <p className="project-place">{p.place}</p>
      </section>
      {p.video ? (
        <section className="wrap film-lead project-film">
          <ProjectVideo video={p.video} />
          <div className="film-copy">
            <SectionLabel>En direct du chantier</SectionLabel>
            <h2>{p.intro}</h2>
            {p.figures && (
              <dl className="figures">
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
              className="btn btn-primary"
            >
              Parlons de votre chantier{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : (
        <figure className="wrap project-hero">
          {p.slug === "tunnel-du-mont-blanc" && (
            <Cote>Tunnel du Mont-Blanc · France / Italie</Cote>
          )}
          <Photo
            className={hero.height > hero.width ? "is-portrait" : ""}
            sizes="(max-width: 1392px) 100vw, 1300px"
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            fetchPriority="high"
          />
          <figcaption className="media-caption">
            <span className="mono">{projectMediaLabels[hero.kind]}</span>
            {hero.caption}
          </figcaption>
        </figure>
      )}
      {p.slug === "tunnel-du-mont-blanc" && (
        <div className="wrap">
          <MontBlancSpecs />
        </div>
      )}
      <section className="wrap story section">
        <div className="story-main">
          <SectionLabel>Le chantier</SectionLabel>
          <h2>{p.video ? "Une pose précise, à chaque étape." : p.intro}</h2>
          <p>{p.objective || p.description}</p>
          {p.objective && !p.video && <p>{p.description}</p>}
        </div>
        <aside className="story-scope">
          <p className="cartouche-key">Notre intervention</p>
          <ul className="checks">
            {p.scope.map((s) => (
              <li key={s}>
                <Check size={17} aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
          <Link className="btn btn-primary btn-block" href="/devis">
            Un projet similaire ? <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </aside>
      </section>
      {p.stages && (
        <section className="stages section">
          <div className="wrap">
            <SectionLabel light>Les étapes de la réhabilitation</SectionLabel>
            <h2>
              De l’existant
              <br />
              <em>aux nouveaux réseaux.</em>
            </h2>
            <ol className="steps steps-dark">
              {p.stages.map((stage, index) => (
                <li key={stage.title}>
                  <span className="mono">
                    Étape {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
      {photos.length > 0 && (
        <section className="wrap photos section">
          <SectionLabel number={String(photos.length).padStart(2, "0")}>
            Le chantier en images
          </SectionLabel>
          <div className={`photo-grid ${p.video ? "is-portrait" : ""}`}>
            {photos.map((m) => (
              <figure key={m.src}>
                <Photo
                  src={m.src}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  loading="lazy"
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
                <figcaption className="media-caption">
                  <span className="mono">{projectMediaLabels[m.kind]}</span>
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <div className="wrap next-link">
        <Link href={`/realisations/${next.slug}`}>
          <span className="mono">Chantier suivant</span>
          <strong>{next.title}</strong>
          <ArrowRight size={28} aria-hidden="true" />
        </Link>
      </div>
      <ContactBanner />
    </main>
  );
}
