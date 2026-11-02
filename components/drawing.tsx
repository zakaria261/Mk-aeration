/**
 * Éléments graphiques empruntés au dessin technique CVC :
 * symboles de sections de gaine, cotes et flux d’air.
 * Ils sont décoratifs : toujours masqués des technologies d’assistance.
 */

type SymbolKind = "round" | "supply" | "return" | "unit";

/** Symboles normalisés des plans de ventilation. */
export function DuctSymbol({
  kind,
  size = 44,
}: {
  kind: SymbolKind;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 44 44",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true,
    focusable: false,
    className: "duct-symbol",
  } as const;
  if (kind === "round")
    return (
      <svg {...common}>
        <circle cx="22" cy="22" r="17" />
        <circle cx="22" cy="22" r="12.5" strokeDasharray="2 3" />
        <path d="M9 35 35 9" />
      </svg>
    );
  if (kind === "supply")
    return (
      <svg {...common}>
        <rect x="5" y="9" width="34" height="26" />
        <path d="M5 9 39 35M39 9 5 35" />
      </svg>
    );
  if (kind === "return")
    return (
      <svg {...common}>
        <rect x="5" y="9" width="34" height="26" />
        <path d="M5 35 39 9" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="4" y="8" width="36" height="28" />
      <circle cx="22" cy="22" r="9" />
      <path d="m16.5 26.5 5.5-11 5.5 11Z" />
      <path d="M4 14h-3M4 30H1M40 14h3M40 30h3" />
    </svg>
  );
}

/** Ligne de cote : |——— valeur ———| */
export function Cote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`cote ${className}`} aria-hidden="true">
      <span>{children}</span>
    </div>
  );
}

/** Tronçon de gaine vu en plan, traversé par le flux d’air. */
export function AirFlow({
  label = "Soufflage",
  reverse = false,
}: {
  label?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`airflow ${reverse ? "airflow-reverse" : ""}`} aria-hidden="true">
      <span className="airflow-label">{label}</span>
      <span className="airflow-duct">
        <span className="airflow-stream" />
      </span>
    </div>
  );
}

/** Bulle de repère de détail, comme sur un plan : numéro / folio. */
export function RefBubble({ n, sheet = "MK" }: { n: string; sheet?: string }) {
  return (
    <span className="ref-bubble" aria-hidden="true">
      <span>{n}</span>
      <span>{sheet}</span>
    </span>
  );
}
