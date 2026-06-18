import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, wordsTable, lessonsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { generateAndStoreWordImage, generateAndStoreDanielCardImage } from "../lib/wordImage";
import {
  assertMayGenerateImages,
  isImageGenerationAllowed,
} from "../lib/imageGenerationGate";
import { ensureExampleTranslation } from "../lib/exampleTranslation";
import {
  CreateWordBody,
  GetWordParams,
  GetWordResponse,
  GetWordsResponse,
  UpdateWordBody,
  UpdateWordParams,
  UpdateWordResponse,
  DeleteWordParams,
  ToggleWordFavoriteParams,
  ToggleWordFavoriteResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const projectRoot = process.env.PROJECT_ROOT ?? process.cwd();
const assetsDir = process.env.DANIEL_ASSETS_DIR || join(projectRoot, "assets");
// Static images migrated out of the DB live under <projectRoot>/public (served at /images/...).
const publicDir = join(projectRoot, "public");

const CURATED_LESSON_TITLES = new Set([
  "Daniel - The Movie",
  "grade 1",
  "grade 2",
  "grade 3",
  "grade 4",
  "grade 5",
  "Miscellaneous Words",
]);

function lessonAssetPrefix(title: string): string | null {
  if (title === "Daniel - The Movie") return "daniel_";
  if (title === "grade 1") return "grade1_";
  if (title === "grade 2") return "grade2_";
  if (title === "grade 3") return "grade3_";
  if (title === "grade 4") return "grade4_";
  if (title === "grade 5") return "grade5_";
  if (title === "Miscellaneous Words") return "misc_";
  return null;
}

/** Curated lessons: PNG in assets/ overrides stale/corrupt DB blobs. */
function lessonPrefersAssetsOnDisk(title: string): boolean {
  return lessonAssetPrefix(title) !== null;
}

function assetFilePathForWord(lessonTitle: string, word: string): string | null {
  const prefix = lessonAssetPrefix(lessonTitle);
  if (!prefix) return null;
  const fileName = `${prefix}${word.replace(/\s+/g, "_")}.png`;
  const filePath = join(assetsDir, fileName);
  if (!existsSync(filePath)) return null;
  return filePath;
}

type WordImageSource =
  | { kind: "file"; filePath: string }
  | { kind: "data"; imageUrl: string }
  | { kind: "redirect"; url: string };

type CachedImageBuffer = { buffer: Buffer; mime: string; etag: string };
const imageBufferCache = new Map<number, CachedImageBuffer>();
const MAX_BUFFER_CACHE = 300;

/** One Pollinations request per word at a time (parallel GET /image on same card). */
const imageGenerationInFlight = new Map<number, Promise<string>>();

function serializeWord(word: typeof wordsTable.$inferSelect) {
  // Strip imageUrl — images are loaded lazily via GET /words/:id/image
  return { ...word, imageUrl: null, createdAt: word.createdAt.toISOString() };
}

function serializeWordFull(word: typeof wordsTable.$inferSelect) {
  return { ...word, createdAt: word.createdAt.toISOString() };
}

const WORD_LIST_COLUMNS = {
  id: wordsTable.id,
  lessonId: wordsTable.lessonId,
  word: wordsTable.word,
  translation: wordsTable.translation,
  // Keep list endpoints resilient even if some stored blobs are corrupted.
  imageUrl: sql<string | null>`NULL`,
  audioUrl: wordsTable.audioUrl,
  example: wordsTable.example,
  exampleTranslation: wordsTable.exampleTranslation,
  difficulty: wordsTable.difficulty,
  partOfSpeech: wordsTable.partOfSpeech,
  isFavorite: wordsTable.isFavorite,
  createdAt: wordsTable.createdAt,
};

router.get("/words", async (_req, res): Promise<void> => {
  const words = await db
    .select(WORD_LIST_COLUMNS)
    .from(wordsTable)
    .orderBy(wordsTable.createdAt);
  res.json(GetWordsResponse.parse(words.map(serializeWord)));
});

/**
 * Lightweight endpoint: returns the IDs of all words that have images ready.
 * Clients call this ONCE on page load instead of sending one HEAD request per word.
 * Response is cached for 60 seconds so thousands of concurrent students share the same response.
 */
router.get("/words/images-ready", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ id: wordsTable.id })
    .from(wordsTable)
    .where(sql`${wordsTable.imageUrl} IS NOT NULL AND ${wordsTable.imageUrl} != ''`);
  res.set("Cache-Control", "public, max-age=60");
  res.json({ readyIds: rows.map((r) => r.id) });
});

