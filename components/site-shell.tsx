"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  Menu,
  X,
  MapPin,
  Wind,
} from "lucide-react";
import { company } from "@/lib/content";
const nav = [
  ["/", "Accueil"],
  ["/expertises", "Expertises"],
  ["/realisations", "Réalisations"],
  ["/actualites", "Actualités"],
  ["/entreprise", "L’entreprise"],
];
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="MK Aération — accueil"
    >
      <img
        className="brand-logo"
        src="/images/logo-mk-aeration.jpg"
        alt="MK Aération — Au service de la qualité de l’air"
        width="1080"
        height="1080"
        loading={light ? "lazy" : "eager"}
        decoding="async"
      />
    </Link>
  );
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(100);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const media = matchMedia("(min-width: 801px)");
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab" && menu.current) {
        const elements = [
          trigger.current,
          ...Array.from(menu.current.querySelectorAll<HTMLElement>("a,button")),
        ].filter(Boolean) as HTMLElement[];
        const first = elements[0],
          last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  if (pathname.startsWith("/equipe") || pathname === "/connexion") return null;
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <div className="topbar">
        <div className="container">
          <span>
            <span className="status-dot" /> Votre spécialiste ventilation en
            Auvergne-Rhône-Alpes
          </span>
          <a href={company.tel}>
            Parlons de votre projet <span>{company.phone}</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navigation principale">
            {nav.map(([href, label]) => (
              <Link
                href={href}
                key={href}
                className={
                  pathname === href ||
                  (href !== "/" && pathname.startsWith(href))
                    ? "active"
                    : ""
                }
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link className="button button-small header-quote" href="/devis">
            Demander un devis <ArrowUpRight size={17} />
          </Link>
          <button
            ref={trigger}
            type="button"
            className="menu-toggle"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => {
              setMenuTop(
                trigger.current?.closest("header")?.getBoundingClientRect()
                  .bottom ?? 100,
              );
              setOpen(!open);
            }}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <nav
          ref={menu}
          id="mobile-menu"
          style={{ top: menuTop }}
          className="mobile-menu"
          aria-label="Navigation mobile"
        >
          {nav.map(([href, label], i) => (
            <Link href={href} onClick={() => setOpen(false)} key={href}>
              <span>0{i + 1}</span>
              {label}
              <ArrowUpRight />
            </Link>
          ))}
          <Link href="/devis" className="button" onClick={() => setOpen(false)}>
            Demander un devis <ArrowRight />
          </Link>
          <a className="mobile-menu-phone" href={company.tel}>
            <Phone size={18} />
            {company.phone}
          </a>
          <p>Drôme · Isère · Rhône · Haute-Savoie</p>
        </nav>
      )}
    </>
  );
}
export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/equipe") || pathname === "/connexion") return null;
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <Brand light />
              <p>
                Des réseaux bien posés.
                <br />
                De l’air qui circule.
                <br />
                Du travail dont on est fiers.
              </p>
              <a
                href={company.maps}
                target="_blank"
                rel="noreferrer"
                className="address"
              >
                <MapPin size={17} />
                <span>
                  {company.address}
                  <br />
                  {company.city}
                </span>
              </a>
            </div>
            <div>
              <span className="footer-label">EXPLORER</span>
              <Link href="/">Accueil</Link>
              <Link href="/expertises">Nos expertises</Link>
              <Link href="/realisations">Nos réalisations</Link>
              <Link href="/actualites">Les actualités</Link>
              <Link href="/entreprise">L’entreprise</Link>
            </div>
            <div>
              <span className="footer-label">NOS MÉTIERS</span>
              <Link href="/expertises#reseaux">Réseaux aérauliques</Link>
              <Link href="/expertises#vmc">CTA & VMC</Link>
              <Link href="/expertises#extraction">Soufflage & extraction</Link>
              <Link href="/entreprise#zone">Zone d’intervention</Link>
            </div>
            <div className="footer-contact">
              <span className="footer-label">ON EN PARLE ?</span>
              <a className="footer-phone" href={company.tel}>
                {company.phone}
                <ArrowUpRight size={20} />
              </a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <Link href="/devis" className="footer-devis">
                Votre projet commence ici <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} MK Aération</span>
            <span>Ventilation · VMC · Extraction</span>
            <div>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/confidentialite">Confidentialité</Link>
              <Link href="/connexion">Espace équipe</Link>
            </div>
          </div>
        </div>
      </footer>
      {pathname !== "/devis" && (
        <div className="mobile-contact-bar">
          <a href={company.tel}>
            <Phone size={18} />
            Appeler
          </a>
          <Link href="/devis">
            Demander un devis
            <ArrowUpRight size={18} />
          </Link>
        </div>
      )}
    </>
  );
}
export function ContactBanner() {
  return (
    <section className="contact-banner">
      <div className="container">
        <div>
          <span className="eyebrow">
            <span /> FAISONS CIRCULER VOS IDÉES
          </span>
          <h2>
            UN PROJET EN TÊTE ?<br />
            PARLONS-EN.
          </h2>
        </div>
        <div className="contact-banner-actions">
          <Link href="/devis" className="button button-white">
            Demander mon devis <ArrowUpRight size={21} />
          </Link>
          <a href={company.tel}>
            <Phone size={18} />
            {company.phone}
          </a>
          <small>Un premier échange pour avancer concrètement.</small>
        </div>
        <Wind className="banner-wind" aria-hidden="true" />
      </div>
    </section>
  );
}
