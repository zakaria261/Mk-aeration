import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, Fan, Wind, MoveUpRight, Phone, MapPin } from "lucide-react";
import { Photo } from "@/components/photo";
import { services, company } from "@/lib/content";
import { allProjects, publicNews } from "@/lib/cms-posts";
import { NewsCard } from "@/components/news-card";
import { FAQ } from "@/components/ui";

export const revalidate = 60;

const serviceIcons = [Wind, Fan, MoveUpRight];
const serviceDescriptions = [
  "Des réseaux circulaires et rectangulaires, adaptés aux contraintes de votre bâtiment.",
  "Installation de VMC, double flux et raccordement de centrales de traitement d’air.",
  "De la diffusion de l’air aux hottes professionnelles et aux rejets en toiture.",
];

export default async function Home() {
  const [references, news] = await Promise.all([allProjects(), publicNews()]);
  const selection = references
    .filter((p) => !["tunnel-du-mont-blanc", "pose-hotte-cuisine-professionnelle"].includes(p.slug))
    .slice(0, 3);

  return (
    <main id="contenu" className="landing">
      <section className="lp-hero" aria-labelledby="hero-title">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">Ventilation &amp; réseaux aérauliques</p>
            <h1 id="hero-title">La qualité de l’air<br /><span>commence ici.</span></h1>
            <p className="lp-hero-description">
              Des installations soignées. Une équipe de terrain.
              MK Aération réalise vos réseaux de ventilation, CTA et VMC,
              de la Drôme aux Alpes.
            </p>
            <div className="lp-actions">
              <Link href="/devis" className="lp-button">Parlons de votre projet <ArrowUpRight size={18} aria-hidden="true" /></Link>
              <Link href="#expertises" className="lp-text-link">Nos expertises <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
            <p className="lp-hero-note"><MapPin size={15} aria-hidden="true" /> Saint-Rambert-d’Albon · Auvergne-Rhône-Alpes</p>
          </div>
          <figure className="lp-hero-photo">
            <Photo
              src="/images/annecy-panorama.webp"
              alt="Installation de ventilation et centrale de traitement d’air en toiture, réalisée par MK Aération à Annecy"
              width={1800}
              height={1350}
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1439px) 48vw, 640px"
              fetchPriority="high"
              loading="eager"
            />
            <figcaption><span>Le savoir-faire, sur le terrain.</span><strong>FIER Annecy <span>·</span> CTA double flux</strong></figcaption>
          </figure>
        </div>
      </section>

      <div className="lp-assurances">
        <ul className="lp-container">
          <li><Wind size={24} strokeWidth={1.5} aria-hidden="true" /><div><strong>Un métier maîtrisé</strong><span>Réseaux, ventilation &amp; traitement d’air</span></div></li>
          <li><Check size={24} strokeWidth={1.5} aria-hidden="true" /><div><strong>Le soin de la pose</strong><span>Du cheminement aux raccordements</span></div></li>
          <li><MapPin size={24} strokeWidth={1.5} aria-hidden="true" /><div><strong>Une équipe de proximité</strong><span>Drôme, Isère, Rhône &amp; Haute-Savoie</span></div></li>
        </ul>
      </div>

      <section className="lp-section lp-services" id="expertises" aria-labelledby="services-title">
        <div className="lp-container">
          <div className="lp-section-head">
            <div><p className="lp-eyebrow">Nos expertises</p><h2 id="services-title">Bien faire circuler l’air.<br />C’est notre métier.</h2></div>
            <p>Du logement collectif au bâtiment industriel, nous installons les réseaux qui font respirer vos espaces.</p>
          </div>
          <div className="lp-service-grid">
            {services.map((service, i) => {
              const Icon = serviceIcons[i];
              return (
                <Link href={`/expertises#${service.id}`} className="lp-service" key={service.id}>
                  <div className="lp-service-image"><Photo src={service.image} alt={service.alt} width={800} height={600} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 33vw" /></div>
                  <div className="lp-service-body">
                    <Icon className="lp-service-icon" size={29} strokeWidth={1.4} aria-hidden="true" />
                    <h3>{service.title}</h3><p>{serviceDescriptions[i]}</p>
                    <span className="lp-service-link">Découvrir cette expertise <ArrowRight size={17} aria-hidden="true" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-feature" aria-labelledby="feature-title">
        <div className="lp-container">
          <div className="lp-feature-grid">
            <figure className="lp-feature-image">
              <Photo src="/images/mont-blanc-presentation.webp" alt="Tunnel du Mont-Blanc — visuel de présentation fourni par MK Aération" width={1461} height={720} loading="lazy" sizes="(max-width: 899px) calc(100vw - 40px), 58vw" />
              <figcaption>Visuel de présentation fourni par MK Aération.</figcaption>
            </figure>
            <div className="lp-feature-copy">
              <p className="lp-eyebrow">Une référence à part</p>
              <h2 id="feature-title">Au cœur du<br />Mont-Blanc.</h2>
              <p>Huit mois d’intervention sur un chantier hors du commun, entre la France et l’Italie. Ventilation, réseaux PVC, supportage et travaux de nuit.</p>
              <Link href="/realisations/tunnel-du-mont-blanc" className="lp-text-link">Découvrir le chantier <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" aria-labelledby="projects-title" id="realisations">
        <div className="lp-container">
          <div className="lp-section-head">
            <div><p className="lp-eyebrow">Nos réalisations</p><h2 id="projects-title">Notre travail parle pour nous.</h2></div>
            <Link href="/realisations" className="lp-text-link">Tous les chantiers <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="lp-project-grid">
            {selection.map((project) => (
              <Link href={`/realisations/${project.slug}`} key={project.slug} className="lp-project">
                <div className="lp-project-image">
                  <Photo src={project.image} alt={project.alt} width={project.imageWidth || 900} height={project.imageHeight || 900} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 33vw" style={{ objectPosition: project.imagePosition }} />
                  {project.coverKind !== "chantier" && <span className="lp-image-note">{project.coverKind === "projet" ? "Vue du projet" : "Visuel de présentation"}</span>}
                </div>
                <div className="lp-project-body"><p>{project.category}</p><h3>{project.title}</h3><span>{project.place}</span><ArrowUpRight className="lp-project-arrow" size={21} aria-hidden="true" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-about lp-section" aria-labelledby="about-title">
        <div className="lp-container lp-about-grid">
          <figure className="lp-about-photo">
            <Photo src="/images/htc-la-boisse-reseaux.webp" alt="Pose de réseaux de ventilation par l’équipe MK Aération sur le chantier HTC La Boisse" width={1152} height={1536} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 45vw" />
            <figcaption>Sur le chantier HTC La Boisse, dans l’Ain.</figcaption>
          </figure>
          <div className="lp-about-copy">
            <p className="lp-eyebrow">L’esprit MK Aération</p>
            <h2 id="about-title">Des gens de métier.<br />Le goût du travail bien fait.</h2>
            <p>Un passage à anticiper, une gaine à ajuster, un raccordement à soigner. La qualité d’une installation se joue dans les détails. Nous y prêtons attention à chaque chantier.</p>
            <p>Basés à Saint-Rambert-d’Albon, nous intervenons auprès des professionnels et sur les projets de logement collectif en Auvergne-Rhône-Alpes.</p>
            <ul className="lp-about-points"><li><Check size={17} aria-hidden="true" /> Une pose adaptée aux contraintes du terrain</li><li><Check size={17} aria-hidden="true" /> Une coordination avec les autres corps de métier</li><li><Check size={17} aria-hidden="true" /> Un contact direct pour parler de votre chantier</li></ul>
            <Link href="/entreprise" className="lp-text-link">Rencontrer l’entreprise <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="lp-section lp-news" aria-labelledby="news-title">
          <div className="lp-container">
            <div className="lp-section-head"><div><p className="lp-eyebrow">La vie de l’entreprise</p><h2 id="news-title">Les nouvelles du terrain.</h2></div><Link href="/actualites" className="lp-text-link">Toutes les actualités <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
            <div className="log-list">{news.slice(0, 3).map((post) => <NewsCard key={post.id} post={post} />)}</div>
          </div>
        </section>
      )}

      <FAQ />

      <section className="lp-contact" aria-labelledby="contact-title">
        <div className="lp-container lp-contact-grid">
          <div><p className="lp-eyebrow">Faisons avancer votre projet</p><h2 id="contact-title">Un besoin en ventilation ?<br />Parlons-en simplement.</h2><p>Décrivez-nous votre chantier. Nous étudierons ensemble la solution adaptée.</p></div>
          <div className="lp-contact-actions"><Link href="/devis" className="lp-button lp-button-white">Demander un devis <ArrowUpRight size={19} aria-hidden="true" /></Link><a href={company.tel}><Phone size={18} aria-hidden="true" /> {company.phone}</a></div>
        </div>
      </section>
    </main>
  );
}
