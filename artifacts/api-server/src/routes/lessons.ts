import { Router, type IRouter } from "express";
import { asc, eq, isNull, and, isNotNull, sql } from "drizzle-orm";
import { db, lessonsTable, wordsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { assertBulkImageGenerationBlocked } from "../lib/imageGenerationGate";
import { isHiddenLessonTitle } from "../lib/hiddenLessons";
import { sortLessonsForDisplay } from "../lib/curriculumLessons";
import { ensureExampleTranslation } from "../lib/exampleTranslation";
import {
  CreateLessonBody,
  GetLessonParams,
  GetLessonResponse,
  GetLessonWordsParams,
  GetLessonWordsResponse,
  GetLessonsResponse,
  DeleteLessonParams,
  CreateWordBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const DANIEL_LESSON_TITLE = "Daniel - The Movie";
const GRADE1_LESSON_TITLE = "grade 1";
const GRADE2_LESSON_TITLE = "grade 2";
const GRADE3_LESSON_TITLE = "grade 3";
const GRADE4_LESSON_TITLE = "grade 4";
const GRADE5_LESSON_TITLE = "grade 5";
const MISC_LESSON_TITLE = "Miscellaneous Words";

/** Curated lessons: stable curriculum order (insertion id), not “images first”. */
function lessonWordsOrderBy(lessonTitle: string) {
  if (
    lessonTitle === DANIEL_LESSON_TITLE ||
    lessonTitle === GRADE1_LESSON_TITLE ||
    lessonTitle === GRADE2_LESSON_TITLE ||
    lessonTitle === GRADE3_LESSON_TITLE ||
    lessonTitle === GRADE4_LESSON_TITLE ||
    lessonTitle === GRADE5_LESSON_TITLE ||
    lessonTitle === MISC_LESSON_TITLE
  ) {
    return [asc(wordsTable.id)];
  }
  return [asc(wordsTable.id)];
}

function serializeLesson(lesson: typeof lessonsTable.$inferSelect) {
  return { ...lesson, createdAt: lesson.createdAt.toISOString() };
}

function serializeWord(word: typeof wordsTable.$inferSelect) {
  // Strip imageUrl from lesson responses — images load lazily per card via /words/:id/image
  return { ...word, imageUrl: null, createdAt: word.createdAt.toISOString() };
}

const LESSON_WORD_COLUMNS = {
  id: wordsTable.id,
  lessonId: wordsTable.lessonId,
  word: wordsTable.word,
  translation: wordsTable.translation,
  // Never pull large image blobs in lesson list/detail queries.
  imageUrl: sql<string | null>`NULL`,
  audioUrl: wordsTable.audioUrl,
  example: wordsTable.example,
  exampleTranslation: wordsTable.exampleTranslation,
  difficulty: wordsTable.difficulty,
  partOfSpeech: wordsTable.partOfSpeech,
  isFavorite: wordsTable.isFavorite,
  createdAt: wordsTable.createdAt,
};

router.get("/lessons", async (_req, res): Promise<void> => {
  const lessons = await db.select().from(lessonsTable).orderBy(lessonsTable.createdAt);
  const visible = sortLessonsForDisplay(lessons.filter((l) => !isHiddenLessonTitle(l.title)));
  res.json(GetLessonsResponse.parse(visible.map(serializeLesson)));
});

router.post("/lessons", async (req, res): Promise<void> => {
  const parsed = CreateLessonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [lesson] = await db.insert(lessonsTable).values({ ...parsed.data, wordCount: 0 }).returning();
  res.status(201).json(GetLessonResponse.parse({ ...serializeLesson(lesson), words: [] }));
});

router.get("/lessons/:id", async (req, res): Promise<void> => {
  const params = GetLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, params.data.id));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  if (isHiddenLessonTitle(lesson.title)) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  const words = await db
    .select(LESSON_WORD_COLUMNS)
    .from(wordsTable)
    .where(eq(wordsTable.lessonId, lesson.id))
    .orderBy(...lessonWordsOrderBy(lesson.title));
  res.json(GetLessonResponse.parse({ ...serializeLesson(lesson), words: words.map(serializeWord) }));
});

