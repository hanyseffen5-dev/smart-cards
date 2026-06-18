/**
 * Generate missing grade4_<word>.png from grade4-gen-batch81-90.json via Pollinations.
 * Usage: node scripts/generate-grade4-missing.mjs [--force] [--limit=N]
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { ASSETS_DIR } from "./lib/grade4-image-style.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = join(dirname(fileURLToPath(import.meta.url)), "grade4-gen-batch81-90.json");

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

function sceneFromPrompt(full) {
  const marker = "Centered composition. ";
  const i = full.indexOf(marker);
  return i >= 0 ? full.slice(i + marker.length) : full;
}

loadEnvFile(join(rootDir, ".env"));
mkdirSync(ASSETS_DIR, { recursive: true });

const force = process.argv.includes("--force");
const limit = parseInt(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? "0", 10) || 0;
const entries = JSON.parse(readFileSync(jsonPath, "utf8")).filter((e) => {
  const p = join(ASSETS_DIR, e.file);
  return force || !isValid(p);
});
const work = limit > 0 ? entries.slice(0, limit) : entries;

console.log(`Generating ${work.length} missing grade4 images → ${ASSETS_DIR}`);

let ok = 0;
let fail = 0;
for (let i = 0; i < work.length; i++) {
  const { word, file, prompt } = work[i];
  const outPath = join(ASSETS_DIR, file);
  const scene = sceneFromPrompt(prompt);
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
      console.log(`[${i + 1}/${work.length}] OK "${word}" (${(buf.length / 1024).toFixed(0)} KB)`);
      ok++;
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err;
      if (attempt < 4) await sleep(5000 * attempt);
    }
  }
  if (lastErr) {
    console.error(`[${i + 1}/${work.length}] FAIL "${word}": ${lastErr.message}`);
    fail++;
  }
  if (i < work.length - 1) await sleep(2500);
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);
