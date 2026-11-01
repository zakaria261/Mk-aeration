import { Photo } from "@/components/photo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { projects } from "@/lib/content";
import { ContactBanner } from "@/components/site-shell";
import { SectionLabel } from "@/components/ui";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p ? `Chantier ${p.title}` : "Chantier introuvable",
    description: p?.description,
    ...(p
      ? {
          openGraph: {
            title: `${p.title} — MK Aération`,
            description: p.description,
            images: [{ url: p.image, alt: p.alt }],
          },
        }
      : {}),
  };
}
export default async function Project({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  const hero = p.media[0];
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
          <span>
            {hero.kind === "projet" ? "VUE DU PROJET" : "PHOTO DE CHANTIER"}
          </span>
          {hero.caption}
        </figcaption>
      </figure>
      <section className="container project-story section-space">
        <div>
          <SectionLabel>LE CHANTIER</SectionLabel>
          <h2>{p.intro.toUpperCase()}</h2>
          <p>{p.description}</p>
        </div>
        <aside>
          <span className="eyebrow">
            {p.slug === "htc-la-boisse" ? "LA RÉFÉRENCE" : "NOTRE INTERVENTION"}
          </span>
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
      {p.media.length > 1 && (
        <section className="container project-photo-section">
          <SectionLabel>LE CHANTIER EN IMAGES</SectionLabel>
          <div className="project-photo-grid">
            {p.media.slice(1).map((m) => (
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
                  <span>
                    {m.kind === "projet"
                      ? "VUE DU PROJET"
                      : "PHOTO DE CHANTIER"}
                  </span>
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
