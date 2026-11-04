"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useCompany } from "./site-provider";
import { trackConversion } from "@/lib/conversion";
export function ContactForm({ preview = false }: { preview?: boolean }) {
  const company = useCompany();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reference, setReference] = useState("");
  const id = useRef(""),
    start = useRef(0),
    opened = useRef(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
    consent: false,
  });
  useEffect(() => {
    id.current = crypto.randomUUID();
    start.current = Date.now();
  }, []);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (preview) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: id.current,
          startedAt: start.current,
        }),
      });
      const d = (await r.json()) as { reference?: string; error?: string };
      if (!r.ok || !d.reference)
        throw Error(d.error || "Enregistrement impossible.");
      setReference(d.reference);
      trackConversion("contact_success", { form: "short" });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Votre demande n’a pas été enregistrée. Réessayez.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="contact-confirmation" role="status">
        <Check size={28} />
        <h3>Votre demande est enregistrée.</h3>
        <p>
          Référence {reference}. Merci. Vous pouvez nous appeler pour compléter
          votre demande.
        </p>
        <a href={company.tel}>Nous appeler au {company.phone}</a>
      </div>
    );
  return (
    <form
      className="quick-contact"
      aria-label="Contact rapide"
      onSubmit={send}
      onFocus={() => {
        if (!opened.current) {
          opened.current = true;
          trackConversion("contact_open", { form: "short" });
        }
      }}
    >
      <fieldset disabled={busy || preview}>
        <legend className="sr-only">Votre projet et vos coordonnées</legend>
        <div className="quick-contact-row">
          <label>
            Votre nom
            <input
              name="name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Votre e-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              required
              maxLength={200}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
        </div>
        <label>
<<<<<<< ours
          Téléphone <span>(facultatif)</span>
=======
          <span className="contact-phone-label">
            Téléphone <span>(facultatif)</span>
          </span>
>>>>>>> theirs
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={22}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          Votre projet
          <textarea
            name="message"
            required
            minLength={20}
            maxLength={2000}
            rows={4}
            placeholder="Type de bâtiment, lieu du chantier, installation à prévoir…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        <div className="contact-honeypot" aria-hidden="true">
          <label>
            Site web
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </label>
        </div>
        <label className="contact-consent">
          <input
            required
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          />
          <span>
            J’accepte que mes coordonnées soient utilisées pour traiter ma
            demande. <Link href="/confidentialite">Confidentialité</Link>
          </span>
        </label>
        <button className="lp-button" type="submit">
          {busy ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <>
              Envoyer ma demande <ArrowUpRight size={18} />
            </>
          )}
        </button>
      </fieldset>
      {preview && <p>Formulaire désactivé dans l’aperçu.</p>}
      {error && (
        <p className="contact-error" role="alert">
          {error} Vous pouvez aussi appeler le{" "}
          <a href={company.tel}>{company.phone}</a>.
        </p>
      )}
    </form>
  );
}
