/** In-memory cache of TTS reference audio blobs keyed by English word. */
const cache = new Map<string, Promise<Blob>>();

export function getReferenceAudio(word: string, example?: string | null): Promise<Blob> {
  const key = word.toLowerCase().trim();
  const existing = cache.get(key);
  if (existing) return existing;

  const pending = fetch("/api/ai/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, example: example ?? undefined }),
  }).then(async (res) => {
    if (!res.ok) throw new Error("TTS failed");
    return res.blob();
  });

  cache.set(key, pending);
  pending.catch(() => cache.delete(key));
  return pending;
}

export function preloadReferenceAudio(word: string, example?: string | null): void {
  void getReferenceAudio(word, example).catch(() => undefined);
}
