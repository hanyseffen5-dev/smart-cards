import { useRef, useState } from "react";
import { Ban, CheckCircle2, ExternalLink, MessageSquare, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitPaymentProof } from "../lib/payment-proof";

const INSTAPAY_URL = "https://ipn.eg/S/hanylouka/instapay/3zsuJq";
const INSTAPAY_HANDLE = "hanylouka@instapay";

export function BlockedScreen({
  note,
  fingerprint,
  paymentSubmitted = false,
}: {
  note?: string | null;
  fingerprint: string;
  paymentSubmitted?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [reviewing, setReviewing] = useState(
    paymentSubmitted || localStorage.getItem(`paymentPending_${fingerprint}`) === "1",
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (file: File | undefined) => {
    if (!file || !fingerprint) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار صورة (JPG أو PNG)");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const result = await submitPaymentProof(fingerprint, file);
      if (!result.ok) {
        setUploadError(result.error ?? "فشل رفع الصورة");
        return;
      }
      localStorage.setItem(`paymentPending_${fingerprint}`, "1");
      setReviewing(true);
    } catch {
      setUploadError("فشل رفع الصورة. حاول مرة أخرى.");
    } finally {
      setUploading(false);
    }
  };

  if (reviewing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
        <div className="max-w-sm w-full bg-card rounded-3xl shadow-lg border border-primary/20 p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Under Review</h2>
          <p className="text-muted-foreground text-sm leading-relaxed" dir="rtl">
            جارٍ المراجعة لفتح التطبيق
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your payment screenshot was received. The teacher will verify it and restore your access soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f8] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-border/60">
        {/* InstaPay-style header */}
        <div className="bg-[#5b2d8e] px-5 py-4 flex items-center justify-between">
          <span className="text-white font-bold tracking-wide text-lg">InstaPay</span>
          <span className="text-white/80 text-xs">Powered by InstaPay</span>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <Ban size={24} className="text-destructive" />
            </div>
            <div className="text-right flex-1">
              <h2 className="text-lg font-bold text-foreground">الدخول موقوف لحين سداد الرسوم</h2>
              <p className="text-xs text-muted-foreground mt-1">Access suspended — fees due</p>
            </div>
          </div>

          {note?.trim() && (
            <p className="text-sm text-foreground bg-muted/50 rounded-xl p-3 whitespace-pre-wrap">{note.trim()}</p>
          )}

          <div className="rounded-xl border-2 border-[#5b2d8e]/20 bg-[#5b2d8e]/5 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground text-center">
              ادفع عبر InstaPay ثم ارفع صورة التحويل
            </p>
            <a
              href={INSTAPAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#5b2d8e] text-white font-semibold text-sm hover:bg-[#4a2575] transition-colors"
            >
              <ExternalLink size={16} />
              <span>اضغط الرابط لإرسال نقود إلى</span>
            </a>
            <p className="text-center font-mono text-[#5b2d8e] font-bold text-base" dir="ltr">
              {INSTAPAY_HANDLE}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-center">ارفع صورة إيصال التحويل</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void handleUpload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl flex items-center justify-center gap-2 border-dashed border-2"
              disabled={uploading || !fingerprint}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={18} />
              {uploading ? "جارٍ الرفع..." : "اختر صورة التحويل"}
            </Button>
            {uploadError && <p className="text-xs text-destructive text-center">{uploadError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminMessageModal({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-sm w-full bg-card rounded-3xl shadow-2xl border border-border p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MessageSquare size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">Message from Teacher</p>
            <p className="text-xs text-muted-foreground" dir="rtl">رسالة من المعلم</p>
          </div>
        </div>
        <div className="bg-muted/60 rounded-2xl p-4">
          <p className="text-foreground leading-relaxed text-sm whitespace-pre-wrap">{message}</p>
        </div>
        <Button
          className="w-full rounded-xl flex flex-col h-auto py-2.5 gap-0.5"
          onClick={onDismiss}
        >
          <span>Got it</span>
          <span className="text-[10px] font-normal opacity-80" dir="rtl">حسناً، فهمت</span>
        </Button>
      </div>
    </div>
  );
}
