import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { REDO_IDS } from "../daniel-redo-ids.mjs";
import { REDO_PROMPTS } from "../daniel-redo-prompts.mjs";
import { sceneForCard } from "../daniel-redo-scene.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

export async function openFlashcardsClient() {
  const { PGlite } = require("@electric-sql/pglite");
  return new PGlite(join(rootDir, ".data", "flashcards"));
}

/** @returns {Promise<Array<{ id: number, word: string, example: string, scene: string }>>} */
export async function loadRedoEntries(client) {
  const placeholders = REDO_IDS.map((_, i) => `$${i + 1}`).join(", ");
  const res = await client.query(
    `SELECT id, word, example FROM words WHERE id IN (${placeholders}) ORDER BY id`,
    REDO_IDS,
  );
  if (res.rows.length !== REDO_IDS.length) {
    const found = new Set(res.rows.map((r) => r.id));
    const missing = REDO_IDS.filter((id) => !found.has(id));
    console.warn(`[redo] Missing word ids in DB: ${missing.join(", ")}`);
  }
  return res.rows.map((row) => ({
    id: row.id,
    word: row.word,
    example: row.example || "",
    scene: sceneForCard(row.word, row.example, REDO_PROMPTS[row.word]),
  }));
}
