import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "./photo";
import type { TeamPost } from "@/lib/cms-types";

const fmt = (iso: string | Date) => {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("fr-FR", { day: "2-digit", timeZone: "Europe/Paris" }),
    month: d.toLocaleDateString("fr-FR", { month: "short", timeZone: "Europe/Paris" }).replace(".", ""),
    year: d.toLocaleDateString("fr-FR", { year: "numeric", timeZone: "Europe/Paris" }),
  };
};

export function NewsCard({ post }: { post: TeamPost }) {
  const d = post.published!;
  const cover = d.media.find((m) => m.id === d.coverId)!;
  const date = post.published_at ? fmt(post.published_at) : null;
  return (
    <Link href={`/actualites/${post.slug}`} className="log-entry">
      {date && (
        <time className="log-date" dateTime={new Date(post.published_at!).toISOString()}>
          <strong>{date.day}</strong>
          <span>
            {date.month} {date.year}
          </span>
        </time>
      )}
      <div className="log-body">
        <h3>{d.title}</h3>
        <p>{d.summary}</p>
        {d.location && <span className="mono log-place">{d.location}</span>}
      </div>
      <div className="log-media">
        <Photo
          src={`/media/${cover.id}`}
          width={cover.width}
          height={cover.height}
          alt={cover.alt}
          loading="lazy"
          sizes="(max-width: 720px) 100vw, 320px"
        />
      </div>
      <span className="log-arrow" aria-hidden="true">
        <ArrowUpRight size={20} />
      </span>
    </Link>
  );
}
