/** Delete corrupted word rows and re-insert with fresh images. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";
import { assetPath, makeSquare, LESSON_TITLE } from "./lib/grade4-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertGrade123WriteAllowed } from "./lib/protect-grade123.mjs";

const repairs = [
  { id: 2330, word: "wheelbarrow" },
  { id: 2393, word: "sovereignty" },
  { id: 2499, word: "transistor" },
];

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvFile(join(rootDir, ".env"));
assertServerNotRunning();
assertGrade123WriteAllowed("repair-grade4-redo-3");

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lessonRes = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [
  LESSON_TITLE,
]);
const lessonId = lessonRes.rows[0].id;

for (const { id, word } of repairs) {
  const card = GRADE4_CARDS.find((c) => c.word.toLowerCase() === word.toLowerCase());
  if (!card) {
    console.error(`Seed card not found: ${word}`);
    process.exit(1);
  }
  const src = assetPath(word);
  const buf = await makeSquare(src);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

  console.log(`Renaming corrupted id=${id} "${word}"...`);
  await client.query(`UPDATE words SET word = $1 WHERE id = $2`, [`__broken__${id}__${word}`, id]);

  const ins = await client.query(
    `INSERT INTO words (lesson_id, word, translation, image_url, example, example_translation, difficulty, part_of_speech, is_favorite)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false)
     RETURNING id, word`,
    [
      lessonId,
      card.word,
      card.translation,
      dataUrl,
      card.example,
      card.exampleTranslation,
      card.difficulty,
      card.partOfSpeech,
    ],
  );
  console.log(`Inserted fresh id=${ins.rows[0].id} "${ins.rows[0].word}" (replaced corrupt ${id})`);
}

await client.close();
console.log("Done.");
