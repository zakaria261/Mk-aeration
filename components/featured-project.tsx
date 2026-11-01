import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Photo } from "./photo";
import { SectionLabel } from "./ui";

export function FeaturedProject({ light = false }: { light?: boolean }) {
  return (
    <article
      className={`featured-project ${light ? "featured-project-light" : ""}`}
    >
      <div className="featured-project-context">
        <figure>
          <Photo
            src="/images/forum-grenoble-projet.webp"
            alt="Vue architecturale du Forum de la Métropole de Grenoble"
            width={1200}
            height={899}
            loading="lazy"
            sizes="(max-width: 800px) 100vw, 55vw"
          />
          <figcaption>
            <span>TERTIAIRE · GRENOBLE</span>
            <strong>Forum de la Métropole</strong>
            <small>Vue architecturale du projet</small>
          </figcaption>
        </figure>
        <Link
          href="/realisations/forum-metropole-grenoble"
          className="featured-project-link"
        >
          Voir le dossier du chantier
          <ArrowUpRight size={22} />
        </Link>
      </div>
      <div className="featured-project-work">
        <SectionLabel light={!light}>
          NOTRE TRAVAIL, SUR LE TERRAIN
        </SectionLabel>
        <figure>
          <Photo
            src="/images/grenoble-gaines-rectangulaires.webp"
            alt="Pose de gaines aérauliques rectangulaires dans les réservations en toiture du chantier de Grenoble"
            width={800}
            height={600}
            loading="lazy"
          />
          <figcaption>
            PHOTO DE CHANTIER · GAINES RECTANGULAIRES EN TOITURE
          </figcaption>
        </figure>
        <h3>
          13 COLONNES.
          <br />
          DU R+2 À LA TERRASSE.
        </h3>
        <p>
          Gaines circulaires et rectangulaires, traversées de niveaux,
          préparation des raccordements aux CTA. Une intervention aéraulique à
          l’échelle de ce bâtiment tertiaire.
        </p>
        <Link
          href="/realisations/forum-metropole-grenoble"
          className="text-link"
        >
          Les photos et le détail de notre intervention
          <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
}
