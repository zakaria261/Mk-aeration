import test from "node:test";
import assert from "node:assert/strict";
import { isSameOrigin } from "../lib/request-security.ts";

test("accepts the public host even when Next.js uses an internal request URL", () => {
  assert.equal(
    isSameOrigin(
      new Request("http://localhost:3031/api/devis", {
        headers: { host: "127.0.0.1:3031", origin: "http://127.0.0.1:3031" },
      }),
    ),
    true,
  );
});
test("supports Worker requests without a separate Host header", () => {
  assert.equal(
    isSameOrigin(
      new Request("https://example.invalid/api/devis", {
        headers: { origin: "https://example.invalid" },
      }),
    ),
    true,
  );
});
test("rejects a foreign host, another port, another protocol and malformed origins", () => {
  for (const origin of [
    "https://foreign.invalid",
    "https://example.invalid:444",
    "http://example.invalid",
    "null",
    "invalid",
    "https://user@example.invalid",
  ]) {
    assert.equal(
      isSameOrigin(
        new Request("https://example.invalid/api/devis", {
          headers: { host: "example.invalid", origin },
        }),
      ),
      false,
      origin,
    );
  }
  assert.equal(
    isSameOrigin(new Request("https://example.invalid/api/devis")),
    false,
  );
});
