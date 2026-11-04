import assert from "node:assert/strict";
import { test } from "node:test";
import {
  siteContentSchema,
  defaultSiteContent,
  publicationProblems,
  publicSnapshot,
  historicalEdit,
} from "../lib/site-content.ts";
import { contactSchema } from "../lib/contact-validation.ts";
test("site settings preserve verified defaults and reject unsafe media and invalid section order", () => {
  assert(siteContentSchema.safeParse(defaultSiteContent).success);
  assert(
    !siteContentSchema.safeParse({
      ...defaultSiteContent,
      logo: {
        ...defaultSiteContent.logo,
        src: "https://foreign.example/image.jpg",
      },
    }).success,
  );
  assert(
    !siteContentSchema.safeParse({
      ...defaultSiteContent,
      home: { ...defaultSiteContent.home, sections: ["services", "services"] },
    }).success,
  );
  assert(
    !siteContentSchema.safeParse({ ...defaultSiteContent, role: "admin" })
      .success,
  );
});
test("unverified claims cannot be published and private sources do not reach clients", () => {
  const site = structuredClone(defaultSiteContent);
  site.credibility[0].confirmed = false;
  assert(publicationProblems(site).length > 0);
  site.credentials = [
    {
      title: "Certification fictive",
      source: "",
      published: true,
      confirmed: false,
    },
  ];
  assert(publicationProblems(site).length > 1);
  site.testimonials = [
    {
      quote: "Exemple privé non autorisé",
      author: "Auteur privé",
      source: "preuve privée",
      authorized: false,
      published: false,
    },
  ];
  site.services[0].published = false;
  const snapshot = publicSnapshot(site);
  assert(!snapshot.services.some((s) => s.id === site.services[0].id));
  assert.equal(snapshot.testimonials.length, 0);
  assert(snapshot.credibility.every((c) => c.evidence === ""));
  assert.equal(snapshot.credentials.length, 0);
});
test("short contact requires valid contact details, consent and honeypot", () => {
  const input = {
    id: "c5a0df2a-d328-45ed-99c7-4b1196d1ce55",
    name: "Jean Dupont",
    email: "jean@example.test",
    phone: "",
    message: "Installation de ventilation dans un bâtiment collectif.",
    consent: true,
    website: "",
    startedAt: Date.now(),
  };
  assert(contactSchema.safeParse(input).success);
  assert(!contactSchema.safeParse({ ...input, consent: false }).success);
  assert(!contactSchema.safeParse({ ...input, website: "spam" }).success);
  assert(!contactSchema.safeParse({ ...input, phone: "123" }).success);
  assert(!contactSchema.safeParse({ ...input, message: "court" }).success);
});

test("historical video-only projects can be edited without a photo gallery", async () => {
  const { projects } = await import("../lib/content.ts");
  assert(
    siteContentSchema.safeParse({
      ...defaultSiteContent,
      projectEdits: projects.map(historicalEdit),
    }).success,
  );
  for (const p of projects) {
    const value = historicalEdit(p);
    assert(value.image.width > 0);
    assert(value.image.height > 0);
    assert.equal(value.slug, p.slug);
  }
});
