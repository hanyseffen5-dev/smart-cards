/** Natural example-sentence patterns for grade 5 vocabulary (no filler numbers). */

/** Hyphenated seed words read naturally in sentences (e.g. ionic-bond → ionic bond). */
export function formatWordForExample(word) {
  return String(word ?? "").replace(/-/g, " ").trim();
}

export const GRADE5_EN_PATTERNS = [
  (w) => `Our teacher explained ${w} with a clear classroom example.`,
  (w) => `We learned about ${w} during this week's science lesson.`,
  (w) => `The textbook gives a simple definition of ${w}.`,
  (w) => `Our group project helped us understand ${w} better.`,
  (w) => `The science fair poster showed ${w} with a labeled diagram.`,
  (w) => `During the lab, we observed how ${w} affects the results.`,
  (w) => `The guest speaker gave a helpful example of ${w}.`,
  (w) => `Students discussed ${w} while sharing their research notes.`,
  (w) => `The museum guide pointed out ${w} on our field trip.`,
  (w) => `We wrote a journal entry describing ${w} in our own words.`,
  (w) => `The tutor demonstrated ${w} using a simple classroom model.`,
  (w) => `Our word wall now includes ${w} from this unit.`,
  (w) => `The documentary showed ${w} happening in a real community.`,
  (w) => `During debate practice, speakers used ${w} to support their claim.`,
  (w) => `The reading passage links the main idea to ${w}.`,
  (w) => `Our capstone project explores ${w} as its central topic.`,
  (w) => `The study guide reminds us to review ${w} before the test.`,
  (w) => `We sketched a diagram that illustrates ${w} step by step.`,
  (w) => `The podcast episode introduced ${w} to young listeners.`,
  (w) => `Our classroom display shows how ${w} fits the bigger picture.`,
  (w) => `The worksheet asks students to define ${w} in context.`,
  (w) => `Everyone in class wrote a sentence using ${w}.`,
  (w) => `The short video clip introduced the idea of ${w}.`,
  (w) => `We compared two real examples that involve ${w}.`,
  (w) => `Our notebook page summarizes what we know about ${w}.`,
  (w) => `The class read a short passage about ${w}.`,
  (w) => `We drew a picture to show what ${w} looks like.`,
  (w) => `The library book had a helpful section on ${w}.`,
  (w) => `We built a small model to demonstrate ${w}.`,
  (w) => `Today's newspaper article mentioned ${w} in plain language.`,
];

export const GRADE5_AR_PATTERNS = [
  (ar) => `شرح معلمنا ${ar} بمثال صفي واضح.`,
  (ar) => `تعلّمنا عن ${ar} خلال درس العلوم هذا الأسبوع.`,
  (ar) => `يقدّم الكتاب تعريفاً بسيطاً لـ${ar}.`,
  (ar) => `ساعدنا مشروع مجموعتنا على فهم ${ar} بشكل أفضل.`,
  (ar) => `عرض ملصق معرض العلوم ${ar} برسم مُوضَّح.`,
  (ar) => `في المختبر، لاحظنا كيف يؤثر ${ar} على النتائج.`,
  (ar) => `قدّم المتحدث مثالاً مفيداً عن ${ar}.`,
  (ar) => `ناقش الطلاب ${ar} أثناء تبادل ملاحظات البحث.`,
  (ar) => `أشار مرشد المتحف إلى ${ar} خلال رحلتنا الميدانية.`,
  (ar) => `كتبنا مدخلاً في اليوميات يصف ${ar} بألفاظنا.`,
  (ar) => `وضّح المعلم ${ar} باستخدام نموذج صفي بسيط.`,
  (ar) => `يتضمّن حائط الكلمات لدينا الآن ${ar} من هذه الوحدة.`,
  (ar) => `أظهر الفيلم الوثائقي ${ar} في مجتمع حقيقي.`,
  (ar) => `استخدم المتحدثون في التدريب على المناظرة ${ar} لدعم ادعائهم.`,
  (ar) => `يربط نص القراءة الفكرة الرئيسية بـ${ar}.`,
  (ar) => `يستكشف مشروعنا الختامي ${ar} كموضوع مركزي.`,
  (ar) => `يذكّرنا دليل الدراسة بمراجعة ${ar} قبل الاختبار.`,
  (ar) => `رسمنا مخططاً يوضّح ${ar} خطوة بخطوة.`,
  (ar) => `قدّم حلقة البودكاست ${ar} للمستمعين الصغار.`,
  (ar) => `يعرض عرضنا الصفي كيف يتناسب ${ar} مع الصورة الأكبر.`,
  (ar) => `يطلب ورق العمل من الطلاب تعريف ${ar} في سياقه.`,
  (ar) => `كتب الجميع في الصف جملة باستخدام ${ar}.`,
  (ar) => `قدّم المقطع القصير فكرة ${ar} بأسلوب سهل.`,
  (ar) => `قارنا مثالين حقيقيين يتعلقان بـ${ar}.`,
  (ar) => `يلخّص صفحة دفترنا ما نعرفه عن ${ar}.`,
  (ar) => `قرأ الصف نصاً قصيراً عن ${ar}.`,
  (ar) => `رسمنا صورة توضّح شكل ${ar}.`,
  (ar) => `تضمّن كتاب المكتبة فصلاً مفيداً عن ${ar}.`,
  (ar) => `بنينا نموذجاً صغيراً لتوضيح ${ar}.`,
  (ar) => `ذكرت مقالة اليوم ${ar} بلغة بسيطة.`,
];

export function makeGrade5Example(word, translation, idx, blockedExamples, normExample) {
  const w = formatWordForExample(word);
  const pi = idx % GRADE5_EN_PATTERNS.length;
  for (let attempt = 0; attempt < GRADE5_EN_PATTERNS.length; attempt++) {
    const ti = (pi + attempt) % GRADE5_EN_PATTERNS.length;
    const example = GRADE5_EN_PATTERNS[ti](w);
    const exampleTranslation = GRADE5_AR_PATTERNS[ti](translation);
    if (!blockedExamples.has(normExample(example))) {
      return { example, exampleTranslation };
    }
  }
  return {
    example: `Grade five vocabulary spotlight: ${w} appears on our classroom word wall.`,
    exampleTranslation: `كلمة الصف الخامس: يظهر ${translation} على حائط كلمات صفنا.`,
  };
}
