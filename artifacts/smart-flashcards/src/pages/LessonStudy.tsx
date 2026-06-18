import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  useGetLesson,
  useGetFavorites,
  useRecordProgress,
  useAnalyzeText,
  useCreateWord,
  useGetWords,
  useGetProgress,
  getGetProgressQueryKey,
  getGetProgressStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useStudent } from "../lib/use-student";
import { loadLocalScores, saveLocalScore } from "../lib/pronunciation-progress-store";
import { useFavoriteToggle } from "../lib/use-favorite-toggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronDown, Volume2, Star, Shuffle,
  BookOpen, ClipboardCheck, Sparkles, Loader2, Copy, Check, Trophy,
  CheckCircle2, Target,
} from "lucide-react";
import type { Word } from "@workspace/api-client-react";
import { apiFetch } from "../lib/api-fetch";
import { WordImage } from "@/components/WordImage";
import { usePrefetchWordImages } from "@/hooks/use-prefetch-word-images";
import { IMAGE_CACHE_VERSION } from "@/lib/image-cache-version";

const QUIZ_PASS_THRESHOLD = 80;
const QUIZ_CORRECT_SCORE = 100;
const QUIZ_WRONG_SCORE = 30;

type QuizSessionMode = "weak" | "mastered" | "all";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Curriculum lessons store Arabic example sentences in the DB — no live translate on flip. */
const PREFILLED_EXAMPLE_LESSONS = new Set([
  "grade 1",
  "grade 2",
  "grade 3",
  "grade 4",
  "grade 5",
  "Miscellaneous Words",
]);

const DIFFICULTY_BADGE: Record<string, { en: string; ar: string; color: string }> = {
  easy:     { en: "Beginner",  ar: "مبتدئ",  color: "bg-green-500/80 text-white" },
  medium:   { en: "Intermediate", ar: "متوسط", color: "bg-blue-500/80 text-white" },
  hard:     { en: "Advanced",  ar: "متقدم",  color: "bg-purple-500/80 text-white" },
};


function usePinchZoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const lastDistRef = useRef<number | null>(null);
  const isPinchingRef = useRef(false);
  const lastTapRef = useRef<number>(0);

  const resetZoom = useCallback(() => setScale(1), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinchingRef.current = true;
        lastDistRef.current = getDistance(e.touches);
        e.preventDefault();
      } else if (e.touches.length === 1) {
        // detect double-tap to reset zoom
        const now = Date.now();
        if (now - lastTapRef.current < 300 && scale > 1) {
          setScale(1);
        }
        lastTapRef.current = now;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastDistRef.current !== null) {
        e.preventDefault();
        const dist = getDistance(e.touches);
        const ratio = dist / lastDistRef.current;
        setScale((prev) => Math.min(3, Math.max(1, prev * ratio)));
        lastDistRef.current = dist;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastDistRef.current = null;
        // short delay so click handler can check isPinchingRef
        setTimeout(() => { isPinchingRef.current = false; }, 150);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  return { containerRef, scale, isPinchingRef, resetZoom };
}

