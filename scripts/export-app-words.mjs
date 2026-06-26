/**
 * Export / sync all app vocabulary words to app-words.txt (project root).
 * Words are grouped by lesson: lesson title, then one word per line.
 * Usage:
 *   node scripts/export-app-words.mjs         — rebuild from database
 *   node scripts/export-app-words.mjs --full  — same as above
 */
import { syncAppWordsTxt } from "./lib/app-words-registry.mjs";

const { path, total, lessons, added } = await syncAppWordsTxt();

if (added > 0 && added < total) {
  console.log(`Updated ${path}: ${total} words in ${lessons} lessons (+${added} new).`);
} else {
  console.log(`Wrote ${total} words in ${lessons} lessons to ${path}`);
}
