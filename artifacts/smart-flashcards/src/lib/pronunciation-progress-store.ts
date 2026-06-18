// Local fallback store for per-word lesson scores (pronunciation + quiz) so a
// learner's classification (mastered / needs-practice) survives leaving and
// re-entering a lesson, even when not logged in as a student. Scores only ever
// increase (best wins), matching the server's Math.max behavior.

const PREFIX = "pron-progress";

function keyFor(studentId: number | null | undefined, lessonId: number): string {
  return `${PREFIX}:${studentId ?? "guest"}:${lessonId}`;
}

export function loadLocalScores(
  studentId: number | null | undefined,
  lessonId: number,
): Map<number, number> {
  const map = new Map<number, number>();
  if (typeof localStorage === "undefined") return map;
  try {
    const raw = localStorage.getItem(keyFor(studentId, lessonId));
    if (!raw) return map;
    const parsed = JSON.parse(raw) as Record<string, number>;
    for (const [wordId, score] of Object.entries(parsed)) {
      const id = Number(wordId);
      if (Number.isFinite(id) && typeof score === "number") map.set(id, score);
    }
  } catch {
    /* ignore corrupt entries */
  }
  return map;
}

export function saveLocalScore(
  studentId: number | null | undefined,
  lessonId: number,
  wordId: number,
  score: number,
): void {
  if (typeof localStorage === "undefined") return;
  try {
    const map = loadLocalScores(studentId, lessonId);
    const prev = map.get(wordId);
    if (prev != null && prev >= score) return;
    map.set(wordId, score);
    const obj: Record<string, number> = {};
    for (const [id, s] of map) obj[id] = s;
    localStorage.setItem(keyFor(studentId, lessonId), JSON.stringify(obj));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}
