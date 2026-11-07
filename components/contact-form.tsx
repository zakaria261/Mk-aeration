"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  LoaderCircle,
  LockKeyhole,
  Phone,
} from "lucide-react";
import { useCompany } from "./site-provider";
import { trackConversion } from "@/lib/conversion";

const needs = [
  "Réseaux aérauliques",
  "CTA & VMC",
  "Soufflage & extraction",
  "Autre projet",
];

export function ContactForm({ preview = false }: { preview?: boolean }) {
  const company = useCompany();
  const uid = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [need, setNeed] = useState("");
  const id = useRef("");
  const start = useRef(0);
  const opened = useRef(false);
  const confirmation = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    if (reference) confirmation.current?.focus({ preventScroll: true });
  }, [reference]);
  const field = (name: "name" | "email" | "phone" | "message" | "website") => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [name]: e.target.value }),
  });
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (preview || busy) return;
    if (form.message.trim().length < 20) {
      setError("Décrivez votre projet en au moins 20 caractères.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: need
            ? `Besoin : ${need}\n\n${form.message.trim()}`
            : form.message.trim(),
          id: id.current,
          startedAt: start.current,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const data = (await response.json()) as {
        reference?: string;
        error?: string;
      };
      if (!response.ok || !data.reference)
        throw Error(
          data.error || "Votre demande n’a pas pu être enregistrée. Réessayez.",
        );
      setReference(data.reference);
      trackConversion("contact_success", { form: "short" });
    } catch (e) {
      setError(
        e instanceof Error && e.name === "TimeoutError"
          ? "La connexion prend trop de temps. Réessayez : votre demande ne sera pas créée en double."
          : e instanceof Error
            ? e.message
            : "Votre demande n’a pas été enregistrée. Réessayez.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div
        className="inquiry-card inquiry-success"
        role="status"
        ref={confirmation}
        tabIndex={-1}
      >
        <span className="inquiry-success-icon">
          <Check size={32} aria-hidden="true" />
        </span>
        <p className="inquiry-eyebrow">Demande enregistrée</p>
        <h3>Merci pour votre confiance.</h3>
        <p>
          Votre projet a bien été transmis à notre équipe. Nous disposons de vos
          coordonnées pour poursuivre l’échange.
        </p>
        <div className="inquiry-reference">
          <span>Votre référence</span>
          <strong>{reference}</strong>
        </div>
        <a href={company.tel}>
          <Phone size={18} aria-hidden="true" />
          {company.phone}
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    );
  return (
    <form
      className="inquiry-card inquiry-form"
      aria-label="Présentez-nous votre projet"
      aria-busy={busy}
      onSubmit={send}
      onFocus={() => {
        if (!opened.current) {
          opened.current = true;
          trackConversion("contact_open", { form: "short" });
        }
      }}
    >
      <div className="inquiry-heading">
        <p className="inquiry-eyebrow">Faisons connaissance</p>
        <h3>Votre projet commence ici.</h3>
        <p>Quelques informations pour préparer notre échange.</p>
      </div>
      <fieldset className="inquiry-fields" disabled={busy || preview}>
        <legend className="sr-only">Votre projet et vos coordonnées</legend>
        <div className="inquiry-group-heading">
          <span>01</span>
          <h4>Votre besoin</h4>
          <span>À préciser ensemble</span>
        </div>
        <fieldset className="inquiry-needs">
          <legend className="sr-only">Type de projet, facultatif</legend>
          {needs.map((label) => (
            <label className="inquiry-need" key={label}>
              <input
                type="radio"
                name={`${uid}-need`}
                value={label}
                checked={need === label}
                onChange={() => setNeed(label)}
              />
              <span>{label}</span>
              <Check size={15} aria-hidden="true" />
            </label>
          ))}
        </fieldset>
        <label className="inquiry-field">
          <span>
            Quelques mots sur votre projet <b aria-hidden="true">*</b>
          </span>
          <textarea
            name="message"
            required
            minLength={20}
            maxLength={1900}
            rows={4}
            placeholder="Le lieu du chantier, le type de bâtiment, les installations à prévoir…"
            aria-describedby={`${uid}-message-help`}
            {...field("message")}
          />
          <small id={`${uid}-message-help`}>
            20 caractères minimum. Les détails techniques pourront être précisés
            ensemble.
          </small>
        </label>
        <div className="inquiry-group-heading inquiry-coordinates-heading">
          <span>02</span>
          <h4>Vos coordonnées</h4>
        </div>
        <div className="inquiry-row">
          <label className="inquiry-field">
            <span>
              Nom et prénom <b aria-hidden="true">*</b>
            </span>
            <input
              name="name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              placeholder="Votre nom et prénom"
              {...field("name")}
            />
          </label>
          <label className="inquiry-field">
            <span>
              Téléphone <small>Facultatif</small>
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={22}
              pattern={"(?:\\+33|0033|0)[1-9](?:[ .\\-]?\\d{2}){4}"}
              title="Un numéro français, par exemple 06 12 34 56 78."
              placeholder="06 00 00 00 00"
              {...field("phone")}
            />
          </label>
        </div>
        <label className="inquiry-field">
          <span>
            Adresse e-mail <b aria-hidden="true">*</b>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            required
            maxLength={200}
            placeholder="vous@entreprise.fr"
            {...field("email")}
          />
        </label>
        <div className="inquiry-honeypot" aria-hidden="true">
          <label>
            Site web
            <input tabIndex={-1} autoComplete="off" {...field("website")} />
          </label>
        </div>
        <label className="inquiry-consent">
          <input
            required
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          />
          <span>
            J’accepte l’utilisation de mes coordonnées pour traiter ma demande.{" "}
            <Link href="/confidentialite">Confidentialité</Link>
          </span>
        </label>
        <button className="inquiry-submit" type="submit">
          <span>
            {busy ? "Envoi en cours…" : "Échangeons sur votre projet"}
          </span>
          {busy ? (
            <LoaderCircle className="spin" size={21} aria-hidden="true" />
          ) : (
            <ArrowRight size={21} aria-hidden="true" />
          )}
        </button>
        <p className="inquiry-privacy">
          <LockKeyhole size={13} aria-hidden="true" /> Vos informations restent
          confidentielles. <span>* Champs obligatoires</span>
        </p>
      </fieldset>
      {preview && (
        <p className="inquiry-feedback">Formulaire désactivé dans l’aperçu.</p>
      )}
      {error && (
        <p className="inquiry-error" role="alert">
          {error} Vous pouvez aussi appeler le{" "}
          <a href={company.tel}>{company.phone}</a>.
        </p>
      )}
    </form>
  );
}
