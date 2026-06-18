import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GRADE1_CARDS } from "../seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "../seed-data/grade2-cards.mjs";
import { GRADE3_CARDS } from "../seed-data/grade3-cards.mjs";
import { GRADE4_CARDS } from "../seed-data/grade4-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(join(root, "lib/db/package.json"));

function normWord(w) {
  return String(w ?? "").toLowerCase().trim();
}

function normExample(e) {
  return String(e ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

export async function loadCurriculumWordSets() {
  const words = new Set();
  const examples = new Set();

  function add(c) {
    words.add(normWord(c.word));
    examples.add(normExample(c.example));
  }

  for (const c of [...GRADE1_CARDS, ...GRADE2_CARDS, ...GRADE3_CARDS, ...GRADE4_CARDS]) add(c);

  const { PGlite } = require("@electric-sql/pglite");
  const client = new PGlite(join(root, ".data", "flashcards"));

  for (const title of ["Miscellaneous Words", "grade 5"]) {
    const lr = await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [title]);
    if (!lr.rows[0]) continue;
    const wr = await client.query(
      `SELECT word, example FROM words WHERE lesson_id = $1`,
      [lr.rows[0].id],
    );
    for (const r of wr.rows) add(r);
  }

  await client.close();
  return { words, examples };
}

if (process.argv[1]?.endsWith("export-curriculum-words.mjs")) {
  const { words, examples } = await loadCurriculumWordSets();
  writeFileSync(
    join(root, ".data", "curriculum-words-export.json"),
    JSON.stringify({ words: [...words], examples: [...examples] }),
  );
  console.log(`Exported ${words.size} words, ${examples.size} examples.`);
}
