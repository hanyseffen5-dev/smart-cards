import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useStudent } from "../../lib/use-student";
import { getSessionInfo, clearSession, tryClaimSessionEnd } from "../../lib/session-tracker";
import { useStudentMessages } from "../../lib/use-student-messages";
import { BlockedScreen, AdminMessageModal } from "../StudentGateScreens";
import { BookOpen, CheckCircle, Home, LogOut, Mic, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Global route progress bar ────────────────────────────────────────────────
function RouteProgressBar() {
  const [location] = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLocation = useRef(location);

  useEffect(() => {
    if (location === prevLocation.current) return;
    prevLocation.current = location;

    // Clear any running animation
    if (timerRef.current) clearInterval(timerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    // Start fresh
    setProgress(0);
    setVisible(true);

    // Animate 0 → 85% in ~400ms, then jump to 100% and fade
    let p = 0;
    timerRef.current = setInterval(() => {
      p += 7;
      if (p >= 85) {
        clearInterval(timerRef.current!);
        setProgress(85);
        // Short pause at 85%, then finish
        hideTimerRef.current = setTimeout(() => {
          setProgress(100);
          hideTimerRef.current = setTimeout(() => setVisible(false), 350);
        }, 80);
      } else {
        setProgress(p);
      }
    }, 30);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [location]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full rounded-full transition-all ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/0.7))",
          boxShadow: "0 0 8px hsl(var(--primary)/0.6)",
          transitionDuration: progress === 100 ? "300ms" : "200ms",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}س ${m}د ${s}ث`;
  if (m > 0) return `${m}د ${s}ث`;
  return `${s}ث`;
}

function sendSessionEnd() {
  if (!tryClaimSessionEnd()) return;
  const info = getSessionInfo();
  // info includes fingerprint from sessionStorage/localStorage — no student object needed
  if (!info) return;

  const now = Date.now();
  const exitTime = new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).format(now);
  const duration = formatDuration(now - info.startMs);

  clearSession(); // clear before sending so a reload doesn't double-send

  const payload = JSON.stringify({
    fingerprint: info.fingerprint,
    loginTime: info.loginTime,
    exitTime,
    duration,
  });

  // sendBeacon is guaranteed to complete even during page unload
  const sent = navigator.sendBeacon(
    "/api/students/session-end",
    new Blob([payload], { type: "application/json" }),
  );
  if (!sent) {
    // Fallback: keepalive fetch
    fetch("/api/students/session-end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

const navItems = [
  { href: "/", labelEn: "Home", labelAr: "الرئيسية", icon: Home },
  { href: "/lessons", labelEn: "Lessons", labelAr: "الدروس", icon: BookOpen },
  { href: "/pronunciation", labelEn: "Pronunciation", labelAr: "النطق", icon: Mic },
  { href: "/progress", labelEn: "Progress", labelAr: "تقدمي", icon: CheckCircle },
  { href: "/favorites", labelEn: "Favorites", labelAr: "المفضلة", icon: Star },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { student, logout, hydrated } = useStudent();
  const [location, setLocation] = useLocation();
  const fingerprint =
    (typeof sessionStorage !== "undefined" && sessionStorage.getItem("sessionFingerprint")) ||
    (typeof localStorage !== "undefined" && localStorage.getItem("deviceFingerprint")) ||
    null;
  const { state: msgState, dismissMessage } = useStudentMessages(student ? fingerprint : null);

  // Unauthenticated users on /lessons etc. saw a blank screen — send them to login.
  useEffect(() => {
    if (!student && hydrated && location !== "/") {
      setLocation("/", { replace: true });
    }
  }, [student, hydrated, location, setLocation]);

  // Send session-end data to Google Sheets when the tab is closed or navigated away.
  // Uses ONLY pagehide — beforeunload is intentionally omitted to avoid double-firing
  // and to allow the browser's back/forward cache to work correctly.
  // Fingerprint is read from sessionStorage/localStorage inside sendSessionEnd — no student dep needed.
  useEffect(() => {
    if (!student) return; // wait until student is known
    window.addEventListener("pagehide", sendSessionEnd);
    return () => {
      window.removeEventListener("pagehide", sendSessionEnd);
    };
  }, [student?.id]);

  const handleLogout = () => {
    // Record session end immediately on explicit logout
    sendSessionEnd();
    logout();
    setLocation("/");
  };

  if (!student) {
    if (!hydrated || location !== "/") {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            {hydrated && location !== "/" && (
              <p className="text-sm text-center">
                Redirecting to login...
                <span className="block text-[11px] text-muted-foreground" dir="rtl">جارٍ التحويل لتسجيل الدخول...</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Blocked — show block screen regardless of any other state
  if (msgState.checked && msgState.isBlocked && fingerprint) {
    return (
      <BlockedScreen
        note={msgState.message}
        fingerprint={fingerprint}
        paymentSubmitted={msgState.paymentSubmitted}
      />
    );
  }

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <div className="flex min-h-screen bg-background">
      <RouteProgressBar />
      {/* Admin message modal — shown until dismissed */}
      {msgState.checked && msgState.message && (
        <AdminMessageModal message={msgState.message} onDismiss={dismissMessage} />
      )}
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 border-r bg-card flex-col sticky top-0 self-start h-screen">
        <div className="p-5 border-b border-border">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Star size={18} className="text-yellow-500" />
            Smart Flash
          </h1>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Welcome, {student.name}!
            <span className="block text-[10px]" dir="rtl">مرحباً، {student.name}!</span>
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={18} />
                <span className="flex flex-col leading-tight">
                  <span>{item.labelEn}</span>
                  <span className={`text-[10px] font-normal ${active ? "opacity-80" : "text-muted-foreground"}`} dir="rtl">
                    {item.labelAr}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            className="w-full flex flex-col items-center gap-0.5 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-sm h-auto py-2.5"
            onClick={handleLogout}
          >
            <span className="inline-flex items-center gap-2">
              <LogOut size={15} />
              Log out
            </span>
            <span className="text-[10px] font-normal opacity-80" dir="rtl">تسجيل خروج</span>
          </Button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            <span className="font-bold text-primary text-base">Smart Flash</span>
          </div>
          <span className="text-sm text-muted-foreground truncate max-w-[140px]">{student.name}</span>
        </header>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <div className="p-4 md:p-6 max-w-5xl mx-auto pb-24 md:pb-6">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-pb">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-h-[56px] ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    active ? "bg-primary/10" : ""
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium leading-none text-center">
                  {item.labelEn}
                  <span className="block text-[9px] font-normal opacity-70" dir="rtl">{item.labelAr}</span>
                </span>
              </Link>
            );
          })}

          {/* Logout button in bottom nav */}
          <button
            onClick={handleLogout}
            className="flex-none px-3 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-destructive transition-colors min-h-[56px]"
          >
            <div className="p-1.5 rounded-xl">
              <LogOut size={20} strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-medium leading-none text-center">
              Log out
              <span className="block text-[9px] font-normal opacity-70" dir="rtl">خروج</span>
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
