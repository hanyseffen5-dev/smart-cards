import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  useCreateLesson,
  useAnalyzeText,
  useCreateWord,
  useGetWords,
  useExtractTextFromImage,
} from "@workspace/api-client-react";
import { useStudent } from "../lib/use-student";
import { useQueryClient } from "@tanstack/react-query";
import { getGetLessonsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, BookOpen, ChevronLeft, Check, AlertCircle, Camera, Upload, Type, ImageIcon } from "lucide-react";
import type { ExtractedWord } from "@workspace/api-client-react";
import { CameraPanel } from "../components/CameraPanel";
import { FileUploadPanel } from "../components/FileUploadPanel";
import { apiFetch } from "../lib/api-fetch";

type Level = "beginner" | "intermediate" | "advanced" | "all";
type InputMethod = "paste" | "camera" | "upload";
type Step = "input" | "preview" | "saving" | "generating";

interface TaggedWord extends ExtractedWord {
  isDuplicate: boolean;
}

const METHOD_TABS: { id: InputMethod; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
  { id: "camera", labelEn: "Camera", labelAr: "كاميرا", icon: <Camera size={16} /> },
  { id: "upload", labelEn: "Upload", labelAr: "رفع ملف", icon: <Upload size={16} /> },
  { id: "paste", labelEn: "Paste text", labelAr: "لصق نص", icon: <Type size={16} /> },
];

