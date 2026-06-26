/**
 * Generates scripts/lib/grade6-supplement-bank.mjs (1000 entries).
 * Run: node scripts/gen-grade6-supplement-data.mjs
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { GRADE6_EXTENSION_BANK } from "./lib/grade6-extension-bank.mjs";
import { SIMPLE_BANK } from "./lib/grade5-simple-word-bank.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EXT = new Set(GRADE6_EXTENSION_BANK.map((r) => r[0]));
const GLOSS = new Map(SIMPLE_BANK.map(([w, t, p, d]) => [w, [t, p, d]]));

if (existsSync(join(__dirname, "../.data/grade6-word-ar.json"))) {
  for (const [w, t] of Object.entries(
    JSON.parse(readFileSync(join(__dirname, "../.data/grade6-word-ar.json"), "utf8")),
  )) {
    if (!GLOSS.has(w)) {
      const ar = (t || "").split(/[,،/.]/)[0].trim();
      if (ar && ar !== ".") GLOSS.set(w, [ar, guessPos(w), guessDiff(w)]);
    }
  }
}

function guessPos(w) {
  if (/ly$/.test(w) && w.length > 4) return "adverb";
  if (/(tion|sion|ment|ness|ity|ism|ist|ance|ence|ship|hood|dom|ure|age|ery|ory)$/.test(w)) return "noun";
  if (/(ive|ous|ful|less|able|ible|ish|like|al|ic|ant|ent|y|ed|en)$/.test(w)) return "adjective";
  if (/(ify|ize|ate)$/.test(w)) return "verb";
  return "noun";
}

function guessDiff(w) {
  if (w.length <= 5) return "easy";
  if (w.length >= 9) return "hard";
  return "medium";
}

const NUMBER = new Set([
  "one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve",
  "thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty",
  "thirty","forty","fifty","sixty","seventy","eighty","ninety","hundred","thousand",
  "million","zero","first","second","third","fourth","fifth","sixth","seventh","eighth",
  "ninth","tenth","single","double","triple","dozen","half","quarter","once","twice",
  "count","counter",
]);

const BASIC = new Set([
  "cat","dog","red","blue","big","run","go","see","look","eat","bed","hat","pen","cup",
  "yes","you","book","ball","tree","sun","moon","sky","boy","girl","mom","dad","man",
  "pig","cow","hen","bee","ant","fox","owl","bat","rat","cry","dam","dew","dig","dim",
  "dna","ear","eel","emu","fan","fig","flu","fry","get","ham","hip","hop","hot","hue",
  "hug","hut","ill","inn","jay","cook","cookie","cool","copy","corn","cord","cost",
  "cot","cow","crab","cream","cross","crow","cup","cut","day","dead","deep","den","desk",
  "door","dot","draw","dress","drink","drive","drop","dry","duck","easy","egg","end",
  "eye","face","fair","fall","farm","fast","fat","fee","feed","feel","few","fill",
  "find","finger","fire","fish","flag","flat","floor","flow","flower","fly","fog",
  "fold","follow","foot","fork","free","fresh","friend","frog","front","fruit","full",
  "fun","fur","gap","gas","gate","gem","gin","give","glad","glass","goat","gold","golf",
  "good","got","grab","grass","gray","green","grow","gum","gun","guy","gym","hair",
  "hall","hand","hang","happy","hard","hay","head","hear","heart","heat","heavy",
  "help","her","here","hill","him","his","hit","hog","hold","home","hope","how","hum",
  "hungry","hunt","hurt","ice","idea","ink","jam","jar","jaw","job","join","joy","jump",
  "kick","kind","kiss","knee","knock","know","lake","lamp","land","large","last","late",
  "leaf","left","lift","light","like","live","long","look","lose","lot","loud","love",
  "low","luck","lunch","many","mark","meal","mean","meat","meet","melt","milk","mind",
  "mine","miss","moon","more","most","move","mug","nail","name","near","neck","need",
  "nest","nice","night","nine","nose","only","open","pack","park","part","pass","past",
  "pay","pick","pink","pipe","plan","play","plot","pull","pump","push","rain","read",
  "rest","rice","rich","ring","rise","road","rock","roll","roof","room","root","rope",
  "rose","rule","safe","sail","salt","same","sand","seat","seed","seek","seem","seen",
  "self","sell","send","sent","ship","shop","shot","show","sick","side","sign","silk",
  "sing","sink","sir","size","skin","skip","sleep","slow","small","smell","smile",
  "smoke","snake","snap","snow","soap","soft","soil","sold","some","song","soon",
  "sort","soul","soup","sour","span","spin","spot","stay","step","stir","stop","such",
  "suit","sun","sup","tail","take","talk","tall","tank","team","tear","tell","tent",
  "term","test","text","than","that","them","then","they","thin","this","thus","tick",
  "till","time","tiny","tire","tool","town","tour","trip","turn","type","view","vine",
  "vote","wait","wake","walk","wall","want","warm","wash","wave","weak","wear","week",
  "well","went","were","west","what","when","whom","wide","wife","wild","will","wind",
  "wine","wing","wipe","wire","wise","wish","with","woke","wolf","wood","wool","word",
  "work","worm","worn","wrap","yard","year","yell","yoga","yolk","your","uncle","aunt",
  "under","unlock","upset","ugly",  "understand","zap","zip",
]);

const ADVANCED = new Set([
  "cadaver","carcinogen","centurion","chicanery","coagulate","codify","colporteur",
  "commensurate","compendious","cognizant","cohere","collude","commingle","commiserate",
  "commandeer","comestible","comatose","colliery","collier","colloquy","cogent",
  "condominium","congruent","corrosion","cop","cooldown",
]);

const MANUAL = new Map(
  readFileSync(join(__dirname, "data/grade6-supplement-tsv.txt"), "utf8")
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [word, ar, pos, diff] = l.split("\t");
      return [word.toLowerCase(), [ar, pos, diff]];
    }),
);

const MIXED = [
  ["textbook","كتاب مدرسي","noun","easy"],
  ["homework","واجب منزلي","noun","easy"],
  ["semester","فصل دراسي","noun","medium"],
  ["principal","مدير مدرسة","noun","medium"],
  ["bulletin","نشرة","noun","medium"],
  ["magnet","مغناطيس","noun","easy"],
  ["gravity","جاذبية","noun","medium"],
  ["molecule","جزيء","noun","hard"],
  ["volleyball","كرة طائرة","noun","easy"],
  ["goalkeeper","حارس مرمى","noun","medium"],
  ["tournament","بطولة","noun","medium"],
  ["neighbor","جار","noun","easy"],
  ["volunteer","متطوّع","noun","medium"],
  ["fundraiser","جمع تبرعات","noun","medium"],
  ["honesty","أمانة","noun","medium"],
  ["patience","صبر","noun","medium"],
  ["kindness","لطف","noun","easy"],
  ["sandwich","ساندويتش","noun","easy"],
  ["cinnamon","قرفة","noun","medium"],
  ["knitting","حياكة","noun","medium"],
  ["gardening","بستنة","noun","medium"],
  ["photography","تصوير","noun","medium"],
  ["recycle","يعيد التدوير","verb","medium"],
  ["pollution","تلوث","noun","medium"],
  ["ecosystem","نظام بيئي","noun","hard"],
  ["habitat","موطن","noun","medium"],
  ["wildlife","حياة برية","noun","medium"],
  ["earthquake","زلزال","noun","medium"],
  ["lightning","برق","noun","easy"],
  ["thunder","رعد","noun","easy"],
  ["forecast","توقعات","noun","medium"],
  ["thermometer","ترمومتر","noun","medium"],
  ["microscope","مجهر","noun","medium"],
  ["telescope","تلسكوب","noun","medium"],
  ["experiment","تجربة","noun","medium"],
  ["hypothesis","فرضية","noun","hard"],
  ["variable","متغير","noun","medium"],
  ["fraction","كسر","noun","medium"],
  ["geometry","هندسة","noun","medium"],
  ["algebra","جبر","noun","hard"],
  ["paragraph","فقرة","noun","easy"],
  ["grammar","قواعد","noun","medium"],
  ["dictionary","قاموس","noun","easy"],
  ["encyclopedia","موسوعة","noun","hard"],
  ["librarian","أمين مكتبة","noun","medium"],
  ["auditorium","قاعة محاضرات","noun","medium"],
  ["cafeteria","كافتيريا","noun","easy"],
  ["locker","خزانة","noun","easy"],
  ["backpack","حقيبة ظهر","noun","easy"],
  ["notebook","دفتر","noun","easy"],
  ["calculator","آلة حاسبة","noun","easy"],
  ["projector","جهاز عرض","noun","medium"],
  ["whiteboard","سبورة","noun","easy"],
  ["classmate","زميل","noun","easy"],
  ["teammate","زميل فريق","noun","easy"],
  ["referee","حكم","noun","medium"],
  ["stadium","ملعب","noun","medium"],
  ["marathon","ماراثون","noun","medium"],
  ["gymnastics","جمباز","noun","medium"],
  ["badminton","ريشة طائرة","noun","medium"],
  ["swimming","سباحة","noun","easy"],
  ["community","مجتمع","noun","easy"],
  ["citizenship","مواطنة","noun","hard"],
  ["democracy","ديمقراطية","noun","hard"],
  ["election","انتخاب","noun","medium"],
  ["mayor","عمدة","noun","medium"],
  ["ambulance","سيارة إسعاف","noun","medium"],
  ["firefighter","رجل إطفاء","noun","medium"],
  ["integrity","نزاهة","noun","hard"],
  ["perseverance","مثابرة","noun","hard"],
  ["resilience","مرونة","noun","hard"],
  ["empathy","تعاطف","noun","hard"],
  ["nutrition","تغذية","noun","medium"],
  ["vitamin","فيتامين","noun","easy"],
  ["protein","بروتين","noun","medium"],
  ["recipe","وصفة","noun","easy"],
  ["bakery","مخبز","noun","easy"],
  ["spaghetti","سباغيتي","noun","easy"],
  ["archery","رماية","noun","medium"],
  ["journalism","صحافة","noun","hard"],
  ["headline","عنوان رئيسي","noun","medium"],
  ["laboratory","مختبر","noun","medium"],
  ["observation","ملاحظة","noun","medium"],
  ["statistics","إحصاء","noun","hard"],
  ["longitude","خط طول","noun","hard"],
  ["latitude","خط عرض","noun","hard"],
  ["hemisphere","نصف كرة","noun","hard"],
  ["sediment","رواسب","noun","hard"],
  ["fossil","أحفورة","noun","medium"],
  ["mineral","معدن","noun","medium"],
  ["volcano","بركان","noun","medium"],
  ["tsunami","تسونامي","noun","medium"],
  ["tornado","إعصار","noun","medium"],
  ["rainbow","قوس قزح","noun","easy"],
  ["meadow","مرج","noun","medium"],
  ["wetland","أرض رطبة","noun","hard"],
  ["prairie","مرج","noun","hard"],
  ["waterfall","شلال","noun","medium"],
  ["character","شخصية","noun","medium"],
  ["compassion","رحمة","noun","hard"],
  ["fairness","عدالة","noun","medium"],
  ["responsibility","مسؤولية","noun","hard"],
  ["recreation","ترفيه","noun","medium"],
  ["championship","بطولة","noun","medium"],
  ["technique","أسلوب","noun","medium"],
  ["training","تدريب","noun","easy"],
  ["ingredient","مكوّن","noun","medium"],
  ["broadcast","بث","noun","medium"],
  ["interview","مقابلة","noun","medium"],
  ["manuscript","مخطوطة","noun","hard"],
  ["evidence","دليل","noun","medium"],
  ["calculation","حساب","noun","medium"],
  ["diagram","رسم توضيحي","noun","medium"],
  ["compass","بوصلة","noun","medium"],
  ["heritage","تراث","noun","medium"],
];

function gloss(word) {
  if (MANUAL.has(word)) return MANUAL.get(word);
  if (GLOSS.has(word)) return GLOSS.get(word);
  return null;
}

function valid(w) {
  return /^[a-z]+$/.test(w) && !NUMBER.has(w) && !BASIC.has(w) && !ADVANCED.has(w) && !EXT.has(w);
}

function okEntry(word, ar, pos, diff) {
  return (
    ar &&
    !/[a-z]{4,}/i.test(ar) &&
    ["noun", "verb", "adjective", "adverb"].includes(pos) &&
    ["easy", "medium", "hard"].includes(diff)
  );
}

const pool = readFileSync(join(__dirname, "data/grade6-word-pool.txt"), "utf8")
  .trim()
  .split(/\r?\n/)
  .map((w) => w.trim().toLowerCase());
const idx = pool.indexOf("complacent");

const seen = new Set();
/** @type {[string,string,string,string][]} */
let bank = [];

