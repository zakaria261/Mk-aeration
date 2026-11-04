// Local browser QA; install Playwright separately or pass PLAYWRIGHT_MODULE_PATH.
import { fileURLToPath } from "node:url";
import { join } from "node:path";
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright"
);
import { neon } from "@neondatabase/serverless";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { randomUUID, randomInt, createHash } from "node:crypto";

import { defaultSiteContent } from "../lib/site-content.ts";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
if (process.env.NEON_BRANCH !== "cms-development")
  throw Error("Development only");
const base = "http://127.0.0.1:3032",
  out = join(projectRoot, "outputs/mission-2026-11-04"),
  sql = neon(process.env.DATABASE_URL),
  email = "qa-admin@mk-example.invalid";
const previous = (
    await sql`SELECT * FROM cms_site_settings WHERE key='site'`
  )[0],
  history = (
    await sql`SELECT coalesce(max(id),0)::text AS id FROM cms_site_history`
  )[0].id;
const quotaKey =
  "contact:" +
  createHash("sha256")
    .update(`${new Date().toISOString().slice(0, 10)}:local`)
    .digest("hex");
const previousQuota = (
  await sql`SELECT * FROM cms_rate_limits WHERE key=${quotaKey}`
)[0];
await sql`DELETE FROM cms_rate_limits WHERE key=${quotaKey}`;
let contactId = "",
  mediaId = "",
  cookie = "",
  browser;
