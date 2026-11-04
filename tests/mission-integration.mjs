// Isolated development branch only. No real email is sent.
import assert from "node:assert/strict";
import { randomUUID, randomInt, createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { defaultSiteContent } from "../lib/site-content.ts";
if (process.env.NEON_BRANCH !== "cms-development")
  throw Error("cms-development required");
const base = process.env.CMS_TEST_BASE_URL || "http://127.0.0.1:3032";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw Error("Loopback only");
const sql = neon(process.env.DATABASE_URL),
  emails = [
    "qa-mission-admin@mk-example.invalid",
    "qa-mission-editor@mk-example.invalid",
  ];
const previous = (
  await sql`SELECT * FROM cms_site_settings WHERE key='site'`
)[0];
const quotaKey =
  "contact:" +
  createHash("sha256")
    .update(`${new Date().toISOString().slice(0, 10)}:local`)
    .digest("hex");
const previousQuota = (
  await sql`SELECT * FROM cms_rate_limits WHERE key=${quotaKey}`
)[0];
await sql`DELETE FROM cms_rate_limits WHERE key=${quotaKey}`;
let quoteId = "";
let changed = false,
  mediaId = "",
  contactId = "";
const storage = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
});
async function req(
  path,
  { cookie = "", method = "GET", body, origin = base } = {},
) {
  return fetch(base + path, {
    method,
    redirect: "manual",
    headers: {
      Cookie: cookie,
      ...(method !== "GET"
        ? { Origin: origin, "Content-Type": "application/json" }
        : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function json(path, options = {}, status = 200) {
  const r = await req(path, options);
  const d = await r.json();
  assert.equal(r.status, status, JSON.stringify(d));
  return d;
}
async function login(email) {
  const otp = String(randomInt(100000, 999999));
  await sql`DELETE FROM neon_auth.verification WHERE identifier=${"sign-in-otp-" + email}`;
  await sql`INSERT INTO neon_auth.verification(id,identifier,value,"expiresAt","createdAt","updatedAt") VALUES(${randomUUID()},${"sign-in-otp-" + email},${createHash("sha256").update(otp).digest("base64url") + ":0"},now()+interval '5 minutes',now(),now())`;
  const r = await req("/api/auth/sign-in/email-otp", {
    method: "POST",
    body: { email, otp },
  });
  assert.equal(r.status, 200);
  return r.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}
try {
  for (const [i, email] of emails.entries()) {
    await sql`INSERT INTO cms_members(email,name,role) VALUES(${email},'Mission QA',${i ? "editor" : "admin"}) ON CONFLICT(email) DO UPDATE SET active=true`;
    await sql`INSERT INTO neon_auth."user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES(${randomUUID()},'Mission QA',${email},true,now(),now()) ON CONFLICT(email) DO NOTHING`;
  }
  const admin = await login(emails[0]),
    editor = await login(emails[1]);
  await json("/api/equipe/settings", {}, 401);
  await json("/api/equipe/settings", { cookie: editor }, 403);
  await json("/api/equipe/media", { cookie: editor }, 403);
  const { page } = await json("/api/equipe/settings", { cookie: admin });
  let content = structuredClone(defaultSiteContent);
  content.services[0].title = "Prestation QA privée";
  content.credibility[0].evidence = "SECRET JUSTIFICATIF QA";
  await json(
    "/api/equipe/settings",
    {
      cookie: admin,
      method: "PATCH",
      origin: "https://foreign.example",
      body: { action: "save", version: page.version, content },
    },
    403,
  );
  let result = await json("/api/equipe/settings", {
    cookie: admin,
    method: "PATCH",
    body: { action: "save", version: page.version, content },
  });
  changed = true;
  assert(
    !(await (await req("/expertises")).text()).includes("Prestation QA privée"),
  );
  await json(
    "/api/equipe/settings",
    {
      cookie: admin,
      method: "PATCH",
      body: { action: "publish", version: page.version, content },
    },
    409,
  );
  const invalid = structuredClone(content);
  invalid.credibility[0].confirmed = false;
  await json(
    "/api/equipe/settings",
    {
      cookie: admin,
      method: "PATCH",
      body: { action: "publish", version: result.version, content: invalid },
    },
    400,
  );
  const bytes = await readFile(
    new URL("../public/images/htc-la-boisse-reseaux-480.webp", import.meta.url),
  );
  const signed = await json("/api/equipe/media", {
    cookie: admin,
    method: "POST",
    body: {
      scope: "site",
      action: "presign",
      filename: "mission-test.webp",
      mime: "image/webp",
      size: bytes.length,
    },
  });
  mediaId = signed.id;
  assert(
    (
      await fetch(signed.url, {
        method: "PUT",
        headers: { "Content-Type": "image/webp" },
        body: bytes,
      })
    ).ok,
  );
  const completed = await json("/api/equipe/media", {
    cookie: admin,
    method: "POST",
    body: { scope: "site", action: "complete", id: mediaId },
  });
  assert.equal((await req("/media/" + mediaId)).status, 404);
  content.logo = {
    src: "/media/" + mediaId,
    alt: "Photo QA vérifiée",
    width: completed.media.width,
    height: completed.media.height,
  };
  content.services[0].title = "Prestation QA publiée";
  result = await json("/api/equipe/settings", {
    cookie: admin,
    method: "PATCH",
    body: { action: "publish", version: result.version, content },
  });
  const publicPage = await (await req("/expertises")).text();
  assert(publicPage.includes("Prestation QA publiée"));
  assert(!publicPage.includes("SECRET JUSTIFICATIF QA"));
  assert.equal((await req("/media/" + mediaId + "?w=480")).status, 200);
  assert(
    (await (await req("/expertises/reseaux")).text()).includes(
      "Prestation QA publiée",
    ),
  );
  content.services[0].published = false;
  result = await json("/api/equipe/settings", {
    cookie: admin,
    method: "PATCH",
    body: { action: "publish", version: result.version, content },
  });
  assert.equal((await req("/expertises/reseaux")).status, 404);
  assert(
    !(await (await req("/sitemap.xml")).text()).includes("/expertises/reseaux"),
  );
  await json("/api/equipe/contacts", {}, 401);
  await json("/api/equipe/contacts", { cookie: editor }, 403);
  contactId = randomUUID();
  const contact = {
    id: contactId,
    name: "Test de réception",
    email: "qa-contact@mk-example.invalid",
    phone: "",
    message: "Vérification isolée du formulaire de demande de ventilation.",
    consent: true,
    website: "",
    startedAt: Date.now() - 5000,
  };
  await json(
    "/api/contact",
    { method: "POST", origin: "https://foreign.example", body: contact },
    403,
  );
  await json(
    "/api/contact",
    { method: "POST", body: { ...contact, consent: false } },
    400,
  );
  const saved = await json(
    "/api/contact",
    { method: "POST", body: contact },
    201,
  );
  assert(saved.reference);
  assert.equal(
    (await json("/api/contact", { method: "POST", body: contact })).reference,
    saved.reference,
  );
  const inbox = await json("/api/equipe/contacts", { cookie: admin });
  assert(inbox.contacts.some((c) => c.id === contactId));
  await json(
    "/api/equipe/contacts",
    {
      cookie: editor,
      method: "PATCH",
      body: { id: contactId, status: "replied" },
    },
    403,
  );
  await json("/api/equipe/contacts", {
    cookie: admin,
    method: "PATCH",
    body: { id: contactId, status: "replied" },
  });
  assert.equal(
    (await sql`SELECT status FROM cms_contacts WHERE id=${contactId}`)[0]
      .status,
    "replied",
  );
  if (!process.env.CLOUDFLARE_D1_API_TOKEN) {
    quoteId = randomUUID();
    const quote = {
      id: quoteId,
      service: "reseaux",
      profile: "Professionnel",
      city: "Valence",
      postcode: "26000",
      timing: "Projet à définir",
      description: "Devis de contrôle pour une installation de ventilation.",
      name: "Mission devis QA",
      company: "",
      email: "qa-devis@mk-example.invalid",
      phone: "0700000000",
      consent: true,
      website: "",
      startedAt: Date.now() - 5000,
    };
    const quoted = await json(
      "/api/devis",
      { method: "POST", body: quote },
      201,
    );
    assert(quoted.reference.startsWith("MK-D-"));
    assert.equal(
      (await sql`SELECT message FROM cms_contacts WHERE id=${quoteId}`).length,
      1,
    );
  }
  await json(
    "/api/equipe/contacts",
    { cookie: editor, method: "DELETE", body: { id: contactId } },
    403,
  );
  await json("/api/equipe/contacts", {
    cookie: admin,
    method: "DELETE",
    body: { id: contactId },
  });
  assert.equal(
    (await sql`SELECT id FROM cms_contacts WHERE id=${contactId}`).length,
    0,
  );
  // Restore the public snapshot through the API, invalidating rendered caches.
  result = await json("/api/equipe/settings", {
    cookie: admin,
    method: "PATCH",
    body: {
      action: "publish",
      version: result.version,
      content: previous?.published || defaultSiteContent,
    },
  });
  assert.equal((await req("/media/" + mediaId)).status, 404);
  await req("/api/auth/sign-out", { cookie: admin, method: "POST", body: {} });
  await req("/api/auth/sign-out", { cookie: editor, method: "POST", body: {} });
  console.log(
    "Mission integration passed: roles, origin, private drafts, conflicts, evidence validation, site image import/privacy, dynamic service publication, sitemap, short contact persistence/idempotency and private inbox.",
  );
} finally {
  if (quoteId) await sql`DELETE FROM cms_contacts WHERE id=${quoteId}`;
  if (previousQuota)
    await sql`INSERT INTO cms_rate_limits(key,count,expires_at) VALUES(${quotaKey},${previousQuota.count},${previousQuota.expires_at}) ON CONFLICT(key) DO UPDATE SET count=EXCLUDED.count,expires_at=EXCLUDED.expires_at`;
  else await sql`DELETE FROM cms_rate_limits WHERE key=${quotaKey}`;
  if (changed) {
    if (previous)
      await sql`UPDATE cms_site_settings SET draft=${JSON.stringify(previous.draft)}::jsonb,published=${previous.published ? JSON.stringify(previous.published) : null}::jsonb,published_media=${previous.published_media}::uuid[],version=${previous.version},updated_by=${previous.updated_by},updated_at=${previous.updated_at} WHERE key='site'`;
    else await sql`DELETE FROM cms_site_settings WHERE key='site'`;
  }
  if (contactId) await sql`DELETE FROM cms_contacts WHERE id=${contactId}`;
  if (mediaId) {
    const row = (
      await sql`SELECT object_key FROM cms_media WHERE id=${mediaId}`
    )[0];
    if (row)
      await storage.send(
        new DeleteObjectsCommand({
          Bucket: "chantier-medias",
          Delete: {
            Objects: [
              row.object_key,
              row.object_key.replace(".webp", "-480.webp"),
              row.object_key.replace(".webp", "-800.webp"),
            ].map((Key) => ({ Key })),
          },
        }),
      );
    await sql`DELETE FROM cms_media WHERE id=${mediaId}`;
  }
  await sql`DELETE FROM cms_site_history WHERE actor_email=ANY(${emails}::text[])`;
  for (const email of emails) {
    await sql`DELETE FROM neon_auth.session WHERE "userId" IN(SELECT id FROM neon_auth."user" WHERE email=${email})`;
    await sql`DELETE FROM neon_auth."user" WHERE email=${email}`;
    await sql`DELETE FROM cms_members WHERE email=${email}`;
  }
}
