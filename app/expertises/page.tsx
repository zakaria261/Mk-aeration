import Link from "next/link";
import { Photo } from "@/components/photo";
import { PageIntro, FAQ } from "@/components/ui";
import { ContactBanner } from "@/components/site-shell";
import { publicSite, pageMetadata } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
export const revalidate = 60;
export const generateMetadata = () => pageMetadata("expertises", "/expertises");
const quoteKind = (id: string) =>
  ["reseaux", "vmc", "extraction"].includes(id) ? id : "autre";
export default async function Expertises() {
  const settings = await publicSite(),
    company = companyLinks(settings.company);
  return (
    <main id="contenu">
      <PageIntro label="Expertises" title={settings.pages.expertises.title}>
        {settings.pages.expertises.description}
      </PageIntro>
      <section className="split-list" aria-label="Toutes nos prestations">
        <div className="wrap">
          {settings.services.map((s, i) => (
            <article className="split" id={s.id} key={s.id}>
              <div className="split-copy">
                <h2>{s.title}</h2>
                <p className="split-lead">{s.short}</p>
                <p>{s.description}</p>
                <div className="split-actions">
                  <Link className="lp-cta" href={`/expertises/${s.id}`}>
                    Voir la prestation
                  </Link>
                  <Link
                    className="split-link"
                    href={`/devis?service=${quoteKind(s.id)}`}
                  >
                    Demander un devis
                  </Link>
                </div>
              </div>
              <figure className="split-photo">
                <Link href={`/expertises/${s.id}`} tabIndex={-1}>
                  <Photo
                    src={s.image.src}
                    alt={s.image.alt}
                    width={s.image.width}
                    height={s.image.height}
                    loading={i === 0 ? "eager" : "lazy"}
                    sizes="(max-width:767px) 100vw, 46vw"
                  />
                </Link>
              </figure>
            </article>
          ))}
        </div>
      </section>
      <FAQ phone={company.phone} tel={company.tel} />
      <ContactBanner />
    </main>
  );
}