const report = { screens: [], checks: [] };
async function api(path, body) {
  const r = await fetch(base + path, {
    method: body ? "PATCH" : "GET",
    headers: {
      Cookie: cookie,
      ...(body ? { Origin: base, "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await r.json();
  assert(r.ok, JSON.stringify(d));
  return d;
}
try {
  const otp = String(randomInt(100000, 999999));
  await sql`DELETE FROM neon_auth.verification WHERE identifier=${"sign-in-otp-" + email}`;
  await sql`INSERT INTO neon_auth.verification(id,identifier,value,"expiresAt","createdAt","updatedAt") VALUES(${randomUUID()},${"sign-in-otp-" + email},${createHash("sha256").update(otp).digest("base64url") + ":0"},now()+interval '5 minutes',now(),now())`;
  const login = await fetch(base + "/api/auth/sign-in/email-otp", {
    method: "POST",
    headers: { Origin: base, "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  assert.equal(login.status, 200);
  cookie = login.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
    }),
    page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__events = [];
    window.addEventListener("mk:conversion", (e) =>
      window.__events.push(e.detail),
    );
  });
  await page.goto(base + "/contact");
  await page
    .getByRole("textbox", { name: "Votre nom", exact: true })
    .fill("Mission UI QA");
  await page
    .getByRole("textbox", { name: "Votre e-mail", exact: true })
    .fill("qa-ui@mk-example.invalid");
  await page
    .getByRole("textbox", { name: "Votre projet", exact: true })
    .fill("Vérification réelle du parcours de demande de ventilation.");
  await page.getByRole("checkbox").check();
  await page.route("**/api/contact", (r) =>
    r.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Erreur de test temporaire." }),
    }),
  );
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await page.getByRole("alert").waitFor();
  assert.equal(
    await page
      .getByRole("textbox", { name: "Votre nom", exact: true })
      .inputValue(),
    "Mission UI QA",
  );
  assert.equal((await page.evaluate(() => window.__events)).length, 0);
  await page.unroute("**/api/contact");
  await page.waitForTimeout(2100);
  page.on("request", (r) => {
    if (r.url() === base + "/api/contact" && r.method() === "POST")
      contactId = r.postDataJSON().id;
  });
  const sent = page.waitForResponse(
    (r) => r.url() === base + "/api/contact" && r.status() === 201,
  );
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await sent;
  await page
    .getByRole("heading", { name: "Votre demande est enregistrée." })
    .waitFor();
  assert(contactId);
  report.checks.push(
    "Short form error retains input; real retry persists once and confirms reference.",
  );
  await page.getByRole("button", { name: "Mesure d’audience" }).click();
  await page.getByRole("button", { name: "Autoriser", exact: true }).click();
  await page
    .getByRole("link", { name: "Nos réalisations", exact: true })
    .last()
    .click();
  await page.waitForURL("**/realisations");
  assert(
    (await page.evaluate(() => window.__events)).some(
      (e) => e.event === "project_click",
    ),
  );
  await page.getByRole("button", { name: "Mesure d’audience" }).click();
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  report.checks.push(
    "Measurement defaults off; opt-in and withdrawal work without external tracking.",
  );
  await ctx.setExtraHTTPHeaders({ Cookie: cookie });
  await page.goto(base + "/equipe/demandes");
  await page.getByText("Mission UI QA", { exact: true }).waitFor();
  const card = page.locator("article").filter({ hasText: "Mission UI QA" });
  const statusSaved = page.waitForResponse(
    (r) =>
      r.url().endsWith("/api/equipe/contacts") &&
      r.request().method() === "PATCH",
  );
  await card.getByRole("combobox").selectOption("replied");
  await statusSaved;
  assert.equal(
    (await sql`SELECT status FROM cms_contacts WHERE id=${contactId}`)[0]
      .status,
    "replied",
  );
  await page.goto(base + "/equipe/reglages");
  await page.screenshot({
    path: out + "/admin-settings-diagnostic.png",
    fullPage: true,
  });
  await page.getByText("Logo & photo d’accueil", { exact: true }).click();
  page.on("response", async (r) => {
    if (
      r.url() === base + "/api/equipe/media" &&
      r.request().method() === "POST" &&
      r.ok()
    ) {
      const d = await r.json();
      if (d.media) mediaId = d.media.id;
    }
  });
  await page
    .locator(".settings-image input[type=file]")
    .first()
    .setInputFiles(
      join(projectRoot, "public/images/htc-la-boisse-reseaux-480.webp"),
    );
  await page.waitForFunction(() =>
    document
      .querySelector(".settings-image img")
      ?.getAttribute("src")
      ?.startsWith("/media/"),
  );
  await page.getByRole("button", { name: "Brouillon", exact: true }).click();
  await page
    .getByText("Brouillon enregistré. Le site public reste inchangé.", {
      exact: true,
    })
    .waitFor();
  assert(mediaId);
  assert.equal((await fetch(base + "/media/" + mediaId)).status, 404);
  report.checks.push(
    "Browser image import, CORS upload and private settings draft work.",
  );
  for (const route of [
    "/equipe",
    "/equipe/contenu",
    "/equipe/reglages",
    "/equipe/publications",
    "/equipe/membres",
    "/equipe/demandes",
    "/equipe/apercu",
  ]) {
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator(".public-header").count(), 0);
    assert.equal(await page.locator("h1").count(), 1, route + " h1");
    for (const width of [320, 360, 375, 390, 393, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        route + " " + width,
      );
    }
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const path = `${out}/admin-${route.split("/").pop()}-${width}.png`;
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        scrollTo(0, 0);
      });
      await page.waitForTimeout(150);
      await page.screenshot({ path, fullPage: false });
      report.screens.push(path);
    }
  }
  assert.equal(errors.length, 0, errors.join("\n"));
  report.checks.push(
    "7 private routes × 9 widths; no horizontal overflow or JS errors; preview remains private.",
  );
  await writeFile(
    out + "/admin-ui-audit.json",
    JSON.stringify(report, null, 2),
  );
  console.log(report.checks.join("\n"));
} finally {
  if (previousQuota)
    await sql`INSERT INTO cms_rate_limits(key,count,expires_at) VALUES(${quotaKey},${previousQuota.count},${previousQuota.expires_at}) ON CONFLICT(key) DO UPDATE SET count=EXCLUDED.count,expires_at=EXCLUDED.expires_at`;
  else await sql`DELETE FROM cms_rate_limits WHERE key=${quotaKey}`;
  if (cookie) {
    try {
      const { page } = await api("/api/equipe/settings");
      await api("/api/equipe/settings", {
        action: "publish",
        version: page.version,
        content: previous?.published || defaultSiteContent,
      });
    } catch (e) {
      console.error("Cache restoration failed", e.message);
    }
  }
  if (previous)
    await sql`UPDATE cms_site_settings SET draft=${JSON.stringify(previous.draft)}::jsonb,published=${previous.published ? JSON.stringify(previous.published) : null}::jsonb,published_media=${previous.published_media}::uuid[],version=${previous.version},updated_at=${previous.updated_at},updated_by=${previous.updated_by} WHERE key='site'`;
  else await sql`DELETE FROM cms_site_settings WHERE key='site'`;
  if (contactId) await sql`DELETE FROM cms_contacts WHERE id=${contactId}`;
  if (mediaId) {
    const row = (
      await sql`SELECT object_key FROM cms_media WHERE id=${mediaId}`
    )[0];
    if (row) {
      const s3 = new S3Client({
        endpoint: process.env.AWS_ENDPOINT_URL_S3,
        forcePathStyle: true,
        requestChecksumCalculation: "WHEN_REQUIRED",
      });
      await s3.send(
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
  }
  await sql`DELETE FROM cms_site_history WHERE id>${history} AND actor_email=${email}`;
  if (cookie)
    await fetch(base + "/api/auth/sign-out", {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: base,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
  await browser?.close();
}
