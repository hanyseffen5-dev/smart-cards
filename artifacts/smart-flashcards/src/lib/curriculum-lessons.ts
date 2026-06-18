export const CURRICULUM_LESSON_TITLES = [
  "grade 1",
  "grade 2",
  "grade 3",
  "grade 4",
  "grade 5",
  "Miscellaneous Words",
] as const;

export type CurriculumLessonTitle = (typeof CURRICULUM_LESSON_TITLES)[number];

const CURRICULUM_TITLE_SET = new Set<string>(CURRICULUM_LESSON_TITLES);

export const CURRICULUM_LESSON_META: Record<
  CurriculumLessonTitle,
  { labelEn: string; labelAr: string; badge: string; badgeEn: string; accent: string }
> = {
  "grade 1": {
    labelEn: "Grade 1",
    labelAr: "المستوى الأول",
    badge: "المستوى ١",
    badgeEn: "G1",
    accent: "from-green-500/15 to-green-600/5 border-green-500/25",
  },
  "grade 2": {
    labelEn: "Grade 2",
    labelAr: "المستوى الثاني",
    badge: "المستوى ٢",
    badgeEn: "G2",
    accent: "from-blue-500/15 to-blue-600/5 border-blue-500/25",
  },
  "grade 3": {
    labelEn: "Grade 3",
    labelAr: "المستوى الثالث",
    badge: "المستوى ٣",
    badgeEn: "G3",
    accent: "from-purple-500/15 to-purple-600/5 border-purple-500/25",
  },
  "grade 4": {
    labelEn: "Grade 4",
    labelAr: "المستوى الرابع",
    badge: "المستوى ٤",
    badgeEn: "G4",
    accent: "from-orange-500/15 to-orange-600/5 border-orange-500/25",
  },
  "grade 5": {
    labelEn: "Grade 5",
    labelAr: "المستوى الخامس",
    badge: "المستوى ٥",
    badgeEn: "G5",
    accent: "from-rose-500/15 to-rose-600/5 border-rose-500/25",
  },
  "Miscellaneous Words": {
    labelEn: "Miscellaneous Words",
    labelAr: "كلمات متنوعة",
    badge: "متنوعة",
    badgeEn: "Misc",
    accent: "from-amber-500/15 to-amber-600/5 border-amber-500/25",
  },
};

export function isCurriculumLessonTitle(title: string): title is CurriculumLessonTitle {
  return CURRICULUM_TITLE_SET.has(title.trim());
}

export function curriculumLessonEn(title: string): string | null {
  return isCurriculumLessonTitle(title) ? CURRICULUM_LESSON_META[title].labelEn : null;
}

export function curriculumLessonAr(title: string): string | null {
  return isCurriculumLessonTitle(title) ? CURRICULUM_LESSON_META[title].labelAr : null;
}

export function partitionLessons<T extends { title: string }>(lessons: T[]) {
  const byTitle = new Map(lessons.map((l) => [l.title.trim(), l]));
  const curriculum = CURRICULUM_LESSON_TITLES.map((title) => byTitle.get(title)).filter(
    (l): l is T => l != null,
  );
  const other = lessons.filter((l) => !isCurriculumLessonTitle(l.title));
  return { curriculum, other };
}
