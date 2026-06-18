import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStudent } from "../lib/use-student";
import { getDeviceFingerprint } from "../lib/device-fingerprint";
import { fetchStudentMessages, useStudentMessages } from "../lib/use-student-messages";
import { BlockedScreen } from "../components/StudentGateScreens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { student, saveStudent } = useStudent();
  const [location, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const { state: msgState } = useStudentMessages(fingerprint);

  useEffect(() => {
    getDeviceFingerprint().then(setFingerprint);
  }, []);

  useEffect(() => {
    if (student && location === "/") {
      setLocation("/lessons", { replace: true });
    }
  }, [student, location, setLocation]);

  if (student) return null;

  if (msgState.checked && msgState.isBlocked && fingerprint) {
    return (
      <BlockedScreen
        note={msgState.message}
        fingerprint={fingerprint}
        paymentSubmitted={msgState.paymentSubmitted}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const fp = await getDeviceFingerprint();
      setFingerprint(fp);

      const gate = await fetchStudentMessages(fp);
      if (gate.isBlocked) return;

      // Upsert student by fingerprint — same device always gets same student record
      const r = await fetch("/api/students/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: fp, name: name.trim() }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Server error (${r.status})`);
      }
      const data = await r.json();
      // saveStudent internally calls startSession() — no extra work needed here
      await saveStudent(data);
      setLocation("/lessons", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (err instanceof DOMException && err.name === "TimeoutError") {
        setError(
          "انتهت مهلة الاتصال بالسيرفر. شغّل الطرفية ونفّذ: pnpm dev (أو pnpm dev:api)",
        );
      } else if (msg.includes("503") || msg.toLowerCase().includes("database") || msg.includes("db:push")) {
        setError("قاعدة البيانات غير جاهزة. نفّذ: pnpm db:push ثم أعد تشغيل pnpm dev");
      } else {
        setError(msg || "حدث خطأ أثناء التسجيل. تأكد أن السيرفر يعمل (pnpm dev).");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-xl border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-1">Smart Flash Cards AI</h1>
          <p className="text-muted-foreground text-sm">Your intelligent vocabulary buddy</p>
          <p className="text-[11px] text-muted-foreground mt-0.5" dir="rtl">رفيقك الذكي لتعلّم المفردات</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Your Name
              <span className="block text-[11px] text-muted-foreground font-normal" dir="rtl">اسمك</span>
            </label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Ahmed"
              className="rounded-xl h-12 text-lg"
            />
          </div>
          
          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-lg mt-4 flex flex-col gap-0.5"
            disabled={submitting || !name.trim()}
          >
            {submitting ? (
              <>
                <span>Signing in...</span>
                <span className="text-[11px] font-normal opacity-80" dir="rtl">جارٍ التسجيل...</span>
              </>
            ) : (
              <>
                <span>Start Learning!</span>
                <span className="text-[11px] font-normal opacity-80" dir="rtl">ابدأ التعلّم!</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
