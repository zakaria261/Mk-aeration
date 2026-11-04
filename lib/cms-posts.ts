import "server-only";
import { publicSite } from "./site-content-server";
import { unstable_cache } from "next/cache";
import { cmsDb } from "./cms-db";
import { CmsError } from "./cms-access";
import { projects, type Project, type ProjectCardData } from "./content";
import type {
  TeamMember,
  TeamPost,
  ContentDraft,
  ContentKind,
} from "./cms-types";

export async function editablePost(
  id: string,
  member: TeamMember,
): Promise<TeamPost> {
  if (!/^[\da-f-]{36}$/.test(id))
    throw new CmsError(404, "Publication introuvable.");
  const rows =
    await cmsDb()`SELECT * FROM cms_posts WHERE id=${id} AND (owner_email=${member.email} OR ${member.role === "admin"})`;
  if (!rows[0]) throw new CmsError(404, "Publication introuvable.");
  return rows[0] as TeamPost;
}

export async function verifyMedia(draft: ContentDraft, postId: string) {
  const ids = draft.media.map((m) => m.id);
  if (!ids.length) return;
  const rows =
    await cmsDb()`SELECT id,width,height FROM cms_media WHERE post_id=${postId} AND ready=true AND id=ANY(${ids}::uuid[])`;
  if (rows.length !== ids.length)
    throw new CmsError(
      400,
      "Certaines photos ne sont pas encore importées ou n’appartiennent pas à cette publication.",
    );
  for (const m of draft.media) {
    const actual = rows.find((r) => r.id === m.id);
    if (!actual || m.width !== actual.width || m.height !== actual.height)
      throw new CmsError(400, "Les dimensions d’une photo sont incorrectes.");
  }
}

export const getPublicPosts = unstable_cache(
  async (): Promise<TeamPost[]> => {
    if (!process.env.DATABASE_URL) return [];
    const rows =
      await cmsDb()`SELECT id,kind,slug,published,published_at FROM cms_posts WHERE published IS NOT NULL ORDER BY published_at DESC LIMIT 100`;
    return rows as TeamPost[];
  },
  ["mk-publications-v1"],
  { revalidate: 60, tags: ["cms-public"] },
);

export function asProject(post: TeamPost): Project {
  const d = post.published!;
  const cover = d.media.find((m) => m.id === d.coverId)!;
  return {
    slug: post.slug,
    title: d.title,
    place: d.location,
    sector: d.sector || "Chantier MK Aération",
    category: d.category || "Ventilation",
    image: `/media/${cover.id}`,
    imageWidth: cover.width,
    imageHeight: cover.height,
    alt: cover.alt,
    coverKind: "chantier",
    intro: d.summary,
    description: d.body,
    scope: d.scope,
    media: [cover, ...d.media.filter((m) => m.id !== cover.id)].map((m) => ({
      src: `/media/${m.id}`,
      width: m.width,
      height: m.height,
      alt: m.alt,
      caption: m.caption,
      kind: "chantier",
    })),
  };
}
export async function allProjects() {
  let added: Project[] = [];
  try {
    added = (await getPublicPosts())
      .filter((p) => p.kind === "realisation")
      .map(asProject);
  } catch {
    console.error("Published content is temporarily unavailable");
  }
  const settings = await publicSite();
  const historical = projects.flatMap((p) => {
    const edit = settings.projectEdits.find((e) => e.slug === p.slug);
    if (edit && !edit.published) return [];
    if (!edit) return [p];
    return [
      {
        ...p,
        title: edit.title,
        description: edit.description,
        image: edit.image.src,
        alt: edit.image.alt,
        imageWidth: edit.image.width,
        imageHeight: edit.image.height,
        media: [
          {
            ...p.media[0],
            src: edit.image.src,
            alt: edit.image.alt,
            width: edit.image.width,
            height: edit.image.height,
          },
          ...p.media.slice(1),
        ],
      },
    ];
  });
  const montBlanc = historical.find((p) => p.slug === "tunnel-du-mont-blanc");
  return [
    ...(montBlanc ? [montBlanc] : []),
    ...added,
    ...historical.filter((p) => p !== montBlanc),
  ];
}
export async function publicNews() {
  try {
    return (await getPublicPosts()).filter((p) => p.kind === "actualite");
  } catch {
    console.error("News is temporarily unavailable");
    return [];
  }
}
export const isContentKind = (value: unknown): value is ContentKind =>
  value === "realisation" || value === "actualite";

export function projectCardData(project: Project): ProjectCardData {
  const {
    slug,
    title,
    place,
    sector,
    category,
    image,
    imageWidth,
    imageHeight,
    alt,
    coverKind,
    imagePosition,
  } = project;
  return {
    slug,
    title,
    place,
    sector,
    category,
    image,
    imageWidth,
    imageHeight,
    alt,
    coverKind,
    imagePosition,
    ...(project.video ? { video: { duration: project.video.duration } } : {}),
  };
}
