import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Phone } from "lucide-react";
import { Photo } from "@/components/photo";
import { PageIntro } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
import { publicSite } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
import { projects, serviceGalleries } from "@/lib/content";
import { ProjectVideo } from "@/components/project-video";
export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = (await publicSite()).services.find((s) => s.id === slug);
  return service
    ? {
        title: service.title,
        description: service.short,
        alternates: { canonical: `/expertises/${slug}` },
        openGraph: {
          title: service.title,
          description: service.short,
          images: [{ url: service.image.src, alt: service.image.alt }],
        },
      }
    : { title: "Prestation introuvable", robots: { index: false } };
}
export default async function Service({ params }: Props) {
  const { slug } = await params,
    settings = await publicSite(),
    s = settings.services.find((s) => s.id === slug);
  if (!s) notFound();
  const company = companyLinks(settings.company),
    hotte = projects.find(
      (p) => p.slug === "pose-hotte-cuisine-professionnelle",
    )!;
  const kind = ["reseaux", "vmc", "extraction"].includes(s.id) ? s.id : "autre";
  return (
    <main id="contenu">
      <PageIntro label="Expertises" title={s.title}>
        {s.short}
      </PageIntro>
      <section className="split-list" aria-label="Notre intervention">
        <div className="wrap">
          <article className="split split-reverse">
            <figure className="split-photo">
              <Photo
                src={s.image.src}
                alt={s.image.alt}
                width={s.image.width}
                height={s.image.height}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width:767px) 100vw, 46vw"
              />
            </figure>
            <div className="split-copy">
              <h2>Notre intervention</h2>
              <p>{s.description}</p>
              <ul className="split-points">
                {s.details.map((d) => (
                  <li key={d}>
                    <Check size={17} aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="split-actions">
                <Link className="lp-cta" href={`/devis?service=${kind}`}>
                  Demander un devis
                </Link>
                <a className="split-link" href={company.tel}>
                  <Phone size={17} aria-hidden="true" />
                  {company.phone}
                </a>
              </div>
              <Link className="split-link split-more" href="/realisations">
                Voir nos réalisations{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>
      {serviceGalleries[s.id] && (
        <section
          className="wrap photos section"
          aria-labelledby="gallery-title"
        >
          <h2 id="gallery-title" className="photos-title">
            En images
          </h2>
          <div className="service-gallery">
            {serviceGalleries[s.id].map((m) => (
              <figure key={m.src}>
                <Photo
                  src={m.src}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  loading="lazy"
                  sizes="(max-width: 720px) 100vw, 60vw"
                />
                <figcaption className="media-caption">{m.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {s.id === "extraction" && (
        <section className="film-feature section">
          <div className="wrap film-lead">
            <ProjectVideo video={hotte.video!} />
            <div className="film-copy">
              <h2>La pose d’une hotte</h2>
              <p>{hotte.description}</p>
              <Link className="lp-cta" href={`/realisations/${hotte.slug}`}>
                Voir cette intervention
              </Link>
            </div>
          </div>
        </section>
      )}
      <ContactBanner />
    </main>
  );
}
