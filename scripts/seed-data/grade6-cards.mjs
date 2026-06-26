/** Grade 6 lesson — 2000 cards target. */
import { GRADE6_CHUNK_A } from "./grade6-chunk-a.mjs";
import { GRADE6_CHUNK_B } from "./grade6-chunk-b.mjs";
import { GRADE6_CHUNK_C } from "./grade6-chunk-c.mjs";
import { GRADE6_CHUNK_D } from "./grade6-chunk-d.mjs";
import { GRADE6_CHUNK_E } from "./grade6-chunk-e.mjs";
import { GRADE6_CHUNK_F } from "./grade6-chunk-f.mjs";
import { GRADE6_CHUNK_G } from "./grade6-chunk-g.mjs";
import { GRADE6_CHUNK_H } from "./grade6-chunk-h.mjs";
import { GRADE6_CHUNK_I } from "./grade6-chunk-i.mjs";
import { GRADE6_FORBIDDEN_WORDS, GRADE6_FORBIDDEN_EXAMPLES } from "./grade6-forbidden.mjs";
import { GRADE6_R1 } from "./grade6-rep-1.mjs";
import { GRADE6_R2 } from "./grade6-rep-2.mjs";
import { GRADE6_R3 } from "./grade6-rep-3.mjs";
import { GRADE6_R4 } from "./grade6-rep-4.mjs";
import { GRADE6_R5 } from "./grade6-rep-5.mjs";
import { GRADE6_R6 } from "./grade6-rep-6.mjs";
import { GRADE6_ALPHABET } from "./grade6-alphabet.mjs";
import { GRADE6_EXTENSION } from "./grade6-extension.mjs";
import { GRADE6_FINAL } from "./grade6-final.mjs";

export const GRADE6_LESSON_TITLE = "grade 6";
export const GRADE6_TARGET_TOTAL = 2000;

/** Batch 1 — the 25 starter words provided for Grade 6. */
export const GRADE6_INTRO = [
  { word: "analyze", translation: "يحلل", partOfSpeech: "verb", difficulty: "medium", example: "We must analyze the data.", exampleTranslation: "علينا أن نحلل البيانات." },
  { word: "benefit", translation: "فائدة", partOfSpeech: "noun", difficulty: "medium", example: "Education has a great benefit.", exampleTranslation: "للتعليم فائدة عظيمة." },
  { word: "challenge", translation: "تحدٍّ", partOfSpeech: "noun", difficulty: "medium", example: "This project is a big challenge.", exampleTranslation: "هذا المشروع تحدٍّ كبير." },
  { word: "develop", translation: "يطوّر", partOfSpeech: "verb", difficulty: "medium", example: "Students develop their skills.", exampleTranslation: "يطوّر الطلاب مهاراتهم." },
  { word: "efficient", translation: "كفء", partOfSpeech: "adjective", difficulty: "medium", example: "An efficient way to study.", exampleTranslation: "طريقة كفؤة للدراسة." },
  { word: "generate", translation: "ينشئ", partOfSpeech: "verb", difficulty: "medium", example: "Machines generate power.", exampleTranslation: "تولّد الآلات الطاقة." },
  { word: "habitat", translation: "موطن", partOfSpeech: "noun", difficulty: "medium", example: "The desert is a natural habitat.", exampleTranslation: "الصحراء موطن طبيعي." },
  { word: "investigate", translation: "يحقّق", partOfSpeech: "verb", difficulty: "medium", example: "Scientists investigate space.", exampleTranslation: "يحقّق العلماء في الفضاء." },
  { word: "knowledge", translation: "معرفة", partOfSpeech: "noun", difficulty: "medium", example: "Gain knowledge every day.", exampleTranslation: "اكتسب المعرفة كل يوم." },
  { word: "maintain", translation: "يحافظ", partOfSpeech: "verb", difficulty: "medium", example: "Maintain your health.", exampleTranslation: "حافظ على صحتك." },
  { word: "observe", translation: "يلاحظ", partOfSpeech: "verb", difficulty: "medium", example: "Observe the stars at night.", exampleTranslation: "راقب النجوم في الليل." },
  { word: "participate", translation: "يشارك", partOfSpeech: "verb", difficulty: "medium", example: "Participate in the school play.", exampleTranslation: "شارك في المسرحية المدرسية." },
  { word: "quality", translation: "جودة", partOfSpeech: "noun", difficulty: "medium", example: "High quality of work.", exampleTranslation: "جودة عالية في العمل." },
  { word: "reflect", translation: "يعكس", partOfSpeech: "verb", difficulty: "medium", example: "Mirrors reflect the light.", exampleTranslation: "تعكس المرايا الضوء." },
  { word: "significant", translation: "هام", partOfSpeech: "adjective", difficulty: "medium", example: "A significant improvement.", exampleTranslation: "تحسّن هام." },
  { word: "structure", translation: "هيكل", partOfSpeech: "noun", difficulty: "medium", example: "The structure of the building.", exampleTranslation: "هيكل المبنى." },
  { word: "technique", translation: "أسلوب", partOfSpeech: "noun", difficulty: "medium", example: "A new drawing technique.", exampleTranslation: "أسلوب جديد في الرسم." },
  { word: "understand", translation: "يفهم", partOfSpeech: "verb", difficulty: "medium", example: "Understand the instructions.", exampleTranslation: "افهم التعليمات." },
  { word: "vibrant", translation: "حيوي", partOfSpeech: "adjective", difficulty: "medium", example: "A vibrant community.", exampleTranslation: "مجتمع حيوي." },
  { word: "widespread", translation: "واسع الانتشار", partOfSpeech: "adjective", difficulty: "medium", example: "A widespread rumor.", exampleTranslation: "شائعة واسعة الانتشار." },
  { word: "access", translation: "وصول", partOfSpeech: "noun", difficulty: "medium", example: "Access to the library.", exampleTranslation: "الوصول إلى المكتبة." },
  { word: "bound", translation: "يقفز / يرتبط", partOfSpeech: "verb", difficulty: "medium", example: "The animal was bound by a rope.", exampleTranslation: "كان الحيوان مربوطاً بحبل." },
  { word: "collaborate", translation: "يتعاون", partOfSpeech: "verb", difficulty: "medium", example: "Collaborate with your team.", exampleTranslation: "تعاون مع فريقك." },
  { word: "define", translation: "يحدّد", partOfSpeech: "verb", difficulty: "medium", example: "Define the meaning clearly.", exampleTranslation: "حدّد المعنى بوضوح." },
  { word: "establish", translation: "يؤسّس", partOfSpeech: "verb", difficulty: "medium", example: "Establish a new club.", exampleTranslation: "أسّس نادياً جديداً." },
];

