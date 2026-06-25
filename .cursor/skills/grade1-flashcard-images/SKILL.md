---
name: grade1-flashcard-images
description: Create sentence-aligned Grade 1 lesson flashcard illustrations (flat cream storybook style), save to assets, apply to PGlite DB, bump cache. Use when adding or fixing grade 1 lesson images.
---

# Grade 1 Flashcard Images

Use for lesson title **`grade 1`** (300 cards, 30 image batches).

## Core rule

Illustrate the **example sentence** on the card back — e.g. `red` → red apple scene, not an abstract color swatch alone.

## Visual style

Same as Daniel: `scripts/lib/daniel-image-style.mjs` and `scripts/lib/grade1-image-style.mjs` (cream `#FCF5E6`, 640×640).

Assets: `grade1_<word>.png` in project `assets/` (or `GRADE1_ASSETS_DIR`).

## Workflow (10 cards per batch)

### A) **Cursor GenerateImage** (preferred — same quality as Daniel batch 3)

1. Ask the assistant: **«أضف صور grade 1 دفعة N بنفس تقنية Daniel»**
2. Assistant uses **GenerateImage** with prompts from `scripts/grade1-batch-prompts.mjs` + `GENERATE_IMAGE_STYLE` in `scripts/lib/daniel-image-style.mjs`
3. Saves `assets/grade1_<word>.png`
4. Stop `pnpm dev`, then apply + bump cache (below)

Do **not** use Pollinations for production-grade cards unless the user explicitly asks for the free automated path.

### B) Apply to database

**Stop `pnpm dev` first** (or remove stale `.api-server.lock` only if API is not running).

```bash
node scripts/seed-grade1-lesson.mjs              # once: 300 cards
node scripts/apply-grade1-batch.mjs batch1       # sharp 640×640 cream canvas → DB
```

### C) Pollinations — disabled

Project policy: Daniel GenerateImage only. Do not run `generate-grade1-images.mjs`.

Batches: `batch1` … `batch30` — prompts in `scripts/grade1-batch-prompts.mjs`, card data in `scripts/seed-data/grade1-cards.mjs`.

Bump `artifacts/smart-flashcards/src/lib/image-cache-version.ts`, restart dev, **Ctrl+Shift+R** on `/lessons/<id>`.

## npm shortcuts

```bash
pnpm db:seed-grade1
pnpm images:grade1-generate batch2
pnpm db:apply-grade1-batch batch2
```
