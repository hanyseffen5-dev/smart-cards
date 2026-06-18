/**
 * Generate grade5_<word>.png from batch JSON via Pollinations.
 * Usage: node scripts/generate-grade5-batch-images.mjs [.data/grade5-batch11-words.json]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { ASSETS_DIR, assetPath, buildPrompt } from "./lib/grade5-image-style.mjs";
import { sceneFromExample } from "./lib/grade5-scene-from-example.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = process.argv[2] || join(rootDir, ".data", "grade5-batch11-words.json");
const force = process.argv.includes("--force");

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

  const scene = sceneFromExample(example);
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

const { picks } = JSON.parse(readFileSync(jsonPath, "utf8"));
console.log(`Generating ${picks.length} images → ${ASSETS_DIR}`);
console.log(`Source: ${jsonPath}`);

let ok = 0;
let skipped = 0;
const failed = [];

for (let i = 0; i < picks.length; i++) {
  const { word, example } = picks[i];
  try {
    const r = await generateOne(word, example);
    if (r.skipped) {
      skipped++;
      console.log(`[${i + 1}/${picks.length}] skip ${word}`);
    } else {
      ok++;
      console.log(`[${i + 1}/${picks.length}] OK ${word} (${r.bytes} bytes)`);
    }
  } catch (err) {
    failed.push({ word, err: String(err.message || err) });
    console.error(`[${i + 1}/${picks.length}] FAIL ${word}: ${err.message || err}`);
  }
  if (i < picks.length - 1) await sleep(2500);
}

console.log(`\nDone: ${ok} generated, ${skipped} skipped, ${failed.length} failed`);
if (failed.length) {
  writeFileSync(join(rootDir, ".data", "grade5-batch-gen-errors.json"), JSON.stringify(failed, null, 2));
  console.log(`Errors → .data/grade5-batch-gen-errors.json`);
}
