import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const sharp = require("sharp");

const ASSETS_DIR =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

const files = readdirSync(ASSETS_DIR);
const f = files.find((n) => n.includes("images_39") && n.includes("47fdd1d5") && n.endsWith(".png"));
if (!f) { console.error("File not found"); process.exit(1); }

const buf = readFileSync(join(ASSETS_DIR, f));
const meta = await sharp(buf).metadata();

function isOrangePixel(r, g, b) {
  return r > 190 && g > 100 && g < 200 && b < 140 && (r - b) > 80;
}

const raw = await sharp(buf).raw().toBuffer();
const ch = meta.channels || 3;

let boundary = null;
for (let x = Math.floor(meta.width * 0.3); x < Math.floor(meta.width * 0.75); x++) {
  let orangeCount = 0, samples = 0;
  const step = Math.max(1, Math.floor(meta.height / 60));
  for (let y = Math.floor(meta.height * 0.1); y < Math.floor(meta.height * 0.9); y += step) {
    const idx = (y * meta.width + x) * ch;
    if (isOrangePixel(raw[idx], raw[idx + 1], raw[idx + 2])) orangeCount++;
    samples++;
  }
  if (orangeCount / samples > 0.5) { boundary = Math.max(10, x - 2); break; }
}

if (!boundary) { console.error("No boundary found"); process.exit(1); }

const cropped = await sharp(buf)
  .extract({ left: 0, top: 0, width: boundary, height: meta.height })
  .png()
  .toBuffer();

const dataUrl = `data:image/png;base64,${cropped.toString("base64")}`;

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim();
  }
}
loadEnvFile(join(rootDir, ".env"));

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));

await client.query(`UPDATE words SET image_url = $1 WHERE LOWER(TRIM(word)) = 'effusive'`, [dataUrl]);
console.log(`Fixed effusive: ${meta.width}x${meta.height} → ${boundary}x${meta.height}`);
await client.close();
