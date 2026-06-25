---
name: daniel-flashcard-images
description: Create sentence-aligned Daniel lesson flashcard illustrations (flat cream storybook style), save to assets, apply to PGlite DB, bump cache. Use when adding or fixing Daniel lesson images.
---

# Daniel Flashcard Images (Saved Technique)

Use this skill whenever the user asks to create, fix, or batch-add images for **Daniel - The Movie** (lesson id 1).

## Core rule

**The image must illustrate the example sentence on the card back — not the abstract dictionary meaning.**

Examples:
- `heart` → downtown city center ("heart of the city"), NOT an anatomical heart
- `new` → buying a new phone, NOT a random box with a toy
- `call` → calling someone by a different name, NOT shouting on a phone
- `beast` → friendly forest storybook creature, NOT scary (content safety)

## Visual style (batch 3 — this chat technique)

- Flat minimalist 2D vector children's flashcard
- **1:1 square**, soft warm **cream** background `#FCF5E6` (rgb 252,245,230)
- Muted warm pastels, rounded shapes, dot eyes, friendly
- **NO text, letters, numbers, logos, watermarks**
- Centered composition

Prompt template for **Cursor GenerateImage**:

```
Flat children's storybook cartoon, 1:1 square, soft warm cream off-white background, soft warm pastels, rounded friendly outlines, big eyes, NO text. [SCENE matching example sentence]. Centered.
```

Shared constants: `scripts/lib/daniel-image-style.mjs`

## File naming

```
assets/daniel_<word>.png
```

Spaces → underscores (`as if` → `daniel_as_if.png`).

Default assets folder:
`C:\Users\hani.ibrahiem\.cursor\projects\f-smart-card-smart-card-FLASH-CARD\assets`

Override: `DANIEL_ASSETS_DIR` env var.

## Workflow

### A) Generate images (choose one)

**Option 1 — Cursor GenerateImage (this chat's method)**
1. Get words + example sentences from DB or seed
2. Generate each PNG with sentence-aligned prompt
3. Save as `daniel_<word>.png` in assets

**Pollinations is disabled** — project policy requires Daniel GenerateImage only (see `.cursor/rules/daniel-generate-image-only.mdc`).

Prompt maps live in:
- `scripts/daniel-batch3-prompts.mjs`
- `scripts/daniel-batch4-prompts.mjs`
- `scripts/daniel-redo-prompts.mjs`

### B) Apply to database

**Stop `pnpm dev` first** — PGlite lock prevents corruption (`scripts/lib/db-safety.mjs`).

```bash
node scripts/apply-daniel-word.mjs new              # single word
node scripts/apply-daniel-batch3.mjs                # batch 3 list (50 words)
node scripts/apply-daniel-batch2.mjs
node scripts/restore-daniel-images.mjs              # all assets/daniel_*.png
```

Apply pipeline:
1. `sharp` resize → fit inside **640×640** cream canvas
2. PNG → base64 data URL
3. `UPDATE words SET image_url = ... WHERE lesson_id = 1 AND word = ...`

### C) Bump browser cache

Edit `artifacts/smart-flashcards/src/lib/image-cache-version.ts`:
```ts
export const IMAGE_CACHE_VERSION = "daniel-<label>-v<N>";
```

### D) Restart & verify

```bash
pnpm dev
```

User hard-refreshes: **Ctrl+Shift+R** on http://localhost:5173/lessons/1

Daniel cards with images sort first (API: `artifacts/api-server/src/routes/lessons.ts`).

## Helper commands

```bash
node scripts/list-daniel-words-without-images.mjs 50   # next 50 words needing images
node scripts/scaffold-daniel-prompts.mjs 50              # generate prompt map template
node scripts/count-daniel-images.mjs                     # image count in DB
node scripts/show-daniel-card.mjs 65                     # word at card position 65
node scripts/show-words.mjs heart new                    # word details + example
node scripts/audit-daniel-images.mjs                     # find sentence/image mismatches
```

## npm shortcuts

```bash
pnpm images:daniel-next          # list next words without images
pnpm images:daniel-scaffold 50   # scaffold prompts file for next batch
pnpm images:daniel-generate batch3
pnpm db:apply-daniel-batch3
pnpm images:daniel-fix word1 word2   # regenerate + apply single words (Pollinations)
```

## Fixing a mismatch (user reports card N)

1. `node scripts/show-daniel-card.mjs N` → get word + example
2. Regenerate PNG matching **that exact example sentence**
3. `node scripts/apply-daniel-word.mjs "<word>"`
4. Bump `IMAGE_CACHE_VERSION`
5. Restart dev, user Ctrl+Shift+R

## Do NOT

- Auto-generate via Pollinations in production (`ALLOW_IMAGE_GENERATION=false`)
- Run DB scripts while API is on port 3000
- Illustrate word meaning when it conflicts with the example sentence
- Use scary/violent imagery for `beast`, `conquer`, `surrender` — keep storybook-safe
