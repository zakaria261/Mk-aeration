"use client";
import { useEffect, useState } from "react";
import { Upload, LoaderCircle } from "lucide-react";
import { staticImages, type SiteContent } from "@/lib/site-content";
type Image = SiteContent["logo"];
export function SiteImagePicker({
  value,
  onChange,
}: {
  value: Image;
  onChange: (image: Image) => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [library, setLibrary] = useState<
    { id: string; width: number; height: number; filename: string }[]
  >([]);
  useEffect(() => {
    let active = true;
    fetch("/api/equipe/media")
      .then((r) =>
        r.ok
          ? (r.json() as Promise<{
              media: {
                id: string;
                width: number;
                height: number;
                filename: string;
              }[];
            }>)
          : null,
      )
      .then((d) => {
        if (active && d) setLibrary(d.media);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      if (file.size > 20 * 1024 * 1024)
        throw Error("Choisissez une photo de moins de 20 Mo.");
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
        throw Error("Exportez cette image en JPEG, PNG ou WebP.");
      const bitmap = await createImageBitmap(file);
      const r = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * r);
      canvas.height = Math.round(bitmap.height * r);
      canvas
        .getContext("2d")!
        .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(Error("Photo illisible."))),
          "image/webp",
          0.87,
        ),
      );
      async function api(body: unknown) {
        const res = await fetch("/api/equipe/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = (await res.json()) as {
          error?: string;
          id: string;
          url: string;
          media: { id: string; width: number; height: number };
        };
        if (!res.ok) throw Error(d.error || "Import indisponible.");
        return d;
      }
      const signed = await api({
        scope: "site",
        action: "presign",
        filename: file.name,
        mime: blob.type,
        size: blob.size,
      });
      const put = await fetch(signed.url, {
        method: "PUT",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      if (!put.ok) throw Error("Le transfert a échoué. Réessayez.");
      const { media } = await api({
        scope: "site",
        action: "complete",
        id: signed.id,
      });
      onChange({
        src: `/media/${media.id}`,
        width: media.width,
        height: media.height,
        alt: value.alt,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import impossible.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="settings-image">
      <img
        src={value.src}
        alt="Aperçu"
        width={value.width}
        height={value.height}
      />
      <label>
        Image existante
        <select
          value={value.src}
          onChange={(e) => {
            const m = library.find((m) => `/media/${m.id}` === e.target.value);
            onChange({
              ...value,
              src: e.target.value,
              ...(m ? { width: m.width, height: m.height } : {}),
            });
          }}
        >
          <option value={value.src}>{value.src.split("/").pop()}</option>
          {staticImages
            .filter((s) => s !== value.src)
            .map((s) => (
              <option key={s} value={s}>
                {s.split("/").pop()}
              </option>
            ))}
          {library
            .filter((m) => `/media/${m.id}` !== value.src)
            .map((m) => (
              <option key={m.id} value={`/media/${m.id}`}>
                {m.filename}
              </option>
            ))}
        </select>
      </label>
      <label className="team-secondary">
        {busy ? (
          <LoaderCircle className="spin" size={18} />
        ) : (
          <Upload size={18} />
        )}
        Importer une image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void upload(f);
          }}
        />
      </label>
      <label>
        Description de l’image
        <input
          value={value.alt}
          maxLength={220}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
        />
      </label>
      {error && (
        <p role="alert" className="team-error">
          {error}
        </p>
      )}
    </div>
  );
}
