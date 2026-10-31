"use client";
import { useState } from "react";
import { projects } from "@/lib/content";
import { ProjectCard } from "./ui";
export function ProjectGallery() {
  const [filter, setFilter] = useState("Tous les chantiers");
  const visible = projects.filter(
    (p) => filter === "Tous les chantiers" || p.category === filter,
  );
  return (
    <>
      <div className="project-filters" aria-label="Filtrer les réalisations">
        {["Tous les chantiers", "CTA & double flux", "Extraction"].map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
            <span>
              {f === "Tous les chantiers"
                ? "03"
                : f === "Extraction"
                  ? "01"
                  : "02"}
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
