/**
 * Generate grade4_<word>.png for given batches (Pollinations), skips existing valid files.
 * Usage: node scripts/generate-grade4-batches.mjs batch86 batch87 ... [--force] [--limit=N]
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { BATCH_PROMPTS } from "./grade4-batch-prompts.mjs";
import { GENERATE_IMAGE_STYLE } from "./lib/daniel-image-style.mjs";
import { ASSETS_DIR, assetFileName } from "./lib/grade4-image-style.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const POLLINATIONS_TEMPLATE =
  process.env.IMAGE_GENERATION_URL?.trim() ||
  "https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&nologo=true&model=flux&seed={seed}";

const NEGATIVE =
  "text, words, letters, numbers, symbols, typography, caption, watermark, logo, speech bubble, subtitle, label, sign with text, photorealistic, photograph, 3d render, horror, gore, nsfw";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    process.env[m[1].trim()] = m[2].trim();
  }
}

function buildUrl(visualScene, seedKey = "") {
  const style =
    "Premium 2D vector flat illustration for kids, educational flashcard, soft warm cream background, cute friendly characters, pastel colors, NO text. Scene: ";
  const prompt =
    style +
    visualScene.trim() +
    ". NO text, NO typography, NO words, NO letters, NO numbers, NO watermarks";
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

function isValid(path) {
  if (!existsSync(path)) return false;
  try {
    return statSync(path).size >= 500;
  } catch {
    return false;
  }
}

function sceneFromFullPrompt(full) {
  const marker = "Centered composition. ";
  const i = full.indexOf(marker);
  return i >= 0 ? full.slice(i + marker.length) : full;
}

loadEnvFile(join(rootDir, ".env"));
mkdirSync(ASSETS_DIR, { recursive: true });

const force = process.argv.includes("--force");
const limit = parseInt(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? "0", 10) || 0;
const batchArgs = process.argv.slice(2).filter((a) => a.startsWith("batch"));

if (batchArgs.length === 0) {
  console.error("Usage: node scripts/generate-grade4-batches.mjs batch86 batch87 ...");
  process.exit(1);
}

const work = [];
for (const batch of batchArgs) {
  const prompts = BATCH_PROMPTS[batch];
  if (!prompts) {
    console.error(`Unknown batch: ${batch}`);
    process.exit(1);
  }
  for (const [word, hint] of Object.entries(prompts)) {
    const file = assetFileName(word);
    const outPath = join(ASSETS_DIR, file);
    if (!force && isValid(outPath)) continue;
    work.push({
      word,
      batch,
      file,
      prompt: `${GENERATE_IMAGE_STYLE} ${hint}`,
      outPath,
    });
  }
}

const todo = limit > 0 ? work.slice(0, limit) : work;
console.log(`Generating ${todo.length} grade4 images → ${ASSETS_DIR}`);

let ok = 0;
let fail = 0;
for (let i = 0; i < todo.length; i++) {
  const { word, batch, outPath, prompt } = todo[i];
  const scene = sceneFromFullPrompt(prompt);
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(buildUrl(scene, `grade4:${word}`), {
        headers: { Accept: "image/*" },
        signal: AbortSignal.timeout(180_000),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error("empty");
      writeFileSync(outPath, buf);
      console.log(`[${i + 1}/${todo.length}] ${batch} OK "${word}" (${(buf.length / 1024).toFixed(0)} KB)`);
      ok++;
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err;
      if (attempt < 4) await sleep(5000 * attempt);
    }
  }
  if (lastErr) {
    console.error(`[${i + 1}/${todo.length}] ${batch} FAIL "${word}": ${lastErr.message}`);
    fail++;
  }
  if (i < todo.length - 1) await sleep(2500);
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);
