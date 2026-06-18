import { Router, type IRouter } from "express";
import { eq, isNull, sql } from "drizzle-orm";
import { db, wordsTable } from "@workspace/db";
import pg from "pg";
import { logger } from "../lib/logger";
import { assertBulkImageGenerationBlocked } from "../lib/imageGenerationGate";

const router: IRouter = Router();

const DEV_DB_URL = "postgresql://postgres:password@helium/heliumdb?sslmode=disable";

router.post("/admin/migrate-images", async (_req, res): Promise<void> => {
  const secret = _req.headers["x-admin-secret"];
  if (secret !== "migrate-images-2026") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  logger.info("[Admin] Starting image migration from dev DB...");

  const devClient = new pg.Client({ connectionString: DEV_DB_URL });
  try {
    await devClient.connect();
  } catch (err) {
    logger.error({ err }, "[Admin] Failed to connect to dev DB");
    res.status(500).json({ error: "Cannot connect to dev DB" });
    return;
  }

  try {
    // Get all words in current (prod) DB that need images
    const prodWords = await db
      .select({ id: wordsTable.id, word: wordsTable.word })
      .from(wordsTable)
      .where(isNull(wordsTable.imageUrl));

    logger.info(`[Admin] Found ${prodWords.length} words without images in prod DB`);

    let transferred = 0;
    let notFound = 0;

    for (const prodWord of prodWords) {
      const { rows } = await devClient.query<{ image_url: string }>(
        "SELECT image_url FROM words WHERE LOWER(word) = LOWER($1) AND image_url IS NOT NULL LIMIT 1",
        [prodWord.word]
      );

      if (rows.length === 0 || !rows[0].image_url) {
        notFound++;
        continue;
      }

      await db
        .update(wordsTable)
        .set({ imageUrl: rows[0].image_url })
        .where(eq(wordsTable.id, prodWord.id));

      transferred++;
      if (transferred % 10 === 0) {
        logger.info(`[Admin] Migrated ${transferred}/${prodWords.length} images...`);
      }
    }

    logger.info(`[Admin] Migration complete. Transferred: ${transferred}, Not found in dev: ${notFound}`);
    res.json({ success: true, transferred, notFound, total: prodWords.length });
  } catch (err) {
    logger.error({ err }, "[Admin] Migration error");
    res.status(500).json({ error: String(err) });
  } finally {
    await devClient.end();
  }
});

/** Bulk regeneration disabled — use POST /api/words/:id/generate-image?confirm=true per card. */
router.post("/admin/regenerate-all-images", async (_req, res): Promise<void> => {
  try {
    assertBulkImageGenerationBlocked();
  } catch (err) {
    res.status(403).json({
      error: err instanceof Error ? err.message : "Bulk image generation disabled",
    });
  }
});

export default router;
