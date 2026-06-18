/**
 * Device fingerprint — same hash on Chrome, Edge, Firefox, etc. on one machine.
 *
 * Avoids browser-specific APIs (language, platform, raw WebGL vendor strings).
 * Uses: CPU cores, screen, timezone, normalized GPU model, WebGL capability nums.
 */

const FP_VERSION = "v3";
const CACHE_KEY = "deviceFingerprint";
const VERSION_KEY = "deviceFingerprintVersion";

/** Screen size independent of browser chrome — sorted so order never flips the hash */
function screenKey(): string {
  const a = Math.max(screen.width, screen.height);
  const b = Math.min(screen.width, screen.height);
  return `${a}x${b}@${screen.colorDepth}`;
}

/** Extract "geforce gtx 1050 ti" from Chrome ANGLE or Firefox PCI strings */
function normalizeGpuModel(vendor: string, renderer: string): string {
  const combined = `${vendor} ${renderer}`.toLowerCase();
  const patterns = [
    /geforce\s+(?:gtx|rtx|mx|gt)\s*\d+\s*(?:ti|super)?/,
    /radeon\s*(?:rx|hd)?\s*\d+/,
    /intel\s*\(?r\)?\s*(?:hd|uhd|iris)\s*graphics\s*\d+/,
    /apple\s*m\d+(?:\s*(?:pro|max|ultra))?/,
    /adreno\s*\(?tm\)?\s*\d+/,
    /mali-[a-z0-9]+/,
  ];
  for (const p of patterns) {
    const m = combined.match(p);
    if (m?.[0]) return m[0].replace(/\s+/g, " ").trim();
  }
  return "";
}

/** Numeric WebGL limits — usually identical across browsers on the same GPU */
function getWebGLCapabilities(gl: WebGLRenderingContext): string {
  const dims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array | null;
  return [
    gl.getParameter(gl.MAX_TEXTURE_SIZE),
    gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    dims?.[0] ?? 0,
    dims?.[1] ?? 0,
    gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
  ].join(",");
}

function getGpuSignal(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    if (!gl || !(gl instanceof WebGLRenderingContext)) return "no-webgl";

    const caps = getWebGLCapabilities(gl);
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const vendor = String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || "");
      const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "");
      const model = normalizeGpuModel(vendor, renderer);
      if (model) return `${model}|${caps}`;
    }
    return `caps|${caps}`;
  } catch {
    return "no-webgl";
  }
}

function collectHardwareSignals(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 0;
  return [
    navigator.hardwareConcurrency ?? 0,
    screenKey(),
    screen.pixelDepth ?? 0,
    window.devicePixelRatio ?? 1,
    navigator.maxTouchPoints ?? 0,
    mem,
    tz,
    getGpuSignal(),
  ].join("|");
}

async function hashSignals(signals: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(signals));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    let h = 0;
    for (const c of signals) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
    return Math.abs(h).toString(16).padStart(16, "0");
  }
}

export async function getDeviceFingerprint(): Promise<string> {
  const cached = localStorage.getItem(CACHE_KEY);
  const version = localStorage.getItem(VERSION_KEY);
  if (cached && version === FP_VERSION) return cached;

  const fingerprint = await hashSignals(collectHardwareSignals());
  localStorage.setItem(CACHE_KEY, fingerprint);
  localStorage.setItem(VERSION_KEY, FP_VERSION);
  return fingerprint;
}

/** Dev helper — log raw signals to compare across browsers on the same PC */
export async function debugDeviceSignals(): Promise<{ signals: string; fingerprint: string }> {
  const signals = collectHardwareSignals();
  const fingerprint = await hashSignals(signals);
  return { signals, fingerprint };
}
