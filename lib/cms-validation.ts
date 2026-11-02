import { z } from "zod";

export const draftSchema = z
  .object({
    title: z.string().trim().max(110),
    summary: z.string().trim().max(400),
    body: z.string().trim().max(18000),
    location: z.string().trim().max(120),
    category: z.string().trim().max(80),
    sector: z.string().trim().max(80),
    scope: z.array(z.string().trim().min(1).max(220)).max(12),
    media: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            alt: z.string().trim().max(240),
            caption: z.string().trim().max(400),
            type: z.literal("image"),
            width: z.number().int().positive().max(2200),
            height: z.number().int().positive().max(2200),
          })
          .strict(),
      )
      .max(16),
    coverId: z.string().uuid().or(z.literal("")),
  })
  .strict();

export function publicationIssues(value: z.infer<typeof draftSchema>) {
  const issues: string[] = [];
  if (value.title.length < 4)
    issues.push("Ajoutez un titre d’au moins 4 caractères.");
  if (value.summary.length < 30)
    issues.push("Rédigez une introduction d’au moins 30 caractères.");
  if (value.body.length < 60)
    issues.push("Décrivez l’intervention en au moins 60 caractères.");
  if (!value.media.length || !value.media.some((m) => m.id === value.coverId))
    issues.push("Choisissez une photo de couverture.");
  if (value.media.some((m) => m.alt.length < 4))
    issues.push("Décrivez chaque photo pour les lecteurs d’écran.");
  if (new Set(value.media.map((m) => m.id)).size !== value.media.length)
    issues.push("Une photo apparaît plusieurs fois.");
  return issues;
}

export const memberSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(200)
      .transform((s) => s.toLowerCase()),
    name: z.string().trim().min(2).max(100),
    role: z.enum(["admin", "editor"]),
    active: z.boolean(),
  })
  .strict();

export function contentSlug(title: string, id: string) {
  const text = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
    .replace(/-$/, "");
  return `${text || "chantier"}-${id.slice(0, 8)}`;
}
