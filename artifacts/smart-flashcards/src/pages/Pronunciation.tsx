import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  useGetLessons,
  useGetLesson,
  useRecordProgress,
  useGetProgress,
  getGetProgressQueryKey,
  getGetProgressStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useStudent } from "../lib/use-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic, ChevronRight, RotateCcw, Trophy, AlertCircle,
  Sparkles, X, Volume2, BookOpen, Target, CheckCircle2,
  Clock, ArrowRight, GraduationCap, Square,
} from "lucide-react";
import type { Word, Lesson } from "@workspace/api-client-react";
import { WordImage } from "@/components/WordImage";
import { usePrefetchWordImages } from "@/hooks/use-prefetch-word-images";
import {
  CURRICULUM_LESSON_META,
  curriculumLessonEn,
  curriculumLessonAr,
  isCurriculumLessonTitle,
  partitionLessons,
} from "../lib/curriculum-lessons";
import { BilingualText, PageTitle, SectionTitle } from "@/components/ui/bilingual-text";
import {
  transcribeBlob,
  loadAsr,
  isLocalAsrSupported,
  NO_SPEECH_ERROR,
  type AsrProgress,
} from "../lib/local-asr";
import { scorePronunciation } from "../lib/pronunciation-score";
import { getReferenceAudio, preloadReferenceAudio } from "../lib/reference-audio-cache";
import { loadLocalScores, saveLocalScore } from "../lib/pronunciation-progress-store";

const PASS_THRESHOLD = 80;
const WEAK_AFTER_FAILURES = 2;

// Recording-based pronunciation. Audio is transcribed fully on-device (Whisper).
const MAX_RECORD_MS = 12000;
const SILENCE_STOP_MS = 1200;

function pickRecorderMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function LetterReveal({ word }: { word: string }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    setRevealed(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= word.length) clearInterval(timer);
    }, 120);
    return () => clearInterval(timer);
  }, [word]);

  return (
    <div dir="ltr" className="flex flex-row justify-center gap-1 flex-wrap">
      {word.split("").map((ch, idx) => (
        <span
          key={idx}
          className="text-4xl font-black text-white inline-block transition-all duration-200"
          style={{
            opacity: idx < revealed ? 1 : 0,
            transform: idx < revealed ? "translateY(0)" : "translateY(-12px)",
            transitionDelay: `${idx * 30}ms`,
          }}
        >
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </div>
  );
}

function WordCard({ word }: { word: Word }) {
  return (
    <div className="w-full aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/15 shadow-lg flex items-center justify-center p-5">
      <WordImage
        word={word}
        size="large"
        priority
        className="w-full h-full max-w-none min-h-0"
        fallbackClassName="w-full h-full border-0 shadow-none"
      />
    </div>
  );
}

const MIC_LEVEL_THRESHOLD = 12; // ~5% — anything above counts as "sound heard"

function readMicLevel(analyser: AnalyserNode): number {
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128;
    sum += v * v;
  }
  return Math.round(Math.sqrt(sum / data.length) * 100);
}

type Phase = "ready" | "listening" | "processing" | "result";

function PronunciationCard({
  word, onNext, onExit, onScoreRecorded, onProgressPersisted,
}: {
  word: Word;
  onNext: (score: number) => void;
  onExit: () => void;
  onScoreRecorded?: (word: Word, score: number) => void;
  onProgressPersisted?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [spokenWord, setSpokenWord] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [listenHint, setListenHint] = useState("");
  const [hintTone, setHintTone] = useState<"warning" | "error">("warning");
  const [speaking, setSpeaking] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [listenLevel, setListenLevel] = useState(0);
  const [modelLoadPct, setModelLoadPct] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const rafRef = useRef<number | null>(null);
  const maxTimerRef = useRef<number | null>(null);
  const sessionIdRef = useRef(0);
  const recordingRef = useRef(false);
  const heardSpeechRef = useRef(false);
  const lastSpeechAtRef = useRef(0);
  const recordStartedAtRef = useRef(0);
  const recordMimeRef = useRef("");
  const recordProgress = useRecordProgress();
  const { student } = useStudent();

  useEffect(() => {
    cleanupRecording();
    setPhase("ready");
    setScore(0);
    setBestScore(0);
    setAttemptNumber(0);
    setSpokenWord("");
    setLiveTranscript("");
    setListenHint("");
    setListenLevel(0);
    setPreparing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.id]);

  useEffect(() => {
    preloadReferenceAudio(word.word, word.example);
  }, [word.word, word.example]);

  // Warm up the local Whisper model in the background so the first attempt is fast.
  useEffect(() => {
    if (!isLocalAsrSupported()) return;
    let cancelled = false;
    loadAsr((p: AsrProgress) => {
      if (cancelled) return;
      if (p?.status === "progress" && typeof p.progress === "number") {
        setModelLoadPct(Math.min(100, Math.round(p.progress)));
      }
    })
      .then(() => { if (!cancelled) { setModelReady(true); setModelLoadPct(100); } })
      .catch(() => { /* will retry on first use */ });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    return () => { cleanupRecording(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showHint = (message: string, tone: "warning" | "error" = "warning") => {
    setHintTone(tone);
    setListenHint(message);
  };

  const clearMaxTimer = () => {
    if (maxTimerRef.current != null) {
      window.clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  };

  const stopLevelLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const cleanupRecording = () => {
    recordingRef.current = false;
    sessionIdRef.current += 1;
    clearMaxTimer();
    stopLevelLoop();
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder && recorder.state !== "inactive") {
      try { recorder.stop(); } catch { /* ignore */ }
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    chunksRef.current = [];
    heardSpeechRef.current = false;
    lastSpeechAtRef.current = 0;
    setListenLevel(0);
  };

  const finishWithScore = (calculated: number, heard: string) => {
    cleanupRecording();
    setScore(calculated);
    setBestScore((prev) => Math.max(prev, calculated));
    setAttemptNumber((prev) => prev + 1);
    setSpokenWord(heard);
    setLiveTranscript("");
    setListenHint("");
    setPhase("result");
    onScoreRecorded?.(word, calculated);
  };

  const evaluateRecording = async (blob: Blob, sessionId: number) => {
    if (sessionId !== sessionIdRef.current) return;
    setPhase("processing");
    setLiveTranscript("");

    try {
      const transcript = await transcribeBlob(blob, (p: AsrProgress) => {
        if (p?.status === "progress" && typeof p.progress === "number") {
          setModelLoadPct(Math.min(100, Math.round(p.progress)));
        } else if (p?.status === "done" || p?.status === "ready") {
          setModelReady(true);
          setModelLoadPct(100);
        }
      });
      setModelReady(true);
      if (sessionId !== sessionIdRef.current) return;

      const { score: calculated, heard } = scorePronunciation(transcript, word.word);
      finishWithScore(calculated, heard);
    } catch (err) {
      if (sessionId !== sessionIdRef.current) return;
      cleanupRecording();
      const message = err instanceof Error ? err.message : "";
      if (message === NO_SPEECH_ERROR) {
        showHint("لم أسمع صوتك بوضوح. اقترب من الميكروفون وانطق الكلمة بصوت أعلى.", "warning");
        setPhase("ready");
        return;
      }
      const isNetwork = err instanceof TypeError || /fetch|network|load|download/i.test(message);
      showHint(
        isNetwork
          ? "تعذّر تحميل محرك النطق لأول مرة. تأكد من الإنترنت مرة واحدة فقط ثم حاول مجددًا."
          : "تعذّر تحليل الصوت. حاول مرة أخرى.",
        "error",
      );
      setPhase("ready");
    }
  };

  const finishRecording = () => {
    if (!recordingRef.current) return;
    const sessionId = sessionIdRef.current;
    recordingRef.current = false;
    clearMaxTimer();
    stopLevelLoop();

    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      const blob = new Blob(chunksRef.current, {
        type: recordMimeRef.current || "audio/webm",
      });
      chunksRef.current = [];
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      void audioCtxRef.current?.close();
      audioCtxRef.current = null;
      analyserRef.current = null;
      recorderRef.current = null;

      if (blob.size < 200) {
        showHint("التسجيل قصير جدًا. اضغط للنطق وانطق الكلمة بوضوح.", "warning");
        setPhase("ready");
        return;
      }
      void evaluateRecording(blob, sessionId);
      return;
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recordMimeRef.current || recorder.mimeType || "audio/webm",
      });
      chunksRef.current = [];
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      void audioCtxRef.current?.close();
      audioCtxRef.current = null;
      analyserRef.current = null;
      recorderRef.current = null;

      if (blob.size < 200) {
        showHint("التسجيل قصير جدًا. اضغط للنطق وانطق الكلمة بوضوح.", "warning");
        setPhase("ready");
        return;
      }
      void evaluateRecording(blob, sessionId);
    };

    try {
      recorder.stop();
    } catch {
      showHint("تعذّر إيقاف التسجيل. حاول مرة أخرى.", "error");
      setPhase("ready");
    }
  };

  const tickRecording = (sessionId: number) => {
    if (sessionId !== sessionIdRef.current || !recordingRef.current) return;
    const analyser = analyserRef.current;
    if (!analyser) return;

    const level = readMicLevel(analyser);
    setListenLevel(level);

    if (level >= MIC_LEVEL_THRESHOLD) {
      heardSpeechRef.current = true;
      lastSpeechAtRef.current = Date.now();
    } else if (
      heardSpeechRef.current &&
      Date.now() - lastSpeechAtRef.current >= SILENCE_STOP_MS
    ) {
      finishRecording();
      return;
    }

    rafRef.current = requestAnimationFrame(() => tickRecording(sessionId));
  };

  const beginRecordingSession = async () => {
    cleanupRecording();
    const sessionId = sessionIdRef.current;
    chunksRef.current = [];
    heardSpeechRef.current = false;
    lastSpeechAtRef.current = 0;
    recordStartedAtRef.current = Date.now();
    setLiveTranscript("");
    setListenHint("");
    setListenLevel(0);

    if (!navigator.mediaDevices?.getUserMedia) {
      showHint("المتصفح لا يدعم تسجيل الصوت.", "error");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      showHint("المتصفح لا يدعم تسجيل الصوت.", "error");
      return;
    }

    const mimeType = pickRecorderMimeType();
    if (!mimeType) {
      showHint("المتصفح لا يدعم تنسيق تسجيل الصوت.", "error");
      return;
    }
    recordMimeRef.current = mimeType;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      if (sessionId !== sessionIdRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.35;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recordingRef.current = true;
      setPhase("listening");
      recorder.start(250);
      rafRef.current = requestAnimationFrame(() => tickRecording(sessionId));

      clearMaxTimer();
      maxTimerRef.current = window.setTimeout(() => {
        if (sessionId !== sessionIdRef.current || !recordingRef.current) return;
        if (heardSpeechRef.current) {
          finishRecording();
        } else {
          cleanupRecording();
          showHint("لم أسمع أي صوت. تأكد أن الميكروفون يعمل ثم حاول مجددًا.", "warning");
          setPhase("ready");
        }
      }, MAX_RECORD_MS);
    } catch (err: any) {
      cleanupRecording();
      const name = err?.name ?? "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        showHint("الميكروفون محظور. اسمح بالوصول من إعدادات المتصفح.", "error");
      } else if (name === "NotFoundError") {
        showHint("لم يُعثر على ميكروفون متصل.", "error");
      } else {
        showHint("تعذّر بدء التسجيل. حاول مرة أخرى.", "error");
      }
      setPhase("ready");
    }
  };

  const startListening = async () => {
    if (speaking || preparing || phase === "listening" || phase === "processing") return;
    setListenHint("");
    setPreparing(true);
    await beginRecordingSession();
    setPreparing(false);
  };

  const stopAndEvaluate = () => {
    if (!recordingRef.current) return;
    finishRecording();
  };

  const cancelListening = () => {
    cleanupRecording();
    setPhase("ready");
    setLiveTranscript("");
    setListenHint("");
  };

  const speakWord = async () => {
    if (speaking) return;
    setSpeaking(true);
    try {
      const blob = await getReferenceAudio(word.word, word.example);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  };

  const handleConfirmNext = () => {
    const finalScore = Math.max(bestScore, score);
    recordProgress.mutate(
      { data: { wordId: word.id, score: finalScore, studentId: student?.id ?? null } },
      { onSuccess: () => onProgressPersisted?.() },
    );
    onNext(finalScore);
  };

  const handleRetry = () => {
    cleanupRecording();
    setPhase("ready");
    setSpokenWord("");
    setLiveTranscript("");
    setListenHint("");
  };

  const scoreColor =
    score >= PASS_THRESHOLD ? "from-emerald-500 to-green-600"
    : score >= 55 ? "from-amber-400 to-orange-500"
    : "from-red-500 to-rose-600";

  const scoreLabel =
    score >= PASS_THRESHOLD ? { en: "Excellent! 🌟", ar: "ممتاز!" }
    : score >= 55 ? { en: "Good! Try again", ar: "جيد! حاول تكرارها" }
    : { en: "Needs more practice", ar: "تحتاج تدريب أكثر" };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {phase !== "result" ? (
        <>
          <WordCard word={word} />
          <div className="text-center space-y-3">
            <p className="text-2xl font-bold text-foreground" dir="rtl">{word.translation}</p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full text-sm border-primary/20 hover:bg-primary/5"
              onClick={speakWord}
              disabled={speaking}
            >
              <Volume2 size={16} className={speaking ? "animate-pulse text-primary" : "text-primary"} />
              {speaking ? "Playing..." : "Listen to word"}
              <span className="block text-[10px] font-normal opacity-70" dir="rtl">
                {speaking ? "جاري التشغيل..." : "استمع للكلمة"}
              </span>
            </Button>
            <p className="text-sm text-muted-foreground">
              Look at the image, then say the English word
              <span className="block text-[11px]" dir="rtl">انظر للصورة ثم انطق الكلمة الإنجليزية</span>
            </p>
            {listenHint && (
              <p
                className={`text-xs font-medium px-3 py-2 rounded-xl border ${
                  hintTone === "error"
                    ? "text-red-700 bg-red-50 border-red-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {listenHint}
              </p>
            )}
            {bestScore > 0 && (
              <p className="text-xs font-semibold text-primary bg-primary/10 inline-block px-3 py-1 rounded-full">
                Best score: {bestScore}%
                <span className="block text-[10px] font-normal opacity-80" dir="rtl">أفضل نتيجة: {bestScore}%</span>
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4 pt-2">
            {phase === "listening" && (
              <div className="w-full text-center space-y-3">
                <p className="text-sm font-semibold text-primary">
                  🎙️ Listen... say the word now
                  <span className="block text-[11px] font-normal opacity-80" dir="rtl">استمع... انطق الكلمة الآن</span>
                </p>
                {recordingRef.current ? (
                  <>
                    <div className="h-3 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-75 ${
                          listenLevel >= MIC_LEVEL_THRESHOLD
                            ? "from-emerald-500 to-green-400"
                            : "from-primary to-orange-400"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(listenLevel, 4))}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {listenLevel >= MIC_LEVEL_THRESHOLD
                        ? "Voice detected — stop speaking to evaluate"
                        : "Speak louder..."}
                      <span className="block text-[10px]" dir="rtl">
                        {listenLevel >= MIC_LEVEL_THRESHOLD
                          ? "يُسمَع صوتك — توقف عن الكلام ليُقيَّم تلقائيًا"
                          : "تحدّث بصوت أوضح..."}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-1.5 h-6" aria-hidden>
                      <span className="w-1.5 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
                      <span className="w-1.5 h-6 rounded-full bg-primary animate-pulse" style={{ animationDelay: "450ms" }} />
                      <span className="w-1.5 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: "600ms" }} />
                    </div>
                    {liveTranscript ? (
                      <p className="text-sm font-semibold text-foreground" dir="ltr">
                        &ldquo;{liveTranscript}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Listening — say the word clearly, then tap Stop
                        <span className="block text-[10px]" dir="rtl">جاري الاستماع — انطق الكلمة بوضوح ثم اضغط «إيقاف»</span>
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
            {phase === "processing" && (
              <div className="w-full text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                {!modelReady && modelLoadPct < 100 ? (
                  <>
                    <p className="text-sm font-semibold text-primary">
                      Loading speech engine (first time)... {modelLoadPct}%
                      <span className="block text-[11px] font-normal opacity-80" dir="rtl">جاري تجهيز محرك النطق لأول مرة...</span>
                    </p>
                    <div className="h-2 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-200"
                        style={{ width: `${modelLoadPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      One-time download, then works offline.
                      <span className="block text-[10px]" dir="rtl">يحدث مرة واحدة فقط، ثم يعمل بدون إنترنت.</span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-primary">
                    Evaluating your pronunciation...
                    <span className="block text-[11px] font-normal opacity-80" dir="rtl">جاري تقييم نطقك...</span>
                  </p>
                )}
              </div>
            )}
            <div className="flex justify-center">
              {phase === "listening" ? (
                <button
                  type="button"
                  onClick={stopAndEvaluate}
                  aria-label="Stop recording and evaluate"
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex flex-col items-center justify-center gap-1.5 shadow-xl ring-4 ring-red-500/20 hover:scale-105 active:scale-95 transition-transform relative"
                >
                  <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
                  <Square size={30} className="relative fill-current" />
                  <span className="text-sm font-bold relative">Stop</span>
                  <span className="text-[10px] font-normal relative opacity-80" dir="rtl">إيقاف</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startListening}
                  disabled={preparing || speaking || phase === "processing"}
                  aria-label="Tap to speak"
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-orange-500 text-white flex flex-col items-center justify-center gap-1.5 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-transform ring-4 ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Mic size={36} className={preparing ? "animate-pulse" : ""} />
                  <span className="text-sm font-bold">{preparing ? "Preparing..." : "Tap to speak"}</span>
                  <span className="text-[10px] font-normal opacity-80" dir="rtl">{preparing ? "جارٍ التحضير..." : "اضغط للنطق"}</span>
                </button>
              )}
            </div>
            {phase === "listening" && (
              <button
                type="button"
                onClick={cancelListening}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Cancel
                <span className="block text-[10px] opacity-70" dir="rtl">إلغاء</span>
              </button>
            )}
          </div>
        </>
      ) : (
        <div className={`rounded-3xl bg-gradient-to-br ${scoreColor} p-8 text-white space-y-5 text-center shadow-xl`}>
          <div className="space-y-2" dir="ltr">
            <p className="text-sm font-semibold opacity-80">Correct word</p>
            <p className="text-[11px] opacity-70" dir="rtl">الكلمة الصحيحة</p>
            <LetterReveal word={word.word} />
            <button
              onClick={speakWord}
              disabled={speaking}
              className="mx-auto flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Volume2 size={15} className={speaking ? "animate-pulse" : ""} />
              {speaking ? "Playing..." : "Listen to correct pronunciation"}
              <span className="block text-[10px] opacity-80" dir="rtl">{speaking ? "جاري التشغيل..." : "استمع للنطق الصحيح"}</span>
            </button>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 space-y-1">
            <p className="text-5xl font-black">{score}%</p>
            <p className="text-lg font-semibold">{scoreLabel.en}</p>
            <p className="text-sm opacity-90" dir="rtl">{scoreLabel.ar}</p>
            {attemptNumber > 1 && bestScore !== score && (
              <p className="text-sm font-medium opacity-90">
                Best score: {bestScore}%
                <span className="block text-[11px] opacity-80" dir="rtl">أفضل نتيجة: {bestScore}%</span>
              </p>
            )}
            {attemptNumber > 1 && (
              <p className="text-xs opacity-70">
                Attempt {attemptNumber}
                <span className="block text-[10px]" dir="rtl">المحاولة {attemptNumber}</span>
              </p>
            )}
            {spokenWord ? (
              <p className="text-sm opacity-80 pt-1" dir="ltr">
                🎧 I heard: &ldquo;{spokenWord}&rdquo;
                <span className="block text-[11px] opacity-70" dir="rtl">سمعتك تقول: &ldquo;{spokenWord}&rdquo;</span>
              </p>
            ) : (
              <p className="text-sm opacity-75">
                No clear speech detected
                <span className="block text-[11px] opacity-70" dir="rtl">لم يُسجَّل نطق واضح</span>
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="flex-1 gap-2 rounded-xl font-bold h-12 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white"
              onClick={handleRetry}
            >
              <RotateCcw size={18} /> Try again
              <span className="block text-[10px] font-normal opacity-80" dir="rtl">أعد المحاولة</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="flex-1 gap-2 rounded-xl font-bold h-12"
              onClick={handleConfirmNext}
            >
              <ChevronRight size={18} />
              {Math.max(bestScore, score) >= PASS_THRESHOLD ? "Next ✓" : "Next"}
              <span className="block text-[10px] font-normal opacity-80" dir="rtl">التالي</span>
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="ghost" size="sm" className="text-muted-foreground gap-1 text-xs" onClick={onExit}>
          <X size={12} /> Exit lesson
          <span className="text-[10px] opacity-70" dir="rtl">الخروج من الدرس</span>
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, labelEn, labelAr, value, accent, active, clickable, onClick,
}: {
  icon: React.ElementType;
  labelEn: string;
  labelAr: string;
  value: number;
  accent: string;
  active?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <Card
      className={`border-0 shadow-md bg-gradient-to-br ${accent} overflow-hidden transition-all ${
        active ? "ring-2 ring-primary shadow-lg scale-[1.02]" : ""
      } ${clickable ? "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer" : ""}`}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-background/60 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-foreground/70" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-black leading-none">{value}</p>
          <p className="text-xs font-medium mt-0.5 truncate">{labelEn}</p>
          <p className="text-[10px] text-muted-foreground truncate" dir="rtl">{labelAr}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (!clickable || !onClick) return inner;
  return (
    <button type="button" onClick={onClick} className="text-right w-full">
      {inner}
    </button>
  );
}

type StatsSection = "mastered" | "weak" | "remaining";

function SessionStatsBar({
  total,
  practiced,
  weak,
  remaining,
  masteredList,
  weakList,
  remainingList,
  expandedSection,
  onToggleSection,
  onPracticeWords,
}: {
  total: number;
  practiced: number;
  weak: number;
  remaining: number;
  masteredList: { word: Word; score: number }[];
  weakList: { word: Word; score: number }[];
  remainingList: Word[];
  expandedSection: StatsSection | null;
  onToggleSection: (section: StatsSection) => void;
  onPracticeWords?: (words: Word[]) => void;
}) {
  const pct = total > 0 ? Math.round((practiced / total) * 100) : 0;

  const toggle = (section: StatsSection, count: number) => {
    if (count <= 0) return;
    onToggleSection(section);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={BookOpen} labelEn="Total Words" labelAr="إجمالي الكلمات" value={total} accent="from-slate-500/10 to-slate-600/5" />
        <StatCard
          icon={CheckCircle2}
          labelEn="Practiced"
          labelAr="تم التدرب عليها"
          value={practiced}
          accent="from-emerald-500/15 to-emerald-600/5"
          active={expandedSection === "mastered"}
          clickable={practiced > 0}
          onClick={() => toggle("mastered", practiced)}
        />
        <StatCard
          icon={AlertCircle}
          labelEn="Needs Practice"
          labelAr="تحتاج تدريب أكثر"
          value={weak}
          accent="from-red-500/15 to-red-600/5"
          active={expandedSection === "weak"}
          clickable={weak > 0}
          onClick={() => toggle("weak", weak)}
        />
        <StatCard
          icon={Clock}
          labelEn="Remaining"
          labelAr="متبقية"
          value={remaining}
          accent="from-primary/15 to-orange-500/5"
          active={expandedSection === "remaining"}
          clickable={remaining > 0}
          onClick={() => toggle("remaining", remaining)}
        />
      </div>
      <div className="bg-muted/50 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {expandedSection === "weak" && weakList.length > 0 && (
        <Card className="border-red-200/60 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <CardContent className="p-4 space-y-3">
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">
              Needs more practice — tap a word to train
              <span className="block text-[11px] font-normal opacity-80" dir="rtl">كلمات تحتاج تدريب أكثر — اضغط على الكلمة لتتدرب عليها</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {weakList.map(({ word, score }) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => onPracticeWords?.([word])}
                  className="group inline-flex items-center gap-1.5 bg-white dark:bg-red-950/40 border border-red-200/60 text-red-800 dark:text-red-300 px-3 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95"
                >
                  <Mic size={12} />
                  {word.word}
                  <span className="text-xs opacity-60">{score}%</span>
                </button>
              ))}
            </div>
            {weakList.length > 1 && onPracticeWords && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-xl border-red-200 text-red-700 hover:bg-red-600 hover:text-white"
                onClick={() => onPracticeWords(weakList.map((s) => s.word))}
              >
                <Target size={14} /> Practice all ({weakList.length})
                <span className="block text-[10px] font-normal opacity-80" dir="rtl">تدرب على الكل</span>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {expandedSection === "mastered" && masteredList.length > 0 && (
        <Card className="border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <CardContent className="p-4 space-y-3">
            <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              Practiced — tap a word to improve your score
              <span className="block text-[11px] font-normal opacity-80" dir="rtl">تم التدرب عليها — اضغط على الكلمة لتحسين درجتك</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {masteredList.map(({ word, score }) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => onPracticeWords?.([word])}
                  disabled={!onPracticeWords}
                  className="group flex items-center justify-between gap-2 bg-white dark:bg-emerald-950/40 border border-emerald-200/60 rounded-xl px-3 py-2 text-right transition-all hover:border-emerald-500 hover:shadow-sm active:scale-[0.98] disabled:cursor-default"
                >
                  <div className="min-w-0 flex items-center gap-1.5">
                    {onPracticeWords && (
                      <Mic size={12} className="shrink-0 text-emerald-600 opacity-60 group-hover:opacity-100" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-emerald-900 dark:text-emerald-200 truncate" dir="ltr">{word.word}</p>
                      <p className="text-[11px] text-emerald-700/70 truncate">{word.translation}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-black text-white bg-gradient-to-r ${scoreChipClasses(score)} px-2.5 py-1 rounded-full`}>
                    {score}%
                  </span>
                </button>
              ))}
            </div>
            {masteredList.length > 1 && onPracticeWords && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                onClick={() => onPracticeWords(masteredList.map((s) => s.word))}
              >
                <Target size={14} /> Improve all ({masteredList.length})
                <span className="block text-[10px] font-normal opacity-80" dir="rtl">حسّن الكل</span>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {expandedSection === "remaining" && remainingList.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <CardContent className="p-4 space-y-3">
            <p className="font-bold text-primary text-sm">
              Remaining words not practiced yet
              <span className="block text-[11px] font-normal opacity-80" dir="rtl">كلمات متبقية لم تُتدرَّب بعد</span>
            </p>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {remainingList.map((word) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => onPracticeWords?.([word])}
                  className="inline-flex items-center gap-1 bg-white border border-primary/20 text-foreground px-3 py-1 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  {word.word}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getLessonDisplayTitle(title: string): string {
  return curriculumLessonEn(title) ?? title;
}

function getLessonDisplaySubtitle(title: string): string | null {
  return curriculumLessonAr(title);
}

function LessonPicker({
  lessons, onSelect,
}: {
  lessons: Lesson[];
  onSelect: (lesson: Lesson) => void;
}) {
  const { curriculum, other } = partitionLessons(lessons);

  const renderCard = (lesson: Lesson, variant: "curriculum" | "default") => {
    const isCurriculum = isCurriculumLessonTitle(lesson.title);
    const meta = isCurriculum ? CURRICULUM_LESSON_META[lesson.title as keyof typeof CURRICULUM_LESSON_META] : null;
    const titleEn = curriculumLessonEn(lesson.title) ?? lesson.title;
    const titleAr = curriculumLessonAr(lesson.title);

    return (
      <button
        key={lesson.id}
        onClick={() => onSelect(lesson)}
        className={`group text-left w-full rounded-2xl p-5 border shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
          variant === "curriculum" && meta
            ? `bg-gradient-to-br ${meta.accent}`
            : "bg-card hover:border-primary/40"
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <BilingualText
            en={titleEn}
            ar={titleAr ?? ""}
            enClassName="text-lg font-bold group-hover:text-primary transition-colors"
            arClassName="text-[11px]"
          />
          {meta && (
            <Badge variant="outline" className="shrink-0 text-[10px] text-center">
              {meta.badgeEn}
              <span className="block text-[9px] font-normal opacity-70" dir="rtl">{meta.badge}</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-muted-foreground">
            {lesson.wordCount} words
            <span className="block text-[10px]" dir="rtl">{lesson.wordCount} كلمة</span>
          </span>
          <span className="inline-flex flex-col items-center gap-0.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="inline-flex items-center gap-1">Start <ArrowRight size={12} /></span>
            <span className="text-[9px] font-normal opacity-80 group-hover:opacity-90" dir="rtl">ابدأ</span>
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {curriculum.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-primary" />
            <SectionTitle en="Curriculum Lessons" ar="دروس المنهج" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculum.map((l) => renderCard(l, "curriculum"))}
          </div>
        </section>
      )}

      {other.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            <SectionTitle en="My Lessons" ar="دروسي" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {other.map((l) => renderCard(l, "default"))}
          </div>
        </section>
      )}
    </div>
  );
}

function ScoreSectionsPanel({
  scores,
  onPracticeWords,
  showPracticeHint = false,
}: {
  scores: { word: Word; score: number }[];
  onPracticeWords?: (words: Word[]) => void;
  showPracticeHint?: boolean;
}) {
  const best = aggregateBestScores(scores);
  const mastered = best
    .filter((s) => s.score >= PASS_THRESHOLD)
    .sort((a, b) => a.score - b.score);
  const needPractice = best
    .filter((s) => s.score < PASS_THRESHOLD)
    .sort((a, b) => a.score - b.score);

  if (mastered.length === 0 && needPractice.length === 0) return null;

  return (
    <div className="space-y-3">
      {needPractice.length > 0 && (
        <Card className="border-red-200/60 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/40">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 text-sm">
                <AlertCircle size={16} /> Needs Practice ({needPractice.length})
                <span className="block text-[11px] font-normal opacity-80" dir="rtl">تحتاج تدريب أكثر</span>
              </p>
              {showPracticeHint && onPracticeWords && (
                <span className="text-[11px] text-red-600/80 dark:text-red-400/70">
                  Tap a word to practice
                  <span className="block text-[10px]" dir="rtl">اضغط على الكلمة لتتدرب عليها</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {needPractice.map(({ word, score }) =>
                onPracticeWords ? (
                  <button
                    key={word.id}
                    type="button"
                    onClick={() => onPracticeWords([word])}
                    className="group inline-flex items-center gap-1.5 bg-white dark:bg-red-950/40 border border-red-200/60 dark:border-red-800/40 text-red-800 dark:text-red-300 px-3 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95 shadow-sm"
                  >
                    <Mic size={12} className="opacity-70 group-hover:opacity-100" />
                    {word.word}
                    <span className="text-xs opacity-60 group-hover:opacity-90">{score}%</span>
                  </button>
                ) : (
                  <span
                    key={word.id}
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-red-950/40 border border-red-200/60 dark:border-red-800/40 text-red-800 dark:text-red-300 px-3 py-1.5 rounded-full text-sm font-semibold"
                  >
                    {word.word}
                    <span className="text-xs opacity-60">{score}%</span>
                  </span>
                ),
              )}
            </div>
            {onPracticeWords && needPractice.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-xl border-red-200 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600"
                onClick={() => onPracticeWords(needPractice.map((s) => s.word))}
              >
                <Target size={14} /> تدرب على الكل ({needPractice.length})
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {mastered.length > 0 && (
        <Card className="border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/40">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} /> Practiced ({mastered.length})
                <span className="block text-[11px] font-normal opacity-80" dir="rtl">تم التدرب عليها</span>
              </p>
              {onPracticeWords && (
                <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70">
                  Tap a word to improve
                  <span className="block text-[10px]" dir="rtl">اضغط على الكلمة لتحسين درجتك</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mastered.map(({ word, score }) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => onPracticeWords?.([word])}
                  disabled={!onPracticeWords}
                  className="group flex items-center justify-between gap-2 bg-white dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl px-3 py-2 shadow-sm text-right transition-all hover:border-emerald-500 hover:shadow active:scale-[0.98] disabled:cursor-default"
                >
                  <div className="min-w-0 flex items-center gap-1.5">
                    {onPracticeWords && (
                      <Mic size={12} className="shrink-0 text-emerald-600 opacity-60 group-hover:opacity-100" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-emerald-900 dark:text-emerald-200 truncate" dir="ltr">{word.word}</p>
                      <p className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70 truncate">{word.translation}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-black text-white bg-gradient-to-r ${scoreChipClasses(score)} px-2.5 py-1 rounded-full`}>
                    {score}%
                  </span>
                </button>
              ))}
            </div>
            {onPracticeWords && mastered.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                onClick={() => onPracticeWords(mastered.map((s) => s.word))}
              >
                <Target size={14} /> حسّن الكل ({mastered.length})
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function aggregateBestScores(
  scores: { word: Word; score: number }[],
): { word: Word; score: number }[] {
  const best = new Map<number, { word: Word; score: number }>();
  for (const entry of scores) {
    const prev = best.get(entry.word.id);
    if (!prev || entry.score > prev.score) best.set(entry.word.id, entry);
  }
  return Array.from(best.values());
}

/** Merge saved DB scores with live session scores for the full lesson display. */
function getLessonDisplayScores(
  lessonWords: Word[],
  savedByWordId: Map<number, number>,
  sessionScores: { word: Word; score: number }[],
): { word: Word; score: number }[] {
  const fromSaved = lessonWords
    .filter((w) => savedByWordId.has(w.id))
    .map((w) => ({ word: w, score: savedByWordId.get(w.id) as number }));
  return aggregateBestScores([...fromSaved, ...sessionScores]);
}

function scoreChipClasses(score: number): string {
  if (score >= 95) return "from-emerald-500 to-green-500";
  if (score >= 88) return "from-emerald-400 to-teal-500";
  return "from-teal-400 to-emerald-400";
}

function ResultsSummary({
  scores, lessonTitle, onPracticeWords, onRestart, onChangeLesson,
}: {
  scores: { word: Word; score: number }[];
  lessonTitle: string;
  onPracticeWords: (words: Word[]) => void;
  onRestart: () => void;
  onChangeLesson: () => void;
}) {
  const best = aggregateBestScores(scores);
  // Ascending by score (80 → 100), exactly as requested.
  const mastered = best
    .filter((s) => s.score >= PASS_THRESHOLD)
    .sort((a, b) => a.score - b.score);
  const needPractice = best
    .filter((s) => s.score < PASS_THRESHOLD)
    .sort((a, b) => a.score - b.score);
  const weakWords = needPractice.map((s) => s.word);
  const avg = best.length > 0
    ? Math.round(best.reduce((acc, s) => acc + s.score, 0) / best.length)
    : 0;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-3 py-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Trophy className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold">Great job! Lesson complete</h2>
        <p className="text-sm text-muted-foreground" dir="rtl">أحسنت! انتهيت من الدرس</p>
        <p className="text-muted-foreground text-sm">{lessonTitle}</p>
        <p className="text-5xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">{avg}%</p>
        <p className="text-muted-foreground text-sm">
          Average score
          <span className="block text-[11px]" dir="rtl">متوسط النتيجة</span>
        </p>
      </div>

      {needPractice.length > 0 || mastered.length > 0 ? (
        <ScoreSectionsPanel
          scores={scores}
          onPracticeWords={onPracticeWords}
          showPracticeHint
        />
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3">
        {weakWords.length > 0 && (
          <Button variant="outline" className="flex-1 gap-2 rounded-xl h-11 flex-col" onClick={() => onPracticeWords(weakWords)}>
            <span className="inline-flex items-center gap-2"><Target size={16} /> Practice all ({weakWords.length})</span>
            <span className="text-[10px] font-normal opacity-80" dir="rtl">تدرب على الكل</span>
          </Button>
        )}
        <Button className="flex-1 gap-2 rounded-xl h-11 flex-col" onClick={onRestart}>
          <span className="inline-flex items-center gap-2"><RotateCcw size={16} /> Restart lesson</span>
          <span className="text-[10px] font-normal opacity-80" dir="rtl">إعادة الدرس</span>
        </Button>
        <Button variant="secondary" className="flex-1 gap-2 rounded-xl h-11 flex-col" onClick={onChangeLesson}>
          <span className="inline-flex items-center gap-2"><BookOpen size={16} /> Another lesson</span>
          <span className="text-[10px] font-normal opacity-80" dir="rtl">درس آخر</span>
        </Button>
      </div>
    </div>
  );
}

interface SessionState {
  queue: Word[];
  completed: Word[];
  needsMoreTraining: Word[];
  attemptCounts: Map<number, number>;
  practicedIds: Set<number>;
  scores: { word: Word; score: number }[];
  isReviewRound: boolean;
  totalInSession: number;
}

function initSession(
  lessonWords: Word[],
  seedScores: { word: Word; score: number }[] = [],
): SessionState {
  return {
    queue: shuffle(lessonWords),
    completed: [],
    needsMoreTraining: [],
    attemptCounts: new Map(),
    practicedIds: new Set(),
    // Saved per-student scores seed the session so the classification
    // (mastered / needs-training) is restored and never lost between visits.
    scores: aggregateBestScores(seedScores),
    isReviewRound: false,
    totalInSession: lessonWords.length,
  };
}

function advanceSession(state: SessionState, word: Word, score: number): SessionState {
  const practicedIds = new Set(state.practicedIds);
  practicedIds.add(word.id);
  const scores = aggregateBestScores([...state.scores, { word, score }]);
  const attemptCounts = new Map(state.attemptCounts);

  if (score >= PASS_THRESHOLD) {
    const queue = state.queue.slice(1);
    const completed = [...state.completed, word];
    return resolveQueueEmpty({ ...state, queue, completed, practicedIds, scores, attemptCounts }, word);
  }

  const failures = (attemptCounts.get(word.id) ?? 0) + 1;
  attemptCounts.set(word.id, failures);

  let queue = state.queue.slice(1);
  let needsMoreTraining = state.needsMoreTraining;

  if (failures >= WEAK_AFTER_FAILURES) {
    needsMoreTraining = [...needsMoreTraining, word];
  } else {
    queue = [...queue, word];
  }

  return resolveQueueEmpty({
    ...state,
    queue,
    needsMoreTraining,
    practicedIds,
    scores,
    attemptCounts,
  }, word);
}

function resolveQueueEmpty(state: SessionState, _lastWord: Word): SessionState {
  if (state.queue.length > 0) return state;

  if (!state.isReviewRound && state.completed.length > 0) {
    return {
      ...state,
      queue: shuffle(state.completed),
      completed: [],
      isReviewRound: true,
    };
  }

  return state;
}

function isSessionComplete(state: SessionState, totalWords: number): boolean {
  return state.queue.length === 0
    && state.practicedIds.size >= totalWords
    && (state.isReviewRound || state.completed.length === 0);
}

export default function Pronunciation() {
  const { data: lessons, isLoading: lessonsLoading } = useGetLessons();
  const { student } = useStudent();
  const queryClient = useQueryClient();

  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(() => {
    // Deep-link support: /pronunciation?lesson=<id> jumps straight into a lesson
    // (used by the Progress page cards).
    if (typeof window === "undefined") return null;
    const raw = new URLSearchParams(window.location.search).get("lesson");
    const id = raw != null ? Number(raw) : NaN;
    return Number.isFinite(id) && id > 0 ? id : null;
  });
  const [session, setSession] = useState<SessionState | null>(null);
  const [done, setDone] = useState(false);
  const [practiceWeakOnly, setPracticeWeakOnly] = useState(false);
  const [expandedSection, setExpandedSection] = useState<StatsSection | null>(null);

  const { data: lesson, isLoading: lessonLoading } = useGetLesson(selectedLessonId ?? 0);

  // Saved per-student scores so the classification persists across visits.
  const progressParams = student?.id != null ? { studentId: student.id } : undefined;
  const { data: savedProgress, isLoading: progressLoading } = useGetProgress(
    progressParams,
    { query: { enabled: student?.id != null } },
  );

  // Local fallback scores (also covers guests / not-logged-in) so the
  // classification survives leaving and re-entering a lesson.
  const [localScoreMap, setLocalScoreMap] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    if (selectedLessonId == null) {
      setLocalScoreMap(new Map());
      return;
    }
    setLocalScoreMap(loadLocalScores(student?.id ?? null, selectedLessonId));
  }, [selectedLessonId, student?.id]);

  const savedScoreByWordId = useMemo(() => {
    const map = new Map<number, number>();
    for (const p of savedProgress ?? []) {
      const prev = map.get(p.wordId);
      if (prev == null || p.score > prev) map.set(p.wordId, p.score);
    }
    // Merge local fallback scores (best wins).
    for (const [wordId, score] of localScoreMap) {
      const prev = map.get(wordId);
      if (prev == null || score > prev) map.set(wordId, score);
    }
    return map;
  }, [savedProgress, localScoreMap]);

  const lessonWords = useMemo(() => lesson?.words ?? [], [lesson?.words]);
  const allLessons = Array.isArray(lessons) ? lessons : [];

  const buildSeed = useCallback(
    (words: Word[]) =>
      words
        .filter((w) => savedScoreByWordId.has(w.id))
        .map((w) => ({ word: w, score: savedScoreByWordId.get(w.id) as number })),
    [savedScoreByWordId],
  );

  usePrefetchWordImages(
    lessonWords.map((w) => w.id),
    0,
  );

  const startLesson = useCallback((l: Lesson) => {
    setSelectedLessonId(l.id);
    setDone(false);
    setPracticeWeakOnly(false);
    setExpandedSection(null);
    setSession(null);
  }, []);

  useEffect(() => {
    // Wait for saved progress (when logged in) so scores seed the session and the
    // classification shows immediately instead of resetting to zero.
    const progressReady = student?.id == null || !progressLoading;
    if (lesson && lessonWords.length > 0 && session === null && !done && selectedLessonId != null && progressReady) {
      setSession(initSession(lessonWords, buildSeed(lessonWords)));
    }
  }, [lesson, lessonWords, session, done, selectedLessonId, progressLoading, student?.id, buildSeed]);

  const handleScoreRecorded = useCallback((word: Word, score: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        scores: aggregateBestScores([...prev.scores, { word, score }]),
      };
    });
    // Persist immediately (local fallback) so the classification is never lost,
    // even if the learner exits before pressing «التالي» or isn't logged in.
    if (selectedLessonId != null) {
      saveLocalScore(student?.id ?? null, selectedLessonId, word.id, score);
      setLocalScoreMap((prev) => {
        const existing = prev.get(word.id);
        if (existing != null && existing >= score) return prev;
        const next = new Map(prev);
        next.set(word.id, score);
        return next;
      });
    }
    if (score < PASS_THRESHOLD) {
      setExpandedSection("weak");
    } else {
      setExpandedSection("mastered");
    }
  }, [selectedLessonId, student?.id]);

  // Keep the saved-progress cache fresh so the classification survives navigation.
  const handleProgressPersisted = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey(progressParams) });
    queryClient.invalidateQueries({ queryKey: getGetProgressStatsQueryKey(progressParams) });
  }, [queryClient, progressParams]);

  const handleToggleSection = useCallback((section: StatsSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  const handleNext = (score: number) => {
    if (!session || session.queue.length === 0) return;
    const word = session.queue[0];
    const next = advanceSession(session, word, score);

    if (isSessionComplete(next, next.totalInSession)) {
      setSession(next);
      setDone(true);
    } else if (next.queue.length === 0 && next.completed.length === 0 && next.needsMoreTraining.length > 0) {
      setSession(next);
      setDone(true);
    } else {
      setSession(next);
    }
  };

  const handleExitLesson = () => {
    setSelectedLessonId(null);
    setSession(null);
    setDone(false);
    setPracticeWeakOnly(false);
    setExpandedSection(null);
  };

  const handleRestart = () => {
    if (lessonWords.length > 0) {
      setSession(initSession(lessonWords, buildSeed(lessonWords)));
      setDone(false);
      setPracticeWeakOnly(false);
    }
  };

  const handlePracticeWords = (words: Word[]) => {
    if (words.length === 0 || !session) return;
    // Only change the practice queue — keep all lesson scores so the top
    // sections never zero out when drilling a single weak word.
    setSession({
      ...session,
      queue: shuffle(words),
      completed: [],
      needsMoreTraining: [],
      attemptCounts: new Map(),
      practicedIds: new Set(),
      isReviewRound: false,
      totalInSession: words.length,
    });
    setDone(false);
    setPracticeWeakOnly(true);
    // Keep whichever section the learner opened expanded; it self-corrects after
    // the next attempt (mastered ↔ weak) based on the new score.
  };

  const isLoading = lessonsLoading || (selectedLessonId != null && lessonLoading);

  if (isLoading && selectedLessonId == null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <BilingualText en="Loading..." ar="جارٍ التحميل..." enClassName="text-sm" />
        </div>
      </div>
    );
  }

  if (allLessons.length === 0) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <Sparkles className="mx-auto text-primary" size={48} />
        <PageTitle en="Pronunciation Practice" ar="تدريب النطق" className="text-center" />
        <BilingualText
          en="Add lessons with words to start practicing."
          ar="أضف دروساً بكلمات لتبدأ التدريب."
          enClassName="text-muted-foreground text-sm"
          arClassName="text-xs"
        />
      </div>
    );
  }

  if (selectedLessonId == null) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-orange-500/5 to-background border border-primary/10 p-6 sm:p-8">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              <Mic size={14} /> Interactive Practice
              <span className="text-[10px] font-normal opacity-80" dir="rtl">· تدريب تفاعلي</span>
            </div>
            <PageTitle en="Pronunciation Practice" ar="تدريب النطق" />
          </div>
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
        </div>
        <LessonPicker lessons={allLessons} onSelect={startLesson} />
      </div>
    );
  }

  if (lessonLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <BilingualText en="Loading lesson..." ar="جارٍ تحميل الدرس..." enClassName="text-sm" />
        </div>
      </div>
    );
  }

  const lessonTitle = getLessonDisplayTitle(lesson?.title ?? "");
  const lessonSubtitle = getLessonDisplaySubtitle(lesson?.title ?? "");
  const displayScores = getLessonDisplayScores(
    lessonWords,
    savedScoreByWordId,
    session.scores,
  );

  if (done) {
    return (
      <div className="space-y-6">
        <ResultsSummary
          scores={displayScores}
          lessonTitle={lessonTitle}
          onPracticeWords={handlePracticeWords}
          onRestart={handleRestart}
          onChangeLesson={handleExitLesson}
        />
      </div>
    );
  }

  const currentWord = session.queue[0];
  if (!currentWord) {
    return (
      <div className="text-center py-16 space-y-4">
        <BilingualText en="No words in this lesson." ar="لا توجد كلمات في هذا الدرس." enClassName="text-muted-foreground" />
        <Button onClick={handleExitLesson} className="flex flex-col h-auto py-2 gap-0.5">
          Choose another lesson
          <span className="text-[10px] font-normal opacity-80" dir="rtl">اختر درساً آخر</span>
        </Button>
      </div>
    );
  }

  const totalWords = lessonWords.length;
  const bestScores = displayScores;
  const masteredList = bestScores
    .filter((s) => s.score >= PASS_THRESHOLD)
    .sort((a, b) => a.score - b.score);
  const weakList = bestScores
    .filter((s) => s.score < PASS_THRESHOLD)
    .sort((a, b) => a.score - b.score);
  const scoredIds = new Set(bestScores.map((s) => s.word.id));
  const remainingList = lessonWords.filter((w) => !scoredIds.has(w.id));
  const masteredCount = masteredList.length;
  const weakCount = weakList.length;
  const remaining = remainingList.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold">
              {practiceWeakOnly ? "Weak words practice" : session.isReviewRound ? "Review round" : "First round"}
              <span className="block text-[9px] font-normal opacity-70" dir="rtl">
                {practiceWeakOnly ? "تدريب الكلمات الضعيفة" : session.isReviewRound ? "جولة مراجعة" : "جولة أولى"}
              </span>
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{lessonTitle}</h1>
          {lessonSubtitle && <p className="text-xs text-muted-foreground" dir="rtl">{lessonSubtitle}</p>}
          <p className="text-muted-foreground text-sm mt-0.5">
            Look at the image and say the English word
            <span className="block text-[11px]" dir="rtl">انظر للصورة وانطق الكلمة الإنجليزية</span>
          </p>
        </div>
      </div>

      <SessionStatsBar
        total={totalWords}
        practiced={masteredCount}
        weak={weakCount}
        remaining={remaining}
        masteredList={masteredList}
        weakList={weakList}
        remainingList={remainingList}
        expandedSection={expandedSection}
        onToggleSection={handleToggleSection}
        onPracticeWords={handlePracticeWords}
      />

      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardContent className="p-5 sm:p-8">
          <PronunciationCard
            key={currentWord.id}
            word={currentWord}
            onNext={handleNext}
            onExit={handleExitLesson}
            onScoreRecorded={handleScoreRecorded}
            onProgressPersisted={handleProgressPersisted}
          />
        </CardContent>
      </Card>
    </div>
  );
}
