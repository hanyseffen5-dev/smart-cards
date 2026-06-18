/**
 * Build Pollinations scene text from the card-back example sentence (source of truth).
 */
export function sceneForCard(word, example, manualScene) {
  const ex = (example || "").trim().replace(/\s+/g, " ");
  const manual = (manualScene || "").trim().replace(/Matches:.*$/i, "").trim();

  if (manual && ex) {
    return `${manual} The picture must clearly illustrate this exact sentence: "${ex}"`;
  }
  if (manual) return manual;
  if (ex) {
    return (
      `Premium children's vocabulary flashcard illustration for the English word "${word}". ` +
      `One simple, colorful, friendly cartoon scene that makes this sentence obvious: "${ex}". ` +
      `Single clear action, warm lighting, easy for kids ages 8–12.`
    );
  }
  return `Friendly children's flashcard illustration showing the meaning of "${word}".`;
}

/** Misc lesson composite layout — illustration left, empty orange panel right (then cropped). */
export const STYLE_MISC_COMPOSITE =
  "Wide premium educational flashcard composite 16:9, LEFT 58% high-quality flat vector children's illustration on soft cream margin, RIGHT 42% solid warm orange panel completely empty with NO text NO letters NO symbols, vibrant clean pastels, professional school flashcard quality, cute rounded characters, crisp outlines, NOT photorealistic";
