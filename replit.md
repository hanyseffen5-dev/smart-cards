# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI Integration**: Google Gemini (`gemini-1.5-flash`) via `GEMINI_API_KEY`
- **Image generation**: Pollinations.ai (free, configurable via `IMAGE_GENERATION_URL`)
- **Text-to-speech**: Microsoft Edge TTS (free, via `msedge-tts`)

## Artifacts

### Smart Flash Cards AI (`artifacts/smart-flashcards`)
- React + Vite frontend, served at `/`
- Educational app for Arabic-speaking students to learn English vocabulary
- Features: AI text analysis, flashcard study (3D flip), quiz mode, pronunciation practice, progress tracking, favorites

### API Server (`artifacts/api-server`)
- Express 5 backend at `/api`
- Routes: /students, /lessons, /words, /progress, /ai/analyze-text
- Gemini integration for AI text analysis, OCR, and PDF extraction

## Database Schema

- `students` — student profiles (name, school, grade, level)
- `lessons` — lesson text and metadata
- `words` — vocabulary flashcards (word, translation, image, audio, difficulty, partOfSpeech, isFavorite)
- `progress` — pronunciation/quiz attempt records per student/word

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Environment

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` and `DATABASE_URL`.
