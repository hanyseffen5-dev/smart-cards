import { translateToArabic as translateWithGemini } from "./gemini";

function isGeminiUnavailableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("429") ||
    msg.includes("404") ||
    msg.includes("quota") ||
    msg.includes("API_KEY_INVALID") ||
    msg.includes("API key not valid") ||
    msg.includes("not found for API version")
  );
}

/** Free fallback when Gemini quota/key/model fails (MyMemory — no API key). */
export async function translateToArabicWithMyMemory(
  englishText: string,
): Promise<string> {
  const text = englishText.trim();
  if (!text) return "";

  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", "en|ar");

  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) {
    throw new Error(`Translation service failed (${res.status})`);
  }

  const json = (await res.json()) as {
    responseData?: { translatedText?: string };
  };
  const translated = json.responseData?.translatedText?.trim() ?? "";
  if (!translated) {
    throw new Error("Translation service returned empty text");
  }
  if (translated.toUpperCase().includes("MYMEMORY WARNING")) {
    throw new Error("Translation service is busy — please try again in a minute");
  }
  return translated;
}

/** Gemini when available; otherwise MyMemory so example sentences always translate. */
export async function translateExampleToArabic(englishText: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (key && key.length >= 20) {
    try {
      return (await translateWithGemini(englishText)).trim();
    } catch (err) {
      if (!isGeminiUnavailableError(err)) throw err;
    }
  }
  return translateToArabicWithMyMemory(englishText);
}