router.delete("/lessons/:id", async (req, res): Promise<void> => {
  const params = DeleteLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, params.data.id));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const requestingStudentId = parseInt(req.headers["x-student-id"] as string);
  if (lesson.createdByStudentId && requestingStudentId !== lesson.createdByStudentId) {
    res.status(403).json({ error: "You can only delete your own lessons" });
    return;
  }

  await db.delete(lessonsTable).where(eq(lessonsTable.id, params.data.id));
  res.sendStatus(204);
});

router.get("/lessons/:id/words", async (req, res): Promise<void> => {
  const params = GetLessonWordsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.id));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  if (isHiddenLessonTitle(lesson.title)) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  const words = await db
    .select(LESSON_WORD_COLUMNS)
    .from(wordsTable)
    .where(eq(wordsTable.lessonId, params.data.id))
    .orderBy(...lessonWordsOrderBy(lesson.title));
  res.json(GetLessonWordsResponse.parse(words.map(serializeWord)));
});

/** Delete all stored images for a lesson (no regeneration). */
router.delete("/lessons/:id/images", async (req, res): Promise<void> => {
  const lessonId = parseInt(req.params.id, 10);
  if (Number.isNaN(lessonId)) {
    res.status(400).json({ error: "Invalid lesson id" });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, lessonId));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const cleared = await db
    .update(wordsTable)
    .set({ imageUrl: null })
    .where(eq(wordsTable.lessonId, lessonId))
    .returning({ id: wordsTable.id });

  logger.info({ lessonId, cleared: cleared.length }, "[Images] Cleared lesson images");
  res.json({ lessonId, cleared: cleared.length });
});

/** Fill missing Arabic example translations (text only — no image credits). */
router.post("/lessons/:id/translate-examples", async (req, res): Promise<void> => {
  const lessonId = parseInt(req.params.id, 10);
  if (Number.isNaN(lessonId)) {
    res.status(400).json({ error: "Invalid lesson id" });
    return;
  }
  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, lessonId));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const missing = await db
    .select({ id: wordsTable.id })
    .from(wordsTable)
    .where(
      and(
        eq(wordsTable.lessonId, lessonId),
        isNotNull(wordsTable.example),
        isNull(wordsTable.exampleTranslation),
      ),
    );

  res.json({ lessonId, queued: missing.length });

  if (missing.length === 0) return;

  void (async () => {
    for (const { id } of missing) {
      try {
        await ensureExampleTranslation(id);
        await new Promise((r) => setTimeout(r, 800));
      } catch (err) {
        logger.warn({ err, wordId: id }, "[TranslateExamples] failed");
      }
    }
    logger.info({ lessonId, count: missing.length }, "[TranslateExamples] batch done");
  })();
});

/** Bulk image generation disabled — one card: POST /api/words/:id/generate-image?confirm=true */
router.post("/lessons/:id/generate-images", async (_req, res): Promise<void> => {
  try {
    assertBulkImageGenerationBlocked();
  } catch (err) {
    res.status(403).json({
      error: err instanceof Error ? err.message : "Bulk image generation disabled",
    });
  }
});

router.post("/lessons/:id/append", async (req, res): Promise<void> => {
  const params = GetLessonWordsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, params.data.id));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const requestingStudentId = parseInt(req.headers["x-student-id"] as string);
  if (lesson.createdByStudentId && requestingStudentId !== lesson.createdByStudentId) {
    res.status(403).json({ error: "You can only add words to your own lessons" });
    return;
  }

  const parsed = CreateWordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [word] = await db.insert(wordsTable).values({ ...parsed.data, lessonId: params.data.id }).returning();
  const words = await db.select().from(wordsTable).where(eq(wordsTable.lessonId, params.data.id));
  await db.update(lessonsTable).set({ wordCount: words.length }).where(eq(lessonsTable.id, params.data.id));
  res.status(201).json(serializeWord(word));
});

export default router;
