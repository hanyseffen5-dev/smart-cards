/** Grade 6 extension word bank — elementary vocabulary (1883 single words). */

function parse(tsv) {
  return tsv
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [word, translation, partOfSpeech, difficulty] = l.split("\t");
      return [word, translation, partOfSpeech, difficulty];
    });
}

export const GRADE6_EXTENSION_BANK = parse(`
assess	يقيّم	verb	medium
evaluate	يقيّم	verb	medium
demonstrate	يبيّن	verb	medium
illustrate	يوضّح بالرسم	verb	medium
summarize	يلخّص	verb	medium
conclude	يستنتج	verb	medium
predict	يتنبّأ	verb	medium
classify	يصنّف	verb	medium
compare	يقارن	verb	medium
contrast	يقابل	verb	medium
interpret	يفسّر	verb	medium
organize	ينظّم	verb	medium
identify	يحدّد هوية	verb	medium
describe	يصف	verb	easy
explain	يشرح	verb	easy
calculate	يحسب	verb	medium
estimate	يقدّر	verb	medium
measure	يقيس	verb	easy
examine	يفحص	verb	medium
explore	يستكشف	verb	medium
discover	يكتشف	verb	easy
propose	يقترح	verb	medium
suggest	يقترح	verb	easy
recommend	يوصي	verb	medium
justify	يبرّر	verb	hard
argue	يجادل	verb	medium
persuade	يقنع	verb	hard
convince	يُقنع	verb	medium
emphasize	يؤكّد	verb	hard
indicate	يشير إلى	verb	medium
reveal	يكشف	verb	medium
determine	يقرّر	verb	hard
distinguish	يميّز	verb	hard
recognize	يتعرّف على	verb	medium
acknowledge	يعترف بـ	verb	hard
assume	يفترض	verb	hard
imply	يلمّح	verb	hard
infer	يستدلّ	verb	hard
obtain	يحصل على	verb	medium
acquire	يكتسب	verb	hard
achieve	يحقّق	verb	medium
accomplish	ينجز	verb	medium
perform	يؤدّي	verb	medium
implement	ينفّذ	verb	hard
apply	يطبّق	verb	easy
utilize	يستخدم	verb	hard
operate	يشغّل	verb	medium
contribute	يساهم	verb	hard
engage	ينخرط	verb	hard
involve	يتضمّن	verb	medium
include	يشمل	verb	easy
exclude	يستبعد	verb	hard
combine	يدمج	verb	medium
integrate	يدمج	verb	hard
separate	يفصل	verb	medium
distribute	يوزّع	verb	hard
assign	يكلّف	verb	medium
select	يختار	verb	easy
decide	يقرّر	verb	easy
resolve	يحلّ	verb	hard
negotiate	يتفاوض	verb	hard
clarify	يوضّح	verb	hard
modify	يعدّل	verb	hard
adapt	يتكيّف	verb	medium
revise	يراجع	verb	medium
edit	يحرّر	verb	medium
compose	يؤلّف	verb	hard
narrate	يروي	verb	hard
cite	يستشهد بـ	verb	hard
paraphrase	يعيد الصياغة	verb	hard
translate	يترجم	verb	medium
memorize	يحفظ	verb	medium
comprehend	يستوعب	verb	hard
outline	مخطط	noun	medium
research	بحث	noun	medium
paragraph	فقرة	noun	easy
sentence	جملة	noun	easy
phrase	عبارة	noun	medium
clause	جملة فرعية	noun	hard
synonym	مرادف	noun	medium
antonym	ضدّ	noun	medium
prefix	بادئة	noun	medium
suffix	لاحقة	noun	medium
syllable	مقطع لفظي	noun	medium
vocabulary	مفردات	noun	medium
grammar	قواعد	noun	medium
punctuation	علامات الترقيم	noun	hard
narrative	سرد	noun	hard
character	شخصية	noun	easy
setting	مكان وزمان الأحداث	noun	medium
plot	حبكة	noun	medium
theme	موضوع	noun	medium
author	مؤلّف	noun	easy
audience	جمهور	noun	medium
fiction	خيال	noun	medium
biography	سيرة ذاتية	noun	hard
metaphor	استعارة	noun	hard
simile	تشبيه	noun	hard
summary	ملخّص	noun	medium
introduction	مقدّمة	noun	medium
dialogue	حوار	noun	medium
quotation	اقتباس	noun	hard
vowel	حرف علّة	noun	medium
consonant	حرف ساكن	noun	medium
passage	مقطع نصّي	noun	medium
context	سياق	noun	hard
definition	تعريف	noun	medium
glossary	مسرد	noun	hard
index	فهرس	noun	medium
caption	تعليق توضيحي	noun	medium
headline	عنوان رئيسي	noun	medium
article	مقال	noun	easy
essay	مقالة	noun	medium
novel	رواية	noun	medium
chapter	فصل	noun	easy
rhyme	قافية	noun	medium
rhythm	إيقاع	noun	hard
stanza	مقطع شعري	noun	hard
descriptive	وصفي	adjective	hard
persuasive	إقناعي	adjective	hard
literal	حرفي	adjective	hard
figurative	مجازي	adjective	hard
formal	رسمي	adjective	medium
informal	غير رسمي	adjective	medium
review	مراجعة	noun	medium
draft	مسودّة	noun	medium
topic	موضوع	noun	easy
purpose	غرض	noun	medium
evidence	دليل	noun	hard
conclusion	خاتمة	noun	medium
opinion	رأي	noun	easy
detail	تفصيل	noun	easy
fluent	طليق	adjective	hard
accurate	دقيق	adjective	medium
relevant	ذو صلة	adjective	hard
concise	موجز	adjective	hard
logical	منطقي	adjective	hard
respond	يستجيب	verb	medium
express	يعبّر	verb	medium
discuss	يناقش	verb	medium
debate	مناظرة	noun	hard
respect	احترام	noun	easy
instruct	يُرشد	verb	medium
inform	يُعلم	verb	medium
announce	يُعلن	verb	medium
respondent	مجيب	noun	hard
request	يطلب	verb	medium
confirm	يؤكّد	verb	medium
remind	يذكّر	verb	easy
encourage	يشجّع	verb	medium
praise	يمدح	verb	medium
criticize	ينتقد	verb	hard
responsible	مسؤول	adjective	medium
creative	مبدع	adjective	medium
curious	فضولي	adjective	medium
confident	واثق	adjective	medium
elaborate	يُفصّل	verb	hard
coherent	متماسك	adjective	hard
comprehensive	شامل	adjective	hard
objective	موضوعي	noun	hard
organism	كائن حي	noun	medium
ecosystem	نظام بيئي	noun	hard
environment	بيئة	noun	medium
atmosphere	غلاف جوي	noun	hard
climate	مناخ	noun	medium
energy	طاقة	noun	easy
force	قوة	noun	medium
motion	حركة	noun	medium
gravity	جاذبية	noun	hard
friction	احتكاك	noun	hard
molecule	جزيء	noun	hard
atom	ذرّة	noun	hard
element	عنصر	noun	medium
compound	مركّب	noun	hard
mixture	خليط	noun	medium
solution	محلول	noun	medium
reaction	تفاعل	noun	hard
experiment	تجربة	noun	medium
hypothesis	فرضية	noun	hard
observation	ملاحظة	noun	medium
theory	نظرية	noun	hard
cell	خلية	noun	medium
tissue	نسيج	noun	hard
species	نوع	noun	hard
population	تعداد	noun	medium
evolution	تطوّر	noun	hard
adaptation	تكيّف	noun	hard
predator	مفترس	noun	medium
prey	فريسة	noun	medium
nutrient	مغذٍّ	noun	hard
photosynthesis	تركيب ضوئي	noun	hard
respiration	تنفّس	noun	hard
digestion	هضم	noun	hard
skeleton	هيكل عظمي	noun	medium
muscle	عضلة	noun	medium
organ	عضو	noun	medium
nerve	عصب	noun	hard
bacteria	بكتيريا	noun	hard
fungus	فطر	noun	hard
mineral	معدن	noun	medium
particle	جسيم	noun	hard
vapor	بخار	noun	hard
evaporate	يتبخّر	verb	hard
condense	يتكثّف	verb	hard
temperature	درجة حرارة	noun	medium
pressure	ضغط	noun	hard
volume	حجم	noun	medium
density	كثافة	noun	hard
mass	كتلة	noun	medium
magnet	مغناطيس	noun	medium
circuit	دائرة كهربائية	noun	hard
current	تيار	noun	medium
conductor	موصِل	noun	hard
insulator	عازل	noun	hard
orbit	مدار	noun	medium
planet	كوكب	noun	easy
galaxy	مجرّة	noun	hard
comet	مذنّب	noun	hard
satellite	قمر صناعي	noun	hard
telescope	تلسكوب	noun	medium
microscope	مجهر	noun	medium
specimen	عيّنة	noun	hard
fossil	أحفورة	noun	medium
volcano	بركان	noun	medium
earthquake	زلزال	noun	medium
erosion	تعرية	noun	hard
mineralize	يتمعدن	verb	hard
magma	صهارة	noun	hard
glacier	نهر جليدي	noun	hard
median	وسيط	noun	hard
fraction	كسر	noun	medium
decimal	عدد عشري	noun	medium
percentage	نسبة مئوية	noun	medium
ratio	نسبة	noun	hard
proportion	تناسب	noun	hard
equation	معادلة	noun	hard
variable	متغيّر	noun	hard
formula	صيغة	noun	hard
perimeter	محيط	noun	medium
area	مساحة	noun	medium
diameter	قطر	noun	hard
radius	نصف قطر	noun	hard
average	متوسّط	noun	medium
graph	رسم بياني	noun	medium
multiply	يضرب	verb	easy
divide	يقسم	verb	easy
product	حاصل ضرب	noun	medium
quotient	حاصل قسمة	noun	hard
remainder	باقي	noun	hard
factor	عامل	noun	hard
multiple	مضاعف	noun	hard
integer	عدد صحيح	noun	hard
estimation	تقدير	noun	medium
angle	زاوية	noun	medium
vertical	عمودي	adjective	medium
horizontal	أفقي	adjective	medium
parallel	متوازٍ	adjective	hard
symmetry	تماثل	noun	hard
pattern	نمط	noun	medium
sequence	متتالية	noun	hard
approximate	تقريبي	adjective	hard
quantity	كمية	noun	medium
react	يتفاعل	verb	medium
absorb	يمتصّ	verb	medium
dissolve	يذوب	verb	medium
freeze	يتجمّد	verb	easy
melt	يذوب	verb	easy
expand	يتمدّد	verb	hard
contract	ينكمش	verb	hard
vibrate	يهتزّ	verb	hard
radiate	يشعّ	verb	hard
transparent	شفّاف	adjective	hard
opaque	معتم	adjective	hard
flexible	مرن	adjective	medium
solid	صلب	noun	easy
liquid	سائل	noun	easy
gas	غاز	noun	easy
oxygen	أكسجين	noun	medium
carbon	كربون	noun	medium
hydrogen	هيدروجين	noun	hard
nitrogen	نيتروجين	noun	hard
acid	حمض	noun	medium
base	قاعدة (كيمياء)	noun	hard
gene	جين	noun	hard
trait	صفة	noun	hard
inherit	يرث	verb	hard
circulate	يدور	verb	hard
function	وظيفة	noun	medium
system	نظام	noun	medium
process	عملية	noun	medium
cycle	دورة	noun	medium
renewable	متجدّد	adjective	hard
pollution	تلوّث	noun	medium
recycle	يعيد التدوير	verb	medium
conserve	يحافظ على	verb	hard
extinct	منقرض	adjective	hard
endangered	مهدّد بالانقراض	adjective	hard
migrate	يهاجر	verb	hard
hibernate	يسبت	verb	hard
germinate	ينبت	verb	hard
pollinate	يلقّح	verb	hard
thermometer	ميزان حرارة	noun	medium
laboratory	مختبر	noun	medium
apparatus	جهاز	noun	hard
procedure	إجراء	noun	hard
measurement	قياس	noun	medium
result	نتيجة	noun	easy
eclipse	كسوف	noun	hard
magnetic	مغناطيسي	adjective	hard
electric	كهربائي	adjective	medium
solar	شمسي	adjective	medium
lunar	قمري	adjective	hard
chemical	كيميائي	adjective	medium
physical	فيزيائي	adjective	medium
substance	مادة	noun	medium
velocity	سرعة متجهة	noun	hard
acceleration	تسارع	noun	hard
momentum	زخم	noun	hard
frequency	تردّد	noun	hard
wavelength	طول موجي	noun	hard
society	مجتمع	noun	medium
culture	ثقافة	noun	medium
tradition	تقليد	noun	medium
civilization	حضارة	noun	hard
government	حكومة	noun	medium
democracy	ديمقراطية	noun	hard
citizen	مواطن	noun	medium
community	مجتمع محلي	noun	medium
economy	اقتصاد	noun	hard
trade	تجارة	noun	medium
industry	صناعة	noun	medium
agriculture	زراعة	noun	hard
geography	جغرافيا	noun	medium
region	إقليم	noun	medium
continent	قارة	noun	medium
nation	أمة	noun	medium
border	حدود	noun	medium
migration	هجرة	noun	hard
history	تاريخ	noun	easy
ancestor	سلف	noun	hard
heritage	تراث	noun	hard
monument	نصب تذكاري	noun	hard
empire	إمبراطورية	noun	hard
conflict	صراع	noun	hard
treaty	معاهدة	noun	hard
revolution	ثورة	noun	hard
independence	استقلال	noun	hard
freedom	حرية	noun	medium
justice	عدالة	noun	hard
equality	مساواة	noun	hard
rights	حقوق	noun	medium
responsibility	مسؤولية	noun	medium
law	قانون	noun	easy
policy	سياسة	noun	hard
election	انتخاب	noun	hard
vote	يصوّت	verb	easy
leader	قائد	noun	easy
representative	ممثّل	noun	hard
council	مجلس	noun	hard
constitution	دستور	noun	hard
ambassador	سفير	noun	hard
diplomat	دبلوماسي	noun	hard
settlement	مستوطنة	noun	hard
exploration	استكشاف	noun	hard
colony	مستعمرة	noun	hard
boundary	حدّ	noun	hard
territory	إقليم	noun	hard
capital	عاصمة	noun	medium
rural	ريفي	adjective	hard
urban	حضري	adjective	hard
census	تعداد سكاني	noun	hard
resource	مورد	noun	medium
import	يستورد	verb	hard
export	يصدّر	verb	hard
currency	عملة	noun	hard
budget	ميزانية	noun	hard
income	دخل	noun	hard
profit	ربح	noun	medium
demand	طلب	noun	medium
supply	عرض	noun	medium
transport	نقل	noun	medium
communication	تواصل	noun	hard
technology	تقنية	noun	medium
ancient	قديم	adjective	medium
modern	حديث	adjective	easy
complex	معقّد	adjective	hard
crucial	حاسم	adjective	hard
delicate	رقيق	adjective	hard
distinct	متميّز	adjective	hard
diverse	متنوّع	adjective	hard
enormous	هائل	adjective	medium
essential	أساسي	adjective	hard
fragile	هشّ	adjective	hard
frequent	متكرّر	adjective	hard
generous	كريم	adjective	medium
genuine	أصيل	adjective	hard
gradual	تدريجي	adjective	hard
immense	ضخم	adjective	hard
intense	شديد	adjective	hard
obvious	واضح	adjective	medium
permanent	دائم	adjective	hard
precious	ثمين	adjective	medium
rapid	سريع	adjective	medium
rare	نادر	adjective	medium
reliable	موثوق	adjective	hard
remote	نائٍ	adjective	hard
severe	قاسٍ	adjective	hard
sincere	صادق	adjective	hard
smooth	أملس	adjective	easy
sturdy	متين	adjective	hard
subtle	خفيّ	adjective	hard
sufficient	كافٍ	adjective	hard
superior	متفوّق	adjective	hard
temporary	مؤقّت	adjective	hard
thorough	شامل	adjective	hard
typical	نموذجي	adjective	hard
ultimate	نهائي	adjective	hard
unique	فريد	adjective	medium
urgent	عاجل	adjective	medium
valuable	قيّم	adjective	medium
various	متنوّع	adjective	medium
vast	شاسع	adjective	hard
vital	حيوي	adjective	hard
vivid	زاهٍ	adjective	hard
weary	متعب	adjective	hard
ambitious	طموح	adjective	hard
anxious	قلق	adjective	hard
cautious	حذِر	adjective	hard
courageous	شجاع	adjective	hard
humble	متواضع	adjective	medium
patient	صبور	adjective	medium
polite	مهذّب	adjective	easy
honest	أمين	adjective	easy
loyal	وفيّ	adjective	medium
diligent	مجتهد	adjective	hard
cheerful	مرِح	adjective	medium
grateful	ممتنّ	adjective	medium
determined	عازم	adjective	hard
independent	مستقلّ	adjective	hard
cooperative	متعاون	adjective	hard
considerate	مراعٍ	adjective	hard
optimistic	متفائل	adjective	hard
pessimistic	متشائم	adjective	hard
achievement	إنجاز	noun	medium
ability	قدرة	noun	medium
attitude	موقف	noun	hard
behavior	سلوك	noun	medium
decision	قرار	noun	medium
effort	جهد	noun	medium
goal	هدف	noun	easy
habit	عادة	noun	medium
method	طريقة	noun	medium
obstacle	عقبة	noun	hard
opportunity	فرصة	noun	hard
progress	تقدّم	noun	medium
approach	نهج	noun	hard
strategy	استراتيجية	noun	hard
success	نجاح	noun	easy
talent	موهبة	noun	medium
value	قيمة	noun	medium
wisdom	حكمة	noun	hard
ceremony	حفل	noun	hard
festival	مهرجان	noun	medium
religion	دين	noun	medium
language	لغة	noun	easy
custom	عُرف	noun	hard
generation	جيل	noun	hard
neighborhood	حيّ	noun	medium
volunteer	متطوّع	noun	medium
charity	صدقة	noun	medium
cooperation	تعاون	noun	hard
tolerance	تسامح	noun	hard
harmony	انسجام	noun	hard
prosperity	ازدهار	noun	hard
stability	استقرار	noun	hard
abandon	يتخلّى عن	verb	hard
accompany	يرافق	verb	hard
accumulate	يتراكم	verb	hard
admire	يُعجب بـ	verb	medium
advance	يتقدّم	verb	medium
advise	ينصح	verb	medium
alert	ينبّه	verb	medium
alter	يغيّر	verb	hard
amuse	يسلّي	verb	medium
anticipate	يتوقّع	verb	hard
appoint	يعيّن	verb	hard
approve	يوافق	verb	medium
arrange	يرتّب	verb	medium
assemble	يجمّع	verb	hard
assist	يساعد	verb	medium
attach	يرفق	verb	medium
attempt	يحاول	verb	medium
attend	يحضر	verb	easy
attract	يجذب	verb	medium
avoid	يتجنّب	verb	medium
behave	يتصرّف	verb	medium
belong	ينتمي	verb	medium
blend	يمزج	verb	medium
borrow	يستعير	verb	easy
bounce	يرتدّ	verb	medium
cancel	يلغي	verb	medium
capture	يلتقط	verb	hard
celebrate	يحتفل	verb	medium
chase	يطارد	verb	medium
claim	يدّعي	verb	hard
collect	يجمع	verb	easy
command	يأمر	verb	hard
compete	يتنافس	verb	medium
complain	يشتكي	verb	medium
complete	يكمل	verb	easy
concentrate	يركّز	verb	hard
connect	يربط	verb	medium
consider	يأخذ في الاعتبار	verb	hard
consult	يستشير	verb	hard
consume	يستهلك	verb	hard
contain	يحتوي	verb	medium
convert	يحوّل	verb	hard
correct	يصحّح	verb	easy
decorate	يزيّن	verb	medium
defend	يدافع	verb	medium
delay	يؤخّر	verb	medium
deliver	يوصّل	verb	medium
deny	ينكر	verb	hard
depend	يعتمد	verb	medium
deserve	يستحقّ	verb	hard
design	يصمّم	verb	medium
destroy	يدمّر	verb	medium
detect	يكتشف	verb	hard
devote	يكرّس	verb	hard
direct	يوجّه	verb	medium
disagree	يختلف	verb	medium
display	يعرض	verb	medium
donate	يتبرّع	verb	hard
doubt	يشكّ	verb	hard
earn	يكسب	verb	easy
educate	يثقّف	verb	hard
embrace	يحتضن	verb	hard
enable	يمكّن	verb	hard
endure	يتحمّل	verb	hard
entertain	يسلّي	verb	medium
escape	يهرب	verb	medium
exchange	يتبادل	verb	medium
exist	يوجد	verb	hard
expect	يتوقّع	verb	medium
explode	ينفجر	verb	hard
extend	يمدّد	verb	hard
fasten	يثبّت	verb	medium
float	يطفو	verb	easy
flow	يتدفّق	verb	medium
fold	يطوي	verb	easy
forgive	يسامح	verb	hard
gather	يجتمع	verb	medium
glance	يلقي نظرة	verb	hard
grip	يمسك بإحكام	verb	hard
greet	يحيّي	verb	medium
guard	يحرس	verb	medium
guide	يرشد	verb	medium
handle	يتعامل مع	verb	medium
heal	يشفي	verb	medium
hesitate	يتردّد	verb	hard
hunt	يصطاد	verb	medium
ignore	يتجاهل	verb	medium
imitate	يقلّد	verb	hard
impress	يثير الإعجاب	verb	hard
improve	يحسّن	verb	medium
increase	يزيد	verb	medium
influence	يؤثّر	verb	hard
inspect	يفتّش	verb	hard
inspire	يلهم	verb	hard
install	يثبّت	verb	hard
intend	ينوي	verb	hard
interrupt	يقاطع	verb	hard
introduce	يقدّم	verb	medium
invent	يخترع	verb	medium
invest	يستثمر	verb	hard
invite	يدعو	verb	easy
judge	يحكم	verb	medium
launch	يطلق	verb	hard
lean	يميل	verb	medium
lend	يُقرض	verb	medium
lift	يرفع	verb	easy
link	يربط	verb	medium
locate	يحدّد موقع	verb	hard
manage	يدير	verb	medium
manufacture	يصنّع	verb	hard
mention	يذكر	verb	medium
obey	يطيع	verb	medium
occupy	يشغل	verb	hard
occur	يحدث	verb	hard
offer	يعرض	verb	easy
oppose	يعارض	verb	hard
overcome	يتغلّب على	verb	hard
pack	يحزم	verb	easy
pause	يتوقّف مؤقتاً	verb	medium
perceive	يدرك	verb	hard
persist	يثابر	verb	hard
plant	يزرع	verb	easy
pour	يصبّ	verb	easy
prepare	يحضّر	verb	easy
preserve	يحفظ	verb	hard
pretend	يتظاهر	verb	medium
prevent	يمنع	verb	medium
produce	ينتج	verb	medium
promise	يعد	verb	easy
promote	يعزّز	verb	hard
pronounce	ينطق	verb	medium
protect	يحمي	verb	easy
prove	يثبت	verb	medium
provide	يوفّر	verb	medium
publish	ينشر	verb	hard
purchase	يشتري	verb	hard
pursue	يسعى وراء	verb	hard
qualify	يتأهّل	verb	hard
realize	يدرك	verb	medium
receive	يستلم	verb	easy
reduce	يقلّل	verb	medium
refuse	يرفض	verb	medium
rely	يعتمد على	verb	hard
remove	يزيل	verb	medium
repair	يصلح	verb	medium
replace	يستبدل	verb	medium
represent	يمثّل	verb	hard
require	يتطلّب	verb	hard
rescue	ينقذ	verb	medium
resist	يقاوم	verb	hard
reward	يكافئ	verb	medium
satisfy	يُرضي	verb	hard
search	يبحث	verb	easy
settle	يستقرّ	verb	hard
solve	يحلّ	verb	easy
support	يدعم	verb	medium
survive	ينجو	verb	medium
succeed	ينجح	verb	medium
struggle	يكافح	verb	hard
stretch	يمدّ	verb	medium
transform	يحوّل	verb	hard
twist	يلوي	verb	medium
breeze	نسيم	noun	medium
drought	جفاف	noun	hard
flood	فيضان	noun	medium
frost	صقيع	noun	hard
humidity	رطوبة	noun	hard
hurricane	إعصار	noun	hard
lightning	برق	noun	medium
thunder	رعد	noun	medium
tornado	زوبعة	noun	hard
blizzard	عاصفة ثلجية	noun	hard
mist	ضباب خفيف	noun	medium
fog	ضباب	noun	easy
rainbow	قوس قزح	noun	easy
canyon	وادٍ سحيق	noun	hard
cliff	منحدر صخري	noun	medium
coast	ساحل	noun	medium
dune	كثيب رملي	noun	hard
harbor	ميناء	noun	medium
island	جزيرة	noun	easy
lake	بحيرة	noun	easy
meadow	مرج	noun	hard
mountain	جبل	noun	easy
ocean	محيط	noun	easy
peninsula	شبه جزيرة	noun	hard
plateau	هضبة	noun	hard
reef	شعاب مرجانية	noun	hard
ridge	حافة جبلية	noun	hard
shore	شاطئ	noun	medium
slope	منحدر	noun	medium
stream	جدول	noun	medium
summit	قمة	noun	hard
swamp	مستنقع	noun	hard
valley	وادٍ	noun	easy
waterfall	شلّال	noun	medium
desert	صحراء	noun	easy
river	نهر	noun	easy
amphibian	برمائي	noun	hard
reptile	زاحف	noun	hard
mammal	ثديي	noun	hard
camel	جمل	noun	easy
dolphin	دلفين	noun	medium
eagle	نسر	noun	medium
giraffe	زرافة	noun	easy
leopard	فهد	noun	medium
kangaroo	كنغر	noun	medium
penguin	بطريق	noun	medium
octopus	أخطبوط	noun	medium
scorpion	عقرب	noun	hard
tortoise	سلحفاة برّية	noun	hard
sparrow	عصفور دوري	noun	medium
squirrel	سنجاب	noun	medium
butterfly	فراشة	noun	easy
wolf	ذئب	noun	medium
zebra	حمار وحشي	noun	easy
crocodile	تمساح	noun	medium
bone	عظمة	noun	easy
brain	دماغ	noun	medium
lung	رئة	noun	medium
vein	وريد	noun	hard
artery	شريان	noun	hard
joint	مفصل	noun	medium
spine	عمود فقري	noun	hard
throat	حلق	noun	medium
tongue	لسان	noun	medium
shoulder	كتف	noun	easy
elbow	مرفق	noun	medium
wrist	معصم	noun	medium
ankle	كاحل	noun	medium
pulse	نبض	noun	hard
allergy	حساسية	noun	hard
bandage	ضمادة	noun	medium
clinic	عيادة	noun	medium
diet	نظام غذائي	noun	medium
disease	مرض	noun	medium
fever	حمّى	noun	medium
germ	جرثومة	noun	medium
hygiene	نظافة	noun	hard
infection	عدوى	noun	hard
injury	إصابة	noun	medium
medicine	دواء	noun	easy
nutrition	تغذية	noun	hard
remedy	علاج	noun	hard
symptom	عَرَض	noun	hard
treatment	معالجة	noun	hard
vaccine	لقاح	noun	hard
vitamin	فيتامين	noun	medium
fitness	لياقة	noun	medium
posture	وضعية الجسم	noun	hard
recovery	تعافٍ	noun	hard
harvest	حصاد	noun	medium
orchard	بستان	noun	hard
vegetable	خضار	noun	easy
ingredient	مكوّن	noun	hard
recipe	وصفة	noun	medium
flour	دقيق	noun	medium
honey	عسل	noun	easy
spice	بهار	noun	medium
wheat	قمح	noun	medium
seed	بذرة	noun	easy
blossom	زهرة	noun	hard
sprout	برعم	noun	hard
soil	تربة	noun	easy
root	جذر	noun	easy
branch	غصن	noun	easy
trunk	جذع	noun	medium
forest	غابة	noun	easy
jungle	أدغال	noun	medium
prairie	سهول عشبية	noun	hard
wetland	أرض رطبة	noun	hard
tide	مدّ وجزر	noun	hard
wave	موجة	noun	easy
shadow	ظلّ	noun	easy
sunlight	ضوء الشمس	noun	medium
moisture	رطوبة	noun	hard
drizzle	رذاذ	noun	hard
hail	بَرَد	noun	hard
lizard	سحلية	noun	medium
seal	فقمة	noun	medium
shark	قرش	noun	medium
whale	حوت	noun	easy
antelope	ظبي	noun	hard
beaver	قندس	noun	hard
cheetah	فهد صيّاد	noun	medium
falcon	صقر	noun	medium
gazelle	غزال	noun	medium
hedgehog	قنفذ	noun	hard
ostrich	نعامة	noun	medium
swan	بجعة	noun	medium
vulture	نسر	noun	hard
skin	جلد	noun	easy
rib	ضلع	noun	hard
jaw	فكّ	noun	hard
heel	كعب	noun	medium
thumb	إبهام	noun	medium
chin	ذقن	noun	easy
eyebrow	حاجب	noun	medium
fatigue	إرهاق	noun	hard
pharmacy	صيدلية	noun	hard
dentist	طبيب أسنان	noun	medium
bruise	كدمة	noun	hard
therapy	علاج تأهيلي	noun	hard
almond	لوز	noun	medium
apricot	مشمش	noun	medium
cabbage	ملفوف	noun	medium
cucumber	خيار	noun	medium
ginger	زنجبيل	noun	hard
lentil	عدس	noun	hard
mango	مانجو	noun	easy
pepper	فلفل	noun	easy
pumpkin	يقطين	noun	medium
spinach	سبانخ	noun	medium
vinegar	خلّ	noun	hard
yogurt	زبادي	noun	medium
cereal	حبوب الإفطار	noun	medium
barley	شعير	noun	hard
coconut	جوز هند	noun	medium
peach	خوخ	noun	easy
herb	عُشب طبّي	noun	hard
nectar	رحيق	noun	hard
panther	فهد أسود	noun	hard
jaguar	يغور	noun	hard
walrus	فظّ	noun	hard
brave	شجاع	adjective	easy
calm	هادئ	adjective	easy
clever	ذكي	adjective	medium
eager	متحمّس	adjective	medium
gentle	لطيف	adjective	medium
fierce	شرس	adjective	hard
jealous	غيور	adjective	hard
joyful	مبتهج	adjective	medium
lonely	وحيد	adjective	medium
nervous	متوتّر	adjective	medium
peaceful	مسالم	adjective	medium
proud	فخور	adjective	easy
shy	خجول	adjective	easy
stubborn	عنيد	adjective	hard
thoughtful	مراعٍ	adjective	hard
bold	جريء	adjective	medium
brilliant	بارع	adjective	medium
capable	قادر	adjective	hard
content	راضٍ	adjective	hard
faithful	مخلص	adjective	hard
fearless	لا يخاف	adjective	hard
friendly	ودود	adjective	easy
hopeful	متفائل	adjective	medium
lively	نشيط	adjective	medium
modest	متواضع	adjective	hard
noble	نبيل	adjective	hard
pleasant	ممتع	adjective	medium
sensible	عاقل	adjective	hard
sociable	اجتماعي	adjective	hard
tidy	مرتّب	adjective	medium
witty	سريع البديهة	adjective	hard
courage	شجاعة	noun	medium
curiosity	فضول	noun	hard
delight	بهجة	noun	hard
despair	يأس	noun	hard
disappointment	خيبة أمل	noun	hard
emotion	عاطفة	noun	hard
envy	حسد	noun	hard
excitement	إثارة	noun	medium
fear	خوف	noun	easy
gratitude	امتنان	noun	hard
grief	حزن شديد	noun	hard
happiness	سعادة	noun	easy
hope	أمل	noun	easy
mood	مزاج	noun	medium
passion	شغف	noun	hard
pity	شفقة	noun	hard
pride	فخر	noun	medium
sorrow	أسى	noun	hard
sympathy	تعاطف	noun	hard
tension	توتّر	noun	hard
ambition	طموح	noun	hard
awareness	وعي	noun	hard
belief	اعتقاد	noun	hard
bravery	بسالة	noun	hard
choice	اختيار	noun	easy
concept	مفهوم	noun	hard
confidence	ثقة	noun	medium
conscience	ضمير	noun	hard
consequence	نتيجة	noun	hard
creativity	إبداع	noun	hard
discipline	انضباط	noun	hard
dream	حلم	noun	easy
duty	واجب	noun	medium
enthusiasm	حماس	noun	hard
fairness	إنصاف	noun	hard
faith	إيمان	noun	hard
focus	تركيز	noun	medium
fortune	حظّ	noun	hard
generosity	كرم	noun	hard
honor	شرف	noun	hard
humor	روح الدعابة	noun	hard
imagination	خيال	noun	hard
instinct	غريزة	noun	hard
intelligence	ذكاء	noun	hard
intention	نيّة	noun	hard
memory	ذاكرة	noun	medium
patience	صبر	noun	medium
peace	سلام	noun	easy
principle	مبدأ	noun	hard
reason	سبب	noun	easy
reputation	سمعة	noun	hard
sacrifice	تضحية	noun	hard
trust	ثقة	noun	medium
truth	حقيقة	noun	easy
virtue	فضيلة	noun	hard
spirit	روح	noun	medium
silence	صمت	noun	medium
melody	لحن	noun	hard
orchestra	أوركسترا	noun	hard
instrument	آلة موسيقية	noun	medium
chorus	جوقة	noun	hard
tune	نغمة	noun	medium
sculpture	منحوتة	noun	hard
portrait	صورة شخصية	noun	hard
canvas	قماش الرسم	noun	hard
gallery	صالة عرض	noun	medium
drama	دراما	noun	medium
theater	مسرح	noun	medium
costume	زيّ	noun	medium
pottery	فخّار	noun	hard
photography	تصوير	noun	hard
device	جهاز	noun	medium
gadget	أداة تقنية صغيرة	noun	hard
screen	شاشة	noun	easy
keyboard	لوحة مفاتيح	noun	medium
network	شبكة	noun	hard
software	برمجيات	noun	hard
program	برنامج	noun	medium
digital	رقمي	adjective	hard
signal	إشارة	noun	medium
sensor	مستشعر	noun	hard
robot	روبوت	noun	medium
engine	محرّك	noun	medium
machine	آلة	noun	easy
battery	بطارية	noun	medium
fuel	وقود	noun	medium
wheel	عجلة	noun	easy
gear	ترس	noun	hard
lever	رافعة	noun	hard
pulley	بكرة	noun	hard
antenna	هوائي	noun	hard
century	قرن	noun	medium
decade	عقد (عشر سنوات)	noun	hard
era	حقبة	noun	hard
moment	لحظة	noun	easy
period	فترة	noun	medium
season	فصل (من السنة)	noun	easy
calendar	تقويم	noun	medium
schedule	جدول زمني	noun	hard
deadline	موعد نهائي	noun	hard
future	مستقبل	noun	easy
dawn	فجر	noun	medium
dusk	غسق	noun	hard
twilight	شفق	noun	hard
midnight	منتصف الليل	noun	medium
instant	لحظة	noun	hard
elegant	أنيق	adjective	hard
graceful	رشيق	adjective	hard
gloomy	كئيب	adjective	hard
keen	حريص	adjective	hard
fair	عادل	adjective	easy
helpful	مفيد	adjective	easy
skill	مهارة	noun	medium
idea	فكرة	noun	easy
thought	فكر	noun	medium
mind	عقل	noun	easy
motivation	دافع	noun	hard
interest	اهتمام	noun	medium
liberty	حرية	noun	hard
mercy	رحمة	noun	hard
comfort	راحة	noun	medium
security	أمن	noun	hard
satisfaction	رضا	noun	hard
fate	قَدَر	noun	hard
notion	فكرة	noun	hard
dedication	تفانٍ	noun	hard
perception	إدراك	noun	hard
certainty	يقين	noun	hard
glory	مجد	noun	hard
triumph	انتصار	noun	hard
analysis	تحليل	noun	hard
assumption	افتراض	noun	hard
aspect	جانب	noun	hard
category	فئة	noun	medium
criterion	معيار	noun	hard
framework	إطار عمل	noun	hard
parameter	ضابط	noun	hard
correlation	ارتباط	noun	hard
derive	يشتقّ	verb	hard
outcome	نتيجة	noun	medium
insight	بصيرة	noun	hard
perspective	منظور	noun	hard
phenomenon	ظاهرة	noun	hard
precision	دقّة	noun	hard
probability	احتمال	noun	hard
trend	اتجاه	noun	medium
tendency	ميل	noun	hard
threshold	عتبة	noun	hard
scope	نطاق	noun	hard
segment	جزء	noun	hard
sample	عيّنة	noun	medium
survey	استبيان	noun	medium
statistic	إحصائية	noun	hard
diagram	رسم تخطيطي	noun	medium
data	بيانات	noun	medium
database	قاعدة بيانات	noun	hard
indicator	مؤشّر	noun	hard
input	مُدخَل	noun	hard
output	مُخرَج	noun	hard
overview	نظرة عامة	noun	hard
synopsis	موجز	noun	hard
metric	مقياس	noun	hard
evaluation	تقييم	noun	hard
assessment	تقدير	noun	hard
comparison	مقارنة	noun	medium
distinction	تمييز	noun	hard
implication	تبعة	noun	hard
inference	استنباط	noun	hard
interpretation	تفسير	noun	hard
limitation	قيد	noun	hard
mechanism	آلية	noun	hard
methodology	منهجية	noun	hard
phase	مرحلة	noun	medium
priority	أولوية	noun	medium
requirement	متطلّب	noun	hard
restriction	قيد	noun	hard
constraint	عائق	noun	hard
exception	استثناء	noun	hard
consistency	اتّساق	noun	hard
accuracy	دقّة	noun	hard
efficiency	كفاءة	noun	hard
alternative	بديل	noun	hard
component	مكوّن	noun	hard
determinant	محدِّد	noun	hard
variation	تباين	noun	hard
deviation	انحراف	noun	hard
distribution	توزيع	noun	hard
expansion	توسّع	noun	hard
projection	توقّع	noun	hard
prediction	تنبّؤ	noun	medium
rationale	مسوّغ	noun	hard
reference	مرجع	noun	medium
scenario	سيناريو	noun	hard
simulation	محاكاة	noun	hard
specification	مواصفة	noun	hard
verification	تحقّق	noun	hard
validation	إثبات الصحّة	noun	hard
refinement	تحسين	noun	hard
conversion	تحويل	noun	hard
classification	تصنيف	noun	hard
representation	تمثيل	noun	hard
documentation	توثيق	noun	hard
guideline	إرشاد	noun	hard
domain	مجال	noun	hard
module	وحدة	noun	hard
prototype	نموذج أوّلي	noun	hard
circumstance	ظرف	noun	hard
contradiction	تناقض	noun	hard
generalization	تعميم	noun	hard
emphasis	تشديد	noun	hard
resolution	حلّ	noun	hard
allocate	يخصّص	verb	hard
tally	إحصاء	noun	hard
monitor	يراقب	verb	hard
tabulate	يجدول	verb	hard
deduce	يستنتج	verb	hard
forecast	يتنبّأ	verb	hard
minimize	يقلّل إلى أدنى حدّ	verb	hard
maximize	يزيد إلى أقصى حدّ	verb	hard
optimize	يحسّن إلى الأمثل	verb	hard
specify	يحدّد	verb	hard
verify	يتحقّق	verb	hard
compute	يحوسب	verb	hard
categorize	يصنّف ضمن فئات	verb	hard
correlate	يربط	verb	hard
decode	يفكّ الشيفرة	verb	hard
probe	يستقصي	verb	hard
investment	استثمار	noun	hard
expense	نفقة	noun	medium
revenue	إيراد	noun	hard
transaction	معاملة	noun	hard
investor	مستثمِر	noun	hard
consumer	مستهلِك	noun	hard
producer	منتِج	noun	medium
manufacturer	مُصنِّع	noun	hard
wholesale	بيع بالجملة	noun	hard
retail	بيع بالتجزئة	noun	hard
inflation	تضخّم	noun	hard
tax	ضريبة	noun	medium
loan	قرض	noun	medium
fund	تمويل	noun	hard
asset	أصل	noun	hard
debt	دَين	noun	medium
salary	راتب	noun	medium
highlight	يبرز	verb	hard
scrutinize	يدقّق	verb	hard
appraise	يثمّن	verb	hard
premise	مقدّمة منطقية	noun	hard
theorem	نظرية رياضية	noun	hard
axiom	بديهية	noun	hard
paradigm	نموذج	noun	hard
thesis	أطروحة	noun	hard
excerpt	مقتطف	noun	hard
citation	اقتباس مرجعي	noun	hard
appendix	ملحق	noun	hard
bibliography	ثبت المراجع	noun	hard
manuscript	مخطوطة	noun	hard
syntax	نحو	noun	hard
dialect	لهجة	noun	hard
lexicon	معجم	noun	hard
terminology	مصطلحات	noun	hard
rhetoric	بلاغة	noun	hard
clarity	وضوح	noun	hard
ambiguity	غموض	noun	hard
nuance	فارق دقيق	noun	hard
paradox	مفارقة	noun	hard
fallacy	مغالطة	noun	hard
feasibility	جدوى	noun	hard
credibility	مصداقية	noun	hard
objectivity	موضوعية	noun	hard
reasoning	استدلال	noun	hard
intuition	حدس	noun	hard
comprehension	استيعاب	noun	hard
retention	احتفاظ	noun	hard
recall	استرجاع	noun	hard
curriculum	منهج دراسي	noun	hard
syllabus	مقرّر	noun	hard
seminar	ندوة	noun	hard
lecture	محاضرة	noun	medium
tutorial	درس تعليمي مصغّر	noun	hard
abstraction	تجريد	noun	hard
synthesis	تركيب	noun	hard
rubric	معيار تقويم	noun	hard
annotation	تعليق توضيحي	noun	hard
footnote	حاشية	noun	hard
transcript	نسخة مكتوبة	noun	hard
corollary	نتيجة لازمة	noun	hard
semantics	علم الدلالة	noun	hard
jargon	مصطلحات مهنية	noun	hard
eloquence	فصاحة	noun	hard
architect	مهندس معماري	noun	hard
astronaut	رائد فضاء	noun	medium
carpenter	نجّار	noun	medium
chemist	كيميائي	noun	medium
engineer	مهندس	noun	medium
scientist	عالِم	noun	easy
surgeon	جرّاح	noun	hard
pilot	طيّار	noun	medium
sailor	بحّار	noun	medium
mechanic	ميكانيكي	noun	medium
electrician	كهربائي	noun	hard
plumber	سبّاك	noun	hard
tailor	خيّاط	noun	medium
baker	خبّاز	noun	easy
butcher	جزّار	noun	medium
farmer	مزارع	noun	easy
gardener	بستاني	noun	medium
fisherman	صيّاد سمك	noun	medium
miner	عامل منجم	noun	hard
journalist	صحفي	noun	hard
lawyer	محامٍ	noun	medium
librarian	أمين مكتبة	noun	medium
musician	موسيقي	noun	medium
professor	أستاذ جامعي	noun	hard
detective	محقّق	noun	medium
merchant	تاجر	noun	hard
sculptor	نحّات	noun	hard
veterinarian	طبيب بيطري	noun	hard
geologist	جيولوجي	noun	hard
technician	فنّي	noun	hard
apprentice	متدرّب	noun	hard
airport	مطار	noun	easy
stadium	ملعب	noun	medium
museum	متحف	noun	easy
hospital	مستشفى	noun	easy
library	مكتبة	noun	easy
factory	مصنع	noun	medium
warehouse	مستودع	noun	hard
workshop	ورشة	noun	medium
palace	قصر	noun	medium
castle	قلعة	noun	easy
fortress	حصن	noun	hard
temple	معبد	noun	medium
tower	برج	noun	easy
bridge	جسر	noun	easy
tunnel	نفق	noun	medium
lighthouse	منارة	noun	hard
pyramid	هرم	noun	medium
cathedral	كاتدرائية	noun	hard
mosque	مسجد	noun	easy
barn	حظيرة	noun	medium
cottage	كوخ ريفي	noun	hard
cabin	مقصورة	noun	medium
apartment	شقّة	noun	easy
basement	قبو	noun	medium
corridor	ممرّ	noun	medium
courtyard	فناء	noun	hard
fountain	نافورة	noun	medium
garage	كراج	noun	easy
market	سوق	noun	easy
restaurant	مطعم	noun	easy
studio	استوديو	noun	medium
university	جامعة	noun	medium
aircraft	طائرة	noun	medium
helicopter	مروحية	noun	medium
submarine	غوّاصة	noun	medium
ambulance	سيارة إسعاف	noun	medium
bicycle	درّاجة هوائية	noun	easy
motorcycle	درّاجة نارية	noun	medium
tractor	جرّار	noun	medium
truck	شاحنة	noun	easy
canoe	زورق	noun	hard
ferry	عبّارة	noun	medium
yacht	يخت	noun	hard
vessel	سفينة	noun	hard
voyage	رحلة بحرية	noun	hard
wagon	عربة	noun	medium
parachute	مظلّة هبوط	noun	hard
subway	مترو الأنفاق	noun	medium
concrete	خرسانة	noun	hard
marble	رخام	noun	medium
copper	نحاس	noun	medium
steel	فولاذ	noun	medium
aluminum	ألومنيوم	noun	hard
bronze	برونز	noun	hard
ceramic	خزف	noun	hard
cotton	قطن	noun	easy
fabric	نسيج	noun	medium
fiber	ألياف	noun	hard
leather	جلد	noun	medium
silk	حرير	noun	medium
wool	صوف	noun	easy
plastic	بلاستيك	noun	easy
timber	أخشاب	noun	hard
granite	غرانيت	noun	hard
clay	صلصال	noun	easy
glass	زجاج	noun	easy
rubber	مطّاط	noun	easy
iron	حديد	noun	easy
village	قرية	noun	easy
suburb	ضاحية	noun	hard
downtown	وسط المدينة	noun	medium
outskirts	أطراف المدينة	noun	hard
neighbor	جار	noun	easy
resident	ساكن	noun	hard
passenger	راكب	noun	medium
pedestrian	مشاة	noun	hard
tourist	سائح	noun	medium
customer	زبون	noun	medium
highway	طريق سريع	noun	medium
avenue	جادّة	noun	hard
alley	زقاق	noun	medium
square	ساحة	noun	easy
landmark	معلم بارز	noun	hard
dock	رصيف بحري	noun	medium
pier	رصيف ممتدّ	noun	hard
runway	مدرّج	noun	hard
platform	رصيف القطار	noun	medium
station	محطة	noun	easy
intersection	تقاطع	noun	hard
sidewalk	رصيف المشاة	noun	medium
lane	حارة	noun	medium
route	مسار	noun	medium
trail	درب	noun	medium
elevator	مصعد	noun	medium
staircase	درج	noun	medium
balcony	شرفة	noun	medium
ceiling	سقف	noun	easy
chimney	مدخنة	noun	medium
pillar	عمود	noun	hard
arch	قوس	noun	medium
dome	قبّة	noun	medium
fence	سياج	noun	easy
gate	بوّابة	noun	easy
hall	قاعة	noun	easy
hammer	مطرقة	noun	easy
wrench	مفتاح ربط	noun	hard
drill	مثقاب	noun	medium
shovel	مجرفة	noun	medium
ladder	سلّم	noun	easy
nail	مسمار	noun	easy
screw	برغي	noun	medium
blade	نصل	noun	medium
axe	فأس	noun	medium
rope	حبل	noun	easy
chain	سلسلة	noun	easy
bucket	دلو	noun	easy
torch	مشعل	noun	medium
compass	بوصلة	noun	medium
wardrobe	خزانة ملابس	noun	medium
cupboard	خزانة	noun	medium
drawer	درج	noun	medium
carpet	سجّادة	noun	easy
curtain	ستارة	noun	easy
cushion	وسادة	noun	medium
lantern	فانوس	noun	medium
mattress	فراش	noun	medium
abundant	وفير	adjective	hard
adequate	كافٍ	adjective	hard
adjacent	مجاور	adjective	hard
artificial	اصطناعي	adjective	hard
automatic	تلقائي	adjective	medium
awkward	محرج	adjective	hard
appropriate	مناسب	adjective	hard
constant	ثابت	adjective	medium
continuous	متواصل	adjective	hard
dense	كثيف	adjective	hard
durable	متين	adjective	hard
dynamic	ديناميكي	adjective	hard
evident	جليّ	adjective	hard
exotic	غريب	adjective	hard
external	خارجي	adjective	hard
internal	داخلي	adjective	hard
fertile	خصب	adjective	hard
fundamental	أساسي	adjective	hard
gigantic	هائل	adjective	hard
hollow	أجوف	adjective	hard
identical	متطابق	adjective	hard
infinite	لا نهائي	adjective	hard
initial	أوّلي	adjective	hard
invisible	غير مرئي	adjective	medium
massive	ضخم	adjective	medium
mature	ناضج	adjective	hard
mobile	متنقّل	adjective	medium
moderate	معتدل	adjective	hard
mutual	متبادل	adjective	hard
numerous	عديد	adjective	hard
optimal	أمثل	adjective	hard
partial	جزئي	adjective	hard
peculiar	غريب	adjective	hard
portable	محمول	adjective	hard
potential	كامن	adjective	hard
practical	عملي	adjective	medium
precise	دقيق	adjective	hard
prominent	بارز	adjective	hard
prompt	سريع	adjective	hard
random	عشوائي	adjective	medium
remarkable	لافت	adjective	hard
rigid	صلب	adjective	hard
robust	قوي	adjective	hard
scarce	نادر	adjective	hard
sensitive	حسّاس	adjective	medium
sole	وحيد	adjective	hard
spacious	فسيح	adjective	hard
stable	مستقرّ	adjective	medium
steep	شديد الانحدار	adjective	medium
substantial	كبير	adjective	hard
sustainable	مستدام	adjective	hard
synthetic	صناعي	adjective	hard
systematic	منهجي	adjective	hard
tangible	ملموس	adjective	hard
theoretical	نظري	adjective	hard
tropical	استوائي	adjective	medium
uniform	موحّد	adjective	hard
universal	عالمي	adjective	hard
vacant	شاغر	adjective	hard
vague	غامض	adjective	hard
versatile	متعدّد الاستخدامات	adjective	hard
vigorous	قوي	adjective	hard
visible	مرئي	adjective	medium
accelerate	يسرّع	verb	hard
accommodate	يستوعب	verb	hard
activate	يفعّل	verb	hard
ascend	يصعد	verb	hard
descend	ينزل	verb	hard
aspire	يطمح	verb	hard
assert	يؤكّد بحزم	verb	hard
coincide	يتزامن	verb	hard
collapse	ينهار	verb	hard
comply	يمتثل	verb	hard
conceal	يخفي	verb	hard
confront	يواجه	verb	hard
conquer	يقهر	verb	hard
coordinate	ينسّق	verb	hard
dedicate	يكرّس	verb	hard
depict	يصوّر	verb	hard
diminish	يتناقص	verb	hard
dominate	يهيمن	verb	hard
eliminate	يزيل	verb	hard
emerge	يظهر	verb	hard
emit	يطلق	verb	hard
encounter	يصادف	verb	hard
endorse	يؤيّد	verb	hard
enforce	يطبّق	verb	hard
enhance	يعزّز	verb	hard
enrich	يُثري	verb	hard
ensure	يضمن	verb	hard
exceed	يتجاوز	verb	hard
exhibit	يعرض	verb	hard
facilitate	يسهّل	verb	hard
fascinate	يفتن	verb	hard
flourish	يزدهر	verb	hard
foster	يرعى	verb	hard
fulfill	يحقّق	verb	hard
grasp	يمسك	verb	hard
hinder	يعرقل	verb	hard
ignite	يشعل	verb	hard
illuminate	يضيء	verb	hard
impose	يفرض	verb	hard
induce	يحفّز	verb	hard
inhabit	يسكن	verb	hard
initiate	يبدأ	verb	hard
innovate	يبتكر	verb	hard
inquire	يستفسر	verb	hard
intervene	يتدخّل	verb	hard
isolate	يعزل	verb	hard
magnify	يكبّر	verb	hard
manipulate	يتلاعب	verb	hard
mediate	يتوسّط	verb	hard
merge	يدمج	verb	hard
motivate	يحفّز	verb	hard
nourish	يغذّي	verb	hard
obscure	يحجب	verb	hard
originate	ينشأ	verb	hard
overlap	يتداخل	verb	hard
overwhelm	يغمر	verb	hard
penetrate	يخترق	verb	hard
portray	يصوّر	verb	hard
postpone	يؤجّل	verb	hard
proceed	يتابع	verb	hard
prohibit	يمنع	verb	hard
prolong	يطيل	verb	hard
prosper	يزدهر	verb	hard
provoke	يستفزّ	verb	hard
reinforce	يعزّز	verb	hard
render	يجعل	verb	hard
replicate	يكرّر	verb	hard
resemble	يشبه	verb	hard
restore	يرمّم	verb	hard
retain	يحتفظ بـ	verb	hard
retrieve	يسترجع	verb	hard
simulate	يحاكي	verb	hard
specialize	يتخصّص	verb	hard
stimulate	يحفّز	verb	hard
strive	يجاهد	verb	hard
substitute	يستبدل	verb	hard
supervise	يشرف على	verb	hard
suppress	يكبت	verb	hard
sustain	يديم	verb	hard
terminate	ينهي	verb	hard
thrive	يزدهر	verb	hard
transmit	ينقل	verb	hard
undergo	يخضع لـ	verb	hard
undermine	يقوّض	verb	hard
unify	يوحّد	verb	hard
uphold	يدعم	verb	hard
withstand	يصمد أمام	verb	hard
diagnose	يشخّص	verb	hard
evolve	يتطوّر	verb	hard
exploit	يستغلّ	verb	hard
speculate	يتكهّن	verb	hard
yearn	يتوق	verb	hard
withhold	يحجب	verb	hard
testify	يشهد	verb	hard
traverse	يجتاز	verb	hard
summon	يستدعي	verb	hard
reconcile	يصالح	verb	hard
advocate	يناصر	verb	hard
abide	يلتزم	verb	medium
abnormal	غير طبيعي	adjective	medium
abrupt	مفاجئ	adjective	medium
absurd	سخيف	adjective	medium
acceptable	مقبول	adjective	hard
acclaim	تصفيق	noun	medium
accountable	مسؤول	adjective	hard
accuse	يتهم	verb	medium
acquit	يبرئ	verb	medium
addict	مدمن	noun	medium
adhere	يلتصق	verb	medium
adopt	يتبنى	verb	medium
adverse	معاكس	adjective	medium
affection	مودة	noun	medium
affirm	يؤكد	verb	medium
afford	يتحمل تكلفة	verb	medium
aggravate	يفاقم	verb	medium
aggregate	مجموع	noun	medium
aggressive	عدواني	adjective	hard
agile	رشيقة	adjective	medium
agitate	يضطرب	verb	medium
agreeable	موافق	adjective	hard
alibi	حجة غياب	noun	easy
alleviate	يخفف	verb	medium
allure	إغراء	noun	medium
amateur	هاوٍ	noun	medium
amend	يعدل	verb	medium
ample	واسع	adjective	medium
amplify	يضخم	verb	medium
anecdote	حكاية قصيرة	noun	medium
annoy	يزعج	verb	medium
antique	تحفة	noun	medium
appall	يُروع	verb	medium
apparel	ملابس	noun	medium
apparent	واضح	adjective	medium
appeal	يناشد	verb	medium
append	يُلحق	verb	medium
applaud	يصفق	verb	medium
apprehend	يقبض على	verb	medium
arbitrary	تعسفي	adjective	hard
ardent	متحمس	adjective	medium
arduous	شاق	adjective	medium
array	مجموعة	noun	easy
arrest	يعتقل	verb	medium
arrogant	متغطرس	adjective	medium
ascribe	يعزو	verb	medium
associate	يربط	verb	medium
assure	يطمئن	verb	medium
astonish	يدهش	verb	medium
asylum	لجوء	noun	medium
athletic	رياضي	adjective	medium
attain	يحقق	verb	medium
attire	ملابس	noun	medium
audacious	جريء	adjective	hard
audible	مسموع	adjective	medium
audit	يدقق	verb	medium
augment	يزيد	verb	medium
authentic	أصيل	adjective	hard
autograph	توقيع	noun	medium
automate	يؤتمت	verb	medium
autonomous	مستقل	adjective	hard
available	متاح	adjective	hard
averse	معارض	adjective	medium
avert	يتجنب	verb	medium
avid	شغوف	adjective	medium
award	جائزة	noun	easy
ban	يمنع	verb	medium
banish	ينفي	verb	medium
bankrupt	مفلس	adjective	medium
bar	يغلق	verb	medium
bare	عاري	adjective	medium
barren	قاحل	adjective	medium
barrier	حاجز	noun	medium
bashful	خجول	adjective	medium
basic	أساسي	adjective	medium
battle	معركة	noun	medium
beacon	منارة	noun	medium
bearing	اتجاه	noun	medium
beat	يهزم	verb	medium
behold	يرى	verb	medium
belittle	يقلل من شأن	verb	medium
belligerent	عدائي	adjective	hard
bellow	يزأر	verb	medium
benevolent	كريم	adjective	hard
benign	حميد	adjective	medium
berate	يوبخ	verb	medium
bestow	يمنح	verb	medium
betray	يخون	verb	medium
bewilder	يربك	verb	medium
bickering	مشاجرة	noun	medium
bid	يأمر	verb	medium
bizarre	غريب	adjective	medium
blame	يلوم	verb	medium
blank	فارغ	adjective	medium
blare	يُدوي	verb	medium
blast	انفجار	noun	easy
blatant	صارخ	adjective	medium
bleak	كئيب	adjective	medium
bless	يبارك	verb	medium
blight	آفة	noun	medium
bliss	سعادة مطلقة	noun	easy
bloat	يتورم	verb	medium
blunder	خطأ فادح	noun	medium
blur	يُشوش	verb	medium
blurt	يقول دون تفكير	verb	medium
blush	يخجل	verb	medium
bombard	يقصف	verb	medium
bond	رابطة	noun	easy
bonus	مكافأة	noun	easy
boost	يعزز	verb	medium
bore	يمل	verb	medium
bother	يزعج	verb	medium
bountiful	وفير	adjective	hard
brace	يستعد	verb	medium
brag	يتباهى	verb	medium
braid	يجدل	verb	medium
brash	متهور	adjective	medium
brawl	مشاجرة	noun	easy
breach	خرق	noun	medium
breakdown	انهيار	noun	medium
breezy	مُنعش	adjective	medium
breviary	مختصر	noun	medium
bright	لامع	adjective	medium
brim	حافة	noun	easy
brink	حافة	noun	easy
brisk	نشيط	adjective	medium
brittle	هش	adjective	medium
broach	يفتح موضوعاً للنقاش	verb	medium
broad	عريض	adjective	medium
broil	يشوي	verb	medium
brood	يفكر بضيق	verb	medium
browse	يتصفح	verb	medium
brunt	الصدمة	noun	easy
brutal	قاسي	adjective	medium
bubble	فقاعة	noun	medium
buck	يقاوم	verb	medium
buffet	بوفيه	noun	medium
bug	يزعج	verb	medium
bulk	كتلة	noun	easy
bully	يتنمر	verb	medium
bump	يصطدم	verb	medium
bunch	حزمة	noun	easy
bundle	رزمة	noun	medium
buoy	عوامة	noun	easy
burden	عبء	noun	medium
bureau	مكتب	noun	medium
burglar	لص	noun	medium
burial	دفن	noun	medium
burst	ينفجر	verb	medium
bury	يدفن	verb	medium
business	عمل	noun	medium
bust	يكسر	verb	medium
bustle	ضجيج	noun	medium
busy	مشغول	adjective	medium
butler	كبير الخدم	noun	medium
butt	ينطح	verb	medium
buzz	يطن	verb	medium
bygone	ماضٍ	adjective	medium
bypass	يتجاوز	verb	medium
byproduct	منتج ثانوي	noun	medium
bystander	شخص متفرج	noun	medium
byte	بايت (معلوماتي)	noun	easy
cable	كابل	noun	easy
cackle	يقهقه	verb	medium
cage	قفص	noun	easy
cajole	يستعطف	verb	medium
calamity	كارثة	noun	medium
caliber	عيار	noun	medium
callous	قاسي القلب	adjective	medium
campaign	حملة	noun	medium
candid	صريح	adjective	medium
candidate	مرشح	noun	medium
candor	صراحة	noun	medium
canine	كلبي	noun	medium
canker	قرحة	noun	medium
cannibal	آكل لحوم البشر	noun	medium
cannon	مدفع	noun	medium
canon	قانون	noun	easy
cantankerous	مشاكس	adjective	hard
capacious	فسيح	adjective	hard
capitulate	يستسلم	verb	hard
caprice	نزوة	noun	medium
captivate	يأسر	verb	medium
captive	أسير	noun	medium
carcinogen	مادة مسرطنة	noun	hard
cardboard	ورق مقوى	noun	medium
cardiac	قلبي	adjective	medium
careen	يترنح	verb	medium
career	مهنة	noun	medium
carefree	مهموم	adjective	medium
caress	يداعب	verb	medium
caricature	رسم كاريكاتوري	noun	hard
carnage	مذبحة	noun	medium
carnival	كرنفال	noun	medium
carol	ترنيمة	noun	easy
carouse	يحتفل بصخب	verb	medium
carp	ينتقد بحدة	verb	medium
carrion	جيفة	noun	medium
carton	كرتونة	noun	medium
cartoon	رسوم متحركة	noun	medium
carve	ينحت	verb	medium
cascade	شلال	noun	medium
case	قضية	noun	easy
cash	نقد	noun	easy
cashew	كاجو	noun	medium
casing	غلاف	noun	medium
casket	تابوت	noun	medium
cassette	شريط كاسيت	noun	medium
caste	طائفة اجتماعية	noun	easy
casual	غير رسمي	adjective	medium
casualty	ضحية	noun	medium
catacomb	سرداب	noun	medium
catalog	كتالوج	noun	medium
catastrophe	كارثة	noun	hard
cater	يُقدم خدمات	verb	medium
catharsis	تطهير نفسي	noun	medium
catholic	شامل	adjective	medium
caucus	اجتماع حزبي	noun	medium
cauldron	مرجل	noun	medium
caulk	يَسد الشقوق	verb	medium
cause	سبب	noun	easy
caustic	كاوٍ	adjective	medium
cavalier	مستهتر	adjective	medium
cavalry	فرسان	noun	medium
cavern	كهف كبير	noun	medium
cavil	يتذمر بلا سبب	verb	medium
cavity	تجويف	noun	medium
cease	يتوقف	verb	medium
cede	يتنازل عن	verb	medium
celebrity	شخص مشهور	noun	medium
celerity	سرعة	noun	medium
celestial	سماوي	adjective	hard
cement	أسمنت	noun	medium
censor	يفرض رقابة	verb	medium
center	مركز	noun	medium
centurion	قائد مئة في الجيش الروماني	noun	medium
cerebral	عقلي	adjective	medium
certain	مؤكد	adjective	medium
certify	يشهد بصحة	verb	medium
cessation	توقف	noun	medium
chafe	يحتك	verb	medium
chaff	قش	noun	easy
chagrin	خيبة أمل	noun	medium
chairman	رئيس مجلس الإدارة	noun	medium
chalice	كأس مقدسة	noun	medium
chamber	غرفة	noun	medium
chamois	جلد الظبي	noun	medium
chancellor	مستشار	noun	hard
chaos	فوضى	noun	easy
chapel	كنيسة صغيرة	noun	medium
charade	تمثيلية	noun	medium
charisma	كاريزما	noun	medium
charitable	خيري	adjective	hard
charm	سحر	noun	easy
charter	ميثاق	noun	medium
chasm	فجوة عميقة	noun	easy
chassis	هيكل السيارة	noun	medium
chaste	عفيف	adjective	medium
chasten	يؤدب	verb	medium
chastise	يوبخ بشدة	verb	medium
chat	يدردش	verb	medium
chatter	يثرثر	verb	medium
cheap	رخيص	adjective	medium
checkered	مُربعات	adjective	hard
cherish	يعتز بـ	verb	medium
chew	يمضغ	verb	medium
chicanery	خداع	noun	medium
chide	يؤنب	verb	medium
childish	صبياني	adjective	medium
chill	برودة	noun	easy
chilly	بارد	adjective	medium
chime	يدق (للساعة)	verb	medium
chimera	وهم	noun	medium
chivalry	فروسية	noun	medium
choke	يختنق	verb	medium
cholera	كوليرا	noun	medium
chore	عمل روتيني	noun	easy
chortle	يضحك بصوت عالٍ	verb	medium
chosen	مختار	adjective	medium
chronicle	سجل تاريخي	noun	medium
chuckle	يضحك بخفة	verb	medium
chug	يتحرك بصوت	verb	medium
chum	صديق حميم	noun	easy
chunk	قطعة كبيرة	noun	easy
churlish	فظ	adjective	medium
churn	يخض	verb	medium
chute	مزالق	noun	easy
cicada	حشرة الزيز	noun	medium
cider	عصير التفاح	noun	easy
cigar	سيجار	noun	easy
cigarette	سيجارة	noun	medium
cinder	جمرة	noun	medium
circular	دائري	adjective	medium
circumlocution	كلام غير مباشر	noun	hard
circumscribe	يحدد	verb	hard
circumspect	حذر	adjective	hard
circumvent	يتحايل	verb	hard
cistern	خزان مياه	noun	medium
citadel	قلعة	noun	medium
citrus	حمضيات	noun	medium
civic	مدني	adjective	medium
civil	مدني	adjective	medium
civilian	مدني	noun	medium
clad	مكتسٍ	adjective	medium
clamber	يتسلق بصعوبة	verb	medium
clamor	ضجيج	noun	medium
clan	عشيرة	noun	easy
clandestine	سري	adjective	hard
clang	يُصدر رنيناً معدنياً	verb	medium
clarion	واضح وقوي	adjective	medium
clash	يتصادم	verb	medium
clasp	يُمسك بإحكام	verb	medium
class	فصل	noun	easy
classic	كلاسيكي	adjective	medium
clatter	يقرقع	verb	medium
claw	مخلب	noun	easy
clear	واضح	adjective	medium
clearance	تصريح	noun	medium
cleave	يشق	verb	medium
cleft	شق	noun	easy
clemency	رأفة	noun	medium
clement	رحيم	adjective	medium
clench	يضغط	verb	medium
clergy	رجال الدين	noun	medium
clerical	مكتبي	adjective	medium
click	ينقر	verb	medium
clinch	يحسم	verb	medium
cling	يتشبث	verb	medium
clink	يُحدث رنيناً	verb	medium
clip	يقص	verb	medium
clique	شلة	noun	medium
cloak	عباءة	noun	easy
clockwise	مع عقارب الساعة	adverb	medium
clod	كتلة طين	noun	easy
clog	يسد	verb	medium
cloister	دير	noun	medium
clone	يستنسخ	verb	medium
closure	إغلاق	noun	medium
clot	جلطة	noun	easy
cloth	قماش	noun	easy
clothe	يكسو	verb	medium
clout	نفوذ	noun	easy
clove	قرنفل	noun	easy
clover	نبات البرسيم	noun	medium
clown	مهرج	noun	easy
club	نادي	noun	easy
clue	دليل	noun	easy
clump	كتلة	noun	easy
clung	تشبث	verb	medium
cluster	عنقود	noun	medium
clutter	فوضى	noun	medium
coagulate	يتجلط	verb	medium
coalesce	يندمج	verb	medium
coalition	تحالف	noun	medium
coarse	خشن	adjective	medium
coaster	قاعدة أكواب	noun	medium
coax	يستعطف	verb	medium
cobalt	كوبالت	noun	medium
cobble	حجر رصف	noun	medium
cobra	كوبرا	noun	easy
cobweb	نسيج عنكبوت	noun	medium
cock	يصوب	verb	medium
cocktail	كوكتيل	noun	medium
cod	سمك القد	noun	easy
code	شفرة	noun	easy
codify	يُقنن	verb	medium
coerce	يُكره	verb	medium
coexistence	تعايش	noun	hard
coffer	صندوق مال	noun	medium
coffin	تابوت	noun	medium
cog	ترس	noun	easy
cogent	مقنع	adjective	medium
cognitive	معرفي	adjective	hard
cognizant	مدرك	adjective	hard
cohere	يماسِك	verb	medium
cohesion	تماسك	noun	medium
cohort	مجموعة	noun	medium
coil	يلتف	verb	medium
coin	عملة	noun	easy
coincidence	صدفة	noun	hard
coke	فحم كوك	noun	easy
collar	ياقة	noun	medium
collate	يُطابق	verb	medium
colleague	زميل	noun	medium
collection	مجموعة	noun	hard
collective	جماعي	adjective	hard
college	كلية	noun	medium
collide	يصطدم	verb	medium
collier	عامل منجم فحم	noun	medium
colliery	منجم فحم	noun	medium
collision	اصطدام	noun	medium
colloquy	حوار	noun	medium
collude	يتواطأ	verb	medium
colon	نقطتان رأسيتان	noun	easy
colonel	عقيد	noun	medium
colonial	استعماري	adjective	medium
colporteur	بائع كتب متجول	noun	hard
colt	مهر (صغير الحصان)	noun	easy
coma	غيبوبة	noun	easy
comatose	فاقد للوعي	adjective	medium
combat	قتال	noun	medium
combination	تركيبة	noun	hard
comely	جميل	adjective	medium
comestible	مأكولات	noun	hard
comic	كوميدي	adjective	medium
comity	لياقة	noun	medium
comma	فاصلة	noun	easy
commandeer	يستولي على	verb	hard
commander	قائد	noun	medium
commemorate	يحيي ذكرى	verb	hard
commence	يبدأ	verb	medium
commend	يمدح	verb	medium
commensurate	متناسب	adjective	hard
comment	تعليق	noun	medium
commerce	تجارة	noun	medium
commercial	تجاري	adjective	hard
commingle	يختلط	verb	medium
commiserate	يتعاطف مع	verb	hard
commissary	مخزن طعام	noun	hard
commission	عمولة	noun	hard
commit	يرتكب	verb	medium
commitment	التزام	noun	hard
committee	لجنة	noun	medium
commodious	فسيح	adjective	hard
commodity	سلعة	noun	medium
common	مشترك	adjective	medium
commonplace	مبتذل	adjective	hard
commotion	ضجة	noun	medium
communal	جماعي	adjective	medium
commune	يتواصل روحياً	verb	medium
communion	مشاركة	noun	medium
commute	يتنقل (للعمل)	verb	medium
compact	مدمج	adjective	medium
company	شركة	noun	medium
comparable	قابل للمقارنة	adjective	hard
compartment	مقصورة	noun	hard
compassion	رحمة	noun	hard
compatible	متوافق	adjective	hard
compel	يجبر	verb	medium
compendious	مختصر	adjective	hard
compendium	موجز	noun	hard
compensate	يعوض	verb	hard
competent	كفء	adjective	hard
compile	يجمع	verb	medium
complacent	مكتفٍ ذاتياً	adjective	hard
`);
