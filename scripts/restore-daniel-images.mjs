/**
 * Restores Daniel lesson images from assets/daniel_<word>.png files.
 * Usage: node scripts/restore-daniel-images.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";
const CREAM = { r: 252, g: 245, b: 230, alpha: 1 };
const TARGET_SIZE = 800;

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

function fileNameToWord(baseName) {
  // daniel_drive_away -> drive away
  return baseName.replace(/^daniel_/, "").replace(/_/g, " ");
}

async function makeSquare(srcPath) {
  const img = sharp(srcPath);
  const meta = await img.metadata();
  const size = Math.max(meta.width, meta.height);
  const scale = TARGET_SIZE / size;
  const newW = Math.round(meta.width * scale);
  const newH = Math.round(meta.height * scale);
  const left = Math.floor((TARGET_SIZE - newW) / 2);
  const top = Math.floor((TARGET_SIZE - newH) / 2);
  const resized = await img.resize({ width: newW, height: newH, fit: "contain" }).png().toBuffer();
  return sharp({
    create: { width: TARGET_SIZE, height: TARGET_SIZE, channels: 4, background: CREAM },
  })
    .composite([{ input: resized, left, top }])
    .png({ quality: 90 })
    .toBuffer();
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const lessonRes = await client.query(
  `SELECT id FROM lessons WHERE title = $1 LIMIT 1`,
  ["Daniel - The Movie"],
);
if (lessonRes.rows.length === 0) {
  console.error('Lesson "Daniel - The Movie" not found. Run: node scripts/seed-daniel-lesson.mjs');
  process.exit(1);
}
const lessonId = lessonRes.rows[0].id;

const files = readdirSync(ASSETS_DIR).filter((f) => /^daniel_.+\.png$/i.test(f));
let updated = 0;
let notFound = 0;

for (const file of files.sort()) {
  const word = fileNameToWord(file.replace(/\.png$/i, ""));
  const srcPath = join(ASSETS_DIR, file);
  const buf = await makeSquare(srcPath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const res = await client.query(
    `UPDATE words SET image_url = $1
     WHERE lesson_id = $3 AND LOWER(TRIM(word)) = LOWER(TRIM($2))
     RETURNING id, word`,
    [dataUrl, word, lessonId],
  );
  if (res.rows.length === 0) {
    console.log(`  NOT FOUND: "${word}" (${file})`);
    notFound++;
  } else {
    console.log(`  OK: "${res.rows[0].word}" (id=${res.rows[0].id})`);
    updated++;
  }
}

const stats = await client.query(
  `SELECT COUNT(*)::int AS total,
          SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END)::int AS with_image
   FROM words WHERE lesson_id = $1`,
  [lessonId],
);
console.log(`\nDone. Applied ${updated} images, ${notFound} files unmatched.`);
console.log("Daniel lesson:", stats.rows[0]);
await client.close();
