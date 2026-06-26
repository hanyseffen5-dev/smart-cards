/** One-off: fix card index 511 (connect → laundromat). */
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "lib/db/package.json"));

assertServerNotRunning();
assertGrade123WriteAllowed("fix-grade5-card-511");

const word = "laundromat";
const translation = "مغسلة";
const example = "The teacher gave an example with laundromat.";
const exampleTranslation = "أعطى المعلم مثالاً بـمغسلة.";
const difficulty = "hard";
const partOfSpeech = "noun";

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(root, ".data", "flashcards"));
const lid = (await client.query(`SELECT id FROM lessons WHERE title = 'grade 5' LIMIT 1`)).rows[0].id;
const id = (await client.query(`SELECT id FROM words WHERE lesson_id = $1 ORDER BY id`, [lid])).rows[511].id;
await client.query(
  `UPDATE words SET word = $2, translation = $3, example = $4, example_translation = $5,
   difficulty = $6, part_of_speech = $7, image_url = NULL WHERE id = $1`,
  [id, word, translation, example, exampleTranslation, difficulty, partOfSpeech],
);
await client.close();
console.log("Fixed index 511: connect → laundromat");
