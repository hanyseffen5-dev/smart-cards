/**
 * Google Sheets logger via Google Apps Script Web App (no OAuth needed).
 * SHEETS_WEBHOOK_URL env var must be set to the deployed Web App URL.
 *
 * Columns: A=ShortFP | B=Name | C=FullFingerprint | D=LoginTime | E=ExitTime | F=SessionDuration
 */

function nowCairo(): string {
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function webhookUrl(): string | undefined {
  return process.env.SHEETS_WEBHOOK_URL;
}

/** Log a warning at startup when Google Sheets integration is not configured. */
export function warnIfSheetsNotConfigured(): void {
  if (!webhookUrl()) {
    console.warn(
      "[Sheets] SHEETS_WEBHOOK_URL is not set — student logins will NOT appear in the Google Sheet.",
    );
  }
}

import { logger } from "./logger";

function post(payload: Record<string, string>): void {
  const url = webhookUrl();
  if (!url) return;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (r) => {
      const text = await r.text().catch(() => "");
      if (!r.ok) {
        logger.error({ status: r.status, body: text, type: payload.type }, "[Sheets] webhook HTTP error");
        return;
      }
      try {
        const json = JSON.parse(text) as { ok?: boolean; error?: string };
        if (json.error || json.ok === false) {
          logger.error({ type: payload.type, response: json }, "[Sheets] webhook rejected request");
        }
      } catch {
        // Non-JSON response — ignore if HTTP 200
      }
    })
    .catch((err: unknown) => logger.error({ err, type: payload.type }, "[Sheets] webhook error"));
}

/** Called on student registration/login — appends a new row. */
export function logStudentToSheet(opts: { fingerprint: string; name: string }): void {
  post({
    type: "login",
    shortFp: opts.fingerprint.slice(0, 8).toUpperCase(),
    name: opts.name,
    fingerprint: opts.fingerprint,
    loginTime: nowCairo(),
  });
}

/** Called on session end — updates the matching row with exit time and duration. */
export function logSessionEndToSheet(opts: {
  fingerprint: string;
  loginTime: string;
  exitTime: string;
  duration: string;
}): void {
  post({
    type: "logout",
    fingerprint: opts.fingerprint,
    loginTime: opts.loginTime,
    exitTime: opts.exitTime,
    duration: opts.duration,
  });
}
