import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Check, CheckCheck, Fan, HardHat, MapPin, Phone, Ruler, ShieldCheck, Wind } from "lucide-react";
import { Photo } from "./photo";
import { FAQ } from "./ui";
import { NewsCard } from "./news-card";
import { company, services, type Project } from "@/lib/content";
import { homePhotos, type HomeContent } from "@/lib/home-content";
import type { TeamPost } from "@/lib/cms-types";

const benefits = [
  { icon: ShieldCheck, title: "Le soin de la pose", text: "Supportage, transitions et raccordements : une attention portée à chaque détail de l’installation." },
  { icon: HardHat, title: "Un chantier coordonné", text: "Des passages anticipés et une intervention en lien avec les autres corps de métier." },
  { icon: Building2, title: "Neuf & rénovation", text: "Du logement collectif au bâtiment industriel, un savoir-faire adapté aux contraintes du terrain." },
  { icon: Ruler, title: "La bonne adaptation", text: "Gaines circulaires ou rectangulaires, CTA, VMC : des réseaux intégrés à la configuration des lieux." },
];
const steps = [
  ["01", "On échange", "Votre bâtiment, vos plans, vos contraintes. Nous commençons par comprendre votre besoin."],
  ["02", "On prépare", "Cheminements, supportage, coordination : nous préparons les conditions de l’intervention."],
  ["03", "On installe", "Pose des réseaux et raccordements. Le soin du métier, jusque dans les finitions."],
];

