"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, ChevronRight, FileText, LoaderCircle } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { Sheet } from "./team-sheet";
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
      const result = (await response.json()) as {
        post: TeamPost;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error);
      router.push(`/equipe/publications/${result.post.id}`);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "La création a échoué. Réessayez.",
      );
      setPending(null);
    }
  }
  return { create, pending, error, setError };
}

/** Feuille façon iOS : choisir le type de publication. */
export function CreateSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { create, pending, error } = useCreatePost();
  function choose(kind: ContentKind) {
    haptic("selection");
    void create(kind);
  }
  return (
    <Sheet open={open} onClose={onClose} labelledBy="sheet-title">
      <h2 id="sheet-title" className="ios-sheet-title">
        Nouvelle publication
      </h2>
      <p className="ios-sheet-subtitle">
        Ajoutez un chantier ou une nouvelle sur le site.
      </p>
      <div className="ios-group">
        <button
          type="button"
          className="ios-row"
          disabled={!!pending}
          onClick={() => choose("realisation")}
        >
          <span className="ios-row-icon is-blue">
            {pending === "realisation" ? (
              <LoaderCircle className="spin" size={20} />
            ) : (
              <Camera size={20} />
            )}
          </span>
          <span className="ios-row-text">
            <strong>Une réalisation</strong>
            <small>Un chantier, ses photos, votre intervention</small>
          </span>
          <ChevronRight className="ios-chevron" size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="ios-row"
          disabled={!!pending}
          onClick={() => choose("actualite")}
        >
          <span className="ios-row-icon is-orange">
            {pending === "actualite" ? (
              <LoaderCircle className="spin" size={20} />
            ) : (
              <FileText size={20} />
            )}
          </span>
          <span className="ios-row-text">
            <strong>Une actualité</strong>
            <small>Un avancement, une nouvelle de l’équipe</small>
          </span>
          <ChevronRight className="ios-chevron" size={18} aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p className="team-error" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="ios-sheet-cancel" onClick={onClose}>
        Annuler
      </button>
    </Sheet>
  );
}
