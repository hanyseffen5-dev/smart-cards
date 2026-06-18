import app from "./app";
import { logger } from "./lib/logger";
import {
  isBackgroundWorkersEnabled,
  isGeminiConfigured,
} from "./lib/backgroundWorkers";
import { startExampleTranslationWorker } from "./workers/exampleTranslationWorker";
import { seedIfEmpty } from "./seed";
import { syncImagesFromDev } from "./workers/imageSyncFromDev";
import { syncLessonsFromDev } from "./workers/syncLessonsFromDev";
import { ensureDatabaseReady } from "@workspace/db";
import {
  acquireEmbeddedDbLock,
  releaseEmbeddedDbLock,
  warnIfNeedsRestore,
} from "./lib/embeddedDbLock";
import { warnIfSheetsNotConfigured } from "./lib/sheets";
import { warnIfMessagesNotConfigured } from "./lib/sheetsMessages";

function maybeStartBackgroundWorkers() {
  if (!isBackgroundWorkersEnabled()) {
    logger.info(
      "[Workers] Disabled — set BACKGROUND_WORKERS=true in .env for example translations only. Images are never auto-generated.",
    );
    return;
  }
  logger.info(
    "[Workers] Image auto-generation is off — use POST /api/words/:id/generate-image?confirm=true with ALLOW_IMAGE_GENERATION=true.",
  );
  if (isGeminiConfigured()) {
    startExampleTranslationWorker();
  } else {
    logger.info(
      "[TranslationWorker] Skipped — set a valid GEMINI_API_KEY to enable example translations.",
    );
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  await ensureDatabaseReady();
  acquireEmbeddedDbLock();
  warnIfNeedsRestore();
  warnIfSheetsNotConfigured();
  warnIfMessagesNotConfigured();

  const releaseLock = () => releaseEmbeddedDbLock();
  process.on("SIGINT", releaseLock);
  process.on("SIGTERM", releaseLock);
  process.on("exit", releaseLock);

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");

    seedIfEmpty()
      .then(() => syncLessonsFromDev())
      .then(() => syncImagesFromDev())
      .then(() => maybeStartBackgroundWorkers())
      .catch((err) => {
        logger.error({ err }, "Startup error");
      });
  });
}

start().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
