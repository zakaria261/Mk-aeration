"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Eye, LoaderCircle, Save, Send } from "lucide-react";
import { homePhotos, type HomeContent, type HomePageRecord } from "@/lib/home-content";

export function HomeContentEditor({ initial }: { initial: HomePageRecord }) {
  const [content, setContent] = useState(initial.draft);
  const [version, setVersion] = useState(initial.version);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState<"save" | "publish" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function change(key: keyof HomeContent, value: string) {
    setContent((current) => ({ ...current, [key]: value }));
    setDirty(true); setMessage(""); setError("");
  }

  async function submit(action: "save" | "publish") {
    setPending(action); setError(""); setMessage("");
    try {
      const response = await fetch("/api/equipe/home", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, version, content }),
      });
      const result = await response.json() as { error?: string; version: number };
      if (!response.ok) throw new Error(result.error || "L’enregistrement a échoué.");
      setVersion(result.version); setDirty(false);
      setMessage(action === "publish" ? "La page d’accueil a été publiée sur le site." : "Brouillon enregistré. Le site public conserve sa version actuelle.");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Enregistrement indisponible. Votre saisie est conservée.");
    } finally { setPending(null); }
  }

  const field = (key: keyof HomeContent, label: string, max: number, multiline = false) => (
    <label className="home-edit-field" key={key}>
      <span>{label}</span>
      {multiline
        ? <textarea value={content[key]} maxLength={max} rows={4} disabled={!!pending} onChange={(event) => change(key, event.target.value)} />
        : <input value={content[key]} maxLength={max} disabled={!!pending} onChange={(event) => change(key, event.target.value)} />}
      <small>{content[key].length} / {max}</small>
    </label>
  );

  return (
    <main className="team-main home-edit" id="contenu">
      <div className="team-page-heading"><div><p className="label">Le site public</p><h1>Votre page d’accueil.</h1><p>Modifiez vos textes, choisissez votre photo et publiez quand tout est prêt.</p></div><Link href="/" target="_blank" className="team-secondary">Voir le site <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      <form onSubmit={(event) => { event.preventDefault(); void submit("publish"); }}>
        <fieldset disabled={!!pending} className="home-edit-section">
          <legend>Le premier écran</legend>
          {field("heroTitle", "Titre principal", 80)}
          {field("heroAccent", "Deuxième partie du titre", 80)}
          {field("heroDescription", "Texte de présentation", 360, true)}
          <div className="home-photo-picker"><span>Photo d’accueil</span><div>{homePhotos.map((photo) => <label key={photo.src}><input type="radio" name="heroImage" value={photo.src} checked={content.heroImage === photo.src} onChange={() => change("heroImage", photo.src)} /><img src={photo.src.replace(".webp", "-480.webp")} alt="" width={160} height={100} /><span>{photo.label}</span></label>)}</div></div>
        </fieldset>
        <fieldset disabled={!!pending} className="home-edit-section"><legend>Pourquoi MK Aération</legend>{field("benefitsTitle", "Titre de la section", 100)}{field("benefitsIntro", "Présentation du savoir-faire", 450, true)}</fieldset>
        <fieldset disabled={!!pending} className="home-edit-section"><legend>L’invitation à vous contacter</legend>{field("contactTitle", "Titre de contact", 100)}{field("contactDescription", "Texte de contact", 300, true)}</fieldset>
        <details className="home-edit-preview"><summary><Eye size={18} aria-hidden="true" /> Vérifier les textes et la photo</summary><div className="home-edit-snapshot"><div><strong>{content.heroTitle}<br /><span>{content.heroAccent}</span></strong><p>{content.heroDescription}</p></div><img src={content.heroImage} alt="Photo d’accueil sélectionnée" width={480} height={320} /></div></details>
        <p className="home-edit-help">Les réalisations et leurs photos se gèrent dans <Link href="/equipe/publications">Publications</Link>. Les chiffres de référence sont établis à partir des chantiers présentés.</p>
        <div aria-live="polite">{message && <p className="home-edit-success" role="status"><Check size={18} aria-hidden="true" />{message}</p>}{error && <p className="team-error" role="alert">{error}</p>}</div>
        <div className="home-edit-actions"><button type="button" className="team-secondary" onClick={() => void submit("save")} disabled={!!pending}>{pending === "save" ? <LoaderCircle size={17} className="spin" aria-hidden="true" /> : <Save size={17} aria-hidden="true" />} Enregistrer le brouillon</button><button type="submit" className="team-primary" disabled={!!pending}>{pending === "publish" ? <LoaderCircle size={17} className="spin" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />} Publier sur le site</button></div>
      </form>
    </main>
  );
}
