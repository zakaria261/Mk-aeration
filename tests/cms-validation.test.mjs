import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  draftSchema,
  publicationIssues,
  memberSchema,
} from "../lib/cms-validation.ts";

const blank = {
  title: "",
  summary: "",
  body: "",
  location: "",
  category: "VMC",
  sector: "",
  scope: [],
  media: [],
  coverId: "",
};
test("a draft can be saved before it is ready for publication", () => {
  assert.equal(draftSchema.safeParse(blank).success, true);
  assert.equal(publicationIssues(blank).length, 4);
});
test("publication requires a matching cover and descriptions for every photo", () => {
  const id = randomUUID();
  const ready = {
    ...blank,
    title: "Réseaux VMC",
    summary: "Rénovation des réseaux de ventilation de trois bâtiments.",
    body: "Notre équipe assure la dépose des anciens réseaux et le raccordement des nouvelles installations de ventilation.",
    coverId: id,
    media: [
      {
        id,
        alt: "Gaines circulaires sous dalle",
        caption: "",
        type: "image",
        width: 1200,
        height: 1600,
      },
    ],
  };
  assert.deepEqual(publicationIssues(ready), []);
  assert.equal(
    publicationIssues({ ...ready, coverId: randomUUID() }).length,
    1,
  );
  assert.equal(
    publicationIssues({ ...ready, media: [{ ...ready.media[0], alt: "" }] })
      .length,
    1,
  );
  assert.equal(
    publicationIssues({ ...ready, media: [ready.media[0], ready.media[0]] })
      .length,
    1,
  );
});
test("client content cannot smuggle roles, publication status or foreign URLs", () => {
  assert.equal(
    draftSchema.safeParse({ ...blank, role: "admin" }).success,
    false,
  );
  assert.equal(
    draftSchema.safeParse({ ...blank, status: "published" }).success,
    false,
  );
  assert.equal(
    draftSchema.safeParse({
      ...blank,
      media: [
        {
          id: "https://example.com/photo",
          alt: "photo",
          type: "image",
          width: 1,
          height: 1,
        },
      ],
    }).success,
    false,
  );
});
test("limits prevent oversized content and normalize member email", () => {
  assert.equal(
    draftSchema.safeParse({ ...blank, title: "x".repeat(111) }).success,
    false,
  );
  assert.equal(
    draftSchema.safeParse({ ...blank, scope: Array(13).fill("Pose") }).success,
    false,
  );
  assert.equal(draftSchema.safeParse({ ...blank, scope: [""] }).success, false);
  assert.equal(
    memberSchema.parse({
      email: " MK.AERATION@HOTMAIL.COM ",
      name: "MK",
      role: "editor",
      active: true,
    }).email,
    "mk.aeration@hotmail.com",
  );
});
