// Explicit integration run against the isolated development branch only.
// No e-mail is sent: OTP fixtures belong exclusively to invalid test addresses.
import assert from "node:assert/strict";
import { randomUUID, randomInt, createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

if (process.env.NEON_BRANCH !== "cms-development")
  throw new Error("Run only on cms-development.");
const base = process.env.CMS_TEST_BASE_URL || "http://127.0.0.1:3032";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname))
  throw new Error("Only loopback test servers are allowed.");
const sql = neon(process.env.DATABASE_URL);
const emails = [
  "qa-admin@mk-example.invalid",
  "qa-editor@mk-example.invalid",
  "qa-other@mk-example.invalid",
];
const posts = [],
  mediaIds = [];
const storage = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
});
async function request(
  path,
  { cookie = "", method = "GET", body, origin = base } = {},
) {
  return fetch(base + path, {
    method,
    redirect: "manual",
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
      ...(method !== "GET"
        ? { Origin: origin, "Content-Type": "application/json" }
        : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
async function json(path, options, status = 200) {
  const response = await request(path, options);
  const data = await response.json();
  assert.equal(response.status, status, `${path}: ${JSON.stringify(data)}`);
  return data;
}
async function login(email, wrongFirst = false) {
  const otp = String(randomInt(100000, 999999));
  await sql`DELETE FROM neon_auth.verification WHERE identifier=${"sign-in-otp-" + email}`;
  await sql`INSERT INTO neon_auth.verification(id,identifier,value,"expiresAt","createdAt","updatedAt") VALUES(${randomUUID()},${"sign-in-otp-" + email},${createHash("sha256").update(otp).digest("base64url") + ":0"},now()+interval '5 minutes',now(),now())`;
  if (wrongFirst)
    assert.equal(
      (
        await request("/api/auth/sign-in/email-otp", {
          method: "POST",
          body: { email, otp: "000000" },
        })
      ).status,
      400,
    );
  const response = await request("/api/auth/sign-in/email-otp", {
    method: "POST",
    body: { email, otp },
  });
  assert.equal(response.status, 200, await response.clone().text());
  const cookie = response.headers
    .getSetCookie()
    .map((s) => s.split(";")[0])
    .join("; ");
  assert(cookie.includes("session_token"));
  return cookie;
}
const previousHome = await sql`SELECT draft,published,version,updated_at FROM cms_pages WHERE key='home'`;
let homeTouched = false;
try {
  for (const [index, email] of emails.entries()) {
    await sql`INSERT INTO cms_members(email,name,role) VALUES(${email},${"Validation " + index},${index === 0 ? "admin" : "editor"}) ON CONFLICT(email) DO UPDATE SET active=true`;
    await sql`INSERT INTO neon_auth."user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES(${randomUUID()},${"Validation " + index},${email},true,now(),now()) ON CONFLICT(email) DO NOTHING`;
  }
  assert.equal((await request("/equipe")).status, 307);
  await json("/api/equipe/posts", {}, 401);
  await json("/api/auth/sign-up/email", { method: "POST", body: {} }, 404);
  const admin = await login(emails[0], true),
    editor = await login(emails[1]),
    other = await login(emails[2]);
  assert.equal((await request("/equipe", { cookie: admin })).status, 200);
  await json("/api/equipe/posts", { cookie: editor });
  await json("/api/equipe/members", { cookie: editor }, 403);
  await json(
    "/api/equipe/posts",
    {
      cookie: editor,
      method: "POST",
      origin: "https://foreign.example",
      body: { kind: "realisation" },
    },
    403,
  );
  let { post } = await json(
    "/api/equipe/posts",
    { cookie: editor, method: "POST", body: { kind: "realisation" } },
    201,
  );
  posts.push(post.id);
  const path = `/api/equipe/posts/${post.id}`;
  const patch = (
    cookie,
    action,
    draft = post.draft,
    version = post.version,
  ) => ({ cookie, method: "PATCH", body: { action, version, draft } });
  await json(path, patch(other, "save"), 404);
  await json(path, patch(editor, "publish"), 403);
  await json(path, patch(editor, "submit"), 400);
  const source = await readFile(
    new URL("../public/images/htc-la-boisse-reseaux-480.webp", import.meta.url),
  );
  const presigned = await json("/api/equipe/media", {
    cookie: editor,
    method: "POST",
    body: {
      action: "presign",
      postId: post.id,
      filename: "validation.webp",
      mime: "image/webp",
      size: source.length,
    },
  });
  mediaIds.push(presigned.id);
  assert.equal(
    (
      await fetch(presigned.url, {
        method: "PUT",
        headers: { "Content-Type": "image/webp" },
        body: source,
      })
    ).status,
    200,
  );
  const completed = await json("/api/equipe/media", {
    cookie: editor,
    method: "POST",
    body: { action: "complete", postId: post.id, id: presigned.id },
  });
  const media = {
    ...completed.media,
    alt: "Gaines circulaires de ventilation sous charpente",
    caption: "Photo de validation privée.",
  };
  const draft = {
    ...post.draft,
    title: "Validation du parcours équipe",
    summary: "Une publication de test sur la branche de développement isolée.",
    body: "Cette publication vérifie le parcours complet de préparation, d’import des photos, de validation et de publication des réalisations.",
    coverId: media.id,
    media: [media],
    scope: ["Vérification de l’import des photos"],
  };
  assert.equal((await request(`/media/${media.id}`)).status, 404);
  assert.equal(
    (await request(`/media/${media.id}`, { cookie: other })).status,
    404,
  );
  assert.equal(
    (await request(`/media/${media.id}`, { cookie: editor })).status,
    200,
  );
  const previous = post.version;
  ({ post } = await json(path, patch(editor, "save", draft)));
  await json(path, patch(editor, "save", draft, previous), 409);
  ({ post } = await json(path, patch(editor, "submit")));
  assert.equal(post.status, "review");
  assert.equal(post.published, null);
  assert.equal((await request(`/realisations/${post.slug}`)).status, 404);
  ({ post } = await json(path, patch(admin, "publish")));
  assert(post.published);
  assert.equal((await request(`/media/${media.id}?w=480`)).status, 200);
  const publishedPage = await request(`/realisations/${post.slug}`);
  assert.equal(publishedPage.status, 200);
  assert((await publishedPage.text()).includes(draft.title));
  ({ post } = await json(
    path,
    patch(editor, "save", {
      ...post.draft,
      title: "Modification privée non publiée",
    }),
  ));
  const currentPage = await request(`/realisations/${post.slug}`);
  assert((await currentPage.text()).includes(draft.title));
  assert.equal(post.published.title, draft.title);
  ({ post } = await json(path, patch(admin, "unpublish")));
  assert.equal((await request(`/realisations/${post.slug}`)).status, 404);
  ({ post } = await json(path, patch(admin, "archive")));
  assert.equal(post.status, "archived");
  ({ post } = await json(path, patch(admin, "restore")));
  assert.equal(post.status, "draft");
  let { post: news } = await json(
    "/api/equipe/posts",
    { cookie: editor, method: "POST", body: { kind: "actualite" } },
    201,
  );
  posts.push(news.id);
  const newsPath = `/api/equipe/posts/${news.id}`;
  await json(
    newsPath,
    {
      cookie: editor,
      method: "PATCH",
      body: { action: "save", version: news.version, draft },
    },
    400,
  );
  const newsSigned = await json("/api/equipe/media", {
    cookie: editor,
    method: "POST",
    body: {
      action: "presign",
      postId: news.id,
      filename: "news.webp",
      mime: "image/webp",
      size: source.length,
    },
  });
  assert.equal(
    (
      await fetch(newsSigned.url, {
        method: "PUT",
        headers: { "Content-Type": "image/webp" },
        body: source,
      })
    ).status,
    200,
  );
  const newsCompleted = await json("/api/equipe/media", {
    cookie: editor,
    method: "POST",
    body: { action: "complete", postId: news.id, id: newsSigned.id },
  });
  const newsDraft = {
    ...draft,
    title: "Actualité de validation isolée",
    coverId: newsCompleted.media.id,
    media: [
      {
        ...newsCompleted.media,
        alt: "Gaines de ventilation sur notre chantier",
        caption: "",
      },
    ],
  };
  ({ post: news } = await json(newsPath, {
    cookie: admin,
    method: "PATCH",
    body: { action: "publish", version: news.version, draft: newsDraft },
  }));
  assert.equal((await request(`/actualites/${news.slug}`)).status, 200);
  assert(
    (await (await request("/actualites")).text()).includes(newsDraft.title),
  );
  assert((await (await request("/")).text()).includes(newsDraft.title));
  await json(newsPath, {
    cookie: admin,
    method: "PATCH",
    body: { action: "unpublish", version: news.version, draft: news.draft },
  });
  assert.equal((await request(`/actualites/${news.slug}`)).status, 404);
  await json("/api/equipe/members", {
    cookie: admin,
    method: "POST",
    body: {
      email: emails[1],
      name: "Validation editor",
      role: "editor",
      active: false,
    },
  });
  await json("/api/equipe/posts", { cookie: editor }, 401);
  await json(
    "/api/equipe/members",
    {
      cookie: admin,
      method: "POST",
      body: {
        email: emails[0],
        name: "Validation admin",
        role: "editor",
        active: true,
      },
    },
    400,
  );
  // La gestion de l’accueil est réservée au dirigeant, avec brouillon privé.
  await json("/api/equipe/home", {}, 401);
  await json("/api/equipe/home", { cookie: other }, 403);
  let { page: home } = await json("/api/equipe/home", { cookie: admin });
  const draftHome = { ...home.draft, heroTitle: "Un titre de contrôle privé" };
  await json("/api/equipe/home", { cookie: admin, method: "PATCH", origin: "https://foreign.example", body: { action: "save", version: home.version, content: draftHome } }, 403);
  const savedHome = await json("/api/equipe/home", { cookie: admin, method: "PATCH", body: { action: "save", version: home.version, content: draftHome } });
  homeTouched = true;
  assert(!(await (await request("/")).text()).includes(draftHome.heroTitle));
  await json("/api/equipe/home", { cookie: admin, method: "PATCH", body: { action: "publish", version: home.version, content: draftHome } }, 409);
  const liveHome = { ...draftHome, heroTitle: "Un titre de contrôle publié" };
  await json("/api/equipe/home", { cookie: admin, method: "PATCH", body: { action: "publish", version: savedHome.version, content: liveHome } });
  assert((await (await request("/")).text()).includes(liveHome.heroTitle));
  await writeFile("/tmp/mk-refonte-admin-session.json", JSON.stringify({ cookies: admin }), { mode: 0o600 });
  const { page: finalHome } = await json("/api/equipe/home", { cookie: admin });
  await json("/api/equipe/home", { cookie: admin, method: "PATCH", body: { action: "publish", version: finalHome.version, content: previousHome[0]?.published || home.draft } });
  await json("/api/auth/sign-out", { cookie: admin, method: "POST", body: {} });
  // Keep an authorized editor fixture for visual QA; no real employee account is changed.
  await sql`UPDATE cms_members SET active=true WHERE email=${emails[1]}`;
  await writeFile(
    "/tmp/mk-cms-qa-session.json",
    JSON.stringify({ cookies: other, email: emails[2] }),
    { mode: 0o600 },
  );
  console.log(
    "CMS integration passed: OTP, session, role checks, ownership, private photos, direct upload, validation, publish, live snapshot, conflict protection, unpublish, archive, restore, revocation and sign-out.",
  );
} finally {
  if (homeTouched) {
    if (previousHome[0]) {
      const h = previousHome[0];
      await sql`UPDATE cms_pages SET draft=${JSON.stringify(h.draft)}::jsonb,published=${h.published ? JSON.stringify(h.published) : null}::jsonb,version=${h.version},updated_at=${h.updated_at} WHERE key='home'`;
    } else await sql`DELETE FROM cms_pages WHERE key='home'`;
  }
  if (posts.length) {
    const media =
      await sql`SELECT object_key FROM cms_media WHERE post_id=ANY(${posts}::uuid[])`;
    if (media.length)
      await storage.send(
        new DeleteObjectsCommand({
          Bucket: "chantier-medias",
          Delete: {
            Objects: media
              .flatMap((m) => [
                m.object_key,
                m.object_key.replace(".webp", "-480.webp"),
                m.object_key.replace(".webp", "-800.webp"),
              ])
              .map((Key) => ({ Key })),
          },
        }),
      );
    await sql`DELETE FROM cms_media WHERE post_id=ANY(${posts}::uuid[])`;
    await sql`DELETE FROM cms_posts WHERE id=ANY(${posts}::uuid[])`;
    await sql`DELETE FROM cms_events WHERE post_id=ANY(${posts}::uuid[])`;
  }
}
