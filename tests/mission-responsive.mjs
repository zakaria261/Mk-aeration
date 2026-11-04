// Local browser QA; install Playwright separately or pass PLAYWRIGHT_MODULE_PATH.
import { fileURLToPath } from "node:url";
import { join } from "node:path";
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright"
);

import { writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const out = join(projectRoot, "outputs/mission-2026-11-04");
await mkdir(out, { recursive: true });
const b = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const sitemap = await (await fetch("http://127.0.0.1:3032/sitemap.xml")).text();
const urls = [
  ...new Set(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .concat([
        "/mentions-legales",
        "/confidentialite",
        "/hors-ligne",
        "/page-inexistante",
      ]),
  ),
];
const widths = [320, 360, 375, 390, 393, 430, 768, 1024, 1440];
const checks = [],
  failures = [];
for (let i = 0; i < urls.length; i++) {
  const url = urls[i],
    page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const r = await page.goto("http://127.0.0.1:3032" + url, {
    waitUntil: "load",
  });
  await page.evaluate(() => document.fonts.ready);
  if (r.status() !== (url === "/page-inexistante" ? 404 : 200))
    failures.push({ url, status: r.status() });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(40);
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: document.querySelectorAll("h1").length,
    }));
    checks.push({ url, width, ...state });
    if (state.overflow || state.h1 !== 1)
      failures.push({ url, width, ...state });
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      for (let y = 0; y < document.body.scrollHeight; y += 650) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
      await Promise.all(
        [...document.images].map((im) => im.decode().catch(() => {})),
      );
      scrollTo(0, 0);
    });
    await page.waitForTimeout(150);
    await page.screenshot({
      path: `${out}/${url === "/" ? "accueil" : url.slice(1).replaceAll("/", "-")}-${width}.png`,
      fullPage: true,
    });
  }
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs.filter((im) => !im.naturalWidth).map((im) => im.src),
    );
  if (broken.length) failures.push({ url, broken });
  if (errors.length) failures.push({ url, errors });
  console.log(`${i + 1}/${urls.length} ${url}: checked`);
  await page.close();
}
await writeFile(
  out + "/responsive-audit.json",
  JSON.stringify({ widths, routes: urls, checks, failures }, null, 2),
);
await b.close();
assert.equal(failures.length, 0, JSON.stringify(failures, null, 2));
console.log(
  `${checks.length} route/viewport checks; no overflow, missing images or JS errors.`,
);
