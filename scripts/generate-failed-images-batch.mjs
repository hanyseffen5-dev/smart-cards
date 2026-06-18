import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = join(rootDir, "scripts", "audit-word-images-report.json");
const apiBase = process.env.AUDIT_API_BASE || "http://127.0.0.1:3000";
const batchSize = Number(process.env.BATCH_SIZE || 40);
const offset = Number(process.env.BATCH_OFFSET || 0);
const lessonFilter = (process.env.LESSON_TITLE || "").trim();
const delayMs = Number(process.env.DELAY_MS || 250);
const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 45000);

if (!existsSync(reportPath)) {
  throw new Error(`Missing report: ${reportPath}`);
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
let failed = [];
for (const lesson of report.lessons ?? []) {
  if (lessonFilter && lesson.lessonTitle !== lessonFilter) continue;
  for (const row of lesson.failedWords ?? []) {
    failed.push({ ...row, lessonTitle: lesson.lessonTitle });
  }
}

failed = failed.slice(offset, offset + batchSize);
if (failed.length === 0) {
  console.log("No failed words for this batch window.");
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0;
let bad = 0;
for (const item of failed) {
  const url = `${apiBase}/api/words/${item.id}/generate-image?confirm=true`;
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (res.ok) {
      ok++;
      console.log(`OK ${item.id} ${item.word} (${item.lessonTitle})`);
    } else {
      bad++;
      console.log(`FAIL ${item.id} ${item.word} -> ${res.status}`);
    }
  } catch (err) {
    bad++;
    console.log(`FAIL ${item.id} ${item.word} -> ${err instanceof Error ? err.message : String(err)}`);
  }
  await sleep(delayMs);
}

console.log(`Done batch. Success=${ok}, Failed=${bad}, Offset=${offset}, Size=${failed.length}`);
