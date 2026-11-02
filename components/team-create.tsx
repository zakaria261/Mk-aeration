"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Camera, FileText, LoaderCircle, X } from "lucide-react";
import type { ContentKind, TeamPost } from "@/lib/cms-types";

/** Crée un brouillon puis ouvre l’éditeur. */
export function useCreatePost() {
  const router = useRouter();
  const [pending, setPending] = useState<ContentKind | null>(null);
  const [error, setError] = useState("");
  async function create(kind: ContentKind) {
    if (pending) return;
    setPending(kind);
    setError("");
    try {
      const response = await fetch("/api/equipe/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const result = (await response.json()) as { post: TeamPost; error?: string };
      if (!response.ok) throw new Error(result.error);
      router.push(`/equipe/publications/${result.post.id}`);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "La création a échoué. Réessayez.");
      setPending(null);
    }
  }
  return { create, pending, error, setError };
}

/** Feuille d’actions façon iOS : choisir le type de publication. */
export function CreateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { create, pending, error } = useCreatePost();
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose]);
  return (
    <div className={`team-sheet ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <button type="button" className="team-sheet-backdrop" aria-label="Fermer" onClick={onClose} tabIndex={-1} />
      <div className="team-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <span className="team-sheet-grabber" aria-hidden="true" />
        <h2 id="sheet-title">Que voulez-vous publier ?</h2>
        <button ref={first} type="button" className="team-sheet-option" disabled={!!pending} onClick={() => create("realisation")}>
          <span className="team-sheet-icon">
            {pending === "realisation" ? <LoaderCircle className="spin" size={22} /> : <Camera size={22} />}
          </span>
          <span>
            <strong>Une réalisation</strong>
            <small>Un chantier, ses photos, votre intervention</small>
          </span>
        </button>
        <button type="button" className="team-sheet-option" disabled={!!pending} onClick={() => create("actualite")}>
          <span className="team-sheet-icon">
            {pending === "actualite" ? <LoaderCircle className="spin" size={22} /> : <FileText size={22} />}
          </span>
          <span>
            <strong>Une actualité</strong>
            <small>Un avancement, une nouvelle de l’équipe</small>
          </span>
        </button>
        {error && (
          <p className="team-error" role="alert">
            {error}
          </p>
        )}
        <button type="button" className="team-sheet-cancel" onClick={onClose}>
          <X size={18} aria-hidden="true" /> Annuler
        </button>
      </div>
    </div>
  );
}
