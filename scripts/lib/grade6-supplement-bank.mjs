/** Grade 6 supplement word bank — 1000 elementary vocabulary words (compliment → z + topics). */

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

export const GRADE6_SUPPLEMENT_BANK = parse(`
compliment	يمدح	verb	medium
composer	مؤلف موسيقى	noun	medium
composite	مركّب	adjective	hard
compress	يضغط	verb	medium
compromise	يتنازل	verb	hard
comrade	رفيق	noun	medium
concede	يعترف	verb	hard
conceive	يتصوّر	verb	hard
concern	قلق	noun	medium
concert	حفل موسيقي	noun	easy
condemn	يدين	verb	hard
condition	حالة	noun	easy
conduct	يسلوك	verb	medium
cone	مخروط	noun	easy
confess	يعترف	verb	medium
confine	يحصر	verb	hard
confuse	يربك	verb	medium
congratulate	يهنئ	verb	medium
congress	مؤتمر	noun	medium
conscious	واعٍ	adjective	hard
consent	موافقة	noun	medium
conservation	حفظ	noun	medium
consist	يتكوّن	verb	medium
console	يواسي	verb	medium
construct	يبني	verb	medium
contact	اتصال	noun	easy
contest	مسابقة	noun	easy
continue	يستمر	verb	easy
control	تحكم	noun	easy
convenient	مناسب	adjective	medium
convention	اتفاقية	noun	hard
conversation	محادثة	noun	easy
convict	مدان	noun	hard
cooperate	يتعاون	verb	medium
cope	يتأقلم	verb	medium
coral	مرجان	noun	medium
core	لب	noun	medium
cornfield	حقل ذرة	noun	easy
couch	أريكة	noun	easy
cough	سعال	noun	easy
course	مساق	noun	easy
courtroom	قاعة محكمة	noun	medium
cousin	ابن عم	noun	easy
cover	غطاء	noun	easy
craftsman	حرفي	noun	medium
crash	تحطم	verb	easy
crater	فوهة	noun	medium
create	يخلق	verb	easy
creature	مخلوق	noun	easy
credit	رصيد	noun	medium
crevice	شق	noun	hard
crew	طاقم	noun	medium
crime	جريمة	noun	medium
crisp	مقرمش	adjective	easy
crop	محصول	noun	easy
crossroads	مفترق	noun	medium
crouch	ينحني	verb	medium
crowd	حشد	noun	easy
crown	تاج	noun	easy
cruise	رحلة بحرية	noun	medium
crumble	يتفتت	verb	medium
crush	يسحق	verb	medium
crust	قشرة	noun	easy
crystal	بلور	noun	medium
cube	مكعب	noun	easy
curl	يجعّد	verb	easy
curve	منحنى	noun	medium
completely	تماماً	adverb	easy
computer	حاسوب	noun	easy
concerning	فيما يتعلق ب	noun	hard
condensation	تكثيف	noun	medium
condo	شقة تمليك	noun	medium
condor	كندور	noun	medium
confused	مرتبك	adjective	easy
constantly	باستمرار	adverb	medium
continuously	باستمرار	adverb	medium
counselor	مرشد	noun	medium
country	بلد	noun	easy
court	ملعب	noun	easy
coyote	ذئب أمريكي	noun	medium
cozy	دافئ ومريح	adjective	medium
cracker	بسكويت مملح	noun	medium
craft	حرفة	noun	easy
cranberry	توت بري	noun	medium
cricket	صرصور الليل	noun	medium
crosswalk	ممر مشاة	noun	medium
cruel	قاسٍ	adjective	medium
cuckoo	وقواق	noun	medium
currently	حالياً	adverb	medium
cycling	ركوب الدراجات	noun	easy
cyclist	دراج	noun	medium
cyclone	إعصار	noun	medium
daily	يومي	adjective	easy
damp	رطب	adjective	medium
dance	رقص	noun	easy
dangerous	خطير	adjective	easy
dark	مظلم	adjective	easy
date	تمر	noun	easy
decibel	ديسيبل	noun	medium
deeply	بعمق	adverb	medium
deer	غزال	noun	easy
defeat	هزيمة	noun	medium
define	تعريف	verb	medium
definitely	بالتأكيد	adverb	medium
delicious	لذيذ	adjective	easy
delighted	مسرور	adjective	medium
delivery	توصيل	noun	easy
delta	دلتا	noun	medium
detergent	منظف	noun	medium
develop	تطوير	verb	medium
dictionary	قاموس	noun	easy
die	موت	verb	easy
diesel	ديزل	noun	medium
different	مختلف	adjective	easy
difficult	صعب	adjective	easy
dinner	عشاء	noun	easy
directly	مباشرة	adverb	medium
dirty	قذر	adjective	easy
disappointed	محبط	adjective	medium
distant	بعيد	adjective	medium
distill	تقطير	verb	medium
district	منطقة	noun	easy
diver	غواص	noun	medium
diving	غطس	noun	easy
doctor	طبيب	noun	easy
domestic	محلي	adjective	medium
donkey	حمار	noun	easy
donut	دونات	noun	easy
doubtful	متردد	adjective	medium
dove	يمامة	noun	easy
downstairs	في الطابق السفلي	adverb	medium
downward	هبوطاً	adverb	medium
dragonfly	يعسوب	noun	medium
drain	مصرف	noun	medium
drawing	رسم	noun	easy
dribble	مراوغة	verb	medium
driver	سائق	noun	easy
driveway	ممر سيارات	noun	medium
drone	طائرة بدون طيار	noun	medium
dryer	مجفف	noun	easy
duet	ثنائي	noun	medium
dull	بليد	adjective	medium
during	في	noun	medium
duvet	لحاف	noun	medium
each	كل	adjective	easy
early	مبكر	adjective	easy
easel	حامل لوحة	noun	medium
easily	بسهولة	adverb	easy
eastern	شرقي	adjective	medium
echo	صدى	noun	easy
either	أي	adjective	medium
elastic	مرن	adjective	medium
elder	كبير السن	noun	medium
electricity	كهرباء	noun	easy
electron	إلكترون	noun	medium
elephant	فيل	noun	easy
embarrassed	محرج	adjective	medium
embroidery	تطريز	noun	medium
empty	فارغ	adjective	easy
encyclopedia	موسوعة	noun	medium
endurance	تحمل	noun	medium
enjoy	استمتاع	verb	easy
enough	كافٍ	adjective	easy
enter	دخول	verb	easy
enthusiastic	متحمس	adjective	medium
entirely	بالكامل	adverb	medium
envelope	ظرف	noun	easy
envious	حاسد	adjective	medium
equal	متساوٍ	adjective	easy
equator	خط الاستواء	noun	medium
eraser	ممحاة	noun	easy
especially	خصوصاً	adverb	medium
estuary	مصب نهر	noun	medium
evaporation	تبخر	noun	medium
even	متساوٍ	adjective	easy
eventually	في النهاية	adverb	medium
every	كل	adjective	easy
everywhere	في كل مكان	adverb	easy
exact	دقيق	adjective	easy
exactly	بالضبط	adverb	easy
exam	امتحان	noun	easy
excited	متحمس	adjective	easy
exercise	تمرين	noun	easy
exhaust	عادم	noun	medium
expensive	غالي	adjective	easy
experience	تجربة	verb	medium
explorer	مستكشف	noun	medium
explosion	انفجار	noun	medium
exponent	أس	noun	medium
extra	إضافي	adjective	easy
extremely	للغاية	adverb	medium
eyelash	رموش	noun	medium
fable	حكاية أخلاقية	noun	medium
fahrenheit	فهرنهايت	noun	medium
fail	رسوب	verb	easy
fairly	إلى حد ما	adverb	medium
fake	مزيف	adjective	easy
false	خاطئ	adjective	easy
family	عائلة	noun	easy
far	بعيد	adjective	easy
fare	أجرة	noun	medium
father	أب	noun	easy
faucet	صنبور	noun	medium
fearful	خائف	adjective	medium
fencing	مبارزة	noun	medium
ferment	تخمير	verb	medium
fern	سرخس	noun	medium
ferret	نمس	noun	medium
fetch	إحضار	verb	medium
field	حقل	noun	easy
fight	قتال	verb	easy
filter	تصفية	verb	medium
final	نهائي	adjective	easy
finally	أخيراً	adverb	easy
finch	شرشور	noun	medium
finish	إنهاء	verb	easy
firefighter	رجل إطفاء	noun	easy
firefly	يراعة	noun	medium
fireplace	موقد	noun	medium
fishing	صيد	noun	easy
fit	لائق	adjective	easy
fix	إصلاح	verb	easy
fjord	مضيق بحري	noun	medium
flamingo	فلامنغو	noun	medium
flash	فلاش	noun	easy
flask	قارورة	noun	medium
flea	برغوث	noun	medium
flexibility	مرونة	noun	medium
football	كرة قدم	noun	easy
forearm	ساعد	noun	medium
forehead	جبهة	noun	medium
foreign	أجنبي	adjective	easy
forget	نسيان	verb	easy
formerly	سابقاً	adverb	medium
forward	للأمام	adverb	easy
frame	إطار	noun	easy
freezer	فريزر	noun	easy
freezing	متجمد	adjective	medium
freight	شحن	noun	medium
frequently	بشكل متكرر	adverb	medium
fridge	ثلاجة	noun	easy
frustrated	محبط	adjective	medium
fully	بالكامل	adverb	medium
funnel	قمع	noun	medium
funny	مضحك	adjective	easy
furious	غاضب جداً	adjective	medium
garbage	قمامة	noun	easy
garden	حديقة	noun	easy
garlic	ثوم	noun	easy
gasoline	بنزين	noun	medium
gearbox	علبة تروس	noun	medium
gecko	وزغة	noun	medium
generate	توليد	verb	medium
gently	بلطف	adverb	easy
geometry	هندسة	noun	medium
gerbil	جربوع	noun	medium
giant	عملاق	adjective	easy
glider	طائرة شراعية	noun	medium
global	عالمي	adjective	easy
globe	كرة أرضية	noun	easy
glove	قفاز	noun	easy
glue	غراء	noun	easy
goalkeeper	حارس مرمى	noun	medium
goldfish	سمكة ذهبية	noun	easy
golfer	لاعب غولف	noun	medium
goose	إوزة	noun	easy
gorilla	غوريلا	noun	medium
governor	حاكم	noun	medium
grade	صف	noun	easy
gradually	تدريجياً	adverb	medium
grandma	جدة	noun	easy
grandpa	جد	noun	easy
grape	عنب	noun	easy
grasshopper	جراد	noun	medium
greenhouse	بيت زجاجي	noun	medium
grumpy	نكد	adjective	medium
guess	تخمين	verb	easy
guest	ضيف	noun	easy
guilty	مذنب	adjective	medium
gulf	خليج كبير	noun	medium
gust	هبة ريح	noun	medium
gymnasium	صالة رياضية	noun	medium
gymnastics	جمباز	noun	medium
habitat	موطن	noun	medium
hamster	هامستر	noun	easy
handsome	وسيم	adjective	easy
hanger	شماعة	noun	medium
happen	حدوث	verb	easy
happily	بسعادة	adverb	easy
hardly	بالكاد	adverb	medium
hate	كره	verb	easy
hawk	صقر	noun	easy
headlight	مصباح أمامي	noun	medium
headphones	سماعات	noun	easy
health	صحة	noun	easy
healthy	صحي	adjective	easy
heartbeat	نبض القلب	noun	medium
heater	سخان	noun	easy
hemisphere	نصف كرة	noun	medium
herbivore	آكل عشب	noun	medium
hero	بطل	noun	easy
heron	بلشون	noun	medium
hibernation	سبات	noun	medium
hide	إخفاء	verb	easy
high	عالي	adjective	easy
highly	بدرجة عالية	adverb	medium
hiking	تنزه	noun	easy
hippo	فرس النهر	noun	medium
hockey	هوكي	noun	easy
homework	واجب منزلي	noun	easy
honestly	بصدق	adverb	medium
honesty	أمانة	noun	easy
hoodie	هودي	noun	easy
hopeless	يائس	adjective	medium
horn	بوق	noun	easy
horse	حصان	noun	easy
host	مضيف	noun	easy
hotel	فندق	noun	easy
house	منزل	noun	easy
huge	ضخم	adjective	easy
hummingbird	طائر الطنان	noun	medium
humorous	فكاهي	adjective	medium
hunting	صيد	noun	medium
hurry	عجلة	verb	easy
hybrid	هجين	adjective	medium
hyena	ضبع	noun	medium
hygrometer	مقياس رطوبة	noun	medium
iceberg	جبل جليدي	noun	medium
iguana	إغوانا	noun	medium
illness	مرض	noun	easy
imagine	تخيل	verb	easy
immediately	فوراً	adverb	easy
immune	مناعي	adjective	medium
impatient	غير صبور	adjective	medium
imperfect	غير مثالي	adjective	medium
impossible	مستحيل	adjective	easy
incomplete	غير مكتمل	adjective	medium
incorrect	خاطئ	adjective	easy
indirectly	بشكل غير مباشر	adverb	medium
indoor	داخلي	adjective	easy
inheritance	وراثة	noun	medium
inject	حقن	verb	medium
inner	داخلي	adjective	medium
insect	حشرة	noun	easy
inside	داخل	adverb	easy
insist	إصرار	verb	medium
inspiration	إلهام	noun	medium
instantly	فوراً	adverb	medium
insulate	عزل	verb	medium
international	دولي	adjective	medium
inventor	مخترع	noun	medium
invertebrate	لافقاري	noun	medium
irrigation	ري	noun	medium
irritated	منزعج	adjective	medium
isotope	نظير	noun	medium
jacket	سترة	noun	easy
janitor	عامل نظافة	noun	medium
jeans	جينز	noun	easy
jellyfish	قنديل البحر	noun	medium
jet	طائرة نفاثة	noun	easy
jog	هرولة	verb	easy
judo	جودو	noun	medium
juice	عصير	noun	easy
jumping	قفز	noun	easy
junction	تقاطع	noun	medium
just	فقط	adverb	easy
karate	كاراتيه	noun	medium
kayak	كاياك	noun	medium
keep	احتفاظ	verb	easy
ketchup	كاتشب	noun	easy
kettle	غلاية	noun	easy
key	مفتاح	noun	easy
kidney	كلية	noun	medium
kill	قتل	verb	easy
kindly	بلطف	adverb	medium
kingfisher	صياد السمك	noun	medium
kiwi	كيوي	noun	easy
knife	سكين	noun	easy
knit	حياكة	verb	medium
knitting	حياكة	noun	medium
koala	كوالا	noun	easy
ladybug	دعسوقة	noun	easy
lagoon	بحيرة ساحلية	noun	medium
lamb	حمل	noun	easy
landscape	منظر طبيعي	noun	medium
later	لاحقاً	adverb	easy
latitude	خط عرض	noun	medium
laugh	ضحك	verb	easy
laundry	غسيل	noun	easy
lay	وضع	verb	easy
lead	قيادة	verb	easy
leadership	قيادة	noun	medium
league	دوري	noun	medium
learn	تعلم	verb	easy
leave	مغادرة	verb	easy
leg	ساق	noun	easy
legend	أسطورة	noun	medium
lemon	ليمون	noun	easy
lens	عدسة	noun	medium
lentils	عدس	noun	medium
lesson	درس	noun	easy
let	سماح	verb	easy
lettuce	خس	noun	easy
levee	سد ترابي	noun	medium
level	مستوى	noun	easy
lid	غطاء	noun	easy
lie	كذب	verb	easy
likely	محتمل	adjective	medium
lime	ليمون أخضر	noun	medium
lion	أسد	noun	easy
lip	شفة	noun	easy
listen	استماع	verb	easy
liver	كبد	noun	medium
living	حي	adjective	easy
llama	لاما	noun	medium
lobster	جراد البحر	noun	medium
local	محلي	adjective	easy
lock	قفل	noun	easy
locker	خزانة	noun	easy
longitude	خط طول	noun	medium
loser	خاسر	noun	easy
loudly	بصوت عالٍ	adverb	easy
loving	محب	adjective	easy
lower	سفلي	adjective	medium
luggage	أمتعة	noun	medium
lyric	كلمات أغنية	noun	medium
macaroni	مكرونة	noun	medium
mad	غاضب	adjective	easy
magnetism	مغناطيسية	noun	medium
magnetometer	مقياس مغناطيسية	noun	medium
magpie	عقعق	noun	medium
mailbox	صندوق بريد	noun	easy
mailman	ساعي بريد	noun	medium
main	رئيسي	adjective	easy
mainly	أساساً	adverb	medium
make	صنع	verb	easy
mall	مركز تسوق	noun	easy
mallard	بطة برية	noun	medium
manager	مدير	noun	easy
manatee	خروف البحر	noun	medium
mansion	قصر	noun	medium
map	خريطة	noun	easy
maple	قيقب	noun	medium
marathon	ماراثون	noun	medium
marker	قلم تلوين	noun	easy
marry	زواج	verb	easy
marsh	مستنقع	noun	medium
mask	قناع	noun	easy
masterpiece	تحفة	noun	medium
match	مطابقة	verb	easy
math	رياضيات	noun	easy
matter	مادة	noun	easy
maximum	أقصى	adjective	medium
mayo	مايونيز	noun	medium
mayor	عمدة	noun	medium
medal	ميدالية	noun	easy
melon	بطيخ	noun	easy
melting	انصهار	noun	medium
member	عضو	noun	easy
messy	فوضوي	adjective	easy
metal	معدن	noun	easy
meteor	نيزك	noun	medium
metro	مترو	noun	easy
microphone	ميكروفون	noun	medium
microwave	ميكروويف	noun	easy
middle	أوسط	adjective	easy
mill	مطحنة	noun	medium
millipede	دودة ألفية	noun	medium
minimum	أدنى	adjective	medium
mining	تعدين	noun	medium
mint	نعناع	noun	easy
minus	سالب	adjective	easy
mirror	مرآة	noun	easy
miserable	بائس	adjective	medium
mite	عث	noun	medium
mittens	قفازات	noun	medium
mix	خلط	verb	easy
mode	منوال	noun	medium
model	نموذج	noun	easy
moist	رطب	adjective	medium
mole	خلد	noun	medium
monkey	قرد	noun	easy
monsoon	موسم الأمطار	noun	medium
monthly	شهري	adjective	easy
moody	متقلب المزاج	adjective	medium
moose	موظ	noun	medium
mop	ممسحة	noun	easy
moped	دراجة صغيرة	noun	medium
mosaic	فسيفساء	noun	medium
mosquito	بعوضة	noun	easy
moss	طحلب	noun	medium
mostly	في الغالب	adverb	easy
motel	نُزُل	noun	medium
moth	عثة	noun	easy
mother	أم	noun	easy
motor	محرك	noun	easy
mouse	فأر	noun	easy
mouth	فم	noun	easy
mud	طين	noun	easy
muffin	مافن	noun	medium
music	موسيقى	noun	easy
mussel	بلح البحر	noun	medium
mustache	شارب	noun	medium
mustard	خردل	noun	medium
myth	أسطورة	noun	medium
narrow	ضيق	adjective	easy
narwhal	حوت وحيد القرن	noun	medium
national	وطني	adjective	easy
natural	طبيعي	adjective	easy
navel	سرة	noun	medium
nearly	تقريباً	adverb	easy
neat	مرتب	adjective	easy
nectarine	نكتارين	noun	medium
negative	سلبي	adjective	easy
neither	لا هذا ولا ذاك	adjective	medium
nervously	بتوتر	adverb	medium
neutral	متعادل	adjective	medium
neutron	نيوترون	noun	medium
never	أبداً	adverb	easy
new	جديد	adjective	easy
newt	سمندل	noun	medium
next	التالي	adjective	easy
nightingale	بلبل	noun	medium
nightmare	كابوس	noun	medium
noisy	صاخب	adjective	easy
none	لا شيء	adjective	easy
noodle	نودلز	noun	easy
noon	ظهر	noun	easy
normal	طبيعي	adjective	easy
northern	شمالي	adjective	medium
note	نغمة	noun	easy
notebook	دفتر	noun	easy
notice	ملاحظة	verb	easy
now	الآن	adverb	easy
nowhere	في لا مكان	adverb	easy
nucleus	نواة	noun	medium
nurse	ممرضة	noun	easy
nut	جوزة	noun	easy
nutmeg	جوزة الطيب	noun	medium
oak	بلوط	noun	medium
oasis	واحة	noun	medium
oatmeal	شوفان	noun	medium
oats	شوفان	noun	medium
observe	ملاحظة	verb	easy
obviously	بوضوح	adverb	medium
occasionally	أحياناً	adverb	medium
odd	غريب	adjective	easy
often	غالباً	adverb	easy
oil	زيت	noun	easy
old	قديم	adjective	easy
omnivore	آكل كل شيء	noun	medium
onion	بصل	noun	easy
openly	علناً	adverb	medium
opera	أوبرا	noun	medium
orange	برتقالة	noun	easy
orca	حوت قاتل	noun	medium
order	طلب	verb	easy
ordinary	عادي	adjective	easy
organic	عضوي	adjective	medium
origami	أوريغامي	noun	medium
origin	أصل	noun	medium
original	أصلي	adjective	medium
other	آخر	adjective	easy
otter	قضاعة	noun	medium
outdoor	خارجي	adjective	easy
outer	خارجي	adjective	medium
outlet	مقبس	noun	medium
outraged	غاضب جداً	adjective	medium
outside	خارج	adverb	easy
oven	فرن	noun	easy
over	فوق	adverb	easy
own	ملكية	verb	easy
owner	مالك	noun	easy
oyster	محارة	noun	medium
package	طرد	noun	easy
paint	دهان	noun	easy
painting	لوحة	noun	easy
pale	شاحب	adjective	medium
palette	لوحة ألوان	noun	medium
palm	نخيل	noun	easy
pan	مقلاة	noun	easy
pancake	فطيرة	noun	easy
panda	باندا	noun	easy
panicked	مرعوب	adjective	medium
pantry	مخزن طعام	noun	medium
pants	بنطال	noun	easy
papaya	بابايا	noun	medium
parasite	طفيلي	noun	medium
parcel	طرد	noun	medium
parent	والد	noun	easy
parrot	ببغاء	noun	easy
particularly	خصوصاً	adverb	medium
partly	جزئياً	adverb	medium
partridge	حجل	noun	medium
passive	سلبي	adjective	medium
passport	جواز سفر	noun	easy
pasta	معكرونة	noun	easy
pasture	مرعى	noun	medium
path	مسار	noun	easy
patio	فناء	noun	medium
pavement	رصيف	noun	medium
peacock	طاووس	noun	medium
peak	قمة	noun	easy
pear	كمثرى	noun	easy
peas	بازلاء	noun	easy
pebble	حصاة	noun	medium
peel	تقشير	verb	easy
pelican	بجع	noun	medium
pencil	قلم رصاص	noun	easy
pendulum	بندول	noun	medium
percent	نسبة مئوية	noun	medium
perfect	مثالي	adjective	easy
performance	أداء	noun	easy
perpendicular	عمودي	adjective	medium
petal	بتلة	noun	medium
petrol	بنزين	noun	medium
pheasant	تدرج	noun	medium
phone	هاتف	noun	easy
photo	صورة	noun	easy
picture	صورة	noun	easy
pie	فطيرة	noun	easy
pigeon	حمامة	noun	easy
pigment	صبغة	noun	medium
pill	حبة دواء	noun	easy
pillow	وسادة	noun	easy
pine	صنوبر	noun	medium
pineapple	أناناس	noun	easy
pipette	ماصة	noun	medium
pitch	طبقة صوتية	noun	medium
pizza	بيتزا	noun	easy
place	وضع	verb	easy
plain	سهل	noun	easy
plane	طائرة	noun	easy
plasma	بلازما	noun	medium
plate	طبق	noun	easy
player	لاعب	noun	easy
playground	ملعب	noun	easy
plaza	ساحة	noun	medium
please	إرضاء	verb	easy
pleased	مسرور	adjective	easy
plenty	وفير	adjective	medium
pliers	كماشة	noun	medium
plug	قابس	noun	easy
plum	برقوق	noun	easy
plus	موجب	adjective	easy
poem	قصيدة	noun	easy
poet	شاعر	noun	easy
point	نقطة	noun	easy
pole	قطب	noun	medium
police	شرطة	noun	easy
politely	بأدب	adverb	medium
pollen	حبوب لقاح	noun	medium
polynomial	كثير حدود	noun	medium
pomegranate	رمان	noun	medium
pond	بركة	noun	easy
pony	مهر	noun	easy
poor	فقير	adjective	easy
porch	شرفة	noun	medium
porcupine	نيص	noun	medium
pork	لحم خنزير	noun	medium
port	ميناء	noun	easy
portion	حصة	noun	medium
positive	إيجابي	adjective	easy
possible	ممكن	adjective	easy
possibly	ربما	adverb	medium
postage	بريد	noun	medium
postcard	بطاقة بريدية	noun	easy
poster	ملصق	noun	easy
pot	قدر	noun	easy
potato	بطاطس	noun	easy
power	قدرة	noun	easy
practice	ممارسة	verb	easy
pray	صلاة	verb	easy
precipitation	هطول	noun	medium
prefer	تفضيل	verb	medium
present	عرض	verb	easy
presentation	عرض تقديمي	noun	medium
president	رئيس	noun	easy
pretty	جميل	adjective	easy
previously	سابقاً	adverb	medium
prime	عدد أولي	noun	medium
principal	مدير	noun	easy
print	طباعة	verb	easy
printer	طابعة	noun	easy
prism	منشور	noun	medium
private	خاص	adjective	easy
probably	على الأرجح	adverb	medium
project	مشروع	noun	easy
projector	جهاز عرض	noun	medium
prop	دعامة مسرحية	noun	medium
protein	بروتين	noun	medium
proton	بروتون	noun	medium
protractor	منقلة	noun	medium
proudly	بفخر	adverb	medium
province	مقاطعة	noun	medium
public	عام	adjective	easy
pufferfish	سمكة منتفخة	noun	medium
purse	حقيبة يد	noun	easy
put	وضع	verb	easy
quadrant	ربع	noun	medium
quail	سمان	noun	medium
quarry	محجر	noun	medium
quartet	رباعي	noun	medium
question	سؤال	verb	easy
quick	سريع	adjective	easy
quickly	بسرعة	adverb	easy
quiet	هادئ	adjective	easy
quietly	بهدوء	adverb	easy
quilt	لحاف	noun	medium
quit	ترك	verb	easy
quite	تماماً	adverb	easy
quiz	اختبار قصير	noun	easy
rabbit	أرنب	noun	easy
raccoon	راكون	noun	medium
racing	سباق	noun	easy
radiation	إشعاع	noun	medium
radiator	مشعاع	noun	medium
radio	راديو	noun	easy
radioactive	مشع	adjective	medium
raft	طوافة	noun	medium
rainforest	غابة مطيرة	noun	medium
raise	رفع	verb	easy
ranch	مزرعة	noun	medium
rapidly	بسرعة	adverb	medium
rarely	نادراً	adverb	medium
raspberry	توت أحمر	noun	medium
rather	بدلاً	adverb	medium
raven	غراب أسود	noun	medium
ray	شفنين	noun	medium
reach	وصول	verb	easy
reading	قراءة	noun	easy
ready	جاهز	adjective	easy
real	حقيقي	adjective	easy
really	حقاً	adverb	easy
recently	مؤخراً	adverb	easy
recital	حفل	noun	medium
recite	تلاوة	verb	medium
record	رقم قياسي	noun	easy
referee	حكم	noun	medium
reflect	انعكاس	verb	medium
reflection	انعكاس	noun	medium
refract	انكسار	verb	medium
refraction	انكسار	noun	medium
regarding	بجودة	noun	hard
rehearsal	بروفة	noun	medium
reindeer	رنة	noun	medium
relate	ربط	verb	medium
relax	استرخاء	verb	easy
relaxed	مسترخٍ	adjective	medium
relay	سباق تتابع	noun	medium
release	إطلاق	verb	medium
relieved	مرتاح	adjective	medium
remain	بقاء	verb	medium
remember	تذكر	verb	easy
repeat	تكرار	verb	easy
reply	رد	verb	easy
report	تقرير	noun	easy
reproduction	تكاثر	noun	medium
reservoir	خزان	noun	medium
resistance	مقاومة	noun	medium
return	عودة	verb	easy
rhino	وحيد القرن	noun	medium
ride	ركوب	verb	easy
right	يمين	adjective	easy
risky	محفوف بالمخاطر	adjective	medium
rna	حمض نووي ريبوزي	noun	medium
robin	أبو الحن	noun	medium
rocket	صاروخ	noun	easy
roller	أسطوانة دهان	noun	medium
rollerblade	حذاء تزلج	noun	medium
rooster	ديك	noun	easy
rough	خشن	adjective	easy
rowing	تجديف	noun	medium
rub	فرك	verb	easy
rude	وقح	adjective	easy
rudely	بوقاحة	adverb	medium
rug	بساط	noun	easy
rugby	رغبي	noun	medium
ruler	مسطرة	noun	easy
runner	عداء	noun	easy
running	جري	noun	easy
rush	عجلة	verb	easy
rust	صدأ	noun	medium
sad	حزين	adjective	easy
sadly	بحزن	adverb	easy
sailboat	قارب شراعي	noun	medium
sailing	إبحار	noun	medium
salad	سلطة	noun	easy
salamander	سلمندر	noun	medium
salmon	سلمون	noun	medium
salty	مالح	adjective	easy
sandal	صندل	noun	easy
sandwich	ساندويتش	noun	easy
satisfied	راضٍ	adjective	medium
sauce	صلصة	noun	easy
sausage	نقانق	noun	medium
savanna	سافانا	noun	medium
save	حفظ	verb	easy
saw	منشار	noun	easy
say	قول	verb	easy
scale	ميزان	noun	easy
scanner	ماسح	noun	medium
scar	ندبة	noun	medium
scared	خائف	adjective	easy
scarf	وشاح	noun	easy
scenery	ديكور	noun	medium
school	مدرسة	noun	easy
science	علوم	noun	easy
scissors	مقص	noun	easy
scooter	سكوتر	noun	easy
score	درجة	noun	easy
scoreboard	لوحة النتائج	noun	medium
screwdriver	مفك	noun	medium
sea	بحر	noun	easy
seahorse	فرس البحر	noun	medium
seatbelt	حزام أمان	noun	medium
secretly	سراً	adverb	medium
secure	آمن	adjective	medium
seldom	نادراً	adverb	medium
selfish	أناني	adjective	medium
semester	فصل دراسي	noun	medium
semiconductor	شبه موصل	noun	medium
serious	جدي	adjective	easy
seriously	بجدية	adverb	medium
serve	خدمة	verb	easy
serving	حصة	noun	medium
set	وضع	verb	easy
several	عدة	adjective	easy
sew	خياطة	verb	medium
sewing	خياطة	noun	medium
shade	ظل	noun	easy
shake	ميلك شيك	noun	easy
shallow	ضحل	adjective	medium
shampoo	شامبو	noun	easy
share	مشاركة	verb	easy
sharp	حاد	adjective	easy
sheep	خروف	noun	easy
sheet	ملاءة	noun	easy
shelf	رف	noun	easy
shelter	مأوى	noun	medium
shin	قصبة الساق	noun	medium
shine	لمعان	verb	easy
shipment	شحنة	noun	medium
shirt	قميص	noun	easy
shocked	مصدوم	adjective	medium
shoe	حذاء	noun	easy
shoot	تسديد	verb	easy
short	قصير	adjective	easy
shorts	شورت	noun	easy
shout	صراخ	verb	easy
shower	دش	noun	easy
shrimp	جمبري	noun	easy
shrink	انكماش	verb	medium
shrub	شجيرة	noun	medium
shut	إغلاق	verb	easy
silent	صامت	adjective	easy
silently	بصمت	adverb	medium
silly	سخيف	adjective	easy
silo	صومعة	noun	medium
silver	فضة	noun	easy
similar	مشابه	adjective	easy
simple	بسيط	adjective	easy
simply	ببساطة	adverb	easy
since	منذ ذلك الحين	noun	easy
sister	أخت	noun	easy
sit	جلوس	verb	easy
skate	تزلج	verb	easy
skateboard	لوح تزلج	noun	easy
skater	متزلج	noun	medium
skating	تزلج	noun	easy
sketch	رسم تخطيطي	noun	medium
ski	تزلج	verb	easy
skier	متزلج على الثلج	noun	medium
skiing	تزلج على الثلج	noun	easy
skirt	تنورة	noun	easy
skull	جمجمة	noun	medium
skunk	ظربان	noun	medium
sleepy	نعسان	adjective	easy
slide	انزلاق	verb	easy
slipper	شبشب	noun	medium
slippery	زلق	adjective	medium
slowly	ببطء	adverb	easy
slug	بزاق	noun	medium
smoothie	عصير مخلوط	noun	medium
snack	وجبة خفيفة	noun	easy
snail	حلزون	noun	easy
sneaker	حذاء رياضي	noun	easy
sneeze	عطس	noun	easy
soccer	كرة قدم	noun	easy
sock	جورب	noun	easy
soda	مشروب غازي	noun	easy
sofa	أريكة	noun	easy
softball	سوفتبول	noun	medium
softly	بلطف	adverb	easy
soldier	جندي	noun	easy
solemn	وقور	adjective	medium
solo	منفرد	noun	medium
solute	مذاب	noun	medium
solvent	مذيب	noun	medium
sometimes	أحياناً	adverb	easy
somewhere	في مكان ما	adverb	easy
sorry	آسف	adjective	easy
sound	صوت	noun	easy
southern	جنوبي	adjective	medium
spacecraft	مركبة فضائية	noun	medium
spaghetti	سباغيتي	noun	easy
spare	احتياطي	adjective	medium
speak	تحدث	verb	easy
special	خاص	adjective	easy
spectator	متفرج	noun	medium
spectrum	طيف	noun	medium
speech	خطاب	noun	easy
speed	سرعة	noun	easy
speedboat	قارب سريع	noun	medium
spell	تهجئة	verb	easy
spelling	إملاء	noun	easy
spend	إنفاق	verb	easy
spicy	حار	adjective	easy
spider	عنكبوت	noun	easy
spill	سكب	verb	easy
spit	بصق	verb	medium
split	تقسيم	verb	medium
sponge	إسفنجة	noun	easy
spoon	ملعقة	noun	easy
spotlight	ضوء كشاف	noun	medium
spread	انتشار	verb	easy
spring	نبع	noun	easy
sprint	عدو سريع	noun	medium
squad	فريق	noun	medium
squid	حبار	noun	medium
stage	مسرح	noun	easy
stale	قديم	adjective	medium
stamp	طابع	noun	easy
stand	وقوف	verb	easy
star	نجم	noun	easy
starfish	نجم البحر	noun	easy
start	بداية	verb	easy
state	ولاية	noun	easy
statistics	إحصاء	noun	medium
statue	تمثال	noun	easy
steak	شريحة لحم	noun	easy
steal	سرقة	verb	easy
steering	توجيه	noun	medium
stem	ساق	noun	easy
stew	يخنة	noun	medium
stick	لصق	verb	easy
sticky	لزج	adjective	medium
still	ما زال	adverb	easy
stilllife	طبيعة صامتة	noun	medium
stingray	شفنين لاسع	noun	medium
stomach	معدة	noun	easy
stone	حجر	noun	easy
stool	مقعد	noun	medium
store	متجر	noun	easy
stork	لقلق	noun	medium
storm	عاصفة	noun	easy
story	قصة	noun	easy
stove	موقد	noun	easy
strait	مضيق	noun	medium
strange	غريب	adjective	easy
strawberry	فراولة	noun	easy
street	شارع	noun	easy
strength	قوة	noun	easy
stressed	متوتر	adjective	medium
strike	ضرب	verb	easy
stroller	عربة أطفال	noun	medium
strong	قوي	adjective	easy
strongly	بقوة	adverb	medium
student	طالب	noun	easy
study	دراسة	verb	easy
style	أسلوب	noun	easy
subject	مادة	noun	easy
suddenly	فجأة	adverb	easy
sugar	سكر	noun	easy
suitcase	حقيبة سفر	noun	easy
summer	صيف	noun	easy
sunrise	شروق	noun	easy
sunset	غروب	noun	easy
supper	عشاء	noun	easy
suppose	افتراض	verb	medium
surely	بالتأكيد	adverb	medium
surfing	ركوب الأمواج	noun	medium
surgery	جراحة	noun	medium
surprise	مفاجأة	verb	easy
surprised	مندهش	adjective	easy
swallow	سنونو	noun	medium
sweater	سترة صوف	noun	easy
sweet	حلو	adjective	easy
swift	سريع	adjective	medium
swim	سباحة	verb	easy
swimmer	سباح	noun	easy
swimming	سباحة	noun	easy
swing	تأرجح	verb	easy
switch	مفتاح	noun	easy
symbiosis	تعايش	noun	medium
symbol	رمز	noun	easy
zodiac	برج	noun	medium
zinc	زنك	noun	medium
zen	تأمل	noun	medium
zoo	حديقة حيوان	noun	easy
`);
