"use client";
import { useState } from "react";
export type ContactEntry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
};
export function ContactInbox({ initial }: { initial: ContactEntry[] }) {
  const [rows, setRows] = useState(initial),
    [error, setError] = useState(""),
    [busy, setBusy] = useState("");
  async function status(id: string, value: string) {
    setBusy(id);
    setError("");
    try {
      const r = await fetch("/api/equipe/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: value }),
      });
      if (!r.ok) throw Error("Mise à jour indisponible.");
      setRows(
        rows.map((row) => (row.id === id ? { ...row, status: value } : row)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Réessayez.");
    } finally {
      setBusy("");
    }
  }
  async function remove(id: string) {
    if (
      !window.confirm(
        "Supprimer définitivement cette demande et ses coordonnées ?",
      )
    )
      return;
    setBusy(id);
    setError("");
    try {
      const r = await fetch("/api/equipe/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) throw Error("Suppression indisponible.");
      setRows(rows.filter((row) => row.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Réessayez.");
    } finally {
      setBusy("");
    }
  }
  return (
    <main className="team-main" id="contenu">
      <div className="team-page-heading">
        <div>
          <p className="label">Contacts du site</p>
          <h1>Demandes</h1>
          <p>
            Consultez les demandes reçues, recontactez vos clients et suivez les
            réponses.
          </p>
        </div>
      </div>
      {error && (
        <p role="alert" className="team-error">
          {error}
        </p>
      )}
      {!rows.length ? (
        <div className="team-empty">
          <h2>Aucune demande pour le moment.</h2>
          <p>Les messages reçus sur le site apparaîtront ici.</p>
        </div>
      ) : (
        <div className="inbox-list">
          {rows.map((r) => (
            <article key={r.id} className="home-edit-section">
              <header>
                <strong>{r.name}</strong>
                <time dateTime={r.created_at}>
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </time>
              </header>
              <p className="inbox-message">{r.message}</p>
              <div className="inbox-links">
                <a href={`mailto:${r.email}`}>{r.email}</a>
                {r.phone && (
                  <a href={`tel:${r.phone.replace(/[ .-]/g, "")}`}>{r.phone}</a>
                )}
              </div>
              <label>
                Suivi
                <select
                  value={r.status}
                  disabled={busy === r.id}
                  onChange={(e) => void status(r.id, e.target.value)}
                >
                  <option value="new">À traiter</option>
                  <option value="replied">Répondu</option>
                  <option value="archived">Archivé</option>
                </select>
              </label>
              <small>{r.reference}</small>
              <button
                type="button"
                className="team-text-button"
                disabled={busy === r.id}
                onClick={() => void remove(r.id)}
              >
                Supprimer cette demande
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
