import { isNull, eq, and, isNotNull } from "drizzle-orm";
import { db, wordsTable } from "@workspace/db";
import { translateExampleToArabic } from "@workspace/integrations-openai-ai-server";
import { logger } from "../lib/logger";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function generateMissingTranslations() {
  const missing = await db
    .select({
      id: wordsTable.id,
      word: wordsTable.word,
      example: wordsTable.example,
    })
    .from(wordsTable)
    .where(and(isNotNull(wordsTable.example), isNull(wordsTable.exampleTranslation)));

  if (missing.length === 0) {
    logger.info("[TranslationWorker] All example translations are up to date.");
    return;
  }

  logger.info(`[TranslationWorker] Found ${missing.length} word(s) without example translation. Translating...`);

  for (const { id, word, example } of missing) {
    if (!example) continue;
    try {
      const translation = (await translateExampleToArabic(example)).trim();
      if (translation) {
        await db.update(wordsTable).set({ exampleTranslation: translation }).where(eq(wordsTable.id, id));
        logger.info(`[TranslationWorker] ✓ "${word}" (id=${id})`);
      }
    } catch (err) {
      logger.warn({ err }, `[TranslationWorker] ✗ Failed for "${word}" (id=${id}) — will retry next cycle`);
    }
    await sleep(1000);
  }

  logger.info("[TranslationWorker] Batch complete.");
}

export function startExampleTranslationWorker() {
  const run = async () => {
    try {
      await generateMissingTranslations();
    } catch (err) {
      logger.error({ err }, "[TranslationWorker] Unexpected error in batch");
    }
    setTimeout(run, 5 * 60 * 1000);
  };

  setTimeout(run, 8000);
  logger.info("[TranslationWorker] Started — will auto-translate missing example sentences in background.");
}
