import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { lessonsTable } from "./lessons";

export const wordsTable = pgTable("words", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id, { onDelete: "cascade" }),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  example: text("example"),
  exampleTranslation: text("example_translation"),
  difficulty: text("difficulty").notNull().default("medium"),
  partOfSpeech: text("part_of_speech"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWordSchema = createInsertSchema(wordsTable).omit({ id: true, createdAt: true });
export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof wordsTable.$inferSelect;
