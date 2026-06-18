import React, { useState } from "react";
import { useGetLessons } from "@workspace/api-client-react";
import { getGetLessonsQueryKey } from "@workspace/api-client-react";
import type { Lesson } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BilingualText, PageTitle, SectionTitle } from "@/components/ui/bilingual-text";
import { useStudent } from "../lib/use-student";
import {
  CURRICULUM_LESSON_META,
  CURRICULUM_LESSON_TITLES,
  curriculumLessonAr,
  curriculumLessonEn,
  isCurriculumLessonTitle,
  partitionLessons,
} from "../lib/curriculum-lessons";

const LEVEL_BADGE: Record<string, { en: string; ar: string; color: string }> = {
  beginner:     { en: "Beginner",  ar: "مبتدئ",  color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  intermediate: { en: "Intermediate", ar: "متوسط", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  advanced:     { en: "Advanced",  ar: "متقدم",  color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  all:          { en: "All levels", ar: "الجميع", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

function LessonCard({
  lesson,
  studentId,
  onDelete,
  variant = "default",
}: {
  lesson: Lesson;
  studentId?: number;
  onDelete: (id: number) => void;
  variant?: "curriculum" | "default";
}) {
  const isOwn = lesson.createdByStudentId === studentId;
  const isCurriculum = isCurriculumLessonTitle(lesson.title);
  const meta = isCurriculum ? CURRICULUM_LESSON_META[lesson.title] : null;
  const badge = LEVEL_BADGE[lesson.level ?? "all"] ?? LEVEL_BADGE.all;
  const titleEn = curriculumLessonEn(lesson.title) ?? lesson.title;
  const titleAr = curriculumLessonAr(lesson.title);

  return (
    <div className="relative group">
      <Link href={`/lessons/${lesson.id}`} className="block h-full">
        <div
          className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 border shadow-sm transition-all hover:shadow-md hover:border-primary/50 h-full flex flex-col min-h-[120px] ${
            variant === "curriculum" && meta
              ? `bg-gradient-to-br ${meta.accent}`
              : "bg-card"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <BilingualText
              en={titleEn}
              ar={titleAr ?? ""}
              enClassName="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors leading-snug"
              arClassName="text-[11px]"
            />
            {meta && (
              <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full font-bold bg-background/80 border text-center">
                {meta.badgeEn}
                <span className="block text-[9px] font-normal opacity-70" dir="rtl">{meta.badge}</span>
              </span>
            )}
          </div>
          <div className="mt-auto pt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {lesson.wordCount} words
              <span className="block text-[10px]" dir="rtl">{lesson.wordCount} كلمة</span>
            </span>
            <div className="flex items-center gap-1.5">
              {!isCurriculum && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${badge.color} text-center`}>
                  {badge.en}
                  <span className="block text-[9px] font-normal opacity-80" dir="rtl">{badge.ar}</span>
                </span>
              )}
              <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold text-[11px] text-center">
                Study
                <span className="block text-[9px] font-normal opacity-80" dir="rtl">ادرس</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
      {isOwn && (
        <button
          onClick={(e) => { e.preventDefault(); onDelete(lesson.id); }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          title="Delete lesson"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

export default function Lessons() {
  const { data: lessons, isLoading, isError } = useGetLessons();
  const { student } = useStudent();
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    if (!student) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/lessons/${id}`, {
        method: "DELETE",
        headers: { "x-student-id": String(student.id) },
      });
      if (r.ok || r.status === 204) {
        queryClient.invalidateQueries({ queryKey: getGetLessonsQueryKey() });
        setConfirmId(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  const allLessons = Array.isArray(lessons) ? lessons : [];
  const { curriculum, other } = partitionLessons(allLessons);
  const missingCurriculum = CURRICULUM_LESSON_TITLES.filter(
    (title) => !curriculum.some((l) => l.title === title),
  );
  const invalidLessonsPayload =
    !isLoading && !isError && lessons != null && !Array.isArray(lessons);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <BilingualText en="Loading lessons..." ar="جارٍ تحميل الدروس..." enClassName="text-sm" />
        </div>
      </div>
    );
  }

  if (isError || invalidLessonsPayload) {
    return (
      <div className="text-center py-16 space-y-4">
        <BilingualText en="Could not load lessons" ar="تعذّر تحميل الدروس" enClassName="text-destructive font-medium" />
        <BilingualText
          en="Make sure the API server is running on port 3000, then try again."
          ar="تأكد أن خادم الـ API يعمل على المنفذ 3000 ثم أعد المحاولة."
          enClassName="text-sm text-muted-foreground"
          arClassName="text-xs"
        />
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: getGetLessonsQueryKey() })}>
          <span>Retry</span>
          <span className="block text-[10px] opacity-70" dir="rtl">إعادة المحاولة</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-2xl p-6 shadow-xl max-w-sm w-full space-y-4">
            <SectionTitle en="Delete this lesson?" ar="حذف الدرس؟" />
            <BilingualText
              en="The lesson and all its words will be permanently deleted."
              ar="سيتم حذف الدرس وجميع كلماته بشكل نهائي ولا يمكن التراجع."
              enClassName="text-muted-foreground text-sm"
              arClassName="text-xs"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setConfirmId(null)}>
                Cancel <span className="sr-only">/ إلغاء</span>
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(confirmId)} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <PageTitle en="Lessons" ar="الدروس" />
          <p className="text-sm text-muted-foreground mt-1">
            {allLessons.length} {allLessons.length === 1 ? "lesson" : "lessons"} available
            <span className="block text-[11px]" dir="rtl">
              {allLessons.length} {allLessons.length === 1 ? "درس" : "دروس"} متاحة
            </span>
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <SectionTitle en="Curriculum Lessons" ar="دروس المنهج" />
          <BilingualText
            en="Grade 1 through 5 and miscellaneous words"
            ar="المستوى الأول حتى الخامس وكلمات متنوعة"
            enClassName="text-sm text-muted-foreground"
            arClassName="text-xs"
          />
        </div>

        {missingCurriculum.length > 0 && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-900 dark:text-amber-200">
            <p className="font-medium">Some curriculum lessons are missing from the database:</p>
            <p className="text-[11px] opacity-80" dir="rtl">بعض دروس المنهج غير موجودة في قاعدة البيانات</p>
            <p className="mt-1 text-muted-foreground" dir="ltr">
              {missingCurriculum.join(" · ")}
            </p>
          </div>
        )}

        {curriculum.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {curriculum.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                studentId={student?.id}
                onDelete={setConfirmId}
                variant="curriculum"
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-card border rounded-3xl border-dashed">
            <BilingualText en="No curriculum lessons available" ar="لا توجد دروس منهج متاحة حالياً" enClassName="text-muted-foreground text-sm" />
          </div>
        )}
      </section>

      {other.length > 0 && (
        <section className="space-y-4">
          <div>
            <SectionTitle en="My Lessons" ar="دروسي" />
            <BilingualText en="Lessons you created" ar="دروس أنشأتها بنفسك" enClassName="text-sm text-muted-foreground" arClassName="text-xs" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {other.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                studentId={student?.id}
                onDelete={setConfirmId}
              />
            ))}
          </div>
        </section>
      )}

      {allLessons.length === 0 && (
        <div className="text-center p-8 sm:p-12 bg-card border rounded-3xl border-dashed">
          <SectionTitle en="No lessons yet" ar="لا توجد دروس بعد" className="mb-2" />
          <BilingualText
            en="Lessons will appear here when they are available"
            ar="ستظهر الدروس هنا عند توفرها"
            enClassName="text-muted-foreground text-sm"
            arClassName="text-xs"
          />
        </div>
      )}
    </div>
  );
}
