import { loadLocalScores } from "./pronunciation-progress-store";

/** Shared mastery threshold for pronunciation + quiz + Progress page. */
export const LESSON_PASS_THRESHOLD = 80;

export function mergeScoreMaps(...maps: Map<number, number>[]): Map<number, number> {
  const out = new Map<number, number>();
  for (const map of maps) {
    for (const [id, score] of map) {
      const prev = out.get(id);
      if (prev == null || score > prev) out.set(id, score);
    }
  }
  return out;
}

/** Guest + student local keys — progress survives before/after login. */
export function loadMergedLocalLessonScores(
  studentId: number | null | undefined,
  lessonId: number,
): Map<number, number> {
  return mergeScoreMaps(
    loadLocalScores(null, lessonId),
    loadLocalScores(studentId, lessonId),
  );
}

export interface LessonWordStats {
  mastered: number;
  needsPractice: number;
  practiced: number;
  remaining: number;
  averageScore: number;
  scoreSum: number;
}

export function computeLessonWordStats(
  totalWords: number,
  scores: Map<number, number>,
  threshold = LESSON_PASS_THRESHOLD,
): LessonWordStats {
  let mastered = 0;
  let needsPractice = 0;
  let scoreSum = 0;
  for (const score of scores.values()) {
    scoreSum += score;
    if (score >= threshold) mastered++;
    else needsPractice++;
  }
  const practiced = scores.size;
  const remaining = Math.max(0, totalWords - practiced);
  return {
    mastered,
    needsPractice,
    practiced,
    remaining,
    averageScore: practiced > 0 ? Math.round(scoreSum / practiced) : 0,
    scoreSum,
  };
}

export interface MergedLessonProgress {
  lessonId: number;
  totalWords: number;
  masteredWords: number;
  needsPractice: number;
  remaining: number;
  practiced: number;
  averageScore: number;
}

export function mergeLessonProgress(
  lessonId: number,
  totalWords: number,
  localScores: Map<number, number>,
  serverScores: Map<number, number>,
): MergedLessonProgress {
  const merged = mergeScoreMaps(serverScores, localScores);
  const stats = computeLessonWordStats(totalWords, merged);
  return {
    lessonId,
    totalWords,
    masteredWords: stats.mastered,
    needsPractice: stats.needsPractice,
    remaining: stats.remaining,
    practiced: stats.practiced,
    averageScore: stats.averageScore,
  };
}
