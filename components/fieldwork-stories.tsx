import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { ProjectVideo } from "./project-video";

export function FieldworkStories() {
  const stories = projects.filter((p) => p.video);
  return (
    <div className="field-stories" id="videos-chantier">
      {stories.map((project) => (
        <article className="field-story" key={project.slug}>
          <div className="field-story-heading">
            <span className="eyebrow">{project.sector.toUpperCase()}</span>
            <h3>{project.title.toUpperCase()}</h3>
          </div>
          <div className="field-story-body">
            <ProjectVideo video={project.video!} />
            <div className="field-story-copy">
              {project.figures && (
                <dl className="project-figures">
                  {project.figures.map((figure) => (
                    <div key={figure.label}><dt>{figure.value}</dt><dd>{figure.label}</dd></div>
                  ))}
                </dl>
              )}
              <p>{project.objective}</p>
              <Link href={`/realisations/${project.slug}`} className="text-link">
                {project.figures ? "Les photos et les étapes" : "Découvrir l’intervention"}
                <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
