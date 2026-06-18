/**
 * Save a read-only manifest of the six frozen curriculum lessons.
 * Usage: node scripts/snapshot-curriculum-lessons.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  CURRICULUM_LESSON_TITLES,
  CURRICULUM_LESSON_EXPECTED_COUNTS,
} from "./lib/protect-grade123.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

const lessons = [];
for (const title of CURRICULUM_LESSON_TITLES) {
  const lessonRes = await client.query(
    `SELECT id, title, word_count FROM lessons WHERE title = $1 LIMIT 1`,
    [title],
  );
  const lesson = lessonRes.rows[0];
  if (!lesson) {
    lessons.push({ title, missing: true, expectedWordCount: CURRICULUM_LESSON_EXPECTED_COUNTS[title] });
    continue;
  }
  const stats = await client.query(
    `SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '')::int AS with_image,
      MIN(id) AS min_word_id,
      MAX(id) AS max_word_id
     FROM words WHERE lesson_id = $1`,
    [lesson.id],
  );
  const s = stats.rows[0];
  lessons.push({
    title,
    lessonId: lesson.id,
    wordCount: lesson.word_count,
    expectedWordCount: CURRICULUM_LESSON_EXPECTED_COUNTS[title],
    actualWords: s.total,
    wordsWithImage: s.with_image,
    minWordId: s.min_word_id,
    maxWordId: s.max_word_id,
  });
}

await client.close();

const outDir = join(rootDir, ".data");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "curriculum-snapshot.json");
const payload = {
  savedAt: new Date().toISOString(),
  lessons,
};
writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
console.log(`[snapshot] Saved: ${outPath}`);
for (const l of lessons) {
  if (l.missing) {
    console.log(`  MISSING: ${l.title}`);
  } else {
    console.log(
      `  ${l.title}: id=${l.lessonId} words=${l.actualWords}/${l.expectedWordCount} images=${l.wordsWithImage}`,
    );
  }
}
