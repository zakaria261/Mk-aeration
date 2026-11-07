"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  FileText,
  Camera,
  ArrowRight,
  LoaderCircle,
  ChevronRight,
  House,
  Inbox,
  Settings2,
} from "lucide-react";
import { haptic } from "@/lib/haptics";
import { statusLabels, type TeamMember, type TeamPost } from "@/lib/cms-types";
import { useCreatePost } from "./team-create";
import { InstallHint } from "./app-runtime";

export function TeamDashboard({
  posts,
  member,
  all = false,
  updates = [],
  newContacts = 0,
}: {
  posts: TeamPost[];
  member: TeamMember;
  all?: boolean;
  updates?: { action: string; date: string }[];
  newContacts?: number;
}) {
  const [filter, setFilter] = useState("all");
  const { create, pending, error } = useCreatePost();
  const router = useRouter();
  const params = useSearchParams();
  const launched = useRef(false);
  // Raccourci de l’icône d’application : « Publier un chantier ».
  useEffect(() => {
    const kind = params.get("nouveau");
    if (launched.current || (kind !== "realisation" && kind !== "actualite"))
      return;
    launched.current = true;
    router.replace("/equipe");
    void create(kind);
  }, [params, router, create]);
  const visible = posts.filter((p) =>
    filter === "all"
      ? p.status !== "archived"
      : filter === "realisation" || filter === "actualite"
        ? p.kind === filter && p.status !== "archived"
        : p.status === filter,
  );
  return (
    <main className="team-main" id="contenu">
      <div className="team-page-heading">
        <div>
          <p className="label">
            {all ? "Votre bibliothèque" : "L’atelier des chantiers"}
          </p>
          <h1>
            {all ? "Publications" : `Bonjour ${member.name.split(" ")[0]}`}
          </h1>
          <p>
            {all
              ? "Préparez vos contenus, retrouvez vos brouillons et suivez leur publication."
              : "Le chantier se termine. Le savoir-faire reste visible."}
          </p>
        </div>
        {all && (
          <button
            className="team-primary"
            onClick={() => create("realisation")}
            disabled={!!pending}
          >
            <Plus size={18} /> Nouvelle réalisation
          </button>
        )}
      </div>
      {!all && (
        <>
          <InstallHint />
          <div className="ios-stats" aria-label="Vos publications">
            {[
              [posts.filter((p) => p.published).length, "En ligne"],
              [posts.filter((p) => p.status === "draft").length, "Brouillons"],
              [posts.filter((p) => p.status === "review").length, "À valider"],
            ].map(([count, label]) => (
              <div key={label}>
                <strong>{count}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <h2 className="ios-group-header">Publier sur le site</h2>
          <div className="ios-group">
            <button
              type="button"
              className="ios-row"
              onClick={() => {
                haptic("selection");
                void create("realisation");
              }}
              disabled={!!pending}
            >
              <span className="ios-row-icon is-blue">
                {pending === "realisation" ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <Camera size={18} />
                )}
              </span>
              <span className="ios-row-text">
                <strong>Nouvelle réalisation</strong>
                <small>Un chantier, ses photos, votre intervention</small>
              </span>
              <ChevronRight className="ios-chevron" size={18} />
            </button>
            <button
              type="button"
              className="ios-row"
              onClick={() => {
                haptic("selection");
                void create("actualite");
              }}
              disabled={!!pending}
            >
              <span className="ios-row-icon is-orange">
                {pending === "actualite" ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </span>
              <span className="ios-row-text">
                <strong>Nouvelle actualité</strong>
                <small>Un avancement, une nouvelle de l’équipe</small>
              </span>
              <ChevronRight className="ios-chevron" size={18} />
            </button>
          </div>
          {member.role === "admin" && (
            <>
              <h2 className="ios-group-header">Modifier le site</h2>
              <div className="ios-group">
                <Link href="/equipe/contenu" className="ios-row">
                  <span className="ios-row-icon is-indigo">
                    <House size={18} />
                  </span>
                  <span className="ios-row-text">
                    <strong>Page d’accueil</strong>
                    <small>Textes et photo principale</small>
                  </span>
                  <ChevronRight className="ios-chevron" size={18} />
                </Link>
                <Link href="/equipe/reglages" className="ios-row">
                  <span className="ios-row-icon is-gray">
                    <Settings2 size={18} />
                  </span>
                  <span className="ios-row-text">
                    <strong>Site & entreprise</strong>
                    <small>Prestations, photos, coordonnées</small>
                  </span>
                  <ChevronRight className="ios-chevron" size={18} />
                </Link>
                <Link href="/equipe/demandes" className="ios-row">
                  <span className="ios-row-icon is-green">
                    <Inbox size={18} />
                  </span>
                  <span className="ios-row-text">
                    <strong>Demandes reçues</strong>
                  </span>
                  {newContacts > 0 && (
                    <span className="ios-count">{newContacts}</span>
                  )}
                  <ChevronRight className="ios-chevron" size={18} />
                </Link>
              </div>
              {updates.length > 0 && (
                <p className="ios-group-footer">
                  Dernière modification du site le{" "}
                  {new Date(updates[0].date).toLocaleString("fr-FR", {
                    timeZone: "Europe/Paris",
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                  .
                </p>
              )}
            </>
          )}
        </>
      )}
      {error && (
        <p role="alert" className="team-error">
          {error}
        </p>
      )}
      <section className="team-publications">
        <div className="team-section-title">
          <h2>{all ? "Tous les contenus" : "Récentes"}</h2>
          {!all && (
            <Link href="/equipe/publications">
              Tout voir <ArrowRight size={16} />
            </Link>
          )}
          {all && (
            <button
              type="button"
              className="team-secondary"
              disabled={!!pending}
              onClick={() => create("actualite")}
            >
              <Plus size={17} /> Actualité
            </button>
          )}
        </div>
        <div className="team-filters">
          {[
            ["all", "Tout"],
            ["realisation", "Réalisations"],
            ["actualite", "Actualités"],
            ["draft", "Brouillons"],
            ["review", "À valider"],
            ["archived", "Archives"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {visible.length ? (
          <div className="team-post-list">
            {visible.slice(0, all ? 100 : 8).map((post) => {
              const cover = post.draft.media.find(
                (m) => m.id === post.draft.coverId,
              );
              return (
                <Link
                  key={post.id}
                  href={`/equipe/publications/${post.id}`}
                  className="team-post-row"
                >
                  <div className="team-post-thumb">
                    {cover ? (
                      <img
                        src={`/media/${cover.id}?w=480`}
                        alt=""
                        width={80}
                        height={80}
                      />
                    ) : (
                      <Camera size={23} />
                    )}
                  </div>
                  <div className="team-post-title">
                    <small>
                      {post.kind === "realisation"
                        ? "Réalisation"
                        : "Actualité"}
                    </small>
                    <strong>
                      {post.draft.title || "Publication sans titre"}
                    </strong>
                    <span>
                      Modifiée le{" "}
                      {new Date(post.updated_at).toLocaleDateString("fr-FR")}
                      {member.role === "admin" ? ` · ${post.owner_email}` : ""}
                    </span>
                  </div>
                  <span className={`team-badge ${post.status}`}>
                    {statusLabels[post.status]}
                  </span>
                  <ChevronRight className="ios-chevron" size={18} />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="team-empty">
            <Camera size={30} />
            <h3>
              {filter === "all"
                ? "Votre prochaine réalisation commence ici."
                : "Aucune publication dans cette sélection."}
            </h3>
            <p>
              Quelques photos, le contexte et les détails de l’intervention :
              votre travail mérite d’être montré.
            </p>
            {filter === "all" && (
              <button
                onClick={() => create("realisation")}
                className="team-primary"
                disabled={!!pending}
              >
                Créer ma première réalisation <Plus size={17} />
              </button>
            )}
          </div>
        )}
      </section>
      {!all && (
        <p className="ios-group-footer ios-tip">
          Choisissez une photo nette, décrivez le travail réalisé et
          prévisualisez la fiche.{" "}
          {member.role === "admin"
            ? "Vous gardez la main sur la mise en ligne."
            : "Votre responsable valide la publication avant sa mise en ligne."}
        </p>
      )}
    </main>
  );
}
