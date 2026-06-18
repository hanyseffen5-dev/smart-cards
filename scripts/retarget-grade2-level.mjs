/**
 * Replace Grade 3+ vocabulary in grade2-cards with Grade-2-appropriate words.
 * Run: node scripts/retarget-grade2-level.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cardsPath = join(root, "scripts/seed-data/grade2-cards.mjs");

const TO_REMOVE = new Set([
  "ancient", "anthem", "asteroid", "astronaut", "bamboo", "beaker", "buffalo", "budget",
  "caption", "carving", "century", "ceremony", "cilantro", "citizen", "climate", "comet",
  "compost", "contrast", "deadline", "dialogue", "disagree", "doubt", "drought", "data",
  "download", "election", "flamingo", "flood", "formula", "galaxy", "geography", "glacier",
  "godparent", "governor", "granite", "gravity", "headline", "helicopter", "honor", "humidity",
  "hurricane", "lens", "leopard", "lobster", "mayor", "microscope", "million", "moose",
  "orbit", "orphan", "palace", "pelican", "peninsula", "pollution", "portrait", "predict",
  "quest", "responsible", "rhino", "runway", "satellite", "scorpion", "screenshot", "sculpture",
  "software", "spacecraft", "stepbrother", "submarine", "subway", "swamp", "temple",
  "telescope", "theory", "thousand", "tournament", "tram", "voicemail", "walrus", "warehouse",
  "website", "upload", "yacht", "browser", "notification", "podcast", "hardware", "discipline",
  "attentive", "legend", "canyon", "peninsula",
]);

const REPLACEMENT_POOL = [
  { word: "playground", translation: "ملعب", partOfSpeech: "noun", difficulty: "easy", example: "We run on the playground after lunch.", exampleTranslation: "نجرى في الملعب بعد الغداء." },
  { word: "lunchbox", translation: "صندوق غداء", partOfSpeech: "noun", difficulty: "easy", example: "My lunchbox has a sandwich and fruit.", exampleTranslation: "صندوق غدائي فيه ساندويتش وفاكهة." },
  { word: "swing", translation: "أرجوحة", partOfSpeech: "noun", difficulty: "easy", example: "She pushes her friend on the swing.", exampleTranslation: "تدفع صديقتها على الأرجوحة." },
  { word: "seesaw", translation: "أرجوحة متوازنة", partOfSpeech: "noun", difficulty: "medium", example: "Two kids ride the seesaw together.", exampleTranslation: "يركب طفلان الأرجوحة المتوازنة معاً." },
  { word: "sandbox", translation: "صندوق رمل", partOfSpeech: "noun", difficulty: "easy", example: "We build castles in the sandbox.", exampleTranslation: "نبني قلاعاً في صندوق الرمل." },
  { word: "recess", translation: "فسحة", partOfSpeech: "noun", difficulty: "easy", example: "We play tag during recess.", exampleTranslation: "نلعب الغميضة في الفسحة." },
  { word: "lunchtime", translation: "وقت الغداء", partOfSpeech: "noun", difficulty: "easy", example: "Lunchtime starts at twelve o'clock.", exampleTranslation: "وقت الغداء يبدأ في الساعة الثانية عشرة." },
  { word: "dinnertime", translation: "وقت العشاء", partOfSpeech: "noun", difficulty: "easy", example: "We wash hands before dinnertime.", exampleTranslation: "نغسل أيدينا قبل وقت العشاء." },
  { word: "always", translation: "دائماً", partOfSpeech: "adverb", difficulty: "easy", example: "I always brush my teeth at night.", exampleTranslation: "أفرش أسناني دائماً في الليل." },
  { word: "never", translation: "أبداً", partOfSpeech: "adverb", difficulty: "easy", example: "Never run in the school hallway.", exampleTranslation: "لا تركض أبداً في ممر المدرسة." },
  { word: "sometimes", translation: "أحياناً", partOfSpeech: "adverb", difficulty: "easy", example: "Sometimes we have art on Fridays.", exampleTranslation: "أحياناً لدينا فن يوم الجمعة." },
  { word: "often", translation: "غالباً", partOfSpeech: "adverb", difficulty: "easy", example: "Dad often reads stories at bedtime.", exampleTranslation: "أبي يقرأ القصص غالباً قبل النوم." },
  { word: "usually", translation: "عادة", partOfSpeech: "adverb", difficulty: "medium", example: "We usually walk to the park.", exampleTranslation: "عادة نمشي إلى الحديقة." },
  { word: "because", translation: "لأن", partOfSpeech: "conjunction", difficulty: "medium", example: "We stayed inside because it rained.", exampleTranslation: "بقينا في الداخل لأن المطر هطل." },
  { word: "above", translation: "فوق", partOfSpeech: "preposition", difficulty: "easy", example: "Birds fly above the tall trees.", exampleTranslation: "الطيور تطير فوق الأشجار الطويلة." },
  { word: "below", translation: "تحت", partOfSpeech: "preposition", difficulty: "easy", example: "The cat hides below the table.", exampleTranslation: "القطة تختبئ تحت الطاولة." },
  { word: "beside", translation: "بجانب", partOfSpeech: "preposition", difficulty: "easy", example: "Sit beside your partner, please.", exampleTranslation: "اجلس بجانب زميلك من فضلك." },
  { word: "behind", translation: "خلف", partOfSpeech: "preposition", difficulty: "easy", example: "The line forms behind the teacher.", exampleTranslation: "يتشكل الصف خلف المعلم." },
  { word: "between", translation: "بين", partOfSpeech: "preposition", difficulty: "medium", example: "The ball rolled between two chairs.", exampleTranslation: "تدحرجت الكرة بين كرسيين." },
  { word: "first", translation: "أول", partOfSpeech: "adjective", difficulty: "easy", example: "I was first in the reading line.", exampleTranslation: "كنت أول من في طابور القراءة." },
  { word: "last", translation: "آخر", partOfSpeech: "adjective", difficulty: "easy", example: "We ate the last cookie together.", exampleTranslation: "أكلنا آخر بسكويتة معاً." },
  { word: "next", translation: "التالي", partOfSpeech: "adjective", difficulty: "easy", example: "Who is next for show and tell?", exampleTranslation: "من التالي للعرض والإخبار؟" },
  { word: "same", translation: "نفس", partOfSpeech: "adjective", difficulty: "easy", example: "We wore the same team shirts.", exampleTranslation: "لبسنا نفس قمصان الفريق." },
  { word: "different", translation: "مختلف", partOfSpeech: "adjective", difficulty: "easy", example: "Each leaf has a different shape.", exampleTranslation: "لكل ورقة شكل مختلف." },
  { word: "circle", translation: "دائرة", partOfSpeech: "noun", difficulty: "easy", example: "Draw a circle around the sun.", exampleTranslation: "ارسم دائرة حول الشمس." },
  { word: "triangle", translation: "مثلث", partOfSpeech: "noun", difficulty: "medium", example: "The roof looks like a triangle.", exampleTranslation: "السقف يبدو كمثلث." },
  { word: "rectangle", translation: "مستطيل", partOfSpeech: "noun", difficulty: "medium", example: "The door is a tall rectangle.", exampleTranslation: "الباب مستطيل طويل." },
  { word: "puddle", translation: "بركة ماء", partOfSpeech: "noun", difficulty: "easy", example: "Kids jumped over the rain puddle.", exampleTranslation: "قفز الأطفال فوق بركة المطر." },
  { word: "pajamas", translation: "بيجاما", partOfSpeech: "noun", difficulty: "easy", example: "I put on pajamas before bed.", exampleTranslation: "أرتدي البيجاما قبل النوم." },
  { word: "slippers", translation: "شبشب", partOfSpeech: "noun", difficulty: "easy", example: "Wear slippers inside the house.", exampleTranslation: "ارتدِ شبشباً داخل البيت." },
  { word: "mittens", translation: "قفازات صوف", partOfSpeech: "noun", difficulty: "easy", example: "Warm mittens keep my fingers cozy.", exampleTranslation: "قفازات الصوف الدافئة تريح أصابعي." },
  { word: "puppy", translation: "جرو", partOfSpeech: "noun", difficulty: "easy", example: "The puppy chased its own tail.", exampleTranslation: "طارد الجرو ذيله." },
  { word: "kitten", translation: "قطة صغيرة", partOfSpeech: "noun", difficulty: "easy", example: "The kitten naps on the soft rug.", exampleTranslation: "تنام القطة الصغيرة على السجادة الناعمة." },
  { word: "dig", translation: "يحفر", partOfSpeech: "verb", difficulty: "easy", example: "We dig a hole for the small plant.", exampleTranslation: "نحفر حفرة للنبتة الصغيرة." },
  { word: "rake", translation: "يكشط", partOfSpeech: "verb", difficulty: "medium", example: "Dad will rake leaves in the yard.", exampleTranslation: "سيكشط أبي أوراق الحديقة." },
  { word: "sweep", translation: "يكنس", partOfSpeech: "verb", difficulty: "easy", example: "Sweep the crumbs off the table.", exampleTranslation: "اكنس الفتات عن الطاولة." },
  { word: "mop", translation: "يمسح", partOfSpeech: "verb", difficulty: "easy", example: "Please mop the spilled water.", exampleTranslation: "من فضلك امسح الماء المنسكب." },
  { word: "sort", translation: "يرتب", partOfSpeech: "verb", difficulty: "easy", example: "Sort the blocks by color.", exampleTranslation: "رتب المكعبات حسب اللون." },
  { word: "match", translation: "يطابق", partOfSpeech: "verb", difficulty: "easy", example: "Match each word to its picture.", exampleTranslation: "طابق كل كلمة مع صورتها." },
  { word: "add", translation: "يجمع", partOfSpeech: "verb", difficulty: "easy", example: "Add five plus three to get eight.", exampleTranslation: "اجمع خمسة وثلاثة لتصل إلى ثمانية." },
  { word: "subtract", translation: "يطرح", partOfSpeech: "verb", difficulty: "medium", example: "Subtract two from ten to get eight.", exampleTranslation: "اطرح اثنين من عشرة لتصل إلى ثمانية." },
  { word: "equal", translation: "يساوي", partOfSpeech: "adjective", difficulty: "medium", example: "Both sides are equal on the scale.", exampleTranslation: "الجانبان متساويان على الميزان." },
  { word: "pair", translation: "زوج", partOfSpeech: "noun", difficulty: "easy", example: "Tie your shoes in a pair of knots.", exampleTranslation: "اربط حذاءك بزوج من العقد." },
  { word: "alone", translation: "وحده", partOfSpeech: "adverb", difficulty: "easy", example: "He likes to read alone sometimes.", exampleTranslation: "يحب أن يقرأ وحده أحياناً." },
  { word: "away", translation: "بعيداً", partOfSpeech: "adverb", difficulty: "easy", example: "The bus drove away from school.", exampleTranslation: "ابتعدت الحافلة عن المدرسة." },
  { word: "near", translation: "قريب", partOfSpeech: "adverb", difficulty: "easy", example: "The library is near our school.", exampleTranslation: "المكتبة قريبة من مدرستنا." },
  { word: "far", translation: "بعيد", partOfSpeech: "adverb", difficulty: "easy", example: "The farm looks far on the map.", exampleTranslation: "تبدو المزرعة بعيدة على الخريطة." },
  { word: "grandson", translation: "حفيد", partOfSpeech: "noun", difficulty: "medium", example: "Grandpa reads to his grandson.", exampleTranslation: "يقرأ الجد لحفيده." },
  { word: "granddaughter", translation: "حفيدة", partOfSpeech: "noun", difficulty: "medium", example: "Grandma baked with her granddaughter.", exampleTranslation: "خبزت الجدة مع حفيدتها." },
  { word: "purr", translation: "يخرخر", partOfSpeech: "verb", difficulty: "easy", example: "The cat will purr when you pet it.", exampleTranslation: "ستخرخر القطة عندما تداعبها." },
  { word: "chirp", translation: "يزقزق", partOfSpeech: "verb", difficulty: "easy", example: "Birds chirp outside my window.", exampleTranslation: "تزقزق الطيور خارج نافذتي." },
  { word: "giggle", translation: "يقهقه", partOfSpeech: "verb", difficulty: "easy", example: "The joke made us giggle quietly.", exampleTranslation: "جعلتنا النكتة نقهقه بهدوء." },
  { word: "smile", translation: "يبتسم", partOfSpeech: "verb", difficulty: "easy", example: "Please smile for the class photo.", exampleTranslation: "من فضلك ابتسم لصورة الصف." },
  { word: "frown", translation: "يعبس", partOfSpeech: "verb", difficulty: "easy", example: "Do not frown; we can try again.", exampleTranslation: "لا تعبس؛ يمكننا المحاولة مرة أخرى." },
  { word: "clap", translation: "يصفق", partOfSpeech: "verb", difficulty: "easy", example: "Clap your hands after the song.", exampleTranslation: "صفق بيديك بعد الأغنية." },
  { word: "hop", translation: "يقفز", partOfSpeech: "verb", difficulty: "easy", example: "Bunnies hop across the green field.", exampleTranslation: "يقفز الأرانب عبر الحقل الأخضر." },
  { word: "crawl", translation: "يزحف", partOfSpeech: "verb", difficulty: "easy", example: "The baby likes to crawl on the rug.", exampleTranslation: "يحب الرضيع الزحف على السجادة." },
  { word: "copy", translation: "ينسخ", partOfSpeech: "verb", difficulty: "easy", example: "Copy the spelling words in your notebook.", exampleTranslation: "انسخ كلمات الإملاء في دفترك." },
  { word: "trace", translation: "يخط", partOfSpeech: "verb", difficulty: "easy", example: "Trace the letter A with your finger.", exampleTranslation: "اخلُط حرف A بإصبعك." },
  { word: "paste", translation: "يلصق", partOfSpeech: "verb", difficulty: "easy", example: "Paste the picture onto the poster.", exampleTranslation: "الصق الصورة على الملصق." },
  { word: "tape", translation: "يلصق بشريط", partOfSpeech: "verb", difficulty: "easy", example: "Tape the torn page into your book.", exampleTranslation: "ألصق الصفحة الممزقة بشريط في كتابك." },
  { word: "staple", translation: "يدبس", partOfSpeech: "verb", difficulty: "medium", example: "Staple your worksheet to the folder.", exampleTranslation: "دبّس ورقة عملك على المجلد." },
  { word: "zip", translation: "يزرّر", partOfSpeech: "verb", difficulty: "easy", example: "Zip your coat when it is windy.", exampleTranslation: "ازرّر معطفك عندما تهب الريح." },
  { word: "unwrap", translation: "يفتح", partOfSpeech: "verb", difficulty: "easy", example: "Unwrap the gift carefully.", exampleTranslation: "افتح الهدية بعناية." },
  { word: "wrap", translation: "يلف", partOfSpeech: "verb", difficulty: "easy", example: "Wrap the sandwich in clean paper.", exampleTranslation: "لف الساندويتش بورقة نظيفة." },
  { word: "lineup", translation: "طابور", partOfSpeech: "noun", difficulty: "easy", example: "Stand in a straight lineup, please.", exampleTranslation: "قف في طابور مستقيم من فضلك." },
  { word: "locker", translation: "خزانة", partOfSpeech: "noun", difficulty: "medium", example: "Put your coat inside the locker.", exampleTranslation: "ضع معطفك داخل الخزانة." },
  { word: "binder", translation: "ملف", partOfSpeech: "noun", difficulty: "medium", example: "Keep papers safe in your binder.", exampleTranslation: "احفظ الأوراق في ملفك." },
  { word: "folder", translation: "مجلد", partOfSpeech: "noun", difficulty: "easy", example: "Slide the worksheet into your folder.", exampleTranslation: "أدخل ورقة العمل في مجلدك." },
  { word: "marker", translation: "قلم عريض", partOfSpeech: "noun", difficulty: "easy", example: "Use a blue marker on the poster.", exampleTranslation: "استخدم قلم عريض أزرق على الملصق." },
  { word: "chalk", translation: "طباشير", partOfSpeech: "noun", difficulty: "easy", example: "The teacher writes with white chalk.", exampleTranslation: "يكتب المعلم بطباشير أبيض." },
  { word: "chalkboard", translation: "سبورة", partOfSpeech: "noun", difficulty: "medium", example: "Numbers are on the chalkboard today.", exampleTranslation: "الأرقام على السبورة اليوم." },
  { word: "pointer", translation: "مؤشر", partOfSpeech: "noun", difficulty: "medium", example: "The teacher used a pointer on the map.", exampleTranslation: "استخدم المعلم مؤشراً على الخريطة." },
  { word: "tardy", translation: "متأخر", partOfSpeech: "adjective", difficulty: "medium", example: "Do not be tardy for the bell.", exampleTranslation: "لا تتأخر عن الجرس." },
  { word: "absent", translation: "غائب", partOfSpeech: "adjective", difficulty: "medium", example: "My friend was absent on Monday.", exampleTranslation: "كان صديقي غائباً يوم الاثنين." },
  { word: "present", translation: "حاضر", partOfSpeech: "adjective", difficulty: "easy", example: "All students are present today.", exampleTranslation: "كل الطلاب حاضرون اليوم." },
  { word: "raise", translation: "يرفع", partOfSpeech: "verb", difficulty: "easy", example: "Raise your hand to ask a question.", exampleTranslation: "ارفع يدك لطرح سؤال." },
  { word: "ask", translation: "يسأل", partOfSpeech: "verb", difficulty: "easy", example: "Ask the teacher if you need help.", exampleTranslation: "اسأل المعلم إذا احتجت مساعدة." },
  { word: "tell", translation: "يخبر", partOfSpeech: "verb", difficulty: "easy", example: "Tell me about your weekend.", exampleTranslation: "أخبرني عن عطلة نهاية الأسبوع." },
  { word: "show", translation: "يُظهر", partOfSpeech: "verb", difficulty: "easy", example: "Show your work on the page.", exampleTranslation: "أظهر عملك على الصفحة." },
  { word: "find", translation: "يجد", partOfSpeech: "verb", difficulty: "easy", example: "Can you find page ten?", exampleTranslation: "هل تجد الصفحة عشرة؟" },
  { word: "hide", translation: "يختبئ", partOfSpeech: "verb", difficulty: "easy", example: "Hide behind the big tree in tag.", exampleTranslation: "اختبئ خلف الشجرة الكبيرة في الغميضة." },
  { word: "follow", translation: "يتبع", partOfSpeech: "verb", difficulty: "easy", example: "Follow the leader in our game.", exampleTranslation: "اتبع القائد في لعبتنا." },
  { word: "lead", translation: "يقود", partOfSpeech: "verb", difficulty: "medium", example: "Today I will lead the line.", exampleTranslation: "اليوم سأقود الصف." },
  { word: "win", translation: "يفوز", partOfSpeech: "verb", difficulty: "easy", example: "Our team might win the game.", exampleTranslation: "قد يفوز فريقنا باللعبة." },
  { word: "lose", translation: "يخسر", partOfSpeech: "verb", difficulty: "easy", example: "It is okay to lose and try again.", exampleTranslation: "لا بأس أن تخسر وتحاول مجدداً." },
  { word: "score", translation: "نتيجة", partOfSpeech: "noun", difficulty: "easy", example: "The score was three to two.", exampleTranslation: "كانت النتيجة ثلاثة مقابل اثنين." },
  { word: "coach", translation: "مدرب", partOfSpeech: "noun", difficulty: "easy", example: "The coach gave us water breaks.", exampleTranslation: "أعطانا المدرب فترات شرب ماء." },
  { word: "umpire", translation: "حكم", partOfSpeech: "noun", difficulty: "medium", example: "The umpire called the player safe.", exampleTranslation: "قال الحكم إن اللاعب في أمان." },
  { word: "bat", translation: "مضرب", partOfSpeech: "noun", difficulty: "easy", example: "He swung the bat at the ball.", exampleTranslation: "لوّح بالمضرب نحو الكرة." },
  { word: "mitt", translation: "قفاز", partOfSpeech: "noun", difficulty: "easy", example: "Catch the ball with your mitt.", exampleTranslation: "امسك الكرة بقفازك." },
  { word: "paddle", translation: "مجداف", partOfSpeech: "noun", difficulty: "medium", example: "Use a paddle to move the canoe.", exampleTranslation: "استخدم مجدافاً لتحريك الزورق." },
  { word: "canoe", translation: "زورق", partOfSpeech: "noun", difficulty: "medium", example: "We paddled the canoe slowly.", exampleTranslation: "جدفنا الزورق ببطء." },
  { word: "raft", translation: "طوافة", partOfSpeech: "noun", difficulty: "medium", example: "The raft floated on the calm lake.", exampleTranslation: "طافت الطوافة على البحيرة الهادئة." },
  { word: "lifejacket", translation: "سترة نجاة", partOfSpeech: "noun", difficulty: "medium", example: "Zip your lifejacket before boating.", exampleTranslation: "ازرّر سترة النجاة قبل الإبحار." },
  { word: "campfire", translation: "نار مخيم", partOfSpeech: "noun", difficulty: "medium", example: "We sang songs around the campfire.", exampleTranslation: "غنينا حول نار المخيم." },
  { word: "tent", translation: "خيمة", partOfSpeech: "noun", difficulty: "easy", example: "Our tent stood near the pine trees.", exampleTranslation: "وقفت خيمتنا قرب أشجار الصنوبر." },
  { word: "trail", translation: "مسار", partOfSpeech: "noun", difficulty: "easy", example: "Stay on the forest trail.", exampleTranslation: "ابقَ على مسار الغابة." },
  { word: "path", translation: "درب", partOfSpeech: "noun", difficulty: "easy", example: "The path leads to the pond.", exampleTranslation: "الدرب يؤدي إلى البركة." },
  { word: "pond", translation: "بركة", partOfSpeech: "noun", difficulty: "easy", example: "Ducks swim in the school pond.", exampleTranslation: "تسبح البط في بركة المدرسة." },
  { word: "stream", translation: "جدول", partOfSpeech: "noun", difficulty: "medium", example: "A tiny stream crosses the trail.", exampleTranslation: "جدول صغير يعبر المسار." },
  { word: "barn", translation: "حظيرة", partOfSpeech: "noun", difficulty: "easy", example: "Horses sleep in the red barn.", exampleTranslation: "تنام الخيول في الحظيرة الحمراء." },
  { word: "tractor", translation: "جرار", partOfSpeech: "noun", difficulty: "medium", example: "The tractor pulls a full wagon.", exampleTranslation: "يجر الجرار عربة ممتلئة." },
  { word: "hay", translation: "تبن", partOfSpeech: "noun", difficulty: "easy", example: "Cows eat hay in the winter.", exampleTranslation: "تأكل الأبقار التبن في الشتاء." },
  { word: "roar", translation: "يزأر", partOfSpeech: "verb", difficulty: "easy", example: "The lion might roar in the story.", exampleTranslation: "قد يزأر الأسد في القصة." },
  { word: "sniff", translation: "يشم", partOfSpeech: "verb", difficulty: "easy", example: "The dog will sniff the garden path.", exampleTranslation: "يشم الكلب ممر الحديقة." },
  { word: "wag", translation: "يهز", partOfSpeech: "verb", difficulty: "easy", example: "Happy dogs wag their tails fast.", exampleTranslation: "تهز الكلاب السعيدة ذيولها بسرعة." },
  { word: "peck", translation: "ينقر", partOfSpeech: "verb", difficulty: "easy", example: "Chickens peck seeds on the ground.", exampleTranslation: "تنقر الدجاج الحبوب على الأرض." },
  { word: "moo", translation: "يخور", partOfSpeech: "verb", difficulty: "easy", example: "The cow will moo in the field.", exampleTranslation: "يخور البقرة في الحقل." },
  { word: "oink", translation: "يخرخ", partOfSpeech: "verb", difficulty: "easy", example: "Pigs oink near the muddy pen.", exampleTranslation: "تخرخ الخنازير قرب الحظيرة الموحلة." },
  { word: "baa", translation: "يَثغى", partOfSpeech: "verb", difficulty: "easy", example: "Sheep baa on the green hill.", exampleTranslation: "تثغى الأغنام على التل الأخضر." },
  { word: "neigh", translation: "يصهل", partOfSpeech: "verb", difficulty: "easy", example: "The horse will neigh at feeding time.", exampleTranslation: "يصهل الحصان وقت العلف." },
  { word: "ribbit", translation: "ينق", partOfSpeech: "verb", difficulty: "easy", example: "Frogs ribbit near the pond.", exampleTranslation: "تنق الضفادع قرب البركة." },
  { word: "buzz", translation: "يطن", partOfSpeech: "verb", difficulty: "easy", example: "Bees buzz around the flowers.", exampleTranslation: "تطن النحل حول الزهور." },
  { word: "hoot", translation: "يصوت", partOfSpeech: "verb", difficulty: "easy", example: "Owls hoot when the moon is bright.", exampleTranslation: "تصوت البومة عندما يكون القمر ساطعاً." },
];

const used = new Set(GRADE1_CARDS.map((c) => c.word.toLowerCase()));
for (const c of GRADE2_CARDS) {
  if (!TO_REMOVE.has(c.word.toLowerCase())) used.add(c.word.toLowerCase());
}

const pool = REPLACEMENT_POOL.filter((c) => {
  const w = c.word.toLowerCase();
  return !used.has(w) && !TO_REMOVE.has(w);
});

let poolIdx = 0;
const newCards = [];
let replaced = 0;

for (const card of GRADE2_CARDS) {
  const w = card.word.toLowerCase();
  if (TO_REMOVE.has(w)) {
    if (poolIdx >= pool.length) throw new Error(`Pool exhausted at "${w}" (${poolIdx}/${pool.length})`);
    const rep = pool[poolIdx++];
    newCards.push(rep);
    used.add(rep.word.toLowerCase());
    replaced++;
  } else {
    newCards.push(card);
  }
}

if (newCards.length !== 600) throw new Error(`Expected 600, got ${newCards.length}`);
console.log(`Replacing ${replaced} words; pool size ${pool.length}`);

// Downgrade remaining "hard" to medium where still too harsh
const STILL_HARD_OK = new Set(["fraction", "caterpillar", "cocoon", "thermometer", "experiment"]);
for (const c of newCards) {
  if (c.difficulty === "hard" && !STILL_HARD_OK.has(c.word.toLowerCase())) {
    c.difficulty = "medium";
  }
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function cardLine(c) {
  return `  { word: "${esc(c.word)}", translation: "${esc(c.translation)}", partOfSpeech: "${c.partOfSpeech}", difficulty: "${c.difficulty}", example: "${esc(c.example)}", exampleTranslation: "${esc(c.exampleTranslation)}" },`;
}

const batchThemes = [
  "numbers 11–20", "school subjects", "places in town", "professions", "sports & outdoor",
  "technology", "nature & space", "feelings & character", "home & appliances", "verbs & thinking",
  "numbers 21–30", "larger numbers", "more animals", "more food", "town & community",
  "body & health", "action verbs", "materials & shapes", "school extended", "time & calendar",
  "communication verbs", "descriptive adjectives", "weather & environment", "clothing",
  "music & arts", "geography & landforms", "kitchen & cooking", "people & community",
  "money & exchange", "thinking & outcomes", "space & astronomy", "insects & reptiles",
  "plants & gardening", "measurement", "safety & emergency", "hobbies & games",
  "directions & position", "wild animals", "office & mail", "movement verbs",
  "adverbs", "home extended", "transportation extended", "science & lab", "sports & competition",
  "character traits", "communication", "earth materials", "civics & events", "body actions",
  "more food", "furniture & household", "learning verbs", "taste & texture", "buildings & places",
  "digital life", "weather & sky", "family extended", "behavior & values", "stories & adventure",
];

let body = "const GRADE2_CARDS_RAW = [\n";
for (let b = 0; b < 60; b++) {
  body += `  // batch ${b + 1} — ${batchThemes[b]}\n`;
  for (let i = 0; i < 10; i++) body += cardLine(newCards[b * 10 + i]) + "\n";
}
body += "];\n";

const source = readFileSync(cardsPath, "utf8");
const rest = source
  .replace(/^\/\*\*[\s\S]*?\*\/\n/, "")
  .replace(/const GRADE2_CARDS_RAW = \[[\s\S]*?\n\];/, body);

writeFileSync(
  cardsPath,
  `/** Grade 2 lesson — 600 cards (vocabulary suited to Grade 2; grades 3–12 use harder words). */\n` + rest,
);

// Validate by re-import
const { pathToFileURL } = await import("node:url");
const v = await import(pathToFileURL(cardsPath) + "?update=" + Date.now());
console.log("Validated:", v.GRADE2_CARDS.length, "cards");
const hard = v.GRADE2_CARDS.filter((c) => c.difficulty === "hard").length;
console.log("hard remaining:", hard);
