import assert from "node:assert/strict";
import { test } from "node:test";
import {
  defaultHomeContent,
  homeContentSchema,
  readHomeContent,
} from "../lib/home-content.ts";

test("home content accepts the defaults and normalizes edited text", () => {
  assert(homeContentSchema.safeParse(defaultHomeContent).success);
  assert.equal(
    homeContentSchema.parse({
      ...defaultHomeContent,
      heroTitle: "  Un titre de chantier  ",
    }).heroTitle,
    "Un titre de chantier",
  );
});
test("home content rejects unexpected fields, missing copy and foreign image URLs", () => {
  assert(
    !homeContentSchema.safeParse({ ...defaultHomeContent, role: "admin" })
      .success,
  );
  assert(
    !homeContentSchema.safeParse({ ...defaultHomeContent, heroTitle: "" })
      .success,
  );
  assert(
    !homeContentSchema.safeParse({
      ...defaultHomeContent,
      heroImage: "https://example.com/photo.webp",
    }).success,
  );
  assert(
    !homeContentSchema.safeParse({
      ...defaultHomeContent,
      heroDescription: "x".repeat(361),
    }).success,
  );
});
test("invalid stored home content falls back to a complete usable page", () => {
  assert.deepEqual(readHomeContent({}), defaultHomeContent);
  assert.deepEqual(readHomeContent(null), defaultHomeContent);
});
test("existing published defaults adopt the new hero while preserving custom copy", () => {
  const legacy = {
    ...defaultHomeContent,
    heroTitle: "Ventilation &",
    heroAccent: "réseaux aérauliques.",
    heroImage: "/images/annecy-panorama.webp",
  };
  const migrated = readHomeContent(legacy);
  assert.equal(migrated.heroImage, "/images/mk-aeration-hero-landscape.webp");
  assert.equal(migrated.heroTitle, defaultHomeContent.heroTitle);
  const custom = {
    ...defaultHomeContent,
    heroTitle: "Votre installation de ventilation",
    heroImage: "/images/htc-la-boisse-reseaux.webp",
    benefitsIntro:
      "Un texte personnalisé et conservé pour la présentation de notre entreprise.",
  };
  assert.deepEqual(readHomeContent(custom), custom);
});
