/**
 * Scaffold BATCH81–90 prompts from grade4-cards (words 801–900).
 * Usage: node scripts/scaffold-grade4-batch81-90.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function sceneHint(card) {
  const ex = card.example.replace(/'/g, "\\'");
  const w = card.word;
  if (/^\d|one-hundred|ninety-|eighty-/.test(w) || /^one-hundred-/.test(w)) {
    return `Friendly school or town scene visually suggesting the number "${w}" through many repeated objects (campers, tickets, steps, lockers) without counting digits, NO text NO numbers NO digits. Matches '${ex}'`;
  }
  return `Clear friendly children's scene for "${w}" suitable for grade 4.${ex ? ` Matches '${ex}'` : ""} NO text NO letters NO words NO numbers.`;
}

const lines = [
  `/** Auto-scaffolded BATCH81–90 (cards 801–900) — sentence-aligned */`,
  `import { STYLE } from "./lib/daniel-image-style.mjs";`,
  `export { STYLE };`,
  ``,
];

for (let b = 81; b <= 90; b++) {
  const cards = GRADE4_CARDS.slice((b - 1) * 10, b * 10);
  const name = `BATCH${b}_PROMPTS`;
  lines.push(`export const ${name} = {`);
  for (const c of cards) {
    const key = c.word.includes("-") || c.word.includes(" ") ? `"${c.word}"` : c.word;
    const hint = sceneHint(c).replace(/"/g, '\\"');
    lines.push(`  ${key}: "${hint}",`);
  }
  lines.push(`};`, ``);
}

const out = join(__dirname, "grade4-batch81-90-prompts.mjs");
writeFileSync(out, lines.join("\n"), "utf8");
console.log("Wrote", out);
