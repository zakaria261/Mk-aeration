import { ContactForm } from "@/components/contact-form";
import { publicSite, pageMetadata } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight, ArrowRight } from "lucide-react";
export const revalidate = 60;
export const generateMetadata = () => pageMetadata("contact", "/contact");
export default async function Contact() {
  const settings = await publicSite();
  const company = companyLinks(settings.company);
  return (
    <main id="contenu" className="contact-experience">
      <div className="lp-container">
        <nav className="contact-breadcrumb" aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link>
          <span>/</span>
          <span aria-current="page">Contact</span>
        </nav>
        <div className="contact-experience-grid">
          <div className="contact-editorial">
            <h1>
              {settings.pages.contact.title}
              <span>Construisons la suite.</span>
            </h1>
            <p className="contact-intro-copy">
              {settings.pages.contact.description}
            </p>
            <div className="contact-channels">
              <a href={company.tel}>
                <Phone size={22} aria-hidden="true" />
                <span>
                  <small>Un échange direct</small>
                  <strong>{company.phone}</strong>
                </span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </a>
              <a href={`mailto:${company.email}`}>
                <Mail size={22} aria-hidden="true" />
                <span>
                  <small>Écrivez-nous</small>
                  <strong>{company.email}</strong>
                </span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </a>
            </div>
            <div className="contact-next">
              <p>Et ensuite ?</p>
              <ol>
                <li>Nous prenons connaissance de votre besoin.</li>
                <li>Nous échangeons sur les contraintes du chantier.</li>
                <li>Nous préparons les prochaines étapes ensemble.</li>
              </ol>
            </div>
            <div className="contact-office">
              <MapPin size={18} aria-hidden="true" />
              <div>
                <a href={company.maps} target="_blank" rel="noreferrer">
                  {company.address}
                  <br />
                  {company.city}
                </a>
                {company.hours && <p>{company.hours}</p>}
                <p>{company.areas.join(" · ")}</p>
              </div>
            </div>
            <Link className="contact-quote-link" href="/devis">
              Vous avez déjà un cahier des charges ?
              <span>
                Préparer une demande de devis{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </span>
            </Link>
          </div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
