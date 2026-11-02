"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  House,
  Layers,
  Newspaper,
  FileText,
  UserRound,
} from "lucide-react";
import { company } from "@/lib/content";
import { AirFlow } from "./drawing";

const nav = [
  ["/realisations", "Réalisations"],
  ["/expertises", "Expertises"],
  ["/actualites", "Actualités"],
  ["/entreprise", "L’entreprise"],
] as const;

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const hiddenShell = (pathname: string) =>
  pathname.startsWith("/equipe") || pathname === "/connexion";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${compact ? "brand-compact" : ""}`}
      aria-label="MK Aération — accueil"
    >
      <img
        className="brand-lockup"
        src="/brand/lockup.webp"
        alt=""
        width={552}
        height={168}
        decoding="async"
      />
      <img
        className="brand-emblem"
        src="/brand/emblem.webp"
        alt=""
        width={512}
        height={480}
        decoding="async"
      />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const marketing = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = matchMedia("(min-width: 1080px)");
    const close = () => media.matches && setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("menu-open");
    menu.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab" && menu.current) {
        const items = [
          trigger.current,
          ...menu.current.querySelectorAll<HTMLElement>("a,button"),
        ].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
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
      root.classList.remove("menu-open");
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  if (hiddenShell(pathname)) return null;

  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      {marketing && (
        <div className="lp-topbar">
          <div className="lp-container"><span>Au service de la qualité de l’air.</span><a href={company.tel}><Phone size={13} aria-hidden="true" /> {company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a></div>
        </div>
      )}
      <header className={`site-header ${marketing ? "site-header-marketing" : ""} ${scrolled || open ? "is-raised" : ""}`}>
        <div className="wrap site-header-inner">
          <Brand />
          <nav className="site-nav" aria-label="Navigation principale">
            {marketing && <Link href="/" aria-current="page">Accueil</Link>}
            {nav.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(pathname, href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="site-header-actions">
            <a className="header-phone" href={company.tel}>
              <span className="header-phone-label">Ligne directe</span>
              {company.phone}
            </a>
            <Link className="btn btn-primary btn-sm header-devis" href="/devis">
              {marketing ? "Demander un devis" : "Devis"}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <a
              className="icon-btn header-call"
              href={company.tel}
              aria-label={`Appeler MK Aération au ${company.phone}`}
            >
              <Phone size={18} aria-hidden="true" />
            </a>
            <button
              ref={trigger}
              type="button"
              className={`menu-btn ${open ? "is-open" : ""}`}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="menu-btn-text">{open ? "Fermer" : "Menu"}</span>
              <span className="menu-btn-icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>
      <div
        ref={menu}
        id="site-menu"
        className={`site-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="wrap site-menu-nav" aria-label="Navigation mobile">
          {[["/", "Accueil"] as const, ...nav].map(([href, label], i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="wrap site-menu-foot">
          <Link href="/devis" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
            Demander un devis <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href={company.tel} className="btn btn-ghost btn-block">
            <Phone size={17} aria-hidden="true" /> {company.phone}
          </a>
          <p className="mono">Drôme · Isère · Rhône · Haute-Savoie</p>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (hiddenShell(pathname)) return null;
  const year = new Date().getFullYear();
  if (pathname === "/") return (
    <>
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand"><Brand /><p>Réseaux aérauliques, ventilation<br />et qualité de l’air.<br />De la Drôme aux Alpes.</p></div>
            <div><h2>Découvrir</h2><Link href="/expertises">Nos expertises</Link><Link href="/realisations">Nos réalisations</Link><Link href="/entreprise">L’entreprise</Link><Link href="/actualites">Actualités</Link></div>
            <div><h2>Nous contacter</h2><a href={company.tel}>{company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a><a href={company.maps} target="_blank" rel="noreferrer">{company.address}<br />{company.city}</a></div>
            <div><h2>Zone d’intervention</h2><p>Drôme · Isère<br />Rhône · Haute-Savoie</p><Link href="/devis" className="lp-footer-quote">Parlons de votre projet <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          </div>
          <div className="lp-footer-bottom"><span>© {year} MK Aération. Tous droits réservés.</span><div><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/connexion">Espace équipe</Link></div></div>
        </div>
      </footer>
      <MobileDock pathname={pathname} />
    </>
  );
  return (
    <>
      <footer className="site-footer">
        <div className="wrap">
          <div className="cartouche">
            <div className="cartouche-brand">
              <img
                src="/brand/logo-mk-aeration.webp"
                alt="MK Aération — Au service de la qualité de l’air"
                width={720}
                height={746}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="cartouche-cell">
              <span className="cartouche-key">Explorer</span>
              <Link href="/realisations">Réalisations</Link>
              <Link href="/expertises">Expertises</Link>
              <Link href="/actualites">Actualités</Link>
              <Link href="/entreprise">L’entreprise</Link>
              <Link href="/devis">Demander un devis</Link>
            </div>
            <div className="cartouche-cell">
              <span className="cartouche-key">Métiers</span>
              <Link href="/expertises#reseaux">Réseaux aérauliques</Link>
              <Link href="/expertises#vmc">CTA &amp; VMC</Link>
              <Link href="/expertises#extraction">Soufflage &amp; extraction</Link>
              <Link href="/entreprise#zone">Zone d’intervention</Link>
            </div>
            <div className="cartouche-cell cartouche-contact">
              <span className="cartouche-key">Contact</span>
              <a className="cartouche-phone" href={company.tel}>
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`}>
                <Mail size={15} aria-hidden="true" /> {company.email}
              </a>
              <a href={company.maps} target="_blank" rel="noreferrer">
                <MapPin size={15} aria-hidden="true" />
                <span>
                  {company.address}, {company.city}
                </span>
              </a>
            </div>
            <dl className="cartouche-meta">
              <div>
                <dt>Ouvrage</dt>
                <dd>Réseaux aérauliques · CTA · VMC</dd>
              </div>
              <div>
                <dt>Secteur</dt>
                <dd>26 · 38 · 69 · 74</dd>
              </div>
              <div>
                <dt>Folio</dt>
                <dd>© {year} MK Aération</dd>
              </div>
              <div className="cartouche-links">
                <Link href="/mentions-legales">Mentions légales</Link>
                <Link href="/confidentialite">Confidentialité</Link>
                <Link href="/connexion">Espace équipe</Link>
              </div>
            </dl>
          </div>
        </div>
      </footer>
      <MobileDock pathname={pathname} />
    </>
  );
}

/**
 * Sur mobile (navigateur) : barre d’actions Appeler / Devis.
 * En application installée sur l’écran d’accueil : barre d’onglets façon iOS.
 */
function MobileDock({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(pathname !== "/");
  useEffect(() => {
    if (pathname !== "/") {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  const tabs = [
    ["/", "Accueil", House],
    ["/realisations", "Chantiers", Layers],
    ["/actualites", "Actus", Newspaper],
    ["/devis", "Devis", FileText],
    ["/equipe", "Équipe", UserRound],
  ] as const;
  return (
    <>
      {pathname !== "/devis" && (
        <div className={`action-dock ${visible ? "is-visible" : ""}`}>
          <a href={company.tel} className="action-dock-call">
            <Phone size={18} aria-hidden="true" />
            Appeler
          </a>
          <Link href="/devis" className="action-dock-quote">
            Demander un devis
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      )}
      <nav className="tab-bar" aria-label="Navigation de l’application">
        {tabs.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
          >
            <Icon size={23} strokeWidth={isActive(pathname, href) ? 2.1 : 1.6} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export function ContactBanner() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="wrap">
        <AirFlow label="Votre projet" />
        <div className="cta-grid">
          <div>
            <p className="label label-light">Un plan, un chantier, une question</p>
            <h2 id="cta-title">
              Parlons de votre
              <br />
              <em>réseau.</em>
            </h2>
          </div>
          <div className="cta-actions">
            <a className="cta-phone" href={company.tel}>
              <span className="mono">Ligne directe</span>
              {company.phone}
            </a>
            <Link href="/devis" className="btn btn-light btn-lg">
              Demander un devis <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <a className="cta-mail" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
