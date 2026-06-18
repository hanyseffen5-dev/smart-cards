/**
 * Fixes image→word mapping for batch 8 & 9 by reading actual text on each PNG
 * (filename images_NN does not match the word printed on the card).
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cropIllustrationFromFile, bufferToDataUrl } from "./lib/illustration-crop.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

/** word in DB → asset file suffix (images_XX-uuid) */
const CORRECT_MAPPING = [
  { word: "matter", imageKey: "images_88", imageUuid: "ca71d32a" },
  { word: "fairly", imageKey: "images_89", imageUuid: "24583634" },
  { word: "system", imageKey: "images_90", imageUuid: "25b87ba0" },
  { word: "imprisonment", imageKey: "images_91", imageUuid: "6053383f" },
  { word: "in order to", imageKey: "images_92", imageUuid: "ddd6571c" },
  { word: "get rid of", imageKey: "images_93", imageUuid: "7df50e8e" },
  { word: "disagreeable", imageKey: "images_94", imageUuid: "7dee175c" },
  { word: "persistence", imageKey: "images_95", imageUuid: "f4ded851" },
  { word: "persevering", imageKey: "images_96", imageUuid: "a49154c2" },
  { word: "blockade", imageKey: "images_98", imageUuid: "17f022ba" },
  { word: "seaman", imageKey: "images_97", imageUuid: "8b3f1ef8" },
  { word: "otherwise", imageKey: "images_100", imageUuid: "a8acc2ed" },
  { word: "argument", imageKey: "images_99", imageUuid: "706b2120" },
];

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

function findAssetFile(imageKey, uuid) {
  const files = readdirSync(ASSETS_DIR);
  const match = files.find(
    (f) => f.includes(imageKey) && f.includes(uuid) && f.endsWith(".png"),
  );
  return match ? join(ASSETS_DIR, match) : null;
}

loadEnvFile(join(rootDir, ".env"));
const dir = join(rootDir, ".data", "flashcards");
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(dir);

let fixed = 0;
for (const entry of CORRECT_MAPPING) {
  const result = await client.query(
    `SELECT id FROM words WHERE LOWER(TRIM(word)) = LOWER(TRIM($1)) LIMIT 1`,
    [entry.word],
  );
  if (result.rows.length === 0) {
    console.log(`  NOT FOUND: "${entry.word}"`);
    continue;
  }
  const wordId = result.rows[0].id;
  const filePath = findAssetFile(entry.imageKey, entry.imageUuid);
  if (!filePath) {
    console.error(`  ERROR: missing ${entry.imageKey} (${entry.imageUuid})`);
    continue;
  }
  const buf = await cropIllustrationFromFile(filePath);
  const imageUrl = bufferToDataUrl(buf);
  await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [imageUrl, wordId]);
  console.log(`  FIXED: "${entry.word}" (id=${wordId}) ← ${entry.imageKey}-${entry.imageUuid.slice(0, 8)}`);
  fixed++;
}

await client.close();
console.log(`\nDone. Fixed ${fixed} words. Hard-refresh (Ctrl+Shift+R).`);
