/**
 * Generate grade1_<word>.png via Pollinations (free — lower quality than Daniel/GenerateImage).
 * Preferred: Cursor GenerateImage — see .cursor/skills/grade1-flashcard-images/SKILL.md
 * Usage:
 *   node scripts/generate-grade1-images.mjs batch1
 *   node scripts/generate-grade1-images.mjs batch1 --force
 *   node scripts/generate-grade1-images.mjs --offset=0 --limit=10 batch3
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { BATCH_PROMPTS, STYLE } from "./grade1-batch-prompts.mjs";
import { assetPath, ASSETS_DIR } from "./lib/grade1-image-style.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

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

function buildUrl(visualScene, seedKey = "", { width = 1024, height = 1024 } = {}) {
  const style =
    "Premium 2D vector flat illustration for kids, educational flashcard style, cute friendly characters, vibrant pastel colors, simple clean background, minimal details, safe for toddlers, NO text, NO words, NO realistic hands, NO distorted faces. Scene to draw: ";
  const prompt =
    style +
    visualScene.trim() +
    ". NO text, NO typography, NO words, NO letters, NO numbers, NO symbols, NO captions, NO labels, NO watermarks, NO logos, NO speech bubbles, NO subtitles, NO writing in any language";
  const seed = createHash("sha256").update(prompt + seedKey).digest("hex").slice(0, 8);
  let url = POLLINATIONS_TEMPLATE.replace("{prompt}", encodeURIComponent(prompt))
    .replace("{width}", String(width))
    .replace("{height}", String(height))
    .replace("{seed}", seed);
  const sep = url.includes("?") ? "&" : "?";
  if (!url.includes("negative=")) url += `${sep}negative=${encodeURIComponent(NEGATIVE)}`;
  return url;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateOne(word, scene, styleSuffix, { force = false, seedKey = "" } = {}) {
  const outPath = assetPath(word);
  if (!force && existsSync(outPath)) {
    return { skipped: true, bytes: 0 };
  }
  const fullScene = `${scene} ${styleSuffix}`.trim();
  const url = buildUrl(fullScene, seedKey);
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
      return { skipped: false, bytes: buf.length };
    } catch (err) {
      lastErr = err;
      const msg = String(err.message || err);
      const rateLimited = /402|429|queue full|too many/i.test(msg);
      if (attempt < 4) await sleep(rateLimited ? 15000 * attempt : 4000 * attempt);
    }
  }
  throw lastErr;
}

loadEnvFile(join(rootDir, ".env"));
process.env.PROJECT_ROOT ??= rootDir;
assertServerNotRunning();
mkdirSync(ASSETS_DIR, { recursive: true });

const args = process.argv.slice(2);
const force = args.includes("--force");
const offset = parseInt(args.find((a) => a.startsWith("--offset="))?.split("=")[1] ?? "0", 10) || 0;
const limit = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? "0", 10) || 0;
const batchArg = Object.keys(BATCH_PROMPTS).find((b) => args.includes(b));

if (!batchArg) {
  console.error("Usage: node generate-grade1-images.mjs [--force] [--offset=N] [--limit=N] batch1|...|batch30");
  process.exit(1);
}

let entries = Object.entries(BATCH_PROMPTS[batchArg]).map(([word, scene]) => [
  word,
  scene,
  STYLE,
  `grade1-${batchArg}:${word}`,
]);

if (limit > 0) {
  entries = entries.slice(offset, offset + limit);
  console.log(`Chunk: offset=${offset} limit=${limit} → ${entries.length} words`);
}

let ok = 0;
let skip = 0;
let fail = 0;
for (let i = 0; i < entries.length; i++) {
  const [word, scene, style, seedKey] = entries[i];
  try {
    const result = await generateOne(word, scene, style, { force, seedKey });
    if (result.skipped) {
      console.log(`[${i + 1}/${entries.length}] SKIP "${word}" (exists, use --force)`);
      skip++;
    } else {
      console.log(`[${i + 1}/${entries.length}] OK "${word}" (${(result.bytes / 1024).toFixed(0)} KB)`);
      ok++;
    }
  } catch (err) {
    console.error(`[${i + 1}/${entries.length}] FAIL "${word}": ${err.message}`);
    fail++;
  }
  if (i < entries.length - 1) await sleep(2500);
}
console.log(`\nDone: ${ok} ok, ${skip} skipped, ${fail} failed → ${ASSETS_DIR}`);
