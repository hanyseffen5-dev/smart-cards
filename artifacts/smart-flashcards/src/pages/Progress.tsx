import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  useGetLessons,
  useGetProgress,
  useGetWords,
  type Lesson,
} from "@workspace/api-client-react";
import { useStudent } from "../lib/use-student";
import {
  mergeLessonProgress,
  loadMergedLocalLessonScores,
  type MergedLessonProgress,
} from "../lib/lesson-progress";
import {
  CURRICULUM_LESSON_META,
  curriculumLessonAr,
  curriculumLessonEn,
  isCurriculumLessonTitle,
  partitionLessons,
} from "../lib/curriculum-lessons";
import { BilingualText, PageTitle, SectionTitle, StatLabel } from "@/components/ui/bilingual-text";
import {
  TrendingUp,
  Trophy,
  Star,
  Target,
  Mic,
  ClipboardCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  GraduationCap,
} from "lucide-react";

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

function barColor(percent: number): string {
  if (percent >= 100) return "from-emerald-500 to-green-500";
  if (percent >= 50) return "from-primary to-orange-400";
  return "from-amber-400 to-orange-400";
}

function LessonProgressCard({
  lesson,
  progress,
}: {
  lesson: Lesson;
  progress: MergedLessonProgress;
}) {
  const total = progress.totalWords;
  const mastered = progress.masteredWords;
  const avg = progress.averageScore;
  const completion = pct(mastered, total);
  const started = progress.practiced > 0;
  const isComplete = total > 0 && mastered >= total;

  const meta = isCurriculumLessonTitle(lesson.title)
    ? CURRICULUM_LESSON_META[lesson.title]
    : null;
  const titleEn = curriculumLessonEn(lesson.title) ?? lesson.title;
  const titleAr = curriculumLessonAr(lesson.title);

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-sm transition-all hover:shadow-md ${
        meta ? `bg-gradient-to-br ${meta.accent}` : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <BilingualText
            en={titleEn}
            ar={titleAr ?? ""}
            enClassName="text-lg font-bold leading-snug truncate"
            arClassName="text-[11px] truncate"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {mastered} / {total} mastered
            <span className="block text-[10px]" dir="rtl">{mastered} من {total} كلمة متقنة</span>
          </p>
          {started && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {progress.needsPractice} need practice · {progress.remaining} not started
              <span className="block" dir="rtl">
                {progress.needsPractice} تحتاج تدريب · {progress.remaining} لم تبدأ
              </span>
            </p>
          )}
        </div>
        {isComplete ? (
          <span className="shrink-0 inline-flex flex-col items-end gap-0.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <span className="inline-flex items-center gap-1"><Trophy size={12} /> Complete</span>
            <span className="text-[10px] font-normal" dir="rtl">مكتمل</span>
          </span>
        ) : started ? (
          <span className="shrink-0 inline-flex flex-col items-end gap-0.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <span>In Progress</span>
            <span className="text-[10px] font-normal" dir="rtl">قيد التقدّم</span>
          </span>
        ) : (
          <span className="shrink-0 inline-flex flex-col items-end gap-0.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            <span>Not Started</span>
            <span className="text-[10px] font-normal" dir="rtl">لم يبدأ</span>
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor(completion)} transition-all duration-500`}
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mastery: {completion}%<span className="block text-[10px]" dir="rtl">الإتقان: {completion}%</span></span>
          {started && (
            <span>Avg: {avg}%<span className="block text-[10px]" dir="rtl">متوسط: {avg}%</span></span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/pronunciation?lesson=${lesson.id}`}
          className="inline-flex flex-col items-center justify-center gap-0.5 rounded-xl bg-primary text-white font-bold text-sm h-11 hover:bg-primary/90 active:scale-95 transition-all"
        >
          <span className="inline-flex items-center gap-1.5"><Mic size={15} /> Pronunciation</span>
          <span className="text-[10px] font-normal opacity-80" dir="rtl">النطق</span>
        </Link>
        <Link
          href={`/lessons/${lesson.id}?mode=quiz`}
          className="inline-flex flex-col items-center justify-center gap-0.5 rounded-xl border border-primary/30 text-primary font-bold text-sm h-11 hover:bg-primary/5 active:scale-95 transition-all"
        >
          <span className="inline-flex items-center gap-1.5"><ClipboardCheck size={15} /> Quiz</span>
          <span className="text-[10px] font-normal opacity-80" dir="rtl">اختبار</span>
        </Link>
      </div>
    </div>
  );
}

