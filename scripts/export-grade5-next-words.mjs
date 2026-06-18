/**
 * Export next N grade 5 words without images (and without asset PNG) to JSON for batch image work.
 * Usage: node scripts/export-grade5-next-words.mjs 100 [.data/grade5-next-100.json]
 */
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildPrompt } from "./lib/grade5-image-style.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const LIMIT = Number(process.argv[2] || 50);
const outPath = process.argv[3] || join(root, ".data", `grade5-next-${LIMIT}.json`);

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv(join(root, ".env"));
process.env.PROJECT_ROOT ??= root;

const { ASSETS_DIR, LESSON_TITLE } = await import("./lib/grade5-image-style.mjs");

const existing = new Set(
  readdirSync(ASSETS_DIR)
    .filter((f) => /^grade5_.+\.png$/i.test(f))
    .map((f) =>
      f
        .replace(/^grade5_/i, "")
        .replace(/\.png$/i, "")
        .replace(/_/g, " ")
        .toLowerCase(),
    ),
);

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));
const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE]);
const lessonId = lesson.rows[0].id;

const res = await client.query(
  `SELECT id, word, translation, example
   FROM words
   WHERE lesson_id = $1
     AND (image_url IS NULL OR image_url = '')
     AND example IS NOT NULL AND TRIM(example) != ''
   ORDER BY id`,
  [lessonId],
);

const picks = [];
for (const row of res.rows) {
  const key = row.word.toLowerCase().trim();
  if (existing.has(key)) continue;
  picks.push({
    id: row.id,
    word: row.word,
    translation: row.translation,
    example: row.example,
    prompt: buildPrompt({ word: row.word, example: row.example }),
    assetFile: `grade5_${row.word.replace(/\s+/g, "_")}.png`,
  });
  if (picks.length >= LIMIT) break;
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ lessonId, count: picks.length, picks }, null, 2));
console.log(`Wrote ${picks.length} words → ${outPath}`);
await client.close();
