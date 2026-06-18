import { pgTable, serial, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { wordsTable } from "./words";

export const studentFavoritesTable = pgTable("student_favorites", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  wordId: integer("word_id").notNull().references(() => wordsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  unique("uniq_student_word").on(table.studentId, table.wordId),
]);

export type StudentFavorite = typeof studentFavoritesTable.$inferSelect;
