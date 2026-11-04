import { readFile, readdir } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL_UNPOOLED)
  throw new Error("DATABASE_URL_UNPOOLED is required");
const sql = neon(process.env.DATABASE_URL_UNPOOLED);
const directory = new URL("../db/cms/", import.meta.url);
for (const filename of (await readdir(directory)).filter((name) => /^\d+_.+\.sql$/.test(name)).sort()) {
  const text = await readFile(new URL(filename, directory), "utf8");
  await sql.transaction(text.split(";").map((statement) => statement.trim()).filter(Boolean).map((statement) => sql.query(statement)));
  console.log(`${filename}: applied.`);
}
