import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Photo } from "./photo";
import type { ContentDraft, ContentKind } from "@/lib/cms-types";

export function PublicationView({
  draft: d,
  kind,
  date,
  preview = false,
}: {
  draft: ContentDraft;
  kind: ContentKind;
  date?: string | null;
  preview?: boolean;
}) {
  const cover = d.media.find((m) => m.id === d.coverId) || d.media[0];
  const others = d.media.filter((m) => m.id !== cover?.id);
  return (
    <article className={`publication ${preview ? "is-preview" : ""}`}>
      <header className="publication-head">
        {!preview && (
          <nav className="crumbs mono" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            {kind === "realisation" ? (
              <Link href="/realisations">Réalisations</Link>
            ) : (
              <Link href="/actualites">Actualités</Link>
            )}
          </nav>
        )}
        <p className="label">
          {kind === "realisation" ? d.sector || "Réalisation" : "Carnet de chantier"}
          {d.location ? ` · ${d.location}` : ""}
        </p>
        <h1>{d.title || "Votre titre apparaîtra ici"}</h1>
        <div className="publication-meta">
          {date && (
            <time className="mono" dateTime={new Date(date).toISOString()}>
              {new Date(date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Europe/Paris",
              })}
            </time>
          )}
          {kind === "realisation" && d.category && <span className="mono">{d.category}</span>}
        </div>
        <p className="publication-lede">{d.summary || "L’introduction de votre publication."}</p>
      </header>
      {cover && (
        <figure className="publication-cover">
          <Photo
            src={`/media/${cover.id}`}
            width={cover.width}
            height={cover.height}
            alt={cover.alt}
            sizes="(max-width: 1100px) 100vw, 1100px"
            fetchPriority={preview ? undefined : "high"}
          />
          {cover.caption && <figcaption className="media-caption">{cover.caption}</figcaption>}
        </figure>
      )}
      <div className="publication-body">
        <div className="publication-text">
          {d.body
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
        {d.scope.length > 0 && (
          <aside className="story-scope">
            <p className="cartouche-key">Notre intervention</p>
            <ul className="checks">
              {d.scope.map((item, i) => (
                <li key={i}>
                  <Check size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            {!preview && (
              <Link className="btn btn-primary btn-block" href="/devis">
                Un projet similaire ? <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            )}
          </aside>
        )}
      </div>
      {others.length > 0 && (
        <div className="photo-grid publication-photos">
          {others.map((m) => (
            <figure key={m.id}>
              <Photo
                src={`/media/${m.id}`}
                width={m.width}
                height={m.height}
                alt={m.alt}
                loading="lazy"
                sizes="(max-width: 720px) 100vw, 50vw"
              />
              {m.caption && <figcaption className="media-caption">{m.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}
