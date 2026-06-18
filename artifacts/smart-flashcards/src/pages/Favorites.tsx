import React, { useState } from "react";
import { useGetWords, useGetFavorites } from "@workspace/api-client-react";
import { useStudent } from "../lib/use-student";
import { useFavoriteToggle } from "../lib/use-favorite-toggle";
import { Star, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BilingualText, PageTitle, SectionTitle } from "@/components/ui/bilingual-text";
import { WordImage } from "@/components/WordImage";
import { usePrefetchWordImages } from "@/hooks/use-prefetch-word-images";

export default function Favorites() {
  const { student } = useStudent();
  const studentId = student?.id;
  const { data: words, isLoading: wordsLoading } = useGetWords();
  const { data: favorites, isLoading: favLoading } = useGetFavorites(
    { studentId: studentId ?? 0 },
    { query: { enabled: studentId != null } },
  );
  const { toggle: toggleFavorite, isPending: favoriteTogglePending } =
    useFavoriteToggle(studentId);
  const [flippedId, setFlippedId] = useState<number | null>(null);

  const isLoading = wordsLoading || favLoading || !student;

  const favoriteWordIds = new Set(favorites?.map((f) => f.wordId) ?? []);
  const favoriteWords = (words ?? []).filter((w) => favoriteWordIds.has(w.id));
  const favoriteIds = favoriteWords.map((w) => w.id);

  usePrefetchWordImages(favoriteIds, 0, Math.min(favoriteIds.length, 12));

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleFavorite = (wordId: number) => {
    toggleFavorite(wordId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <BilingualText en="Loading..." ar="جارٍ التحميل..." enClassName="text-muted-foreground animate-pulse" />
      </div>
    );
  }

  if (favoriteWords.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <Star className="mx-auto text-muted-foreground" size={48} />
        <SectionTitle en="No favorite words yet" ar="لا توجد كلمات مفضلة" />
        <BilingualText
          en="Star words while studying and they will appear here"
          ar="أضف كلمات للمفضلة أثناء الدراسة لتظهر هنا"
          enClassName="text-muted-foreground text-sm"
          arClassName="text-xs"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <PageTitle en="Favorites" ar="المفضلة" />
        <p className="text-muted-foreground mt-1 text-sm">
          {favoriteWords.length} saved {favoriteWords.length === 1 ? "word" : "words"}
          <span className="block text-[11px]" dir="rtl">{favoriteWords.length} كلمة محفوظة</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favoriteWords.map((word) => {
          const isFlipped = flippedId === word.id;
          return (
            <div
              key={word.id}
              className="relative cursor-pointer"
              style={{ perspective: "1000px", height: "200px" }}
              onClick={() => setFlippedId(isFlipped ? null : word.id)}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl bg-card border-2 border-primary/20 flex flex-col items-center justify-center p-4"
                  style={{
                    backfaceVisibility: "hidden",
                    pointerEvents: isFlipped ? "none" : "auto",
                  }}
                >
                  <WordImage word={word} size="thumb" />
                  <p className="text-xs text-muted-foreground text-center">
                    Tap to reveal
                    <span className="block text-[10px]" dir="rtl">اضغط للكشف</span>
                  </p>
                </div>

                <div
                  className="absolute inset-0 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 space-y-2"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    pointerEvents: isFlipped ? "auto" : "none",
                  }}
                >
                  <p className="text-2xl font-bold">{word.word}</p>
                  <p className="text-lg opacity-90" dir="rtl">{word.translation}</p>
                  {word.example && (
                    <p className="text-xs opacity-75 text-center line-clamp-2">{word.example}</p>
                  )}
                  <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-full text-primary-foreground hover:bg-white/20"
                      onClick={() => speak(word.word)}
                    >
                      <Volume2 size={14} />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={favoriteTogglePending}
                      className="w-8 h-8 rounded-full text-primary-foreground hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(word.id);
                      }}
                    >
                      <Star size={14} fill="currentColor" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
