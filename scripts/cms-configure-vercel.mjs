import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

// Run after `vercel login` and `vercel link`, with the production env loaded.
// Reuse the authenticated CLI session. No secret is placed in arguments or logs.
if (process.env.NEON_BRANCH !== "main")
  throw new Error(
    "Load the main branch environment before configuring production.",
  );
const link = JSON.parse(
  await readFile(new URL("../.vercel/project.json", import.meta.url), "utf8"),
);
if (link.projectName !== "mk-aeration")
  throw new Error("The linked Vercel project must be mk-aeration.");
const keys = [
  "DATABASE_URL",
  "NEON_AUTH_BASE_URL",
  "NEON_AUTH_COOKIE_SECRET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_ENDPOINT_URL_S3",
  "AWS_REGION",
];
for (const key of keys)
  if (!process.env[key]) throw new Error(`${key} is missing.`);
const configDirectory = process.platform === "darwin"
  ? path.join(homedir(), "Library", "Application Support", "com.vercel.cli")
  : path.join(process.env.XDG_DATA_HOME || path.join(homedir(), ".local", "share"), "com.vercel.cli");
const { token } = JSON.parse(await readFile(path.join(configDirectory, "auth.json"), "utf8"));
if (!token) throw new Error("Run vercel login first.");
for (const key of keys) {
  const url = new URL(`https://api.vercel.com/v10/projects/${link.projectId}/env`);
  url.searchParams.set("upsert", "true"); url.searchParams.set("teamId", link.orgId);
  const response = await fetch(url, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ key, value: process.env[key], type: "sensitive", target: ["production"] }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Vercel rejected ${key} (HTTP ${response.status}).`);
  console.log(`${key}: configured in production.`);
}
