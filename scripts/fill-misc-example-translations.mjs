/**
 * Pre-fill Arabic example translations for "Miscellaneous Words" so cards flip instantly.
 * Uses the running API when available; otherwise opens PGlite directly.
 *
 * Usage:
 *   node scripts/fill-misc-example-translations.mjs
 *   node scripts/fill-misc-example-translations.mjs --api-only
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning, flashcardsDataDir } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const LESSON_TITLE = "Miscellaneous Words";
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiOnly = process.argv.includes("--api-only");

function loadEnv() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

function batchTranslationMap() {
  const scriptsDir = join(rootDir, "scripts");
  const files = readdirSync(scriptsDir).filter(
    (f) => (f.startsWith("add-misc-words-") || f === "add-misc-part1-missing.mjs") && f.endsWith(".mjs"),
  );
  const map = new Map();
  for (const file of files) {
    const src = readFileSync(join(scriptsDir, file), "utf8");
    const re = /word:\s*["']([^"']+)["'][\s\S]*?exampleTranslation:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(src))) {
      map.set(m[1].trim().toLowerCase(), m[2]);
    }
  }
  return map;
}

async function translateWithMyMemory(englishText) {
  const text = englishText.trim();
  if (!text) return "";
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", "en|ar");
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`MyMemory failed (${res.status})`);
  const json = await res.json();
  const translated = json.responseData?.translatedText?.trim() ?? "";
  if (!translated) throw new Error("MyMemory returned empty text");
  if (translated.toUpperCase().includes("MYMEMORY WARNING")) {
    throw new Error("MyMemory busy — retry later");
  }
  return translated;
}

async function fillViaApi(port) {
  const base = `http://127.0.0.1:${port}`;
  const lessonRes = await fetch(`${base}/api/lessons`, { signal: AbortSignal.timeout(15_000) });
  if (!lessonRes.ok) throw new Error(`API not reachable on port ${port}`);
  const lessons = await lessonRes.json();
  const lesson = lessons.find((l) => l.title === LESSON_TITLE);
  if (!lesson) throw new Error(`Lesson "${LESSON_TITLE}" not found`);

  const detailRes = await fetch(`${base}/api/lessons/${lesson.id}`, {
    signal: AbortSignal.timeout(120_000),
  });
  const detail = await detailRes.json();
  const missing = detail.words.filter(
    (w) => w.example?.trim() && !w.exampleTranslation?.trim(),
  );
  console.log(`[api] Missing example translations: ${missing.length}`);

  let ok = 0;
  let fail = 0;
  for (const w of missing) {
    try {
      const res = await fetch(`${base}/api/words/${w.id}/translate-example`, {
        method: "POST",
        signal: AbortSignal.timeout(45_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.exampleTranslation?.trim()) throw new Error("empty translation");
      ok++;
      console.log(`  ✓ ${w.word}`);
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      fail++;
      console.warn(`  ✗ ${w.word}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`[api] Done: ${ok} filled, ${fail} failed.`);
  return fail === 0;
}

async function fillViaDb() {
  const require = createRequire(join(rootDir, "lib/db/package.json"));
  const { PGlite } = require("@electric-sql/pglite");
  const client = new PGlite(flashcardsDataDir());
  const batchMap = batchTranslationMap();

  const lesson = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
    LESSON_TITLE,
  ]);
  const lessonId = lesson.rows[0]?.id;
  if (!lessonId) throw new Error(`Lesson "${LESSON_TITLE}" not found`);

  const missing = await client.query(
    `SELECT id, word, example FROM words
     WHERE lesson_id = $1 AND example IS NOT NULL AND TRIM(example) != ''
       AND (example_translation IS NULL OR TRIM(example_translation) = '')
     ORDER BY id`,
    [lessonId],
  );
  console.log(`[db] Missing example translations: ${missing.rows.length}`);

  let ok = 0;
  let fail = 0;
  for (const row of missing.rows) {
    const key = row.word.trim().toLowerCase();
    let ar = batchMap.get(key) ?? null;
    if (!ar) {
      try {
        ar = await translateWithMyMemory(row.example);
        await new Promise((r) => setTimeout(r, 800));
      } catch (err) {
        fail++;
        console.warn(`  ✗ ${row.word}: ${err instanceof Error ? err.message : err}`);
        continue;
      }
    }
    await client.query(`UPDATE words SET example_translation = $1 WHERE id = $2`, [ar, row.id]);
    ok++;
    console.log(`  ✓ ${row.word}`);
  }
  await client.close();
  console.log(`[db] Done: ${ok} filled, ${fail} failed.`);
  return fail === 0;
}

loadEnv();
assertGrade123WriteAllowed("fill-misc-example-translations");
const port = process.env.PORT || "3000";

try {
  const ok = await fillViaApi(port);
  process.exit(ok ? 0 : 1);
} catch (err) {
  if (apiOnly) {
    console.error(`[api] ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
  console.log(`[api] ${err instanceof Error ? err.message : err} — trying direct DB...`);
}

assertServerNotRunning();
const ok = await fillViaDb();
process.exit(ok ? 0 : 1);