router.post("/words", async (req, res): Promise<void> => {
  const parsed = CreateWordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  // Server-side deduplication: reject if the exact word (case-insensitive) already exists anywhere
  const [existing] = await db
    .select()
    .from(wordsTable)
    .where(sql`lower(trim(${wordsTable.word})) = lower(trim(${parsed.data.word}))`);
  if (existing) {
    res.status(409).json({
      error: `Word "${parsed.data.word}" already exists`,
      existingWord: serializeWord(existing),
    });
    return;
  }
  const [word] = await db.insert(wordsTable).values(parsed.data).returning();
  // Update lesson word count
  const words = await db.select().from(wordsTable).where(eq(wordsTable.lessonId, parsed.data.lessonId));
  await db.update(lessonsTable).set({ wordCount: words.length }).where(eq(lessonsTable.id, parsed.data.lessonId));
  res.status(201).json(GetWordResponse.parse(serializeWord(word)));
});

function getOrDecodeBuffer(wordId: number, imageUrl: string): CachedImageBuffer | null {
  const cached = imageBufferCache.get(wordId);
  if (cached) return cached;

  const dataMatch = imageUrl.match(/^data:(image\/\w+);base64,(.+)$/s);
  if (!dataMatch) return null;

  const mime = dataMatch[1];
  const buffer = Buffer.from(dataMatch[2], "base64");
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const entry: CachedImageBuffer = {
    buffer,
    mime,
    etag: `"word-${wordId}-${hash}"`,
  };

  if (imageBufferCache.size >= MAX_BUFFER_CACHE) {
    const oldest = imageBufferCache.keys().next().value;
    if (oldest !== undefined) imageBufferCache.delete(oldest);
  }
  imageBufferCache.set(wordId, entry);
  return entry;
}

function contentTypeForFile(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/png";
}

function sendAssetFile(
  res: import("express").Response,
  wordId: number,
  filePath: string,
  ifNoneMatch?: string,
): void {
  const stat = statSync(filePath);
  const etag = `"word-${wordId}-f-${stat.size}-${Math.floor(stat.mtimeMs)}"`;
  res.set({
    "Content-Type": contentTypeForFile(filePath),
    "Cache-Control": "public, max-age=604800, immutable",
    ETag: etag,
    "Content-Length": stat.size,
  });
  if (ifNoneMatch === etag) {
    res.status(304).end();
    return;
  }
  res.end(readFileSync(filePath));
}

function sendStoredWordImage(
  res: import("express").Response,
  wordId: number,
  imageUrl: string,
  ifNoneMatch?: string,
): void {
  const decoded = getOrDecodeBuffer(wordId, imageUrl);
  if (!decoded) {
    res.status(500).json({ error: "Invalid stored image format" });
    return;
  }
  res.set({
    "Content-Type": decoded.mime,
    "Cache-Control": "public, max-age=604800, immutable",
    ETag: decoded.etag,
    "Content-Length": decoded.buffer.length,
  });
  if (ifNoneMatch === decoded.etag) {
    res.status(304).end();
    return;
  }
  res.end(decoded.buffer);
}

function sendWordImageSource(
  res: import("express").Response,
  wordId: number,
  source: WordImageSource,
  ifNoneMatch?: string,
): void {
  switch (source.kind) {
    case "file":
      sendAssetFile(res, wordId, source.filePath, ifNoneMatch);
      break;
    case "data":
      sendStoredWordImage(res, wordId, source.imageUrl, ifNoneMatch);
      break;
    case "redirect":
      res.redirect(302, source.url);
      break;
  }
}

