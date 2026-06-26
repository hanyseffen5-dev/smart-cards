/** Short daily-life example sentences for grade 6 elementary vocabulary. */

const NOUN_EN = [
  (w) => `I saw a ${w} at the park today.`,
  (w) => `We bought a ${w} at the store.`,
  (w) => `There is a ${w} in our kitchen.`,
  (w) => `My friend showed me a ${w}.`,
  (w) => `We use a ${w} every day at home.`,
  (w) => `I found a ${w} in my bag.`,
  (w) => `The ${w} is on the table.`,
  (w) => `She gave me a small ${w}.`,
  (w) => `We packed a ${w} for the trip.`,
  (w) => `I like this ${w} very much.`,
];

const NOUN_AR = [
  (ar) => `رأيت ${ar} في الحديقة اليوم.`,
  (ar) => `اشترينا ${ar} من المتجر.`,
  (ar) => `يوجد ${ar} في مطبخنا.`,
  (ar) => `أراني صديقي ${ar}.`,
  (ar) => `نستخدم ${ar} كل يوم في البيت.`,
  (ar) => `وجدت ${ar} في حقيبتي.`,
  (ar) => `${ar} على الطاولة.`,
  (ar) => `أعطتني ${ar} صغيراً.`,
  (ar) => `حزمنا ${ar} للرحلة.`,
  (ar) => `أحب هذا ${ar} كثيراً.`,
];

const VERB_EN = [
  (w) => `I ${w} every morning.`,
  (w) => `We ${w} after school.`,
  (w) => `Please ${w} before dinner.`,
  (w) => `They ${w} in the garden.`,
  (w) => `I like to ${w} on weekends.`,
  (w) => `We ${w} together as a family.`,
  (w) => `She will ${w} later today.`,
  (w) => `Do you ${w} at home?`,
  (w) => `He ${w} before he sleeps.`,
  (w) => `We ${w} when we have time.`,
];

const VERB_AR = [
  (ar) => `أ${ar} كل صباح.`,
  (ar) => `ن${ar} بعد المدرسة.`,
  (ar) => `من فضلك ${ar} قبل العشاء.`,
  (ar) => `هم ي${ar} في الحديقة.`,
  (ar) => `أحب أن ${ar} في عطلة نهاية الأسبوع.`,
  (ar) => `ن${ar} معاً كعائلة.`,
  (ar) => `ست${ar} لاحقاً اليوم.`,
  (ar) => `هل ${ar} في البيت؟`,
  (ar) => `هو ي${ar} قبل أن ينام.`,
  (ar) => `ن${ar} عندما يكون لدينا وقت.`,
];

const ADJ_EN = [
  (w) => `The soup tastes ${w}.`,
  (w) => `My room looks ${w} today.`,
  (w) => `That was a ${w} day.`,
  (w) => `The weather feels ${w}.`,
  (w) => `Her smile is very ${w}.`,
  (w) => `This shirt is too ${w}.`,
  (w) => `The movie was ${w}.`,
  (w) => `Our trip was ${w}.`,
  (w) => `The fruit looks ${w}.`,
  (w) => `He seems ${w} today.`,
];

const ADJ_AR = [
  (ar) => `الحساء طعمه ${ar}.`,
  (ar) => `غرفتي تبدو ${ar} اليوم.`,
  (ar) => `كان ذلك يوماً ${ar}.`,
  (ar) => `الطقس يبدو ${ar}.`,
  (ar) => `ابتسامتها ${ar} جداً.`,
  (ar) => `هذا القميص ${ar} جداً.`,
  (ar) => `كان الفيلم ${ar}.`,
  (ar) => `كانت رحلتنا ${ar}.`,
  (ar) => `الفاكهة تبدو ${ar}.`,
  (ar) => `يبدو ${ar} اليوم.`,
];

const ADV_EN = [
  (w) => `She spoke ${w} to the class.`,
  (w) => `He walked ${w} down the street.`,
  (w) => `We finished ${w} before lunch.`,
  (w) => `They laughed ${w} at the joke.`,
  (w) => `I answered ${w} on the phone.`,
  (w) => `The dog ran ${w} in the yard.`,
  (w) => `She sang ${w} at the party.`,
  (w) => `We waited ${w} for the bus.`,
  (w) => `He worked ${w} all day.`,
  (w) => `They played ${w} in the rain.`,
];

const ADV_AR = [
  (ar) => `تحدثت ${ar} إلى الصف.`,
  (ar) => `مشى ${ar} في الشارع.`,
  (ar) => `انتهينا ${ar} قبل الغداء.`,
  (ar) => `ضحكوا ${ar} على النكتة.`,
  (ar) => `رددت ${ar} على الهاتف.`,
  (ar) => `ركض الكلب ${ar} في الفناء.`,
  (ar) => `غنت ${ar} في الحفلة.`,
  (ar) => `انتظرنا ${ar} الحافلة.`,
  (ar) => `عمل ${ar} طوال اليوم.`,
  (ar) => `لعبوا ${ar} تحت المطر.`,
];

const DEFAULT_EN = [
  (w) => `We use the word ${w} in daily life.`,
  (w) => `I heard ${w} on the radio today.`,
  (w) => `My family talked about ${w} at dinner.`,
  (w) => `I read ${w} in a short story.`,
  (w) => `We learned about ${w} this week.`,
];

const DEFAULT_AR = [
  (ar) => `نستخدم كلمة ${ar} في الحياة اليومية.`,
  (ar) => `سمعت ${ar} في الراديو اليوم.`,
  (ar) => `تحدثت عائلتي عن ${ar} على العشاء.`,
  (ar) => `قرأت ${ar} في قصة قصيرة.`,
  (ar) => `تعلّمنا عن ${ar} هذا الأسبوع.`,
];

function pickTemplates(partOfSpeech) {
  if (partOfSpeech === "verb") return [VERB_EN, VERB_AR];
  if (partOfSpeech === "adjective") return [ADJ_EN, ADJ_AR];
  if (partOfSpeech === "adverb") return [ADV_EN, ADV_AR];
  if (partOfSpeech === "noun") return [NOUN_EN, NOUN_AR];
  return [DEFAULT_EN, DEFAULT_AR];
}

export function makeDailyExample(word, translation, partOfSpeech, idx, blockedExamples, normExample) {
  const [enList, arList] = pickTemplates(partOfSpeech);
  const start = idx % enList.length;
  for (let attempt = 0; attempt < enList.length; attempt++) {
    const i = (start + attempt) % enList.length;
    const example = enList[i](word);
    const exampleTranslation = arList[i](translation);
    if (!blockedExamples.has(normExample(example))) {
      return { example, exampleTranslation };
    }
  }
  return {
    example: `We talked about ${word} at home today.`,
    exampleTranslation: `تحدثنا عن ${translation} في البيت اليوم.`,
  };
}
