/**
 * Clear stored images for specific Daniel word row ids (DB + optional asset PNGs).
 * Usage: node scripts/clear-daniel-word-images.mjs
 */
import { existsSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CLEAR_IMAGE_IDS } from "./daniel-redo-ids.mjs";
import { openFlashcardsClient } from "./lib/load-redo-entries.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS_DIR =
  process.env.DANIEL_ASSETS_DIR ||
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

function assetFile(word) {
  return join(ASSETS_DIR, `daniel_${word.replace(/\s+/g, "_")}.png`);
}

process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();

const client = await openFlashcardsClient();
const placeholders = CLEAR_IMAGE_IDS.map((_, i) => `$${i + 1}`).join(", ");
const found = await client.query(
  `SELECT id, word FROM words WHERE id IN (${placeholders}) ORDER BY id`,
  CLEAR_IMAGE_IDS,
);
const missing = CLEAR_IMAGE_IDS.filter((id) => !found.rows.some((r) => r.id === id));
if (missing.length) console.warn(`[clear] IDs not in DB: ${missing.join(", ")}`);

const cleared = await client.query(
  `UPDATE words SET image_url = NULL
   WHERE id IN (${placeholders})
   RETURNING id, word`,
  CLEAR_IMAGE_IDS,
);

let assetsRemoved = 0;
for (const { word } of cleared.rows) {
  const path = assetFile(word);
  if (existsSync(path)) {
    unlinkSync(path);
    assetsRemoved++;
  }
}

await client.close();

console.log(`Cleared ${cleared.rows.length} image(s) in DB. Removed ${assetsRemoved} asset file(s).`);
for (const r of cleared.rows) console.log(`  id=${r.id} "${r.word}"`);
