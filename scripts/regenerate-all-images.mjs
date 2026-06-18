console.error(
  "Blocked: bulk image regeneration is disabled.\n" +
    "Generate one card: set ALLOW_IMAGE_GENERATION=true in .env, then:\n" +
    "  POST http://127.0.0.1:3000/api/words/WORD_ID/generate-image?confirm=true",
);
process.exit(1);
