export type ContentKind = "realisation" | "actualite";
export type ContentStatus = "draft" | "review" | "published" | "archived";
export type TeamRole = "admin" | "editor";
export type TeamMember = {
  email: string;
  name: string;
  role: TeamRole;
  active: boolean;
};
export type ContentMedia = {
  id: string;
  alt: string;
  caption: string;
  type: "image";
  width: number;
  height: number;
};
export type ContentDraft = {
  title: string;
  summary: string;
  body: string;
  location: string;
  category: string;
  sector: string;
  scope: string[];
  media: ContentMedia[];
  coverId: string;
};
export type TeamPost = {
  id: string;
  kind: ContentKind;
  slug: string;
  owner_email: string;
  status: ContentStatus;
  draft: ContentDraft;
  published: ContentDraft | null;
  version: number;
  updated_at: string;
  published_at: string | null;
};
export const statusLabels: Record<ContentStatus, string> = {
  draft: "Brouillon",
  review: "À valider",
  published: "Publié",
  archived: "Archivé",
};
export const emptyDraft: ContentDraft = {
  title: "",
  summary: "",
  body: "",
  location: "",
  category: "Réseaux aérauliques",
  sector: "",
  scope: [],
  media: [],
  coverId: "",
};
export function publicPostPath(post: Pick<TeamPost, "kind" | "slug">) {
  return `/${post.kind === "realisation" ? "realisations" : "actualites"}/${post.slug}`;
}
