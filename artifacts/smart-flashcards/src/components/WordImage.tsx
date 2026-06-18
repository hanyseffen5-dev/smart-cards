import React from "react";
import type { Word } from "@workspace/api-client-react";
import { FlashcardIllustration } from "@/components/FlashcardIllustration";
import { useWordImage } from "@/lib/use-word-image";
import { cn } from "@/lib/utils";

type Size = "card" | "medium" | "large" | "thumb";

const FALLBACK_SIZE: Record<Size, string> = {
  card: "h-full w-2/3 max-w-sm mx-auto rounded-2xl",
  medium: "w-40 h-40 rounded-2xl",
  large: "w-full h-full rounded-2xl",
  thumb: "w-20 h-20 rounded-xl mb-2",
};

const LETTER_SIZE: Record<Size, string> = {
  card: "text-8xl sm:text-9xl",
  medium: "text-5xl",
  large: "text-7xl",
  thumb: "text-4xl",
};

export function WordImage({
  word,
  size = "card",
  priority = false,
  compact = false,
  className,
  fallbackClassName,
}: {
  word: Pick<Word, "id" | "word">;
  size?: Size;
  priority?: boolean;
  /** Smaller progress UI for grid thumbnails. */
  compact?: boolean;
  className?: string;
  fallbackClassName?: string;
}) {
  const { imageUrl, onImageError } = useWordImage(word);

  if (imageUrl) {
    return (
      <FlashcardIllustration
        src={imageUrl}
        alt={word.word}
        size={size === "thumb" ? "medium" : size}
        priority={priority}
        compact={compact || size === "thumb"}
        className={cn(size === "thumb" && "w-20 h-20 mb-2 shadow-sm", className)}
        onError={onImageError}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10 flex flex-col items-center justify-center gap-2 shadow-inner border border-primary/10",
        FALLBACK_SIZE[size],
        fallbackClassName,
      )}
    >
      <span className={cn("font-black text-primary/40 select-none", LETTER_SIZE[size])}>
        {word.word[0]?.toUpperCase()}
      </span>
    </div>
  );
}
