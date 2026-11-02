"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Défilement horizontal natif (inertie iOS, aimantation),
 * avec compteur et flèches pour la souris.
 */
export function Rail({
  children,
  label,
  count,
}: {
  children: React.ReactNode;
  label: string;
  count: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const items = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft;
      let current = 0;
      items.forEach((item, i) => {
        if (item.offsetLeft - el.offsetLeft <= left + 24) current = i;
      });
      setIndex(current);
      setEdges({
        start: left < 8,
        end: left + el.clientWidth >= el.scrollWidth - 8,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="rail">
      <div className="rail-track" ref={track} role="list" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="rail-controls">
        <span className="rail-count mono" aria-hidden="true">
          {String(Math.min(index + 1, count)).padStart(2, "0")}
          <span className="rail-bar">
            <span style={{ transform: `scaleX(${(Math.min(index + 1, count)) / count})` }} />
          </span>
          {String(count).padStart(2, "0")}
        </span>
        <div className="rail-buttons">
          <button type="button" onClick={() => go(-1)} disabled={edges.start} aria-label="Chantier précédent">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={edges.end} aria-label="Chantier suivant">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
