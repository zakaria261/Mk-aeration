"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  House,
  Images,
  Globe,
  Inbox,
  CircleUserRound,
  ChevronLeft,
  Plus,
  ArrowUpRight,
  LogOut,
  Settings2,
  FileText,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TeamMember } from "@/lib/cms-types";
import { haptic } from "@/lib/haptics";
import { CreateSheet } from "./team-create";
import { SignOutSheet } from "./team-account";

type Tab = { href: string; label: string; icon: LucideIcon; match: string[] };

/** Titre court de chaque écran, affiché dans la barre compacte. */
function screenTitle(path: string) {
  if (/^\/equipe\/publications\/[^/]+$/.test(path)) return "Publication";
  if (path.startsWith("/equipe/publications")) return "Publications";
  if (path.startsWith("/equipe/reglages")) return "Site & entreprise";
  if (path.startsWith("/equipe/contenu")) return "Page d’accueil";
  if (path.startsWith("/equipe/demandes")) return "Demandes";
  if (path.startsWith("/equipe/membres")) return "Équipe";
  if (path.startsWith("/equipe/compte")) return "Compte";
  return "Accueil";
}

/** Bouton retour des écrans de second niveau. */
function backLink(path: string): [string, string] | null {
  if (/^\/equipe\/publications\/[^/]+$/.test(path))
    return ["/equipe/publications", "Publications"];
  if (path.startsWith("/equipe/contenu")) return ["/equipe/reglages", "Site"];
  if (path.startsWith("/equipe/membres")) return ["/equipe/compte", "Compte"];
  return null;
}

const editable =
  "input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=file]):not([type=range]), textarea, select, [contenteditable='true']";

