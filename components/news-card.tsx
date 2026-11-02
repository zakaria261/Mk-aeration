import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "./photo";
import type { TeamPost } from "@/lib/cms-types";
export function NewsCard({ post }: { post: TeamPost }) {
  const d = post.published!;
  const cover = d.media.find((m) => m.id === d.coverId)!;
  return (
    <Link href={`/actualites/${post.slug}`} className="news-card">
      <Photo
        src={`/media/${cover.id}`}
        width={cover.width}
        height={cover.height}
        alt={cover.alt}
        loading="lazy"
      />
      <span className="eyebrow">
        {post.published_at &&
          new Date(post.published_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
      </span>
      <h3>{d.title}</h3>
      <p>{d.summary}</p>
      <span className="text-link">
        Lire l’actualité <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}
