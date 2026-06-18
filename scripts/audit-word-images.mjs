import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiBase = process.env.AUDIT_API_BASE || "http://127.0.0.1:3000";
const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 15000);

async function getJson(path) {
  const res = await fetch(`${apiBase}${path}`, {
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json();
}

async function checkWordImage(wordId) {
  try {
    const res = await fetch(`${apiBase}/api/words/${wordId}/image`, {
      method: "HEAD",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

const lessons = await getJson("/api/lessons");
const report = [];
let totalWords = 0;
let totalOk = 0;
let totalFailed = 0;

for (const lesson of lessons) {
  const details = await getJson(`/api/lessons/${lesson.id}`);
  const words = details.words ?? [];
  totalWords += words.length;

  let okCount = 0;
  const failed = [];

  // sequential to avoid API overload/rate limits
  for (const w of words) {
    const image = await checkWordImage(w.id);
    if (image.ok) {
      okCount++;
    } else {
      failed.push({
        id: w.id,
        word: w.word,
        status: image.status,
        error: image.error ?? null,
      });
    }
  }

  totalOk += okCount;
  totalFailed += failed.length;
  report.push({
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    total: words.length,
    ok: okCount,
    failed: failed.length,
    failedWords: failed,
  });
}

const summary = {
  apiBase,
  scannedAt: new Date().toISOString(),
  totalLessons: report.length,
  totalWords,
  totalOk,
  totalFailed,
  lessons: report,
};

const outPath = join(rootDir, "scripts", "audit-word-images-report.json");
writeFileSync(outPath, JSON.stringify(summary, null, 2), "utf8");

console.log(`Audit complete: ${totalOk}/${totalWords} words have working images.`);
console.log(`Failed: ${totalFailed}. Report: ${outPath}`);
