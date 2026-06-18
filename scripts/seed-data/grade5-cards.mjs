/** Grade 5 lesson — 1500 cards target (100 base + 410 extra vocab + 1000 vocabulary). */
import { GRADE1_CARDS } from "./grade1-cards.mjs";
import { GRADE2_CARDS } from "./grade2-cards.mjs";
import { GRADE3_CARDS } from "./grade3-cards.mjs";
import { GRADE4_CARDS } from "./grade4-cards.mjs";
import { GRADE5_CHUNK_E } from "./grade5-chunk-e.mjs";
import { GRADE5_CHUNK_A } from "./grade5-chunk-a.mjs";
import { GRADE5_CHUNK_B } from "./grade5-chunk-b.mjs";
import { GRADE5_CHUNK_C } from "./grade5-chunk-c.mjs";
import { GRADE5_CHUNK_D } from "./grade5-chunk-d.mjs";

export const GRADE5_LESSON_TITLE = "grade 5";
export const GRADE5_TARGET_TOTAL = 1500;

export const GRADE5_CARDS_RAW = [
  // batch 1 — geometry
  { word: "quadrilateral", translation: "رباعي أضلاع", partOfSpeech: "noun", difficulty: "hard", example: "Every quadrilateral has four sides and four corners.", exampleTranslation: "لكل رباعي أضلاع أربعة أضلاع وأربع زوايا." },
  { word: "heptagon", translation: "سباعي", partOfSpeech: "noun", difficulty: "hard", example: "The tile pattern formed a colorful heptagon on the floor.", exampleTranslation: "شكّل نمط البلاط سباعياً ملوناً على الأرضية." },
  { word: "nonagon", translation: "تساعي", partOfSpeech: "noun", difficulty: "hard", example: "Students traced a nonagon with nine equal sides.", exampleTranslation: "تتبع الطلاب تساعياً بأضلاع تسعة متساوية." },
  { word: "decagon", translation: "عشاري", partOfSpeech: "noun", difficulty: "hard", example: "A decagon has ten sides meeting at ten vertices.", exampleTranslation: "للعشاري عشرة أضلاع تلتقي عند عشر رؤوس." },
  { word: "congruent", translation: "متطابق", partOfSpeech: "adjective", difficulty: "hard", example: "Congruent triangles match in size and shape exactly.", exampleTranslation: "المثلثات المتطابقة تتطابق في الحجم والشكل تماماً." },
  { word: "similar", translation: "متشابه", partOfSpeech: "adjective", difficulty: "medium", example: "Similar figures have the same shape but different sizes.", exampleTranslation: "الأشكال المتشابهة لها نفس الشكل لكن بأحجام مختلفة." },
  { word: "adjacent", translation: "مجاور", partOfSpeech: "adjective", difficulty: "hard", example: "Adjacent angles share one common side and vertex.", exampleTranslation: "تتشارك الزوايا المجاورة ضلعاً ورأساً مشتركين." },
  { word: "supplementary", translation: "متمّم", partOfSpeech: "adjective", difficulty: "hard", example: "Supplementary angles add up to one hundred eighty degrees.", exampleTranslation: "مجموع الزوايا المتممة يساوي مئة وثمانين درجة." },
  { word: "complementary", translation: "متكامل", partOfSpeech: "adjective", difficulty: "hard", example: "Complementary angles combine to make ninety degrees.", exampleTranslation: "تشكّل الزوايا المتكاملة تسعين درجة معاً." },
  { word: "perpendicular", translation: "عمودي", partOfSpeech: "adjective", difficulty: "hard", example: "Perpendicular lines meet at a right angle.", exampleTranslation: "تلتقي الخطوط العمودية بزاوية قائمة." },
  // batch 3 — geometry & government
  { word: "bisector", translation: "منصف", partOfSpeech: "noun", difficulty: "hard", example: "An angle bisector splits an angle into two equal parts.", exampleTranslation: "يقسّم منصف الزاوية الزاوية إلى جزأين متساويين." },
  { word: "federalism", translation: "فدرالية", partOfSpeech: "noun", difficulty: "hard", example: "Federalism divides power between national and state governments.", exampleTranslation: "تقسّم الفدرالية السلطة بين الحكومة الوطنية وحكومات الولايات." },
  { word: "unicameral", translation: "أحادي المجلس", partOfSpeech: "adjective", difficulty: "hard", example: "A unicameral legislature has only one lawmaking chamber.", exampleTranslation: "للمجلس التشريعي أحادي المجلس غرفة تشريع واحدة فقط." },
  { word: "republic", translation: "جمهورية", partOfSpeech: "noun", difficulty: "hard", example: "In a republic, citizens elect leaders to represent them.", exampleTranslation: "في الجمهورية ينتخب المواطنون قادة يمثلونهم." },
  { word: "monarchy", translation: "ملكية", partOfSpeech: "noun", difficulty: "hard", example: "A monarchy passes royal power through a ruling family.", exampleTranslation: "تنتقل السلطة الملكية في النظام الملكي عبر عائلة حاكمة." },
  { word: "oligarchy", translation: "أوليغارشية", partOfSpeech: "noun", difficulty: "hard", example: "An oligarchy is ruled by a small, powerful group.", exampleTranslation: "تحكم الأوليغارشية مجموعة صغيرة ونافذة." },
  { word: "autocracy", translation: "استبداد", partOfSpeech: "noun", difficulty: "hard", example: "An autocracy gives one ruler total control of government.", exampleTranslation: "يمنح الاستبداد حاكماً واحداً سيطرة كاملة على الحكومة." },
  { word: "theocracy", translation: "ثيوقراطية", partOfSpeech: "noun", difficulty: "hard", example: "A theocracy bases its laws on religious authority.", exampleTranslation: "تستند الثيوقراطية قوانينها إلى سلطة دينية." },
  { word: "totalitarian", translation: "شمولي", partOfSpeech: "adjective", difficulty: "hard", example: "A totalitarian state controls nearly every part of daily life.", exampleTranslation: "تسيطر الدولة الشمولية على كل جانب تقريباً من الحياة اليومية." },
  { word: "authoritarian", translation: "استبدادي", partOfSpeech: "adjective", difficulty: "hard", example: "An authoritarian leader demands strict obedience from citizens.", exampleTranslation: "يطالب القائد الاستبدادي بالطاعة الصارمة من المواطنين." },
  // batch 4 — government & economics
  { word: "populism", translation: "شعبوية", partOfSpeech: "noun", difficulty: "hard", example: "Populism appeals directly to ordinary people's concerns.", exampleTranslation: "تخاطب الشعبوية مباشرة هموم الناس العاديين." },
  { word: "nationalism", translation: "قومية", partOfSpeech: "noun", difficulty: "hard", example: "Nationalism emphasizes pride in one's country and culture.", exampleTranslation: "تؤكد القومية الفخر بالوطن والثقافة." },
  { word: "imperialism", translation: "إمبريالية", partOfSpeech: "noun", difficulty: "hard", example: "Imperialism extends a nation's power over other lands.", exampleTranslation: "توسّع الإمبريالية نفوذ أمة على أراضٍ أخرى." },
  { word: "colonialism", translation: "استعمار", partOfSpeech: "noun", difficulty: "hard", example: "Colonialism controlled distant regions for economic gain.", exampleTranslation: "سيطر الاستعمار على مناطق بعيدة لتحقيق مكاسب اقتصادية." },
  { word: "mercantilism", translation: "تجارية", partOfSpeech: "noun", difficulty: "hard", example: "Mercantilism valued exports more than imports for wealth.", exampleTranslation: "قدّرت السياسة التجارية الصادرات أكثر من الواردات لبناء الثروة." },
  { word: "capitalism", translation: "رأسمالية", partOfSpeech: "noun", difficulty: "hard", example: "Capitalism lets private owners run businesses for profit.", exampleTranslation: "تسمح الرأسمالية لأصحاب الأعمال الخاصة بالعمل لتحقيق الربح." },
  { word: "socialism", translation: "اشتراكية", partOfSpeech: "noun", difficulty: "hard", example: "Socialism emphasizes shared ownership of key industries.", exampleTranslation: "تؤكد الاشتراكية الملكية المشتركة للصناعات الأساسية." },
  { word: "philanthropy", translation: "عمل خيري", partOfSpeech: "noun", difficulty: "hard", example: "Philanthropy funded new books for the school library.", exampleTranslation: "موّل العمل الخيري كتباً جديدة لمكتبة المدرسة." },
  { word: "entrepreneurship", translation: "ريادة أعمال", partOfSpeech: "noun", difficulty: "hard", example: "Entrepreneurship class taught students to plan a small business.", exampleTranslation: "علّمت حصة ريادة الأعمال الطلاب تخطيط مشروع صغير." },
  { word: "unemployment", translation: "بطالة", partOfSpeech: "noun", difficulty: "hard", example: "High unemployment means many workers cannot find jobs.", exampleTranslation: "البطالة المرتفعة تعني أن كثيراً من العمال لا يجدون عملاً." },
  // batch 5 — finance & technology
  { word: "royalty", translation: "إتاوة", partOfSpeech: "noun", difficulty: "hard", example: "The author receives a royalty for each book sold.", exampleTranslation: "يتلقى المؤلف إتاوة عن كل كتاب يُباع." },
  { word: "credit", translation: "ائتمان", partOfSpeech: "noun", difficulty: "medium", example: "Store credit let her return the jacket without cash.", exampleTranslation: "سمح لها رصيد المتجر بإرجاع السترة دون نقد." },
  { word: "debit", translation: "خصم", partOfSpeech: "noun", difficulty: "hard", example: "A debit card withdraws money directly from your account.", exampleTranslation: "تسحب بطاقة الخصم المال مباشرة من حسابك." },
  { word: "surplus", translation: "فائض", partOfSpeech: "noun", difficulty: "hard", example: "The budget surplus allowed one extra field trip.", exampleTranslation: "سمح فائض الميزانية برحلة ميدانية إضافية." },
  { word: "deficit", translation: "عجز", partOfSpeech: "noun", difficulty: "hard", example: "A budget deficit means spending exceeded available funds.", exampleTranslation: "يعني عجز الميزانية أن الإنفاق تجاوز الأموال المتاحة." },
  { word: "hexadecimal", translation: "سداسي عشري", partOfSpeech: "adjective", difficulty: "hard", example: "Hexadecimal code uses digits zero through nine and letters A to F.", exampleTranslation: "يستخدم الرمز السداسي العشري أرقاماً من صفر إلى تسعة وحروفاً من A إلى F." },
  { word: "spyware", translation: "برمجيات تجسس", partOfSpeech: "noun", difficulty: "hard", example: "Spyware secretly tracks activity on an infected device.", exampleTranslation: "تتعقب برمجيات التجسس سراً النشاط على الجهاز المصاب." },
  { word: "latency", translation: "زمن استجابة", partOfSpeech: "noun", difficulty: "hard", example: "Low latency keeps online games responding instantly.", exampleTranslation: "زمن الاستجابة المنخفض يبقي الألعاب عبر الإنترنت تستجيب فوراً." },
  { word: "protocol", translation: "بروتوكول", partOfSpeech: "noun", difficulty: "hard", example: "The internet protocol routes data packets between computers.", exampleTranslation: "يوجّه بروتوكول الإنترنت حزم البيانات بين الحواسيب." },
  { word: "counterargument", translation: "حجة مضادة", partOfSpeech: "noun", difficulty: "hard", example: "Her counterargument weakened the opposing team's main claim.", exampleTranslation: "أضعفت حجتها المضادة الادعاء الرئيسي للفريق المنافس." },
  // batch 6 — debate & poetry forms
  { word: "oratory", translation: "فن الخطابة", partOfSpeech: "noun", difficulty: "hard", example: "His oratory moved the audience to support the project.", exampleTranslation: "أثار فن خطابته الجمهور لدعم المشروع." },
  { word: "eloquence", translation: "بلاغة", partOfSpeech: "noun", difficulty: "hard", example: "Her eloquence made the complex topic easy to follow.", exampleTranslation: "جعلت بلاغتها الموضوع المعقد سهلاً للمتابعة." },
  { word: "articulation", translation: "وضوح نطق", partOfSpeech: "noun", difficulty: "hard", example: "Clear articulation helps listeners catch every word.", exampleTranslation: "يساعد وضوح النطق المستمعين على التقاط كل كلمة." },
  { word: "enunciation", translation: "نطق واضح", partOfSpeech: "noun", difficulty: "hard", example: "Careful enunciation improved her presentation score.", exampleTranslation: "حسّن النطق الواضح درجة عرضها." },
  { word: "diction", translation: "أسلوب لفظي", partOfSpeech: "noun", difficulty: "hard", example: "Formal diction suits academic essays better than slang.", exampleTranslation: "الأسلوب اللفظي الرسمي يناسب المقالات الأكاديمية أكثر من العامية." },
  { word: "couplet", translation: "بيتان متجاوران", partOfSpeech: "noun", difficulty: "hard", example: "The poem ended with a rhyming couplet about hope.", exampleTranslation: "انتهت القصيدة ببيتين متجاورين متقافيين عن الأمل." },
  { word: "haiku", translation: "هايكو", partOfSpeech: "noun", difficulty: "hard", example: "She wrote a haiku about falling cherry blossoms.", exampleTranslation: "كتبت هايكو عن أزهار الكرز المتساقطة." },
  { word: "limerick", translation: "قصيدة هزلية", partOfSpeech: "noun", difficulty: "hard", example: "The class laughed at his silly five-line limerick.", exampleTranslation: "ضحك الصف من قصيدته الهزلية الخمسة أسطر." },
  { word: "ballad", translation: "قصة غنائية", partOfSpeech: "noun", difficulty: "hard", example: "The ballad told a sailor's journey across stormy seas.", exampleTranslation: "روت القصة الغنائية رحلة بحار عبر بحار عاصفة." },
  { word: "sonnet", translation: "سونيتة", partOfSpeech: "noun", difficulty: "hard", example: "A sonnet usually has fourteen lines with set rhyme.", exampleTranslation: "للسونيتة عادة أربعة عشر بيتاً بقافية محددة." },
  // batch 7 — poetry & astronomy
  { word: "ode", translation: "قصيدة مديح", partOfSpeech: "noun", difficulty: "hard", example: "He composed an ode celebrating the town's founders.", exampleTranslation: "ألّف قصيدة مديح تحتفل بمؤسسي البلدة." },
  { word: "elegy", translation: "رثاء", partOfSpeech: "noun", difficulty: "hard", example: "The elegy mourned a hero who protected the harbor.", exampleTranslation: "ناح الرثاء بطلاً حما الميناء." },
  { word: "photosphere", translation: "كرة ضوئية", partOfSpeech: "noun", difficulty: "hard", example: "The photosphere is the bright visible surface of the sun.", exampleTranslation: "الكرة الضوئية هي السطح المرئي المشرق للشمس." },
  { word: "chromosphere", translation: "غلاف لوني", partOfSpeech: "noun", difficulty: "hard", example: "The chromosphere glows red during a total solar eclipse.", exampleTranslation: "يتوهج الغلاف اللوني بالأحمر أثناء كسوف الشمس الكامل." },
  { word: "corona", translation: "هالة شمسية", partOfSpeech: "noun", difficulty: "hard", example: "The sun's corona appears as a faint crown during eclipse.", exampleTranslation: "تظهر الهالة الشمسية كتاج خافت أثناء الكسوف." },
  { word: "lightyear", translation: "سنة ضوئية", partOfSpeech: "noun", difficulty: "hard", example: "The nearest star is over four lightyears away.", exampleTranslation: "أقرب نجم يبعد أكثر من أربع سنوات ضوئية." },
  { word: "parsec", translation: "فرسخ فلكي", partOfSpeech: "noun", difficulty: "hard", example: "Astronomers measure vast distances using the parsec unit.", exampleTranslation: "يقيس الفلكيون المسافات الشاسعة بوحدة الفرسخ الفلكي." },
  { word: "aphelion", translation: "أبعد نقطة", partOfSpeech: "noun", difficulty: "hard", example: "Earth reaches aphelion when it is farthest from the sun.", exampleTranslation: "تبلغ الأرض أبعد نقطة عندما تكون أبعد ما يمكن عن الشمس." },
  { word: "perihelion", translation: "أقرب نقطة", partOfSpeech: "noun", difficulty: "hard", example: "Perihelion is when a planet swings closest to the sun.", exampleTranslation: "الأقرب نقطة هي عندما يقترب الكوكب أكثر ما يمكن من الشمس." },
  { word: "blackhole", translation: "ثقب أسود", partOfSpeech: "noun", difficulty: "hard", example: "A blackhole pulls in matter with gravity so strong light cannot escape.", exampleTranslation: "يمتص الثقب الأسود المادة بجاذبية قوية لدرجة أن الضوء لا يفلت." },
  // batch 8 — body systems
  { word: "circulatory", translation: "دوراني", partOfSpeech: "adjective", difficulty: "hard", example: "The circulatory system carries blood throughout the body.", exampleTranslation: "ينقل الجهاز الدوراني الدم في جميع أنحاء الجسم." },
  { word: "respiratory", translation: "تنفسي", partOfSpeech: "adjective", difficulty: "hard", example: "The respiratory system brings oxygen into your lungs.", exampleTranslation: "يجلب الجهاز التنفسي الأكسجين إلى رئتيك." },
  { word: "digestive", translation: "هضمي", partOfSpeech: "adjective", difficulty: "hard", example: "The digestive system breaks food into usable nutrients.", exampleTranslation: "يكسر الجهاز الهضمي الطعام إلى مغذيات قابلة للاستخدام." },
  { word: "skeletal", translation: "هيكلي", partOfSpeech: "adjective", difficulty: "hard", example: "The skeletal system supports the body and protects organs.", exampleTranslation: "يدعم الجهاز الهيكلي الجسم ويحمي الأعضاء." },
  { word: "muscular", translation: "عضلي", partOfSpeech: "adjective", difficulty: "medium", example: "The muscular system lets you run, lift, and smile.", exampleTranslation: "يتيح لك الجهاز العضلي الركض والرفع والابتسام." },
  { word: "nervous", translation: "عصبي", partOfSpeech: "adjective", difficulty: "medium", example: "The nervous system sends signals between brain and muscles.", exampleTranslation: "يرسل الجهاز العصبي إشارات بين الدماغ والعضلات." },
  { word: "endocrine", translation: "غدد صماء", partOfSpeech: "adjective", difficulty: "hard", example: "The endocrine system releases hormones that control growth.", exampleTranslation: "يطلق الجهاز الصماء هرمونات تتحكم في النمو." },
  { word: "lymphatic", translation: "لمفاوي", partOfSpeech: "adjective", difficulty: "hard", example: "The lymphatic system helps defend the body against infection.", exampleTranslation: "يساعد الجهاز اللمفاوي الجسم على الدفاع ضد العدوى." },
  { word: "vertebra", translation: "فقرة", partOfSpeech: "noun", difficulty: "hard", example: "Each vertebra in the spine cushions shock while you walk.", exampleTranslation: "كل فقرة في العمود الفقري تخفف الصدمات أثناء المشي." },
  { word: "respiration", translation: "تنفس", partOfSpeech: "noun", difficulty: "hard", example: "Cellular respiration releases energy stored in glucose.", exampleTranslation: "يطلق التنفس الخلوي الطاقة المخزنة في الجلوكوز." },
  // batch 9 — earth science & history
  { word: "infiltration", translation: "تسرب", partOfSpeech: "noun", difficulty: "hard", example: "Rainwater infiltration refills soil moisture after a storm.", exampleTranslation: "يعيد تسرب مياه الأمطار رطوبة التربة بعد العاصفة." },
  { word: "percolation", translation: "تصفية", partOfSpeech: "noun", difficulty: "hard", example: "Percolation filters water slowly through layers of sand.", exampleTranslation: "تصفّي عملية التصفية الماء ببطء عبر طبقات الرمل." },
  { word: "runoff", translation: "جريان سطحي", partOfSpeech: "noun", difficulty: "hard", example: "Heavy runoff carried soil into the creek after rainfall.", exampleTranslation: "حمل الجريان السطحي الكثيف التربة إلى الجدول بعد المطر." },
  { word: "groundwater", translation: "مياه جوفية", partOfSpeech: "noun", difficulty: "hard", example: "Wells tap groundwater stored deep beneath the fields.", exampleTranslation: "تستخرج الآبار المياه الجوفية المخزنة عميقاً تحت الحقول." },
  { word: "geyser", translation: "نبع حار", partOfSpeech: "noun", difficulty: "hard", example: "The geyser erupted steam and hot water every hour.", exampleTranslation: "ثار النبع الحار بالبخار والماء الساخن كل ساعة." },
  { word: "crater", translation: "فوهة", partOfSpeech: "noun", difficulty: "hard", example: "A meteor impact left a wide crater in the desert.", exampleTranslation: "ترك اصطدام نيزك فوهة واسعة في الصحراء." },
  { word: "caldera", translation: "حوض بركاني", partOfSpeech: "noun", difficulty: "hard", example: "The ancient caldera now holds a calm blue lake.", exampleTranslation: "يحتوي الحوض البركاني القديم الآن على بحيرة زرقاء هادئة." },
  { word: "seismograph", translation: "مقياس زلزالي", partOfSpeech: "noun", difficulty: "hard", example: "A seismograph records vibrations from distant earthquakes.", exampleTranslation: "يسجل المقياس الزلزالي اهتزازات الزلازل البعيدة." },
  { word: "abolitionist", translation: "مناهض للعبودية", partOfSpeech: "noun", difficulty: "hard", example: "The abolitionist spoke boldly against slavery at the town hall.", exampleTranslation: "تحدث المناهض للعبودية بجرأة ضد الرق في قاعة البلدة." },
  { word: "plantation", translation: "مزرعة كبيرة", partOfSpeech: "noun", difficulty: "hard", example: "The old plantation records describe crops grown before the war.", exampleTranslation: "تصف سجلات المزرعة الكبيرة القديمة المحاصيل المزروعة قبل الحرب." },
  // batch 10 — history & literary analysis
  { word: "Confederacy", translation: "كونفدرالية", partOfSpeech: "noun", difficulty: "hard", example: "The Confederacy formed when southern states seceded.", exampleTranslation: "تشكلت الكونفدرالية عندما انفصلت الولايات الجنوبية." },
  { word: "ratification", translation: "تصديق", partOfSpeech: "noun", difficulty: "hard", example: "Ratification required nine states to approve the Constitution.", exampleTranslation: "تطلب التصديق موافقة تسع ولايات على الدستور." },
  { word: "convention", translation: "مؤتمر", partOfSpeech: "noun", difficulty: "medium", example: "Delegates met at the convention to draft new laws.", exampleTranslation: "اجتمع المندوبون في المؤتمر لصياغة قوانين جديدة." },
  { word: "anachronism", translation: "خطأ زمني", partOfSpeech: "noun", difficulty: "hard", example: "A clock in the medieval scene was an obvious anachronism.", exampleTranslation: "كان الساعة في المشهد القروسطي خطأً زمنياً واضحاً." },
  { word: "juxtaposition", translation: "تقابل", partOfSpeech: "noun", difficulty: "hard", example: "The juxtaposition of silence and thunder shocked readers.", exampleTranslation: "صدم تقابل الصمت والرعد القراء." },
  { word: "allegory", translation: "رمزية", partOfSpeech: "noun", difficulty: "hard", example: "The allegory used animals to teach a lesson about courage.", exampleTranslation: "استخدمت الرمزية الحيوانات لتعليم درس عن الشجاعة." },
  { word: "symbolism", translation: "رمزية أدبية", partOfSpeech: "noun", difficulty: "hard", example: "Symbolism in the story turned the river into hope.", exampleTranslation: "حوّلت الرمزية الأدبية في القصة النهر إلى رمز للأمل." },
  { word: "motif", translation: "فكرة متكررة", partOfSpeech: "noun", difficulty: "hard", example: "The motif of light appears in every chapter.", exampleTranslation: "تظهر فكرة الضوء المتكررة في كل فصل." },
  { word: "archetype", translation: "نموذج أصلي", partOfSpeech: "noun", difficulty: "hard", example: "The wise mentor is a common archetype in adventure tales.", exampleTranslation: "المرشد الحكيم نموذج أصلي شائع في قصص المغامرات." },
  { word: "omniscient", translation: "عليم", partOfSpeech: "adjective", difficulty: "hard", example: "An omniscient narrator knows every character's thoughts.", exampleTranslation: "يعرف الراوي العليم أفكار كل شخصية." },
  ...GRADE5_CHUNK_E,
  ...GRADE5_CHUNK_A,
  ...GRADE5_CHUNK_B,
  ...GRADE5_CHUNK_C,
  ...GRADE5_CHUNK_D,
];

