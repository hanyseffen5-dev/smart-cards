/**
 * Fixes incorrect image-to-word mapping for the 17 cards added to
 * "Miscellaneous Words Part 1". Re-reads the correct original image from
 * the assets folder and updates the database.
 *
 * Usage: node scripts/fix-image-mapping.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

// Correct mapping: image file number → actual word on the card
const IMAGE_TO_WORD = {
  images_11: "intrusion",
  images_12: "motive",
  images_13: "temperament",
  images_14: "distracting",
  images_15: "disturbing",
  images_16: "dubious",
  images_17: "questionable",
  images_19: "establishment",
  images_21: "loathe",
  images_22: "buried",
  images_23: "alternating",
  images_25: "faculty",
  images_26: "extraordinary",
  images_27: "clue",
  images_28: "abandon",
  images_29: "hopeless",
  images_30: "accomplish",
};

// UUID suffixes to find the correct file for each image number
const IMAGE_FILE_UUIDS = {
  images_11: "2222afcb",
  images_12: "b94cdfd3",
  images_13: "c2d7cfee",
  images_14: "092554bf",
  images_15: "c4e38d11",
  images_16: "6dc8ae62",
  images_17: "c3a3869f",
  images_19: "e84fd6a4",
  images_21: "64f6db95",
  images_22: "4e0df6a6",
  images_23: "a7e1139f",
  images_25: "63adb276",
  images_26: "6afc27fc",
  images_27: "7e4e423b",
  images_28: "65aa681f",
  images_29: "6f53a854",
  images_30: "00f86e90",
};

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

function embeddedDir(url) {
  if (url.startsWith("pglite://")) return url.slice("pglite://".length);
  if (url.startsWith("file:")) return url.slice("file:".length);
  return join(rootDir, ".data", "flashcards");
}

function findAssetFile(imageKey) {
  const uuid = IMAGE_FILE_UUIDS[imageKey];
  const files = readdirSync(ASSETS_DIR);
  const match = files.find(
    (f) => f.includes(imageKey) && f.includes(uuid) && f.endsWith(".png"),
  );
  if (!match) return null;
  return join(ASSETS_DIR, match);
}

function toDataUrl(filePath) {
  const buf = readFileSync(filePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

loadEnvFile(join(rootDir, ".env"));
const url = process.env.DATABASE_URL || "embedded";
const dir = embeddedDir(url);

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

const lesson = await client.query(
  `SELECT id FROM lessons WHERE title = 'Miscellaneous Words Part 1' LIMIT 1`,
);
if (lesson.rows.length === 0) {
  console.error("Lesson not found!");
  await client.close();
  process.exit(1);
}
const lessonId = lesson.rows[0].id;

const words = await client.query(
  `SELECT id, word FROM words WHERE lesson_id = $1 ORDER BY id`,
  [lessonId],
);

let fixed = 0;
let skipped = 0;

for (const row of words.rows) {
  const imageEntry = Object.entries(IMAGE_TO_WORD).find(
    ([, w]) => w === row.word,
  );
  if (!imageEntry) {
    console.log(`  SKIP: "${row.word}" (id=${row.id}) — no mapping`);
    skipped++;
    continue;
  }

  const [imageKey] = imageEntry;
  const filePath = findAssetFile(imageKey);
  if (!filePath) {
    console.error(`  ERROR: asset file not found for ${imageKey} → "${row.word}"`);
    skipped++;
    continue;
  }

  const dataUrl = toDataUrl(filePath);
  await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [
    dataUrl,
    row.id,
  ]);
  console.log(`  FIXED: "${row.word}" (id=${row.id}) ← ${imageKey}`);
  fixed++;
}

await client.close();
console.log(`\nDone. Fixed: ${fixed}, Skipped: ${skipped}`);
