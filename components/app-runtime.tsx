"use client";
import { useEffect, useState } from "react";
import { X, Share, SquarePlus } from "lucide-react";

/** Enregistre le service worker et suit le mode application. */
export function AppRuntime() {
  useEffect(() => {
    const media = matchMedia("(display-mode: standalone)");
    const sync = () =>
      document.documentElement.classList.toggle(
        "is-standalone",
        media.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true,
      );
    sync();
    // Anciennes installations : l’icône doit ouvrir la gestion, pas la vitrine.
    if ((media.matches || (navigator as Navigator & { standalone?: boolean }).standalone) && location.pathname === "/") {
      location.replace("/equipe");
    }
    media.addEventListener("change", sync);

    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production" &&
      location.protocol === "https:"
    ) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
    return () => media.removeEventListener("change", sync);
  }, []);
  return null;
}

const HINT_KEY = "mk-install-hint-dismissed";

/**
 * Explique l’ajout à l’écran d’accueil sur iPhone (Safari n’a pas
 * d’invite d’installation automatique). Masqué une fois l’app installée.
 */
export function InstallHint({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
    const standalone =
      matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(HINT_KEY) === "1";
    } catch {}
    setShow(ios && !standalone && !dismissed);
  }, []);
  if (!show) return null;
  return (
    <aside className={`install-hint install-hint-${tone}`} aria-label="Installer l’application">
      <img src="/apple-touch-icon.png" alt="" width={48} height={48} />
      <div>
        <strong>Installez MK Gestion sur votre iPhone</strong>
        <p>
          Touchez <Share size={15} aria-label="Partager" /> puis{" "}
          <span className="nowrap">
            <SquarePlus size={15} aria-hidden="true" /> « Sur l’écran d’accueil »
          </span>
          . L’espace équipe s’ouvrira comme une application.
        </p>
      </div>
      <button
        type="button"
        aria-label="Masquer"
        onClick={() => {
          setShow(false);
          try {
            localStorage.setItem(HINT_KEY, "1");
          } catch {}
        }}
      >
        <X size={18} aria-hidden="true" />
      </button>
    </aside>
  );
}
