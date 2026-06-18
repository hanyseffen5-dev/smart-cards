import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const lessonId = Number(process.argv[2] ?? "1");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));

const url = process.env.DATABASE_URL || "embedded";
const dir =
  url.startsWith("pglite://") ? url.slice("pglite://".length) :
  url.startsWith("file:") ? url.slice("file:".length) :
  join(rootDir, ".data", "flashcards");

mkdirSync(dirname(dir), { recursive: true });

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);
const result = await client.query(
  `UPDATE words SET image_url = NULL WHERE lesson_id = $1 RETURNING id`,
  [lessonId],
);
await client.close();

console.log(`Lesson ${lessonId}: cleared ${result.rows.length} image(s) from database.`);
