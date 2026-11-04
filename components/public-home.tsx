import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MapPin, Phone, Wind, Fan, MoveUpRight } from "lucide-react";
import { Photo } from "./photo";
import { FAQ } from "./ui";
import { NewsCard } from "./news-card";
import { company, services, type Project } from "@/lib/content";
import { homePhotos, type HomeContent } from "@/lib/home-content";
import type { TeamPost } from "@/lib/cms-types";

const icons = [Wind, Fan, MoveUpRight];
const serviceCopy = [
  "Gaines circulaires et rectangulaires, cheminements et raccordements adaptés à votre bâtiment.",
  "Ventilation mécanique, double flux et raccordement des centrales de traitement d’air.",
  "Diffusion de l’air, réseaux d’extraction et rejets en toiture. Une pose intégrée à votre chantier.",
];

export function PublicHome({ content, references, news }: { content: HomeContent; references: Project[]; news: TeamPost[] }) {
  const photo = homePhotos.find((item) => item.src === content.heroImage) || homePhotos[1];
  const selection = references.filter((p) => p.coverKind === "chantier" && p.slug !== "pose-hotte-cuisine-professionnelle").slice(0, 3);
  return (
    <main id="contenu" className="landing">
      <section className={`lp-hero ${photo.src.includes("mont-blanc") ? "lp-hero-presentation" : ""}`} aria-labelledby="hero-title">
        <Photo className="lp-hero-background" src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="eager" fetchPriority="high" sizes="100vw" />
        <div className="lp-container lp-hero-inner">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">MK Aération · De la Drôme aux Alpes</p>
            <h1 id="hero-title">{content.heroTitle}<br /><span>{content.heroAccent}</span></h1>
            <p className="lp-hero-description">{content.heroDescription}</p>
            <div className="lp-actions">
              <Link href="/devis" className="lp-button">Parlons de votre projet <ArrowUpRight size={19} aria-hidden="true" /></Link>
              <Link href="#realisations" className="lp-hero-link">Notre travail en images <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
            <div className="lp-hero-sectors"><span>Tertiaire</span><span>Industrie</span><span>Logement collectif</span></div>
          </div>
          <div className="lp-hero-caption"><span>{photo.src.includes("mont-blanc") ? "Visuel de présentation" : "Photo de chantier"}</span><strong>{photo.label}</strong></div>
        </div>
      </section>

      <section className="lp-proof" aria-label="Des références concrètes">
        <div className="lp-container lp-proof-grid">
          <Link href="/realisations/tunnel-du-mont-blanc"><strong>8 <span>mois</span></strong><span>au tunnel du Mont-Blanc</span><small>Une intervention d’envergure <ArrowUpRight size={14} aria-hidden="true" /></small></Link>
          <Link href="/realisations/rehabilitation-vmc-21-appartements"><strong>21</strong><span>appartements en réhabilitation VMC</span><small>Un chantier à découvrir <ArrowUpRight size={14} aria-hidden="true" /></small></Link>
          <a href="#realisations"><strong>100 <span>%</span></strong><span>photos de chantier dans notre sélection</span><small>Le travail de nos équipes <ArrowRight size={14} aria-hidden="true" /></small></a>
          <Link href="/entreprise#zone"><strong>4</strong><span>départements d’intervention</span><small>Drôme · Isère · Rhône · Haute-Savoie</small></Link>
        </div>
      </section>

      <section className="lp-flagship lp-section" aria-labelledby="mont-title">
        <div className="lp-container lp-flagship-grid">
          <figure className="lp-flagship-photo">
            <Photo src="/images/mont-blanc-presentation.webp" alt="Tunnel du Mont-Blanc — visuel de présentation fourni par MK Aération" width={1461} height={720} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 57vw" />
            <figcaption>Visuel de présentation fourni par MK Aération.</figcaption>
          </figure>
          <div className="lp-flagship-copy">
            <p className="lp-eyebrow">Notre référence à la une · France / Italie</p>
            <h2 id="mont-title">Un chantier à part.<br />Au cœur du Mont-Blanc.</h2>
            <p>Huit mois d’intervention entre la France et l’Italie. Amenée d’air d’un local électrique, conduites PVC, supportage et travaux de nuit : notre métier prend ici une autre dimension.</p>
            <dl className="lp-flagship-facts"><div><dt>1 000 × 1 000 <span>mm</span></dt><dd>section de la gaine de ventilation</dd></div><div><dt>Ø 125 <span>mm</span></dt><dd>conduites PVC pour la récupération des eaux</dd></div></dl>
            <Link href="/realisations/tunnel-du-mont-blanc" className="lp-text-link">Découvrir notre intervention <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="lp-services lp-section" id="expertises" aria-labelledby="services-title">
        <div className="lp-container">
          <div className="lp-section-head"><div><p className="lp-eyebrow">Nos expertises</p><h2 id="services-title">L’air circule.<br />Le savoir-faire aussi.</h2></div><p>Des réseaux aux équipements, une même attention à la qualité de pose et aux contraintes de votre bâtiment.</p></div>
          <div className="lp-service-grid">{services.map((s, i) => {
            const Icon = icons[i];
            return <Link className="lp-service" href={`/expertises#${s.id}`} key={s.id}>
              <div className="lp-service-photo"><Photo src={s.image} alt={s.alt} width={800} height={600} sizes="(max-width: 767px) 120px, 33vw" loading="lazy" /></div>
              <div className="lp-service-body"><div className="lp-service-heading"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span>0{i + 1}</span></div><h3>{s.title}</h3><p>{serviceCopy[i]}</p><span className="lp-card-link">Découvrir <ArrowUpRight size={18} aria-hidden="true" /></span></div>
            </Link>;
          })}</div>
        </div>
      </section>

      <section className="lp-section lp-projects" id="realisations" aria-labelledby="projects-title">
        <div className="lp-container">
          <div className="lp-section-head"><div><p className="lp-eyebrow">Sur le terrain</p><h2 id="projects-title">Du travail concret.<br />Des preuves en images.</h2></div><Link href="/realisations" className="lp-text-link">Toutes nos réalisations <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <div className="lp-project-grid">{selection.map((p) => <Link className="lp-project" href={`/realisations/${p.slug}`} key={p.slug}>
            <div className="lp-project-photo"><Photo src={p.image} alt={p.alt} width={p.imageWidth || 900} height={p.imageHeight || 900} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 33vw" style={{ objectPosition: p.imagePosition }} /><span>Photo de chantier</span></div>
            <div className="lp-project-body"><p>{p.category}</p><h3>{p.title}</h3><span>{p.place}</span><ArrowUpRight size={23} aria-hidden="true" /></div>
          </Link>)}</div>
        </div>
      </section>

      <section className="lp-about lp-section" aria-labelledby="about-title">
        <div className="lp-container lp-about-grid">
          <figure className="lp-about-photo"><Photo src="/images/htc-la-boisse-descentes.webp" alt="Réseaux de ventilation posés sur le chantier HTC La Boisse" width={1152} height={1536} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 45vw" /><figcaption>HTC La Boisse · Réseaux aérauliques</figcaption></figure>
          <div className="lp-about-copy"><p className="lp-eyebrow">L’esprit MK Aération</p><h2 id="about-title">{content.benefitsTitle}</h2><p>{content.benefitsIntro}</p>
            <ul className="lp-about-points"><li><Check size={19} aria-hidden="true" /><span><strong>Le soin du détail</strong>Supportage, transitions et raccordements soignés.</span></li><li><Check size={19} aria-hidden="true" /><span><strong>Un chantier coordonné</strong>Une intervention en lien avec les autres corps de métier.</span></li><li><Check size={19} aria-hidden="true" /><span><strong>Un contact direct</strong>Des échanges simples pour faire avancer votre projet.</span></li></ul>
            <Link href="/entreprise" className="lp-text-link">Découvrir l’entreprise <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <div className="lp-about-location"><MapPin size={19} aria-hidden="true" /><p><strong>Saint-Rambert-d’Albon, Drôme</strong>Au plus près de vos chantiers en région.</p></div>
          </div>
        </div>
      </section>

      {news.length > 0 && <section className="lp-section lp-news" aria-labelledby="news-title"><div className="lp-container"><div className="lp-section-head"><div><p className="lp-eyebrow">La vie de l’entreprise</p><h2 id="news-title">Les nouvelles du terrain.</h2></div><Link href="/actualites" className="lp-text-link">Toutes les actualités <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="log-list">{news.slice(0, 2).map((post) => <NewsCard post={post} key={post.id} />)}</div></div></section>}
      <FAQ />
      <section className="lp-contact" aria-labelledby="contact-title"><div className="lp-container lp-contact-grid"><div><p className="lp-eyebrow">Votre prochain chantier commence ici</p><h2 id="contact-title">{content.contactTitle}</h2><p>{content.contactDescription}</p></div><div className="lp-contact-actions"><Link className="lp-button lp-button-white" href="/devis">Demander un devis <ArrowUpRight size={19} aria-hidden="true" /></Link><a href={company.tel}><Phone size={20} aria-hidden="true" />{company.phone}</a><span>Un échange direct avec MK Aération</span></div></div></section>
    </main>
  );
}
