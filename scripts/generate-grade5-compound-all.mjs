/**
 * Generate grade5_<word>.png for compound-replacement cards missing assets.
 * Pollinations + Daniel-style sentence-aligned prompts (bulk path).
 *
 * Usage: node scripts/generate-grade5-compound-all.mjs
 *        node scripts/generate-grade5-compound-all.mjs --force
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { ASSETS_DIR, assetPath, buildPrompt, LESSON_TITLE } from "./lib/grade5-image-style.mjs";
import { sceneForCard } from "./daniel-redo-scene.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";
import { assertDanielGenerateImageOnly } from "./lib/assert-daniel-generate-image-only.mjs";

assertDanielGenerateImageOnly("generate-grade5-compound-all.mjs");

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const force = process.argv.includes("--force");
const CONCURRENCY = Number(process.env.GRADE5_GEN_CONCURRENCY || 4);
const DELAY_MS = Number(process.env.GRADE5_GEN_DELAY_MS || 800);

const POLLINATIONS_TEMPLATE =
  process.env.IMAGE_GENERATION_URL?.trim() ||
  "https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&nologo=true&model=flux&seed={seed}";

const NEGATIVE =
  "text, words, letters, numbers, symbols, typography, caption, watermark, logo, speech bubble, subtitle, label, sign with text, alphabet, writing, english text, arabic text, photorealistic, photograph, 3d render, realistic hands, detailed fingers, extra fingers, deformed hands, distorted face, blurry, low quality, horror, gore, nsfw";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

function buildUrl(prompt, seedKey = "") {
  const seed = createHash("sha256").update(prompt + seedKey).digest("hex").slice(0, 8);
  let url = POLLINATIONS_TEMPLATE.replace("{prompt}", encodeURIComponent(prompt))
    .replace("{width}", "1024")
    .replace("{height}", "1024")
    .replace("{seed}", seed);
  const sep = url.includes("?") ? "&" : "?";
  if (!url.includes("negative=")) url += `${sep}negative=${encodeURIComponent(NEGATIVE)}`;
  return url;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateOne(word, example) {
  const outPath = assetPath(word);
  if (!force && existsSync(outPath)) return { skipped: true, word };

  const scene = sceneForCard(word, example, "");
  const prompt = buildPrompt({ word, example, sceneHint: scene });
  const url = buildUrl(prompt, word);

  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "image/*" }, signal: AbortSignal.timeout(180_000) });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`${res.status} ${t.slice(0, 120)}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error("empty image");
      writeFileSync(outPath, buf);
      return { skipped: false, word, bytes: buf.length };
    } catch (err) {
      lastErr = err;
      const msg = String(err.message || err);
      const rateLimited = /402|429|queue full|too many/i.test(msg);
      if (attempt < 4) await sleep(rateLimited ? 15000 * attempt : 4000 * attempt);
    }
  }
  throw new Error(`${word}: ${lastErr?.message || lastErr}`);
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const lid = (await client.query(`SELECT id FROM lessons WHERE title = $1 LIMIT 1`, [LESSON_TITLE])).rows[0].id;
const noImg = await client.query(
  `SELECT word, example FROM words WHERE lesson_id = $1 AND (image_url IS NULL OR image_url = '') ORDER BY id`,
  [lid],
);
await client.close();

const picks = noImg.rows.map((r) => ({ word: r.word, example: r.example }));
console.log(`Generating ${picks.length} images → ${ASSETS_DIR}`);

let ok = 0;
let skipped = 0;
const failed = [];

async function worker(queue, total) {
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    const { word, example, index } = item;
    try {
      const r = await generateOne(word, example);
      if (r.skipped) {
        skipped++;
      } else {
        ok++;
        if (ok % 10 === 0) console.log(`[${index + 1}/${total}] OK ${word} (${ok} total)`);
      }
    } catch (err) {
      failed.push({ word, err: String(err.message || err) });
      console.error(`[${index + 1}/${total}] FAIL ${word}: ${err.message || err}`);
    }
    if (DELAY_MS > 0) await sleep(DELAY_MS);
  }
}

const queue = picks.map((p, index) => ({ ...p, index }));
const workers = Array.from({ length: Math.min(CONCURRENCY, picks.length) }, () => worker(queue, picks.length));
await Promise.all(workers);

console.log(`\nDone: ${ok} generated, ${skipped} skipped, ${failed.length} failed`);
if (failed.length) {
  writeFileSync(join(rootDir, ".data", "grade5-compound-gen-errors.json"), JSON.stringify(failed, null, 2));
}
