import { generateText } from "@workspace/integrations-openai-ai-server";

/**
 * Literal visual scene for Pollinations — describes what to DRAW, not the English sentence.
 */
export async function buildSceneImagePromptWithGemini(
  word: string,
  translation?: string | null,
  example?: string | null,
): Promise<string> {
  if (!example?.trim()) {
    const scene = await generateText({
      systemPrompt: `Describe one simple children's book illustration scene for a vocabulary word. Visible action and objects only. No text in image. 2 sentences max.`,
      userPrompt: `Word: "${word}"${translation ? `\nMeaning: "${translation}"` : ""}`,
      maxOutputTokens: 200,
    });
    return scene.trim();
  }

  const scene = await generateText({
    systemPrompt: `You write a PICTURE DESCRIPTION for a children's flashcard illustrator.

The drawing must show EXACTLY what happens in the example sentence — like a storybook page.
Rules:
- Describe only what is VISIBLE (characters, actions, objects, place, mood).
- 1-2 child or friendly characters; simple cartoon poses; mitten-like hands or hands behind back.
- Include every important object from the sentence (school, food, door, lightbulb, etc.).
- Plain pastel background, single clear moment.
- Do NOT include art style words, the vocabulary word as text, or the sentence as a quote.
- Do NOT say "no text" — just describe the scene.
Output: 2-4 short English sentences.`,
    userPrompt: `Vocabulary word: "${word}"
${translation ? `Arabic meaning: "${translation}"\n` : ""}Example sentence to illustrate: "${example.trim()}"

Describe the one illustration that makes this sentence obvious to a child.`,
    maxOutputTokens: 320,
  });

  return scene.trim();
}
