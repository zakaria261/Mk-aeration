"use client";
import { useState, type FormEvent } from "react";
import { UserPlus, ShieldCheck, Check, LoaderCircle } from "lucide-react";
import type { TeamMember } from "@/lib/cms-types";
export function TeamMembers({
  initial,
  self,
}: {
  initial: TeamMember[];
  self: string;
}) {
  const [members, setMembers] = useState(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function save(member: TeamMember) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/equipe/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error);
      setMembers((all) => [
        ...all.filter((m) => m.email !== member.email),
        member,
      ]);
      setName("");
      setEmail("");
      setNotice(
        member.active
          ? "Accès enregistré. Cette personne peut se connecter avec son adresse e-mail."
          : "Accès désactivé. Cette personne ne peut plus utiliser l’espace équipe.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "L’enregistrement a échoué.");
    } finally {
      setBusy(false);
    }
  }
  function add(event: FormEvent) {
    event.preventDefault();
    void save({ name, email: email.trim().toLowerCase(), role, active: true });
  }
  return (
    <main className="team-main" id="contenu">
      <div className="team-page-heading">
        <div>
          <span className="eyebrow">LES PERSONNES, LES RESPONSABILITÉS</span>
          <h1>Une équipe. Des accès personnels.</h1>
          <p>
            Chaque collaborateur prépare ses publications. Les administrateurs
            valident la mise en ligne.
          </p>
        </div>
      </div>
      {error && (
        <p className="team-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="team-success" role="status">
          <Check size={17} />
          {notice}
        </p>
      )}
      <div className="team-members-layout">
        <section className="team-editor-card">
          <div className="team-section-title">
            <h2>L’équipe</h2>
            <span>{members.filter((m) => m.active).length} accès actifs</span>
          </div>
          <div className="team-members-list">
            {members.map((m) => (
              <article key={m.email}>
                <span className="team-avatar">
                  {m.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <strong>
                    {m.name}
                    {m.email === self ? " · Vous" : ""}
                  </strong>
                  <p>{m.email}</p>
                  <small>
                    {m.role === "admin" ? "Administrateur" : "Collaborateur"} ·{" "}
                    {m.active ? "Actif" : "Accès désactivé"}
                  </small>
                </div>
                {m.email !== self && (
                  <button
                    type="button"
                    className="team-secondary"
                    disabled={busy}
                    onClick={() => save({ ...m, active: !m.active })}
                  >
                    {m.active ? "Désactiver" : "Réactiver"}
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
        <section className="team-invite-panel">
          <UserPlus size={26} />
          <h2>Autoriser un collaborateur.</h2>
          <p>
            Ajoutez son adresse, puis communiquez-lui le lien de connexion. Il
            recevra son code personnel lorsqu’il se connectera.
          </p>
          <form onSubmit={add}>
            <fieldset disabled={busy}>
              <label htmlFor="member-name">Nom</label>
              <input
                id="member-name"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                placeholder="Prénom et nom"
              />
              <label htmlFor="member-email">Adresse e-mail</label>
              <input
                type="email"
                id="member-email"
                required
                value={email}
                maxLength={200}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                placeholder="personne@exemple.fr"
              />
              <label htmlFor="member-role">Responsabilité</label>
              <select
                id="member-role"
                value={role}
                onChange={(e) => setRole(e.target.value as "editor" | "admin")}
              >
                <option value="editor">
                  Collaborateur · Prépare ses contenus
                </option>
                <option value="admin">
                  Administrateur · Publie et gère les accès
                </option>
              </select>
              <button className="team-primary">
                {busy ? (
                  <LoaderCircle className="spin" size={17} />
                ) : (
                  <UserPlus size={17} />
                )}
                Autoriser cet accès
              </button>
            </fieldset>
          </form>
          <div className="team-workflow-note">
            <ShieldCheck size={18} />
            <p>
              Connexion de l’équipe :<br />
              <a href="/connexion" target="_blank">
                mk-aeration.vercel.app/connexion
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
