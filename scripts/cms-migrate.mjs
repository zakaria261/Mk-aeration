import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL_UNPOOLED)
  throw new Error("DATABASE_URL_UNPOOLED is required");
const sql = neon(process.env.DATABASE_URL_UNPOOLED);
const text = await readFile(
  new URL("../db/cms/001_content.sql", import.meta.url),
  "utf8",
);
await sql.transaction(
  text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((statement) => sql.query(statement)),
);
console.log("CMS schema and administrator applied.");
