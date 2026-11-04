import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Phone } from "lucide-react";
import { Photo } from "@/components/photo";
import { PageIntro } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
import { publicSite } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
import { projects } from "@/lib/content";
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
      <section className="wrap service-detail-layout section">
        <Photo
          src={s.image.src}
          alt={s.image.alt}
          width={s.image.width}
          height={s.image.height}
          loading="eager"
          fetchPriority="high"
          sizes="(max-width:767px) 100vw, 52vw"
        />
        <div>
          <h2>Notre intervention</h2>
          <p>{s.description}</p>
          <ul className="checks">
            {s.details.map((d) => (
              <li key={d}>
                <Check size={17} />
                {d}
              </li>
            ))}
          </ul>
          <Link className="btn btn-primary" href={`/devis?service=${kind}`}>
            Demander un devis <ArrowUpRight size={18} />
          </Link>
          <a className="service-direct" href={company.tel}>
            <Phone size={18} />
            {company.phone}
          </a>
          <Link className="link-arrow" href="/realisations">
            Voir nos réalisations <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      {s.id === "extraction" && (
        <section className="film-feature section">
          <div className="wrap film-lead">
            <ProjectVideo video={hotte.video!} />
            <div className="film-copy">
              <h2>La pose d’une hotte</h2>
              <p>{hotte.description}</p>
              <Link
                className="btn btn-light"
                href={`/realisations/${hotte.slug}`}
              >
                Voir cette intervention <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}
      <ContactBanner />
    </main>
  );
}
