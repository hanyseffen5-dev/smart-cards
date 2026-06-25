---
name: grade5-flashcard-images
description: Create sentence-aligned Grade 5 lesson flashcard illustrations (Daniel GenerateImage only), save to assets, apply to PGlite DB, bump cache. Use when adding or fixing grade 5 lesson images.
---

# Grade 5 Flashcard Images

Use for lesson title **`grade 5`** (1500 cards).

## Core rule

**Daniel GenerateImage only** — never Pollinations. Illustrate the **example sentence** on the card back.

## Visual style

`scripts/lib/daniel-image-style.mjs` + `scripts/lib/grade5-image-style.mjs` — cream `#FCF5E6`, 640×640.

Assets: `grade5_<word>.png` in project `assets/` (sync from Cursor assets if needed).

## Compound-replacement batches

Prompts: `scripts/grade5-compound-batch-prompts.mjs` (batch1–batch60, 10 words each).

Card positions map to batches from compound replacements (~511+). Example: cards **584–700** = batch8 through first 7 words of batch19.

## Workflow

1. **GenerateImage** with prompt from batch file (Daniel cream storybook style)
2. Save `assets/grade5_<word>.png` (or Cursor assets → `node scripts/sync-grade5-assets.mjs`)
3. Stop `pnpm dev`, then:

```bash
node scripts/apply-grade5-compound-batch.mjs batch8
# or position range:
$env:GRADE123_DB_WRITE_CONFIRMED="1"; node scripts/apply-grade5-position-range.mjs 584 700
```

4. Bump `artifacts/smart-flashcards/src/lib/image-cache-version.ts`
5. Restart dev, user **Ctrl+Shift+R**

## Helpers

```bash
node scripts/show-grade5-card.mjs 584
node scripts/list-grade5-position-range.mjs 584 700
node scripts/count-grade5-pending-images.mjs
```

## Do NOT

- Run `generate-grade5-compound-all.mjs` (Pollinations — disabled by policy)
- Apply DB scripts while API is on port 3000
- Modify grade 1–5 / Miscellaneous Words without user **نعم** + `GRADE123_DB_WRITE_CONFIRMED=1`
