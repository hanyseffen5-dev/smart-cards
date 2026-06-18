/** Curriculum lessons shown first on the lessons page (stable order). */
export const CURRICULUM_LESSON_TITLES = [
  "grade 1",
  "grade 2",
  "grade 3",
  "grade 4",
  "grade 5",
  "Miscellaneous Words",
] as const;

const CURRICULUM_ORDER = new Map(
  CURRICULUM_LESSON_TITLES.map((title, index) => [title, index]),
);

export function curriculumLessonRank(title: string): number {
  return CURRICULUM_ORDER.get(title.trim() as (typeof CURRICULUM_LESSON_TITLES)[number]) ?? 999;
}

export function sortLessonsForDisplay<T extends { title: string; createdAt?: Date | string }>(
  lessons: T[],
): T[] {
  return [...lessons].sort((a, b) => {
    const rankA = curriculumLessonRank(a.title);
    const rankB = curriculumLessonRank(b.title);
    if (rankA !== rankB) return rankA - rankB;
    const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tA - tB;
  });
}
