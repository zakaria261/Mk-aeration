"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useCompany, useSiteContent } from "./site-provider";
import { ConversionPreferences } from "./conversion-controls";
import { MobileContact } from "./mobile-contact";

const nav = [
  ["/", "Accueil"],
  ["/expertises", "Expertises"],
  ["/realisations", "Réalisations"],
  ["/entreprise", "L’entreprise"],
  ["/actualites", "Actualités"],
  ["/contact", "Contact"],
] as const;
const active = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);
const privatePage = (pathname: string) =>
  pathname.startsWith("/equipe") || pathname === "/connexion";

export function Brand({ compact = false }: { compact?: boolean }) {
  const { logo } = useSiteContent();
  return (
    <Link
      href="/"
      className={`brand ${compact ? "brand-compact" : ""}`}
      aria-label="MK Aération — accueil"
    >
      {compact ? (
        <img
          className="brand-emblem"
          src="/brand/emblem.webp"
          alt=""
          width={512}
          height={480}
          decoding="async"
        />
      ) : (
        <img
          className="brand-lockup"
          src={logo.src}
          srcSet={
            logo.src === "/brand/lockup.webp"
              ? "/brand/lockup-small.webp 320w, /brand/lockup.webp 552w"
              : undefined
          }
          sizes="170px"
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          decoding="async"
        />
      )}
    </Link>
  );
}

export function Header() {
  const company = useCompany();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const media = matchMedia("(min-width: 1080px)");
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("menu-open");
    menu.current
      ?.querySelector<HTMLAnchorElement>("a")
      ?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.key === "Tab" && menu.current) {
        const items = [
          trigger.current,
          ...menu.current.querySelectorAll<HTMLElement>("a,button"),
        ].filter(Boolean) as HTMLElement[];
        const first = items[0],
          last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.documentElement.classList.remove("menu-open");
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  if (privatePage(pathname)) return null;
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <div className="public-topbar">
        <div className="lp-container">
          <p>Ventilation · CTA · VMC</p>
          <span>
            <MapPin size={13} aria-hidden="true" /> Drôme · Isère · Rhône ·
            Haute-Savoie
          </span>
          <a href={company.tel}>
            <Phone size={13} aria-hidden="true" /> {company.phone}
          </a>
        </div>
      </div>
      <header className="public-header">
        <div className="lp-container public-header-inner">
          <Brand />
          <nav className="public-nav" aria-label="Navigation principale">
            {nav.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={active(pathname, href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="public-header-actions">
            <Link href="/devis" className="lp-button public-quote">
              Demander un devis <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a
              className="public-call"
              href={company.tel}
              aria-label={`Appeler le ${company.phone}`}
            >
              <Phone size={20} aria-hidden="true" />
            </a>
            <button
              ref={trigger}
              type="button"
              className="public-menu-button"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="public-menu"
              onClick={() => setOpen((current) => !current)}
            >
              {open ? (
                <X size={23} aria-hidden="true" />
              ) : (
                <Menu size={23} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>
      <div
        id="public-menu"
        ref={menu}
        className={`public-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Navigation mobile">
          {nav.map(([href, label]) => (
            <Link
              href={href}
              key={href}
              aria-current={active(pathname, href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <Link
          href="/devis"
          className="lp-button"
          onClick={() => setOpen(false)}
        >
          Demander un devis <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <a href={company.tel} className="public-menu-phone">
          <Phone size={18} aria-hidden="true" />
          {company.phone}
        </a>
        <p>
          Basés à Saint-Rambert-d’Albon.
          <br />
          Présents sur vos chantiers de la région.
        </p>
      </div>
    </>
  );
}

export function Footer() {
  const company = useCompany();
  const settings = useSiteContent();
  const pathname = usePathname();
  if (privatePage(pathname)) return null;
  return (
    <>
      <MobileContact />
      <footer className="public-footer">
        <div className="lp-container">
          <div className="public-footer-grid">
            <div className="public-footer-brand">
              <div>
                <Brand />
              </div>
              <p>
                Réseaux aérauliques, ventilation
                <br />
                et qualité de l’air.
              </p>
              {company.hours && <p>{company.hours}</p>}
              {company.socials.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div>
              <h2>Prestations & site</h2>
              {settings.services.map((s) => (
                <Link key={s.id} href={`/expertises/${s.id}`}>
                  {s.title}
                </Link>
              ))}
              <Link href="/contact">Nous contacter</Link>
              <Link href="/realisations">Nos réalisations</Link>
              <Link href="/entreprise">L’entreprise</Link>
              <Link href="/actualites">Actualités</Link>
            </div>
            <div>
              <h2>Échangeons</h2>
              <a className="public-footer-phone" href={company.tel}>
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`}>
                <Mail size={14} aria-hidden="true" /> {company.email}
              </a>
              <a href={company.maps} target="_blank" rel="noreferrer">
                <MapPin size={14} aria-hidden="true" />
                <span>
                  {company.address}
                  <br />
                  {company.city}
                </span>
              </a>
            </div>
            <div>
              <h2>Votre projet</h2>
              <Link href="/devis" className="public-footer-quote">
                Demander un devis <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <span className="public-footer-region">
                {company.areas.join(" · ")}
              </span>
            </div>
          </div>
          <div className="public-footer-bottom">
            <span>© {new Date().getFullYear()} MK Aération.</span>
            <div>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/confidentialite">Confidentialité</Link>
              <Link href="/equipe">Espace dirigeant</Link>
              <ConversionPreferences />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export function ContactBanner() {
  const company = useCompany();
  return (
    <section className="public-contact" aria-labelledby="public-contact-title">
      <div className="lp-container">
        <div>
          <h2 id="public-contact-title">Parlons de votre projet.</h2>
          <p>Un contact direct pour étudier votre besoin en ventilation.</p>
        </div>
        <div>
          <Link href="/devis" className="lp-cta">
            Demander un devis
          </Link>
          <a href={company.tel}>
            <Phone size={18} aria-hidden="true" />
            {company.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
