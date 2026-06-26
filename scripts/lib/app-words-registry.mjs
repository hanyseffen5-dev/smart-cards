import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { normWord } from "./normalize.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const APP_WORDS_TXT = join(root, "app-words.txt");

/** Lessons omitted from app-words.txt (hidden / source lessons). */
export const APP_WORDS_EXCLUDED_LESSONS = new Set([
  "Daniel - The Movie",
  "Miscellaneous Words Part 1",
]);

function header(totalWords, lessonCount, added = 0) {
  const date = new Date().toISOString().slice(0, 10);
  const addedNote = added > 0 ? ` Added ${added} new.` : "";
  return [
    "# Smart Flashcards — all vocabulary words grouped by lesson.",
    `# Updated: ${date}. Total: ${totalWords} words in ${lessonCount} lessons.${addedNote}`,
    "# Sync: node scripts/export-app-words.mjs",
    "",
  ].join("\n");
}

/** Parse all words from app-words.txt (skips comments and known lesson titles). */
export function parseAppWordsTxt(content, lessonTitles = new Set()) {
  const titleNorms = new Set([...lessonTitles].map((t) => normWord(t)));
  const words = [];
  const seen = new Set();

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (titleNorms.has(normWord(trimmed))) continue;
    const n = normWord(trimmed);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    words.push(trimmed);
  }
  return { words, seen };
}

export async function fetchWordsByLessonFromDb(client = null) {
  const require = createRequire(join(root, "lib/db/package.json"));
  const { PGlite } = require("@electric-sql/pglite");
  const ownClient = !client;
  const db = client ?? new PGlite(join(root, ".data", "flashcards"));

  const lessons = await db.query(`SELECT id, title FROM lessons ORDER BY id`);
  const sections = [];

  for (const lesson of lessons.rows) {
    if (APP_WORDS_EXCLUDED_LESSONS.has(lesson.title)) continue;
    const rows = await db.query(
      `SELECT word FROM words WHERE lesson_id = $1 ORDER BY id`,
      [lesson.id],
    );
    const words = rows.rows.map((r) => String(r.word).trim()).filter(Boolean);
    if (words.length === 0) continue;
    sections.push({ title: lesson.title, words });
  }

  if (ownClient) await db.close();
  return sections;
}

/** @deprecated use fetchWordsByLessonFromDb */
export async function fetchAllWordsFromDb(client = null) {
  const sections = await fetchWordsByLessonFromDb(client);
  const byNorm = new Map();
  for (const { words } of sections) {
    for (const word of words) {
      const n = normWord(word);
      if (!n || byNorm.has(n)) continue;
      byNorm.set(n, word);
    }
  }
  return byNorm;
}

function formatSections(sections) {
  const lines = [];
  for (let i = 0; i < sections.length; i++) {
    const { title, words } = sections[i];
    lines.push(title);
    lines.push(...words);
    if (i < sections.length - 1) lines.push("");
  }
  return lines.join("\n");
}

/**
 * Rebuild app-words.txt from the database, grouped by lesson.
 * Reports how many words were added vs the previous file (if any).
 */
export async function syncAppWordsTxt({ client = null } = {}) {
  const sections = await fetchWordsByLessonFromDb(client);
  const total = sections.reduce((n, s) => n + s.words.length, 0);
  const lessonTitles = new Set(sections.map((s) => s.title));

  let added = total;
  if (existsSync(APP_WORDS_TXT)) {
    const existing = parseAppWordsTxt(readFileSync(APP_WORDS_TXT, "utf8"), lessonTitles);
    added = 0;
    const seen = new Set(existing.seen);
    for (const { words } of sections) {
      for (const word of words) {
        const n = normWord(word);
        if (!n || seen.has(n)) continue;
        seen.add(n);
        added++;
      }
    }
  }

  writeFileSync(
    APP_WORDS_TXT,
    `${header(total, sections.length, added)}\n${formatSections(sections)}\n`,
    "utf8",
  );
  return { path: APP_WORDS_TXT, total, lessons: sections.length, added };
}
