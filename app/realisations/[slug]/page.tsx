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
  };
}
export default async function Project({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <main id="contenu">
      <section className="project-detail-intro container">
        <Link href="/realisations" className="text-link">
          <ArrowLeft size={17} />
          Toutes les réalisations
        </Link>
        <div className="project-detail-heading">
          <div>
            <SectionLabel>{p.category.toUpperCase()}</SectionLabel>
            <h1>{p.title.toUpperCase()}</h1>
          </div>
          <p>{p.place}</p>
        </div>
      </section>
      <div className="container">
        <Photo
          className="project-detail-hero"
          sizes="(max-width: 1392px) 100vw, 1280px"
          src={p.images[0]}
          alt={p.alt}
          width="1800"
          height="1350"
          fetchPriority="high"
        />
      </div>
      <section className="container project-story section-space">
        <div>
          <SectionLabel>LE CHANTIER</SectionLabel>
          <h2>{p.intro.toUpperCase()}</h2>
          <p>{p.description}</p>
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
            Un projet similaire ? <ArrowUpRight size={20} />
          </Link>
        </aside>
      </section>
      {p.images.length > 1 && (
        <div className="container project-second-image">
          <Photo
            src={p.images[1]}
            alt={`Autre vue des réseaux sur le chantier ${p.title}`}
            width="1200"
            height="1200"
            loading="lazy"
          />
        </div>
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
