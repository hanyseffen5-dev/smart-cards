import { db, lessonsTable, wordsTable } from "@workspace/db";
import pg from "pg";
import { logger } from "../lib/logger";
import { sql, eq } from "drizzle-orm";

const DEV_DB_URL = "postgresql://postgres:password@helium/heliumdb?sslmode=disable";

interface RemoteLesson {
  id: number;
  title: string;
  text: string;
  word_count: number;
  level: string;
}

interface RemoteWord {
  id: number;
  lesson_id: number;
  word: string;
  translation: string;
  image_url: string | null;
  audio_url: string | null;
  example: string | null;
  example_translation: string | null;
  difficulty: string;
  part_of_speech: string | null;
}

async function syncFromRemote(
  remoteClient: pg.Client,
  label: string
): Promise<void> {
  const { rows: remoteLessons } = await remoteClient.query<RemoteLesson>(
    "SELECT id, title, text, word_count, level FROM lessons ORDER BY id"
  );
  logger.info(`[LessonSync] ${remoteLessons.length} lesson(s) in ${label} DB.`);

  const localLessons = await db
    .select({ id: lessonsTable.id, title: lessonsTable.title })
    .from(lessonsTable);
  const localByTitle = new Map(localLessons.map((l) => [l.title.toLowerCase().trim(), l.id]));

  let lessonsAdded = 0;
  let wordsAdded = 0;

  for (const remoteLesson of remoteLessons) {
    const key = remoteLesson.title.toLowerCase().trim();
    let localLessonId = localByTitle.get(key);

    if (!localLessonId) {
      const [inserted] = await db
        .insert(lessonsTable)
        .values({
          title: remoteLesson.title,
          text: remoteLesson.text,
          wordCount: remoteLesson.word_count,
          level: remoteLesson.level as "all" | "beginner" | "intermediate" | "advanced",
        })
        .returning({ id: lessonsTable.id });
      localLessonId = inserted.id;
      localByTitle.set(key, localLessonId);
      lessonsAdded++;
      logger.info(`[LessonSync] ✓ Added lesson "${remoteLesson.title}" from ${label}`);
    }

    const { rows: remoteWords } = await remoteClient.query<RemoteWord>(
      "SELECT * FROM words WHERE lesson_id = $1 ORDER BY id",
      [remoteLesson.id]
    );
    if (remoteWords.length === 0) continue;

    const localWords = await db
      .select({ word: wordsTable.word })
      .from(wordsTable)
      .where(eq(wordsTable.lessonId, localLessonId));
    const localWordSet = new Set(localWords.map((w) => w.word.toLowerCase().trim()));

    for (const rw of remoteWords) {
      if (localWordSet.has(rw.word.toLowerCase().trim())) continue;

      await db.insert(wordsTable).values({
        lessonId: localLessonId,
        word: rw.word,
        translation: rw.translation,
        imageUrl: rw.image_url,
        audioUrl: rw.audio_url,
        example: rw.example,
        exampleTranslation: rw.example_translation,
        difficulty: rw.difficulty,
        partOfSpeech: rw.part_of_speech,
        isFavorite: false,
      });
      wordsAdded++;
    }
  }

  await db.execute(
    sql`UPDATE lessons SET word_count = (SELECT COUNT(*) FROM words WHERE words.lesson_id = lessons.id)`
  );

  logger.info(
    `[LessonSync] Done syncing from ${label}! ${lessonsAdded} lesson(s) and ${wordsAdded} word(s) added.`
  );
}

export async function syncLessonsFromDev(): Promise<void> {
  const isProd = process.env.NODE_ENV === "production";
  const prodDbUrl = process.env.PROD_DATABASE_URL;

  if (isProd) {
    // Production: sync lessons from dev DB so students see everything
    const devClient = new pg.Client({ connectionString: DEV_DB_URL });
    try {
      await devClient.connect();
      logger.info("[LessonSync] Production — syncing lessons from dev DB...");
      await syncFromRemote(devClient, "dev");
    } catch (err) {
      logger.warn({ err }, "[LessonSync] Cannot reach dev DB — skipping.");
    } finally {
      await devClient.end().catch(() => {});
    }
  } else {
    // Development: sync lessons from production DB so developer sees everything
    if (!prodDbUrl) {
      logger.info("[LessonSync] Dev mode — PROD_DATABASE_URL not set, skipping prod sync.");
      return;
    }
    const prodClient = new pg.Client({ connectionString: prodDbUrl });
    try {
      await prodClient.connect();
      logger.info("[LessonSync] Development — syncing lessons from production DB...");
      await syncFromRemote(prodClient, "production");
    } catch (err) {
      logger.warn({ err }, "[LessonSync] Cannot reach production DB — skipping.");
    } finally {
      await prodClient.end().catch(() => {});
    }
  }
}
