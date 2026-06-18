import { eq } from "drizzle-orm";
import { db, wordsTable } from "@workspace/db";
import { translateExampleToArabic } from "@workspace/integrations-openai-ai-server";

export async function ensureExampleTranslation(
  wordId: number,
): Promise<string | null> {
  const [word] = await db
    .select({
      id: wordsTable.id,
      example: wordsTable.example,
      exampleTranslation: wordsTable.exampleTranslation,
    })
    .from(wordsTable)
    .where(eq(wordsTable.id, wordId));

  if (!word?.example?.trim()) return null;
  if (word.exampleTranslation?.trim()) return word.exampleTranslation.trim();

  const translation = (await translateExampleToArabic(word.example.trim())).trim();
  if (!translation) return null;

  await db
    .update(wordsTable)
    .set({ exampleTranslation: translation })
    .where(eq(wordsTable.id, wordId));

  return translation;
}
