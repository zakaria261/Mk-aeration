"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Wind,
  Fan,
  CookingPot,
  Plus,
  Check,
  ShieldCheck,
  LoaderCircle,
  Copy,
} from "lucide-react";
import { company } from "@/lib/content";
import { quoteSchema, serviceNames } from "@/lib/quote-validation";
import { SectionLabel } from "./ui";
const options = [
  { id: "reseaux", icon: Wind },
  { id: "vmc", icon: Fan },
  { id: "extraction", icon: CookingPot },
  { id: "autre", icon: Plus },
];
export function QuoteForm() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [data, setData] = useState({
    profile: "Professionnel",
    city: "",
    postcode: "",
    timing: "Projet à définir",
    description: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    website: "",
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);
  const identity = useRef({ id: "", startedAt: 0 });
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    identity.current = { id: crypto.randomUUID(), startedAt: Date.now() };
    const selected = new URLSearchParams(location.search).get("service");
    if (selected && serviceNames[selected]) setService(selected);
  }, []);
  const field = (name: keyof typeof data) => ({
    value: data[name],
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setData({ ...data, [name]: e.target.value });
      setError("");
    },
  });
  const move = (next: number) => {
    setError("");
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });
  };
  const advance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      if (!service) {
        setError("Choisissez le besoin qui correspond à votre projet.");
        return;
      }
      move(2);
      return;
    }
    if (step === 2) {
      const result = quoteSchema
        .pick({
          profile: true,
          city: true,
          postcode: true,
          timing: true,
          description: true,
        })
        .safeParse(data);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
      move(3);
      return;
    }
    void submit();
  };
  const submit = async () => {
    if (busy) return;
    const result = quoteSchema.safeParse({
      ...data,
      service,
      consent,
      ...identity.current,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
        signal: AbortSignal.timeout(20000),
      });
      const payload = (await response.json()) as {
        reference?: string;
        error?: string;
      };
      if (!response.ok || !payload.reference)
        throw new Error(
          payload.error ||
            "La demande n’a pas pu être enregistrée. Réessayez ou contactez-nous directement.",
        );
      setReference(payload.reference);
      requestAnimationFrame(() =>
        panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (e) {
      setError(
        e instanceof Error && e.name === "TimeoutError"
          ? "La connexion prend trop de temps. Réessayez : votre demande ne sera pas créée en double."
          : e instanceof Error
            ? e.message
            : "Connexion impossible. Réessayez ou appelez-nous.",
      );
    } finally {
      setBusy(false);
    }
  };
  const summary = `Demande de devis MK Aération${reference ? ` — ${reference}` : ""}\n\n${serviceNames[service]}\n${data.profile}${data.company ? ` — ${data.company}` : ""}\nChantier : ${data.postcode} ${data.city}\nÉchéance : ${data.timing}\n\n${data.description}\n\n${data.name}\n${data.phone}\n${data.email}`;
  const emailHref = `mailto:${company.email}?subject=${encodeURIComponent(`Demande de devis ${reference}`)}&body=${encodeURIComponent(summary)}`;
  return (
    <div className="quote-layout">
      <div
        className="quote-form-panel"
        ref={panel}
        style={{ scrollMarginTop: 100 }}
      >
        {reference ? (
          <div className="quote-success" role="status">
            <span className="success-icon">
              <Check size={31} />
            </span>
            <h2>
              VOTRE PROJET
              <br />
              EST BIEN ENREGISTRÉ.
            </h2>
            <p>
              Merci {data.name.split(" ")[0]}. Les informations de votre
              chantier ont bien été conservées. Pour en parler directement avec
              nous, un appel ou un e-mail suffit.
            </p>
            <div className="quote-reference">
              <span>Votre référence</span>
              <strong>{reference}</strong>
            </div>
            <div className="success-actions">
              <a className="button" href={emailHref}>
                Transmettre aussi par e-mail
                <ArrowUpRight size={18} />
              </a>
              <button
                className="button button-outline"
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(summary);
                    setCopied(true);
                  } catch {
                    setError(
                      "La copie n’est pas disponible. Conservez la référence affichée.",
                    );
                  }
                }}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
                {copied ? "Récapitulatif copié" : "Copier le récapitulatif"}
              </button>
            </div>
            <p className="small-note">
              Le bouton e-mail ouvre votre messagerie avec votre demande déjà
              rédigée. Vous pourrez y joindre vos plans.
            </p>
            <Link href="/" className="text-link">
              Retour à l’accueil
              <ArrowRight size={17} />
            </Link>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={advance} aria-label="Demande de devis">
            <div className="step-track" aria-label={`Étape ${step} sur 3`}>
              {["Votre besoin", "Votre projet", "Vos coordonnées"].map(
                (s, i) => (
                  <div
                    key={s}
                    className={
                      step === i + 1 ? "current" : step > i + 1 ? "done" : ""
                    }
                    aria-current={step === i + 1 ? "step" : undefined}
                  >
                    <span>
                      0{i + 1} — {s}
                    </span>
                  </div>
                ),
              )}
            </div>
            <h2 tabIndex={-1} ref={heading}>
              {step === 1
                ? "DE QUOI AVEZ-VOUS BESOIN ?"
                : step === 2
                  ? "PARLEZ-NOUS DU CHANTIER."
                  : "FAISONS CONNAISSANCE."}
            </h2>
            <p className="form-intro">
              {step === 1
                ? "Choisissez le sujet de votre demande."
                : step === 2
                  ? "Quelques informations pour mieux comprendre votre projet."
                  : "Laissez-nous les coordonnées pour vous recontacter."}
            </p>
            {step === 1 && (
              <div
                className="service-options"
                role="group"
                aria-label="Type de besoin"
              >
                {options.map(({ id, icon: Icon }) => (
                  <button
                    type="button"
                    className="service-option"
                    key={id}
                    aria-pressed={service === id}
                    onClick={() => {
                      setService(id);
                      setError("");
                    }}
                  >
                    <span className="option-check">
                      {service === id && <Check />}
                    </span>
                    <Icon />
                    <strong>{serviceNames[id]}</strong>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="profile">Vous êtes *</label>
                    <select id="profile" {...field("profile")}>
                      <option>Professionnel</option>
                      <option>Particulier</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="timing">À quelle échéance ? *</label>
                    <select id="timing" {...field("timing")}>
                      <option>Projet à définir</option>
                      <option>Dès que possible</option>
                      <option>Dans les 3 mois</option>
                      <option>Dans les 6 mois</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="city">Commune du chantier *</label>
                    <input
                      id="city"
                      autoComplete="address-level2"
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="Ex. : Grenoble"
                      {...field("city")}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="postcode">Code postal *</label>
                    <input
                      id="postcode"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      required
                      pattern="[0-9]{5}"
                      maxLength={5}
                      placeholder="Ex. : 38000"
                      {...field("postcode")}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="description">
                    Votre projet en quelques mots *
                  </label>
                  <textarea
                    id="description"
                    required
                    minLength={20}
                    maxLength={3000}
                    placeholder="Type de bâtiment, installation envisagée, contraintes… Dites-nous ce qui compte pour votre projet."
                    {...field("description")}
                  />
                  <span className="field-help">
                    20 caractères minimum. Vous pourrez transmettre vos plans
                    par e-mail.
                  </span>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name">Nom et prénom *</label>
                    <input
                      id="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="Votre nom"
                      {...field("name")}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="company">
                      Entreprise <span>(facultatif)</span>
                    </label>
                    <input
                      id="company"
                      autoComplete="organization"
                      maxLength={150}
                      placeholder="Nom de votre entreprise"
                      {...field("company")}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="email">Adresse e-mail *</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={200}
                      placeholder="vous@exemple.fr"
                      {...field("email")}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Téléphone *</label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength={22}
                      placeholder="06 00 00 00 00"
                      {...field("phone")}
                    />
                  </div>
                </div>
                <label className="form-consent">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    J’accepte que MK Aération utilise ces informations pour
                    étudier ma demande et me recontacter.{" "}
                    <Link href="/confidentialite" target="_blank">
                      Utilisation de mes données
                    </Link>
                    .
                  </span>
                </label>
              </>
            )}
            <div className="form-honeypot" aria-hidden="true">
              <label htmlFor="website">Votre site internet</label>
              <input
                id="website"
                tabIndex={-1}
                autoComplete="off"
                {...field("website")}
              />
            </div>
            {error && (
              <div className="form-error" role="alert">
                {error}
                {step === 3 && (
                  <div>
                    <a className="text-link" href={emailHref}>
                      Transmettre ma demande par e-mail
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                )}
              </div>
            )}
            <div className="form-footer">
              {step > 1 ? (
                <button
                  type="button"
                  className="back-button"
                  onClick={() => move(step - 1)}
                  disabled={busy}
                >
                  <ArrowLeft size={16} />
                  Retour
                </button>
              ) : (
                <span>Étape 1 sur 3 · Sans engagement</span>
              )}
              <button className="button" type="submit" disabled={busy}>
                {busy
                  ? "Enregistrement…"
                  : step === 3
                    ? "Envoyer ma demande"
                    : "Continuer"}
                {busy ? (
                  <LoaderCircle className="spinning" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <aside className="quote-sidebar">
        <SectionLabel>UN ÉCHANGE DIRECT</SectionLabel>
        <h3>
          Le début d’un
          <br />
          projet bien préparé.
        </h3>
        <p>
          Vous préférez nous expliquer votre besoin de vive voix ? Nous sommes à
          votre écoute.
        </p>
        <div className="quote-direct">
          <a href={company.tel}>
            <Phone size={19} />
            <span>
              <small>Appelez-nous</small>
              <strong>{company.phone}</strong>
            </span>
          </a>
          <a href={`mailto:${company.email}`}>
            <Mail size={18} />
            {company.email}
          </a>
          <a href={company.maps} target="_blank" rel="noreferrer">
            <MapPin size={19} />
            <span>
              <small>Notre point de départ</small>Saint-Rambert-d’Albon (26)
            </span>
          </a>
        </div>
        {service && (
          <div className="quote-summary">
            <div>
              <span>Votre besoin</span>
              <strong>{serviceNames[service]}</strong>
            </div>
            {data.city && (
              <div>
                <span>Votre chantier</span>
                <strong>
                  {data.postcode} {data.city}
                </strong>
              </div>
            )}
            {step > 1 && (
              <div>
                <span>Votre échéance</span>
                <strong>{data.timing}</strong>
              </div>
            )}
          </div>
        )}
        <div className="quote-reassurance">
          <ShieldCheck size={17} />
          <span>
            Vos informations servent uniquement à traiter votre projet. Aucun
            démarchage publicitaire.
          </span>
        </div>
      </aside>
    </div>
  );
}
