/**
 * Guard writes to frozen curriculum lessons (grade 1–5 + Miscellaneous Words).
 * Set GRADE123_DB_WRITE_CONFIRMED=1 (or CURRICULUM_DB_WRITE_CONFIRMED=1)
 * only after the user explicitly answers نعم in chat.
 */
export const GRADE_CURRICULUM_TITLES = [
  "grade 1",
  "grade 2",
  "grade 3",
  "grade 4",
  "grade 5",
];

export const MISC_LESSON_TITLE = "Miscellaneous Words";

/** All six lessons shown on the curriculum page — frozen by default. */
export const PROTECTED_LESSON_TITLES = [...GRADE_CURRICULUM_TITLES, MISC_LESSON_TITLE];

/** Alias for UI / docs */
export const CURRICULUM_LESSON_TITLES = PROTECTED_LESSON_TITLES;

export const GRADE4_LESSON_TITLE = "grade 4";
export const GRADE5_LESSON_TITLE = "grade 5";

/** Expected card counts after a full restore (read-only audit). */
export const CURRICULUM_LESSON_EXPECTED_COUNTS = {
  "grade 1": 300,
  "grade 2": 600,
  "grade 3": 800,
  "grade 4": 1000,
  "grade 5": 1500,
  [MISC_LESSON_TITLE]: 195,
};

export function isProtectedLessonTitle(title) {
  if (!title) return false;
  return PROTECTED_LESSON_TITLES.includes(String(title).trim());
}

export function curriculumWriteBlocked() {
  return (
    process.env.GRADE123_DB_WRITE_CONFIRMED !== "1" &&
    process.env.CURRICULUM_DB_WRITE_CONFIRMED !== "1"
  );
}

/** @deprecated alias */
export function grade123WriteBlocked() {
  return curriculumWriteBlocked();
}

/** Block whole-lesson scripts (seed / bulk restore / apply) for frozen curriculum. */
export function assertGrade123WriteAllowed(reason = "database write") {
  if (!curriculumWriteBlocked()) return;
  console.error(`
[protect] Blocked: ${reason} for frozen curriculum lessons:
  grade 1 · grade 2 · grade 3 · grade 4 · grade 5 · Miscellaneous Words

  These lessons are frozen. The user must confirm in chat (نعم) before any change.

  To proceed after explicit approval:
    GRADE123_DB_WRITE_CONFIRMED=1 node scripts/<script>.mjs ...
    (or CURRICULUM_DB_WRITE_CONFIRMED=1)

  Read-only checks (audit, show-card, snapshot) do not need this flag.
`);
  process.exit(1);
}

/** Alias */
export const assertCurriculumWriteAllowed = assertGrade123WriteAllowed;

export function wordHasStoredImage(row) {
  return Boolean(row?.image_url && String(row.image_url).length > 100);
}

/** @deprecated Use assertGrade123WriteAllowed once at script start. */
export async function assertGrade4ExistingCardWriteAllowed(_client, _lessonId, _word) {
  assertGrade123WriteAllowed("grade 4 card write");
}
