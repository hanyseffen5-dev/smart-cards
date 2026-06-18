// Fully local, in-browser speech recognition using Whisper (transformers.js).
// No Google Web Speech, no Gemini, no quota, no payment, works offline once cached.
//
// transformers.js is loaded inside a Web Worker from a CDN via a Blob module
// worker to avoid Vite/Rollup bundling issues with onnxruntime-web.

const TRANSFORMERS_CDN = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";
// base.en is a good accuracy/speed balance for short single words.
const MODEL_ID = "Xenova/whisper-base.en";
const SAMPLE_RATE = 16000;

export const NO_SPEECH_ERROR = "NO_SPEECH";

export type AsrProgress = {
  status: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
};

const WORKER_SOURCE = `
import { pipeline, env } from "${TRANSFORMERS_CDN}";

env.allowLocalModels = false;
env.useBrowserCache = true;

let asrPromise = null;

function getAsr() {
  if (!asrPromise) {
    asrPromise = pipeline("automatic-speech-recognition", "${MODEL_ID}", {
      progress_callback: (p) => self.postMessage({ kind: "progress", data: p }),
    }).catch((err) => {
      asrPromise = null;
      throw err;
    });
  }
  return asrPromise;
}

self.onmessage = async (e) => {
  const { kind, id, audio } = e.data || {};
  try {
    const asr = await getAsr();
    if (kind === "load") {
      self.postMessage({ kind: "ready", id });
      return;
    }
    if (kind === "transcribe") {
      // Greedy decoding (fast) — whole clip as one utterance for short words.
      const out = await asr(audio, {
        chunk_length_s: 0,
        return_timestamps: false,
        language: "english",
        task: "transcribe",
        temperature: 0,
        do_sample: false,
        num_beams: 1,
        no_repeat_ngram_size: 2,
      });
      const text = Array.isArray(out)
        ? out.map((o) => o.text || "").join(" ")
        : (out && out.text) || "";
      self.postMessage({ kind: "result", id, text: String(text).trim() });
    }
  } catch (err) {
    self.postMessage({ kind: "error", id, message: String((err && err.message) || err) });
  }
};
`;

type Pending = {
  resolve: (text: string) => void;
  reject: (err: Error) => void;
};

let worker: Worker | null = null;
let workerUrl: string | null = null;
let reqId = 0;
const pending = new Map<number, Pending>();
const progressListeners = new Set<(p: AsrProgress) => void>();

function ensureWorker(): Worker {
  if (worker) return worker;
  const blob = new Blob([WORKER_SOURCE], { type: "text/javascript" });
  workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl, { type: "module" });

  worker.onmessage = (e: MessageEvent) => {
    const msg = e.data || {};
    if (msg.kind === "progress") {
      const p = msg.data as AsrProgress;
      progressListeners.forEach((fn) => fn(p));
      return;
    }
    const entry = msg.id != null ? pending.get(msg.id) : undefined;
    if (!entry) return;
    if (msg.kind === "ready") {
      pending.delete(msg.id);
      entry.resolve("");
    } else if (msg.kind === "result") {
      pending.delete(msg.id);
      entry.resolve(String(msg.text ?? ""));
    } else if (msg.kind === "error") {
      pending.delete(msg.id);
      entry.reject(new Error(msg.message || "ASR worker error"));
    }
  };

  worker.onerror = (e) => {
    const err = new Error(e.message || "تعذّر تحميل محرك النطق");
    pending.forEach((entry) => entry.reject(err));
    pending.clear();
  };

  return worker;
}

/** Preload (download + initialize) the Whisper model. Safe to call repeatedly. */
export function loadAsr(onProgress?: (p: AsrProgress) => void): Promise<void> {
  const w = ensureWorker();
  const id = ++reqId;
  if (onProgress) progressListeners.add(onProgress);
  return new Promise<void>((resolve, reject) => {
    pending.set(id, {
      resolve: () => { if (onProgress) progressListeners.delete(onProgress); resolve(); },
      reject: (err) => { if (onProgress) progressListeners.delete(onProgress); reject(err); },
    });
    w.postMessage({ kind: "load", id });
  });
}