function addWord(w) {
  const word = w.toLowerCase().trim();
  if (!valid(word) || seen.has(word)) return false;
  const g = gloss(word);
  if (!g || !okEntry(word, ...g)) return false;
  seen.add(word);
  bank.push([word, ...g]);
  return true;
}

for (const [word] of MANUAL) addWord(word);

for (const w of pool.slice(idx + 1)) {
  if (bank.length >= 1000 - 4) break;
  addWord(w);
}

for (const [w, ar, pos, diff] of MIXED) {
  if (bank.length >= 1000 - 4) break;
  if (seen.has(w) || !valid(w) || !okEntry(w, ar, pos, diff)) continue;
  seen.add(w);
  bank.push([w, ar, pos, diff]);
}

for (const w of pool.slice(idx + 1)) {
  if (bank.length >= 1000 - 4) break;
  addWord(w);
}

for (const [w, ar, pos, diff] of [
  ["zodiac", "برج", "noun", "medium"],
  ["zinc", "زنك", "noun", "medium"],
  ["zen", "تأمل", "noun", "medium"],
  ["zoo", "حديقة حيوان", "noun", "easy"],
]) {
  if (seen.has(w)) {
    bank = bank.filter((r) => r[0] !== w);
    seen.delete(w);
  }
  seen.add(w);
  bank.push([w, ar, pos, diff]);
}

if (bank.length !== 1000) {
  console.error("Missing", 1000 - bank.length, "entries");
  process.exit(1);
}

const tsv = bank.map((r) => r.join("\t")).join("\n");
const out = `/** Grade 6 supplement word bank — 1000 elementary vocabulary words (compliment → z + topics). */

function parse(tsv) {
  return tsv
    .trim()
    .split("\\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [word, translation, partOfSpeech, difficulty] = l.split("\\t");
      return [word, translation, partOfSpeech, difficulty];
    });
}

export const GRADE6_SUPPLEMENT_BANK = parse(\`
${tsv}
\`);
`;

writeFileSync(join(__dirname, "lib/grade6-supplement-bank.mjs"), out, "utf8");
console.log("built", bank.length, "first:", bank[0][0], "last:", bank.at(-1)[0]);
console.log("file lines:", out.split("\n").length);
