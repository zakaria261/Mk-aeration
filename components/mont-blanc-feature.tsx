import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "./photo";

export function MontBlancFeature({ hero = false }: { hero?: boolean }) {
  return (
    <article className={`mont-feature ${hero ? "mont-feature-hero" : ""}`}>
      <Link
        href="/realisations/tunnel-du-mont-blanc"
        className="mont-feature-image"
        aria-label="Découvrir notre intervention au tunnel du Mont-Blanc"
      >
        <Photo
          src="/images/mont-blanc-presentation.webp"
          alt="Tunnel du Mont-Blanc — visuel de présentation MK Aération"
          width={1461}
          height={720}
          sizes="(max-width: 800px) 100vw, 1280px"
          fetchPriority={hero ? "high" : undefined}
          loading={hero ? "eager" : "lazy"}
        />
        <span className="mont-feature-corner">
          <ArrowUpRight size={25} />
        </span>
      </Link>
      <div className="mont-feature-caption">
        <div>
          <span className="eyebrow">FRANCE · ITALIE / INFRASTRUCTURES</span>
          <h2>TUNNEL DU MONT-BLANC</h2>
          <p>
            Ventilation des locaux techniques, supportage et réseaux
            hydrauliques.
          </p>
        </div>
        <Link href="/realisations/tunnel-du-mont-blanc" className="text-link">
          Le détail de notre intervention <ArrowUpRight size={19} />
        </Link>
      </div>
      <div className="mont-feature-facts">
        <span>
          <strong>8 mois</strong> d’intervention
        </span>
        <span>
          <strong>1 000 × 1 000 mm</strong> de section de gaine
        </span>
        <span>
          <strong>11,6 km</strong> de réseau PVC réparti dans les zones
          techniques
        </span>
      </div>
      <small className="mont-feature-credit">
        Visuel de présentation fourni par MK Aération.
      </small>
    </article>
  );
}
