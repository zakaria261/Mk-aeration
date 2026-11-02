import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Photo } from "@/components/photo";
import { services, company } from "@/lib/content";
import { allProjects, projectCardData, publicNews } from "@/lib/cms-posts";
import { NewsCard } from "@/components/news-card";
import { ContactBanner } from "@/components/site-shell";
import { SectionLabel, ProjectCard, FAQ } from "@/components/ui";
import { MontBlancSpecs } from "@/components/mont-blanc-feature";
import { AirFlow, Cote, DuctSymbol } from "@/components/drawing";
import { Rail } from "@/components/rail";

export const revalidate = 60;

/** Chantiers volontairement absents de la sélection d’accueil. */
const notOnHome = new Set(["tunnel-du-mont-blanc", "pose-hotte-cuisine-professionnelle"]);

const serviceSymbols = {
  reseaux: "round",
  vmc: "unit",
  extraction: "supply",
} as const;

export default async function Home() {
  const [references, news] = await Promise.all([allProjects(), publicNews()]);
  const selection = references.filter((p) => !notOnHome.has(p.slug)).slice(0, 6);

  return (
    <main id="contenu" className="home">
      {/* ───────────── Ouverture : le tunnel du Mont-Blanc ───────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-head">
          <p className="label hero-label">
            <span className="label-num">01</span>
            Chantier phare · France / Italie
          </p>
          <h1 id="hero-title">
            Huit mois
            <br />
            sous le <span className="nowrap">Mont-Blanc.</span>
          </h1>
        </div>
        <figure className="hero-figure">
          <div className="wrap hero-figure-wrap">
            <Cote className="hero-cote">Tunnel du Mont-Blanc · 11,6 km</Cote>
            <Link
              href="/realisations/tunnel-du-mont-blanc"
              className="hero-media"
              aria-label="Découvrir notre intervention au tunnel du Mont-Blanc"
            >
              <Photo
                src="/images/mont-blanc-presentation.webp"
                alt="Tunnel du Mont-Blanc — visuel de présentation MK Aération"
                width={1461}
                height={720}
                sizes="(max-width: 1392px) 100vw, 1300px"
                fetchPriority="high"
                loading="eager"
              />
              <span className="hero-media-cta" aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </Link>
            <figcaption className="credit mono">
              Visuel de présentation fourni par MK Aération
            </figcaption>
          </div>
        </figure>
        <div className="wrap hero-foot">
          <p className="hero-lede">
            Supportage, gaine carrée de 1 000 × 1 000 mm pour l’amenée d’air
            d’un local électrique, réseau PVC dans les zones techniques,
            interventions de nuit dans les refuges.{" "}
            <strong>Le genre de chantier que MK Aération sait tenir.</strong>
          </p>
          <div className="hero-actions">
            <Link href="/realisations/tunnel-du-mont-blanc" className="btn btn-primary btn-lg">
              Voir le chantier <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <Link href="/devis" className="btn btn-ghost btn-lg">
              Demander un devis
            </Link>
          </div>
        </div>
        <div className="wrap">
          <MontBlancSpecs className="hero-specs" />
        </div>
      </section>

      <div className="wrap">
        <AirFlow label="Soufflage" />
      </div>

      {/* ───────────── Le métier ───────────── */}
      <section className="trade section" aria-labelledby="trade-title">
        <div className="wrap">
          <SectionLabel number="02">Le métier</SectionLabel>
          <h2 id="trade-title" className="statement">
            Nous posons les réseaux aérauliques, raccordons les CTA et
            installons les VMC{" "}
            <span className="muted">
              des bâtiments tertiaires, industriels et des logements
              collectifs — de la Drôme aux Alpes.
            </span>
          </h2>
          <div className="trade-grid">
            <ol className="nomenclature">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/expertises#${s.id}`}>
                    <span className="nomen-symbol">
                      <DuctSymbol kind={serviceSymbols[s.id as keyof typeof serviceSymbols]} />
                    </span>
                    <span className="nomen-ref mono">Rep. {s.number}</span>
                    <span className="nomen-text">
                      <strong>{s.title}</strong>
                      <span>{s.short}</span>
                    </span>
                    <ArrowUpRight className="nomen-arrow" size={22} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
            <figure className="trade-photo">
              <Photo
                src="/images/grenoble-gaines-rectangulaires.webp"
                alt="Gaines aérauliques rectangulaires installées dans les réservations de la toiture à Grenoble"
                width={800}
                height={600}
                loading="lazy"
                sizes="(max-width: 1080px) 100vw, 40vw"
              />
              <figcaption className="mono">
                Photo de chantier · Forum de la Métropole, Grenoble — gaines
                rectangulaires en toiture
              </figcaption>
            </figure>
          </div>
          <Link href="/expertises" className="link-arrow">
            Toutes nos expertises <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ───────────── Les chantiers ───────────── */}
      <section className="works section" aria-labelledby="works-title" id="realisations">
        <div className="wrap">
          <div className="works-head">
            <div>
              <SectionLabel number="03" light>
                Sur le terrain
              </SectionLabel>
              <h2 id="works-title">Les chantiers.</h2>
            </div>
            <p>
              Des photos prises sur place, par l’équipe. Ce qui a été posé,
              où, et comment.
            </p>
          </div>
        </div>
        <div className="wrap wrap-bleed">
          <Rail label="Sélection de chantiers" count={selection.length + 1}>
            {selection.map((p, i) => (
              <div role="listitem" key={p.slug} className="rail-item">
                <ProjectCard project={projectCardData(p)} index={i + 1} />
              </div>
            ))}
            <div role="listitem" className="rail-item">
              <Link href="/realisations" className="works-all">
                <span className="mono">{String(references.length).padStart(2, "0")} chantiers</span>
                <strong>
                  Voir toutes
                  <br />
                  les réalisations
                </strong>
                <ArrowUpRight size={34} aria-hidden="true" />
              </Link>
            </div>
          </Rail>
        </div>
      </section>

      {/* ───────────── Carnet de chantier (publié par l’équipe) ───────────── */}
      {news.length > 0 && (
        <section className="logbook section" aria-labelledby="log-title">
          <div className="wrap">
            <div className="logbook-head">
              <div>
                <SectionLabel number="04">Carnet de chantier</SectionLabel>
                <h2 id="log-title">Les nouvelles de l’équipe.</h2>
              </div>
              <Link href="/actualites" className="link-arrow">
                Toutes les actualités <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="log-list">
              {news.slice(0, 3).map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── L’entreprise et le terrain ───────────── */}
      <section className="base section" aria-labelledby="base-title">
        <div className="wrap base-grid">
          <figure className="base-photo">
            <Photo
              src="/images/annecy-cta.webp"
              alt="Réseau de ventilation installé en toiture par MK Aération à Annecy"
              width={1200}
              height={1200}
              loading="lazy"
              sizes="(max-width: 1080px) 100vw, 45vw"
            />
            <figcaption className="mono">Photo de chantier · FIER, Annecy</figcaption>
          </figure>
          <div className="base-copy">
            <SectionLabel number={news.length ? "05" : "04"}>L’entreprise</SectionLabel>
            <h2 id="base-title">
              La qualité de l’air commence par la qualité de la pose.
            </h2>
            <p>
              Un réseau aéraulique, c’est une suite de détails qui comptent :
              un passage à anticiper, une transition à adapter, un
              raccordement à soigner. C’est là que se joue notre travail.
            </p>
            <div className="base-map">
              <div className="base-origin">
                <span className="mono">Point de départ</span>
                <strong>Saint-Rambert-d’Albon</strong>
                <span>{company.address} · 26140</span>
              </div>
              <ul className="base-depts">
                {[
                  ["26", "Drôme"],
                  ["38", "Isère"],
                  ["69", "Rhône"],
                  ["74", "Haute-Savoie"],
                ].map(([n, name]) => (
                  <li key={n}>
                    <span className="mono">{n}</span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/entreprise" className="link-arrow">
              Découvrir l’entreprise <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <FAQ />
      <ContactBanner />
    </main>
  );
}
