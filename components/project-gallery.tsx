"use client";
import { useState } from "react";
import type { ProjectCardData } from "@/lib/content";
import { ProjectCard } from "./ui";
export function ProjectGallery({ projects }: { projects: ProjectCardData[] }) {
  const [filter, setFilter] = useState("Tous les chantiers");
  const visible = projects.filter(
    (p) => filter === "Tous les chantiers" || p.category === filter,
  );
  const filters = [
    "Tous les chantiers",
    ...new Set(projects.map((project) => project.category)),
  ];
  return (
    <>
      <div className="project-filters" aria-label="Filtrer les réalisations">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
            <span>
              {String(
                f === "Tous les chantiers"
                  ? projects.length
                  : projects.filter((project) => project.category === f).length,
              ).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
      <div className="gallery-grid" aria-live="polite">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} />
        ))}
      </div>
    </>
  );
}
