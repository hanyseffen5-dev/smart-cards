import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { assertServerNotRunning } from "./lib/db-safety.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(rootDir, "lib/db/package.json"));
const reportPath = join(rootDir, "scripts", "audit-word-images-report.json");
const assetsDir = join(rootDir, "assets");
const externalAssetsDir =
  "C:\\Users\\hani.ibrahiem\\.cursor\\projects\\f-smart-card-smart-card-FLASH-CARD\\assets";

function lessonPrefix(title) {
  if (title === "Daniel - The Movie") return "daniel_";
  if (title === "grade 1") return "grade1_";
  if (title === "grade 2") return "grade2_";
  if (title === "grade 3") return "grade3_";
  if (title === "grade 4") return "grade4_";
  return null;
}

function assetPathForWord(lessonTitle, word) {
  const prefix = lessonPrefix(lessonTitle);
  if (!prefix) return null;
  const file = `${prefix}${word.replace(/\s+/g, "_")}.png`;
  const p = join(assetsDir, file);
  return existsSync(p) ? p : null;
}

function loadReport() {
  if (!existsSync(reportPath)) {
    throw new Error(`Audit report not found: ${reportPath}`);
  }
  return JSON.parse(readFileSync(reportPath, "utf8"));
}

function latestCacheFilesByWordId(dirPath, targetIds) {
  if (!existsSync(dirPath)) return new Map();
  const map = new Map();
  const files = readdirSync(dirPath).filter((f) => f.toLowerCase().endsWith(".png"));
  for (const file of files) {
    const match = file.match(/_images_(\d+)-/i);
    if (!match) continue;
    const wordId = Number(match[1]);
    if (!targetIds.has(wordId)) continue;
    const fullPath = join(dirPath, file);
    const mtimeMs = statSync(fullPath).mtimeMs;
    const prev = map.get(wordId);
    if (!prev || mtimeMs > prev.mtimeMs) {
      map.set(wordId, { fullPath, mtimeMs });
    }
  }
  return map;
}

assertServerNotRunning();

const { PGlite } = require("@electric-sql/pglite");
const client = new PGlite(join(rootDir, ".data", "flashcards"));
const report = loadReport();

let repaired = 0;
let noAsset = 0;
let repairedFromCacheById = 0;
const byLesson = new Map();
const failedIds = new Set();

for (const lesson of report.lessons ?? []) {
  for (const row of lesson.failedWords ?? []) failedIds.add(row.id);
}
const latestCacheById = latestCacheFilesByWordId(externalAssetsDir, failedIds);

for (const lesson of report.lessons ?? []) {
  const failed = lesson.failedWords ?? [];
  for (const row of failed) {
    const filePath = assetPathForWord(lesson.lessonTitle, row.word);
    const cacheHit = latestCacheById.get(row.id);
    const pickedPath = filePath ?? cacheHit?.fullPath ?? null;
    if (!pickedPath) {
      noAsset++;
      continue;
    }
    const buf = readFileSync(pickedPath);
    const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
    await client.query(`UPDATE words SET image_url = $1 WHERE id = $2`, [dataUrl, row.id]);
    repaired++;
    if (!filePath && cacheHit) repairedFromCacheById++;
    byLesson.set(lesson.lessonTitle, (byLesson.get(lesson.lessonTitle) ?? 0) + 1);
  }
}

await client.close();

console.log(`Repaired from assets: ${repaired}`);
console.log(`Repaired using cache files by id: ${repairedFromCacheById}`);
console.log(`No matching asset file: ${noAsset}`);
for (const [title, n] of byLesson.entries()) {
  console.log(`- ${title}: ${n}`);
}
