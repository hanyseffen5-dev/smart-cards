const abstractOverrides: Record<string, string> = {
  heart: "two children hugging with a glowing heart symbol between them, warm happy expressions",
  palace: "a grand colorful royal palace with towers and arches in the background",
  mouth: "a friendly smiling child's face showing lips and teeth clearly",
  official: "a formal adult in a suit holding official documents in an office",
  gate: "a large wooden entrance gate standing open in a sunny yard",
  under: "a red ball clearly placed beneath a wooden table",
  authority: "a respected teacher or judge at a desk with a badge, calm confident pose",
  chief: "a confident leader standing with a staff while others listen respectfully",
  test: "a student at a desk writing answers on a school test paper",
  starving: "a tired hungry child looking at an empty plate, sad expression",
  god: "bright golden sunlight rays through fluffy white clouds in a peaceful sky, no people",
  dislike: "two children at a kitchen table frowning at broccoli on a plate, one with crossed arms",
  disturbing:
    "two worried children near an open door, dark hallway inside, wavy lines suggesting a scary sound",
};

/**
 * Builds a scene-only description for image generation (style is added by formatKidsEducationalPrompt).
 */
export function buildImagePrompt(
  word: string,
  translation?: string | null,
  example?: string | null,
): string {
  const wordKey = word.toLowerCase().trim();

  if (example && example.trim().length > 4) {
    return (
      `In this scene: ${example.trim()}. ` +
      `The vocabulary idea is "${word}"${translation ? ` (${translation})` : ""}. ` +
      "Show the meaning clearly through characters, expressions, and actions."
    );
  }

  return (
    abstractOverrides[wordKey] ??
    `A clear scene showing the meaning of "${word}"${translation ? ` (${translation})` : ""} with expressive child-friendly characters.`
  );
}
