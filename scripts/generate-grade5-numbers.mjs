/**
 * @deprecated Grade 5 no longer uses number cards. Use generate-grade5-replace-numbers.mjs instead.
 * Generates number cards for grade 5 (157+) with unique examples.
 * Output: scripts/seed-data/grade5-chunk-numbers.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { grade5NumberSequence, numberCardMeta } from "./lib/grade5-number-words.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const COUNT = 400;
const numbers = grade5NumberSequence(157, COUNT);

const templates = [
  (en, ar) => ({
    example: `${cap(en)} students joined the robotics showcase.`,
    exampleTranslation: `انضم ${ar} طالباً إلى معرض الروبوتات.`,
  }),
  (en, ar) => ({
    example: `The museum catalog lists ${en.replace(/-/g, " ")} ancient artifacts.`,
    exampleTranslation: `يسرد دليل المتحف ${ar} قطعة أثرية قديمة.`,
  }),
  (en, ar) => ({
    example: `Volunteers planted ${en.replace(/-/g, " ")} saplings along the riverbank.`,
    exampleTranslation: `زرع المتطوعون ${ar} شتلة على ضفة النهر.`,
  }),
  (en, ar) => ({
    example: `Room ${en.replace(/-/g, " ")} stores the chemistry lab goggles.`,
    exampleTranslation: `تخزن الغرفة ${ar} نظارات مختبر الكيمياء.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} lanterns decorated the cultural festival gate.`,
    exampleTranslation: `زيّن ${ar} فانوساً بوابة المهرجان الثقافي.`,
  }),
  (en, ar) => ({
    example: `The orchestra rehearsed ${en.replace(/-/g, " ")} measures before the concert.`,
    exampleTranslation: `تدربت الأوركسترا على ${ar} وزرة قبل الحفل.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} families donated books during literacy week.`,
    exampleTranslation: `تبرعت ${ar} عائلة بكتب خلال أسبوع القراءة.`,
  }),
  (en, ar) => ({
    example: `Trail markers counted ${en.replace(/-/g, " ")} switchbacks on the ridge.`,
    exampleTranslation: `عدّت علامات المسار ${ar} منعطفاً حاداً على الحافة.`,
  }),
  (en, ar) => ({
    example: `The relay team finished in ${en.replace(/-/g, " ")} seconds flat.`,
    exampleTranslation: `أنهى فريق التتابع السباق في ${ar} ثانية بالضبط.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} votes approved the new student council budget.`,
    exampleTranslation: `وافق ${ar} صوتاً على ميزانية مجلس الطلاب الجديدة.`,
  }),
  (en, ar) => ({
    example: `The greenhouse holds ${en.replace(/-/g, " ")} pepper seedlings this spring.`,
    exampleTranslation: `يحتوي البيت الزجاجي على ${ar} شتلة فلفل هذا الربيع.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} hikers signed the mountain safety log at dawn.`,
    exampleTranslation: `وقّع ${ar} متسلقاً سجل سلامة الجبل عند الفجر.`,
  }),
  (en, ar) => ({
    example: `The puzzle box contains ${en.replace(/-/g, " ")} interlocking wooden tiles.`,
    exampleTranslation: `يحتوي صندوق اللغز على ${ar} بلطة خشبية متشابكة.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} beads formed a bracelet for the craft auction.`,
    exampleTranslation: `شكّل ${ar} خرزة سواراً لمزاد الحرف.`,
  }),
  (en, ar) => ({
    example: `The archive holds ${en.replace(/-/g, " ")} boxes of town council minutes.`,
    exampleTranslation: `يحتفظ الأرشيف بـ${ar} صندوقاً من محاضر مجلس البلدة.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} campers earned badges during wilderness skills week.`,
    exampleTranslation: `حصل ${ar} متخيماً على شارات خلال أسبوع مهارات البرية.`,
  }),
  (en, ar) => ({
    example: `The choir learned ${en.replace(/-/g, " ")} songs for the spring tour.`,
    exampleTranslation: `تعلّمت الجوقة ${ar} أغنية لجولة الربيع.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} tickets were printed for the planetarium premiere.`,
    exampleTranslation: `طُبعت ${ar} تذكرة لعرض القبة السماوية الأول.`,
  }),
  (en, ar) => ({
    example: `The mural includes ${en.replace(/-/g, " ")} hand-painted community tiles.`,
    exampleTranslation: `تضم الجدارية ${ar} بلطة مجتمعية مرسومة يدوياً.`,
  }),
  (en, ar) => ({
    example: `${cap(en)} scouts completed the orienteering course before noon.`,
    exampleTranslation: `أكمل ${ar} كشافاً مسار الملاحة البرية قبل الظهر.`,
  }),
];

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const cards = numbers.map((meta, i) => {
  const t = templates[i % templates.length](meta.word, meta.translation);
  return {
    word: meta.word,
    translation: meta.translation,
    partOfSpeech: "number",
    difficulty: "medium",
    example: t.example,
    exampleTranslation: t.exampleTranslation,
  };
});

const body = `/** Auto-generated number cards for grade 5 (157+). */\nexport const GRADE5_CHUNK_NUMBERS = ${JSON.stringify(cards, null, 2)};\n`;
writeFileSync(join(root, "scripts/seed-data/grade5-chunk-numbers.mjs"), body);
console.log(`Wrote ${cards.length} number cards (${cards[0].word} … ${cards[cards.length - 1].word}).`);
