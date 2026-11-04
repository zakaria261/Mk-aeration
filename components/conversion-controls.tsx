"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { consentKey, trackConversion } from "@/lib/conversion";
export function ConversionListener() {
  const path = usePathname();
  useEffect(() => {
    if (path.startsWith("/equipe") || path === "/connexion") return;
    const click = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackConversion("phone_click");
      else if (href.startsWith("/devis")) trackConversion("quote_click");
      else if (href.startsWith("/realisations") || href === "#realisations")
        trackConversion("project_click");
    };
    document.addEventListener("click", click);
    if (path === "/devis") trackConversion("contact_open", { form: "quote" });
    return () => document.removeEventListener("click", click);
  }, [path]);
  return null;
}
export function ConversionPreferences() {
  const [open, setOpen] = useState(false),
    [enabled, setEnabled] = useState(false);
  function choose(value: boolean) {
    try {
      localStorage.setItem(consentKey, value ? "yes" : "no");
      setEnabled(value);
    } catch {}
    setOpen(false);
  }
  return (
    <div className="conversion-preferences">
      <button
        type="button"
        onClick={() => {
          try {
            setEnabled(localStorage.getItem(consentKey) === "yes");
          } catch {}
          setOpen(!open);
        }}
        aria-expanded={open}
      >
        Mesure d’audience
      </button>
      {open && (
        <div
          className="conversion-panel"
          role="region"
          aria-label="Préférences de mesure"
        >
          <p>
            Autoriser les événements de conversion ? Aucun suivi n’est actif par
            défaut. Aucun outil de mesure externe n’est installé.
          </p>
          <p>Votre choix actuel : {enabled ? "autorisé" : "refusé"}.</p>
          <button type="button" onClick={() => choose(false)}>
            Refuser
          </button>
          <button type="button" onClick={() => choose(true)}>
            Autoriser
          </button>
        </div>
      )}
    </div>
  );
}
