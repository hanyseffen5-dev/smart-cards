import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Student } from "@workspace/api-client-react";
import { startSession, clearSession } from "./session-tracker";
import { getDeviceFingerprint } from "./device-fingerprint";
import { resetMessageCheck } from "./use-student-messages";

let restorePromise: Promise<Student | null> | null = null;

// Re-create a student server-side after the database was reset/wiped, reusing the
// cached fingerprint + profile so a stale local session keeps a valid student id.
async function reregisterStudent(
  fingerprint: string,
  cached: Student,
): Promise<Student | null> {
  try {
    const r = await fetch(`/api/students/fingerprint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fingerprint,
        name: cached.name || "طالب",
        level: cached.level ?? "beginner",
      }),
    });
    if (!r.ok) return null;
    const s: Student = await r.json();
    if (!s?.id) return null;
    localStorage.setItem("currentStudent", JSON.stringify(s));
    return s;
  } catch {
    return null;
  }
}

async function lookupByFingerprint(): Promise<Student | null> {
  if (localStorage.getItem("explicitLogout") === "1") return null;
  const fingerprint = await getDeviceFingerprint();
  try {
    const r = await fetch(`/api/students/fingerprint/${encodeURIComponent(fingerprint)}`);
    if (r.ok) {
      const s: Student = await r.json();
      if (s?.id) {
        localStorage.setItem("currentStudent", JSON.stringify(s));
        return s;
      }
    }
    // Server has no record (404) but we still hold a cached student — the database
    // was reset. Re-create the student so favorites/progress keep working.
    if (r.status === 404) {
      const cached = readCachedStudent();
      if (cached) return await reregisterStudent(fingerprint, cached);
    }
    return null;
  } catch {
    return null;
  }
}

function readCachedStudent(): Student | null {
  const stored = localStorage.getItem("currentStudent");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as Student;
  } catch {
    return null;
  }
}

type StudentContextValue = {
  student: Student | null;
  saveStudent: (s: Student | null) => Promise<void>;
  logout: () => void;
  hydrated: boolean;
};

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(() => readCachedStudent());
  const [hydrated, setHydrated] = useState(() => !!localStorage.getItem("currentStudent"));

  useEffect(() => {
    if (!restorePromise) {
      restorePromise = lookupByFingerprint();
    }
    restorePromise
      .then((s) => {
        if (s) {
          localStorage.setItem("currentStudent", JSON.stringify(s));
          // Update React state whenever the resolved id differs from what's mounted
          // (covers re-registration after a database reset, which yields a new id).
          setStudent((prev) => (prev?.id === s.id ? prev : s));
          startSession();
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const saveStudent = useCallback(async (s: Student | null) => {
    if (s) {
      localStorage.removeItem("explicitLogout");
      localStorage.setItem("currentStudent", JSON.stringify(s));
      await getDeviceFingerprint();
      startSession();
    } else {
      localStorage.removeItem("currentStudent");
      restorePromise = null;
    }
    setStudent(s);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("currentStudent");
    localStorage.setItem("explicitLogout", "1");
    clearSession();
    resetMessageCheck();
    restorePromise = Promise.resolve(null);
    setStudent(null);
  }, []);

  const value = useMemo(
    () => ({ student, saveStudent, logout, hydrated }),
    [student, saveStudent, logout, hydrated],
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent(): StudentContextValue {
  const ctx = useContext(StudentContext);
  if (!ctx) {
    throw new Error("useStudent must be used within StudentProvider");
  }
  return ctx;
}
