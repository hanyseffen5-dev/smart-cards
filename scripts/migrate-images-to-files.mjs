/**
 * Migrate base64 image blobs out of the database into real static PNG files.
 *
 * What it does:
 *   1. Reads every row in the `words` table whose `image_url` is a base64 data URL.
 *   2. Decodes the base64 payload and writes it as a real image file under public/images/.
 *   3. Renames each file uniquely as <word>_<id>_<timestamp>.png.
 *   4. Rewrites `image_url` to the public path (e.g. /images/apple_42_1718700000000.png).
 *
 * Why: storing base64 inside PGlite bloats the database and slows every query.
 * Serving plain files lets Express (express.static) stream them straight from disk
 * with HTTP caching.
 *
 * SAFETY:
 *   - Refuses to run while the API server is running (avoids DB corruption).
 *   - The six frozen curriculum lessons (grade 1-5 + Miscellaneous Words) are SKIPPED
 *     by default. To include them you must explicitly confirm in chat first, then set
 *     CURRICULUM_DB_WRITE_CONFIRMED=1 (or GRADE123_DB_WRITE_CONFIRMED=1).
 *   - Pass --dry-run to preview the changes without writing files or touching the DB.
 *
 * Usage:
 *   node scripts/migrate-images-to-files.mjs            # migrate non-frozen lessons
 *   node scripts/migrate-images-to-files.mjs --dry-run  # preview only, no writes
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import {
  PROTECTED_LESSON_TITLES,
  curriculumWriteBlocked,
} from "./lib/protect-grade123.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

// --- CLI flags ---------------------------------------------------------------
const DRY_RUN = process.argv.includes("--dry-run");

// --- Minimal .env loader (same convention as the other scripts) --------------
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;

// Never open the database while the API server holds it.
assertServerNotRunning();

// --- Helpers -----------------------------------------------------------------

/** Maps a data-URL mime type to a file extension. Defaults to png. */
function extensionForMime(mime) {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "png";
}

/** Turns a word into a filesystem-safe slug (letters/numbers/underscores). */
function slugify(word) {
  return (
    String(word)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "word"
  );
}

// --- Prepare output directory ------------------------------------------------
const publicImagesDir = join(rootDir, "public", "images");
if (!DRY_RUN) mkdirSync(publicImagesDir, { recursive: true });

// --- Open the database -------------------------------------------------------
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

// Identify the frozen curriculum lesson IDs so we can skip them by default.
const protectedRes = await client.query(
  `SELECT id, title FROM lessons WHERE title = ANY($1::text[])`,
  [PROTECTED_LESSON_TITLES],
);
const protectedLessonIds = new Set(protectedRes.rows.map((r) => r.id));
const includeFrozen = !curriculumWriteBlocked();

if (protectedLessonIds.size > 0 && !includeFrozen) {
  console.log(
    `[protect] Skipping ${protectedLessonIds.size} frozen curriculum lesson(s). ` +
      `Set CURRICULUM_DB_WRITE_CONFIRMED=1 to include them (after explicit approval).`,
  );
}

// Only base64 rows need migrating. Rows already pointing at /images/... or http(s) are left alone.
const wordsRes = await client.query(
  `SELECT id, lesson_id, word, image_url
   FROM words
   WHERE image_url LIKE 'data:%'
   ORDER BY id`,
);

let migrated = 0;
let skippedFrozen = 0;
let failed = 0;

for (const row of wordsRes.rows) {
  // Respect the frozen-lesson protection unless explicitly confirmed.
  if (protectedLessonIds.has(row.lesson_id) && !includeFrozen) {
    skippedFrozen++;
    continue;
  }

  // Parse the data URL: data:image/png;base64,<payload>
  const match = String(row.image_url).match(/^data:(image\/[\w+.-]+);base64,(.+)$/s);
  if (!match) {
    console.warn(`! id=${row.id} "${row.word}" — unrecognized data URL, skipped.`);
    failed++;
    continue;
  }

  const mime = match[1];
  const ext = extensionForMime(mime);
  const fileName = `${slugify(row.word)}_${row.id}_${Date.now()}.${ext}`;
  const publicPath = `/images/${fileName}`;
  const diskPath = join(publicImagesDir, fileName);

  if (DRY_RUN) {
    console.log(`(dry-run) id=${row.id} "${row.word}" -> ${publicPath}`);
    migrated++;
    continue;
  }

  // 1) Write the decoded bytes to a real file on disk.
  const buffer = Buffer.from(match[2], "base64");
  writeFileSync(diskPath, buffer);

  // 2) Point the database at the new file path instead of the base64 blob.
  await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [publicPath, row.id]);

  console.log(`✓ id=${row.id} "${row.word}" -> ${publicPath} (${buffer.length} bytes)`);
  migrated++;
}

console.log(
  `\nDone${DRY_RUN ? " (dry-run)" : ""}. ` +
    `migrated=${migrated}, skippedFrozen=${skippedFrozen}, failed=${failed}.`,
);
if (!DRY_RUN && migrated > 0) {
  console.log(`Files written to: ${publicImagesDir}`);
}

await client.close();
