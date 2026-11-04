import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright"
);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://127.0.0.1:3032/");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
  assert.equal(
    await page.locator(".mobile-contact").getAttribute("aria-hidden"),
    "true",
  );
  await page
    .locator(".lp-flagship")
    .evaluate((e) => scrollTo(0, e.getBoundingClientRect().top + scrollY));
  await page.waitForFunction(
    () =>
      document.querySelector(".mobile-contact")?.getAttribute("aria-hidden") ===
      "false",
  );
  assert.equal(
    await page.locator(".mobile-contact-quote").getAttribute("href"),
    "/devis",
  );
  assert.match(
    await page.locator(".mobile-contact-call").getAttribute("href"),
    /^tel:/,
  );
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page.locator(".public-menu.is-open").waitFor();
  assert.equal(await page.locator(".mobile-contact").isVisible(), false);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Ouvrir le menu" }).waitFor();
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.getAttribute("aria-label"),
    ),
    "Ouvrir le menu",
  );
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page
    .locator("#public-menu")
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await page.waitForURL("**/contact");
  assert.equal(await page.locator(".mobile-contact").count(), 0);
  await page.getByRole("textbox", { name: "Votre nom", exact: true }).focus();
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.getAttribute("autocomplete"),
    ),
    "name",
  );
  await page.goto("http://127.0.0.1:3032/");
  await page.locator(".quick-contact").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      document.querySelector(".mobile-contact")?.getAttribute("aria-hidden") ===
      "true",
  );
  await page.getByRole("textbox", { name: "Votre nom", exact: true }).focus();
  assert.equal(
    await page.locator(".mobile-contact").getAttribute("aria-hidden"),
    "true",
  );
  console.log(
    "Mobile navigation passed: visible contact actions, menu hiding, Escape focus return, contact route, form focus and hidden actions near form.",
  );
} finally {
  await browser.close();
}
