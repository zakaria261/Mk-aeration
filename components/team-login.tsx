"use client";
import Link from "next/link";
import { useState, useRef, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { teamAuthClient } from "@/lib/auth/client";
import { InstallHint } from "./app-runtime";

export function TeamLogin({ enabled }: { enabled: boolean }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const otp = useRef<HTMLInputElement>(null);
  async function send(event?: FormEvent) {
    event?.preventDefault();
    setError("");
    setPending(true);
    try {
      const { error } = await teamAuthClient.emailOtp.sendVerificationOtp({
        email: email.trim().toLowerCase(),
        type: "sign-in",
      });
      if (error)
        throw new Error(error.message || "Le code n’a pas pu être envoyé.");
      setSent(true);
      setResendAt(Date.now() + 60000);
      setTimeout(() => otp.current?.focus(), 50);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Connexion momentanément indisponible.",
      );
    } finally {
      setPending(false);
    }
  }
  async function verify(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const { error } = await teamAuthClient.signIn.emailOtp({
        email: email.trim().toLowerCase(),
        otp: code,
      });
      if (error)
        throw new Error(
          "Ce code est incorrect ou a expiré. Vérifiez les six chiffres ou demandez un nouveau code.",
        );
      window.location.assign("/equipe");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Connexion momentanément indisponible.",
      );
      setPending(false);
    }
  }
  return (
    <main className="team-login" id="contenu">
      <div className="team-login-brand">
        <Link href="/" aria-label="MK Aération — accueil">
          <img
            src="/brand/lockup.webp"
            alt="MK Aération"
            width={552}
            height={168}
          />
        </Link>
        <Link href="/" className="team-login-back">
          <ArrowLeft size={16} /> Le site
        </Link>
      </div>
      <div className="team-login-layout">
        <div className="team-login-intro">
          <p className="label">Espace dirigeant · MK Gestion</p>
          <h1>
            Votre travail,
            <br />
            <em>sous son meilleur jour.</em>
          </h1>
          <p>
            Photos de chantier, nouvelles de l’équipe, réalisations : faites
            vivre notre savoir-faire.
          </p>
          <div className="team-login-steps">
            <span>
              <b>01</b> Préparer
            </span>
            <span>
              <b>02</b> Illustrer
            </span>
            <span>
              <b>03</b> Publier
            </span>
          </div>
        </div>
        <section className="team-login-panel">
          <InstallHint />
          <span className="team-login-icon">
            <ShieldCheck size={25} />
          </span>
          <h2>
            {sent ? "Vérifiez votre messagerie." : "Bienvenue dans l’équipe."}
          </h2>
          <p>
            {sent
              ? `Un code de connexion a été envoyé à ${email}. Pensez à vérifier les courriers indésirables.`
              : "Accès réservé aux collaborateurs autorisés. Recevez un code personnel par e-mail pour vous connecter."}
          </p>
          {!enabled ? (
            <div className="team-notice" role="status">
              L’espace équipe est en cours d’activation. Le responsable MK
              Aération vous communiquera son ouverture.
            </div>
          ) : sent ? (
            <form onSubmit={verify}>
              <label htmlFor="team-code">Votre code à 6 chiffres</label>
              <input
                ref={otp}
                id="team-code"
                className="team-otp"
                autoComplete="one-time-code"
                inputMode="numeric"
                enterKeyHint="go"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                required
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
              />
              <button
                className="btn btn-primary btn-lg btn-block"
                disabled={pending || code.length !== 6}
              >
                {pending ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <>
                    Accéder à mon espace <ArrowRight size={18} />
                  </>
                )}
              </button>
              <button
                type="button"
                className="team-text-button"
                disabled={pending}
                onClick={() => {
                  if (Date.now() < resendAt)
                    setError(
                      "Patientez une minute avant de demander un nouveau code.",
                    );
                  else void send();
                }}
              >
                Renvoyer un code
              </button>
              <button
                type="button"
                className="team-text-button"
                onClick={() => {
                  setSent(false);
                  setCode("");
                  setError("");
                }}
              >
                Utiliser une autre adresse
              </button>
            </form>
          ) : (
            <form onSubmit={send}>
              <label htmlFor="team-email">Adresse e-mail professionnelle</label>
              <div className="team-email-input">
                <Mail size={18} />
                <input
                  type="email"
                  id="team-email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  value={email}
                  required
                  placeholder="vous@exemple.fr"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className="btn btn-primary btn-lg btn-block" disabled={pending}>
                {pending ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <>
                    Recevoir mon code <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
          {error && (
            <p className="team-error" role="alert">
              {error}
            </p>
          )}
          <div className="team-login-help">
            <ShieldCheck size={16} />
            <span>
              Une adresse, un accès personnel.
              <br />
              Pour rejoindre l’espace, contactez votre responsable.
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
