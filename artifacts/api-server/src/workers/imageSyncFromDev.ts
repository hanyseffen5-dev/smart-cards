import { isNull, eq } from "drizzle-orm";
import { db, wordsTable } from "@workspace/db";
import pg from "pg";
import { logger } from "../lib/logger";

const DEV_DB_URL = "postgresql://postgres:password@helium/heliumdb?sslmode=disable";

export async function syncImagesFromDev(): Promise<void> {
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    logger.info("[ImageSync] Running in dev mode — skipping sync from dev DB.");
    return;
  }

  // Check if any words are missing images
  const missing = await db
    .select({ id: wordsTable.id, word: wordsTable.word })
    .from(wordsTable)
    .where(isNull(wordsTable.imageUrl));

  if (missing.length === 0) {
    logger.info("[ImageSync] All images already present — no sync needed.");
    return;
  }

  logger.info(`[ImageSync] Found ${missing.length} words without images. Attempting to sync from dev DB...`);

  // Try to connect to dev DB
  const devClient = new pg.Client({ connectionString: DEV_DB_URL });
  try {
    await devClient.connect();
    logger.info("[ImageSync] Connected to dev DB successfully.");
  } catch (err) {
    logger.warn({ err }, "[ImageSync] Cannot reach dev DB — will fall back to AI generation.");
    return;
  }

  let synced = 0;
  let notFound = 0;

  try {
    for (const { id, word } of missing) {
      try {
        const { rows } = await devClient.query<{ image_url: string }>(
          "SELECT image_url FROM words WHERE LOWER(word) = LOWER($1) AND image_url IS NOT NULL LIMIT 1",
          [word]
        );

        if (!rows[0]?.image_url) {
          notFound++;
          continue;
        }

        await db
          .update(wordsTable)
          .set({ imageUrl: rows[0].image_url })
          .where(eq(wordsTable.id, id));

        synced++;

        if (synced % 20 === 0) {
          logger.info(`[ImageSync] Progress: ${synced} synced, ${notFound} not found...`);
        }
      } catch (err) {
        logger.warn({ err }, `[ImageSync] Failed for word "${word}"`);
      }
    }

    logger.info(`[ImageSync] Done! Synced: ${synced}, Not in dev: ${notFound}, Total: ${missing.length}`);
  } finally {
    await devClient.end();
  }
}