export function TeamShell({
  member,
  children,
}: {
  member: TeamMember;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const navbar = useRef<HTMLElement>(null);
  const [sheet, setSheet] = useState(false);
  const [signOut, setSignOut] = useState(false);
  const [compact, setCompact] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  const closeSignOut = useCallback(() => setSignOut(false), []);
  const isAdmin = member.role === "admin";
  const inEditor = /^\/equipe\/publications\/[^/]+$/.test(path);
  const title = screenTitle(path);
  const back = backLink(path);
  const canCreate = path === "/equipe" || path === "/equipe/publications";

  // Les feuilles se referment dès qu’un autre écran s’ouvre.
  const [shownPath, setShownPath] = useState(path);
  if (shownPath !== path) {
    setShownPath(path);
    setSheet(false);
    setSignOut(false);
  }

  // Grand titre → titre compact centré quand il passe sous la barre.
  useEffect(() => {
    const heading = document.querySelector(".team-workspace h1");
    const bar = navbar.current;
    if (!heading || !bar) {
      setCompact(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { rootMargin: `-${bar.offsetHeight}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(heading);
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [path]);

  // Clavier ouvert : la barre d’onglets s’efface.
  useEffect(() => {
    const touch = matchMedia("(pointer: coarse)");
    const isEditable = (node: EventTarget | null) =>
      node instanceof HTMLElement && node.matches(editable);
    const onFocusIn = (event: FocusEvent) => {
      if (touch.matches && isEditable(event.target)) setKeyboard(true);
    };
    const onFocusOut = () => {
      window.setTimeout(() => {
        if (!isEditable(document.activeElement)) setKeyboard(false);
      }, 60);
    };
    const viewport = window.visualViewport;
    const onResize = () => {
      if (!viewport || !touch.matches) return;
      const open = window.innerHeight - viewport.height > 140;
      if (!open && !isEditable(document.activeElement)) setKeyboard(false);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    viewport?.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      viewport?.removeEventListener("resize", onResize);
    };
  }, []);

  const tabs: Tab[] = [
    { href: "/equipe", label: "Accueil", icon: House, match: ["/equipe"] },
    {
      href: "/equipe/publications",
      label: "Publications",
      icon: Images,
      match: ["/equipe/publications"],
    },
    ...(isAdmin
      ? [
          {
            href: "/equipe/reglages",
            label: "Site",
            icon: Globe,
            match: ["/equipe/reglages", "/equipe/contenu"],
          },
          {
            href: "/equipe/demandes",
            label: "Demandes",
            icon: Inbox,
            match: ["/equipe/demandes"],
          },
        ]
      : []),
    {
      href: "/equipe/compte",
      label: "Compte",
      icon: CircleUserRound,
      match: ["/equipe/compte", "/equipe/membres"],
    },
  ];
  const isActive = (tab: Tab) =>
    tab.match.some((m) =>
      m === "/equipe" ? path === "/equipe" : path.startsWith(m),
    );

  const sideLinks: [string, string, LucideIcon][] = [
    ["/equipe", "Accueil", House],
    ["/equipe/publications", "Publications", Images],
    ...(isAdmin
      ? ([
          ["/equipe/reglages", "Site & entreprise", Settings2],
          ["/equipe/contenu", "Page d’accueil", FileText],
          ["/equipe/demandes", "Demandes reçues", Inbox],
          ["/equipe/membres", "Équipe", Users],
        ] as [string, string, LucideIcon][])
      : []),
    ["/equipe/compte", "Compte", CircleUserRound],
  ];
  const sideActive = (href: string) =>
    href === "/equipe" ? path === href : path.startsWith(href);
  const initials = member.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`team-shell ios-app ${inEditor ? "is-editing" : ""} ${keyboard ? "has-keyboard" : ""}`}
    >
      <aside className="team-sidebar">
        <Link href="/equipe" className="team-wordmark">
          <img src="/brand/emblem.webp" alt="" width={512} height={480} />
          <span>
            MK Aération
            <strong>MK Gestion</strong>
          </span>
        </Link>
        <button
          type="button"
          className="team-new"
          onClick={() => setSheet(true)}
        >
          <Plus size={18} aria-hidden="true" /> Nouvelle publication
        </button>
        <nav aria-label="Navigation espace équipe">
          {sideLinks.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              aria-current={sideActive(href) ? "page" : undefined}
            >
              <Icon size={19} aria-hidden="true" />
              {label}
            </Link>
          ))}
          <Link href="/" target="_blank">
            <Globe size={19} aria-hidden="true" />
            Le site public
            <ArrowUpRight size={15} className="team-ext" aria-hidden="true" />
          </Link>
        </nav>
        <div className="team-profile">
          <span className="team-avatar" aria-hidden="true">
            {initials}
          </span>
          <div>
            <strong>{member.name}</strong>
            <small>{isAdmin ? "Administrateur" : "Collaborateur"}</small>
          </div>
          <button
            type="button"
            onClick={() => setSignOut(true)}
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <header
        ref={navbar}
        className={`ios-navbar ${scrolled ? "is-scrolled" : ""} ${compact ? "is-compact" : ""}`}
      >
        <div className="ios-navbar-side">
          {back && (
            <Link
              href={back[0]}
              className="ios-navbar-back"
              onClick={() => haptic("selection")}
            >
              <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" />
              <span>{back[1]}</span>
            </Link>
          )}
        </div>
        <p className="ios-navbar-title" aria-hidden={!compact}>
          {title}
        </p>
        <div className="ios-navbar-side is-trailing">
          {canCreate && (
            <button
              type="button"
              className="ios-navbar-action"
              aria-label="Nouvelle publication"
              onClick={() => {
                haptic("light");
                setSheet(true);
              }}
            >
              <Plus size={26} strokeWidth={2.2} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <div className="team-workspace">
        <div className="ios-screen" key={path}>
          {children}
        </div>
      </div>

      <nav className="ios-tabbar" aria-label="Navigation de l’application">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                if (!active) haptic("selection");
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Icon
                size={25}
                strokeWidth={active ? 2.3 : 1.8}
                aria-hidden="true"
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <CreateSheet open={sheet} onClose={closeSheet} />
      <SignOutSheet open={signOut} onClose={closeSignOut} />
    </div>
  );
}
