/** Grade 6 daily-life word bank — 422 simple words (auto-built). */

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

export const GRADE6_DAILY_FINAL_BANK = parse(`
awning	المظلة	adjective	medium
badge	شارة	noun	easy
barber	حلاق	verb	medium
barrel	برميل	noun	medium
basket	سلة	noun	medium
bedroom	غرفة نوم	noun	medium
beet	بنجر	noun	easy
bonnet	غطاء محرك السيارة	noun	medium
booth	كشك	noun	easy
bouquet	باقة	noun	medium
bracelet	إسورة	noun	medium
brand	ماركة	noun	easy
brass	النحاس	noun	easy
bunker	القبو	verb	medium
chili	الفلفل الحار	noun	easy
chopstick	عود	noun	hard
circus	سيرك	noun	medium
cola	كولا	noun	easy
cork	الفلين	noun	easy
cradle	مهد	noun	medium
crate	قفص	verb	easy
creek	الخور	noun	easy
crib	سرير	noun	easy
croissant	كرواسون	noun	hard
crumb	كسرة خبز	noun	easy
daisy	ديزي	noun	easy
dashboard	لوحة القيادة	noun	hard
daylight	ضوء النهار	noun	medium
deck	ظهر السفينة	noun	easy
dessert	حَلوَى	noun	medium
diamond	الماس	noun	medium
diary	مذكرة	noun	easy
diner	العشاء	verb	easy
dirt	الأوساخ	noun	easy
dish	طبق	noun	easy
dishcloth	قماشة الصحون	noun	hard
doghouse	بيت الكلب	noun	medium
doll	لعبة	noun	easy
doorway	مدخل	noun	medium
doughnut	كعكة محلاة	noun	medium
dresser	مضمد	verb	medium
duckling	البطيطة	adjective	medium
dumpling	زلابية	adjective	medium
dust	تراب	noun	easy
dustpan	مجرود	noun	medium
earring	حلق	adjective	medium
eggplant	باذنجان	noun	medium
emerald	الزمرد	noun	medium
farmhouse	مزرعة	noun	hard
feather	ريشة	verb	medium
fiddle	كمان	noun	medium
fingerprint	بصمة	noun	hard
firework	ألعاب نارية	noun	medium
fishbowl	حوض السمك	noun	medium
fist	قبضة	noun	easy
flagpole	سارية العلم	noun	medium
flavor	نكهة	noun	medium
foam	رغوة	noun	easy
fondue	مخفوق بالجبن	noun	medium
friendship	الصداقة	noun	hard
fringe	هامش	noun	medium
fryer	المقلاة	verb	easy
garment	ملابس	noun	medium
gazebo	شرفة المراقبة	noun	medium
gem	جوهرة	noun	easy
ghost	شبح	noun	easy
gong	غونغ	noun	easy
gown	ثوب	noun	easy
grave	خطير	noun	easy
gravel	الحصى	noun	medium
gravy	المرق	noun	easy
grill	شواء	noun	easy
grocer	البقال	verb	medium
grocery	خضروات	noun	medium
haircut	قصة شعر	noun	medium
hammock	أرجوحة	noun	medium
handkerchief	منديل	noun	hard
handshake	مصافحة	noun	hard
hatch	يفقس	noun	easy
haystack	كومة قش	noun	medium
headband	عقال	noun	medium
headset	سماعة الرأس	noun	medium
hedge	التحوط	noun	easy
helper	المساعد	verb	medium
herd	قطيع	noun	easy
hillside	التلال	noun	medium
hinge	المفصلي	noun	easy
homeroom	com.homeroom	noun	medium
hood	كَبُّوت	noun	easy
hook	خطاف	noun	easy
hopscotch	الحجلة	noun	hard
hostel	نزل	noun	medium
hotdog	نقانق	noun	medium
hourglass	الساعة الرملية	noun	hard
housewife	ربة منزل	noun	hard
hover	تحوم	verb	easy
huddle	تجمهر	noun	medium
hull	بدن	noun	easy
hunger	الجوع	verb	medium
hunter	صياد	verb	medium
hurdle	عقبة	noun	medium
hydrant	صنبور	noun	medium
icicle	جليد	noun	medium
icon	رمز	noun	easy
igloo	كوخ الإسكيمو	noun	easy
impact	تأثير	noun	medium
infant	رضيع	noun	medium
ink	حبر	noun	easy
inlet	مدخل	noun	easy
intro	مقدمة	noun	easy
ivy	لبلاب	noun	easy
jelly	هلام	adverb	easy
jewel	جوهرة	noun	easy
journal	مجلة	adjective	medium
keeper	حارس	verb	medium
khaki	الكاكي	noun	easy
kindergarten	روضة أطفال	verb	hard
kneel	يركع	noun	easy
knob	مقبض الباب	noun	easy
knot	عقدة	noun	easy
laptop	كمبيوتر محمول	noun	medium
lard	شحم الخنزير	noun	easy
lark	قبرة	noun	easy
latch	مزلاج	noun	easy
lawn	العشب	noun	easy
layer	طبقة	verb	easy
leap	خطوة	noun	easy
lemonade	عصير الليمون	noun	medium
license	رخصة	noun	medium
lily	زنبق	noun	easy
lipstick	أحمر الشفاه	noun	medium
litter	القمامة	verb	medium
lobby	ردهة	noun	easy
locket	المدلاة	noun	medium
lodge	لودج	noun	easy
lollipop	مصاصة	noun	medium
lotion	غسول	noun	medium
lounge	صالة	noun	medium
lumber	الخشب	verb	medium
lure	إغراء	noun	easy
maid	خادمة	noun	easy
makeup	ماكياج	noun	medium
margin	هامِش	noun	medium
marshmallow	مارشميلو	noun	hard
mason	ماسون	noun	easy
mercury	الزئبق	noun	medium
merry	مرح	noun	easy
mischief	الأذى	noun	medium
mitten	القفاز	verb	medium
mixer	خلاط	verb	easy
moat	خندق	noun	easy
mold	قالب	noun	easy
monk	راهب	noun	easy
mound	تل	noun	easy
movement	حركة	noun	medium
mulberry	التوت	noun	medium
mushroom	فطر	noun	medium
mutton	لحم الضأن	noun	medium
navy	البحرية	noun	easy
necklace	قلادة	noun	medium
needle	إبرة	noun	medium
nozzle	فوهة	noun	medium
nursery	حضانة	noun	medium
oat	شوفان نباتة	noun	easy
omelet	عجة البيض	noun	medium
orchid	الأوركيد	noun	medium
pacifier	مصاصة	verb	medium
paddle	مجداف	noun	medium
pail	سطل	noun	easy
painter	رسام	verb	medium
pamphlet	كتيب	noun	medium
panel	لوحة	noun	easy
parsley	بَقدونس	noun	medium
patch	رقعة	noun	easy
paw	مخلب	noun	easy
peanut	الفول السوداني	noun	medium
pedal	دواسة	noun	easy
perfume	عطر	noun	medium
picnic	نزهه	adjective	medium
pile	كومة	noun	easy
pirate	قرصان	verb	medium
pistachio	الفستق	noun	hard
poison	سم	noun	medium
pouch	كيس	noun	easy
powder	مسحوق	verb	medium
pudding	بودنغ	adjective	medium
puff	نفخة	noun	easy
punch	لكمة	noun	easy
puppet	دمية	noun	medium
rack	رف	noun	easy
radar	رادار	noun	easy
rag	خرقة	noun	easy
railroad	السكك الحديدية	noun	medium
raisin	زبيب	noun	medium
rapids	المنحدرات	noun	medium
razor	ماكينة حلاقة	noun	easy
reader	قارئ	verb	medium
reed	ريد	noun	easy
reel	بكرة	noun	easy
register	يسجل	verb	medium
rickshaw	عربة يد	noun	medium
rifle	بندقية	noun	easy
rink	حلبة التزلج	noun	easy
ripple	تموج	noun	medium
royal	ملكي	noun	easy
ruby	روبي	noun	easy
rumble	ترعد	noun	medium
rye	الجاودار	noun	easy
sack	كيس	noun	easy
saddle	سرج	noun	medium
safari	سفاري	noun	medium
salon	صالون	noun	easy
samosa	سمبوسة	noun	medium
sash	وشاح	noun	easy
saucer	صحن	verb	medium
savings	المدخرات	noun	medium
scallop	إكليل	noun	medium
scent	رائحة	noun	easy
scoop	مغرفة	noun	easy
scratch	يخدش	noun	medium
seagull	النورس	noun	medium
seam	التماس	noun	easy
series	مسلسل	noun	medium
shift	يحول	noun	easy
sill	عتبة	noun	easy
sled	تزلج	noun	easy
slime	الوحل	noun	easy
smarty	ذكي	noun	medium
smokestack	مدخنة	noun	hard
snowflake	ندفة الثلج	noun	hard
snowman	رجل ثلج	noun	medium
socket	المقبس	noun	medium
spade	الأشياء بأسمائها الحقيقية	noun	easy
span	فترة	noun	easy
spark	شرارة	noun	easy
spatula	ملعقة	noun	medium
speck	بقعة	noun	easy
spiderweb	شبكة العنكبوت	noun	hard
splinter	شظية	verb	medium
stairway	درج	noun	medium
stampede	تدافع	noun	medium
steam	بخار	noun	easy
stockpile	مخزون	noun	hard
streamer	غاسل	verb	medium
sugarcane	قصب السكر	noun	hard
sunflower	عباد الشمس	verb	hard
supermarket	سوبر ماركت	noun	hard
surfboard	لوح ركوب الأمواج	noun	hard
surround	محيط	noun	medium
sushi	سوشي	noun	easy
switchboard	لوحة التبديل	noun	hard
tailgate	الباب الخلفي	verb	medium
tambourine	دف صغير	noun	hard
tangerine	اليوسفي	noun	hard
tapestry	نسيج	noun	medium
target	هدف	noun	medium
tart	تورتة	noun	easy
tattoo	وشم	noun	medium
tavern	حانة	noun	medium
teapot	إبريق الشاي	noun	medium
teddy	تيدي	noun	easy
teenager	مراهق	verb	medium
telegram	برقية	noun	medium
thicket	غابة	noun	medium
toddler	طفل صغير	verb	medium
toolbox	الأدوات	noun	medium
tortilla	التورتيا	noun	medium
township	بلدة	noun	medium
trampoline	الترامبولين	noun	hard
traveler	مسافر	verb	medium
treadmill	جهاز المشي	noun	hard
tricycle	دراجة ثلاثية العجلات	noun	medium
tulip	الخزامى	noun	easy
tuxedo	سهرة	noun	medium
typewriter	آلة كاتبة	verb	hard
union	الاتحاد	noun	easy
useful	مفيد	adjective	medium
vacation	أجازة	noun	medium
vampire	مصاص دماء	noun	medium
velvet	مخمل	noun	medium
vendor	بائع	noun	medium
voucher	قسيمة	verb	medium
walnut	الجوز	noun	medium
wand	عصا	noun	easy
warrior	محارب	noun	medium
wax	الشمع	noun	easy
weekend	عطلة نهاية الأسبوع	noun	medium
weightlifter	رافع الاثقال	verb	hard
westward	غربا	noun	medium
wig	شعر مستعار	noun	easy
wilderness	البرية	noun	hard
wizard	معالج	noun	medium
workplace	مكان العمل	noun	hard
wreath	إكليل	noun	medium
wristband	معصمه	noun	hard
writer	الكاتب	verb	medium
yarn	غزل	noun	easy
hymn	ترنيمة	noun	easy
jam	مربى	noun	easy
jar	جرة	noun	easy
jazz	موسيقى الجاز	noun	easy
jeep	جيب	noun	easy
log	سجل	noun	easy
penny	بنس واحد	noun	easy
scene	مشهد	noun	easy
vehicle	عربة	noun	medium
price	سعر	noun	easy
flame	لهب	noun	easy
tube	أنبوب	noun	easy
effect	تأثير	noun	medium
rate	معدل	noun	easy
form	استمارة	noun	easy
group	مجموعة	noun	easy
proof	دليل	noun	easy
view	منظر	noun	easy
statement	إفادة	noun	hard
goggles	نظارات واقية	noun	medium
discount	تخفيض	noun	medium
markup	العلامات	noun	medium
sales	مبيعات	noun	easy
deposit	إيداع	noun	medium
recycling	إعادة التدوير	adjective	hard
notation	تدوين	noun	medium
operations	العمليات	noun	hard
numbers	أرقام	noun	medium
mental	عقلي	adjective	medium
arithmetic	الحساب	adjective	hard
geometric	هندسي	adjective	hard
engineering	هندسة	adjective	hard
cellular	الخلوية	noun	medium
quake	زلزال	noun	easy
volcanic	بركاني	adjective	medium
pacific	المحيط الهادئ	adjective	medium
niche	المكانة	noun	easy
relation	علاقة	noun	medium
source	مصدر	noun	medium
section	قسم	noun	medium
scalar	العددية	noun	medium
replication	النسخ المتماثل	noun	hard
meeting	مقابلة	adjective	medium
hearing	السمع	adjective	medium
portal	منفذ	adjective	medium
literacy	معرفة القراءة والكتابة	noun	medium
checking	التحقق	adjective	medium
propaganda	دعاية	noun	hard
operation	عملية	noun	hard
reform	إصلاح	noun	medium
genealogy	علم الأنساب	noun	hard
chronometer	الكرونومتر	verb	hard
ellipsis	القطع الناقص	noun	medium
fragment	جزء	noun	medium
agreement	اتفاق	noun	hard
placement	التنسيب	noun	hard
formation	تشكيل	noun	hard
publishing	نشر	adjective	hard
hashtag	الوسم	noun	medium
examination	فحص	noun	hard
spotting	اكتشاف	adjective	medium
imitation	تقليد	noun	hard
discussion	مناقشة	noun	hard
censorship	الرقابة	noun	hard
pacing	سرعة	adjective	medium
impromptu	مرتجلة	noun	hard
memorized	حفظها	adjective	hard
memorial	نصب تذكاري	adjective	medium
farewell	وداع	noun	medium
storyboard	القصة المصورة	noun	hard
acrobat	بهلوان	noun	medium
admiral	أدميرال	adjective	medium
airbrush	البخاخة	noun	medium
airfield	مطار	noun	medium
airlift	جسر جوي	noun	medium
airlock	غرفة معادلة الضغط	noun	medium
airman	طيار	noun	medium
airways	الخطوط الجوية	noun	medium
alcove	الكوة	noun	medium
alfalfa	البرسيم	noun	medium
almanac	تقويم	noun	medium
altar	مذبح	noun	easy
amber	العنبر	verb	easy
amethyst	جمشت	noun	medium
amigo	صديق	noun	easy
amulet	تميمة	noun	medium
angler	الصياد	verb	medium
anorak	واق	noun	medium
antler	قرن الوعل	verb	medium
anvil	سندان	noun	easy
armband	شارة	noun	medium
armrest	مسند للذراعين	noun	medium
armpit	إبط	noun	medium
arrowhead	رأس السهم	noun	hard
artichoke	خرشوف	noun	hard
arugula	جرجير	noun	medium
ashtray	منفضة سجائر	noun	medium
asparagus	الهليون	noun	hard
audiobook	كتاب مسموع	noun	hard
aviary	القفص	noun	medium
axolotl	قنفذ البحر	noun	medium
baboon	قرد البابون	noun	medium
backache	آلام الظهر	noun	medium
backboard	اللوحة الخلفية	noun	hard
backfire	نتائج عكسية	noun	medium
backhand	ضربة خلفية	noun	medium
backhoe	حفار	noun	medium
backlit	بإضاءة خلفية	noun	medium
backrest	مسند الظهر	noun	medium
backseat	المقعد الخلفي	noun	medium
backside	المؤخر	noun	medium
backstop	مساندة	noun	medium
backtalk	الحديث الخلفي	noun	medium
backwash	الغسيل العكسي	noun	medium
backwoods	غابات خلفية	noun	hard
backyard	الفناء الخلفي	noun	medium
bagpipe	مزمار القربة	noun	medium
bakeware	خبز	noun	medium
ballast	الصابورة	noun	medium
ballboy	فتى الكرة	noun	medium
ballgame	لعبة الكرة	noun	medium
ballpark	ملعب كرة قدم	noun	medium
ballpoint	نقطة حبر جاف	noun	medium
ballroom	قاعة رقص	noun	medium
banister	درابزين	noun	medium
`);
