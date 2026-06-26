import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(rootDir, ".data", "g6-forbidden.json"), "utf8"));
const words = data.collidingWords.slice().sort();
const body =
  "/** Grade 6 words that already exist in other lessons — removed from grade 6 to keep every word unique across the app. Auto-generated. */\n" +
  "export const GRADE6_COLLISIONS = new Set([\n" +
  words.map((w) => `  ${JSON.stringify(w)},`).join("\n") +
  "\n]);\n";
writeFileSync(join(rootDir, "scripts", "seed-data", "grade6-collisions.mjs"), body);
console.log("wrote", words.length, "collisions");
