/** Lessons kept in DB but not shown in the app lesson list. */
export const HIDDEN_LESSON_TITLES = new Set([
  "Daniel - The Movie",
  "Miscellaneous Words Part 1",
]);

export function isHiddenLessonTitle(title: string | null | undefined): boolean {
  if (!title) return false;
  return HIDDEN_LESSON_TITLES.has(title.trim());
}
