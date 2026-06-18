import { pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wordsTable } from "./words";
import { studentsTable } from "./students";

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => studentsTable.id, { onDelete: "set null" }),
  wordId: integer("word_id").notNull().references(() => wordsTable.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  attempts: integer("attempts").notNull().default(1),
  lastAttemptAt: timestamp("last_attempt_at").notNull().defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true, lastAttemptAt: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;