async function resolveWordImageSource(
  wordId: number,
  options?: { regenerate?: boolean },
): Promise<WordImageSource | null> {
  const [row] = await db
    .select({
      id: wordsTable.id,
      lessonId: wordsTable.lessonId,
      word: wordsTable.word,
      translation: wordsTable.translation,
      example: wordsTable.example,
    })
    .from(wordsTable)
    .where(eq(wordsTable.id, wordId));

  if (!row) return null;

  const [lesson] = await db
    .select({ title: lessonsTable.title })
    .from(lessonsTable)
    .where(eq(lessonsTable.id, row.lessonId));

  let imageUrl: string | null = null;
  try {
    const [imageRow] = await db
      .select({ imageUrl: wordsTable.imageUrl })
      .from(wordsTable)
      .where(eq(wordsTable.id, wordId));
    imageUrl = imageRow?.imageUrl ?? null;
  } catch (err) {
    logger.warn({ err, wordId }, "[Image] Corrupted stored blob, trying asset fallback");
  }

  if (imageUrl && !options?.regenerate) {
    if (/^https?:\/\//i.test(imageUrl)) return { kind: "redirect", url: imageUrl };
    // Migrated static file: image_url is a public path like "/images/apple_42.png".
    // Read it straight from disk instead of decoding a base64 blob from the DB.
    if (imageUrl.startsWith("/images/")) {
      const filePath = join(publicDir, imageUrl.replace(/^\/+/, ""));
      if (existsSync(filePath)) return { kind: "file", filePath };
    }
    return { kind: "data", imageUrl };
  }

  if (!options?.regenerate && lesson?.title && lessonPrefersAssetsOnDisk(lesson.title)) {
    const fromAsset = assetFilePathForWord(lesson.title, row.word);
    if (fromAsset) return { kind: "file", filePath: fromAsset };
  }

  if (!isImageGenerationAllowed()) return null;
  if (!row.example?.trim()) {
    throw new Error(
      `Word "${row.word}" has no example sentence — cannot generate a scene image.`,
    );
  }

  let pending = imageGenerationInFlight.get(wordId);
  if (!pending) {
    logger.info({ wordId, word: row.word }, "[Image] On-demand Pollinations generation");
    pending = generateAndStoreWordImage(row, { force: true }).finally(() => {
      imageGenerationInFlight.delete(wordId);
    });
    imageGenerationInFlight.set(wordId, pending);
  }

  const generatedUrl = await pending;
  if (/^https?:\/\//i.test(generatedUrl)) return { kind: "redirect", url: generatedUrl };
  return { kind: "data", imageUrl: generatedUrl };
}

/** Serves image; generates via Pollinations on first request when ALLOW_IMAGE_GENERATION=true. */
router.get("/words/:id/image", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid word id" });
    return;
  }

  const regenerate = req.query.regenerate === "true";

  try {
    const source = await resolveWordImageSource(id, { regenerate });
    if (!source) {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate");
      res.status(404).json({
        error: isImageGenerationAllowed()
          ? "No image yet"
          : "No image yet — set ALLOW_IMAGE_GENERATION=true in .env to auto-generate on view",
      });
      return;
    }
    sendWordImageSource(res, id, source, req.headers["if-none-match"] as string | undefined);
  } catch (err) {
    logger.warn({ err, wordId: id }, "[Image] On-demand generation failed");
    res.status(500).json({
      error: err instanceof Error ? err.message : "Image generation failed",
    });
  }
});

router.get("/words/:id", async (req, res): Promise<void> => {
  const params = GetWordParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [word] = await db
    .select(WORD_LIST_COLUMNS)
    .from(wordsTable)
    .where(eq(wordsTable.id, params.data.id));
  if (!word) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  res.json(GetWordResponse.parse(serializeWordFull(word as typeof wordsTable.$inferSelect)));
});

router.put("/words/:id", async (req, res): Promise<void> => {
  const params = UpdateWordParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateWordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.word) {
    const [dup] = await db
      .select()
      .from(wordsTable)
      .where(sql`lower(trim(${wordsTable.word})) = lower(trim(${parsed.data.word})) AND ${wordsTable.id} != ${params.data.id}`);
    if (dup) {
      res.status(409).json({ error: `Word "${parsed.data.word}" already exists` });
      return;
    }
  }
  const [word] = await db.update(wordsTable).set(parsed.data).where(eq(wordsTable.id, params.data.id)).returning();
  if (!word) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  res.json(UpdateWordResponse.parse(serializeWord(word)));
});