/** Batch 2 — the new starter words provided for the second 500 (duplicates of batch 1 omitted). */
export const GRADE6_INTRO2 = [
  { word: "balance", translation: "توازن", partOfSpeech: "noun", difficulty: "medium", example: "Keep a good work-life balance.", exampleTranslation: "حافظ على توازن جيد بين العمل والحياة." },
  { word: "create", translation: "ينشئ/يبتكر", partOfSpeech: "verb", difficulty: "medium", example: "Create something new today.", exampleTranslation: "ابتكر شيئاً جديداً اليوم." },
  { word: "formulate", translation: "يصيغ", partOfSpeech: "verb", difficulty: "hard", example: "Formulate a clear plan.", exampleTranslation: "صُغ خطة واضحة." },
  { word: "growth", translation: "نمو", partOfSpeech: "noun", difficulty: "medium", example: "Economic growth is important.", exampleTranslation: "النمو الاقتصادي مهم." },
  { word: "kindness", translation: "لطف", partOfSpeech: "noun", difficulty: "medium", example: "Show kindness to others.", exampleTranslation: "أظهر اللطف للآخرين." },
  { word: "logic", translation: "منطق", partOfSpeech: "noun", difficulty: "hard", example: "Use logic to solve problems.", exampleTranslation: "استخدم المنطق لحل المشكلات." },
  { word: "navigate", translation: "يتصفّح/يوجّه", partOfSpeech: "verb", difficulty: "hard", example: "Navigate the website easily.", exampleTranslation: "تصفّح الموقع بسهولة." },
  { word: "quest", translation: "مهمة/بحث", partOfSpeech: "noun", difficulty: "hard", example: "A quest for knowledge.", exampleTranslation: "رحلة بحث عن المعرفة." },
  { word: "visualize", translation: "يتخيّل/يتصوّر", partOfSpeech: "verb", difficulty: "hard", example: "Visualize the final result.", exampleTranslation: "تخيّل النتيجة النهائية." },
  { word: "wonder", translation: "يتساءل", partOfSpeech: "verb", difficulty: "medium", example: "I wonder how it works.", exampleTranslation: "أتساءل كيف يعمل ذلك." },
  { word: "x-ray", translation: "أشعة سينية", partOfSpeech: "noun", difficulty: "medium", example: "Take an X-ray scan.", exampleTranslation: "خذ صورة بالأشعة السينية." },
  { word: "yield", translation: "ينتج/يخضع", partOfSpeech: "verb", difficulty: "hard", example: "The farm will yield crops.", exampleTranslation: "ستنتج المزرعة المحاصيل." },
  { word: "zone", translation: "منطقة", partOfSpeech: "noun", difficulty: "medium", example: "A safe play zone.", exampleTranslation: "منطقة لعب آمنة." },
  { word: "adjust", translation: "يعدّل", partOfSpeech: "verb", difficulty: "medium", example: "Adjust the settings.", exampleTranslation: "اضبط الإعدادات." },
  { word: "brief", translation: "موجز", partOfSpeech: "adjective", difficulty: "medium", example: "Give a brief summary.", exampleTranslation: "قدّم ملخّصاً موجزاً." },
];

