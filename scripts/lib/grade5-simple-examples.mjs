/** Short, clear example sentences for grade 5 simple vocabulary. */

export const SIMPLE_EN = [
  (w) => `We learned the word ${w} in class today.`,
  (w) => `Can you use ${w} in a sentence?`,
  (w) => `The story mentioned ${w} on page ten.`,
  (w) => `Our teacher wrote ${w} on the board.`,
  (w) => `I spelled ${w} correctly on the quiz.`,
  (w) => `The picture helps explain ${w}.`,
  (w) => `We found ${w} in our reading book.`,
  (w) => `${cap(w)} is a new word for our unit.`,
  (w) => `My partner and I discussed ${w}.`,
  (w) => `The worksheet asks about ${w}.`,
  (w) => `We heard ${w} in the science video.`,
  (w) => `Please copy ${w} into your notebook.`,
  (w) => `The chart shows an example of ${w}.`,
  (w) => `Our group used ${w} in the project.`,
  (w) => `The teacher gave an example with ${w}.`,
  (w) => `I underlined ${w} in the paragraph.`,
  (w) => `We practiced saying ${w} aloud.`,
  (w) => `The poster explains ${w} with a drawing.`,
  (w) => `Everyone shared a sentence with ${w}.`,
  (w) => `The quiz included the word ${w}.`,
];

export const SIMPLE_AR = [
  (ar) => `تعلّمنا كلمة ${ar} في الحصة اليوم.`,
  (ar) => `هل يمكنك استخدام ${ar} في جملة؟`,
  (ar) => `ذكرت القصة ${ar} في الصفحة العاشرة.`,
  (ar) => `كتب معلمنا ${ar} على السبورة.`,
  (ar) => `تهجّيت ${ar} بشكل صحيح في الاختبار.`,
  (ar) => `تساعد الصورة على شرح ${ar}.`,
  (ar) => `وجدنا ${ar} في كتاب القراءة.`,
  (ar) => `${ar} كلمة جديدة لوحدتنا.`,
  (ar) => `ناقشت ${ar} مع زميلي.`,
  (ar) => `يسأل ورق العمل عن ${ar}.`,
  (ar) => `سمعنا ${ar} في فيلم العلوم.`,
  (ar) => `من فضلك انسخ ${ar} في دفترك.`,
  (ar) => `يُظهر المخطط مثالاً عن ${ar}.`,
  (ar) => `استخدمت مجموعتنا ${ar} في المشروع.`,
  (ar) => `أعطى المعلم مثالاً بـ${ar}.`,
  (ar) => `وضعت خطاً تحت ${ar} في الفقرة.`,
  (ar) => `تدرّبنا على نطق ${ar} بصوت عالٍ.`,
  (ar) => `يشرح الملصق ${ar} برسم.`,
  (ar) => `شارك الجميع جملة فيها ${ar}.`,
  (ar) => `تضمّن الاختبار كلمة ${ar}.`,
];

function cap(w) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export function makeSimpleExample(word, translation, idx, blockedExamples, normExample) {
  const pi = idx % SIMPLE_EN.length;
  for (let attempt = 0; attempt < SIMPLE_EN.length; attempt++) {
    const ti = (pi + attempt) % SIMPLE_EN.length;
    const example = SIMPLE_EN[ti](word);
    const exampleTranslation = SIMPLE_AR[ti](translation);
    if (!blockedExamples.has(normExample(example))) {
      return { example, exampleTranslation };
    }
  }
  return {
    example: `We studied ${word} during vocabulary time.`,
    exampleTranslation: `درسنا ${translation} خلال وقت المفردات.`,
  };
}
