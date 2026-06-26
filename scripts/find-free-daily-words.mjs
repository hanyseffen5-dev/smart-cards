/**
 * Find free kid-friendly dictionary words for grade 6 daily final batch.
 * Run: node scripts/find-free-daily-words.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { GRADE6_FINAL } from "./seed-data/grade6-final.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const finalSet = new Set(GRADE6_FINAL.map((c) => normWord(c.word)));
const blocked = new Set(GRADE6_FORBIDDEN_WORDS);
for (const c of GRADE6_CARDS) {
  if (!finalSet.has(normWord(c.word))) blocked.add(normWord(c.word));
}

const existing = readFileSync(join(root, "scripts/data/grade6-daily-word-list.txt"), "utf8")
  .split(/\r?\n/)
  .map((l) => normWord(l.trim()))
  .filter(Boolean);

const have = new Set(existing);

/** Skip obscure / academic patterns. */
function kidFriendly(w) {
  if (w.length < 4 || w.length > 9) return false;
  if (!/^[a-z]+$/.test(w)) return false;
  if (!/[aeiouy]/.test(w)) return false;
  if (/^(un|re|pre|post|anti|pseudo|meta|poly|mono|multi|hyper|ultra|infra|inter|intra|extra|over|under)/.test(w) && w.length > 7) return false;
  if (/(ology|ography|ometry|ification|ization|aceous|aceous|iferous|ibility|ability|fulness|lessness)$/.test(w)) return false;
  if (/[qxz]{2}|^[^aeiouy]{4,}/.test(w)) return false;
  if (/^(aa|abac|abb|abd|abe|abi|abo|abr|abs|abu|aby|aca|acc|ace|ach|aci|acl|acm|acn|aco|acp|acq|acr|act|acu|acy)/.test(w) && w.length > 6) return false;
  return true;
}

const dict = readFileSync(join(root, "scripts/data/words_alpha.txt"), "utf8").split(/\r?\n/);
const extra = [];
for (const w of dict) {
  const n = normWord(w);
  if (!kidFriendly(n) || blocked.has(n) || have.has(n)) continue;
  extra.push(n);
  have.add(n);
  if (extra.length >= 150) break;
}

const all = [...existing, ...extra];
writeFileSync(join(root, "scripts/data/grade6-daily-word-list.txt"), `${all.join("\n")}\n`, "utf8");
console.log(`List: ${existing.length} priority + ${extra.length} dict = ${all.length} total`);
console.log(`Extra sample: ${extra.slice(0, 30).join(", ")}`);
