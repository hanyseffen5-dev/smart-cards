import { eq } from "drizzle-orm";
import { db, wordsTable } from "@workspace/db";
import { generateWordImage } from "@workspace/integrations-openai-ai-server";
import { resolveVisualSceneForImage } from "./visualScene";

export type WordForImage = Pick<
  typeof wordsTable.$inferSelect,
  "id" | "word" | "translation" | "example" | "imageUrl"
>;

/**
 * Daniel "GenerateImage" look — flat cream storybook flashcard style.
 * Cursor's GenerateImage tool can't run server-side, so we reproduce the exact
 * style through Pollinations (free) by leading the scene with these instructions.
 */
const DANIEL_CARD_STYLE =
  "Flat minimalist 2D children's storybook flashcard illustration, perfectly square 1:1, " +
  "soft warm CREAM off-white background color hex FCF5E6, muted warm pastels (beige, soft orange, pale blue), " +
  "simple dot eyes and small curved smiles, rounded friendly shapes, cozy hand-drawn storybook feel, " +
  "one clear centered subject, gentle and child-safe, NO text NO letters NO numbers NO logos.";

function bufferToDataUrl(buffer: Buffer): string {
  const isPng =
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const mime = isPng ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

/** Cream storybook (Daniel-style) flashcard image from the example sentence. */
export async function generateAndStoreDanielCardImage(
  word: WordForImage,
  options?: { force?: boolean },
): Promise<string> {
  if (word.imageUrl && !options?.force) return word.imageUrl;

  const exampleSentence = word.example?.trim();
  if (!exampleSentence) {
    throw new Error(
      `Word "${word.word}" has no example sentence — add an example before generating an image.`,
    );
  }

  const visualScene = await resolveVisualSceneForImage(
    word.word,
    word.translation,
    exampleSentence,
  );

  const danielScene = `${DANIEL_CARD_STYLE} Scene: ${visualScene}`;
  const { buffer } = await generateWordImage(danielScene, "1024x1024");
  const imageUrl = bufferToDataUrl(buffer);
  await db
    .update(wordsTable)
    .set({ imageUrl })
    .where(eq(wordsTable.id, word.id));
  return imageUrl;
}

/** Pollinations image from a visual scene derived from the example sentence. */
export async function generateAndStoreWordImage(
  word: WordForImage,
  options?: { force?: boolean },
): Promise<string> {
  if (word.imageUrl && !options?.force) return word.imageUrl;

  const exampleSentence = word.example?.trim();
  if (!exampleSentence) {
    throw new Error(
      `Word "${word.word}" has no example sentence — add an example before generating an image.`,
    );
  }

  const visualScene = await resolveVisualSceneForImage(
    word.word,
    word.translation,
    exampleSentence,
  );

  const { buffer } = await generateWordImage(visualScene, "1024x1024");
  const isPng =
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const mime = isPng ? "image/png" : "image/jpeg";
  const imageUrl = `data:${mime};base64,${buffer.toString("base64")}`;
  await db
    .update(wordsTable)
    .set({ imageUrl })
    .where(eq(wordsTable.id, word.id));
  return imageUrl;
}
