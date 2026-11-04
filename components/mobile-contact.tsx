"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { company } from "@/lib/content";

/** Contact rapide de la vitrine, indépendant des onglets de MK Gestion. */
export function MobileContact() {
  const [pastHero, setPastHero] = useState(false);
  const [nearContact, setNearContact] = useState(false);
  const [nearPrompt, setNearPrompt] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".lp-hero");
    const contact = document.querySelector(".lp-contact");
    const prompt = document.querySelector(".lp-project-prompt");
    if (!hero || !contact || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setPastHero(entry.boundingClientRect.bottom <= 0);
        if (entry.target === contact) setNearContact(entry.isIntersecting || entry.boundingClientRect.top < 0);
        if (entry.target === prompt) setNearPrompt(entry.isIntersecting);
      }
    }, { threshold: 0 });
    observer.observe(hero);
    observer.observe(contact);
    if (prompt) observer.observe(prompt);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !nearContact && !nearPrompt;
  return (
    <aside className={`mobile-contact ${visible ? "is-visible" : ""}`} aria-label="Contact rapide" aria-hidden={!visible} inert={!visible}>
      <div className="mobile-contact-inner">
        <a href={company.tel} className="mobile-contact-call" aria-label={`Appeler MK Aération au ${company.phone}`}><Phone size={19} aria-hidden="true" /><span>Appeler</span></a>
        <Link href="/devis" className="mobile-contact-quote">Demander un devis <ArrowUpRight size={20} aria-hidden="true" /></Link>
      </div>
    </aside>
  );
}
