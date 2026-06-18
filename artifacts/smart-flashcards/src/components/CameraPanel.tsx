import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Scan, AlertCircle, FileSearch } from "lucide-react";

interface CameraPanelProps {
  isExtracting: boolean;
  onExtract: (imageBase64: string, mimeType: string) => void;
}

type CameraState = "idle" | "requesting" | "live" | "captured" | "denied";

export function CameraPanel({ isExtracting, onExtract }: CameraPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  useEffect(() => {
    if (cameraState === "live" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraState]);

  const startCamera = async () => {
    setCameraState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraState("live");
    } catch {
      setCameraState("denied");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64 = dataUrl.split(",")[1] ?? null;
    setCapturedImage(dataUrl);
    setCapturedBase64(base64);
    setCameraState("captured");
    stopStream();
  };

  const retake = () => {
    setCapturedImage(null);
    setCapturedBase64(null);
    setCameraState("idle");
  };

  const handleExtract = () => {
    if (capturedBase64) {
      onExtract(capturedBase64, "image/jpeg");
    }
  };

  if (cameraState === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 min-h-[280px]">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera size={28} className="text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-lg">التقاط صورة من الكاميرا</p>
          <p className="text-sm text-muted-foreground">صوّر صفحة كتاب أو ورقة عمل واستخرج النص تلقائياً</p>
        </div>
        <Button onClick={startCamera} className="gap-2 rounded-xl px-6">
          <Camera size={16} />
          فتح الكاميرا
        </Button>
      </div>
    );
  }

  if (cameraState === "requesting") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 min-h-[280px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-muted-foreground text-sm">جاري طلب إذن الكاميرا...</p>
      </div>
    );
  }

  if (cameraState === "denied") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 rounded-2xl border-2 border-destructive/30 bg-destructive/5 min-h-[280px]">
        <AlertCircle size={32} className="text-destructive" />
        <div className="text-center space-y-1">
          <p className="font-semibold text-destructive">لا يمكن الوصول إلى الكاميرا</p>
          <p className="text-sm text-muted-foreground">تأكد من منح الإذن للكاميرا في إعدادات المتصفح</p>
        </div>
        <Button variant="outline" onClick={() => setCameraState("idle")} className="gap-2 rounded-xl">
          حاول مجدداً
        </Button>
      </div>
    );
  }

  if (cameraState === "captured" && capturedImage) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden border bg-black">
          <img src={capturedImage} alt="Captured" className="w-full object-contain max-h-[340px]" />
          {isExtracting && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
              <p className="text-white text-sm font-medium">جاري استخراج النص...</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-between">
          <Button variant="outline" onClick={retake} className="gap-2 rounded-xl" disabled={isExtracting}>
            <RefreshCw size={15} />
            إعادة التصوير
          </Button>
          <Button onClick={handleExtract} className="gap-2 rounded-xl px-6" disabled={isExtracting}>
            <FileSearch size={16} />
            {isExtracting ? "جاري الاستخراج..." : "استخرج النص"}
          </Button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden border bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full object-contain max-h-[340px]"
        />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <button
            onClick={capture}
            className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
            aria-label="التقاط صورة"
          >
            <Scan size={24} className="text-primary" />
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
