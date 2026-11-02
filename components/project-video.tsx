"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import type { ProjectVideo as Video } from "@/lib/content";
import { Photo } from "./photo";

export function ProjectVideo({ video }: { video: Video }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const captionId = useId();
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (started) player.current?.focus({ preventScroll: true });
  }, [started]);

  return (
    <figure className="work-film">
      <div className="work-film-stage">
        {started ? (
          <video
            ref={player}
            tabIndex={0}
            controls
            autoPlay
            playsInline
            preload="none"
            poster={video.poster}
            width={video.width}
            height={video.height}
            aria-label={video.title}
            aria-describedby={captionId}
            onError={() => setFailed(true)}
            onPlay={(event) => {
              const current = event.currentTarget;
              document.querySelectorAll("video").forEach((other) => {
                if (other !== current) other.pause();
              });
            }}
          >
            <source src={video.src} type="video/mp4" onError={() => setFailed(true)} />
            Votre navigateur ne prend pas en charge cette vidéo.
          </video>
        ) : (
          <button
            className="work-film-cover"
            type="button"
            aria-label={`Lire la vidéo : ${video.title} (${video.duration})`}
            aria-describedby={captionId}
            onClick={() => setStarted(true)}
          >
            <Photo
              src={video.poster}
              alt=""
              width={video.width}
              height={video.height}
              loading="lazy"
              sizes="(max-width: 600px) 90vw, 380px"
            />
            <span className="work-film-time">VIDÉO DE CHANTIER · {video.duration}</span>
            <span className="work-film-play"><Play size={25} fill="currentColor" /></span>
            <span className="work-film-prompt">Voir la vidéo <ArrowUpRight size={17} /></span>
          </button>
        )}
      </div>
      <figcaption id={captionId}>{video.caption}</figcaption>
      {failed && (
        <p className="work-film-error" role="status">
          La vidéo n’a pas pu être chargée. <a href={video.src}>Ouvrir la vidéo directement</a>.
        </p>
      )}
    </figure>
  );
}
