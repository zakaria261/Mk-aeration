import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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
  return (
    <article
      className={`publication-view ${preview ? "publication-preview" : ""}`}
    >
      {!preview && (
        <Link
          href={kind === "realisation" ? "/realisations" : "/actualites"}
          className="text-link"
        >
          <ArrowLeft size={17} />
          {kind === "realisation"
            ? "Toutes les réalisations"
            : "Toutes les actualités"}
        </Link>
      )}
      <div className="publication-heading">
        <span className="eyebrow">
          {kind === "realisation"
            ? d.sector || "RÉALISATION"
            : "LES NOUVELLES DE L’ÉQUIPE"}
          {d.location ? ` · ${d.location}` : ""}
        </span>
        <h1>{d.title || "Votre titre apparaîtra ici"}</h1>
        {date && (
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        )}
        <p>{d.summary || "L’introduction de votre publication."}</p>
      </div>
      {cover && (
        <figure className="publication-cover">
          <Photo
            src={`/media/${cover.id}`}
            width={cover.width}
            height={cover.height}
            alt={cover.alt}
            sizes="(max-width: 800px) 100vw, 1100px"
          />
          <figcaption>{cover.caption}</figcaption>
        </figure>
      )}
      <div className="publication-body">
        <div>
          {d.body
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
        {d.scope.length > 0 && (
          <aside>
            <span className="eyebrow">NOTRE INTERVENTION</span>
            <ul>
              {d.scope.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <Link className="button" href="/devis">
              Un projet similaire ? <ArrowUpRight size={19} />
            </Link>
          </aside>
        )}
      </div>
      {d.media.length > 1 && (
        <div className="publication-photos">
          {d.media
            .filter((m) => m.id !== cover?.id)
            .map((m) => (
              <figure key={m.id}>
                <Photo
                  src={`/media/${m.id}`}
                  width={m.width}
                  height={m.height}
                  alt={m.alt}
                  loading="lazy"
                />
                <figcaption>{m.caption}</figcaption>
              </figure>
            ))}
        </div>
      )}
    </article>
  );
}