/** Batch 3 — the new starter words provided for the third 500 (duplicates of earlier batches omitted). */
export const GRADE6_INTRO3 = [
  { word: "benchmark", translation: "معيار قياس", partOfSpeech: "noun", difficulty: "hard", example: "Use this score as a benchmark.", exampleTranslation: "استخدم هذه الدرجة معياراً للقياس." },
  { word: "construct", translation: "يبني/يشيّد", partOfSpeech: "verb", difficulty: "medium", example: "They will construct a new bridge.", exampleTranslation: "سيشيّدون جسراً جديداً." },
  { word: "dimension", translation: "بُعد", partOfSpeech: "noun", difficulty: "hard", example: "Measure every dimension of the box.", exampleTranslation: "قِس كل بُعد من أبعاد الصندوق." },
  { word: "fluctuate", translation: "يتذبذب", partOfSpeech: "verb", difficulty: "hard", example: "Prices tend to fluctuate.", exampleTranslation: "تميل الأسعار إلى التذبذب." },
  { word: "hierarchy", translation: "تسلسل هرمي", partOfSpeech: "noun", difficulty: "hard", example: "Follow the office hierarchy.", exampleTranslation: "اتبع التسلسل الهرمي للمكتب." },
  { word: "justification", translation: "تبرير", partOfSpeech: "noun", difficulty: "hard", example: "You need a strong justification.", exampleTranslation: "تحتاج إلى تبرير قوي." },
  { word: "kinetic", translation: "حركي", partOfSpeech: "adjective", difficulty: "hard", example: "Kinetic energy is fascinating.", exampleTranslation: "الطاقة الحركية مذهلة." },
  { word: "label", translation: "يصنّف/ملصق", partOfSpeech: "verb", difficulty: "medium", example: "Label the bottles correctly.", exampleTranslation: "صنّف الزجاجات بشكل صحيح." },
  { word: "magnitude", translation: "حجم/قَدْر", partOfSpeech: "noun", difficulty: "hard", example: "The magnitude of the problem was huge.", exampleTranslation: "كان حجم المشكلة هائلاً." },
  { word: "neutral", translation: "محايد", partOfSpeech: "adjective", difficulty: "medium", example: "Stay neutral in the debate.", exampleTranslation: "ابقَ محايداً في النقاش." },
  { word: "prioritize", translation: "يُعطي الأولوية", partOfSpeech: "verb", difficulty: "hard", example: "Prioritize your daily tasks.", exampleTranslation: "أعطِ الأولوية لمهامك اليومية." },
  { word: "quantify", translation: "يقيس كمّياً", partOfSpeech: "verb", difficulty: "hard", example: "Quantify the expected results.", exampleTranslation: "قِس النتائج المتوقّعة كمّياً." },
  { word: "synthesize", translation: "يركّب/يجمع", partOfSpeech: "verb", difficulty: "hard", example: "Synthesize the information into a report.", exampleTranslation: "اجمع المعلومات في تقرير." },
  { word: "validity", translation: "صلاحية/صحّة", partOfSpeech: "noun", difficulty: "hard", example: "Check the validity of the data.", exampleTranslation: "تحقّق من صحّة البيانات." },
  { word: "width", translation: "عرض", partOfSpeech: "noun", difficulty: "medium", example: "Measure the width of the box.", exampleTranslation: "قِس عرض الصندوق." },
  { word: "xenon", translation: "زينون", partOfSpeech: "noun", difficulty: "hard", example: "Xenon is a chemical element.", exampleTranslation: "الزينون عنصر كيميائي." },
  { word: "yearly", translation: "سنوي", partOfSpeech: "adjective", difficulty: "medium", example: "A yearly report is required.", exampleTranslation: "يُطلب تقرير سنوي." },
  { word: "zealous", translation: "متحمّس", partOfSpeech: "adjective", difficulty: "hard", example: "He is a zealous supporter of art.", exampleTranslation: "هو مناصر متحمّس للفن." },
  { word: "attribute", translation: "يعزو إلى", partOfSpeech: "verb", difficulty: "hard", example: "Attribute the success to hard work.", exampleTranslation: "اعزُ النجاح إلى العمل الجاد." },
  { word: "bias", translation: "تحيّز", partOfSpeech: "noun", difficulty: "hard", example: "Avoid personal bias in your report.", exampleTranslation: "تجنّب التحيّز الشخصي في تقريرك." },
  { word: "consensus", translation: "إجماع", partOfSpeech: "noun", difficulty: "hard", example: "The group reached a consensus.", exampleTranslation: "توصّلت المجموعة إلى إجماع." },
  { word: "deduction", translation: "استنتاج", partOfSpeech: "noun", difficulty: "hard", example: "Use logic for your deduction.", exampleTranslation: "استخدم المنطق في استنتاجك." },
];