function FlashCard({
  word,
  isFavorite,
  onToggleFavorite,
  favoriteTogglePending = false,
  prefilledExampleTranslation = false,
}: {
  word: Word;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  favoriteTogglePending?: boolean;
  prefilledExampleTranslation?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const serverExampleAr = word.exampleTranslation?.trim() || null;
  const [localExampleAr, setLocalExampleAr] = useState<string | null>(null);
  const [translatingExample, setTranslatingExample] = useState(false);
  const [translateError, setTranslateError] = useState(false);
  const [exampleCopied, setExampleCopied] = useState(false);
  const exampleArShown = serverExampleAr || localExampleAr;
  const { containerRef, scale, isPinchingRef, resetZoom } = usePinchZoom();

  useEffect(() => {
    setLocalExampleAr(null);
    setTranslateError(false);
    setExampleCopied(false);
    setIsFlipped(false);
  }, [word.id]);

  const copyExampleSentence = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = word.example?.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setExampleCopied(true);
      window.setTimeout(() => setExampleCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setExampleCopied(true);
      window.setTimeout(() => setExampleCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (prefilledExampleTranslation || !isFlipped || !word.example?.trim() || exampleArShown) return;
    let cancelled = false;
    setTranslatingExample(true);
    setTranslateError(false);
    void apiFetch(`/api/words/${word.id}/translate-example`, { method: "POST" })
      .then(async (res) => {
        if (!res.ok) {
          if (!cancelled) setTranslateError(true);
          return;
        }
        const data = (await res.json()) as { exampleTranslation?: string };
        if (!cancelled && data.exampleTranslation?.trim()) {
          setLocalExampleAr(data.exampleTranslation.trim());
        }
      })
      .finally(() => {
        if (!cancelled) setTranslatingExample(false);
      });
    return () => {
      cancelled = true;
    };
  }, [prefilledExampleTranslation, isFlipped, word.id, word.example, exampleArShown]);

  const speak = async () => {
    if (speaking) return;
    setSpeaking(true);
    try {
      const res = await apiFetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.word, example: word.example }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = 0.82; // slightly slow for clearer learning
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  };

  return (
    <div className="relative w-full select-none" style={{ height: "clamp(420px, 70vw, 560px)" }}>
      {/* Zoom reset hint */}
      {scale > 1.05 && (
        <button
          onClick={(e) => { e.stopPropagation(); resetZoom(); }}
          className="absolute top-2 left-2 z-20 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
        >
          🔍 إعادة الحجم
        </button>
      )}
      <div
        ref={containerRef}
        className="cursor-pointer w-full h-full"
        style={{
          perspective: "1000px",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          transition: scale === 1 ? "transform 0.2s ease" : "none",
          willChange: "transform",
        }}
        onClick={() => {
          if (isPinchingRef.current || scale > 1.05) return;
          setIsFlipped(!isFlipped);
        }}
      >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front face — illustration only */}
        <div
          className={`absolute inset-0 rounded-3xl shadow-lg flex flex-col items-stretch p-3 sm:p-4 transition-all ${isFavorite ? "bg-card border-2 border-yellow-400 shadow-yellow-200" : "bg-card border-2 border-primary/20"}`}
          style={{ backfaceVisibility: "hidden", pointerEvents: isFlipped ? "none" : "auto" }}
        >
          {isFavorite && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
              <Star size={11} fill="currentColor" />
              Favorite
              <span className="text-[9px] font-normal opacity-80" dir="rtl">مفضلة</span>
            </div>
          )}
          <div className="absolute inset-x-4 top-4 bottom-14 flex items-center justify-center">
            <WordImage
              word={word}
              size="card"
              priority
              className="h-[66%] w-auto max-w-[85%] mx-auto"
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 z-10 text-center text-sm sm:text-base text-muted-foreground pointer-events-none">
            Tap to reveal
            <span className="block text-[11px]" dir="rtl">اضغط للكشف</span>
          </p>
          {(() => {
            const badge = DIFFICULTY_BADGE[word.difficulty];
            return badge ? (
              <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color} text-center`}>
                {badge.en}
                <span className="block text-[8px] font-normal opacity-80" dir="rtl">{badge.ar}</span>
              </span>
            ) : null;
          })()}
        </div>

        {/* Back face — text vertically centered */}
        <div
          className={`absolute inset-0 rounded-3xl text-primary-foreground shadow-lg flex flex-col items-center justify-center overflow-y-auto p-4 sm:p-6 ${isFavorite ? "bg-gradient-to-br from-yellow-500 to-amber-500" : "bg-gradient-to-br from-primary to-primary/80"}`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: isFlipped ? "auto" : "none",
          }}
        >
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 w-full max-w-md my-auto py-2">
          <div className="flex items-center gap-2">
            <p className="font-black text-4xl sm:text-5xl drop-shadow-sm">{word.word}</p>
            {isFavorite && <Star size={26} fill="white" className="text-white drop-shadow" />}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {word.partOfSpeech && (
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium">{word.partOfSpeech}</span>
            )}
            {(() => {
              const badge = DIFFICULTY_BADGE[word.difficulty];
              return badge ? (
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-bold">{badge.label}</span>
              ) : null;
            })()}
          </div>
          <p className="text-2xl sm:text-3xl font-semibold opacity-90 text-center" dir="rtl">{word.translation}</p>
          {word.example && (
            <div className="flex flex-col items-center gap-1.5 px-2 w-full">
              <div
                className="flex items-start justify-center gap-1 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <p
                  className="text-sm sm:text-base opacity-90 text-center italic line-clamp-3 flex-1 min-w-0"
                  dir="ltr"
                >
                  &ldquo;{word.example}&rdquo;
                </p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 w-8 h-8 rounded-full text-primary-foreground hover:bg-white/20"
                  title={exampleCopied ? "تم النسخ" : "نسخ الجملة الإنجليزية"}
                  aria-label="نسخ الجملة الإنجليزية"
                  onClick={copyExampleSentence}
                >
                  {exampleCopied ? (
                    <Check size={16} className="text-green-200" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>
              {exampleArShown ? (
                <p
                  className="text-sm sm:text-base text-center font-semibold opacity-95 leading-relaxed shrink-0"
                  dir="rtl"
                >
                  &ldquo;{exampleArShown}&rdquo;
                </p>
              ) : prefilledExampleTranslation ? null : translatingExample ? (
                <p className="text-xs opacity-60 shrink-0" dir="rtl">
                  جاري ترجمة الجملة…
                </p>
              ) : translateError ? (
                <p className="text-xs opacity-70 text-center shrink-0" dir="rtl">
                  تعذّرت الترجمة — حاول قلب البطاقة مرة أخرى
                </p>
              ) : null}
            </div>
          )}
          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full text-primary-foreground hover:bg-white/20"
              onClick={speak}
              disabled={speaking}
            >
              {speaking ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={favoriteTogglePending}
              className={`w-10 h-10 rounded-full transition-all ${isFavorite ? "bg-white/30 text-white hover:bg-white/40" : "text-primary-foreground hover:bg-white/20"}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(word.id);
              }}
            >
              <Star size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
            </Button>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function QuizWordImage({ word }: { word: Word }) {
  return <WordImage word={word} size="medium" priority />;
}

function buildChoices(word: Word, allWords: Word[]): string[] {
  const others = allWords.filter((w) => w.id !== word.id);
  return shuffle([word.word, ...shuffle(others).slice(0, 3).map((w) => w.word)]);
}

/** One shuffle for queue + first question — choices must match queue[0], not practiceWords[0]. */
function createShuffledQuiz(practiceWords: Word[], allWords: Word[]) {
  const queue = shuffle([...practiceWords]);
  return {
    queue,
    choices: queue[0] ? buildChoices(queue[0], allWords) : [],
  };
}

function wordNeedsQuizPractice(wordId: number, savedScores: Map<number, number>): boolean {
  const score = savedScores.get(wordId);
  return score == null || score < QUIZ_PASS_THRESHOLD;
}

function QuizMasteredPanel({
  masteredWords,
  savedScores,
  totalWords,
  expanded,
  onToggle,
  onReviewMastered,
  onReviewAll,
  onReviewWord,
  compact,
}: {
  masteredWords: Word[];
  savedScores: Map<number, number>;
  totalWords: number;
  expanded: boolean;
  onToggle: () => void;
  onReviewMastered: () => void;
  onReviewAll: () => void;
  onReviewWord: (word: Word) => void;
  compact?: boolean;
}) {
  if (masteredWords.length === 0) return null;

  return (
    <div className={`rounded-2xl border bg-emerald-500/5 border-emerald-500/20 ${compact ? "p-3" : "p-4"} space-y-3`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={16} />
          Mastered ({masteredWords.length})
          <span className="text-[11px] font-normal" dir="rtl">متقنة ({masteredWords.length})</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <ul className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {masteredWords.map((w) => {
            const score = savedScores.get(w.id) ?? QUIZ_PASS_THRESHOLD;
            return (
              <li
                key={w.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-background/80 border px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <span className="font-semibold">{w.word}</span>
                  <span className="text-muted-foreground mx-1.5">·</span>
                  <span dir="rtl" className="text-muted-foreground">{w.translation}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {score}%
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => onReviewWord(w)}
                  >
                    <Target size={12} className="mr-1" />
                    Review
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className={`flex flex-wrap gap-2 ${compact ? "" : "pt-1"}`}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
          onClick={onReviewMastered}
        >
          <Target size={14} className="mr-1.5" />
          Review mastered ({masteredWords.length})
          <span className="block text-[10px] font-normal w-full" dir="rtl">راجع المتقنة</span>
        </Button>
        {masteredWords.length < totalWords && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl"
            onClick={onReviewAll}
          >
            Full lesson ({totalWords})
            <span className="block text-[10px] font-normal w-full" dir="rtl">اختبار كامل</span>
          </Button>
        )}
      </div>
    </div>
  );
}

function QuizMode({
  allWords,
  practiceWords,
  studentId,
  savedScores,
  onScoreSaved,
  onFinish,
}: {
  allWords: Word[];
  practiceWords: Word[];
  studentId?: number | null;
  savedScores: Map<number, number>;
  onScoreSaved: (wordId: number, score: number) => void;
  onFinish: (score: number, stats: { sessionTotal: number; sessionCorrect: number }) => void;
}) {
  const recordProgress = useRecordProgress();

  const sessionTotal = practiceWords.length;
  const [quizDeck] = useState(() => createShuffledQuiz(practiceWords, allWords));
  const [queue, setQueue] = useState<Word[]>(quizDeck.queue);
  const [firstAttempts, setFirstAttempts] = useState<Map<number, boolean>>(new Map());
  const [selected, setSelected] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>(quizDeck.choices);

  const word = queue[0];

  const persistScore = (wordId: number, correct: boolean) => {
    const score = correct ? QUIZ_CORRECT_SCORE : QUIZ_WRONG_SCORE;
    const prev = savedScores.get(wordId);
    onScoreSaved(wordId, score);
    // Server keeps best score (Math.max) — only sync when the score can improve.
    if (prev == null || score > prev) {
      recordProgress.mutate({
        data: { wordId, score, studentId: studentId ?? null },
      });
    }
  };

  const handleAnswer = (choice: string) => {
    if (selected || !word) return;
    setSelected(choice);
    const correct = choice === word.word;

    persistScore(word.id, correct);

    if (!firstAttempts.has(word.id)) {
      setFirstAttempts((prev) => new Map(prev).set(word.id, correct));
    }

    setTimeout(() => {
      const remaining = queue.slice(1);
      if (!correct) remaining.push(word);

      if (remaining.length === 0) {
        const correctOnFirstTry = [...firstAttempts.entries()].filter(([, v]) => v).length
          + (correct && !firstAttempts.has(word.id) ? 1 : 0);
        const score = sessionTotal > 0
          ? Math.round((correctOnFirstTry / sessionTotal) * 100)
          : 100;
        onFinish(score, { sessionTotal, sessionCorrect: correctOnFirstTry });
        return;
      }

      setQueue(remaining);
      setChoices(buildChoices(remaining[0], allWords));
      setSelected(null);
    }, 1200);
  };

  if (sessionTotal === 0) return null;
  if (!word) return null;

  const answeredCorrectly = [...firstAttempts.values()].filter(Boolean).length;
  const progressPct = sessionTotal > 0 ? (firstAttempts.size / sessionTotal) * 100 : 100;
  const retries = queue.length - (sessionTotal - firstAttempts.size);

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {firstAttempts.size} / {sessionTotal}
          {retries > 0 ? (
            <span className="text-orange-500 ml-1">
              · {retries} retry{retries !== 1 ? "ies" : ""}
              <span className="block text-[10px]" dir="rtl">{retries} إعادة</span>
            </span>
          ) : null}
        </span>
        <div className="flex-1 bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-green-600">{answeredCorrectly} ✓</span>
      </div>

      <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 flex flex-col items-center space-y-4">
        <QuizWordImage word={word} />
        <p className="text-xl font-semibold" dir="rtl">{word.translation}</p>
        <p className="text-sm text-muted-foreground">What is this word in English?</p>
        <p className="text-[11px] text-muted-foreground" dir="rtl">ما هي هذه الكلمة بالإنجليزية؟</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          let cls = "bg-card border-2 border-border hover:border-primary text-foreground cursor-pointer";
          if (selected) {
            if (choice === word.word) cls = "bg-green-100 border-2 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            else if (choice === selected) cls = "bg-red-100 border-2 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            else cls = "bg-card border-2 border-border opacity-40 text-foreground cursor-default";
          }
          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={!!selected}
              className={`p-4 rounded-xl text-center font-semibold transition-colors ${cls}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={`text-center text-sm font-semibold py-2 rounded-xl ${selected === word.word ? "text-green-600" : "text-orange-500"}`}>
          {selected === word.word ? (
            <>
              ✓ Correct!
              <span className="block text-[11px] font-normal" dir="rtl">إجابة صحيحة!</span>
            </>
          ) : (
            <>
              ✗ Correct answer: {word.word} — will return later
              <span className="block text-[11px] font-normal" dir="rtl">ستعود لاحقاً للتدريب</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function LessonStudy() {
  const params = useParams();
  const lessonId = parseInt(params.id || "0", 10);
  const { data: lesson, isLoading } = useGetLesson(lessonId);
  const { student } = useStudent();
  const studentId = student?.id;
  const { toggle: toggleFavorite, isPending: favoriteTogglePending } =
    useFavoriteToggle(studentId);
  const { data: favorites } = useGetFavorites(
    { studentId: studentId ?? 0 },
    { query: { enabled: studentId != null } },
  );
  const favoriteWordIds = new Set(favorites?.map((f) => f.wordId) ?? []);

  const [mode, setMode] = useState<"study" | "quiz" | "results">(() => {
    // Deep-link support: /lessons/:id?mode=quiz opens the quiz directly
    // (used by the Progress page cards).
    if (typeof window === "undefined") return "study";
    return new URLSearchParams(window.location.search).get("mode") === "quiz"
      ? "quiz"
      : "study";
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSessionKey, setQuizSessionKey] = useState(0);
  const [quizSessionMode, setQuizSessionMode] = useState<QuizSessionMode>("weak");
  const [quizCustomWords, setQuizCustomWords] = useState<Word[] | null>(null);
  const [quizMasteredExpanded, setQuizMasteredExpanded] = useState(false);
  const [quizSessionStats, setQuizSessionStats] = useState({ sessionTotal: 0, sessionCorrect: 0 });
  const [localScoreMap, setLocalScoreMap] = useState<Map<number, number>>(() => new Map());
  const [extraText, setExtraText] = useState("");
  const [addingText, setAddingText] = useState(false);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [extractedCount, setExtractedCount] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const analyzeText = useAnalyzeText();
  const createWord = useCreateWord();
  const { data: allWords } = useGetWords();

  const progressParams = student?.id != null ? { studentId: student.id } : undefined;
  const { data: savedProgress, isLoading: progressLoading } = useGetProgress(
    progressParams,
    { query: { enabled: student?.id != null } },
  );
  const progressReady = student?.id == null || !progressLoading;

  useEffect(() => {
    if (lessonId > 0) {
      setLocalScoreMap(loadLocalScores(student?.id ?? null, lessonId));
    }
  }, [lessonId, student?.id]);

  const savedScoreByWordId = useMemo(() => {
    const map = new Map<number, number>();
    const lessonWordIds = new Set((lesson?.words ?? []).map((w) => w.id));
    for (const p of savedProgress ?? []) {
      if (!lessonWordIds.has(p.wordId)) continue;
      const prev = map.get(p.wordId);
      if (prev == null || p.score > prev) map.set(p.wordId, p.score);
    }
    for (const [wordId, score] of localScoreMap) {
      if (!lessonWordIds.has(wordId)) continue;
      const prev = map.get(wordId);
      if (prev == null || score > prev) map.set(wordId, score);
    }
    return map;
  }, [savedProgress, localScoreMap, lesson?.words]);

  const handleQuizScoreSaved = useCallback((wordId: number, score: number) => {
    saveLocalScore(student?.id ?? null, lessonId, wordId, score);
    setLocalScoreMap((prev) => {
      const next = new Map(prev);
      const old = next.get(wordId);
      if (old == null || score > old) next.set(wordId, score);
      return next;
    });
    if (student?.id != null) {
      queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey(progressParams) });
      queryClient.invalidateQueries({ queryKey: getGetProgressStatsQueryKey(progressParams) });
    }
  }, [lessonId, student?.id, queryClient, progressParams]);

  const quizWeakWords = useMemo(() => {
    return (lesson?.words ?? []).filter((w) => wordNeedsQuizPractice(w.id, savedScoreByWordId));
  }, [lesson?.words, savedScoreByWordId]);

  const quizMasteredWords = useMemo(() => {
    return (lesson?.words ?? []).filter((w) => !wordNeedsQuizPractice(w.id, savedScoreByWordId));
  }, [lesson?.words, savedScoreByWordId]);

  const quizMasteredCount = quizMasteredWords.length;

  const quizPracticeWords = useMemo(() => {
    if (quizCustomWords?.length) return shuffle([...quizCustomWords]);
    let pool: Word[];
    if (quizSessionMode === "mastered") pool = quizMasteredWords;
    else if (quizSessionMode === "all") pool = lesson?.words ?? [];
    else pool = quizWeakWords;
    return shuffle([...pool]);
  }, [quizCustomWords, quizSessionMode, quizMasteredWords, quizWeakWords, lesson?.words, quizSessionKey]);

  const startQuiz = useCallback((sessionMode: QuizSessionMode = "weak", customWords?: Word[]) => {
    setQuizSessionMode(sessionMode);
    setQuizCustomWords(customWords ?? null);
    setQuizSessionKey((k) => k + 1);
    setQuizMasteredExpanded(false);
    setMode("quiz");
  }, []);

  // ── Loading progress bar ─────────────────────────────────────────────────────
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Animate 0 → 88% while waiting for the API response
      setProgress(0);
      setShowLoader(true);
      progressTimer.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 88) { clearInterval(progressTimer.current!); return 88; }
          return p + 3;
        });
      }, 60);
    } else {
      // Lesson loaded — finish the bar
      clearInterval(progressTimer.current!);
      setProgress(100);
      const t = setTimeout(() => setShowLoader(false), 500);
      return () => clearTimeout(t);
    }
    return () => clearInterval(progressTimer.current!);
  }, [isLoading]);

  const isOwnLesson = lesson?.createdByStudentId != null && lesson.createdByStudentId === student?.id;
  const prefilledExampleTranslation = PREFILLED_EXAMPLE_LESSONS.has(lesson?.title ?? "");
  const allLessonWords = lesson?.words ?? [];
  const filteredWords = allLessonWords;
  const words = isShuffled ? shuffledWords : filteredWords;

  useEffect(() => {
    if (!lesson || !prefilledExampleTranslation) return;
    const hasMissing = (lesson.words ?? []).some(
      (w) => w.example?.trim() && !w.exampleTranslation?.trim(),
    );
    if (!hasMissing) return;
    void apiFetch(`/api/lessons/${lesson.id}/translate-examples`, { method: "POST" });
  }, [lesson, prefilledExampleTranslation]);

  usePrefetchWordImages(
    words.map((w) => w.id),
    currentIndex,
  );

  const handleToggleFavorite = (wordId: number) => {
    toggleFavorite(wordId);
  };

  const handleShuffle = () => {
    if (!isShuffled && filteredWords.length > 0) {
      setShuffledWords(shuffle(filteredWords));
    }
    setIsShuffled(!isShuffled);
    setCurrentIndex(0);
  };

  const handleAddText = async () => {
    if (!lesson || !extraText.trim()) return;
    setAddingText(true);
    try {
      // Build a set of ALL existing words across all lessons (system-wide)
      const allWordNames = (allWords ?? []).map((w) => w.word.toLowerCase().trim());
      const result = await analyzeText.mutateAsync({
        data: {
          text: extraText,
          level: lesson.level === "all" ? (student?.level ?? "beginner") : lesson.level,
          lessonTitle: lesson.title,
          existingWords: allWordNames,
        } as any,
      });
      // Double-check client-side: filter out any duplicates the AI may have missed
      const existingSet = new Set(allWordNames);
      const newWords = result.words.filter((w) => !existingSet.has(w.word.toLowerCase().trim()));
      setExtractedCount(newWords.length);
      for (const w of newWords) {
        await new Promise<void>((resolve) => {
          createWord.mutate(
            {
              data: {
                lessonId: lesson.id,
                word: w.word,
                translation: w.translation,
                example: w.example,
                difficulty: w.difficulty,
                partOfSpeech: w.partOfSpeech,
                imageUrl: w.imageUrl ?? null,
                audioUrl: null,
              },
            },
            { onSuccess: () => resolve(), onError: () => resolve() }
          );
        });
      }
      setExtraText("");
      setAddPanelOpen(false);
      setLocation(`/lessons/${lesson.id}`);
    } finally {
      setAddingText(false);
    }
  };

  if (showLoader) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-8">
        <div className="text-center space-y-1">
          <div className="text-5xl mb-3">📚</div>
          <h2 className="text-xl font-bold text-foreground">Loading flashcards</h2>
          <p className="text-sm text-muted-foreground">
            {progress < 100 ? "Loading lesson..." : "Ready! ✓"}
            <span className="block text-[11px]" dir="rtl">
              {progress < 100 ? "جارٍ تحميل الدرس..." : "جاهز! ✓"}
            </span>
          </p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%)",
              }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              {progress < 50 ? "Loading lesson data..." : progress < 100 ? "Preparing cards..." : "Complete"}
              <span className="block text-[10px]" dir="rtl">
                {progress < 50 ? "تحميل بيانات الدرس..." : progress < 100 ? "تجهيز البطاقات..." : "اكتمل التحميل"}
              </span>
            </span>
            <span className="font-bold text-primary text-base">{progress}%</span>
          </div>
        </div>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">Lesson not found</p>
        <Button variant="outline" className="mt-4" onClick={() => setLocation("/lessons")}>
          Back to Lessons
        </Button>
      </div>
    );
  }

  if (!lesson.words || lesson.words.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <BookOpen className="mx-auto text-muted-foreground" size={48} />
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        <p className="text-muted-foreground">This lesson has no words yet.</p>
        <Button variant="outline" onClick={() => setLocation("/lessons")}>
          Back to Lessons
        </Button>
      </div>
    );
  }

  if (filteredWords.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <BookOpen className="mx-auto text-muted-foreground" size={48} />
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        <p className="text-muted-foreground">
          No words in this lesson yet.
          <span className="block text-[11px]" dir="rtl">لا توجد كلمات في هذا الدرس بعد.</span>
        </p>
        <Button variant="outline" onClick={() => setLocation("/lessons")} className="flex flex-col h-auto py-2 gap-0.5">
          Back to Lessons
          <span className="text-[10px] opacity-70" dir="rtl">العودة للدروس</span>
        </Button>
      </div>
    );
  }

  if (mode === "quiz") {
    if (!progressReady) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm">
              Loading your progress...
              <span className="block text-[11px]" dir="rtl">جارٍ تحميل تقدّمك...</span>
            </p>
          </div>
        </div>
      );
    }

    const sessionCount = quizPracticeWords.length;
    const sessionSubtitle = quizCustomWords?.length
      ? { en: `Practicing ${sessionCount} selected word${sessionCount !== 1 ? "s" : ""}`, ar: `تدريب على ${sessionCount} كلمة محددة` }
      : quizSessionMode === "mastered"
        ? { en: `Reviewing ${sessionCount} mastered word${sessionCount !== 1 ? "s" : ""}`, ar: `مراجعة ${sessionCount} كلمة متقنة` }
        : quizSessionMode === "all"
          ? { en: `Full lesson quiz — ${sessionCount} words`, ar: `اختبار كامل — ${sessionCount} كلمة` }
          : sessionCount < lesson.words.length
            ? {
                en: `Practicing ${sessionCount} word${sessionCount !== 1 ? "s" : ""} that need review`,
                ar: `تدريب على ${sessionCount} كلمة تحتاج مراجعة — ${quizMasteredCount} متقنة محفوظة`,
              }
            : null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setMode("study")}>
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{lesson.title} — Quiz</h1>
            <p className="text-xs text-muted-foreground" dir="rtl">اختبار</p>
            {sessionSubtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {sessionSubtitle.en}
                <span className="block text-[10px]" dir="rtl">{sessionSubtitle.ar}</span>
              </p>
            )}
          </div>
        </div>

        {quizMasteredCount > 0 && quizSessionMode === "weak" && !quizCustomWords?.length && (
          <QuizMasteredPanel
            masteredWords={quizMasteredWords}
            savedScores={savedScoreByWordId}
            totalWords={lesson.words.length}
            expanded={quizMasteredExpanded}
            onToggle={() => setQuizMasteredExpanded((v) => !v)}
            onReviewMastered={() => startQuiz("mastered")}
            onReviewAll={() => startQuiz("all")}
            onReviewWord={(w) => startQuiz("mastered", [w])}
            compact
          />
        )}

        {sessionCount === 0 ? (
          <div className="text-center py-16 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Trophy className="text-emerald-600" size={32} />
            </div>
            <h2 className="text-xl font-bold">All words mastered!</h2>
            <p className="text-sm text-muted-foreground" dir="rtl">أتقنت جميع كلمات الاختبار!</p>
            <p className="text-sm text-muted-foreground">
              {quizMasteredCount} / {lesson.words.length} words passed (score ≥ {QUIZ_PASS_THRESHOLD}%)
              <span className="block text-[11px]" dir="rtl">محفوظة ولا تُحذف — تتحسّن فقط</span>
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={() => startQuiz("mastered")} className="flex flex-col h-auto py-2 gap-0.5">
                Review mastered ({quizMasteredCount})
                <span className="text-[10px] opacity-80" dir="rtl">راجع المتقنة</span>
              </Button>
              <Button variant="outline" onClick={() => startQuiz("all")} className="flex flex-col h-auto py-2 gap-0.5">
                Full lesson quiz
                <span className="text-[10px] opacity-70" dir="rtl">اختبار كامل</span>
              </Button>
              <Button variant="ghost" onClick={() => setMode("study")} className="flex flex-col h-auto py-2 gap-0.5">
                Back to study
                <span className="text-[10px] opacity-70" dir="rtl">العودة للدراسة</span>
              </Button>
            </div>
          </div>
        ) : (
          <QuizMode
            key={quizSessionKey}
            allWords={lesson.words}
            practiceWords={quizPracticeWords}
            studentId={student?.id}
            savedScores={savedScoreByWordId}
            onScoreSaved={handleQuizScoreSaved}
            onFinish={(score, stats) => {
              setQuizScore(score);
              setQuizSessionStats(stats);
              setMode("results");
            }}
          />
        )}
      </div>
    );
  }

  if (mode === "results") {
    const stars = quizScore >= 90 ? 3 : quizScore >= 70 ? 2 : 1;
    const { sessionTotal, sessionCorrect } = quizSessionStats;
    const stillWeak = (lesson.words ?? []).filter((w) =>
      wordNeedsQuizPractice(w.id, savedScoreByWordId),
    ).length;
    const sessionReview = sessionTotal - sessionCorrect;

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-7xl font-black text-primary">{quizScore}%</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={44}
                className={s <= stars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}
              />
            ))}
          </div>
          <p className="text-2xl font-bold">
            {quizScore >= 90 ? "Excellent! 🎉" : quizScore >= 70 ? "Great job! 👏" : "Keep practicing! 💪"}
            <span className="block text-sm font-normal text-muted-foreground" dir="rtl">
              {quizScore >= 90 ? "ممتاز!" : quizScore >= 70 ? "جيد جداً!" : "استمر في التدريب!"}
            </span>
          </p>
          <div className="flex gap-6 justify-center text-sm mt-2">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600">{sessionCorrect}</span>
              <span className="text-muted-foreground">Correct (1st try)<span className="block text-[10px]" dir="rtl">صحيحة من أول مرة</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-red-500">{sessionReview}</span>
              <span className="text-muted-foreground">Need review<span className="block text-[10px]" dir="rtl">تحتاج مراجعة</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{sessionTotal}</span>
              <span className="text-muted-foreground">This round<span className="block text-[10px]" dir="rtl">هذه الجولة</span></span>
            </div>
          </div>
          {stillWeak > 0 ? (
            <p className="text-sm text-orange-600 font-medium">
              {stillWeak} word{stillWeak !== 1 ? "s" : ""} still need practice — saved for next quiz
              <span className="block text-[11px] font-normal" dir="rtl">{stillWeak} كلمة ما زالت تحتاج تدريباً</span>
            </p>
          ) : (
            <p className="text-sm text-emerald-600 font-medium">
              All lesson words mastered! Progress saved.
              <span className="block text-[11px] font-normal" dir="rtl">أتقنت كل الكلمات — التقدّم محفوظ</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {stillWeak > 0 && (
            <Button variant="outline" onClick={() => startQuiz("weak")} className="flex flex-col h-auto py-2 gap-0.5">
              Practice weak words ({stillWeak})
              <span className="text-[10px] opacity-70" dir="rtl">تدرب على الضعيفة ({stillWeak})</span>
            </Button>
          )}
          {quizMasteredCount > 0 && (
            <Button variant="outline" onClick={() => startQuiz("mastered")} className="flex flex-col h-auto py-2 gap-0.5">
              Review mastered ({quizMasteredCount})
              <span className="text-[10px] opacity-70" dir="rtl">راجع المتقنة ({quizMasteredCount})</span>
            </Button>
          )}
          <Button onClick={() => setLocation("/lessons")} className="flex flex-col h-auto py-2 gap-0.5">
            Back to Lessons
            <span className="text-[10px] opacity-70" dir="rtl">العودة للدروس</span>
          </Button>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/lessons"><ChevronLeft size={20} /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">
            {words.length} words
            <span className="block text-[11px]" dir="rtl">{words.length} كلمة</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleShuffle}
        >
          <Shuffle size={14} />
          {isShuffled ? "Original" : "Shuffle"}
        </Button>
      </div>

      {isOwnLesson && (
        <div className="rounded-3xl border bg-card/80 p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles size={14} />
                إضافة ذكية
              </div>
              <h3 className="text-lg font-bold">إضافة قطعة جديدة للدرس</h3>
              <p className="text-sm text-muted-foreground">
                افتح النافذة ثم الصق النص، وسيتم استخراج الكلمات وإضافتها تلقائياً للدرس بنفس الآلية الأصلية.
              </p>
            </div>
            <Button onClick={() => setAddPanelOpen((v) => !v)} className="rounded-full px-5 shadow-md">
              {addPanelOpen ? "إخفاء النافذة" : "فتح نافذة الإضافة"}
            </Button>
          </div>

          {addPanelOpen && (
            <div className="mt-5 rounded-2xl border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">نص القطعة الجديدة</p>
                  <p className="text-xs text-muted-foreground">لن يتأثر عرض الكلمات الحالية في الدرس</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAddPanelOpen(false)}>إغلاق</Button>
              </div>
              <Textarea
                value={extraText}
                onChange={(e) => {
                  setExtraText(e.target.value);
                  setExtractedCount(null);
                }}
                placeholder="اكتب أو الصق النص هنا..."
                className="min-h-[180px] rounded-2xl"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {extractedCount === null ? (
                    <span>سيتم حساب الكلمات بعد التحليل.</span>
                  ) : (
                    <span>تم استخراج <strong className="text-foreground">{extractedCount}</strong> كلمة من هذه القطعة.</span>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" className="rounded-full" onClick={() => setAddPanelOpen(false)}>
                    إلغاء
                  </Button>
                  <Button className="rounded-full px-6" disabled={addingText || !extraText.trim()} onClick={handleAddText}>
                    {addingText ? "جاري استخراج الكلمات..." : "استخراج وإضافة الكلمات"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      {currentWord && (
        <FlashCard
          key={`${currentWord.id}-${IMAGE_CACHE_VERSION}`}
          word={currentWord}
          isFavorite={favoriteWordIds.has(currentWord.id)}
          onToggleFavorite={handleToggleFavorite}
          favoriteTogglePending={favoriteTogglePending}
          prefilledExampleTranslation={prefilledExampleTranslation}
        />
      )}

      {quizMasteredCount > 0 && (
        <QuizMasteredPanel
          masteredWords={quizMasteredWords}
          savedScores={savedScoreByWordId}
          totalWords={lesson.words.length}
          expanded={quizMasteredExpanded}
          onToggle={() => setQuizMasteredExpanded((v) => !v)}
          onReviewMastered={() => startQuiz("mastered")}
          onReviewAll={() => startQuiz("all")}
          onReviewWord={(w) => startQuiz("mastered", [w])}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          <ArrowLeft size={18} />
        </Button>

        <Button
          variant="default"
          className="gap-2 px-6 rounded-full flex-col h-auto py-2.5"
          onClick={() => startQuiz("weak")}
        >
          <span className="inline-flex items-center gap-2">
            <ClipboardCheck size={16} />
            {quizWeakWords.length < (lesson?.words?.length ?? 0)
              ? `Quiz (${quizWeakWords.length} to practice)`
              : "Take Quiz"}
          </span>
          <span className="text-[10px] font-normal opacity-80" dir="rtl">
            {quizMasteredCount > 0
              ? `${quizMasteredCount} متقنة · ${quizWeakWords.length} للتدريب`
              : "ابدأ الاختبار"}
          </span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          disabled={currentIndex === words.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
