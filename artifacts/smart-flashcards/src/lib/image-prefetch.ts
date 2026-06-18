import { apiFetch } from "./api-fetch";
import { wordImageUrl } from "./word-image-url";

/**
 * Shared image pre-fetch module — scalable for thousands of concurrent students.
 *
 * Strategy:
 *   1. One request to GET /api/words/images-ready → server returns all ready IDs at once.
 *      The server caches this response 60s so thousands of students share the same answer.
 *   2. Pre-load confirmed images into the browser cache in small batches using <img> tags.
 *      The server sets Cache-Control: immutable/7 days so the image is fetched only once per browser.
 *   3. Words not yet ready are polled by re-calling /images-ready every 30 seconds —
 *      still one request per poll, not one per word.
 *
 * Result: O(1) server requests per student instead of O(n) — completely independent of word count.
 */

/** In-memory set of word IDs whose images are confirmed ready in this browser session. */
export const imageReady = new Set<number>();

/** Single HEAD fallback — used only inside `useWordImage` for the current card. */
export async function checkImageExists(wordId: number): Promise<boolean> {
  if (imageReady.has(wordId)) return true;
  const r = await apiFetch(
    wordImageUrl(wordId),
    { method: "HEAD" },
  ).catch(() => null);
  if (r && r.ok) {
    imageReady.add(wordId);
    return true;
  }
  if (imageReady.has(wordId)) imageReady.delete(wordId);
  return false;
}

function preloadIntoBrowserCache(wordId: number): void {
  const img = new window.Image();
  img.src = wordImageUrl(wordId);
}

/** Pre-load nearby cards (current + next few) — avoids saturating bandwidth on large lessons. */
export function prefetchNearbyImages(wordIds: number[], centerIndex: number, windowSize = 6): void {
  const start = Math.max(0, centerIndex);
  const end = Math.min(wordIds.length, centerIndex + windowSize);
  for (let i = start; i < end; i++) {
    preloadIntoBrowserCache(wordIds[i]!);
  }
}

/** @deprecated Prefer prefetchNearbyImages — loading all images at once slows the current card. */
export function prefetchPriorityImages(wordIds: number[]): void {
  for (const id of wordIds) preloadIntoBrowserCache(id);
}

/** Clear session tracking when stored images change (IMAGE_CACHE_VERSION bump). */
export function clearImageReadyCache(): void {
  imageReady.clear();
}

/** Fetch the list of ready IDs from the server (one request, cached 60s server-side). */
async function fetchReadyIds(): Promise<number[]> {
  const r = await apiFetch("/api/words/images-ready").catch(() => null);
  if (!r || !r.ok) return [];
  const data = (await r.json()) as { readyIds: number[] };
  return data.readyIds ?? [];
}

/**
 * Main prefetch function.
 *
 * - Calls the server once to get all ready image IDs.
 * - Marks them in `imageReady` and loads them into browser cache in batches.
 * - Keeps polling every 30 seconds for words whose images are still being generated.
 *
 * @param wordIds  IDs of all words to track (the full list for this page).
 * @param signal   AbortController signal — cancel when component unmounts.
 * @param onReady  Optional callback fired when a new image becomes ready.
 */
export function resetImageReadyCache(wordIds: number[]): void {
  for (const id of wordIds) imageReady.delete(id);
}

/** Remove all stored images for a lesson (does not generate new ones). */
export async function clearLessonImages(
  lessonId: number,
  wordIds?: number[],
): Promise<number> {
  const r = await apiFetch(`/api/lessons/${lessonId}/images`, { method: "DELETE" });
  if (!r.ok) {
    const body = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Failed to clear images (${r.status})`);
  }
  const data = (await r.json()) as { cleared: number };
  if (wordIds?.length) resetImageReadyCache(wordIds);
  return data.cleared ?? 0;
}

/** Bulk lesson image generation is disabled on the server. */
export function triggerLessonImageGeneration(
  _lessonId: number,
  _options?: { force?: boolean },
): void {
  // no-op — use POST /api/words/:id/generate-image?confirm=true for a single card
}

export async function prefetchAllImages(
  wordIds: number[],
  signal?: AbortSignal,
  onReady?: (wordId: number) => void,
): Promise<void> {
  const wordSet = new Set(wordIds);
  const BATCH = 8;
  const POLL_INTERVAL_MS = 30_000;

  const applyReadyIds = (readyIds: number[]) => {
    const newlyReady: number[] = [];
    for (const id of readyIds) {
      if (wordSet.has(id) && !imageReady.has(id)) {
        imageReady.add(id);
        newlyReady.push(id);
        onReady?.(id);
      }
    }
    // Pre-load newly confirmed images into browser cache in small batches
    for (let i = 0; i < newlyReady.length; i += BATCH) {
      const batch = newlyReady.slice(i, i + BATCH);
      batch.forEach(preloadIntoBrowserCache);
    }
    return newlyReady.length;
  };

  // Initial check
  let readyIds = await fetchReadyIds();
  if (signal?.aborted) return;
  applyReadyIds(readyIds);

  // If some words still don't have images, keep polling until all are ready
  const pendingCount = () => wordIds.filter((id) => !imageReady.has(id)).length;

  while (!signal?.aborted && pendingCount() > 0) {
    await new Promise<void>((res) => {
      const t = setTimeout(res, POLL_INTERVAL_MS);
      signal?.addEventListener("abort", () => { clearTimeout(t); res(); }, { once: true });
    });
    if (signal?.aborted) break;
    readyIds = await fetchReadyIds();
    if (signal?.aborted) break;
    const newly = applyReadyIds(readyIds);
    if (newly === 0 && pendingCount() > 0) continue; // still waiting, keep going
  }
}
