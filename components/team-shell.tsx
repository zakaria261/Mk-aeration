"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  LayoutGrid,
  Files,
  Users,
  ArrowUpRight,
  LogOut,
  Plus,
  Globe,
  Settings2,
} from "lucide-react";
import { teamAuthClient } from "@/lib/auth/client";
import type { TeamMember } from "@/lib/cms-types";
import { CreateSheet } from "./team-create";

export function TeamShell({
  member,
  children,
}: {
  member: TeamMember;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [leaving, setLeaving] = useState(false);
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  // La feuille se referme dès qu’une page s’ouvre (ex. l’éditeur créé).
  useEffect(() => setSheet(false), [path]);
  const isAdmin = member.role === "admin";
  const initials = member.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function logout() {
    if (!window.confirm("Se déconnecter de l’espace équipe ?")) return;
    setLeaving(true);
    try {
      const { error } = await teamAuthClient.signOut();
      if (error) throw new Error();
      window.location.assign("/connexion");
    } catch {
      window.alert("La déconnexion a échoué. Vérifiez votre connexion puis réessayez.");
      setLeaving(false);
    }
  }

  const links = [
    ["/equipe", "Accueil", LayoutGrid],
    ["/equipe/publications", "Publications", Files],
    ...(isAdmin ? ([["/equipe/contenu", "Contenu du site", Settings2], ["/equipe/membres", "Équipe", Users]] as const) : []),
  ] as const;
  const active = (href: string) =>
    href === "/equipe" ? path === href : path.startsWith(href);
  const inEditor = /^\/equipe\/publications\/[^/]+$/.test(path);

  return (
    <div className={`team-shell ${inEditor ? "is-editing" : ""}`}>
      <aside className="team-sidebar">
        <Link href="/equipe" className="team-wordmark">
          <img src="/brand/emblem.webp" alt="" width={512} height={480} />
          <span>
            MK Aération
            <strong>Espace équipe</strong>
          </span>
        </Link>
        <button type="button" className="team-new" onClick={() => setSheet(true)}>
          <Plus size={18} aria-hidden="true" /> Nouvelle publication
        </button>
        <nav aria-label="Navigation espace équipe">
          {links.map(([href, label, Icon]) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
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
          <span className="team-avatar" aria-hidden="true">{initials}</span>
          <div>
            <strong>{member.name}</strong>
            <small>{isAdmin ? "Administrateur" : "Collaborateur"}</small>
          </div>
          <button type="button" disabled={leaving} onClick={logout} aria-label="Se déconnecter" title="Se déconnecter">
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <header className="team-appbar">
        <Link href="/equipe" className="team-appbar-brand" aria-label="Espace équipe — accueil">
          <img src="/brand/emblem.webp" alt="" width={512} height={480} />
          <span>MK Gestion</span>
        </Link>
        <button type="button" className="team-appbar-profile" onClick={logout} disabled={leaving} aria-label={`${member.name} — se déconnecter`}>
          <span className="team-avatar" aria-hidden="true">{initials}</span>
          <LogOut size={17} aria-hidden="true" />
        </button>
      </header>

      <div className="team-workspace">{children}</div>

      <nav className="team-tabbar" aria-label="Navigation de l’espace équipe">
        <Link href="/equipe" aria-current={active("/equipe") ? "page" : undefined}>
          <LayoutGrid size={23} aria-hidden="true" />
          <span>Accueil</span>
        </Link>
        <Link href="/equipe/publications" aria-current={active("/equipe/publications") ? "page" : undefined}>
          <Files size={23} aria-hidden="true" />
          <span>Publications</span>
        </Link>
        <button type="button" className="team-tabbar-new" onClick={() => setSheet(true)} aria-label="Nouvelle publication">
          <span>
            <Plus size={26} strokeWidth={2.2} aria-hidden="true" />
          </span>
        </button>
        {isAdmin ? (
          <Link href="/equipe/contenu" aria-current={active("/equipe/contenu") ? "page" : undefined}>
            <Settings2 size={23} aria-hidden="true" />
            <span>Contenu</span>
          </Link>
        ) : (
          <span className="team-tabbar-spacer" aria-hidden="true" />
        )}
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <Globe size={23} aria-hidden="true" />
          <span>Le site</span>
        </Link>
      </nav>

      <CreateSheet open={sheet} onClose={closeSheet} />
    </div>
  );
}