export default function NewLesson() {
  const [text, setText] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [level, setLevel] = useState<Level>("all");
  const [step, setStep] = useState<Step>("input");
  const [taggedWords, setTaggedWords] = useState<TaggedWord[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [inputMethod, setInputMethod] = useState<InputMethod>("paste");
  const [ocrError, setOcrError] = useState("");
  const [imgProgress, setImgProgress] = useState({ done: 0, total: 0, current: "" });
  const [createdLessonId, setCreatedLessonId] = useState<number | null>(null);
  const skipGenerationRef = React.useRef(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { student } = useStudent();
  const { data: existingWords } = useGetWords();
  const analyzeText = useAnalyzeText();
  const createLesson = useCreateLesson();
  const createWord = useCreateWord();
  const extractTextFromImage = useExtractTextFromImage();
  const [isOcrFallback, setIsOcrFallback] = useState(false);

  const SCANNED_PDF_THRESHOLD = 50;

  const existingWordSet = new Set(
    (existingWords ?? []).map((w) => w.word.toLowerCase().trim())
  );

  const handleOcrExtract = async (imageBase64: string, mimeType: string) => {
    setOcrError("");
    try {
      const result = await extractTextFromImage.mutateAsync({ data: { imageBase64, mimeType } });

      if (mimeType === "application/pdf" && result.text.length < SCANNED_PDF_THRESHOLD) {
        setIsOcrFallback(true);
        try {
          const { renderPdfToJpegBase64 } = await import("../lib/pdf-to-images");
          const pageImages = await renderPdfToJpegBase64(imageBase64);
          const pageTexts: string[] = [];
          for (const pageBase64 of pageImages) {
            try {
              const pageResult = await extractTextFromImage.mutateAsync({
                data: { imageBase64: pageBase64, mimeType: "image/jpeg" },
              });
              if (pageResult.text) pageTexts.push(pageResult.text);
            } catch {
              // skip pages that fail OCR
            }
          }
          const combined = pageTexts.join("\n\n").trim();
          if (combined.length < SCANNED_PDF_THRESHOLD) {
            setOcrError("تعذّر استخراج النص من هذا الملف الممسوح. حاول رفع الصفحات كصور منفصلة أو لصق النص يدوياً.");
          } else {
            setText(combined);
          }
        } catch {
          setOcrError("فشل استخراج النص من الملف الممسوح. الرجاء المحاولة مجدداً أو لصق النص يدوياً.");
        } finally {
          setIsOcrFallback(false);
        }
      } else {
        setText(result.text);
      }
    } catch {
      setOcrError("فشل استخراج النص. الرجاء المحاولة مجدداً أو لصق النص يدوياً.");
      setIsOcrFallback(false);
    }
  };

  const handleTxtReady = (content: string) => {
    setText(content);
    setOcrError("");
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const existingWordsList = Array.from(existingWordSet);
    analyzeText.mutate(
      {
        data: {
          text,
          level: level === "all" ? "intermediate" : level,
          lessonTitle: lessonTitle || null,
          existingWords: existingWordsList,
        },
      },
      {
        onSuccess: (result) => {
          const tagged: TaggedWord[] = result.words.map((w) => ({
            ...w,
            isDuplicate: existingWordSet.has(w.word.toLowerCase().trim()),
          }));
          setTaggedWords(tagged);
          setSuggestedTitle(result.lessonTitle);
          if (!lessonTitle) setLessonTitle(result.lessonTitle);
          const autoSelected = new Set(
            tagged.map((_, i) => i).filter((i) => !tagged[i].isDuplicate)
          );
          setSelectedWords(autoSelected);
          setStep("preview");
        },
      }
    );
  };

  /** Generate Daniel cream-storybook images for each saved card, one at a time. */
  const generateImagesForWords = async (
    lessonId: number,
    words: { id: number; word: string }[],
  ) => {
    skipGenerationRef.current = false;
    setImgProgress({ done: 0, total: words.length, current: words[0]?.word ?? "" });
    setStep("generating");

    for (let i = 0; i < words.length; i++) {
      if (skipGenerationRef.current) break;
      setImgProgress({ done: i, total: words.length, current: words[i].word });
      try {
        await apiFetch(`/api/words/${words[i].id}/generate-card-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      } catch {
        // Skip a failed card — the rest still generate; image falls back to a letter.
      }
      setImgProgress({ done: i + 1, total: words.length, current: words[i].word });
    }

    queryClient.invalidateQueries({ queryKey: getGetLessonsQueryKey() });
    setLocation(`/lessons/${lessonId}`);
  };

  const handleSave = async () => {
    setStep("saving");
    const title = lessonTitle || suggestedTitle || "New Lesson";
    const wordsToSave = taggedWords.filter((_, i) => selectedWords.has(i));

    createLesson.mutate(
      { data: { title, text, level, createdByStudentId: student?.id ?? null } },
      {
        onSuccess: async (lesson) => {
          setCreatedLessonId(lesson.id);
          const createdWords: { id: number; word: string }[] = [];
          for (const word of wordsToSave) {
            await new Promise<void>((resolve) => {
              createWord.mutate(
                {
                  data: {
                    lessonId: lesson.id,
                    word: word.word,
                    translation: word.translation,
                    example: word.example,
                    exampleTranslation: word.exampleTranslation ?? null,
                    difficulty: word.difficulty,
                    partOfSpeech: word.partOfSpeech,
                    imageUrl: word.imageUrl ?? null,
                    audioUrl: null,
                  },
                },
                {
                  onSuccess: (created) => {
                    if (created?.id) createdWords.push({ id: created.id, word: created.word });
                    resolve();
                  },
                  onError: () => resolve(),
                }
              );
            });
          }
          queryClient.invalidateQueries({ queryKey: getGetLessonsQueryKey() });

          if (createdWords.length > 0) {
            await generateImagesForWords(lesson.id, createdWords);
          } else {
            setLocation(`/lessons/${lesson.id}`);
          }
        },
      }
    );
  };

  const handleSkipGeneration = () => {
    skipGenerationRef.current = true;
    if (createdLessonId != null) setLocation(`/lessons/${createdLessonId}`);
  };

  const toggleWord = (i: number) => {
    const next = new Set(selectedWords);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelectedWords(next);
  };

  const difficultyColor = (d: string) =>
    d === "easy" ? "text-green-600 bg-green-50" :
    d === "hard" ? "text-red-600 bg-red-50" :
    "text-yellow-600 bg-yellow-50";

  const newCount = taggedWords.filter((_, i) => selectedWords.has(i)).length;
  const dupCount = taggedWords.filter((w) => w.isDuplicate).length;

  if (step === "input") {
    const hasText = text.trim().length > 0;
    const isExtracting = extractTextFromImage.isPending || isOcrFallback;

    return (
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/lessons")}>
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Lesson</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Add text and AI will extract vocabulary
              <span className="block text-[11px]" dir="rtl">أضف نصاً وسيقوم الذكاء الاصطناعي باستخراج الكلمات</span>
            </p>
          </div>
        </div>

        <Input
          placeholder="Lesson title (optional — AI will suggest one)"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          className="rounded-xl"
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Who can see this lesson?
            <span className="block text-[11px] text-muted-foreground font-normal" dir="rtl">من يظهر له هذا الدرس؟</span>
          </label>
          <Select value={level} onValueChange={(v) => setLevel(v as Level)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students<span className="block text-[10px] opacity-70" dir="rtl">للجميع</span></SelectItem>
              <SelectItem value="beginner">Beginner only<span className="block text-[10px] opacity-70" dir="rtl">مبتدئ فقط</span></SelectItem>
              <SelectItem value="intermediate">Intermediate only<span className="block text-[10px] opacity-70" dir="rtl">متوسط فقط</span></SelectItem>
              <SelectItem value="advanced">Advanced only<span className="block text-[10px] opacity-70" dir="rtl">متقدم فقط</span></SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex rounded-xl overflow-hidden border border-border bg-muted/30 p-1 gap-1">
            {METHOD_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setInputMethod(tab.id);
                  setOcrError("");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  inputMethod === tab.id
                    ? "bg-white shadow-sm text-primary border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span className="flex flex-col leading-tight">
                  <span>{tab.labelEn}</span>
                  <span className="text-[10px] font-normal opacity-70" dir="rtl">{tab.labelAr}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="transition-all">
            {inputMethod === "camera" && (
              <CameraPanel
                isExtracting={isExtracting}
                onExtract={handleOcrExtract}
              />
            )}

            {inputMethod === "upload" && (
              <FileUploadPanel
                onTextReady={handleTxtReady}
                onExtract={handleOcrExtract}
                isExtracting={isExtracting}
                isOcrFallback={isOcrFallback}
              />
            )}

            {inputMethod === "paste" && (
              <Textarea
                placeholder="الصق النص الإنجليزي هنا... مثال: 'The camel lives in the desert. It can walk long distances without water.'"
                className="min-h-[220px] rounded-xl text-base p-4"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}
          </div>

          {ocrError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-xl p-3">
              <AlertCircle size={15} className="shrink-0" />
              <span>{ocrError}</span>
            </div>
          )}

          {hasText && inputMethod !== "paste" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">النص المستخرج (يمكنك التعديل)</label>
              <Textarea
                className="min-h-[140px] rounded-xl text-sm p-3"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}
        </div>

        {existingWords && existingWords.length > 0 && (
          <p className="text-xs text-muted-foreground">
            ✅ يوجد <strong>{existingWords.length}</strong> كلمة في التطبيق — سيتجنب الذكاء الاصطناعي تكرارها
          </p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{text.length} حرف</p>
          <Button
            size="lg"
            className="gap-2 rounded-xl px-8"
            onClick={handleAnalyze}
            disabled={analyzeText.isPending || !hasText || isExtracting}
          >
            <Sparkles size={18} />
            {analyzeText.isPending ? "Analyzing..." : "Extract words with AI"}
            <span className="block text-[10px] font-normal opacity-80" dir="rtl">
              {analyzeText.isPending ? "جاري التحليل..." : "استخراج الكلمات بالذكاء الاصطناعي"}
            </span>
          </Button>
        </div>

        {analyzeText.isError && (
          <p className="text-sm text-destructive">فشل التحليل. الرجاء المحاولة مجدداً.</p>
        )}
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setStep("input")}>
            <ChevronLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">مراجعة الكلمات</h1>
            <p className="text-muted-foreground mt-1">
              <span className="text-primary font-semibold">{newCount} كلمة جديدة</span>
              {dupCount > 0 && (
                <span className="text-orange-500 mr-2">· {dupCount} موجودة مسبقاً</span>
              )}
              {" "}من أصل {taggedWords.length}
            </p>
          </div>
        </div>

        {dupCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2 text-sm text-orange-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>
              الكلمات المميزة بـ <span className="font-bold">موجودة</span> موجودة مسبقاً في دروس أخرى. تم إلغاء تحديدها تلقائياً — يمكنك تحديدها إذا أردت إضافتها مجدداً.
            </span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">عنوان الدرس</label>
          <Input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="rounded-xl font-semibold text-lg"
          />
        </div>

        <div className="space-y-3">
          {taggedWords.map((word, i) => (
            <div
              key={i}
              onClick={() => toggleWord(i)}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedWords.has(i)
                  ? word.isDuplicate
                    ? "border-orange-400 bg-orange-50/50"
                    : "border-primary bg-primary/5"
                  : "border-border bg-card opacity-50"
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                selectedWords.has(i)
                  ? word.isDuplicate
                    ? "border-orange-400 bg-orange-400"
                    : "border-primary bg-primary"
                  : "border-muted-foreground"
              }`}>
                {selectedWords.has(i) && <Check size={12} className="text-white" />}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-lg">{word.word}</span>
                  {word.partOfSpeech && (
                    <span className="text-xs text-muted-foreground italic">{word.partOfSpeech}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor(word.difficulty)}`}>
                    {word.difficulty}
                  </span>
                  {word.isDuplicate && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-600 border border-orange-300">
                      ⚠ موجودة مسبقاً
                    </span>
                  )}
                </div>
                <p className="text-base font-medium" dir="rtl">{word.translation}</p>
                {word.example && (
                  <p className="text-sm text-muted-foreground italic truncate">"{word.example}"</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end sticky bottom-4">
          <Button variant="outline" onClick={() => setStep("input")}>
            رجوع
          </Button>
          <Button
            size="lg"
            className="gap-2 rounded-xl px-8 shadow-lg"
            onClick={handleSave}
            disabled={newCount === 0}
          >
            <BookOpen size={18} />
            حفظ الدرس ({newCount} كلمة)
          </Button>
        </div>
      </div>
    );
  }

  if (step === "generating") {
    const pct = imgProgress.total > 0
      ? Math.round((imgProgress.done / imgProgress.total) * 100)
      : 0;
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4" dir="rtl">
        <div
          className="max-w-md w-full rounded-3xl shadow-xl border border-border p-8 flex flex-col items-center gap-6 text-center"
          style={{ backgroundColor: "#FCF5E6" }}
        >
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <ImageIcon size={30} className="text-primary" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">جاري توليد صور الكروت</h2>
            <p className="text-sm text-muted-foreground">
              بأسلوب Daniel القصصي — صورة لكل كلمة وجملة
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="h-3 w-full rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{imgProgress.done} / {imgProgress.total}</span>
              <span>{pct}%</span>
            </div>
          </div>

          {imgProgress.current && imgProgress.done < imgProgress.total && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">جارٍ الآن: </span>
              <span className="font-semibold">{imgProgress.current}</span>
            </p>
          )}

          <Button variant="outline" size="sm" className="rounded-xl" onClick={handleSkipGeneration}>
            عرض الدرس الآن
            <span className="block text-[10px] font-normal opacity-70">والمتابعة في الخلفية لاحقاً</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      <p className="text-muted-foreground">جاري حفظ الدرس...</p>
    </div>
  );
}
