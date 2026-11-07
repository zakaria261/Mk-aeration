"use client";
import { useEffect, useRef, useState } from "react";
import { haptic } from "@/lib/haptics";

/**
 * Feuille modale façon iOS : glisse depuis le bas, se ferme en la faisant
 * glisser vers le bas (ou par Échap / le fond), avec retour haptique.
 */
export function Sheet({
  open,
  onClose,
  labelledBy,
  children,
  variant = "sheet",
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  variant?: "sheet" | "action";
}) {
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: number;
    y: number;
    t: number;
    dy: number;
    active: boolean;
  } | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("ios-sheet-open");
    panel.current
      ?.querySelector<HTMLElement>("button:not(:disabled), a, input")
      ?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", key);
    return () => {
      root.classList.remove("ios-sheet-open");
      document.removeEventListener("keydown", key);
    };
  }, [open, onClose]);

  function down(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((panel.current?.scrollTop || 0) > 0) return;
    drag.current = {
      id: event.pointerId,
      y: event.clientY,
      t: event.timeStamp,
      dy: 0,
      active: false,
    };
  }
  function move(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const dy = event.clientY - current.y;
    if (!current.active) {
      if (dy < -8) {
        drag.current = null;
        return;
      }
      if (dy < 8) return;
      current.active = true;
      panel.current?.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    // Vers le haut : résistance élastique, comme sur iOS.
    current.dy = dy;
    setOffset(dy > 0 ? dy : -Math.sqrt(-dy) * 2);
  }
  function up(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    drag.current = null;
    if (!current?.active) return;
    setDragging(false);
    setOffset(0);
    const velocity = current.dy / Math.max(1, event.timeStamp - current.t);
    if (current.dy > 110 || velocity > 0.65) {
      haptic("light");
      onClose();
    }
  }

  return (
    <div
      className={`ios-sheet ios-sheet-${variant} ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        className="ios-sheet-backdrop"
        aria-label="Fermer"
        tabIndex={-1}
        onClick={onClose}
        style={
          dragging ? { opacity: Math.max(0.2, 1 - offset / 400) } : undefined
        }
      />
      <div
        ref={panel}
        className={`ios-sheet-panel ${dragging ? "is-dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        style={dragging ? { transform: `translateY(${offset}px)` } : undefined}
      >
        <span className="ios-sheet-grabber" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
