import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, FileSearch, AlertCircle, X } from "lucide-react";

interface FileUploadPanelProps {
  onTextReady: (text: string) => void;
  onExtract: (imageBase64: string, mimeType: string) => void;
  isExtracting: boolean;
  isOcrFallback?: boolean;
}

type FileState = "idle" | "ready_txt" | "ready_binary" | "error";

/**
 * Downscale + re-encode a photo so the OCR request stays well under the
 * server body limit (camera photos are often 10–25 MB raw → 413 errors).
 * Keeps resolution high enough for clear text recognition.
 */
async function compressImage(
  file: File,
  maxDim = 2000,
  quality = 0.85,
): Promise<{ base64: string; mimeType: string }> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });

  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("decode failed"));
    i.src = dataUrl;
  });

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const scale = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const base64 = dataUrl.split(",")[1] ?? "";
    return { base64, mimeType: file.type };
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const out = canvas.toDataURL("image/jpeg", quality);
  return { base64: out.split(",")[1] ?? "", mimeType: "image/jpeg" };
}

const MIME_META: Record<string, { label: string; icon: React.ReactNode }> = {
  "image/jpeg":      { label: "صورة JPEG", icon: <Image size={20} className="text-blue-500" /> },
  "image/png":       { label: "صورة PNG",  icon: <Image size={20} className="text-blue-500" /> },
  "image/webp":      { label: "صورة WEBP", icon: <Image size={20} className="text-blue-500" /> },
  "application/pdf": { label: "ملف PDF",   icon: <FileText size={20} className="text-red-500" /> },
  "text/plain":      { label: "ملف نصي",   icon: <FileText size={20} className="text-green-500" /> },
};

export function FileUploadPanel({ onTextReady, onExtract, isExtracting, isOcrFallback = false }: FileUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileState, setFileState] = useState<FileState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingBase64, setPendingBase64] = useState<string | null>(null);
  const [pendingMime, setPendingMime] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    const type = file.type;
    if (!MIME_META[type]) {
      setErrorMsg(`نوع الملف غير مدعوم: ${file.name}`);
      setFileState("error");
      return;
    }
    setErrorMsg("");
    setSelectedFile(file);

    if (type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        onTextReady(e.target?.result as string);
        setFileState("ready_txt");
      };
      reader.readAsText(file);
      return;
    }

    if (type === "application/pdf") {
      if (file.size > 24 * 1024 * 1024) {
        setErrorMsg("ملف PDF كبير جداً (الحد 24 ميجابايت). جرّب ملفاً أصغر.");
        setFileState("error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPendingBase64(dataUrl.split(",")[1] ?? null);
        setPendingMime(type);
        setFileState("ready_binary");
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      const { base64, mimeType } = await compressImage(file);
      setPendingBase64(base64);
      setPendingMime(mimeType);
      setFileState("ready_binary");
    } catch {
      setErrorMsg("تعذّر معالجة الصورة. جرّب صورة أخرى.");
      setFileState("error");
    }
  }, [onTextReady]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void processFile(file);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
    e.target.value = "";
  };

  const handleExtract = () => {
    if (pendingBase64 && pendingMime) {
      onExtract(pendingBase64, pendingMime);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setFileState("idle");
    setErrorMsg("");
    setPendingBase64(null);
    setPendingMime(null);
  };

  if (fileState === "ready_txt" && selectedFile) {
    const meta = MIME_META[selectedFile.type];
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-green-400/40 bg-green-50">
          <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center shrink-0 shadow-sm">
            {meta?.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {meta?.label} · {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl p-3 border border-green-200">
          <FileText size={16} />
          <span>تمت قراءة الملف النصي مباشرةً — النص جاهز للتحليل</span>
        </div>
      </div>
    );
  }

  if (fileState === "ready_binary" && selectedFile) {
    const originalType = selectedFile.type;
    const meta = MIME_META[originalType];
    const isPdf = originalType === "application/pdf";
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-primary/30 bg-primary/5">
          <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center shrink-0 shadow-sm">
            {meta?.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {meta?.label} · {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={reset}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isExtracting}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {isPdf
              ? "الملف جاهز — انقر لاستخراج النص من PDF"
              : "الملف جاهز — انقر لاستخراج النص بالذكاء الاصطناعي"}
          </p>
          <Button
            onClick={handleExtract}
            disabled={isExtracting || !pendingBase64}
            className="gap-2 rounded-xl px-5 shrink-0"
          >
            <FileSearch size={16} />
            {isExtracting ? "جاري الاستخراج..." : "استخرج النص"}
          </Button>
        </div>
        {isExtracting && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full shrink-0" />
            <span>
              {isOcrFallback
                ? "ملف ممسوح ضوئياً — جاري التعرف على النص بالذكاء الاصطناعي..."
                : "جاري استخراج النص بالذكاء الاصطناعي..."}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (fileState === "error") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl border-2 border-destructive/30 bg-destructive/5">
        <AlertCircle size={28} className="text-destructive" />
        <p className="text-sm text-destructive font-medium text-center">{errorMsg}</p>
        <p className="text-xs text-muted-foreground text-center">
          الأنواع المدعومة: JPG, PNG, WEBP, PDF, TXT
        </p>
        <Button variant="outline" onClick={reset} className="rounded-xl">
          اختر ملفاً آخر
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-12 px-4 rounded-2xl border-2 border-dashed transition-all min-h-[280px] cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-muted-foreground/30 bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Upload size={28} className="text-primary" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-lg">
          {isDragging ? "أفلت الملف هنا" : "اسحب وأفلت الملف"}
        </p>
        <p className="text-sm text-muted-foreground">أو انقر للاختيار من الجهاز</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap justify-center">
        <span className="px-2 py-1 bg-muted rounded-lg">JPG</span>
        <span className="px-2 py-1 bg-muted rounded-lg">PNG</span>
        <span className="px-2 py-1 bg-muted rounded-lg">WEBP</span>
        <span className="px-2 py-1 bg-muted rounded-lg">PDF</span>
        <span className="px-2 py-1 bg-muted rounded-lg">TXT</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
