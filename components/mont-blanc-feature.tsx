import Link from "next/link";
import { Photo } from "./photo";

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
        tabIndex={-1}
      >
        <Photo
          src="/images/mont-blanc-presentation.webp"
          alt="Entrée du tunnel du Mont-Blanc au pied des Alpes, visuel de présentation MK Aération"
          width={1461}
          height={720}
          sizes="(max-width: 1392px) 100vw, 1300px"
        />
      </Link>
      <div className="split-head">
        <h2>Tunnel du Mont-Blanc</h2>
        <div>
          <p>
            Ventilation des locaux techniques, supportage et réseaux
            hydrauliques. <strong>Huit mois de travaux</strong>, de jour comme
            de nuit, entre la France et l’Italie.
          </p>
          <Link href="/realisations/tunnel-du-mont-blanc" className="lp-cta">
            Découvrir notre intervention
          </Link>
        </div>
      </div>
    </article>
  );
}
