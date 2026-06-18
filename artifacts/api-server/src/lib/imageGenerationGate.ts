import type { Request } from "express";

/**
 * Master switch — image generation is OFF unless ALLOW_IMAGE_GENERATION=true in .env.
 * Prevents accidental bulk API usage and credit burn.
 */
export function isImageGenerationAllowed(): boolean {
  const v = process.env.ALLOW_IMAGE_GENERATION?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function assertImageGenerationAllowed(): void {
  if (!isImageGenerationAllowed()) {
    throw new Error(
      "Image generation is disabled. Set ALLOW_IMAGE_GENERATION=true in .env only when you explicitly want to generate images.",
    );
  }
}

/** Bulk/single generation requires confirm=true (query or JSON body). */
export function hasExplicitGenerationConsent(req: Request): boolean {
  if (req.query.confirm === "true") return true;
  const body = req.body as { confirm?: boolean } | undefined;
  return body?.confirm === true;
}

export function assertExplicitGenerationConsent(req: Request): void {
  if (!hasExplicitGenerationConsent(req)) {
    throw new Error(
      'Explicit consent required: add ?confirm=true to the request (or {"confirm":true} in body).',
    );
  }
}

export function assertMayGenerateImages(req: Request): void {
  assertImageGenerationAllowed();
  assertExplicitGenerationConsent(req);
}

/** Bulk lesson/admin image regeneration is permanently disabled. */
export function assertBulkImageGenerationBlocked(): void {
  throw new Error(
    "Bulk image generation is disabled. Generate one card only: POST /api/words/:id/generate-image?confirm=true",
  );
}
