"use client";
import Link from "next/link";
import { projects } from "@/lib/content";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  LoaderCircle,
  Plus,
  Save,
} from "lucide-react";
import {
  defaultSiteContent,
  historicalEdit,
  siteContentSchema,
  type SiteContent,
  type SiteRecord,
} from "@/lib/site-content";
import { SiteImagePicker } from "./site-image-picker";
const sectionLabels: Record<string, string> = {
  proof: "Secteurs d’activité",
  flagship: "Mont-Blanc",
  services: "Prestations",
  projects: "Réalisations",
  about: "Entreprise",
  news: "Actualités",
  faq: "Questions fréquentes",
  contact: "Contact",
};
export function SiteSettingsEditor({ initial }: { initial: SiteRecord }) {
  const [c, setC] = useState(initial.draft),
    [version, setVersion] = useState(initial.version),
    [pending, setPending] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [dirty, setDirty] = useState(false);
  function edit(next: SiteContent) {
    setC(next);
    setDirty(true);
    setMessage("");
  }
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function save(action: "save" | "publish") {
    setError("");
    setMessage("");
    const result = siteContentSchema.safeParse(c);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setPending(true);
    try {
      const r = await fetch("/api/equipe/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, version, content: c }),
      });
      const d = (await r.json()) as { error?: string; version: number };
      if (!r.ok) throw Error(d.error);
      setVersion(d.version);
      setDirty(false);
      setMessage(
        action === "publish"
          ? "Le site a été mis à jour."
          : "Brouillon enregistré. Le site public reste inchangé.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enregistrement indisponible.");
    } finally {
      setPending(false);
    }
  }
  const field = (
    label: string,
    value: string,
    change: (v: string) => void,
    area = false,
  ) => (
    <label className="home-edit-field">
      <span>{label}</span>
      {area ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => change(e.target.value)}
        />
      ) : (
        <input value={value} onChange={(e) => change(e.target.value)} />
      )}
    </label>
  );
  function service(
    index: number,
    changes: Partial<SiteContent["services"][number]>,
  ) {
    edit({
      ...c,
      services: c.services.map((s, i) =>
        i === index ? { ...s, ...changes } : s,
      ),
    });
  }
  function move<T>(a: T[], i: number, d: number): T[] {
    const b = [...a];
    if (i + d < 0 || i + d >= a.length) return b;
    [b[i], b[i + d]] = [b[i + d], b[i]];
    return b;
  }
  return (
    <main id="contenu" className="team-main home-edit">
      <div className="team-page-heading">
        <div>
          <p className="label">Administration</p>
          <h1>Le site & l’entreprise.</h1>
          <p>
            Coordonnées, pages, prestations et références. Préparez vos
            changements avant de publier.
          </p>
        </div>
        <Link className="team-secondary" href="/equipe/apercu" target="_blank">
          Aperçu du brouillon
        </Link>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save("publish");
        }}
      >
        <fieldset disabled={pending} className="settings-fields">
          <details open className="home-edit-section">
            <summary>Coordonnées de l’entreprise</summary>
            {(
              [
                ["legalName", "Dénomination juridique"],
                ["legalForm", "Forme juridique"],
                ["siren", "SIREN"],
                ["siret", "SIRET"],
                ["vat", "TVA intracommunautaire"],
                ["publisher", "Directeur de publication"],
                ["phone", "Téléphone"],
                ["email", "E-mail"],
                ["address", "Adresse"],
                ["city", "Ville et code postal"],
                ["hours", "Horaires (facultatif)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                {field(label, c.company[key], (v) =>
                  edit({ ...c, company: { ...c.company, [key]: v } }),
                )}
              </div>
            ))}
            {field(
              "Zones d’intervention — une par ligne",
              c.company.areas.join("\n"),
              (v) =>
                edit({ ...c, company: { ...c.company, areas: v.split("\n") } }),
              true,
            )}
            {c.company.socials.map((s, i) => (
              <div key={i}>
                {field("Réseau social", s.label, (v) =>
                  edit({
                    ...c,
                    company: {
                      ...c.company,
                      socials: c.company.socials.map((x, j) =>
                        j === i ? { ...x, label: v } : x,
                      ),
                    },
                  }),
                )}
                {field("Lien HTTPS vérifié", s.url, (v) =>
                  edit({
                    ...c,
                    company: {
                      ...c.company,
                      socials: c.company.socials.map((x, j) =>
                        j === i ? { ...x, url: v } : x,
                      ),
                    },
                  }),
                )}
                <button
                  type="button"
                  className="team-text-button"
                  onClick={() =>
                    edit({
                      ...c,
                      company: {
                        ...c.company,
                        socials: c.company.socials.filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  Retirer ce lien
                </button>
              </div>
            ))}
            <button
              type="button"
              className="team-secondary"
              onClick={() =>
                edit({
                  ...c,
                  company: {
                    ...c.company,
                    socials: [
                      ...c.company.socials,
                      { label: "Nouveau lien", url: "https://" },
                    ],
                  },
                })
              }
            >
              Ajouter un réseau social
            </button>
          </details>
          <details className="home-edit-section">
            <summary>Logo & photo d’accueil</summary>
            <SiteImagePicker
              value={c.logo}
              onChange={(logo) => edit({ ...c, logo })}
            />
            <h2>Photo personnelle de l’accueil</h2>
            <p className="home-edit-help">
              Facultatif : cette image remplace celle choisie dans Accueil du
              site.
            </p>
            <SiteImagePicker
              value={c.home.heroImage || defaultSiteContent.services[0].image}
              onChange={(heroImage) =>
                edit({ ...c, home: { ...c.home, heroImage } })
              }
            />
            {c.home.heroImage && (
              <button
                type="button"
                className="team-text-button"
                onClick={() =>
                  edit({ ...c, home: { ...c.home, heroImage: null } })
                }
              >
                Revenir à la photo choisie dans Accueil du site
              </button>
            )}
          </details>
          <details className="home-edit-section">
            <summary>Pages & appels à l’action</summary>
            {Object.entries(c.pages).map(([key, p]) => (
              <div key={key}>
                <h2>{key}</h2>
                {field("Titre", p.title, (v) =>
                  edit({
                    ...c,
                    pages: { ...c.pages, [key]: { ...p, title: v } },
                  }),
                )}
                {field(
                  "Présentation",
                  p.description,
                  (v) =>
                    edit({
                      ...c,
                      pages: { ...c.pages, [key]: { ...p, description: v } },
                    }),
                  true,
                )}
              </div>
            ))}
            {field("Bouton principal de l’accueil", c.home.primaryLabel, (v) =>
              edit({ ...c, home: { ...c.home, primaryLabel: v } }),
            )}
            {field("Lien secondaire de l’accueil", c.home.secondaryLabel, (v) =>
              edit({ ...c, home: { ...c.home, secondaryLabel: v } }),
            )}
            <Link className="team-text-button" href="/equipe/contenu">
              Modifier les textes et la photo d’accueil
            </Link>
          </details>
          <details className="home-edit-section">
            <summary>Ordre des sections de l’accueil</summary>
            <ol className="settings-order">
              {c.home.sections.map((key, i) => (
                <li key={key}>
                  <span>{sectionLabels[key]}</span>
                  <button
                    type="button"
                    disabled={i === 0}
                    aria-label={`Monter ${sectionLabels[key]}`}
                    onClick={() =>
                      edit({
                        ...c,
                        home: {
                          ...c.home,
                          sections: move(c.home.sections, i, -1),
                        },
                      })
                    }
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={i === c.home.sections.length - 1}
                    aria-label={`Descendre ${sectionLabels[key]}`}
                    onClick={() =>
                      edit({
                        ...c,
                        home: {
                          ...c.home,
                          sections: move(c.home.sections, i, 1),
                        },
                      })
                    }
                  >
                    <ArrowDown size={18} />
                  </button>
                  {!["services", "contact"].includes(key) && (
                    <button
                      type="button"
                      onClick={() =>
                        edit({
                          ...c,
                          home: {
                            ...c.home,
                            sections: c.home.sections.filter((k) => k !== key),
                          },
                        })
                      }
                    >
                      Masquer
                    </button>
                  )}
                </li>
              ))}
            </ol>
            {defaultSiteContent.home.sections
              .filter((k) => !c.home.sections.includes(k))
              .map((k) => (
                <button
                  key={k}
                  type="button"
                  className="team-text-button"
                  onClick={() =>
                    edit({
                      ...c,
                      home: { ...c.home, sections: [...c.home.sections, k] },
                    })
                  }
                >
                  Afficher {sectionLabels[k]}
                </button>
              ))}
          </details>
          <details className="home-edit-section">
            <summary>Prestations</summary>
            {c.services.map((s, i) => (
              <details className="settings-service" key={i}>
                <summary>{s.title}</summary>
                {field("Identifiant (URL)", s.id, (v) => service(i, { id: v }))}
                {field("Intitulé", s.title, (v) => service(i, { title: v }))}
                {field("Résumé", s.short, (v) => service(i, { short: v }))}
                {field(
                  "Description",
                  s.description,
                  (v) => service(i, { description: v }),
                  true,
                )}
                {field(
                  "Interventions — une par ligne",
                  s.details.join("\n"),
                  (v) => service(i, { details: v.split("\n").filter(Boolean) }),
                  true,
                )}
                <SiteImagePicker
                  value={s.image}
                  onChange={(image) => service(i, { image })}
                />
                <label className="settings-check">
                  <input
                    type="checkbox"
                    checked={s.published}
                    onChange={(e) =>
                      service(i, { published: e.target.checked })
                    }
                  />
                  Visible sur le site
                </label>
                <div className="settings-move">
                  <button
                    type="button"
                    className="team-secondary"
                    disabled={i === 0}
                    onClick={() =>
                      edit({ ...c, services: move(c.services, i, -1) })
                    }
                  >
                    Monter
                  </button>
                  <button
                    type="button"
                    className="team-secondary"
                    disabled={i === c.services.length - 1}
                    onClick={() =>
                      edit({ ...c, services: move(c.services, i, 1) })
                    }
                  >
                    Descendre
                  </button>
                </div>
              </details>
            ))}
            <button
              type="button"
              className="team-secondary"
              onClick={() =>
                edit({
                  ...c,
                  services: [
                    ...c.services,
                    {
                      ...defaultSiteContent.services[0],
                      id: `prestation-${c.services.length + 1}`,
                      title: "Nouvelle prestation",
                      published: false,
                    },
                  ],
                })
              }
            >
              <Plus size={18} />
              Ajouter une prestation
            </button>
          </details>
          <details className="home-edit-section">
            <summary>Réalisations historiques</summary>
            <p className="home-edit-help">
              Modifiez les fiches existantes. Les nouveaux chantiers se créent
              dans Publications.
            </p>
            {projects.map((p) => {
              const value =
                c.projectEdits.find((x) => x.slug === p.slug) ||
                historicalEdit(p);
              const update = (v: Partial<typeof value>) =>
                edit({
                  ...c,
                  projectEdits: [
                    ...c.projectEdits.filter((x) => x.slug !== p.slug),
                    { ...value, ...v },
                  ],
                });
              return (
                <details className="settings-service" key={p.slug}>
                  <summary>{value.title}</summary>
                  {field("Titre", value.title, (v) => update({ title: v }))}
                  {field(
                    "Description",
                    value.description,
                    (v) => update({ description: v }),
                    true,
                  )}
                  <SiteImagePicker
                    value={value.image}
                    onChange={(image) => update({ image })}
                  />
                  <label className="settings-check">
                    <input
                      type="checkbox"
                      checked={value.published}
                      onChange={(e) => update({ published: e.target.checked })}
                    />
                    Visible sur le site
                  </label>
                </details>
              );
            })}
          </details>
          <details className="home-edit-section">
            <summary>Chiffres clés & qualifications</summary>
            <p className="home-edit-help">
              Ne publiez que les données confirmées par l’entreprise. La source
              est conservée dans la gestion.
            </p>
            {c.credibility.map((v, i) => (
              <div className="settings-service" key={i}>
                {field("Chiffre", v.value, (x) =>
                  edit({
                    ...c,
                    credibility: c.credibility.map((a, j) =>
                      i === j ? { ...a, value: x } : a,
                    ),
                  }),
                )}
                {field("Libellé", v.label, (x) =>
                  edit({
                    ...c,
                    credibility: c.credibility.map((a, j) =>
                      i === j ? { ...a, label: x } : a,
                    ),
                  }),
                )}
                {field("Source / justificatif", v.evidence, (x) =>
                  edit({
                    ...c,
                    credibility: c.credibility.map((a, j) =>
                      i === j ? { ...a, evidence: x } : a,
                    ),
                  }),
                )}
                {(
                  [
                    ["confirmed", "Chiffre vérifié"],
                    ["published", "Afficher"],
                  ] as const
                ).map(([k, l]) => (
                  <label className="settings-check" key={k}>
                    <input
                      type="checkbox"
                      checked={v[k]}
                      onChange={(e) =>
                        edit({
                          ...c,
                          credibility: c.credibility.map((a, j) =>
                            i === j ? { ...a, [k]: e.target.checked } : a,
                          ),
                        })
                      }
                    />
                    {l}
                  </label>
                ))}
              </div>
            ))}
            <button
              type="button"
              className="team-secondary"
              onClick={() =>
                edit({
                  ...c,
                  credibility: [
                    ...c.credibility,
                    {
                      value: "À compléter",
                      label: "À compléter",
                      evidence: "",
                      confirmed: false,
                      published: false,
                    },
                  ],
                })
              }
            >
              Ajouter un chiffre
            </button>
            {c.credentials.map((v, i) => (
              <div className="settings-service" key={i}>
                {field("Qualification / certification", v.title, (x) =>
                  edit({
                    ...c,
                    credentials: c.credentials.map((a, j) =>
                      i === j ? { ...a, title: x } : a,
                    ),
                  }),
                )}
                {field("Source du justificatif", v.source, (x) =>
                  edit({
                    ...c,
                    credentials: c.credentials.map((a, j) =>
                      i === j ? { ...a, source: x } : a,
                    ),
                  }),
                )}
                {(
                  [
                    ["confirmed", "Justificatif vérifié"],
                    ["published", "Afficher"],
                  ] as const
                ).map(([k, l]) => (
                  <label key={k} className="settings-check">
                    <input
                      type="checkbox"
                      checked={v[k]}
                      onChange={(e) =>
                        edit({
                          ...c,
                          credentials: c.credentials.map((a, j) =>
                            i === j ? { ...a, [k]: e.target.checked } : a,
                          ),
                        })
                      }
                    />
                    {l}
                  </label>
                ))}
              </div>
            ))}
            <button
              type="button"
              className="team-secondary"
              onClick={() =>
                edit({
                  ...c,
                  credentials: [
                    ...c.credentials,
                    {
                      title: "À compléter",
                      source: "",
                      confirmed: false,
                      published: false,
                    },
                  ],
                })
              }
            >
              Ajouter une qualification
            </button>
          </details>
          <details className="home-edit-section">
            <summary>Témoignages autorisés</summary>
            {c.testimonials.map((v, i) => (
              <div className="settings-service" key={i}>
                {(["quote", "author", "source"] as const).map((k) => (
                  <div key={k}>
                    {field(
                      {
                        quote: "Témoignage",
                        author: "Auteur",
                        source: "Source de l’autorisation",
                      }[k],
                      v[k],
                      (x) =>
                        edit({
                          ...c,
                          testimonials: c.testimonials.map((a, j) =>
                            i === j ? { ...a, [k]: x } : a,
                          ),
                        }),
                      k === "quote",
                    )}
                  </div>
                ))}
                {(
                  [
                    ["authorized", "Autorisation obtenue"],
                    ["published", "Afficher"],
                  ] as const
                ).map(([k, l]) => (
                  <label className="settings-check" key={k}>
                    <input
                      type="checkbox"
                      checked={v[k]}
                      onChange={(e) =>
                        edit({
                          ...c,
                          testimonials: c.testimonials.map((a, j) =>
                            i === j ? { ...a, [k]: e.target.checked } : a,
                          ),
                        })
                      }
                    />
                    {l}
                  </label>
                ))}
              </div>
            ))}
            <button
              type="button"
              className="team-secondary"
              onClick={() =>
                edit({
                  ...c,
                  testimonials: [
                    ...c.testimonials,
                    {
                      quote: "À compléter",
                      author: "À compléter",
                      source: "",
                      authorized: false,
                      published: false,
                    },
                  ],
                })
              }
            >
              Ajouter un témoignage
            </button>
          </details>
        </fieldset>
        {error && (
          <p role="alert" className="team-error">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="home-edit-success">
            <Check size={18} />
            {message}
          </p>
        )}
        <div className="home-edit-actions">
          <button
            type="button"
            className="team-secondary"
            disabled={pending}
            onClick={() => void save("save")}
          >
            <Save size={18} />
            Brouillon
          </button>
          <button type="submit" className="team-primary" disabled={pending}>
            {pending ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <Check size={18} />
            )}
            Publier
          </button>
        </div>
      </form>
    </main>
  );
}
