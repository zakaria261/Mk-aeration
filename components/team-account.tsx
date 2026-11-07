"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ChevronRight,
  Eye,
  FileText,
  Globe,
  LoaderCircle,
  LogOut,
  Settings2,
  Users,
} from "lucide-react";
import { teamAuthClient } from "@/lib/auth/client";
import type { TeamMember } from "@/lib/cms-types";
import { haptic } from "@/lib/haptics";
import { InstallHint } from "./app-runtime";
import { Sheet } from "./team-sheet";

/** Feuille d’action : confirmer la déconnexion (action destructive). */
export function SignOutSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    haptic("warning");
    setLeaving(true);
    setError("");
    try {
      const { error } = await teamAuthClient.signOut();
      if (error) throw new Error();
      window.location.assign("/connexion");
    } catch {
      setError(
        "La déconnexion a échoué. Vérifiez votre connexion puis réessayez.",
      );
      setLeaving(false);
    }
  }
  return (
    <Sheet
      open={open}
      onClose={onClose}
      labelledBy="signout-title"
      variant="action"
    >
      <div className="ios-action-group">
        <p id="signout-title" className="ios-action-message">
          Vous devrez saisir un nouveau code reçu par e-mail pour revenir dans
          MK Gestion.
        </p>
        <button
          type="button"
          className="ios-action is-destructive"
          disabled={leaving}
          onClick={signOut}
        >
          {leaving && <LoaderCircle className="spin" size={18} />}
          Se déconnecter
        </button>
      </div>
      {error && (
        <p className="team-error" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="ios-action is-cancel" onClick={onClose}>
        Annuler
      </button>
    </Sheet>
  );
}

function Row({
  href,
  icon,
  tone,
  label,
  detail,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  tone: string;
  label: string;
  detail?: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className="ios-row"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={`ios-row-icon is-${tone}`}>{icon}</span>
      <span className="ios-row-text">
        <strong>{label}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <ChevronRight className="ios-chevron" size={18} aria-hidden="true" />
    </Link>
  );
}

export function TeamAccount({ member }: { member: TeamMember }) {
  const [signOut, setSignOut] = useState(false);
  const close = useCallback(() => setSignOut(false), []);
  const isAdmin = member.role === "admin";
  const initials = member.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <main className="team-main ios-settings" id="contenu">
      <div className="team-page-heading">
        <div>
          <h1>Compte</h1>
        </div>
      </div>
      <section className="ios-profile" aria-label="Votre profil">
        <span className="ios-profile-avatar" aria-hidden="true">
          {initials}
        </span>
        <div>
          <strong>{member.name}</strong>
          <small>
            {member.email} · {isAdmin ? "Administrateur" : "Collaborateur"}
          </small>
        </div>
      </section>

      <InstallHint />

      {isAdmin && (
        <>
          <h2 className="ios-group-header">Le site</h2>
          <div className="ios-group">
            <Row
              href="/equipe/contenu"
              icon={<FileText size={18} />}
              tone="blue"
              label="Page d’accueil"
              detail="Textes et photo principale"
            />
            <Row
              href="/equipe/reglages"
              icon={<Settings2 size={18} />}
              tone="gray"
              label="Site & entreprise"
              detail="Prestations, photos, coordonnées"
            />
            <Row
              href="/equipe/apercu"
              icon={<Eye size={18} />}
              tone="indigo"
              label="Aperçu des brouillons"
            />
          </div>
          <h2 className="ios-group-header">Équipe</h2>
          <div className="ios-group">
            <Row
              href="/equipe/membres"
              icon={<Users size={18} />}
              tone="green"
              label="Membres et accès"
            />
          </div>
        </>
      )}

      <div className="ios-group">
        <Row
          href="/"
          icon={<Globe size={18} />}
          tone="teal"
          label="Voir le site public"
          external
        />
      </div>

      <div className="ios-group">
        <button
          type="button"
          className="ios-row is-destructive"
          onClick={() => {
            haptic("light");
            setSignOut(true);
          }}
        >
          <span className="ios-row-icon is-red">
            <LogOut size={18} />
          </span>
          <span className="ios-row-text">
            <strong>Se déconnecter</strong>
          </span>
        </button>
      </div>
      <p className="ios-group-footer">
        MK Gestion · l’application privée du site MK Aération.
      </p>
      <SignOutSheet open={signOut} onClose={close} />
    </main>
  );
}
