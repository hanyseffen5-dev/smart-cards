import { useCallback, useEffect, useState } from "react";
import type { Word } from "@workspace/api-client-react";
import { IMAGE_CACHE_VERSION } from "./image-cache-version";
import { wordImageUrl } from "./word-image-url";

/** Resolve image URL via API; fall back to letter placeholder on 404. */
export function useWordImage(word: Pick<Word, "id">) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [word.id, IMAGE_CACHE_VERSION]);

  const imageUrl = failed ? null : wordImageUrl(word.id);
  const onImageError = useCallback(() => setFailed(true), []);

  return { imageUrl, failed, onImageError };
}