async function decodeToMono16k(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioCtx: typeof AudioContext =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  const tmpCtx = new AudioCtx();
  let decoded: AudioBuffer;
  try {
    decoded = await tmpCtx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    void tmpCtx.close();
  }

  if (decoded.sampleRate === SAMPLE_RATE && decoded.numberOfChannels === 1) {
    return decoded.getChannelData(0).slice();
  }

  const frameCount = Math.max(1, Math.ceil(decoded.duration * SAMPLE_RATE));
  const offline = new OfflineAudioContext(1, frameCount, SAMPLE_RATE);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0).slice();
}

function normalizePcm(pcm: Float32Array): Float32Array {
  let peak = 0;
  for (let i = 0; i < pcm.length; i++) {
    const a = Math.abs(pcm[i]);
    if (a > peak) peak = a;
  }
  if (peak < 0.001) return pcm;
  const gain = Math.min(0.92 / peak, 6);
  const out = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) out[i] = pcm[i] * gain;
  return out;
}

function padPcm(pcm: Float32Array, padMs = 250): Float32Array {
  const pad = Math.floor((SAMPLE_RATE * padMs) / 1000);
  const out = new Float32Array(pcm.length + pad * 2);
  out.set(pcm, pad);
  return out;
}

/** Energy-based VAD + silence trimming so Whisper never sees pure silence. */
function analyzeSpeech(pcm: Float32Array): { hadSpeech: boolean; trimmed: Float32Array } {
  const frame = 320;
  const frameCount = Math.floor(pcm.length / frame);
  if (frameCount === 0) return { hadSpeech: false, trimmed: pcm };

  const rms = new Float32Array(frameCount);
  let peak = 0;
  for (let f = 0; f < frameCount; f++) {
    let sum = 0;
    const base = f * frame;
    for (let j = 0; j < frame; j++) {
      const v = pcm[base + j];
      sum += v * v;
    }
    const r = Math.sqrt(sum / frame);
    rms[f] = r;
    if (r > peak) peak = r;
  }

  const threshold = Math.max(0.015, peak * 0.25);
  let first = -1;
  let last = -1;
  let voicedFrames = 0;
  for (let f = 0; f < frameCount; f++) {
    if (rms[f] >= threshold) {
      if (first < 0) first = f;
      last = f;
      voicedFrames++;
    }
  }

  const voicedMs = voicedFrames * 20;
  const hadSpeech = peak >= 0.025 && voicedMs >= 110 && first >= 0;
  if (!hadSpeech) return { hadSpeech: false, trimmed: pcm };

  const pad = 6;
  const start = Math.max(0, (first - pad) * frame);
  const end = Math.min(pcm.length, (last + pad + 1) * frame);
  return { hadSpeech: true, trimmed: padPcm(normalizePcm(pcm.slice(start, end))) };
}

/**
 * Transcribe a recorded audio Blob to English text, fully on-device.
 * Throws Error(NO_SPEECH_ERROR) when no real speech is detected.
 */
export async function transcribeBlob(
  blob: Blob,
  onProgress?: (p: AsrProgress) => void,
): Promise<string> {
  const audio = await decodeToMono16k(blob);
  const { hadSpeech, trimmed } = analyzeSpeech(audio);
  if (!hadSpeech) throw new Error(NO_SPEECH_ERROR);

  const w = ensureWorker();
  const id = ++reqId;
  if (onProgress) progressListeners.add(onProgress);
  return new Promise<string>((resolve, reject) => {
    pending.set(id, {
      resolve: (text) => { if (onProgress) progressListeners.delete(onProgress); resolve(text); },
      reject: (err) => { if (onProgress) progressListeners.delete(onProgress); reject(err); },
    });
    w.postMessage({ kind: "transcribe", id, audio: trimmed }, [trimmed.buffer]);
  });
}

export function isLocalAsrSupported(): boolean {
  return (
    typeof Worker !== "undefined" &&
    typeof WebAssembly === "object" &&
    typeof OfflineAudioContext !== "undefined"
  );
}
