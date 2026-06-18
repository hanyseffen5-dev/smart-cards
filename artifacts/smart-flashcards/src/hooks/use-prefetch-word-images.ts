import { useEffect } from "react";
import { prefetchNearbyImages } from "@/lib/image-prefetch";

/** Pre-load images for nearby words (current + next few) — used on all study views. */
export function usePrefetchWordImages(
  wordIds: number[],
  centerIndex: number,
  windowSize = 6,
): void {
  const idsKey = wordIds.join(",");
  useEffect(() => {
    if (!wordIds.length) return;
    prefetchNearbyImages(wordIds, centerIndex, windowSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, centerIndex, windowSize]);
}
