"use client";

import { useEffect } from "react";

/** Progressive enhancement: content is readable before JS and with reduced motion. */
export function PageMotion({ scope = "contenu" }: { scope?: string }) {
  useEffect(() => {
    const root = document.getElementById(scope);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || !("IntersectionObserver" in window)) return;
    const elements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    let observer: IntersectionObserver | undefined;
    const showAll = () => {
      observer?.disconnect();
      elements.forEach((element) => element.removeAttribute("data-motion"));
    };
    const setup = () => {
      showAll();
      if (preference.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-motion", "visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
      );
      elements.forEach((element) => {
        // Never hide content that is already in view or keyboard-focused.
        if (
          element.getBoundingClientRect().top < window.innerHeight ||
          element.contains(document.activeElement)
        )
          return;
        element.dataset.motion = "pending";
        element.style.setProperty(
          "--reveal-delay",
          `${Number(element.dataset.reveal) || 0}ms`,
        );
        observer?.observe(element);
      });
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>(
        "[data-motion='pending']",
      );
      element?.setAttribute("data-motion", "visible");
      if (element) observer?.unobserve(element);
    };
    setup();
    preference.addEventListener("change", setup);
    root.addEventListener("focusin", onFocus);
    return () => {
      showAll();
      preference.removeEventListener("change", setup);
      root.removeEventListener("focusin", onFocus);
    };
  }, [scope]);
  return null;
}
