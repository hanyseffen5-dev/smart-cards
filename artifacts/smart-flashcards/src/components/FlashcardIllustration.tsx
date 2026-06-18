import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchImageBlob } from "@/lib/load-image";

type Size = "card" | "medium" | "large";

const SIZE_CLASS: Record<Size, string> = {
  card: "h-full w-full",
  medium: "w-40 h-40",
  large: "w-full h-full max-w-xs",
};

export function FlashcardIllustration({
  src,
  alt,
  size = "card",
  className,
  onError,
  priority = false,
  compact = false,
}: {
  src: string;
  alt: string;
  size?: Size;
  className?: string;
  onError?: () => void;
  /** Eager load + fetchPriority high for the visible card. */
  priority?: boolean;
  /** Compact progress bar for thumbnails and grid cards. */
  compact?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setProgress(0);
    setErrored(false);
    setBlobUrl(null);

    const controller = new AbortController();
    let objectUrl: string | null = null;

    void fetchImageBlob(src, controller.signal, setProgress)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
        setLoaded(true);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setErrored(true);
        onError?.();
        if (err instanceof Error && err.message !== "HTTP 404") {
          console.warn("[FlashcardIllustration] load failed:", err.message);
        }
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src, onError]);

  const showLoading = !loaded && !errored;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#f5f0e8] shadow-md",
        SIZE_CLASS[size],
        className,
      )}
    >
      {showLoading && (
        <div
          className={cn(
            "absolute inset-0 z-10 flex flex-col items-center justify-center",
            compact ? "gap-1 px-2" : "gap-3 px-6",
          )}
        >
          <div className={cn("w-full space-y-1", compact ? "max-w-[72px]" : "max-w-[140px]")}>
            <div className={cn("w-full rounded-full bg-primary/15 overflow-hidden", compact ? "h-1" : "h-2")}>
              <div
                className="h-full rounded-full bg-primary transition-all duration-150 ease-out"
                style={{ width: `${Math.max(progress, 4)}%` }}
              />
            </div>
            <p
              className={cn(
                "text-center font-semibold text-primary tabular-nums",
                compact ? "text-[10px]" : "text-sm",
              )}
            >
              {progress}%
            </p>
          </div>
          {!compact && (
            <span className="text-xs text-muted-foreground">جاري تحميل الصورة...</span>
          )}
        </div>
      )}
      {blobUrl && (
        <img
          src={blobUrl}
          alt={alt}
          draggable={false}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className={cn(
            "max-h-full max-w-full object-contain select-none transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