/** Original authored cards (before cross-lesson de-duplication). */
const GRADE6_BASE_RAW = [
  ...GRADE6_INTRO,
  ...GRADE6_CHUNK_A,
  ...GRADE6_CHUNK_B,
  ...GRADE6_CHUNK_C,
  ...GRADE6_INTRO2,
  ...GRADE6_CHUNK_D,
  ...GRADE6_CHUNK_E,
  ...GRADE6_CHUNK_F,
  ...GRADE6_INTRO3,
  ...GRADE6_CHUNK_G,
  ...GRADE6_CHUNK_H,
  ...GRADE6_CHUNK_I,
];

/** New unique cards that replace the words shared with other lessons. */
export const GRADE6_REPLACEMENTS = [
  ...GRADE6_R1,
  ...GRADE6_R2,
  ...GRADE6_R3,
  ...GRADE6_R4,
  ...GRADE6_R5,
  ...GRADE6_R6,
];

import { normWord, normExample } from "../lib/normalize.mjs";

function isForbidden(card) {
  return (
    GRADE6_FORBIDDEN_WORDS.has(normWord(card.word)) ||
    GRADE6_FORBIDDEN_EXAMPLES.has(normExample(card.example))
  );
}

// Remove cards whose word or example already exists in another lesson, then top up
// with replacement cards so grade 6 stays at 1500 fully-unique cards.
export const GRADE6_CARDS_RAW = [
  ...GRADE6_BASE_RAW.filter((c) => !isForbidden(c)),
  ...GRADE6_REPLACEMENTS,
  ...GRADE6_ALPHABET.filter((c) => !isForbidden(c)),
  ...GRADE6_EXTENSION.filter((c) => !isForbidden(c)),
  ...GRADE6_FINAL.filter((c) => !isForbidden(c)),
];

function validateGrade6Cards(cards) {
  const seenWords = new Set();
  const seenExamples = new Set();
  const errors = [];

  for (const c of cards) {
    const w = normWord(c.word);
    const ex = normExample(c.example);
    if (!c.word || !c.translation || !c.example || !c.exampleTranslation) {
      errors.push(`missing field on card: ${JSON.stringify(c)}`);
    }
    if (GRADE6_FORBIDDEN_WORDS.has(w)) {
      errors.push(`word overlaps another lesson: "${c.word}"`);
    }
    if (GRADE6_FORBIDDEN_EXAMPLES.has(ex)) {
      errors.push(`example overlaps another lesson: "${c.example}"`);
    }
    if (seenWords.has(w)) errors.push(`duplicate word in grade 6: "${c.word}"`);
    if (seenExamples.has(ex)) errors.push(`duplicate example in grade 6: "${c.example}"`);
    seenWords.add(w);
    seenExamples.add(ex);
  }

  if (errors.length) {
    throw new Error(`grade6-cards validation failed:\n${errors.join("\n")}`);
  }
}

/** One card per English word (first occurrence wins). */
export const GRADE6_CARDS = (() => {
  const seen = new Set();
  const out = [];
  for (const card of GRADE6_CARDS_RAW) {
    const key = normWord(card.word);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(card);
  }
  if (out.length !== GRADE6_CARDS_RAW.length) {
    const dupCount = GRADE6_CARDS_RAW.length - out.length;
    console.warn(`grade6-cards: dropped ${dupCount} duplicate word(s).`);
  }
  validateGrade6Cards(out);
  return out;
})();
