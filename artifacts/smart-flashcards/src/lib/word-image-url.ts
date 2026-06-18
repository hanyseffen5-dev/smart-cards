import { apiUrl } from "./api-fetch";
import { IMAGE_CACHE_VERSION } from "./image-cache-version";

/** Canonical lazy-load URL for any word image (all lessons). */
export function wordImageUrl(wordId: number): string {
  return apiUrl(`/api/words/${wordId}/image?v=${IMAGE_CACHE_VERSION}`);
}
