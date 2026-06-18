import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, isEmbeddedDatabase, studentsTable } from "@workspace/db";
import {
  CreateStudentBody,
  GetStudentParams,
  GetStudentResponse,
  GetStudentsResponse,
  UpdateStudentBody,
  UpdateStudentParams,
  UpdateStudentResponse,
  UpsertStudentByFingerprintBody,
  UpsertStudentByFingerprintResponse,
} from "@workspace/api-zod";
import { logStudentToSheet, logSessionEndToSheet } from "../lib/sheets";
import { checkAndRegisterFingerprint, markMessageRead, submitPaymentProof as uploadPaymentProof } from "../lib/sheetsMessages";

const router: IRouter = Router();

function serializeStudent(s: typeof studentsTable.$inferSelect) {
  return { ...s, createdAt: s.createdAt.toISOString() };
}

router.get("/students", async (_req, res): Promise<void> => {
  const students = await db.select().from(studentsTable).orderBy(studentsTable.createdAt);
  res.json(GetStudentsResponse.parse(students.map(serializeStudent)));
});

// Lookup-only — returns existing student by fingerprint without creating one
router.get("/students/fingerprint/:fp", async (req, res): Promise<void> => {
  const fingerprint = req.params.fp;
  if (!fingerprint) {
    res.status(400).json({ error: "fingerprint required" });
    return;
  }
  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.deviceFingerprint, fingerprint));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json(GetStudentResponse.parse(serializeStudent(student)));
});

router.post("/students/fingerprint", async (req, res): Promise<void> => {
  const parsed = UpsertStudentByFingerprintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { fingerprint, name, level } = parsed.data;

  try {
    const [student] = await db
      .insert(studentsTable)
      .values({ name: name || "طالب", level: level ?? "beginner", deviceFingerprint: fingerprint })
      .onConflictDoUpdate({
        target: studentsTable.deviceFingerprint,
        set: {
          name: name ? sql`EXCLUDED.name` : sql`students.name`,
          level: level ? sql`EXCLUDED.level` : sql`students.level`,
        },
      })
      .returning();

    res.json(UpsertStudentByFingerprintResponse.parse(serializeStudent(student)));
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
    if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT") {
      res.status(503).json({
        error: isEmbeddedDatabase()
          ? "قاعدة البيانات غير جاهزة. نفّذ: pnpm db:push ثم أعد تشغيل السيرفر."
          : "Database unavailable. Start PostgreSQL, run pnpm db:push, then retry.",
      });
      return;
    }
    throw err;
  }
});

// Session start — called once per tab when student is identified (login or auto-restore).
// Logs a new row in the "smart cards" Google Sheet tab.
router.post("/students/session-start", async (req, res): Promise<void> => {
  const { fingerprint, name } = req.body as { fingerprint?: string; name?: string };
  if (!fingerprint) {
    res.status(400).json({ error: "fingerprint required" });
    return;
  }
  try {
    // Prefer the name the client sent (matches what the user sees in the app);
    // fall back to the database record so older clients keep working.
    let resolvedName = typeof name === "string" ? name.trim() : "";
    if (!resolvedName) {
      const [student] = await db
        .select()
        .from(studentsTable)
        .where(eq(studentsTable.deviceFingerprint, fingerprint));
      resolvedName = student?.name?.trim() ?? "";
    }
    logStudentToSheet({ fingerprint, name: resolvedName });
  } catch {
    // Best-effort — never block the client
  }
  res.status(204).end();
});

// Check "smart cards messages" sheet — registers fingerprint once, returns message + block status
router.post("/students/check-messages", async (req, res): Promise<void> => {
  const { fingerprint } = req.body as { fingerprint?: string };
  if (!fingerprint) {
    res.status(400).json({ error: "fingerprint required" });
    return;
  }
  try {
    const result = await checkAndRegisterFingerprint(fingerprint);
    res.json(result);
  } catch {
    res.json({ isBlocked: false, message: null, alreadyExists: false, paymentSubmitted: false });
  }
});

// InstaPay transfer screenshot — column E in smart cards messages
router.post("/students/payment-proof", async (req, res): Promise<void> => {
  const { fingerprint, imageBase64, mimeType } = req.body as {
    fingerprint?: string;
    imageBase64?: string;
    mimeType?: string;
  };
  if (!fingerprint || !imageBase64) {
    res.status(400).json({ error: "fingerprint and imageBase64 required" });
    return;
  }
  try {
    const result = await uploadPaymentProof({
      fingerprint,
      imageBase64,
      mimeType: mimeType || "image/jpeg",
    });
    if (!result.ok) {
      res.status(502).json({ error: result.error ?? "upload failed" });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(502).json({ error: "upload failed" });
  }
});

// Mark message as read — updates column C with timestamp
router.post("/students/mark-message-read", async (req, res): Promise<void> => {
  const { fingerprint } = req.body as { fingerprint?: string };
  if (!fingerprint) {
    res.status(400).json({ error: "fingerprint required" });
    return;
  }
  try {
    await markMessageRead(fingerprint);
  } catch {
    // Best-effort, ignore
  }
  res.status(204).end();
});

// Session end — called via sendBeacon when user leaves; updates Sheets row with exit time + duration
router.post("/students/session-end", async (req, res): Promise<void> => {
  try {
    const { fingerprint, loginTime, exitTime, duration } = req.body as {
      fingerprint?: string;
      loginTime?: string;
      exitTime?: string;
      duration?: string;
    };
    if (fingerprint && loginTime && exitTime && duration) {
      logSessionEndToSheet({ fingerprint, loginTime, exitTime, duration });
    }
  } catch {
    // Ignore errors — this is a best-effort call
  }
  res.status(204).end();
});

router.post("/students", async (req, res): Promise<void> => {
  const parsed = CreateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [student] = await db.insert(studentsTable).values(parsed.data).returning();
  res.status(201).json(GetStudentResponse.parse(serializeStudent(student)));
});

router.get("/students/:id", async (req, res): Promise<void> => {
  const params = GetStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, params.data.id));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json(GetStudentResponse.parse(serializeStudent(student)));
});

router.put("/students/:id", async (req, res): Promise<void> => {
  const params = UpdateStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [student] = await db.update(studentsTable).set(parsed.data).where(eq(studentsTable.id, params.data.id)).returning();
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json(UpdateStudentResponse.parse(serializeStudent(student)));
});

export default router;