router.delete("/words/:id", async (req, res): Promise<void> => {
  const params = DeleteWordParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [word] = await db.delete(wordsTable).where(eq(wordsTable.id, params.data.id)).returning();
  if (!word) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  // Update lesson word count
  const remaining = await db.select().from(wordsTable).where(eq(wordsTable.lessonId, word.lessonId));
  await db.update(lessonsTable).set({ wordCount: remaining.length }).where(eq(lessonsTable.id, word.lessonId));
  res.sendStatus(204);
});

router.post("/words/:id/translate-example", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid word id" });
    return;
  }
  const [word] = await db.select().from(wordsTable).where(eq(wordsTable.id, id));
  if (!word) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  if (!word.example?.trim()) {
    res.status(400).json({ error: "Word has no example sentence" });
    return;
  }
  if (word.exampleTranslation?.trim()) {
    res.json({ exampleTranslation: word.exampleTranslation });
    return;
  }
  try {
    const exampleTranslation = await ensureExampleTranslation(id);
    res.json({ exampleTranslation: exampleTranslation ?? "" });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Translation failed",
    });
  }
});

router.post("/words/:id/generate-image", async (req, res): Promise<void> => {
  try {
    assertMayGenerateImages(req);
  } catch (err) {
    res.status(403).json({
      error: err instanceof Error ? err.message : "Image generation not allowed",
    });
    return;
  }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid word id" });
    return;
  }
  const [word] = await db
    .select({
      id: wordsTable.id,
      word: wordsTable.word,
      translation: wordsTable.translation,
      example: wordsTable.example,
      // Avoid reading corrupted blobs when generating replacements.
      imageUrl: sql<string | null>`NULL`,
    })
    .from(wordsTable)
    .where(eq(wordsTable.id, id));
  if (!word) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  const imageUrl = await generateAndStoreWordImage(word);
  res.json({ imageUrl });
});

/**
 * Generate a Daniel cream-storybook image for a single card in a NEW student lesson.
 * Free (Pollinations). Curated/frozen curriculum lessons are protected — never regenerated here.
 */
router.post("/words/:id/generate-card-image", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid word id" });
    return;
  }
  const [word] = await db
    .select({
      id: wordsTable.id,
      word: wordsTable.word,
      translation: wordsTable.translation,
      example: wordsTable.example,
      lessonId: wordsTable.lessonId,
      imageUrl: sql<string | null>`NULL`,
    })
    .from(wordsTable)
    .where(eq(wordsTable.id, id));
  if (!word) {
    res.status(404).json({ error: "Word not found" });
    return;
  }

  const [lesson] = await db
    .select({ title: lessonsTable.title })
    .from(lessonsTable)
    .where(eq(lessonsTable.id, word.lessonId));
  if (lesson && CURATED_LESSON_TITLES.has(lesson.title)) {
    res.status(403).json({ error: "Curated curriculum lessons are protected from regeneration." });
    return;
  }

  if (!word.example?.trim()) {
    res.status(400).json({ error: "Word has no example sentence" });
    return;
  }

  const force = req.body?.force === true || req.query.force === "true";
  try {
    await generateAndStoreDanielCardImage(word, { force });
    res.json({ ok: true });
  } catch (err) {
    logger.warn({ err, wordId: id }, "[Image] Daniel card generation failed");
    res.status(500).json({
      error: err instanceof Error ? err.message : "Image generation failed",
    });
  }
});

router.patch("/words/:id/favorite", async (req, res): Promise<void> => {
  const params = ToggleWordFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [existing] = await db.select().from(wordsTable).where(eq(wordsTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Word not found" });
    return;
  }
  const [word] = await db
    .update(wordsTable)
    .set({ isFavorite: !existing.isFavorite })
    .where(eq(wordsTable.id, params.data.id))
    .returning();
  res.json(ToggleWordFavoriteResponse.parse(serializeWord(word)));
});

export default router;
