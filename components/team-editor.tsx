"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  ImagePlus,
  Eye,
  Save,
  Send,
  X,
  Star,
  Trash2,
  LoaderCircle,
  ArrowUpRight,
  RotateCcw,
  Camera,
} from "lucide-react";
import { PublicationView } from "./publication-view";
import {
  statusLabels,
  publicPostPath,
  type TeamPost,
  type TeamMember,
  type ContentDraft,
  type ContentMedia,
} from "@/lib/cms-types";
import { publicationIssues } from "@/lib/cms-validation";

async function optimizePhoto(file: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error(
      "Choisissez une photo JPG, PNG ou WebP. Sur iPhone, utilisez l’export JPEG si nécessaire.",
    );
  if (file.size > 20 * 1024 * 1024)
    throw new Error(
      "Cette photo dépasse 20 Mo. Choisissez une version plus légère.",
    );
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * ratio);
  canvas.height = Math.round(bitmap.height * ratio);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Le navigateur ne peut pas préparer cette photo.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9),
  );
  if (!blob)
    throw new Error(
      "Cette photo ne peut pas être convertie. Exportez-la en JPG puis réessayez.",
    );
  return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
    type: blob.type,
  });
}
function uploadFile(
  url: string,
  file: File,
  progress: (value: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) progress(Math.round((100 * e.loaded) / e.total));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(
            new Error(
              "Le transfert de la photo a échoué. Réessayez avec une connexion stable.",
            ),
          );
    xhr.onerror = () =>
      reject(
        new Error(
          "La connexion a été interrompue. Les photos déjà importées sont conservées.",
        ),
      );
    xhr.timeout = 120000;
    xhr.ontimeout = () =>
      reject(new Error("Le transfert a pris trop de temps. Réessayez."));
    xhr.send(file);
  });
}
async function mediaRequest<T>(body: unknown): Promise<T> {
  const response = await fetch("/api/equipe/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(result.error || "L’import a échoué.");
  return result;
}

export function TeamEditor({
  initial,
  member,
}: {
  initial: TeamPost;
  member: TeamMember;
}) {
  const [post, setPost] = useState(initial);
  const [draft, setDraft] = useState<ContentDraft>(initial.draft);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [upload, setUpload] = useState<{
    label: string;
    progress: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const preview = useRef<HTMLDialogElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(post.draft);
  const locked = post.status === "archived";
  const issues = publicationIssues(draft);
  useEffect(() => {
    if (!dirty && !upload) return;
    const leave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const navigate = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (
        target &&
        target.target !== "_blank" &&
        !target.getAttribute("href")?.startsWith("#") &&
        !window.confirm(
          "Des modifications ne sont pas enregistrées. Quitter cette publication ?",
        )
      )
        event.preventDefault();
    };
    window.addEventListener("beforeunload", leave);
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("beforeunload", leave);
      document.removeEventListener("click", navigate, true);
    };
  }, [dirty, upload]);
  function update<K extends keyof ContentDraft>(
    key: K,
    value: ContentDraft[K],
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
    setNotice("");
  }
  function updateMedia(id: string, patch: Partial<ContentMedia>) {
    update(
      "media",
      draft.media.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  }
  async function save(action = "save") {
    if (
      ["unpublish", "archive"].includes(action) &&
      !window.confirm(
        action === "archive"
          ? "Archiver cette publication ? Elle sera retirée du site et restera récupérable dans les archives."
          : "Retirer cette publication du site public ? Le brouillon et les photos seront conservés.",
      )
    )
      return;
    setBusy(action);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/equipe/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, version: post.version, draft }),
      });
      const result = (await response.json()) as {
        post: TeamPost;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error);
      setPost(result.post);
      setDraft(result.post.draft);
      setNotice(
        (
          {
            save: "Brouillon enregistré.",
            submit: "Publication transmise à l’administrateur pour validation.",
            publish:
              "Publication en ligne. Vous pouvez maintenant la voir sur le site.",
            unpublish:
              "Publication retirée du site. Le brouillon est conservé.",
            archive: "Publication archivée. Vous pourrez la restaurer.",
            restore: "Publication restaurée en brouillon.",
          } as Record<string, string>
        )[action],
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "L’enregistrement a échoué. Votre saisie est conservée à l’écran.",
      );
    } finally {
      setBusy("");
    }
  }
  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (draft.media.length + files.length > 16) {
      setError("Une publication peut contenir jusqu’à 16 photos.");
      return;
    }
    setError("");
    setNotice("");
    for (let i = 0; i < files.length; i++) {
      try {
        setUpload({
          label: `Préparation ${i + 1}/${files.length}`,
          progress: 0,
        });
        const file = await optimizePhoto(files[i]);
        setUpload({ label: `Transfert ${i + 1}/${files.length}`, progress: 0 });
        const signed = await mediaRequest<{ id: string; url: string }>({
          action: "presign",
          postId: post.id,
          filename: file.name,
          mime: file.type,
          size: file.size,
        });
        await uploadFile(signed.url, file, (value) =>
          setUpload({
            label: `Transfert ${i + 1}/${files.length}`,
            progress: value,
          }),
        );
        setUpload({
          label: `Optimisation ${i + 1}/${files.length}`,
          progress: 100,
        });
        const completed = await mediaRequest<{ media: ContentMedia }>({
          action: "complete",
          postId: post.id,
          id: signed.id,
        });
        setDraft((d) => ({
          ...d,
          media: [...d.media, completed.media],
          coverId: d.coverId || completed.media.id,
        }));
      } catch (e) {
        setError(
          `${files[i].name} : ${e instanceof Error ? e.message : "L’import a échoué."}`,
        );
        break;
      }
    }
    setUpload(null);
  }
  function move(index: number, direction: number) {
    const media = [...draft.media];
    [media[index], media[index + direction]] = [
      media[index + direction],
      media[index],
    ];
    update("media", media);
  }
  function remove(id: string) {
    const media = draft.media.filter((m) => m.id !== id);
    setDraft({
      ...draft,
      media,
      coverId: draft.coverId === id ? media[0]?.id || "" : draft.coverId,
    });
  }
  return (
    <main className="team-main team-editor-main" id="contenu">
      <Link href="/equipe/publications" className="team-back">
        <ArrowLeft size={17} /> Les publications
      </Link>
      <div className="team-page-heading">
        <div>
          <span className="eyebrow">
            {post.kind === "realisation"
              ? "FICHE CHANTIER"
              : "ACTUALITÉ DE L’ÉQUIPE"}
          </span>
          <h1>
            {post.draft.title ||
              (post.kind === "realisation"
                ? "Une nouvelle réalisation."
                : "Une nouvelle actualité.")}
          </h1>
        </div>
        <span className={`team-badge ${post.status}`}>
          {statusLabels[post.status]}
        </span>
      </div>
      {post.published && post.status !== "published" && (
        <div className="team-notice">
          Une version est en ligne. Vos modifications restent privées jusqu’à
          une nouvelle publication.
        </div>
      )}
      {error && (
        <p className="team-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="team-success" role="status">
          <Check size={18} />
          {notice}
          {post.published && (
            <Link href={publicPostPath(post)} target="_blank">
              Voir sur le site <ArrowUpRight size={15} />
            </Link>
          )}
        </p>
      )}
      <div className="team-editor-grid">
        <div className="team-editor-card">
          <div
            className="team-editor-tabs"
            role="tablist"
            aria-label="Préparer la publication"
          >
            {[
              ["text", "01", "Le contenu"],
              ["photos", "02", `Les photos (${draft.media.length})`],
            ].map(([key, num, label]) => (
              <button
                key={key}
                id={`tab-${key}`}
                role="tab"
                aria-selected={activeTab === key}
                aria-controls={`panel-${key}`}
                onClick={() => setActiveTab(key)}
              >
                <span>{num}</span>
                {label}
              </button>
            ))}
          </div>
          <fieldset
            disabled={!!busy || !!upload || locked}
            className="team-editor-fields"
          >
            <legend className="sr-only">Contenu de la publication</legend>
            <div
              role="tabpanel"
              id="panel-text"
              aria-labelledby="tab-text"
              hidden={activeTab !== "text"}
            >
              <div className="team-field">
                <label htmlFor="post-title">
                  Le titre <span>{draft.title.length}/110</span>
                </label>
                <input
                  id="post-title"
                  value={draft.title}
                  maxLength={110}
                  placeholder={
                    post.kind === "realisation"
                      ? "Ex. Réhabilitation des réseaux VMC à Valence"
                      : "Ex. Une nouvelle étape sur le chantier de Grenoble"
                  }
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>
              <div className="team-field">
                <label htmlFor="post-summary">
                  L’essentiel en quelques lignes{" "}
                  <span>{draft.summary.length}/400</span>
                </label>
                <textarea
                  id="post-summary"
                  value={draft.summary}
                  maxLength={400}
                  rows={3}
                  placeholder="Le bâtiment, le besoin du client et ce que notre équipe a réalisé."
                  onChange={(e) => update("summary", e.target.value)}
                />
                <small>Ce texte présente la publication sur le site.</small>
              </div>
              <div className="team-two-fields">
                <div className="team-field">
                  <label htmlFor="post-location">Lieu du chantier</label>
                  <input
                    id="post-location"
                    value={draft.location}
                    maxLength={120}
                    placeholder="Ex. Grenoble · Isère"
                    onChange={(e) => update("location", e.target.value)}
                  />
                </div>
                <div className="team-field">
                  <label htmlFor="post-sector">Type de bâtiment</label>
                  <input
                    id="post-sector"
                    value={draft.sector}
                    maxLength={80}
                    placeholder="Ex. Logement collectif"
                    onChange={(e) => update("sector", e.target.value)}
                  />
                </div>
              </div>
              {post.kind === "realisation" && (
                <div className="team-field">
                  <label htmlFor="post-category">Expertise principale</label>
                  <select
                    id="post-category"
                    value={draft.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    {[
                      "Réseaux aérauliques",
                      "CTA & double flux",
                      "Réhabilitation VMC",
                      "Extraction",
                      "Soufflage",
                      "Ventilation & hydraulique",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="team-field">
                <label htmlFor="post-body">L’intervention en détail</label>
                <textarea
                  id="post-body"
                  value={draft.body}
                  maxLength={18000}
                  rows={12}
                  placeholder="Décrivez le contexte, les contraintes du chantier, les travaux réalisés et les étapes importantes. Séparez les paragraphes par une ligne vide."
                  onChange={(e) => update("body", e.target.value)}
                />
                <small>
                  Restez précis : types de gaines, réseaux de soufflage et
                  d’extraction, CTA, VMC, raccordements… uniquement les travaux
                  réellement effectués.
                </small>
              </div>
              <div className="team-field">
                <label htmlFor="post-scope">
                  Les travaux réalisés <span>Une ligne par intervention</span>
                </label>
                <textarea
                  id="post-scope"
                  value={draft.scope.join("\n")}
                  rows={5}
                  placeholder={
                    "Pose des gaines circulaires\nRaccordement à la CTA\nInstallation des bouches d’extraction"
                  }
                  onChange={(e) =>
                    update("scope", e.target.value.split("\n").slice(0, 12))
                  }
                  onBlur={() =>
                    update(
                      "scope",
                      draft.scope.map((s) => s.trim()).filter(Boolean),
                    )
                  }
                />
                <small>12 lignes maximum, 220 caractères par ligne.</small>
              </div>
              <button
                type="button"
                className="team-secondary"
                onClick={() => setActiveTab("photos")}
              >
                Continuer avec les photos <ArrowRight size={17} />
              </button>
            </div>
            <div
              role="tabpanel"
              id="panel-photos"
              aria-labelledby="tab-photos"
              hidden={activeTab !== "photos"}
            >
              <div className="team-upload-heading">
                <h2>Le chantier, en images.</h2>
                <p>
                  Jusqu’à 16 photos. Choisissez une couverture, puis ajoutez les
                  détails de votre intervention.
                </p>
              </div>
              <input
                ref={picker}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={addPhotos}
              />
              <input
                ref={camera}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                hidden
                onChange={addPhotos}
              />
              <div className="team-capture">
                <button
                  type="button"
                  className="team-capture-camera"
                  onClick={() => camera.current?.click()}
                  disabled={draft.media.length >= 16}
                >
                  <Camera size={26} />
                  <strong>Prendre une photo</strong>
                  <span>Directement sur le chantier</span>
                </button>
                <button
                  type="button"
                  className="team-dropzone"
                  onClick={() => picker.current?.click()}
                  disabled={draft.media.length >= 16}
                >
                  <ImagePlus size={26} />
                  <strong>Choisir des photos</strong>
                  <span>Pellicule, fichiers ou ordinateur</span>
                </button>
              </div>
              <p className="team-capture-note">
                {draft.media.length}/16 photos · JPG, PNG, WebP · optimisées
                automatiquement pour le site.
              </p>
              <div className="team-photo-list">
                {draft.media.map((m, index) => (
                  <article className="team-photo-edit" key={m.id}>
                    <div className="team-photo-preview">
                      <img
                        src={`/media/${m.id}?w=480`}
                        alt={m.alt || "Photo en cours de préparation"}
                        width={m.width}
                        height={m.height}
                      />
                      {draft.coverId === m.id && (
                        <span>
                          <Star size={12} fill="currentColor" />
                          Couverture
                        </span>
                      )}
                    </div>
                    <div className="team-photo-inputs">
                      <label htmlFor={`alt-${m.id}`}>
                        Décrire la photo <span>Requis</span>
                      </label>
                      <input
                        id={`alt-${m.id}`}
                        value={m.alt}
                        maxLength={240}
                        placeholder="Ex. Gaines circulaires posées sous la charpente"
                        onChange={(e) =>
                          updateMedia(m.id, { alt: e.target.value })
                        }
                      />
                      <label htmlFor={`caption-${m.id}`}>Légende visible</label>
                      <input
                        id={`caption-${m.id}`}
                        value={m.caption}
                        maxLength={400}
                        placeholder="Un détail utile sur la photo"
                        onChange={(e) =>
                          updateMedia(m.id, { caption: e.target.value })
                        }
                      />
                      <div className="team-photo-actions">
                        <button
                          type="button"
                          aria-pressed={draft.coverId === m.id}
                          onClick={() => update("coverId", m.id)}
                        >
                          <Star size={15} />
                          Couverture
                        </button>
                        <button
                          type="button"
                          aria-label={`Monter la photo ${index + 1}`}
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Descendre la photo ${index + 1}`}
                          disabled={index === draft.media.length - 1}
                          onClick={() => move(index, 1)}
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Retirer la photo ${index + 1} de la publication`}
                          onClick={() => remove(m.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </fieldset>
          {upload && (
            <div className="team-upload-progress" role="status">
              <LoaderCircle className="spin" size={17} />
              <span>{upload.label}</span>
              <progress value={upload.progress} max={100} />
              {upload.progress}%
            </div>
          )}
        </div>
        <aside className="team-publish-panel">
          <span className="eyebrow">AVANT LA MISE EN LIGNE</span>
          <h2>Prêt à être vu ?</h2>
          <ul>
            {[
              [draft.title.length >= 4, "Un titre précis"],
              [
                draft.summary.length >= 30 && draft.body.length >= 60,
                "L’intervention expliquée",
              ],
              [
                !!draft.media.length && !!draft.coverId,
                "Une photo de couverture",
              ],
              [
                !!draft.media.length &&
                  draft.media.every((m) => m.alt.length >= 4),
                "Des photos décrites",
              ],
            ].map(([done, label]) => (
              <li key={String(label)} className={done ? "done" : ""}>
                <span>{done ? <Check size={12} /> : ""}</span>
                {String(label)}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="team-secondary"
            onClick={() => preview.current?.showModal()}
          >
            <Eye size={17} />
            Prévisualiser
          </button>
          {member.role === "admin" ? (
            <p>
              Vous validez la mise en ligne. Un brouillon n’est jamais visible
              sur le site.
            </p>
          ) : (
            <p>
              Une fois prêt, transmettez votre contenu. L’administrateur valide
              sa publication.
            </p>
          )}
          {post.published && (
            <Link
              className="team-live-link"
              href={publicPostPath(post)}
              target="_blank"
            >
              Voir la version en ligne <ArrowUpRight size={16} />
            </Link>
          )}
          {member.role === "admin" && (
            <div className="team-secondary-actions">
              {post.published && (
                <button
                  disabled={!!busy || !!upload}
                  onClick={() => save("unpublish")}
                >
                  Retirer du site
                </button>
              )}
              {locked ? (
                <button disabled={!!busy} onClick={() => save("restore")}>
                  <RotateCcw size={14} />
                  Restaurer le brouillon
                </button>
              ) : (
                <button
                  disabled={!!busy || !!upload}
                  onClick={() => save("archive")}
                >
                  Archiver cette publication
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
      <div className="team-editor-savebar">
        <span className={dirty ? "unsaved" : ""}>
          {upload
            ? "Import des photos…"
            : dirty
              ? "Modifications à enregistrer"
              : "Toutes les modifications sont enregistrées"}
        </span>
        <div>
          <button
            className="team-secondary"
            disabled={!!busy || !!upload || locked}
            onClick={() => save()}
          >
            {busy === "save" ? (
              <LoaderCircle className="spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Enregistrer
          </button>
          <button
            className="team-primary"
            disabled={!!busy || !!upload || locked || issues.length > 0}
            title={issues[0]}
            onClick={() => save(member.role === "admin" ? "publish" : "submit")}
          >
            {busy && busy !== "save" ? (
              <LoaderCircle className="spin" size={16} />
            ) : (
              <Send size={16} />
            )}
            {member.role === "admin"
              ? post.published
                ? "Publier les modifications"
                : "Publier sur le site"
              : "Soumettre à validation"}
          </button>
        </div>
      </div>
      <dialog className="team-preview-dialog" ref={preview}>
        <div className="team-preview-toolbar">
          <span>APERÇU PRIVÉ · NON PUBLIÉ</span>
          <button
            type="button"
            aria-label="Fermer l’aperçu"
            onClick={() => preview.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <PublicationView draft={draft} kind={post.kind} preview />
      </dialog>
    </main>
  );
}
