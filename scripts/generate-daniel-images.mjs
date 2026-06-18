/**
 * Generate daniel_<word>.png from prompt maps via Pollinations (free).
 * Usage:
 *   node scripts/generate-daniel-images.mjs batch3
 *   node scripts/generate-daniel-images.mjs batch4
 *   node scripts/generate-daniel-images.mjs word1 word2
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { BATCH3_PROMPTS, STYLE as STYLE3 } from "./daniel-batch3-prompts.mjs";
import { BATCH4_PROMPTS, STYLE as STYLE4 } from "./daniel-batch4-prompts.mjs";
import { BATCH5_PROMPTS, STYLE as STYLE5 } from "./daniel-batch5-prompts.mjs";
import { REDO_PROMPTS, STYLE as STYLE_REDO } from "./daniel-redo-prompts.mjs";
import { STYLE_MISC_COMPOSITE } from "./daniel-redo-scene.mjs";
import { openFlashcardsClient, loadRedoEntries } from "./lib/load-redo-entries.mjs";
import { cropIllustrationFromBuffer } from "./lib/illustration-crop.mjs";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS_DIR =
  process.env.DANIEL_ASSETS_DIR ||
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

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

function assetPath(word) {
  return join(ASSETS_DIR, `daniel_${word.replace(/\s+/g, "_")}.png`);
}

async function generateOne(word, scene, styleSuffix, { force = false, seedKey = "", wide = false, crop = false } = {}) {
  const outPath = assetPath(word);
  if (!force && existsSync(outPath)) {
    return { skipped: true, bytes: 0 };
  }
  const fullScene = `${scene} ${styleSuffix}`.trim();
  const url = buildUrl(fullScene, seedKey, wide ? { width: 1344, height: 768 } : {});
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "image/*" }, signal: AbortSignal.timeout(180_000) });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`${res.status} ${t.slice(0, 120)}`);
      }
      let buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error("empty image");
      if (crop) {
        buf = await cropIllustrationFromBuffer(buf);
      }
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
const batchArg = ["batch3", "batch4", "batch5", "redo", "redo-b3", "redo-v2"].find((b) => args.includes(b));

let entries = [];
let genOpts = { wide: false, crop: false };

if (batchArg === "redo-b3" || batchArg === "redo-v2") {
  const client = await openFlashcardsClient();
  try {
    const rows = await loadRedoEntries(client);
    if (batchArg === "redo-v2") {
      console.warn("[redo-v2] deprecated — use redo-b3 (batch3 flat cream style, same as card 96)");
    }
    const style = batchArg === "redo-v2" ? STYLE_MISC_COMPOSITE : STYLE_REDO;
    const tag = batchArg === "redo-v2" ? "daniel-redo-v2" : "daniel-redo-b3";
    entries = rows.map((r) => [r.word, r.scene, style, `${tag}:${r.id}:${r.word}`]);
    genOpts =
      batchArg === "redo-v2" ? { wide: true, crop: true } : { wide: false, crop: false };
    console.log(
      `[${batchArg}] ${entries.length} words — ${batchArg === "redo-b3" ? "batch3 flat 1:1 cream (like compare/appearance)" : "wide composite + crop"}`,
    );
  } finally {
    await client.close();
  }
} else if (batchArg === "batch3") {
  entries = Object.entries(BATCH3_PROMPTS).map(([word, scene]) => [word, scene, STYLE3, ""]);
} else if (batchArg === "batch4") {
  entries = Object.entries(BATCH4_PROMPTS).map(([word, scene]) => [word, scene, STYLE4, ""]);
} else if (batchArg === "batch5") {
  entries = Object.entries(BATCH5_PROMPTS).map(([word, scene]) => [word, scene, STYLE5, ""]);
} else if (batchArg === "redo") {
  entries = Object.entries(REDO_PROMPTS).map(([word, scene]) => [
    word,
    scene,
    STYLE_REDO,
    `daniel-redo-v1:${word}`,
  ]);
} else if (args.filter((a) => !a.startsWith("--")).length) {
  const words = args.filter((a) => !a.startsWith("--"));
  for (const word of words) {
    const scene = BATCH3_PROMPTS[word] || BATCH4_PROMPTS[word] || BATCH5_PROMPTS[word] || REDO_PROMPTS[word];
    if (!scene) {
      console.error(`No prompt for "${word}"`);
      continue;
    }
    const style = BATCH3_PROMPTS[word]
      ? STYLE3
      : BATCH4_PROMPTS[word]
        ? STYLE4
        : BATCH5_PROMPTS[word]
          ? STYLE5
          : STYLE_REDO;
    const seedKey = REDO_PROMPTS[word] ? `daniel-redo-v1:${word}` : "";
    entries.push([word, scene, style, seedKey]);
  }
} else {
  console.error(
    "Usage: node generate-daniel-images.mjs [--force] [--offset=N] [--limit=N] batch3|batch4|batch5|redo|redo-b3|redo-v2|word ...",
  );
  process.exit(1);
}

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
    const result = await generateOne(word, scene, style, { force, seedKey, ...genOpts });
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
  const pauseMs = batchArg === "redo-b3" || batchArg === "redo-v2" ? 12000 : 2500;
  if (i < entries.length - 1) await sleep(pauseMs);
}
console.log(`\nDone: ${ok} ok, ${skip} skipped, ${fail} failed → ${ASSETS_DIR}`);