function normWord(w) {
  return w.toLowerCase().trim();
}

function normExample(e) {
  return e.toLowerCase().trim().replace(/\s+/g, " ");
}

const G1_WORDS = new Set(GRADE1_CARDS.map((c) => normWord(c.word)));
const G1_EXAMPLES = new Set(GRADE1_CARDS.map((c) => normExample(c.example)));
const G2_WORDS = new Set(GRADE2_CARDS.map((c) => normWord(c.word)));
const G2_EXAMPLES = new Set(GRADE2_CARDS.map((c) => normExample(c.example)));
const G3_WORDS = new Set(GRADE3_CARDS.map((c) => normWord(c.word)));
const G3_EXAMPLES = new Set(GRADE3_CARDS.map((c) => normExample(c.example)));
const G4_WORDS = new Set(GRADE4_CARDS.map((c) => normWord(c.word)));
const G4_EXAMPLES = new Set(GRADE4_CARDS.map((c) => normExample(c.example)));

function validateGrade5Cards(cards) {
  const seenWords = new Set();
  const seenExamples = new Set();
  const errors = [];

  for (const c of cards) {
    const w = normWord(c.word);
    const ex = normExample(c.example);

    if (seenWords.has(w)) errors.push(`duplicate word in grade 5: "${c.word}"`);
    if (seenExamples.has(ex)) errors.push(`duplicate example in grade 5: "${c.example}"`);
    if (G1_WORDS.has(w)) errors.push(`word overlaps grade 1: "${c.word}"`);
    if (G2_WORDS.has(w)) errors.push(`word overlaps grade 2: "${c.word}"`);
    if (G3_WORDS.has(w)) errors.push(`word overlaps grade 3: "${c.word}"`);
    if (G4_WORDS.has(w)) errors.push(`word overlaps grade 4: "${c.word}"`);
    if (G1_EXAMPLES.has(ex)) errors.push(`example overlaps grade 1: "${c.example}"`);
    if (G2_EXAMPLES.has(ex)) errors.push(`example overlaps grade 2: "${c.example}"`);
    if (G3_EXAMPLES.has(ex)) errors.push(`example overlaps grade 3: "${c.example}"`);
    if (G4_EXAMPLES.has(ex)) errors.push(`example overlaps grade 4: "${c.example}"`);

    seenWords.add(w);
    seenExamples.add(ex);
  }

  if (errors.length) {
    throw new Error(`grade5-cards validation failed:\n${errors.join("\n")}`);
  }
}

/** One card per English word (first occurrence wins). */
export const GRADE5_CARDS = (() => {
  const seen = new Set();
  const out = [];
  for (const card of GRADE5_CARDS_RAW) {
    const key = normWord(card.word);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(card);
  }
  if (out.length !== GRADE5_CARDS_RAW.length) {
    const dupCount = GRADE5_CARDS_RAW.length - out.length;
    console.warn(`grade5-cards: dropped ${dupCount} duplicate word(s).`);
  }
  validateGrade5Cards(out);
  return out;
})();

export function batchWords(batchNum) {
  const start = (batchNum - 1) * 10;
  return GRADE5_CARDS.slice(start, start + 10).map((c) => c.word);
}
