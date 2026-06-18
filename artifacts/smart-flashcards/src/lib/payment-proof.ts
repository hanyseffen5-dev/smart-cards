/** Resize & compress transfer screenshot before upload (keeps Apps Script payload small). */
export async function imageFileToBase64(
  file: File,
  maxWidth = 1200,
): Promise<{ base64: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  const base64 = dataUrl.split(",")[1] ?? "";
  if (!base64) throw new Error("Failed to encode image");
  return { base64, mimeType: "image/jpeg" };
}

export async function submitPaymentProof(
  fingerprint: string,
  file: File,
): Promise<{ ok: boolean; error?: string }> {
  const { base64, mimeType } = await imageFileToBase64(file);
  const r = await fetch("/api/students/payment-proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fingerprint, imageBase64: base64, mimeType }),
  });
  if (!r.ok) {
    const body = (await r.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: body.error ?? `Upload failed (${r.status})` };
  }
  return { ok: true };
}
