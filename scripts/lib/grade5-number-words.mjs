/** Build grade-4-style hyphenated number words and Arabic labels. */

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

const AR_ONES = [
  "",
  "واحد",
  "اثنان",
  "ثلاثة",
  "أربعة",
  "خمسة",
  "ستة",
  "سبعة",
  "ثمانية",
  "تسعة",
  "عشرة",
  "أحد عشر",
  "اثنا عشر",
  "ثلاثة عشر",
  "أربعة عشر",
  "خمسة عشر",
  "ستة عشر",
  "سبعة عشر",
  "ثمانية عشر",
  "تسعة عشر",
];
const AR_TENS = [
  "",
  "",
  "عشرون",
  "ثلاثون",
  "أربعون",
  "خمسون",
  "ستون",
  "سبعون",
  "ثمانون",
  "تسعون",
];

const EN_TO_INT = Object.fromEntries(
  ONES.flatMap((w, i) => (w ? [[w, i]] : [])).concat(
    TENS.flatMap((w, i) => (w ? [[w, i * 10]] : [])),
  ),
);

function under100En(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${TENS[t]}-${ONES[o]}` : TENS[t];
}

function under100Ar(n) {
  if (n < 20) return AR_ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (!o) return AR_TENS[t];
  return `${AR_ONES[o]} و${AR_TENS[t]}`;
}

function arHundredLabel(hundreds) {
  if (hundreds === 1) return "مئة";
  if (hundreds === 2) return "مائتان";
  return `${AR_ONES[hundreds]} مائة`;
}

/** @returns {{ word: string, translation: string, value: number }} */
export function numberCardMeta(n) {
  if (n < 100) {
    return { word: under100En(n), translation: under100Ar(n), value: n };
  }
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const hundredPart = hundreds === 1 ? "one-hundred" : `${ONES[hundreds]}-hundred`;
  const word = rest ? `${hundredPart}-${under100En(rest)}` : hundredPart;
  const arHundred = arHundredLabel(hundreds);
  const translation = rest ? `${arHundred} و${under100Ar(rest)}` : arHundred;
  return { word, translation, value: n };
}

function parseUnder100Parts(parts) {
  if (parts.length === 0) return 0;
  if (parts.length === 1) {
    const v = EN_TO_INT[parts[0]];
    if (v == null) throw new Error(`Unknown number part: ${parts[0]}`);
    return v;
  }
  const tensIdx = TENS.indexOf(parts[0]);
  if (tensIdx < 0) throw new Error(`Unknown tens: ${parts[0]}`);
  const ones = EN_TO_INT[parts[1]];
  if (ones == null || ones >= 20) throw new Error(`Unknown ones: ${parts[1]}`);
  return tensIdx * 10 + ones;
}

/** Parse hyphenated English number words (e.g. three-hundred-twenty-one → 321). */
export function parseNumberWord(word) {
  const w = word.toLowerCase().trim();
  const SPECIAL = { thousand: 1000, million: 1_000_000, billion: 1_000_000_000 };
  if (SPECIAL[w] != null) return SPECIAL[w];

  const parts = w.split("-");
  const hi = parts.indexOf("hundred");
  if (hi >= 0) {
    const hWord = hi === 0 ? "one" : parts[hi - 1];
    const h = EN_TO_INT[hWord];
    if (!h) throw new Error(`Unknown hundred word: ${word}`);
    return h * 100 + parseUnder100Parts(parts.slice(hi + 1));
  }
  return parseUnder100Parts(parts);
}

const AR_SPECIAL = { thousand: "ألف", million: "مليون", billion: "مليار" };

/** Arabic label for a flashcard number word. */
export function arabicTranslationForWord(word) {
  const w = word.toLowerCase().trim();
  if (AR_SPECIAL[w]) return AR_SPECIAL[w];
  return numberCardMeta(parseNumberWord(word)).translation;
}

/** Grade 4 skips round tens (150, 160…) — keep same pattern above 156. */
export function grade5NumberSequence(start, count) {
  const out = [];
  let n = start;
  while (out.length < count) {
    const mod = n % 100;
    if (mod !== 0 && mod % 10 === 0) {
      n++;
      continue;
    }
    out.push(numberCardMeta(n));
    n++;
  }
  return out;
}