export function PublicHome({ content, references, news }: { content: HomeContent; references: Project[]; news: TeamPost[] }) {
  const photo = homePhotos.find((item) => item.src === content.heroImage) || homePhotos[0];
  const selection = references.filter((project) => project.coverKind === "chantier" && project.slug !== "pose-hotte-cuisine-professionnelle").slice(0, 3);
  const photoRate = selection.length ? 100 : 0;
  return (
    <main id="contenu" className="landing">
      <section className="lp-hero" aria-labelledby="hero-title">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow lp-eyebrow-light">Ventilation · Réseaux aérauliques · Qualité de l’air</p>
            <h1 id="hero-title">{content.heroTitle}<br /><span>{content.heroAccent}</span></h1>
            <p className="lp-hero-description">{content.heroDescription}</p>
            <div className="lp-actions">
              <Link href="/devis" className="lp-button">Parlons de votre projet <ArrowUpRight size={19} aria-hidden="true" /></Link>
              <Link href="#realisations" className="lp-text-link">Voir nos réalisations <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
            <p className="lp-hero-location"><MapPin size={15} aria-hidden="true" /> Saint-Rambert-d’Albon · Auvergne-Rhône-Alpes</p>
          </div>
          <figure className="lp-hero-photo">
            <Photo src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="eager" fetchPriority="high" sizes="(max-width: 767px) calc(100vw - 40px), 50vw" />
            <figcaption><span>Notre référence à la une</span><strong>{photo.src.includes("mont-blanc") ? "Tunnel du Mont-Blanc" : photo.label}</strong><Link href={photo.src.includes("mont-blanc") ? "/realisations/tunnel-du-mont-blanc" : "/realisations"}>Explorer le chantier <ArrowUpRight size={18} aria-hidden="true" /></Link><small>{photo.src.includes("mont-blanc") ? "Visuel de présentation fourni par MK Aération" : "Photographie de chantier MK Aération"}</small></figcaption>
          </figure>
        </div>
      </section>

      <section className="lp-proof" aria-label="Des références concrètes">
        <div className="lp-container lp-proof-grid">
          <Link href="/realisations/tunnel-du-mont-blanc"><strong>8 <span>mois</span></strong><span>au tunnel du Mont-Blanc</span><small>Une intervention d’envergure <ArrowUpRight size={13} aria-hidden="true" /></small></Link>
          <Link href="/realisations/rehabilitation-vmc-21-appartements"><strong>21</strong><span>appartements en réhabilitation VMC</span><small>Un chantier de logement collectif <ArrowUpRight size={13} aria-hidden="true" /></small></Link>
          <a href="#realisations"><strong>{photoRate} <span>%</span></strong><span>de photos de chantier dans cette sélection</span><small>Des photos de chantier à découvrir <ArrowRight size={13} aria-hidden="true" /></small></a>
          <Link href="/entreprise#zone"><strong>4</strong><span>départements d’intervention</span><small>Drôme · Isère · Rhône · Haute-Savoie <ArrowUpRight size={13} aria-hidden="true" /></small></Link>
        </div>
      </section>

      <section className="lp-section lp-services" id="expertises" aria-labelledby="services-title">
        <div className="lp-container">
          <div className="lp-section-head"><div><p className="lp-eyebrow">Trois expertises. Un même niveau d’attention.</p><h2 id="services-title">Faire circuler l’air.<br />Bien faire notre métier.</h2></div><p>Des réseaux aérauliques aux équipements de traitement d’air, nous réalisons les installations qui font respirer vos bâtiments.</p></div>
          <div className="lp-service-grid">
            {services.map((service, index) => {
              const Icon = [Wind, Fan, Building2][index];
              return <Link href={`/expertises#${service.id}`} className="lp-service" key={service.id}>
                <div className="lp-service-photo"><Photo src={service.image} alt={service.alt} width={800} height={600} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 33vw" /><span>0{index + 1}</span></div>
                <div className="lp-service-body"><Icon size={27} strokeWidth={1.6} aria-hidden="true" /><h3>{service.title}</h3><p>{["Pose de gaines circulaires et rectangulaires, cheminements et raccordements adaptés à votre chantier.", "Ventilation mécanique, double flux et raccordement des centrales de traitement d’air.", "Réseaux de soufflage et d’extraction, diffusion de l’air et rejets en toiture."][index]}</p><span className="lp-card-link">Découvrir l’expertise <ArrowRight size={17} aria-hidden="true" /></span></div>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="lp-section lp-benefits" id="pourquoi-mk-aeration" aria-labelledby="benefits-title">
        <div className="lp-container lp-benefits-grid">
          <div className="lp-benefits-copy"><p className="lp-eyebrow">Pourquoi choisir MK Aération</p><h2 id="benefits-title">{content.benefitsTitle}</h2><p className="lp-benefits-intro">{content.benefitsIntro}</p>
            <ul className="lp-benefits-list">{benefits.map(({ icon: Icon, title, text }) => <li key={title}><span className="lp-benefit-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul>
            <Link href="/devis" className="lp-text-link">Étudions votre chantier <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
          <figure className="lp-benefits-photo"><Photo src="/images/htc-la-boisse-descentes.webp" alt="Gaines circulaires et descentes de ventilation posées sur le chantier HTC La Boisse" width={1152} height={1536} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 46vw" /><figcaption><span><Wind size={25} aria-hidden="true" /></span><div><strong>Le savoir-faire en action.</strong><p>Réseaux aérauliques · HTC La Boisse</p></div></figcaption></figure>
        </div>
      </section>

      <section className="lp-section lp-projects" id="realisations" aria-labelledby="projects-title">
        <div className="lp-container">
          <div className="lp-section-head"><div><p className="lp-eyebrow">Nos réalisations</p><h2 id="projects-title">Du travail concret.<br />Des preuves en images.</h2></div><Link href="/realisations" className="lp-text-link">Toutes nos réalisations <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <div className="lp-montblanc"><figure><Photo src="/images/mont-blanc-presentation.webp" alt="Tunnel du Mont-Blanc — visuel de présentation fourni par MK Aération" width={1461} height={720} loading="lazy" sizes="(max-width: 899px) calc(100vw - 40px), 52vw" /><figcaption>Visuel de présentation fourni par MK Aération.</figcaption></figure><div><p className="lp-eyebrow lp-eyebrow-light">Une référence à part · France / Italie</p><h2>Huit mois au cœur<br />du Mont-Blanc.</h2><p>Ventilation d’un local électrique, réseaux PVC, supportage et interventions nocturnes. Une intervention à découvrir dans le détail.</p><Link href="/realisations/tunnel-du-mont-blanc" className="lp-text-link">Explorer notre intervention <ArrowUpRight size={18} aria-hidden="true" /></Link></div></div>
          <div className="lp-project-grid">{selection.map((project) => <Link href={`/realisations/${project.slug}`} className="lp-project" key={project.slug}><div className="lp-project-photo"><Photo src={project.image} alt={project.alt} width={project.imageWidth || 900} height={project.imageHeight || 900} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 33vw" style={{ objectPosition: project.imagePosition }} /><span>Photo de chantier</span></div><div className="lp-project-body"><p>{project.category}</p><h3>{project.title}</h3><span>{project.place}</span><ArrowUpRight size={21} aria-hidden="true" /></div></Link>)}</div>

        </div>
      </section>

      <section className="lp-section lp-method" aria-labelledby="method-title">
        <div className="lp-container"><div className="lp-section-head"><div><p className="lp-eyebrow">Un interlocuteur. Un projet qui avance.</p><h2 id="method-title">Simple dans les échanges.<br />Précis dans l’exécution.</h2></div><p>Une équipe de terrain à vos côtés, du premier échange à la pose de vos réseaux.</p></div><ol className="lp-method-grid">{steps.map(([number, title, text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol><div className="lp-region"><div><MapPin size={23} aria-hidden="true" /><p><strong>Ancrés dans la Drôme.</strong><span>Basés à Saint-Rambert-d’Albon, présents sur vos chantiers de la région.</span></p></div><ul>{[["26", "Drôme"], ["38", "Isère"], ["69", "Rhône"], ["74", "Haute-Savoie"]].map(([number, name]) => <li key={number}><strong>{number}</strong>{name}</li>)}</ul><Link href="/entreprise#zone" aria-label="Découvrir notre zone d’intervention"><ArrowUpRight size={23} aria-hidden="true" /></Link></div></div>
      </section>

      {news.length > 0 && <section className="lp-section lp-news" aria-labelledby="news-title"><div className="lp-container"><div className="lp-section-head"><div><p className="lp-eyebrow">La vie de l’entreprise</p><h2 id="news-title">Les nouvelles du terrain.</h2></div><Link href="/actualites" className="lp-text-link">Toutes les actualités <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="log-list">{news.slice(0, 2).map((post) => <NewsCard post={post} key={post.id} />)}</div></div></section>}
      <FAQ />
      <section className="lp-contact" aria-labelledby="contact-title"><div className="lp-container lp-contact-grid"><div><p className="lp-eyebrow lp-eyebrow-light">Votre prochain chantier commence par un échange</p><h2 id="contact-title">{content.contactTitle}</h2><p>{content.contactDescription}</p><div className="lp-contact-checks"><span><CheckCheck size={17} aria-hidden="true" /> Un échange direct</span><span><Check size={17} aria-hidden="true" /> Un besoin étudié</span></div></div><div className="lp-contact-actions"><Link href="/devis" className="lp-button lp-button-white">Demander un devis <ArrowUpRight size={19} aria-hidden="true" /></Link><a href={company.tel}><Phone size={19} aria-hidden="true" /> {company.phone}</a><span>MK Aération · Saint-Rambert-d’Albon</span></div></div></section>
    </main>
  );
}
