import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, progressTable, wordsTable, lessonsTable } from "@workspace/db";
import {
  RecordProgressBody,
  GetProgressQueryParams,
  GetProgressResponse,
  GetProgressStatsQueryParams,
  GetProgressStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeProgress(p: typeof progressTable.$inferSelect & { word?: string | null }) {
  return {
    ...p,
    lastAttemptAt: p.lastAttemptAt.toISOString(),
    word: p.word ?? null,
  };
}

router.get("/progress", async (req, res): Promise<void> => {
  const params = GetProgressQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const query = db
    .select({
      id: progressTable.id,
      studentId: progressTable.studentId,
      wordId: progressTable.wordId,
      score: progressTable.score,
      attempts: progressTable.attempts,
      lastAttemptAt: progressTable.lastAttemptAt,
      word: wordsTable.word,
    })
    .from(progressTable)
    .leftJoin(wordsTable, eq(progressTable.wordId, wordsTable.id));

  let results;
  if (params.data.studentId != null) {
    results = await query.where(eq(progressTable.studentId, params.data.studentId));
  } else {
    results = await query;
  }

  res.json(GetProgressResponse.parse(results.map(serializeProgress)));
});

router.post("/progress", async (req, res): Promise<void> => {
  const parsed = RecordProgressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Check if progress record exists for this student+word
  const studentId = parsed.data.studentId ?? null;
  let existingRecord;
  if (studentId != null) {
    [existingRecord] = await db
      .select()
      .from(progressTable)
      .where(and(eq(progressTable.studentId, studentId), eq(progressTable.wordId, parsed.data.wordId)));
  } else {
    [existingRecord] = await db
      .select()
      .from(progressTable)
      .where(eq(progressTable.wordId, parsed.data.wordId));
  }

  let record;
  if (existingRecord) {
    // Keep the best score the student ever achieved for this word. Re-training can
    // only raise the score toward 100 — a saved mastery is never lowered or erased.
    const bestScore = Math.max(existingRecord.score, parsed.data.score);
    [record] = await db
      .update(progressTable)
      .set({
        score: bestScore,
        attempts: existingRecord.attempts + 1,
        lastAttemptAt: new Date(),
      })
      .where(eq(progressTable.id, existingRecord.id))
      .returning();
  } else {
    [record] = await db
      .insert(progressTable)
      .values({
        studentId: parsed.data.studentId ?? null,
        wordId: parsed.data.wordId,
        score: parsed.data.score,
        attempts: 1,
      })
      .returning();
  }

  const [wordData] = await db.select({ word: wordsTable.word }).from(wordsTable).where(eq(wordsTable.id, record.wordId));
  res.status(201).json(serializeProgress({ ...record, word: wordData?.word ?? null }));
});

router.get("/progress/stats", async (req, res): Promise<void> => {
  const params = GetProgressStatsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const studentId = params.data.studentId ?? null;

  // Get all progress records with word info
  const progressQuery = db
    .select({
      id: progressTable.id,
      studentId: progressTable.studentId,
      wordId: progressTable.wordId,
      score: progressTable.score,
      attempts: progressTable.attempts,
      lastAttemptAt: progressTable.lastAttemptAt,
      word: wordsTable.word,
      lessonId: wordsTable.lessonId,
    })
    .from(progressTable)
    .leftJoin(wordsTable, eq(progressTable.wordId, wordsTable.id));

  let progressRecords;
  if (studentId != null) {
    progressRecords = await progressQuery.where(eq(progressTable.studentId, studentId));
  } else {
    progressRecords = await progressQuery;
  }

  const totalWords = progressRecords.length;
  const masteredWords = progressRecords.filter(p => p.score >= 80).length;
  const avgScore = totalWords > 0 ? progressRecords.reduce((s, p) => s + p.score, 0) / totalWords : 0;
  const totalAttempts = progressRecords.reduce((s, p) => s + p.attempts, 0);

  // Recent activity (last 10)
  const recentActivity = [...progressRecords]
    .sort((a, b) => new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime())
    .slice(0, 10)
    .map(p => serializeProgress({ ...p, word: p.word ?? null }));

  // Lesson-level progress
  const lessons = await db.select().from(lessonsTable);
  const lessonProgress = lessons.map(lesson => {
    const lessonWords = progressRecords.filter(p => p.lessonId === lesson.id);
    const lAvg = lessonWords.length > 0
      ? lessonWords.reduce((s, p) => s + p.score, 0) / lessonWords.length
      : 0;
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      totalWords: lesson.wordCount,
      masteredWords: lessonWords.filter(p => p.score >= 80).length,
      averageScore: Math.round(lAvg),
    };
  });

  const stats = {
    totalWords,
    masteredWords,
    averageScore: Math.round(avgScore),
    totalAttempts,
    recentActivity,
    lessonProgress,
  };

  res.json(GetProgressStatsResponse.parse(stats));
});

export default router;
