import { isNull, eq, and, isNotNull } from "drizzle-orm";
import { db, wordsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { generateAndStoreWordImage } from "../lib/wordImage";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * One-time migration: clear cached images for words that have an example sentence
 * so they are regenerated with the richer sentence-based prompt.
 */
async function resetImagesWithExamples() {
  const result = await db
    .update(wordsTable)
    .set({ imageUrl: null })
    .where(and(isNotNull(wordsTable.example), isNotNull(wordsTable.imageUrl)));
  logger.info(`[ImageWorker] Reset images for words with example sentences — will regenerate with scene-based prompts.`);
  return result;
}

async function generateMissingImages() {
  const missing = await db
    .select({
      id: wordsTable.id,
      word: wordsTable.word,
      translation: wordsTable.translation,
      example: wordsTable.example,
      imageUrl: wordsTable.imageUrl,
    })
    .from(wordsTable)
    .where(isNull(wordsTable.imageUrl));

  if (missing.length === 0) {
    logger.info("[ImageWorker] All images are up to date — nothing to generate.");
    return;
  }

  logger.info(`[ImageWorker] Found ${missing.length} word(s) without images. Generating...`);

  for (const row of missing) {
    const { id, word, example } = row;
    try {
      logger.info(`[ImageWorker] Generating image for "${word}" — ${example ? "scene-based" : "word-based"} prompt`);
      await generateAndStoreWordImage(row);
      logger.info(`[ImageWorker] ✓ "${word}" (id=${id})`);
    } catch (err) {
      logger.warn({ err }, `[ImageWorker] ✗ Failed for "${word}" (id=${id}) — will retry next cycle`);
    }
    // 2-second pause between requests to avoid rate limiting
    await sleep(2000);
  }

  logger.info("[ImageWorker] Batch complete.");
}

export function startImageWorker() {
  const run = async () => {
    try {
      await generateMissingImages();
    } catch (err) {
      logger.error({ err }, "[ImageWorker] Unexpected error in batch");
    }
    // Re-check every 5 minutes for newly added words
    setTimeout(run, 5 * 60 * 1000);
  };

  // Wait 5 seconds after server starts before first run
  setTimeout(run, 5000);
  logger.info("[ImageWorker] Started — will auto-generate missing images in background.");
}
