import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/ui";
import { publicSite, pageMetadata } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
export const revalidate = 60;
export const generateMetadata = () => pageMetadata("contact", "/contact");
export default async function Contact() {
  const settings = await publicSite(),
    company = companyLinks(settings.company);
  return (
    <main id="contenu">
      <PageIntro label="Contact" title={settings.pages.contact.title}>
        {settings.pages.contact.description}
      </PageIntro>
      <section className="wrap contact-page-grid section">
        <div>
          <h2>Un contact direct.</h2>
          <a className="contact-page-phone" href={company.tel}>
            <Phone size={24} />
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`}>
            <Mail size={18} />
            {company.email}
          </a>
          <a href={company.maps} target="_blank" rel="noreferrer">
            <MapPin size={18} />
            {company.address}, {company.city}
          </a>
          {company.hours && <p>{company.hours}</p>}
          <p>Pour une demande technique plus détaillée :</p>
          <Link className="lp-text-link" href="/devis">
            Demander un devis <ArrowUpRight size={18} />
          </Link>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