export default function Progress() {
  const { student } = useStudent();
  const [location] = useLocation();
  const [localRefresh, setLocalRefresh] = useState(0);

  // Re-read localStorage when the user opens this page (pronunciation/quiz save locally first).
  useEffect(() => {
    if (location === "/progress" || location.endsWith("/progress")) {
      setLocalRefresh((k) => k + 1);
    }
  }, [location]);

  const progressParams = student?.id != null ? { studentId: student.id } : undefined;
  const { data: savedProgress, isLoading: progressLoading } = useGetProgress(
    progressParams,
    { query: { enabled: student?.id != null } },
  );
  const { data: allWords, isLoading: wordsLoading } = useGetWords();
  const { data: lessons, isLoading: lessonsLoading } = useGetLessons();

  const { curriculum, other } = useMemo(
    () => partitionLessons(Array.isArray(lessons) ? lessons : []),
    [lessons],
  );

  const serverScoresByLesson = useMemo(() => {
    const wordToLesson = new Map<number, number>();
    for (const w of allWords ?? []) wordToLesson.set(w.id, w.lessonId);

    const byLesson = new Map<number, Map<number, number>>();
    for (const p of savedProgress ?? []) {
      const lessonId = wordToLesson.get(p.wordId);
      if (lessonId == null) continue;
      let lessonMap = byLesson.get(lessonId);
      if (!lessonMap) {
        lessonMap = new Map();
        byLesson.set(lessonId, lessonMap);
      }
      const prev = lessonMap.get(p.wordId);
      if (prev == null || p.score > prev) lessonMap.set(p.wordId, p.score);
    }
    return byLesson;
  }, [savedProgress, allWords]);

  const mergedProgressByLesson = useMemo(() => {
    const map = new Map<number, MergedLessonProgress>();
    const all = [...curriculum, ...other];
    for (const lesson of all) {
      const local = loadMergedLocalLessonScores(student?.id ?? null, lesson.id);
      const server = serverScoresByLesson.get(lesson.id) ?? new Map();
      map.set(
        lesson.id,
        mergeLessonProgress(lesson.id, lesson.wordCount, local, server),
      );
    }
    return map;
  }, [curriculum, other, student?.id, serverScoresByLesson, localRefresh]);

  const globalStats = useMemo(() => {
    let masteredWords = 0;
    let needsPractice = 0;
    let remaining = 0;
    let scoreSum = 0;
    let practiced = 0;
    let completedLessons = 0;
    const all = [...curriculum, ...other];

    for (const lesson of all) {
      const lp = mergedProgressByLesson.get(lesson.id);
      if (!lp) continue;
      masteredWords += lp.masteredWords;
      needsPractice += lp.needsPractice;
      remaining += lp.remaining;
      practiced += lp.practiced;
      scoreSum += lp.averageScore * lp.practiced;
      if (lp.totalWords > 0 && lp.masteredWords >= lp.totalWords) completedLessons++;
    }

    const totalAttempts = (savedProgress ?? []).reduce((s, p) => s + p.attempts, 0);
    const averageScore = practiced > 0 ? Math.round(scoreSum / practiced) : 0;

    return {
      masteredWords,
      needsPractice,
      remaining,
      practiced,
      averageScore,
      totalAttempts,
      completedLessons,
      totalLessons: all.length,
    };
  }, [curriculum, other, mergedProgressByLesson, savedProgress]);

  const isLoading = lessonsLoading || wordsLoading || (student?.id != null && progressLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <BilingualText en="Loading your progress..." ar="جارٍ تحميل تقدّمك..." enClassName="text-sm" />
        </div>
      </div>
    );
  }

  const totalLessons = globalStats.totalLessons;
  const summary = [
    { en: "Words Mastered", ar: "كلمات متقنة", value: globalStats.masteredWords, icon: CheckCircle2, color: "text-emerald-500" },
    { en: "Need Practice", ar: "تحتاج تدريب", value: globalStats.needsPractice, icon: Target, color: "text-orange-500" },
    { en: "Average Score", ar: "متوسط الدرجة", value: `${globalStats.averageScore}%`, icon: Star, color: "text-amber-500" },
    { en: "Lessons Complete", ar: "دروس مكتملة", value: `${globalStats.completedLessons}/${totalLessons}`, icon: Trophy, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-orange-500/5 to-background border border-primary/10 p-6 sm:p-8">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            <TrendingUp size={14} /> Student Progress
            <span className="text-[10px] font-normal opacity-80" dir="rtl">تقدّم الطالب</span>
          </div>
          <PageTitle en="My Learning Progress" ar="تقدّمي في التعلّم" />
          <BilingualText
            en="Track mastery for each lesson through pronunciation and quiz."
            ar="تابع إتقانك لكل درس عبر تدريب النطق والاختبار."
            enClassName="text-muted-foreground text-sm max-w-md"
            arClassName="text-xs"
          />
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full mt-1">
            <ShieldCheck size={13} />
            <span>Saved forever — only improves</span>
            <span className="opacity-80" dir="rtl">· محفوظ ولا يُحذف</span>
          </div>
        </div>
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {summary.map((s) => (
          <div key={s.en} className="bg-card border rounded-2xl p-4 sm:p-5 space-y-2">
            <s.icon className={s.color} size={22} />
            <p className="text-2xl font-black">{s.value}</p>
            <StatLabel en={s.en} ar={s.ar} />
          </div>
        ))}
      </div>

      {globalStats.practiced > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {globalStats.remaining} words not started yet
          {globalStats.totalAttempts > 0 && (
            <span> · {globalStats.totalAttempts} total attempts</span>
          )}
          <span className="block text-[11px]" dir="rtl">
            {globalStats.remaining} كلمة لم تبدأ بعد
            {globalStats.totalAttempts > 0 && (
              <span> · {globalStats.totalAttempts} محاولة إجمالية</span>
            )}
          </span>
        </p>
      )}

      {!student && globalStats.practiced > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          Progress is saved on this device. Log in to sync across devices.
          <span className="block text-[11px] mt-1" dir="rtl">
            التقدّم محفوظ على هذا الجهاز. سجّل الدخول للمزامنة بين الأجهزة.
          </span>
        </div>
      )}

      {totalLessons === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Sparkles className="mx-auto text-primary" size={48} />
          <SectionTitle en="No lessons yet" ar="لا توجد دروس بعد" />
          <BilingualText
            en="Add a lesson and start practicing to see your progress here."
            ar="أضف درساً وابدأ التدريب لترى تقدّمك هنا."
            enClassName="text-muted-foreground text-sm"
            arClassName="text-xs"
          />
        </div>
      ) : (
        <>
          {curriculum.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-primary" size={20} />
                <SectionTitle en="Curriculum Lessons" ar="دروس المنهج" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {curriculum.map((lesson) => (
                  <LessonProgressCard
                    key={lesson.id}
                    lesson={lesson}
                    progress={mergedProgressByLesson.get(lesson.id) ?? {
                      lessonId: lesson.id,
                      totalWords: lesson.wordCount,
                      masteredWords: 0,
                      needsPractice: 0,
                      remaining: lesson.wordCount,
                      practiced: 0,
                      averageScore: 0,
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {other.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                <SectionTitle en="My Lessons" ar="دروسي" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {other.map((lesson) => (
                  <LessonProgressCard
                    key={lesson.id}
                    lesson={lesson}
                    progress={mergedProgressByLesson.get(lesson.id) ?? {
                      lessonId: lesson.id,
                      totalWords: lesson.wordCount,
                      masteredWords: 0,
                      needsPractice: 0,
                      remaining: lesson.wordCount,
                      practiced: 0,
                      averageScore: 0,
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
