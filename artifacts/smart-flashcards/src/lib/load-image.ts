/** Fetch an image with byte-level progress (uses Content-Length when available). */
export async function fetchImageBlob(
  url: string,
  signal: AbortSignal,
  onProgress?: (pct: number) => void,
): Promise<Blob> {
  const response = await fetch(url, { signal, cache: "default" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentLength = Number(response.headers.get("Content-Length") ?? 0);
  const body = response.body;

  if (!body || contentLength <= 0) {
    onProgress?.(40);
    const blob = await response.blob();
    onProgress?.(100);
    return blob;
  }

  const reader = body.getReader();
  const chunks: BlobPart[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress?.(Math.min(99, Math.round((received / contentLength) * 100)));
  }

  onProgress?.(100);
  const type = response.headers.get("Content-Type") ?? "image/png";
  return new Blob(chunks, { type });
}
