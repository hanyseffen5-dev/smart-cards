/** Background image/translation workers are off by default so API + login stay responsive (especially with PGlite). */
export function isBackgroundWorkersEnabled(): boolean {
  const v = process.env.BACKGROUND_WORKERS?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return false;
  const lower = key.toLowerCase();
  if (
    lower.includes("your_gemini") ||
    lower.includes("changeme") ||
    lower === "xxx"
  ) {
    return false;
  }
  return key.length >= 20;
}
