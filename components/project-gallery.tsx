"use client";
import { useState } from "react";
import type { ProjectCardData } from "@/lib/content";
import { ProjectCard } from "./ui";

const ALL = "Tous";

export function ProjectGallery({ projects }: { projects: ProjectCardData[] }) {
  const [filter, setFilter] = useState(ALL);
  const visible = projects.filter((p) => filter === ALL || p.category === filter);
  const filters = [ALL, ...new Set(projects.map((p) => p.category))];
  return (
    <>
      <div className="chips" role="group" aria-label="Filtrer les réalisations">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="mono">
              {f === ALL ? projects.length : projects.filter((p) => p.category === f).length}
            </span>
          </button>
        ))}
      </div>
      <div className="gallery-grid" aria-live="polite">
        {visible.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={projects.indexOf(p) + 1}
            sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
          />
        ))}
      </div>
    </>
  );
}
