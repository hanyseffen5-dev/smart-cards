/**
 * Google Sheets "smart cards messages" tab — via SHEETS_WEBHOOK_URL (Apps Script Web App).
 *
 * Column layout (tab: "smart cards messages"):
 *   A = fingerprint (registered once, never duplicated)
 *   B = message to show the user (written by admin)
 *   C = read status (updated when user dismisses the message)
 *   D = Status — اكتب BLOCK لحظر الدخول لحين سداد الرسوم
 *   E = payment proof image (uploaded by student)
 */

const TIMEOUT_MS = 8000;
const UPLOAD_TIMEOUT_MS = 60000;

function webhookUrl(): string | undefined {
  return process.env.MESSAGES_WEBHOOK_URL;
}

/** Log a warning at startup when message/block integration is not configured. */
export function warnIfMessagesNotConfigured(): void {
  if (!webhookUrl()) {
    console.warn(
      "[Sheets] MESSAGES_WEBHOOK_URL is not set — admin messages and blocking will NOT work.",
    );
  }
}

async function postToWebhook(
  payload: Record<string, unknown>,
  timeoutMs = TIMEOUT_MS,
): Promise<unknown> {
  const url = webhookUrl();
  if (!url) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const text = await res.text();
    try { return JSON.parse(text); } catch { return null; }
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export interface MessageCheckResult {
  isBlocked: boolean;
  message: string | null;
  alreadyExists: boolean;
  paymentSubmitted: boolean;
}

/**
 * Check the "smart cards messages" sheet for this fingerprint.
 * - If not found: Apps Script adds a new row (col A = fingerprint). One-time.
 * - Returns the message in col B (if any) and whether col D = "BLOCK".
 */
export async function checkAndRegisterFingerprint(fingerprint: string): Promise<MessageCheckResult> {
  const result = await postToWebhook({ type: "check_messages", fingerprint }) as MessageCheckResult | null;
  if (!result) {
    return { isBlocked: false, message: null, alreadyExists: false, paymentSubmitted: false };
  }
  return {
    isBlocked: result.isBlocked ?? false,
    message: result.message ?? null,
    alreadyExists: result.alreadyExists ?? false,
    paymentSubmitted: result.paymentSubmitted ?? false,
  };
}

/**
 * Mark that the user has read the admin message — updates column C via Apps Script.
 */
export async function markMessageRead(fingerprint: string): Promise<void> {
  await postToWebhook({ type: "mark_read", fingerprint });
}

/** Upload InstaPay transfer screenshot — saved to column E in smart cards messages. */
export async function submitPaymentProof(opts: {
  fingerprint: string;
  imageBase64: string;
  mimeType: string;
}): Promise<{ ok: boolean; error?: string }> {
  const result = await postToWebhook(
    {
      type: "payment_proof",
      fingerprint: opts.fingerprint,
      imageBase64: opts.imageBase64,
      mimeType: opts.mimeType,
    },
    UPLOAD_TIMEOUT_MS,
  ) as { ok?: boolean; error?: string } | null;
  if (!result?.ok) {
    return { ok: false, error: result?.error ?? "webhook_failed" };
  }
  return { ok: true };
}
