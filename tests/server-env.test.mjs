import test from "node:test";
import assert from "node:assert/strict";
import { getServerEnv, getClientIp } from "../lib/server-env.ts";

const configured = {
  CLOUDFLARE_ACCOUNT_ID: "test-account",
  CLOUDFLARE_D1_DATABASE_ID: "test-database",
  CLOUDFLARE_D1_API_TOKEN: "test-token",
};

test("Vercel rate limiting uses its trusted forwarded address", () => {
  const request = new Request("https://example.invalid", {
    headers: {
      "x-forwarded-for": "192.0.2.1",
      "cf-connecting-ip": "198.51.100.1",
    },
  });
  assert.equal(getClientIp(request, { VERCEL: "1" }), "192.0.2.1");
  assert.equal(getClientIp(request, {}), "local");
});

test("missing Node database configuration leaves the quote service unavailable", () => {
  assert.equal(getServerEnv({}).DB, undefined);
  assert.equal(
    getServerEnv({ ...configured, CLOUDFLARE_D1_API_TOKEN: "" }).DB,
    undefined,
  );
});

test("Node storage sends bound parameters without interpolating SQL", async (t) => {
  let sent;
  t.mock.method(globalThis, "fetch", async (url, init) => {
    sent = { url, init };
    return Response.json({
      success: true,
      result: [{ success: true, results: [{ reference: "MK-TEST" }] }],
    });
  });
  const value = "someone's@example.invalid";
  const reference = await getServerEnv(configured)
    .DB.prepare("SELECT reference FROM quote_requests WHERE email = ?")
    .bind(value)
    .first();
  assert.deepEqual(reference, { reference: "MK-TEST" });
  assert.equal(
    sent.url,
    "https://api.cloudflare.com/client/v4/accounts/test-account/d1/database/test-database/query",
  );
  assert.deepEqual(JSON.parse(sent.init.body), {
    sql: "SELECT reference FROM quote_requests WHERE email = ?",
    params: [value],
  });
  assert.equal(sent.init.headers.Authorization, "Bearer test-token");
  assert.equal(sent.init.cache, "no-store");
});

test("an empty query result is not treated as an existing quote", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true, result: [{ success: true, results: [] }] }),
  );
  assert.equal(
    await getServerEnv(configured)
      .DB.prepare("SELECT reference FROM quote_requests WHERE id = ?")
      .bind("missing")
      .first(),
    null,
  );
});

test("storage failures cannot return a successful quote result", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: false }, { status: 403 }),
  );
  await assert.rejects(
    getServerEnv(configured)
      .DB.prepare("INSERT INTO quote_requests (id) VALUES (?)")
      .bind("test")
      .run(),
    /D1 database request failed/,
  );
});

test("a query-level failure is rejected even with an HTTP success status", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true, result: [{ success: false }] }),
  );
  await assert.rejects(
    getServerEnv(configured).DB.prepare("SELECT 1").first(),
    /D1 database query failed/,
  );
});
