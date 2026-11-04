"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { useCompany } from "./site-provider";

/** Barre web de contact, masquée lorsqu’un formulaire ou un CTA est déjà visible. */
export function MobileContact() {
  const path = usePathname(),
    company = useCompany();
  const [visible, setVisible] = useState(false);
  const excluded =
    path.startsWith("/equipe") ||
    ["/connexion", "/contact", "/devis"].includes(path);
  useEffect(() => {
    if (excluded) {
      setVisible(false);
      return;
    }
    let frame = 0;
    const compute = () => {
      frame = 0;
      const height = window.visualViewport?.height || window.innerHeight;
      const hero = document.querySelector(".lp-hero,.intro,.project-head");
      const passed = hero
        ? hero.getBoundingClientRect().bottom < 80
        : window.scrollY > 180;
      const end = document.querySelector(
        ".lp-contact,.public-contact,.public-footer",
      );
      const nearEnd =
        !!end && end.getBoundingClientRect().top < window.innerHeight;
      const inline = [
        ...document.querySelectorAll(
          ".lp-project-prompt,.service-actions,.story-scope,.quick-contact",
        ),
      ].some((e) => {
        const r = e.getBoundingClientRect();
        return r.top < height - 75 && r.bottom > 80;
      });
      const active = document.activeElement;
      const editing =
        active instanceof HTMLElement &&
        active.matches("input,textarea,select,[contenteditable=true]");
      const keyboard = window.innerHeight - height > 140;
      setVisible(passed && !nearEnd && !inline && !editing && !keyboard);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
    };
  }, [path, excluded]);
  if (excluded) return null;
  return (
    <aside
      className={`mobile-contact ${visible ? "is-visible" : ""}`}
      aria-label="Contact rapide"
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mobile-contact-inner">
        <a
          href={company.tel}
          className="mobile-contact-call"
          aria-label={`Appeler MK Aération au ${company.phone}`}
        >
          <Phone size={19} aria-hidden="true" />
          <span>Appeler</span>
        </a>
        <Link href="/devis" className="mobile-contact-quote">
          Demander un devis <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
