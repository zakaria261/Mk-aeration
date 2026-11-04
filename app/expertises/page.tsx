import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Photo } from "@/components/photo";
import { PageIntro, FAQ } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
import { publicSite, pageMetadata } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
export const revalidate = 60;
export const generateMetadata = () => pageMetadata("expertises", "/expertises");
export default async function Expertises() {
  const settings = await publicSite(),
    company = companyLinks(settings.company);
  return (
    <main id="contenu">
      <PageIntro label="Expertises" title={settings.pages.expertises.title}>
        {settings.pages.expertises.description}
      </PageIntro>
      <section
        className="wrap service-index section"
        aria-label="Toutes nos prestations"
      >
        {settings.services.map((s, i) => (
          <article id={s.id} key={s.id}>
            <Link href={`/expertises/${s.id}`} className="service-index-image">
              <Photo
                src={s.image.src}
                alt={s.image.alt}
                width={s.image.width}
                height={s.image.height}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="(max-width:767px) 100vw, 45vw"
              />
            </Link>
            <div>
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <h2>{s.title}</h2>
              <p>{s.short}</p>
              <ul className="service-index-details">
                {s.details.slice(0, 3).map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="service-actions">
                <Link
                  className="btn btn-primary"
                  href={`/devis?service=${["reseaux", "vmc", "extraction"].includes(s.id) ? s.id : "autre"}`}
                >
                  Demander un devis <ArrowUpRight size={18} />
                </Link>
                <Link className="link-arrow" href={`/expertises/${s.id}`}>
                  Voir la prestation <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <FAQ phone={company.phone} tel={company.tel} />
      <ContactBanner />
    </main>
  );
}
