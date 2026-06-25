/**
 * Session tracker — records when the student's session starts so
 * AppLayout can send exit time + duration to Google Sheets when the tab closes.
 *
 * Uses sessionStorage (tab-scoped, persists through reloads, auto-cleared on close).
 * Also stores fingerprint so sendSessionEnd works even if the student object
 * doesn't expose it (e.g. before codegen is updated).
 */

function cairoTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/** Guard — one session-end payload per tab session (reset when startSession runs). */
let sessionEndSent = false;

function readStudentName(): string {
  try {
    const raw = localStorage.getItem("currentStudent");
    if (raw) return (JSON.parse(raw) as { name?: string })?.name || "";
  } catch {
    // ignore malformed cache
  }
  return "";
}

function sendSheetLogin(fp: string, name: string): void {
  fetch("/api/students/session-start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fingerprint: fp, name }),
    keepalive: true,
  })
    .then((r) => {
      if (r.ok) sessionStorage.setItem("sessionSheetLogged", "1");
    })
    .catch(() => {});
}

/** Call once when student is identified (login or auto-restore). Idempotent. */
export function startSession(): void {
  const fp = localStorage.getItem("deviceFingerprint");
  if (!fp) return;

  if (!sessionStorage.getItem("sessionStart")) {
    sessionEndSent = false;
    sessionStorage.setItem("sessionStart", String(Date.now()));
    sessionStorage.setItem("sessionLoginTime", cairoTime());
    sessionStorage.setItem("sessionFingerprint", fp);
  }

  // Sheet login is separate from session timing — retry if the first POST failed.
  if (sessionStorage.getItem("sessionSheetLogged") === "1") return;
  sendSheetLogin(fp, readStudentName());
}

/** Read session info for sending on exit. Returns null if session never started. */
export function getSessionInfo(): { loginTime: string; startMs: number; fingerprint: string } | null {
  const startMs = parseInt(sessionStorage.getItem("sessionStart") || "0", 10);
  const loginTime = sessionStorage.getItem("sessionLoginTime") || "";
  // Fingerprint: prefer sessionStorage copy, fall back to localStorage
  const fingerprint =
    sessionStorage.getItem("sessionFingerprint") ||
    localStorage.getItem("deviceFingerprint") ||
    "";
  if (!startMs || !loginTime || !fingerprint) return null;
  return { startMs, loginTime, fingerprint };
}

/** Clear session (on logout). */
export function clearSession(): void {
  sessionStorage.removeItem("sessionStart");
  sessionStorage.removeItem("sessionLoginTime");
  sessionStorage.removeItem("sessionFingerprint");
  sessionStorage.removeItem("sessionSheetLogged");
}

/** Returns true the first time per tab session — prevents duplicate session-end sends. */
export function tryClaimSessionEnd(): boolean {
  if (sessionEndSent) return false;
  sessionEndSent = true;
  return true;
}
