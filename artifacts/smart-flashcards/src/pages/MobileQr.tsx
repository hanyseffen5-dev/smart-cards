import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Copy, Check, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MobileQr() {
  const [copied, setCopied] = useState(false);

  const mobileUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/pronunciation`;
  }, []);

  const handleCopy = async () => {
    if (!mobileUrl) return;
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          <Smartphone size={14} /> Mobile Access
          <span className="text-[10px] font-normal opacity-80" dir="rtl">· دخول من الموبايل</span>
        </div>
        <h1 className="text-2xl font-bold">Scan QR Code</h1>
        <p className="text-sm text-muted-foreground" dir="rtl">امسح الباركود</p>
        <p className="text-sm text-muted-foreground">
          Open your phone camera or QR app to go directly to pronunciation practice
          <span className="block text-[11px]" dir="rtl">افتح كاميرا التليفون وامسح الرمز للانتقال إلى تدريب النطق</span>
        </p>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          {mobileUrl ? (
            <div className="bg-white p-5 rounded-2xl shadow-inner border">
              <QRCodeSVG
                value={mobileUrl}
                size={240}
                level="M"
                includeMargin
              />
            </div>
          ) : (
            <div className="w-[240px] h-[240px] bg-muted rounded-2xl animate-pulse" />
          )}

          <div className="w-full space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
              <Mic size={16} />
              تدريب النطق
            </div>
            <p className="text-xs text-muted-foreground break-all font-mono" dir="ltr">
              {mobileUrl || "..."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={handleCopy}
              disabled={!mobileUrl}
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? "تم النسخ" : "نسخ الرابط"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 text-sm text-amber-900 space-y-2">
        <p className="font-semibold">ملاحظات مهمة:</p>
        <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed opacity-90">
          <li>يجب أن يكون التليفون والكمبيوتر على <strong>نفس شبكة الـ Wi‑Fi</strong></li>
          <li>استخدم <strong>Chrome</strong> على التليفون</li>
          <li>عند ظهور تحذير الأمان → Advanced → Proceed</li>
          <li>اسمح للميكروفون عند الطلب لتفعيل تدريب النطق</li>
        </ul>
      </div>
    </div>
  );
}
