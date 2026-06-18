/**
 * Re-crops lesson cards 1–7 from full composite assets (illustration only).
 * Usage: node scripts/recrop-misc-cards-1-7.mjs
 */
import { readFileSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";
import {
  cropIllustrationFromFile,
  bufferToDataUrl,
} from "./lib/illustration-crop.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));
const ASSETS =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";
const SEED_DIR = join(root, "scripts", "seed-data", "misc-words-part-1");

/** Card position → full composite in assets (text on PNG defines the word). */
/** Text on PNG defines the word — image number ≠ lesson card index. */
const CARDS = [
  { pos: 1, word: "adventure", id: 265, imageKey: "images_1", imageUuid: "99da1127" },
  { pos: 2, word: "abhorrent", id: 266, imageKey: "images_6", imageUuid: "039a3d36" },
  { pos: 3, word: "precise", id: 267, imageKey: "images_7", imageUuid: "2c4a2a0f" },
  { pos: 4, word: "observer", id: 268, imageKey: "images_10", imageUuid: "387acb8a" },
  { pos: 5, word: "reasoning", id: 269, imageKey: "images_9", imageUuid: "b16bd6ed" },
  { pos: 6, word: "predominate", id: 270, imageKey: "images_5", imageUuid: "0aeef0b5" },
  { pos: 7, word: "balanced", id: 271, imageKey: "images_8", imageUuid: "0e4b52b1" },
];

const SEED_FILES = {
  adventure: "adventure.png",
  abhorrent: "abhorrent.png",
  precise: "precise.png",
  observer: "observer.png",
  reasoning: "reasoning.png",
  predominate: "predominate.png",
  balanced: "balanced.png",
};

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}

function findAsset(imageKey, uuidPrefix) {
  const name = readdirSync(ASSETS).find(
    (f) => f.includes(imageKey) && f.includes(uuidPrefix) && f.endsWith(".png"),
  );
  return name ? join(ASSETS, name) : null;
}

loadEnvFile(join(root, ".env"));
const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));

for (const card of CARDS) {
  const assetPath = findAsset(card.imageKey, card.imageUuid);
  if (!assetPath) {
    console.log(`  SKIP card ${card.pos} ${card.word}: asset not found`);
    continue;
  }

  const buf = await cropIllustrationFromFile(assetPath);
  const m = await sharp(buf).metadata();
  const seedName = SEED_FILES[card.word];
  if (seedName) writeFileSync(join(SEED_DIR, seedName), buf);

  await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [
    bufferToDataUrl(buf),
    card.id,
  ]);
  console.log(`  card ${card.pos} ${card.word}: ${m.width}x${m.height} ← ${card.imageKey}`);
}

await client.close();
console.log("\nDone. Hard-refresh (Ctrl+Shift+R).");
