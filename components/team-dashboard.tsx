"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  ArrowUpRight,
  FileText,
  Camera,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
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
            {all
              ? "Les publications."
              : `Bonjour ${member.name.split(" ")[0]}.`}
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
          {member.role === "admin" && (
            <section className="team-recent">
              <Link href="/equipe/demandes">
                <strong>
                  {newContacts} demande{newContacts > 1 ? "s" : ""} à traiter
                </strong>
                <ArrowUpRight size={18} />
              </Link>
              {updates.length > 0 && (
                <details>
                  <summary>Dernières modifications du site</summary>
                  <ul>
                    {updates.map((u, i) => (
                      <li key={i}>
                        <span>
                          {u.action.includes("publish")
                            ? "Publication"
                            : "Brouillon enregistré"}
                        </span>
                        <time dateTime={u.date}>
                          {new Date(u.date).toLocaleString("fr-FR", {
                            timeZone: "Europe/Paris",
                          })}
                        </time>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          )}
          {member.role === "admin" && (
            <div className="team-site-management">
              <Link href="/equipe/contenu">
                <FileText size={25} aria-hidden="true" />
                <span>
                  <strong>Modifier la page d’accueil</strong>
                  <small>
                    Textes, photo principale et publication sur le site.
                  </small>
                </span>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <Link href="/equipe/reglages">
                Prestations, coordonnées et références
              </Link>
              <Link href="/equipe/demandes">Demandes reçues</Link>
              <Link href="/equipe/membres">
                Gérer les accès de l’équipe{" "}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          )}
          <div className="team-stats">
            {[
              [String(posts.filter((p) => p.published).length), "en ligne"],
              [
                String(posts.filter((p) => p.status === "draft").length),
                "brouillons",
              ],
              [
                String(posts.filter((p) => p.status === "review").length),
                "à valider",
              ],
            ].map(([count, label]) => (
              <div key={label}>
                <strong>{count.padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="team-create-grid">
            <button
              type="button"
              onClick={() => create("realisation")}
              disabled={!!pending}
            >
              <Camera size={25} />
              <span>
                <strong>Montrer une réalisation</strong>
                <small>Un chantier, ses contraintes, votre intervention.</small>
              </span>
              {pending === "realisation" ? (
                <LoaderCircle className="spin" size={20} />
              ) : (
                <ArrowUpRight size={22} />
              )}
            </button>
            <button
              type="button"
              onClick={() => create("actualite")}
              disabled={!!pending}
            >
              <FileText size={25} />
              <span>
                <strong>Partager une actualité</strong>
                <small>Un avancement ou une nouvelle de l’équipe.</small>
              </span>
              {pending === "actualite" ? (
                <LoaderCircle className="spin" size={20} />
              ) : (
                <ArrowUpRight size={22} />
              )}
            </button>
          </div>
        </>
      )}
      {error && (
        <p role="alert" className="team-error">
          {error}
        </p>
      )}
      <section className="team-publications">
        <div className="team-section-title">
          <h2>{all ? "Tous les contenus" : "Les dernières publications"}</h2>
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
                  <ArrowUpRight size={20} />
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
        <aside className="team-workflow-note">
          <span className="label">Le bon réflexe</span>
          <p>
            Choisissez une photo nette, décrivez le travail réalisé et
            prévisualisez la fiche.{" "}
            {member.role === "admin"
              ? "Vous gardez la main sur la mise en ligne."
              : "Votre responsable valide la publication avant sa mise en ligne."}
          </p>
          <Link href="/realisations/tunnel-du-mont-blanc" target="_blank">
            Voir un exemple de fiche <ArrowUpRight size={16} />
          </Link>
        </aside>
      )}
    </main>
  );
}
