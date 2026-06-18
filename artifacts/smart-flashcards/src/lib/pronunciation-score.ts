// Pronunciation scoring for single English flashcard words.
// Compares what Whisper heard against the target word using both spelling
// (orthographic) and sound (phonetic) similarity, then picks the best-matching
// token from multi-word output (e.g. "a crayon" → "crayon").

function normalizeWord(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z\s'-]/g, "");
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 100;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
}

/** Compact Metaphone-style phonetic key for English words. */
function phoneticKey(word: string): string {
  const w = word.toUpperCase().replace(/[^A-Z]/g, "");
  if (!w) return "";
  const len = w.length;
  const at = (i: number) => (i >= 0 && i < len ? w[i] : "");
  const isVowel = (c: string) => "AEIOU".includes(c);
  let key = "";
  let i = 0;

  // Drop common silent leading pairs.
  if (/^(KN|GN|PN|WR|PS|AE)/.test(w)) i = 1;
  if (w[0] === "X") { key += "S"; i = 1; }

  const push = (c: string) => { if (c && key[key.length - 1] !== c) key += c; };

  for (; i < len; i++) {
    const c = w[i];
    const next = at(i + 1);
    if (c === next && c !== "C") continue; // collapse doubles
    switch (c) {
      case "A": case "E": case "I": case "O": case "U":
        if (i === 0) push("A");
        break;
      case "B": push("P"); break;
      case "C":
        if (next === "H") { push("X"); i++; }
        else if ("IEY".includes(next)) push("S");
        else push("K");
        break;
      case "D":
        if (next === "G") { push("J"); i++; }
        else push("T");
        break;
      case "G":
        if (next === "H") { i++; }
        else if ("IEY".includes(next)) push("J");
        else push("K");
        break;
      case "H":
        if (isVowel(at(i - 1)) && !isVowel(next)) break;
        push("H");
        break;
      case "K": push("K"); break;
      case "P":
        if (next === "H") { push("F"); i++; }
        else push("P");
        break;
      case "Q": push("K"); break;
      case "S":
        if (next === "H") { push("X"); i++; }
        else push("S");
        break;
      case "T":
        if (next === "H") { push("0"); i++; }
        else push("T");
        break;
      case "V": push("F"); break;
      case "W": case "Y":
        if (isVowel(next)) push(c);
        break;
      case "X": push("K"); push("S"); break;
      case "Z": push("S"); break;
      case "F": case "J": case "L": case "M": case "N": case "R":
        push(c);
        break;
      default: break;
    }
  }
  return key;
}

function phoneticScore(a: string, b: string): number {
  const ka = phoneticKey(a);
  const kb = phoneticKey(b);
  if (!ka || !kb) return 0;
  if (ka === kb) return 100;
  return similarity(ka, kb);
}

export type PronunciationMatch = {
  score: number;
  heard: string;
};

function scoreToken(spoken: string, target: string): number {
  const s = normalizeWord(spoken);
  const t = normalizeWord(target);
  if (!s || !t) return 0;
  if (s === t) return 100;
  if (s.includes(t) || t.includes(s)) return 90;
  const ortho = similarity(s, t);
  const phon = phoneticScore(s, t);
  // Sound matters more than spelling for pronunciation.
  const blended = Math.round(ortho * 0.4 + phon * 0.6);
  return Math.max(ortho, phon, blended);
}

/**
 * Score a (possibly multi-word) Whisper transcript against the target word.
 * Returns the best score and the cleaned text that was heard.
 */
export function scorePronunciation(transcript: string, target: string): PronunciationMatch {
  const heard = transcript.trim();
  const tokens = normalizeWord(transcript).split(/\s+/).filter(Boolean);

  const candidates = new Set<string>();
  candidates.add(normalizeWord(transcript));
  for (const tok of tokens) candidates.add(tok);
  if (tokens.length > 1) candidates.add(tokens.join(""));

  let best = 0;
  for (const c of candidates) {
    const s = scoreToken(c, target);
    if (s > best) best = s;
  }

  return { score: best, heard };
}
