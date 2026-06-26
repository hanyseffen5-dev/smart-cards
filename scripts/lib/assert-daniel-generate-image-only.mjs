/**
 * Project policy: flashcard images must use Cursor GenerateImage (Daniel technique).
 * Pollinations / remote API scripts are disabled unless explicitly overridden.
 */
export function assertDanielGenerateImageOnly(scriptName = "this script") {
  if (process.env.ALLOW_POLLINATIONS_IMAGE_GEN === "1") return;
  console.error(
    [
      "",
      "⛔ Image generation blocked — Daniel GenerateImage only.",
      "",
      `  ${scriptName} uses Pollinations/remote API, which is disabled.`,
      "  Use Cursor GenerateImage with prompts from daniel-image-style.mjs instead.",
      "",
      "  Override (not recommended): ALLOW_POLLINATIONS_IMAGE_GEN=1",
      "",
    ].join("\n"),
  );
  process.exit(1);
}
