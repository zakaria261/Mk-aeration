import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "./photo";
import { Cote } from "./drawing";

export const montBlancSpecs = [
  { value: "8 mois", label: "de travaux, chantier terminé" },
  {
    value: "1 000 × 1 000",
    unit: "mm",
    label: "gaine carrée · amenée d’air d’un local électrique",
  },
  {
    value: "11,6",
    unit: "km",
    label: "de réseau PVC Ø125 dans les zones techniques",
  },
  { value: "De nuit", label: "interventions dans les refuges du tunnel" },
];

export function MontBlancSpecs({ className = "" }: { className?: string }) {
  return (
    <dl className={`specs ${className}`}>
      {montBlancSpecs.map((s) => (
        <div key={s.label}>
          <dt>
            {s.value}
            {s.unit && <small> {s.unit}</small>}
          </dt>
          <dd>{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Mise en avant du tunnel du Mont-Blanc (page Réalisations). */
export function MontBlancFeature() {
  return (
    <article className="mb-feature">
      <Link
        href="/realisations/tunnel-du-mont-blanc"
        className="mb-feature-media"
        aria-label="Tunnel du Mont-Blanc — le détail de notre intervention"
      >
        <Cote>Réf. 01 · Tunnel du Mont-Blanc</Cote>
        <Photo
          src="/images/mont-blanc-entree.webp"
          alt="L’entrée nord du tunnel du Mont-Blanc à Chamonix — photographie de Rémih"
          width={1600}
          height={1200}
          sizes="(max-width: 1392px) 100vw, 1300px"
        />
      </Link>
      <div className="mb-feature-body">
        <div>
          <p className="label">
            <span className="label-num">01</span>Infrastructure · France /
            Italie
          </p>
          <h2>Tunnel du Mont-Blanc</h2>
          <p>
            Ventilation des locaux techniques, supportage et réseaux
            hydrauliques. Huit mois de travaux, de jour comme de nuit.
          </p>
          <Link
            href="/realisations/tunnel-du-mont-blanc"
            className="link-arrow"
          >
            Le détail de notre intervention{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <MontBlancSpecs />
      </div>
      <p className="credit mono">
        Vue de l’ouvrage ·{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Tunnel_du_Mont-Blanc_entr%C3%A9e_nord.jpg"
          target="_blank"
          rel="noreferrer"
        >
          Rémih
        </a>{" "}
        ·{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY-SA 4.0
        </a>{" "}
        · format optimisé.
      </p>
    </article>
  );
}
