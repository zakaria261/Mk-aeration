"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Files,
  Users,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { teamAuthClient } from "@/lib/auth/client";
import type { TeamMember } from "@/lib/cms-types";
export function TeamShell({
  member,
  children,
}: {
  member: TeamMember;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [leaving, setLeaving] = useState(false);
  async function logout() {
    setLeaving(true);
    try {
      const { error } = await teamAuthClient.signOut();
      if (error) throw new Error();
      window.location.assign("/connexion");
    } catch {
      window.alert(
        "La déconnexion a échoué. Vérifiez votre connexion puis réessayez.",
      );
      setLeaving(false);
    }
  }
  return (
    <div className="team-shell">
      <aside className="team-sidebar">
        <Link href="/equipe" className="team-wordmark">
          <img
            src="/images/logo-mk-aeration.jpg"
            alt="MK Aération"
            width={78}
            height={78}
          />
          <span>
            ESPACE
            <br />
            <strong>ÉQUIPE</strong>
          </span>
        </Link>
        <span className="team-nav-label">L’ATELIER DES CHANTIERS</span>
        <nav aria-label="Navigation espace équipe">
          {[
            ["/equipe", "Vue d’ensemble", LayoutDashboard],
            ["/equipe/publications", "Publications", Files],
            ...(member.role === "admin"
              ? [["/equipe/membres", "Équipe & accès", Users]]
              : []),
          ].map(([href, label, Icon]) => {
            const I = Icon as typeof Files;
            return (
              <Link
                key={String(href)}
                href={String(href)}
                className={
                  path === href ||
                  (href !== "/equipe" && path.startsWith(String(href)))
                    ? "active"
                    : ""
                }
              >
                <I size={19} />
                {String(label)}
              </Link>
            );
          })}
        </nav>
        <div className="team-sidebar-bottom">
          <Link href="/" target="_blank">
            Voir le site public <ArrowUpRight size={17} />
          </Link>
          <div className="team-profile">
            <span>{member.name.slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{member.name}</strong>
              <small>
                {member.role === "admin" ? "Administrateur" : "Collaborateur"}
              </small>
            </div>
          </div>
          <button type="button" disabled={leaving} onClick={logout}>
            <LogOut size={17} />
            Se déconnecter
          </button>
        </div>
      </aside>
      <div className="team-workspace">
        <header className="team-topbar">
          <span>
            <ShieldCheck size={16} /> ESPACE PRIVÉ
          </span>
          <div className="team-topbar-actions">
            <Link href="/" target="_blank">
              Le site <ArrowUpRight size={17} />
            </Link>
            <button
              type="button"
              aria-label="Se déconnecter"
              title="Se déconnecter"
              disabled={leaving}
              onClick={logout}
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
