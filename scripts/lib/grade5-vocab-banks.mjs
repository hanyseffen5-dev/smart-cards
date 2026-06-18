/** Candidate word banks for grade 5 vocabulary chunks (filtered at generation time). */

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

export const BANK_A = parse(`
hypotenuse	وتر قائم الزاوية	noun	hard
mitosis	انقسام متساوٍ	noun	hard
meiosis	انقسام منصف	noun	hard
allele	أليل	noun	hard
genotype	نمط جيني	noun	hard
phenotype	مظهر ظاهري	noun	hard
heredity	وراثة	noun	hard
mutation	طفرة	noun	hard
parasitism	تطفل	noun	hard
mutualism	تكافل	noun	hard
commensalism	تعايش	noun	hard
trophic-level	مستوى غذائي	noun	hard
paleontology	علم الأحياء القديمة	noun	hard
organelle	عضية	noun	hard
anaerobic-process	عملية لاهوائية	noun	hard
aerobic-respiration	تنفس هوائي	noun	hard
ion-charge	شحنة أيون	noun	hard
electron-orbital	مدار إلكتروني	noun	hard
light-diffraction	حيود الضوء	noun	hard
thermal-conductivity	توصيل حراري	noun	hard
fluid-buoyancy	طفو السوائل	noun	hard
liquid-viscosity	لزوجة السائل	noun	hard
radioactive-half-life	نصف العمر المشع	noun	hard
liquid-suspension	معلق سائل	noun	hard
colloid-mixture	خليط غروي	noun	hard
oil-emulsion	مستحلب زيتي	noun	hard
crystal-formation	تبلور	noun	hard
ice-sublimation	تسامي الجليد	noun	hard
binomial-expression	تعبير ذو حدين	noun	hard
trinomial-expression	تعبير ثلاثي الحدود	noun	hard
polynomial-expression	كثير حدود	noun	hard
monomial-term	حد أحادي	noun	hard
prime-factorization	تحليل إلى عوامل	noun	hard
math-combination	تركيب رياضي	noun	hard
score-percentile	مئوية	noun	hard
data-scatterplot	مخطط انتشار	noun	hard
data-interpolate	استيفاء البيانات	verb	hard
data-extrapolate	استقراء البيانات	verb	hard
angle-radian	راديان الزاوية	noun	hard
curve-asymptote	خط تقارب	noun	hard
secant-line	خط قاطع	noun	hard
tangent-line	خط مماس	noun	hard
circle-sector	قطاع دائري	noun	hard
line-segment	قطعة مستقيمة	noun	hard
loop-iteration	تكرار حلقة	noun	hard
oxidation-process	عملية أكسدة	noun	hard
reduction-process	عملية اختزال	noun	hard
redox-reaction	تفاعل أكسدة واختزال	noun	hard
ionic-bond	رابطة أيونية	noun	hard
covalent-bond	رابطة تساهمية	noun	hard
metallic-bond	رابطة فلزية	noun	hard
chemical-reactant	متفاعل كيميائي	noun	hard
exothermic-reaction	تفاعل طارد للحرارة	noun	hard
endothermic-reaction	تفاعل ماص للحرارة	noun	hard
combustible-fuel	وقود قابل للاشتعال	noun	hard
corrosive-acid	حمض آكل	noun	hard
alkaline-solution	محلول قلوي	noun	hard
litmus-paper	ورق عباد الشمس	noun	hard
stoichiometry-ratio	نسبة قياس كيميائي	noun	hard
molar-mass	كتلة مولية	noun	hard
motion-kinematics	حركة	noun	hard
force-dynamics	ديناميكا القوى	noun	hard
body-statics	سكون الأجسام	noun	hard
simple-wedge	إسفين بسيط	noun	hard
machine-efficiency	كفاءة الآلة	noun	hard
energy-joule	جول الطاقة	noun	hard
power-watt	واط القدرة	noun	hard
pressure-pascal	باسكال الضغط	noun	hard
temp-kelvin	كلفن الحرارة	noun	hard
air-barometer	بارومتر هواء	noun	hard
wind-anemometer	مقياس الرياح	noun	hard
humidity-hygrometer	مقياس الرطوبة	noun	hard
wave-oscillation	تذبذب	noun	hard
object-vibration	اهتزاز	noun	hard
sound-resonance	رنين صوتي	noun	hard
motion-damping	تخميد	noun	hard
cell-cytology	علم الخلايا	noun	hard
tissue-histology	علم الأنسجة	noun	hard
animal-zoology	علم الحيوان	noun	hard
plant-botany	علم النبات	noun	hard
species-taxonomy	تصنيف الأنواع	noun	hard
animal-phylum	شعبة حيوانية	noun	hard
species-genus	جنس حيوي	noun	hard
backbone-vertebrate	فقاري	noun	hard
spineless-invertebrate	لافقاري	noun	hard
night-nocturnal	ليلي	adjective	hard
day-diurnal	نهاري	adjective	hard
winter-hibernation	سبات شتوي	noun	hard
animal-mimicry	محاكاة	noun	hard
species-speciation	تكوين أنواع	noun	hard
shape-cross-section	مقطع عرضي	noun	hard
side-lateral	جانبي	adjective	hard
shape-apex	قمة	noun	hard
slant-height	ارتفاع مائل	noun	hard
oblique-angle	زاوية مائلة	adjective	hard
angle-reflex	زاوية منعكسة	noun	hard
shape-rhomboid	معيني	noun	hard
shape-trapezoid	شبه منحرف	noun	hard
shape-parallelogram	متوازي أضلاع	noun	hard
glass-prism	منشور زجاجي	noun	hard
square-pyramid	هرم رباعي	noun	hard
metal-cylinder	أسطوانة معدنية	noun	hard
ball-sphere	كرة	noun	hard
earth-hemisphere	نصف كرة	noun	hard
shape-dilation	تمدد	noun	hard
math-transformation	تحويل هندسي	noun	hard
tile-tessellate	تبليط	verb	hard
math-fractal	فركتالي	noun	hard
calc-surface-area	مساحة سطح	noun	hard
calc-lateral-area	مساحة جانبية	noun	hard
fraction-cross-multiply	ضرب تبادلي	verb	hard
proportional-reasoning	تفكير تناسبي	noun	hard
ratio-table	جدول نسب	noun	hard
double-number-line	خط أعداد مزدوج	noun	hard
bar-model	نموذج شريطي	noun	hard
tape-diagram	مخطط شريطي	noun	hard
stem-and-leaf	ساق ورقة	noun	hard
box-and-whisker	صندوق وشارب	noun	hard
line-plot	مخطط خطي	noun	hard
circle-graph	مخطط دائري	noun	hard
random-sample	عينة عشوائية	noun	hard
biased-sample	عينة متحيزة	noun	hard
survey-data	بيانات استطلاع	noun	hard
frequency-table	جدول تكرار	noun	hard
relative-frequency	تكرار نسبي	noun	hard
compound-event	حدث مركب	noun	hard
independent-event	حدث مستقل	noun	hard
dependent-event	حدث تابع	noun	hard
theoretical-probability	احتمال نظري	noun	hard
experimental-probability	احتمال تجريبي	noun	hard
fair-dice	نرد عادل	noun	hard
tree-diagram	مخطط شجري	noun	hard
fundamental-counting	عد أساسي	noun	hard
sample-space	فضاء العينة	noun	hard
outcome-list	قائمة النتائج	noun	hard
computer-simulation	محاكاة حاسوبية	noun	hard
microscope-slide	شريحة مجهر	noun	hard
petri-dish	صحن بتري	noun	hard
graduated-cylinder	أسطوانة مدرجة	noun	hard
triple-beam-balance	ميزان ثلاثي	noun	hard
spring-scale	ميزان نابض	noun	hard
force-meter	مقياس قوة	noun	hard
inclined-plane	سطح مائل	noun	hard
pulley-block	بكرة	noun	hard
gear-ratio	نسبة تروس	noun	hard
lever-arm	ذراع رافعة	noun	hard
mechanical-advantage	ميزة ميكانيكية	noun	hard
simple-machine	آلة بسيطة	noun	hard
compound-machine	آلة مركبة	noun	hard
circuit-board	لوحة دوائر	noun	hard
series-circuit	دائرة على التوالي	noun	hard
parallel-circuit	دائرة على التوازي	noun	hard
open-circuit	دائرة مفتوحة	noun	hard
closed-circuit	دائرة مغلقة	noun	hard
short-circuit	دائرة قصر	noun	hard
battery-electrolyte	إلكتروليت البطارية	noun	hard
metal-electrode	قطب كهربائي	noun	hard
battery-anode	أنود	noun	hard
battery-cathode	كاثود	noun	hard
galvanic-cell	خلية جلفانية	noun	hard
magnetic-field	مجال مغناطيسي	noun	hard
magnetic-pole	قطب مغناطيسي	noun	hard
electromagnetism	كهرمغناطيسية	noun	hard
induction-coil	ملف حث	noun	hard
transformer-core	قلب محول	noun	hard
solar-photovoltaic	خلايا شمسية	adjective	hard
rooftop-solar-panel	لوح شمسي	noun	hard
offshore-wind-turbine	توربين رياح بحري	noun	hard
hydroelectric-dam	سد كهرمائي	noun	hard
geothermal-plant	محطة حرارية أرضية	noun	hard
biomass-energy	طاقة كتلة حيوية	noun	hard
nuclear-fission	انشطار نووي	noun	hard
nuclear-fusion	اندماج نووي	noun	hard
radioactive-decay	تحلل مشع	noun	hard
carbon-dating	تأريخ كربوني	noun	hard
lab-spectroscope	مطياف	noun	hard
refracting-telescope	تلسكوب انكساري	noun	hard
reflecting-telescope	تلسكوب انعكاسي	noun	hard
visible-light-spectrum	طيف ضوئي	noun	hard
ultraviolet-light	فوق بنفسجي	adjective	hard
infrared-light	تحت أحمر	adjective	hard
microwave-radiation	إشعاع ميكروي	noun	hard
gamma-ray	أشعة غاما	noun	hard
medical-x-ray	أشعة سينية	noun	hard
sound-wave	موجة صوت	noun	hard
longitudinal-wave	موجة طولية	noun	hard
transverse-wave	موجة عرضية	noun	hard
wave-crest	قمة الموجة	noun	hard
wave-trough	قاع الموجة	noun	hard
wavelength-measure	قياس طول موج	noun	hard
frequency-hertz	تردد هرتز	noun	hard
pitch-change	تغير طبقة	noun	hard
echo-effect	تأثير صدى	noun	hard
doppler-effect	تأثير دوبلر	noun	hard
heat-conduction	توصيل حراري	noun	hard
convection-current	تيار حمل	noun	hard
heat-radiation	إشعاع حراري	noun	hard
insulator-material	مادة عازلة	noun	hard
specific-heat	سعة حرارية	noun	hard
phase-change	تحول طور	noun	hard
metal-melting-point	نقطة انصهار	noun	hard
water-boiling-point	نقطة غليان	noun	hard
water-freezing-point	نقطة تجمد	noun	hard
vapor-condensation	تكثف بخار	noun	hard
liquid-evaporation	تبخر	noun	hard
air-humidity-level	مستوى رطوبة	noun	hard
atmospheric-pressure	ضغط جوي	noun	hard
altitude-effect	تأثير الارتفاع	noun	hard
weather-front	جبهة جوية	noun	hard
cold-front	جبهة باردة	noun	hard
warm-front	جبهة دافئة	noun	hard
stationary-front	جبهة ثابتة	noun	hard
occluded-front	جبهة مغلقة	noun	hard
isobar-line	خط تساوي ضغط	noun	hard
isotherm-line	خط تساوي حرارة	noun	hard
topographic-map	خريطة طبوغرافية	noun	hard
contour-interval	فترة كنتور	noun	hard
elevation-profile	ملف ارتفاع	noun	hard
watershed-area	منطقة تصريف	noun	hard
aquifer-layer	طبقة مياه	noun	hard
soil-porosity	مسامية التربة	noun	hard
soil-permeability	نفاذية التربة	noun	hard
soil-composition	تركيب التربة	noun	hard
rock-cycle	دورة الصخور	noun	hard
sedimentary-rock	صخر رسوبي	noun	hard
metamorphic-rock	صخر متحول	noun	hard
igneous-rock	صخر ناري	noun	hard
mineral-streak	خط معدن	noun	hard
Mohs-hardness-scale	مقياس صلابة	noun	hard
crystal-lattice	شبكة بلورية	noun	hard
fossil-imprint	أثر أحفوري	noun	hard
index-fossil	أحفورة مؤشرة	noun	hard
geologic-time-scale	زمن جيولوجي	noun	hard
geologic-era	حقبة جيولوجية	noun	hard
geologic-epoch	عصر جيولوجي	noun	hard
plate-boundary	حدود صفائح	noun	hard
convergent-boundary	حدود تقارب	noun	hard
divergent-boundary	حدود تباعد	noun	hard
transform-boundary	حدود تحويل	noun	hard
subduction-zone	منطقة غوص	noun	hard
mid-ocean-ridge	سلسلة محيطية	noun	hard
rift-valley	وادي انفصال	noun	hard
earth-fault-line	خط صدع	noun	hard
normal-fault	صدع طبيعي	noun	hard
reverse-fault	صدع عكسي	noun	hard
strike-slip-fault	صدع انزلاقي	noun	hard
quake-epicenter	مركز زلزال	noun	hard
quake-focus-depth	عمق بؤرة	noun	hard
quake-magnitude-scale	مقياس قوة	noun	hard
Richter-magnitude	مقياس ريختر	noun	hard
quake-aftershock	هزة ارتدادية	noun	hard
tsunami-wave	موجة تسونامي	noun	hard
volcanic-ash	رماد بركاني	noun	hard
lava-flow	تدفق حمم	noun	hard
magma-chamber	حجرة صهارة	noun	hard
pyroclastic-flow	تدفق انفجاري	noun	hard
Pacific-ring-of-fire	حزام ناري	noun	hard
cell-membrane	غشاء خلوي	noun	hard
cell-nucleus	نواة خلوية	noun	hard
cell-cytoplasm	سيتوبلازم	noun	hard
chloroplast-organelle	بلاستيدات خضراء	noun	hard
mitochondria-organelle	ميتوكوندريا	noun	hard
cell-wall-plant	جدار خلوي	noun	hard
osmosis-process	عملية تناضح	noun	hard
diffusion-process	عملية انتشار	noun	hard
active-transport	نقل نشط	noun	hard
passive-transport	نقل سلبي	noun	hard
photosynthesis-process	عملية تركيب ضوئي	noun	hard
cellular-respiration	تنفس خلوي	noun	hard
food-chain-link	حلقة سلسلة غذائية	noun	hard
food-web-diagram	شبكة غذائية	noun	hard
energy-pyramid	هرم طاقة	noun	hard
biome-region	منطقة حيوية	noun	hard
ecosystem-balance	توازن بيئي	noun	hard
habitat-niche	موطن بيئي	noun	hard
predator-prey	فترس وفريسة	noun	hard
symbiosis-relation	تكافل	noun	hard
carbon-cycle	دورة الكربون	noun	hard
nitrogen-cycle	دورة النيتروجين	noun	hard
water-cycle	دورة الماء	noun	hard
renewable-resource	مورد متجدد	noun	hard
nonrenewable-resource	مورد غير متجدد	noun	hard
fossil-fuel-deposit	وقود أحفوري	noun	hard
greenhouse-effect	تأثير دفيئة	noun	hard
climate-change-pattern	نمط تغير مناخي	noun	hard
ozone-layer	طبقة الأوزون	noun	hard
acid-rain-effect	تأثير أمطار حمضية	noun	hard
pollution-source	مصدر تلوث	noun	hard
conservation-effort	جهد حفظ	noun	hard
recycling-process	عملية إعادة تدوير	noun	hard
variable-expression	تعبير متغير	noun	hard
algebraic-equation	معادلة جبرية	noun	hard
inequality-symbol	رمز متباينة	noun	hard
coordinate-plane	مستوى إحداثي	noun	hard
ordered-pair	زوج مرتب	noun	hard
x-intercept-point	تقاطع محور س	noun	hard
y-intercept-point	تقاطع محور ص	noun	hard
slope-formula	صيغة الميل	noun	hard
rate-of-change	معدل التغير	noun	hard
unit-rate-value	معدل وحدة	noun	hard
percent-increase	زيادة نسبية	noun	hard
percent-decrease	نقص نسبي	noun	hard
sales-tax-rate	معدل ضريبة	noun	hard
tip-calculation	حساب بقشيش	noun	hard
markup-price	سعر زيادة	noun	hard
discount-rate	معدل خصم	noun	hard
simple-interest-formula	فائدة بسيطة	noun	hard
compound-interest-formula	فائدة مركبة	noun	hard
volume-formula	صيغة حجم	noun	hard
capacity-measure	قياس سعة	noun	hard
metric-conversion	تحويل متري	noun	hard
customary-unit	وحدة تقليدية	noun	hard
precision-measure	دقة قياس	noun	hard
accuracy-check	فحص دقة	noun	hard
significant-digit	رقم معنوي	noun	hard
scientific-notation-form	تدوين علمي	noun	hard
order-of-operations	ترتيب العمليات	noun	hard
exponent-rule	قاعدة أس	noun	hard
square-root-value	جذر تربيعي	noun	hard
cube-root-value	جذر تكعيبي	noun	hard
prime-number-test	اختبار عدد أولي	noun	hard
greatest-common-factor	القاسم المشترك الأكبر	noun	hard
least-common-multiple	المضاعف المشترك الأصغر	noun	hard
improper-fraction	كسر غير فعلي	noun	hard
mixed-number-form	عدد كسري	noun	hard
decimal-place-value	قيمة منزلة عشرية	noun	hard
rounding-estimate	تقريب	noun	hard
front-end-estimation	تقدير أمامي	noun	hard
compatible-numbers	أعداد متوافقة	noun	hard
mental-math-strategy	استراتيجية ذهنية	noun	hard
input-output-table	جدول مدخل مخرج	noun	hard
function-rule	قاعدة دالة	noun	hard
pattern-sequence	تسلسل أنماط	noun	hard
arithmetic-sequence	تسلسل حسابي	noun	hard
geometric-sequence	تسلسل هندسي	noun	hard
Pythagorean-theorem	نظرية فيثاغورس	noun	hard
right-triangle-proof	برهان مثلث قائم	noun	hard
net-diagram-3d	شبكة مجسم	noun	hard
cross-section-view	منظر مقطع	noun	hard
scale-drawing-ratio	نسبة رسم	noun	hard
blueprint-design	مخطط تصميم	noun	hard
engineering-design-process	عملية تصميم هندسي	noun	hard
prototype-model	نموذج أولي	noun	hard
variable-control	متغير ضابط	noun	hard
control-group-test	مجموعة ضابطة	noun	hard
experimental-group-test	مجموعة تجريبية	noun	hard
hypothesis-statement	فرضية	noun	hard
conclusion-data	استنتاج	noun	hard
lab-safety-rule	قاعدة سلامة مختبر	noun	hard
safety-goggles-wear	نظارات وقاية	noun	hard
bunsen-burner-flame	لهب بونسن	noun	hard
test-tube-holder	حامل أنبوب	noun	hard
beaker-measurement	قياس بالكوب	noun	hard
pipette-dropper	قطارة	noun	hard
filter-paper-use	ورق ترشيح	noun	hard
evaporating-dish	صحن تبخير	noun	hard
ring-stand-setup	حامل حلقي	noun	hard
data-table-record	جدول بيانات	noun	hard
graph-interpretation	تفسير رسم	noun	hard
trend-line-analysis	تحليل خط اتجاه	noun	hard
outlier-data-point	قيمة شاذة	noun	hard
mean-average-value	متوسط حسابي	noun	hard
median-middle-value	وسيط	noun	hard
mode-frequency-value	منوال	noun	hard
range-data-spread	مدى	noun	hard
vector-quantity	كمية متجهة	noun	hard
scalar-quantity	كمية قياسية	noun	hard
net-force-sum	محصلة القوى	noun	hard
friction-coefficient	معامل احتكاك	noun	hard
centripetal-force	قوة جاذبة مركزية	noun	hard
centrifugal-effect	تأثير طرد مركزي	noun	hard
momentum-conservation	حفظ الزخم	noun	hard
energy-conservation-law	قانون حفظ الطاقة	noun	hard
work-energy-theorem	نظرية الشغل والطاقة	noun	hard
power-output-rate	معدل القدرة	noun	hard
density-calculation	حساب الكثافة	noun	hard
pressure-gradient-force	قوة تدرج الضغط	noun	hard
Bernoulli-principle	مبدأ برنولي	noun	hard
Archimedes-principle	مبدأ أرخميدس	noun	hard
Pascal-principle-law	مبدأ باسكال	noun	hard
Ohm-law-formula	قانون أوم	noun	hard
Coulomb-law-force	قانون كولوم	noun	hard
Faraday-induction-law	قانون فاراداي	noun	hard
Newton-third-law	قانون نيوتن الثالث	noun	hard
Snell-refraction-law	قانون سنيل	noun	hard
ideal-gas-law	قانون الغاز المثالي	noun	hard
Boyle-pressure-law	قانون بويل	noun	hard
Charles-volume-law	قانون شارل	noun	hard
Mendel-inheritance-law	قانون مندل للوراثة	noun	hard
DNA-replication-step	خطوة تضاعف الحمض النووي	noun	hard
RNA-transcription-process	عملية نسخ الرنا	noun	hard
protein-synthesis-step	خطوة تركيب البروتين	noun	hard
enzyme-catalyst-role	دور الإنزيم المحفز	noun	hard
substrate-binding-site	موقع ارتباط الركيزة	noun	hard
antibody-immune-response	استجابة مناعية بالأجسام المضادة	noun	hard
vaccine-immunity-boost	تعزيز المناعة باللقاح	noun	hard
pathogen-disease-agent	عامل مرضي	noun	hard
bacteria-colony-growth	نمو مستعمرة بكتيرية	noun	hard
virus-particle-structure	بنية جسيم فيروسي	noun	hard
fungi-spore-release	إطلاق أبواغ فطرية	noun	hard
protist-single-cell	كائن وحيد الخلية أولي	noun	hard
`);

export const BANK_B = parse(`
silk-road-trade	تجارة طريق الحرير	noun	hard
ancient-egypt-study	دراسة مصر القديمة	noun	hard
mesopotamia-civilization	حضارة بلاد الرافدين	noun	hard
indus-valley-culture	ثقافة وادي السند	noun	hard
han-dynasty-era	عصر أسرة هان	noun	hard
tang-dynasty-period	فترة أسرة تانغ	noun	hard
roman-republic-system	نظام الجمهورية الرومانية	noun	hard
byzantine-empire-period	فترة الإمبراطورية البيزنطية	noun	hard
crusade-movement	حركة الحروب الصليبية	noun	hard
renaissance-period	فترة عصر النهضة	noun	hard
enlightenment-thought	فكر عصر التنوير	noun	hard
industrial-revolution-era	عصر الثورة الصناعية	noun	hard
abolition-movement	حركة إلغاء الرق	noun	hard
suffrage-campaign	حملة حق الاقتراع	noun	hard
civil-rights-era	عصر الحقوق المدنية	noun	hard
cold-war-period	فترة الحرب الباردة	noun	hard
berlin-wall-fall	سقوط جدار برلين	noun	hard
united-nations-charter	ميثاق الأمم المتحدة	noun	hard
nato-alliance-pact	حلف الناتو	noun	hard
world-war-one-study	دراسة الحرب العالمية الأولى	noun	hard
world-war-two-study	دراسة الحرب العالمية الثانية	noun	hard
great-depression-era	عصر الكساد الكبير	noun	hard
new-deal-program	برنامج الصفقة الجديدة	noun	hard
manifest-destiny-idea	فكرة القدر الظاهر	noun	hard
louisiana-purchase-deal	صفقة لويزيانا	noun	hard
oregon-trail-route	مسار أوريغون	noun	hard
underground-railroad-network	شبكة السكك السرية	noun	hard
emancipation-proclamation-doc	وثيقة إعلان التحرير	noun	hard
reconstruction-period	فترة إعادة الإعمار	noun	hard
westward-expansion-era	عصر التوسع غرباً	noun	hard
gold-rush-period	فترة اندفاع الذهب	noun	hard
transcontinental-railroad-line	خط سكة حديد قاري	noun	hard
immigration-wave-study	دراسة موجات الهجرة	noun	hard
ellis-island-gateway	بوابة جزيرة إيليس	noun	hard
progressive-era-reform	إصلاح العصر التقدمي	noun	hard
women-suffrage-victory	انتصار حق المرأة في الاقتراع	noun	hard
prohibition-amendment-era	عصر التعديل بحظر الخمور	noun	hard
great-migration-movement	حركة الهجرة الكبرى	noun	hard
harlem-renaissance-culture	ثقافة نهضة هارلم	noun	hard
dust-bowl-disaster	كارثة وعاء الغبار	noun	hard
pearl-harbor-attack-event	حدث هجوم بيرل هاربور	noun	hard
d-day-invasion-battle	معركة إنزال النورماندي	noun	hard
holocaust-remembrance-study	دراسة ذكرى الهولوكوست	noun	hard
civil-rights-march-event	حدث مسيرة الحقوق المدنية	noun	hard
space-race-competition	سباق الفضاء	noun	hard
apollo-moon-landing	هبوط أبولو على القمر	noun	hard
vietnam-war-conflict	صراع حرب فيتنام	noun	hard
watergate-scandal-case	قضية فضيحة ووترغيت	noun	hard
fall-of-berlin-wall	سقوط جدار برلين	noun	hard
arab-spring-movement	حركة الربيع العربي	noun	hard
primary-source-document	وثيقة مصدر أولي	noun	hard
secondary-source-analysis	تحليل مصدر ثانوي	noun	hard
oral-history-interview	مقابلة تاريخ شفهي	noun	hard
artifact-museum-piece	قطعة أثرية في المتحف	noun	hard
archaeological-dig-site	موقع حفريات	noun	hard
timeline-sequence-chart	مخطط تسلسل زمني	noun	hard
cause-effect-chain	سلسلة السبب والنتيجة	noun	hard
historical-perspective-view	منظور تاريخي	noun	hard
bias-source-check	فحص تحيز المصدر	noun	hard
corroborating-evidence-set	مجموعة أدلة مؤيدة	noun	hard
map-projection-type	نوع إسقاط الخريطة	noun	hard
latitude-coordinate-line	خط خط العرض	noun	hard
longitude-coordinate-line	خط خط الطول	noun	hard
equator-reference-line	خط الاستواء المرجعي	noun	hard
prime-meridian-line	خط غرينتش الأول	noun	hard
tropic-cancer-line	مدار السرطان	noun	hard
tropic-capricorn-line	مدار الجدي	noun	hard
arctic-circle-zone	منطقة الدائرة القطبية الشمالية	noun	hard
antarctic-circle-zone	منطقة الدائرة القطبية الجنوبية	noun	hard
international-date-line	خط تغيير التاريخ	noun	hard
time-zone-boundary	حدود المنطقة الزمنية	noun	hard
population-density-map	خريطة كثافة السكان	noun	hard
urban-sprawl-pattern	نمط التمدد الحضري	noun	hard
rural-settlement-type	نوع مستوطنة ريفية	noun	hard
nomadic-lifestyle-pattern	نمط حياة بدوي	noun	hard
agricultural-society-model	نموذج مجتمع زراعي	noun	hard
irrigation-canal-system	نظام قناة ري	noun	hard
trade-route-network	شبكة طرق التجارة	noun	hard
cultural-diffusion-process	عملية الانتشار الثقافي	noun	hard
ethnic-diversity-study	دراسة التنوع العرقي	noun	hard
folk-tradition-practice	ممارسة تقليد شعبي	noun	hard
religious-pilgrimage-journey	رحلة حج ديني	noun	hard
language-family-group	مجموعة عائلة لغوية	noun	hard
dialect-regional-form	شكل لهجة إقليمية	noun	hard
cultural-heritage-site	موقع تراث ثقافي	noun	hard
world-heritage-listing	إدراج تراث عالمي	noun	hard
mountain-range-system	نظام سلسلة جبلية	noun	hard
river-basin-watershed	حوض نهري	noun	hard
delta-formation-zone	منطقة تكوين دلتا	noun	hard
coastal-erosion-process	عملية تآكل ساحلي	noun	hard
coral-reef-ecosystem	نظام الشعاب المرجانية	noun	hard
rainforest-biome-zone	منطقة غابة مطيرة	noun	hard
desert-climate-region	منطقة مناخ صحراوي	noun	hard
tundra-climate-zone	منطقة مناخ التندرا	noun	hard
monsoon-season-pattern	نمط موسم الرياح الموسمية	noun	hard
hurricane-tracking-map	خريطة تتبع الأعاصير	noun	hard
tornado-alley-region	منطقة ممر الأعاصير	noun	hard
flood-plain-area	منطقة سهل فيضاني	noun	hard
drought-resistant-crop	محصول مقاوم للجفاف	noun	hard
deforestation-impact-study	دراسة أثر إزالة الغابات	noun	hard
renewable-energy-region	منطقة طاقة متجددة	noun	hard
natural-resource-map	خريطة الموارد الطبيعية	noun	hard
mining-town-history	تاريخ بلدة تعدين	noun	hard
port-city-trade-hub	مركز تجارة مينائي	noun	hard
border-dispute-case	قضية نزاع حدودي	noun	hard
territory-annexation-event	حدث ضم إقليم	noun	hard
independence-movement-leader	قائد حركة استقلال	noun	hard
decolonization-period	فترة إزالة الاستعمار	noun	hard
pan-african-congress-meeting	اجتماع مؤتمر عموم أفريقيا	noun	hard
nonaligned-movement-policy	سياسة حركة عدم الانحياز	noun	hard
human-rights-declaration-doc	وثيقة إعلان حقوق الإنسان	noun	hard
refugee-crisis-response	استجابة أزمة لاجئين	noun	hard
humanitarian-aid-mission	مهمة مساعدة إنسانية	noun	hard
peacekeeping-force-role	دور قوة حفظ السلام	noun	hard
treaty-negotiation-process	عملية تفاوض معاهدة	noun	hard
diplomatic-embassy-role	دور السفارة الدبلوماسية	noun	hard
sanctions-policy-tool	أداة سياسة العقوبات	noun	hard
constitution-preamble-text	نص دستور المقدمة	noun	hard
bill-of-rights-amendment	تعديل وثيقة الحقوق	noun	hard
separation-of-powers-rule	قاعدة فصل السلطات	noun	hard
checks-balances-system	نظام الموازنات والرقابة	noun	hard
judicial-review-power	سلطة المراجعة القضائية	noun	hard
electoral-college-vote	صوت المجمع الانتخابي	noun	hard
presidential-veto-power	سلطة النقض الرئاسي	noun	hard
senate-filibuster-tactic	تكتيك إعاقة مجلس الشيوخ	noun	hard
referendum-ballot-vote	تصويت استفتاء	noun	hard
initiative-petition-drive	حملة عريضة مبادرة	noun	hard
municipal-government-role	دور الحكومة البلدية	noun	hard
county-government-service	خدمة حكومة المقاطعة	noun	hard
state-legislature-chamber	غرفة الهيئة التشريعية للولاية	noun	hard
executive-branch-duty	واجب السلطة التنفيذية	noun	hard
legislative-branch-duty	واجب السلطة التشريعية	noun	hard
judicial-branch-duty	واجب السلطة القضائية	noun	hard
citizenship-responsibility-duty	واجب مسؤولية المواطنة	noun	hard
naturalization-ceremony-event	حدث مراسم التجنس	noun	hard
due-process-protection	حماية الإجراءات القانونية	noun	hard
equal-protection-clause	بند الحماية المتساوية	noun	hard
freedom-of-press-right	حق حرية الصحافة	noun	hard
freedom-of-assembly-right	حق حرية التجمع	noun	hard
search-warrant-requirement	متطلب مذكرة تفتيش	noun	hard
jury-trial-system	نظام المحاكمة بالهيئة	noun	hard
appellate-court-level	مستوى محكمة الاستئناف	noun	hard
district-court-level	مستوى المحكمة الفيدرالية	noun	hard
supreme-court-ruling	حكم المحكمة العليا	noun	hard
civic-duty-participation	مشاركة الواجب المدني	noun	hard
voter-registration-process	عملية تسجيل الناخبين	noun	hard
polling-place-location	موقع مركز الاقتراع	noun	hard
campaign-finance-rule	قاعدة تمويل الحملات	noun	hard
lobbying-group-influence	تأثير جماعة ضغط	noun	hard
public-policy-proposal	اقتراح سياسة عامة	noun	hard
taxation-fairness-debate	جدال عدالة الضرائب	noun	hard
budget-allocation-process	عملية تخصيص الميزانية	noun	hard
infrastructure-funding-plan	خطة تمويل البنية التحتية	noun	hard
public-education-policy	سياسة التعليم العام	noun	hard
healthcare-access-issue	قضية الوصول للرعاية الصحية	noun	hard
environmental-regulation-law	قانون تنظيم بيئي	noun	hard
zoning-land-use-rule	قاعدة استخدام الأراضي	noun	hard
census-data-collection	جمع بيانات التعداد	noun	hard
demographic-trend-analysis	تحليل اتجاه ديموغرافي	noun	hard
gentrification-neighborhood-change	تغير حي بسبب التطوير	noun	hard
suburban-growth-pattern	نمط نمو الضواحي	noun	hard
megacity-urban-challenge	تحدي مدينة ضخمة	noun	hard
globalization-trade-effect	أثر التجارة العالمية	noun	hard
fair-trade-certification	شهادة التجارة العادلة	noun	hard
supply-chain-disruption	اضطراب سلسلة الإمداد	noun	hard
microfinance-small-loan	قرض صغير للتمويل الأصغر	noun	hard
sustainable-development-goal	هدف تنمية مستدامة	noun	hard
unesco-school-partnership	شراكة مدرسة مع اليونسكو	noun	hard
world-bank-loan-program	برنامج قرض البنك الدولي	noun	hard
imf-economic-policy	سياسة صندوق النقد الدولي	noun	hard
g7-summit-meeting	اجتماع قمة مجموعة السبع	noun	hard
asean-regional-bloc	كتلة آسيان الإقليمية	noun	hard
european-union-treaty	معاهدة الاتحاد الأوروبي	noun	hard
african-union-charter	ميثاق الاتحاد الأفريقي	noun	hard
opec-oil-policy	سياسة أوبك النفطية	noun	hard
belt-road-initiative	مبادرة الحزام والطريق	noun	hard
suez-canal-passage	ممر قناة السويس	noun	hard
panama-canal-trade-route	طريق تجارة قناة بنما	noun	hard
himalaya-mountain-barrier	حاجز جبال الهيمالايا	noun	hard
sahara-desert-crossing	عبور الصحراء الكبرى	noun	hard
amazon-river-basin	حوض نهر الأمازون	noun	hard
nile-river-civilization	حضارة نهر النيل	noun	hard
ganges-river-worship	عبادة نهر الغانج	noun	hard
yellow-river-valley	وادي النهر الأصفر	noun	hard
mediterranean-trade-sea	بحر التجارة المتوسطي	noun	hard
caribbean-island-culture	ثقافة جزر الكاريبي	noun	hard
pacific-island-nation	أمة جزر المحيط الهادئ	noun	hard
scandinavian-welfare-model	نموذج الرفاه الاسكندنافي	noun	hard
baltic-state-history	تاريخ دول البلطيق	noun	hard
balkans-ethnic-conflict	صراع عرقي في البلقان	noun	hard
kurdish-cultural-identity	هوية ثقافية كردية	noun	hard
berber-north-africa-group	مجموعة أمازيغ شمال أفريقيا	noun	hard
maasai-pastoral-culture	ثقافة رعوية ماساي	noun	hard
inuit-arctic-lifestyle	أسلوب حياة إينوي قطبي	noun	hard
aboriginal-dreamtime-story	قصة زمن الأحلام الأصلية	noun	hard
native-american-treaty-right	حق معاهدة السكان الأصليين	noun	hard
hawaiian-sovereignty-movement	حركة سيادة هاواي	noun	hard
aztec-empire-legacy	إرث إمبراطورية الأزتك	noun	hard
inca-terrace-farming	زراعة مدرجات الإنكا	noun	hard
maya-calendar-system	نظام تقويم المايا	noun	hard
viking-exploration-route	مسار استكشاف الفايكنج	noun	hard
magellan-circumnavigation-voyage	رحلة دارين حول العالم	noun	hard
columbian-exchange-impact	أثر التبادل الكولومبي	noun	hard
triangular-trade-route	طريق التجارة المثلث	noun	hard
middle-passage-history	تاريخ الرحلة الوسطى	noun	hard
plantation-economy-system	نظام اقتصاد المزارع	noun	hard
sharecropping-agreement-form	شكل اتفاقية المشاركة في المحصول	noun	hard
homestead-act-land-grant	منحة أرض بقانون الاستيطان	noun	hard
interstate-highway-system	نظام الطرق السريعة بين الولايات	noun	hard
subway-transit-network	شبكة مترو الأنفاق	noun	hard
high-speed-rail-project	مشروع قطار فائق السرعة	noun	hard
airport-hub-connection	اتصال محور مطار	noun	hard
container-shipping-port	ميناء شحن حاويات	noun	hard
global-positioning-system-use	استخدام نظام تحديد المواقع	noun	hard
remote-sensing-satellite-data	بيانات الأقمار الاستشعارية	noun	hard
geographic-information-system	نظام المعلومات الجغرافية	noun	hard
cartography-skill-lesson	درس مهارة رسم الخرائط	noun	hard
compass-bearing-reading	قراءة اتجاه البوصلة	noun	hard
scale-bar-map-reading	قراءة مقياس الخريطة	noun	hard
legend-symbol-interpretation	تفسير رموز مفتاح الخريطة	noun	hard
choropleth-map-style	أسلوب خريطة كوروبليث	noun	hard
dot-density-map-style	أسلوب خريطة كثافة النقاط	noun	hard
flow-line-map-pattern	نمط خريطة خطوط التدفق	noun	hard
thematic-map-category	فئة خريطة موضوعية	noun	hard
physical-features-map	خريطة المعالم الطبيعية	noun	hard
political-boundary-map	خريطة الحدود السياسية	noun	hard
economic-activity-map	خريطة النشاط الاقتصادي	noun	hard
climate-zone-map	خريطة مناطق المناخ	noun	hard
vegetation-region-map	خريطة مناطق الغطاء النباتي	noun	hard
elevation-shading-technique	تقنية تظليل الارتفاع	noun	hard
cross-section-profile-draw	رسم مقطع عرضي	noun	hard
grid-coordinate-system	نظام إحداثيات الشبكة	noun	hard
absolute-location-point	نقطة الموقع المطلق	noun	hard
relative-location-phrase	عبارة الموقع النسبي	noun	hard
push-pull-migration-factor	عامل دفع وسحب الهجرة	noun	hard
brain-drain-phenomenon	ظاهرة هجرة الكفاءات	noun	hard
remittance-money-transfer	تحويل حوالات المغتربين	noun	hard
diaspora-community-network	شبكة مجتمع الشتات	noun	hard
multicultural-festival-event	حدث مهرجان متعدد الثقافات	noun	hard
interfaith-dialogue-forum	منتدى حوار بين الأديان	noun	hard
secular-governance-model	نموذج حكم علماني	noun	hard
theocratic-state-example	مثال دولة ثيوقراطية	noun	hard
constitutional-monarchy-system	نظام ملكية دستورية	noun	hard
parliamentary-democracy-model	نموذج ديمقراطية برلمانية	noun	hard
direct-democracy-referendum	استفتاء ديمقراطية مباشرة	noun	hard
representative-democracy-election	انتخاب ديمقراطية تمثيلية	noun	hard
rule-of-law-principle	مبدأ سيادة القانون	noun	hard
social-contract-theory	نظرية العقد الاجتماعي	noun	hard
civil-disobedience-tactic	تكتيك العصيان المدني	noun	hard
grassroots-campaign-organizing	تنظيم حملة شعبية	noun	hard
town-hall-meeting-forum	منتدى اجتماع البلدة	noun	hard
public-hearing-testimony	شهادة جلسة استماع عامة	noun	hard
freedom-of-information-request	طلب حرية المعلومات	noun	hard
whistleblower-protection-law	قانون حماية المبلغين	noun	hard
anti-corruption-investigation	تحقيق مكافحة الفساد	noun	hard
transparency-accountability-rule	قاعدة الشفافية والمساءلة	noun	hard
civic-virtue-character-trait	صفة فضيلة مدنية	noun	hard
patriotism-national-pride	فخر وطني ووطنية	noun	hard
tolerance-diversity-value	قيمة التسامح والتنوع	noun	hard
human-dignity-principle	مبدأ الكرامة الإنسانية	noun	hard
universal-suffrage-right	حق الاقتراع العام	noun	hard
minority-rights-protection	حماية حقوق الأقليات	noun	hard
affirmative-action-policy	سياسة التمييز الإيجابي	noun	hard
gender-equality-law	قانون المساواة بين الجنسين	noun	hard
disability-access-law	قانون إتاحة ذوي الإعاقة	noun	hard
child-labor-reform-law	قانون إصلاح عمالة الأطفال	noun	hard
labor-union-strike-action	إجراء إضراب نقابة العمال	noun	hard
minimum-wage-policy	سياسة الحد الأدنى للأجور	noun	hard
consumer-protection-agency	وكالة حماية المستهلك	noun	hard
antitrust-monopoly-law	قانون مكافحة الاحتكار	noun	hard
intellectual-property-patent	براءة ملكية فكرية	noun	hard
copyright-fair-use-rule	قاعدة الاستخدام العادل للحقوق	noun	hard
public-domain-resource	مورد الملكية العامة	noun	hard
open-government-data-portal	بوابة بيانات حكومية مفتوحة	noun	hard
e-governance-service-portal	بوابة خدمة الحكومة الإلكترونية	noun	hard
digital-citizenship-skill	مهارة المواطنة الرقمية	noun	hard
media-literacy-lesson	درس محو الأمية الإعلامية	noun	hard
fact-checking-habit-skill	مهارة عادة التحقق من الحقائق	noun	hard
propaganda-technique-analysis	تحليل تقنية الدعاية	noun	hard
cold-war-propaganda-poster	ملصق دعاية الحرب الباردة	noun	hard
iron-curtain-division	تقسيم الستار الحديدي	noun	hard
berlin-airlift-operation	عملية الإمداد الجوي لبرلين	noun	hard
marshall-plan-reconstruction	إعادة الإعمار بخطة مارشال	noun	hard
truman-doctrine-policy	سياسة مبدأ ترومان	noun	hard
containment-policy-strategy	استراتيجية سياسة الاحتواء	noun	hard
domino-theory-argument	حجة نظرية الدومينو	noun	hard
brinkmanship-crisis-tactic	تكتيك أزمة المغامرة	noun	hard
détente-thaw-period	فترة انفراج التوتر	noun	hard
glasnost-openness-policy	سياسة الغلاسنوست للانفتاح	noun	hard
perestroika-reform-policy	سياسة البيريسترويكا للإصلاح	noun	hard
fall-communism-europe	سقوط الشيوعية في أوروبا	noun	hard
european-integration-process	عملية التكامل الأوروبي	noun	hard
brexit-referendum-vote	تصويت استفتاء بريكست	noun	hard
scottish-independence-debate	جدال استقلال اسكتلندا	noun	hard
catalonia-autonomy-dispute	نزاع استقلال كاتالونيا	noun	hard
kashmir-territorial-dispute	نزاع إقليم كشمير	noun	hard
south-china-sea-claim	مطالبة بحر الصين الجنوبي	noun	hard
arctic-resource-claim	مطالبة موارد القطب الشمالي	noun	hard
antarctic-treaty-system	نظام معاهدة أنتاركتيكا	noun	hard
outer-space-treaty-rule	قاعدة معاهدة الفضاء الخارجي	noun	hard
nuclear-nonproliferation-treaty	معاهدة حظر انتشار الأسلحة النووية	noun	hard
geneva-convention-protection	حماية اتفاقية جنيف	noun	hard
war-crimes-tribunal-case	قضية محكمة جرائم الحرب	noun	hard
truth-reconciliation-commission	لجنة الحقيقة والمصالحة	noun	hard
memorial-monument-design	تصميم نصب تذكاري	noun	hard
museum-curator-role	دور أمين المتحف	noun	hard
archivist-record-keeping	حفظ السجلات الأرشيفية	noun	hard
genealogy-family-tree-study	دراسة شجرة العائلة	noun	hard
heraldry-coat-of-arms	شعار النبالة	noun	hard
feudal-manor-system	نظام المزرعة الإقطاعية	noun	hard
knighthood-chivalry-code	مدونة الفروسية والبطولة	noun	hard
guild-trade-association	جمعية نقابة الحرف	noun	hard
printing-press-revolution	ثورة المطبعة	noun	hard
scientific-revolution-period	فترة الثورة العلمية	noun	hard
age-of-exploration-era	عصر الاستكشاف	noun	hard
atlantic-slave-trade-history	تاريخ تجارة الرق عبر الأطلسي	noun	hard
enlightenment-salon-gathering	تجمع صالون عصر التنوير	noun	hard
french-revolution-event	حدث الثورة الفرنسية	noun	hard
haitian-independence-victory	انتصار استقلال هايتي	noun	hard
latin-american-independence-wave	موجة استقلال أمريكا اللاتينية	noun	hard
meiji-restoration-reform	إصلاح استعادة ميجي	noun	hard
boxer-rebellion-uprising	انتفاضة ثورة الملاكمين	noun	hard
ottoman-empire-decline	تراجع الإمبراطورية العثمانية	noun	hard
mughal-architecture-legacy	إرث العمارة المغولية	noun	hard
silk-weaving-tradition	تقليد نسج الحرير	noun	hard
spice-trade-monopoly	احتكار تجارة التوابل	noun	hard
maritime-navigation-chart	مخطط ملاحة بحرية	noun	hard
astrolabe-navigation-tool	أداة ملاحة الأسطرولاب	noun	hard
longitude-problem-solution	حل مشكلة خط الطول	noun	hard
chronometer-ship-clock	ساعة سفينة كرونومتر	noun	hard
`);

export const BANK_C = parse(`
narrative-arc-structure	بنية قوس السرد	noun	hard
plot-twist-element	عنصر انقلاب الحبكة	noun	hard
rising-action-sequence	تسلسل تصاعد الأحداث	noun	hard
falling-action-sequence	تسلسل هبوط الأحداث	noun	hard
climax-scene-moment	لحظة مشهد الذروة	noun	hard
resolution-ending-scene	مشهد خاتمة الحل	noun	hard
exposition-opening-passage	فقرة افتتاحية تعريفية	noun	hard
flashback-memory-scene	مشهد استرجاع ذاكرة	noun	hard
foreshadowing-hint-phrase	عبارة تلميح استباقي	noun	hard
symbolic-object-motif	دافع شيء رمزي	noun	hard
theme-central-idea	فكرة موضوع مركزي	noun	hard
moral-lesson-message	رسالة الدرس الأخلاقي	noun	hard
tone-mood-shift	تحول النبرة والمزاج	noun	hard
voice-narrator-style	أسلوب صوت الراوي	noun	hard
point-of-view-choice	اختيار زاوية الرؤية	noun	hard
first-person-narration	سرد المتكلم	noun	hard
third-person-limited-view	رؤية الغائب المحدودة	noun	hard
omniscient-narrator-voice	صوت الراوي العليم	noun	hard
unreliable-narrator-trick	حيلة الراوي غير الموثوق	noun	hard
dialogue-tag-variety	تنوع وسوم الحوار	noun	hard
internal-monologue-passage	فقرة مونولوج داخلي	noun	hard
stream-of-consciousness-style	أسلوب تيار الوعي	noun	hard
figurative-language-use	استخدام اللغة المجازية	noun	hard
simile-comparison-phrase	عبارة تشبيه	noun	hard
metaphor-implied-comparison	تشبيه ضمني استعاري	noun	hard
personification-human-trait	إضفاء صفة بشرية	noun	hard
hyperbole-exaggeration-line	سطر مبالغة	noun	hard
understatement-subtle-claim	ادعاء متواضع	noun	hard
onomatopoeia-sound-word	كلمة محاكاة صوت	noun	hard
alliteration-repeated-sound	تكرار صوتي	noun	hard
assonance-vowel-echo	صدى حرف علة	noun	hard
consonance-consonant-echo	صدى حرف ساكن	noun	hard
rhyme-scheme-pattern	نمط قافية	noun	hard
meter-rhythm-pattern	نمط إيقاع الشعر	noun	hard
stanza-poem-section	قسم من القصيدة	noun	hard
free-verse-poem-form	شكل شعر حر	noun	hard
blank-verse-line	بيت شعر غير مقفى	noun	hard
epic-poem-tradition	تقليد الملحمة الشعرية	noun	hard
lyric-poem-form	شكل قصيدة غنائية	noun	hard
narrative-poem-tale	قصة شعرية سردية	noun	hard
dramatic-monologue-speech	خطاب مونولوج درامي	noun	hard
prose-poetry-blend	مزيج نثر وشعر	noun	hard
mythology-origin-tale	حكاية أصل أسطورية	noun	hard
folktale-oral-tradition	تقليد الحكاية الشعبية	noun	hard
fable-moral-story	قصة أخلاقية حكاية	noun	hard
legend-heroic-tale	حكاية بطولية أسطورة	noun	hard
tall-tale-exaggeration	حكاية مبالغ فيها	noun	hard
fairy-tale-motif	دافع حكاية خرافية	noun	hard
trickster-character-archetype	نموذج شخصية الماكر	noun	hard
hero-journey-archetype	نموذج رحلة البطل	noun	hard
villain-antagonist-role	دور الشرير المنافس	noun	hard
sidekick-support-character	شخصية مساعدة	noun	hard
mentor-guide-figure	شخصية المرشد	noun	hard
foil-contrast-character	شخصية تباين	noun	hard
round-character-depth	عمق شخصية متعددة الأبعاد	noun	hard
flat-character-type	نوع شخصية مسطحة	noun	hard
dynamic-character-change	تغير شخصية ديناميكية	noun	hard
static-character-trait	صفة شخصية ثابتة	noun	hard
character-motivation-goal	هدف دافع الشخصية	noun	hard
conflict-internal-struggle	صراع داخلي	noun	hard
conflict-external-struggle	صراع خارجي	noun	hard
man-versus-nature-plot	حبكة إنسان ضد الطبيعة	noun	hard
man-versus-society-plot	حبكة إنسان ضد المجتمع	noun	hard
man-versus-self-plot	حبكة إنسان ضد الذات	noun	hard
setting-time-place	زمان ومكان القصة	noun	hard
dystopian-setting-world	عالم خيالي كئيب	noun	hard
utopian-setting-world	عالم خيالي مثالي	noun	hard
genre-fiction-category	فئة أدب الخيال	noun	hard
science-fiction-subgenre	فرع خيال علمي	noun	hard
fantasy-fiction-subgenre	فرع خيال فانتازي	noun	hard
mystery-fiction-subgenre	فرع قصص الغموض	noun	hard
historical-fiction-subgenre	فرع خيال تاريخي	noun	hard
realistic-fiction-subgenre	فرع خيال واقعي	noun	hard
graphic-novel-format	صيغة رواية مصورة	noun	hard
short-story-form	شكل قصة قصيرة	noun	hard
novella-length-work	عمل بطول الرواية القصيرة	noun	hard
anthology-story-collection	مجموعة قصص	noun	hard
bestseller-list-ranking	ترتيب قائمة الأكثر مبيعاً	noun	hard
book-review-paragraph	فقرة مراجعة كتاب	noun	hard
literary-criticism-essay	مقال نقد أدبي	noun	hard
author-biography-study	دراسة سيرة المؤلف	noun	hard
publishing-house-role	دور دار النشر	noun	hard
editorial-revision-process	عملية التحرير التحريري	noun	hard
proofreading-final-check	فحص التدقيق النهائي	noun	hard
manuscript-draft-version	نسخة مسودة مخطوطة	noun	hard
bibliography-source-list	قائمة المراجع	noun	hard
footnote-citation-note	حاشية إحالة	noun	hard
endnote-reference-mark	علامة مرجع ختامي	noun	hard
plagiarism-avoidance-rule	قاعدة تجنب الانتحال	noun	hard
paraphrase-source-sentence	إعادة صياغة جملة مصدر	noun	hard
summary-condensed-passage	فقرة ملخصة	noun	hard
annotation-margin-note	ملاحظة هامشية	noun	hard
close-reading-strategy	استراتيجية قراءة متأنية	noun	hard
text-evidence-quote	اقتباس دليل نصي	noun	hard
inference-reading-skill	مهارة استنتاج القراءة	noun	hard
context-clue-strategy	استراتيجية دليل السياق	noun	hard
prefix-meaning-clue	دليل معنى البادئة	noun	hard
suffix-meaning-clue	دليل معنى اللاحقة	noun	hard
root-word-meaning	معنى الجذر اللغوي	noun	hard
etymology-word-origin	أصل الكلمة	noun	hard
synonym-word-pair	زوج مرادف	noun	hard
antonym-word-pair	زوج متضاد	noun	hard
homophone-sound-alike	متجانس صوتي	noun	hard
homograph-spelling-alike	متجانس كتابة	noun	hard
denotation-literal-meaning	معنى حرفي	noun	hard
connotation-implied-feeling	معنى ضمني عاطفي	noun	hard
vocabulary-context-sentence	جملة سياق مفردات	noun	hard
word-choice-precision	دقة اختيار الكلمة	noun	hard
thesaurus-synonym-search	بحث مرادفات	noun	hard
dictionary-definition-entry	مدخل تعريف القاموس	noun	hard
glossary-term-list	قائمة مصطلحات	noun	hard
spelling-pattern-rule	قاعدة نمط إملائي	noun	hard
syllable-division-mark	علامة تقسيم المقاطع	noun	hard
accent-stress-mark	علامة نبرة التشديد	noun	hard
capitalization-title-rule	قاعدة كتابة العناوين	noun	hard
punctuation-comma-rule	قاعدة الفاصلة	noun	hard
semicolon-join-rule	قاعدة الفاصلة المنقوطة	noun	hard
colon-list-intro-rule	قاعدة النقطتين للقائمة	noun	hard
apostrophe-possession-mark	علامة الملكية	noun	hard
quotation-mark-dialogue	علامات اقتباس الحوار	noun	hard
em-dash-interruption-mark	شرطة طويلة للمقاطعة	noun	hard
en-dash-range-mark	شرطة متوسطة للمدى	noun	hard
parenthesis-aside-phrase	عبارة بين قوسين	noun	hard
ellipsis-trailing-dots	نقاط حذف	noun	hard
hyphen-compound-join	واصلة ربط مركب	noun	hard
sentence-fragment-error	خطأ جملة ناقصة	noun	hard
run-on-sentence-error	خطأ جملة مطولة	noun	hard
comma-splice-error	خطأ وصل بفاصلة	noun	hard
subject-verb-agreement-rule	قاعدة توافق الفاعل والفعل	noun	hard
pronoun-antecedent-agreement	توافق الضمير والمشار إليه	noun	hard
verb-tense-consistency	اتساق زمن الفعل	noun	hard
past-perfect-tense-form	صيغة الماضي التام	noun	hard
future-perfect-tense-form	صيغة المستقبل التام	noun	hard
conditional-mood-sentence	جملة صيغة الشرط	noun	hard
subjunctive-mood-form	صيغة المجزوم	noun	hard
active-voice-sentence	جملة مبنية للمعلوم	noun	hard
passive-voice-sentence	جملة مبنية للمجهول	noun	hard
transitive-verb-object	فعل متعدٍ بمفعول	noun	hard
intransitive-verb-use	استخدام فعل لازم	noun	hard
linking-verb-complement	فعل رابط بمكمل	noun	hard
helping-verb-phrase	عبارة فعل مساعد	noun	hard
modal-verb-ability	فعل مساعد للقدرة	noun	hard
gerund-phrase-subject	مصدر كفاعل	noun	hard
infinitive-phrase-purpose	عبارة مصدر للغرض	noun	hard
participle-phrase-modifier	عبارة اسم مفعول كوصف	noun	hard
appositive-phrase-rename	عبارة بدل	noun	hard
prepositional-phrase-modifier	عبارة جر كوصف	noun	hard
adjective-phrase-order	ترتيب عبارة الصفة	noun	hard
adverb-placement-rule	قاعدة موضع الظرف	noun	hard
comparative-adjective-form	صيغة صفة مقارنة	noun	hard
superlative-adjective-form	صيغة صفة تفضيل	noun	hard
irregular-verb-conjugation	تصريف فعل شاذ	noun	hard
noun-plural-formation	تكوين جمع الاسم	noun	hard
possessive-noun-form	صيغة اسم الملكية	noun	hard
collective-noun-agreement	توافق الاسم الجمع	noun	hard
abstract-noun-concept	مفهوم اسم مجرد	noun	hard
concrete-noun-object	اسم محسوس	noun	hard
proper-noun-capitalization	كتابة اسم علم	noun	hard
common-noun-category	فئة اسم مشترك	noun	hard
compound-subject-verb-rule	قاعدة فعل مع فاعل مركب	noun	hard
compound-sentence-structure	بنية جملة مركبة	noun	hard
complex-sentence-structure	بنية جملة معقدة	noun	hard
compound-complex-sentence	جملة مركبة معقدة	noun	hard
simple-sentence-structure	بنية جملة بسيطة	noun	hard
independent-clause-unit	جملة مستقلة	noun	hard
dependent-clause-unit	جملة تابعة	noun	hard
adverbial-clause-time	جملة ظرف زمان	noun	hard
adverbial-clause-reason	جملة ظرف سبب	noun	hard
noun-clause-subject	جملة اسمية كفاعل	noun	hard
relative-clause-modifier	جملة موصولة كوصف	noun	hard
restrictive-clause-phrase	جملة تقييدية	noun	hard
nonrestrictive-clause-phrase	جملة غير تقييدية	noun	hard
parallel-structure-list	قائمة تركيب متوازٍ	noun	hard
sentence-variety-technique	تقنية تنويع الجمل	noun	hard
transition-word-bridge	كلمة انتقالية جسر	noun	hard
topic-sentence-paragraph	جملة موضوع الفقرة	noun	hard
concluding-sentence-wrap	جملة ختامية للفقرة	noun	hard
paragraph-cohesion-flow	تدفق تماسك الفقرة	noun	hard
essay-thesis-statement	عبارة أطروحة المقال	noun	hard
essay-outline-structure	بنية مخطط المقال	noun	hard
introduction-hook-sentence	جملة افتتاحية جاذبة	noun	hard
body-paragraph-argument	فقرة حجة في المتن	noun	hard
counterclaim-paragraph-block	فقرة حجة مضادة	noun	hard
rebuttal-response-paragraph	فقرة رد على الحجة	noun	hard
conclusion-call-to-action	خاتمة دعوة للعمل	noun	hard
five-paragraph-essay-form	شكل مقال من خمس فقرات	noun	hard
compare-contrast-essay-type	نوع مقال مقارنة وتباين	noun	hard
cause-effect-essay-type	نوع مقال السبب والنتيجة	noun	hard
problem-solution-essay-type	نوع مقال المشكلة والحل	noun	hard
persuasive-essay-goal	هدف مقال إقناعي	noun	hard
informative-essay-goal	هدف مقال إعلامي	noun	hard
narrative-essay-goal	هدف مقال سردي	noun	hard
research-paper-format	صيغة ورقة بحث	noun	hard
annotated-bibliography-entry	مدخل مراجع مشروح	noun	hard
literature-review-section	قسم مراجعة الأدبيات	noun	hard
methodology-section-report	قسم المنهجية في التقرير	noun	hard
results-section-summary	ملخص قسم النتائج	noun	hard
discussion-section-analysis	تحليل قسم المناقشة	noun	hard
abstract-summary-paragraph	فقرة ملخص موجز	noun	hard
keyword-search-strategy	استراتيجية بحث بالكلمات	noun	hard
note-taking-cornell-method	طريقة كورنيل لتدوين الملاحظات	noun	hard
outline-numbering-system	نظام ترقيم المخطط	noun	hard
brainstorming-cluster-map	خريطة عصف ذهني	noun	hard
freewriting-warmup-exercise	تمرين كتابة حرة إحماء	noun	hard
peer-review-feedback-sheet	ورقة ملاحظات مراجعة الأقران	noun	hard
revision-checklist-item	بند قائمة مراجعة	noun	hard
editing-proof-stage	مرحلة التحرير والتدقيق	noun	hard
publishing-final-draft	مسودة نهائية للنشر	noun	hard
blog-post-format	صيغة منشور مدونة	noun	hard
news-article-lead	مقدمة خبر صحفي	noun	hard
inverted-pyramid-structure	بنية الهرم المقلوب	noun	hard
headline-writing-skill	مهارة كتابة العناوين	noun	hard
byline-author-credit	سطر اسم الكاتب	noun	hard
dateline-location-tag	وسم مكان التاريخ	noun	hard
editorial-opinion-piece	مقال رأي تحريري	noun	hard
feature-story-profile	قصة ملف شخصية	noun	hard
human-interest-angle	زاوية اهتمام إنساني	noun	hard
investigative-report-series	سلسلة تقرير استقصائي	noun	hard
press-release-announcement	بيان صحفي	noun	hard
media-ethics-guideline	إرشاد أخلاقيات الإعلام	noun	hard
libel-slander-distinction	تمييز القذف والتشهير	noun	hard
source-confidentiality-rule	قاعدة سرية المصدر	noun	hard
on-the-record-quote	اقتباس على السجل	noun	hard
off-the-record-comment	تعليق خارج السجل	noun	hard
broadcast-script-format	صيغة نص إذاعي	noun	hard
podcast-episode-outline	مخطط حلقة بودكاست	noun	hard
photojournalism-image-story	قصة صورة صحفية	noun	hard
caption-writing-skill	مهارة كتابة التسمية التوضيحية	noun	hard
infographic-design-layout	تخطيط تصميم إنفوغرافيك	noun	hard
social-media-post-caption	تسمية منشور تواصل	noun	hard
hashtag-topic-tag	وسم موضوع هاشتاغ	noun	hard
clickbait-headline-critique	نقد عنوان جاذب للنقر	noun	hard
misinformation-fact-check	تحقق من معلومات مضللة	noun	hard
debate-resolution-topic	موضوع قرار المناظرة	noun	hard
affirmative-side-argument	حجة جانب المؤيد	noun	hard
negative-side-argument	حجة جانب المعارض	noun	hard
cross-examination-question	سؤال استجواب متقاطع	noun	hard
rebuttal-speech-segment	جزء خطاب الرد	noun	hard
closing-argument-summary	ملخص الحجة الختامية	noun	hard
opening-statement-hook	افتتاحية جاذبة	noun	hard
evidence-card-citation	بطاقة دليل مع إحالة	noun	hard
logical-fallacy-spotting	رصد مغالطة منطقية	noun	hard
ad-hominem-fallacy-type	نوع مغالطة شخصية	noun	hard
straw-man-fallacy-type	نوع مغالطة رجل القش	noun	hard
false-dilemma-fallacy-type	نوع مغالطة خيارين فقط	noun	hard
slippery-slope-fallacy-type	نوع مغالطة المنحدر الزلق	noun	hard
appeal-to-authority-fallacy	مغالطة الاستشهاد بالسلطة	noun	hard
bandwagon-fallacy-argument	حجة مغالطة القطيع	noun	hard
red-herring-distraction	إلهاء أحمر ثعلب	noun	hard
circular-reasoning-flaw	خلل استدلال دائري	noun	hard
hasty-generalization-error	خطأ تعميم متسرع	noun	hard
correlation-causation-confusion	خلط الارتباط بالسببية	noun	hard
rhetorical-question-device	أداة سؤال بلاغي	noun	hard
rhetorical-appeal-ethos	استئناف أخلاقي إيثوس	noun	hard
rhetorical-appeal-pathos	استئناف عاطفي باثوس	noun	hard
rhetorical-appeal-logos	استئناف منطقي لوجوس	noun	hard
anaphora-repetition-device	أداة تكرار أنافورا	noun	hard
antithesis-contrast-device	أداة تضاد أنتيثيس	noun	hard
chiasmus-mirror-structure	بنية مرآوية كيازموس	noun	hard
parallelism-balance-device	أداة توازي	noun	hard
tricolon-three-part-list	قائمة ثلاثية ترايكولون	noun	hard
epistrophe-ending-repeat	تكرار ختامي إبستروف	noun	hard
litotes-understatement-style	أسلوب تقليل ليتوتس	noun	hard
oxymoron-contrast-pair	زوج تناقض أوكسيمورون	noun	hard
pun-wordplay-joke	لعبة لفظية	noun	hard
irony-situational-twist	انقلاب ساخر موقفي	noun	hard
dramatic-irony-effect	أثر سخرية درامية	noun	hard
verbal-irony-sarcasm	سخرية لفظية	noun	hard
satire-social-critique	نقد اجتماعي ساخر	noun	hard
parody-humorous-imitation	محاكاة هزلية	noun	hard
allegory-symbolic-tale	حكاية رمزية	noun	hard
allusion-reference-hint	إشارة أدبية	noun	hard
intertextuality-reference-web	شبكة إحالات نصية	noun	hard
canon-classic-literature	أدب كلاسيكي معتمد	noun	hard
banned-book-discussion	مناقشة كتاب محظور	noun	hard
censorship-debate-topic	موضوع جدال الرقابة	noun	hard
freedom-of-expression-right	حق حرية التعبير	noun	hard
oral-presentation-skill	مهارة العرض الشفهي	noun	hard
speech-outline-cards	بطاقات مخطط الخطاب	noun	hard
podium-posture-tip	نصيحة وقفة المنصة	noun	hard
eye-contact-audience-skill	مهارة التواصل البصري	noun	hard
gesture-emphasis-move	حركة إيماء للتأكيد	noun	hard
vocal-projection-technique	تقنية إسقاط الصوت	noun	hard
pacing-speech-rhythm	إيقاع وتيرة الخطاب	noun	hard
pause-dramatic-effect	تأثير وقفة درامية	noun	hard
audience-analysis-step	خطوة تحليل الجمهور	noun	hard
persuasive-appeal-balance	توازن الاستئنافات الإقناعية	noun	hard
informative-speech-goal	هدف خطاب إعلامي	noun	hard
demonstration-speech-step	خطوة خطاب عرض توضيحي	noun	hard
impromptu-speech-challenge	تحدي خطاب ارتجالي	noun	hard
extemporaneous-speech-prep	تحضير خطاب معد مسبقاً	noun	hard
manuscript-speech-reading	قراءة خطاب مكتوب	noun	hard
memorized-speech-delivery	إلقاء خطاب محفوظ	noun	hard
toast-celebration-speech	خطاب احتفالي نخب	noun	hard
eulogy-memorial-speech	خطاب تأبين	noun	hard
valedictorian-farewell-speech	خطاب وداع الخريج الأول	noun	hard
salutatorian-welcome-speech	خطاب ترحيب الخريج الثاني	noun	hard
storyboard-visual-plan	مخطط قصصي بصري	noun	hard
script-dialogue-format	صيغة نص حوار	noun	hard
stage-direction-note	ملاحظة إرشاد مسرحي	noun	hard
screenplay-scene-heading	عنوان مشهد سيناريو	noun	hard
monologue-solo-speech	خطاب منفرد	noun	hard
soliloquy-inner-speech	مناجاة داخلية	noun	hard
aside-stage-whisper	همسة جانبية	noun	hard
chorus-group-comment	تعليق جوقة	noun	hard
prologue-opening-scene	مشهد افتتاحي	noun	hard
epilogue-closing-scene	مشهد ختامي	noun	hard
act-scene-division	تقسيم فصل ومشهد	noun	hard
tragedy-drama-genre	نوع دراما تراجيدية	noun	hard
comedy-drama-genre	نوع دراما كوميدية	noun	hard
farce-exaggerated-comedy	كوميديا مبالغ فيها	noun	hard
melodrama-emotional-plot	حبكة درامية عاطفية	noun	hard
absurdist-theater-style	أسلوب مسرح عبثي	noun	hard
reader-theater-format	صيغة مسرح القراءة	noun	hard
public-speaking-anxiety-tip	نصيحة قلق التحدث العام	noun	hard
communication-skill-portfolio	ملف مهارات التواصل	noun	hard
listening-active-skill	مهارة الاستماع الفعال	noun	hard
feedback-constructive-phrase	عبارة ملاحظات بناءة	noun	hard
collaborative-writing-project	مشروع كتابة تعاوني	noun	hard
writers-workshop-circle	حلقة ورشة كتابة	noun	hard
mentor-text-study-lesson	درس دراسة نص مرشد	noun	hard
mentor-sentence-grammar-study	دراسة جملة مرشدة	noun	hard
conventions-editing-standard	معيار تحرير الاتفاقيات	noun	hard
style-guide-reference	مرجع دليل الأسلوب	noun	hard
formal-register-tone	نبرة سجل رسمي	noun	hard
informal-register-tone	نبرة سجل غير رسمي	noun	hard
academic-voice-tone	نبرة صوت أكاديمي	noun	hard
journalistic-style-tone	نبرة أسلوب صحفي	noun	hard
creative-writing-prompt	موجه كتابة إبداعية	noun	hard
descriptive-writing-passage	فقرة كتابة وصفية	noun	hard
expository-writing-passage	فقرة كتابة توضيحية	noun	hard
argumentative-claim-sentence	جملة ادعاء جدلي	noun	hard
warrant-logic-bridge	جسر منطقي مبرر	noun	hard
qualifier-claim-nuance	فارق دقيق للادعاء	noun	hard
backing-support-evidence	دليل داعم إضافي	noun	hard
toulmin-model-argument	حجة نموذج تولمين	noun	hard
rogerian-argument-approach	نهج حجة روجري	noun	hard
classical-argument-structure	بنية حجة كلاسيكية	noun	hard
socratic-questioning-method	أسلوب سؤال سقراط	noun	hard
seminar-discussion-protocol	بروتوكول نقاش ندوة	noun	hard
fishbowl-discussion-format	صيغة نقاش حوض السمك	noun	hard
jigsaw-reading-activity	نشاط قراءة بازل	noun	hard
literature-circle-role	دور حلقة أدب	noun	hard
book-club-discussion-guide	دليل نقاش نادي كتاب	noun	hard
reading-log-reflection-entry	مدخل سجل قراءة تأملي	noun	hard
genre-study-comparison-chart	مخطط مقارنة دراسة نوع	noun	hard
author-craft-move-study	دراسة أسلوب الكاتب	noun	hard
mentor-author-technique	تقنية مؤلف مرشد	noun	hard
publishing-platform-choice	اختيار منصة نشر	noun	hard
digital-portfolio-showcase	عرض ملف رقمي	noun	hard
multimodal-presentation-project	مشروع عرض متعدد الوسائط	noun	hard
voiceover-narration-script	نص تعليق صوتي	noun	hard
story-map-graphic-organizer	منظم بياني خريطة قصة	noun	hard
plot-diagram-label	تسمية مخطط الحبكة	noun	hard
character-trait-chart	مخطط صفات الشخصية	noun	hard
conflict-resolution-map	خريطة حل الصراع	noun	hard
theme-evidence-chart	مخطط أدلة الموضوع	noun	hard
writing-rubric-criteria	معايير مسطرة التقييم	noun	hard
peer-editing-checklist	قائمة تحرير الأقران	noun	hard
self-assessment-reflection	تأمل تقييم ذاتي	noun	hard
portfolio-cover-letter	رسالة تغطية ملف	noun	hard
author-purpose-analysis	تحليل غرض المؤلف	noun	hard
audience-purpose-tone-triangle	مثلث الجمهور والغرض والنبرة	noun	hard
media-bias-analysis-chart	مخطط تحليل تحيز إعلامي	noun	hard
primary-secondary-source-sort	فرز مصدر أولي وثانوي	noun	hard
credible-source-evaluation	تقييم مصدر موثوق	noun	hard
domain-authority-check	فحص سلطة النطاق	noun	hard
citation-style-guide	دليل أسلوب الاقتباس	noun	hard
mla-format-rule	قاعدة صيغة إم إل إيه	noun	hard
apa-format-rule	قاعدة صيغة إيه بي إيه	noun	hard
works-cited-page-list	قائمة المراجع المستشهد بها	noun	hard
in-text-citation-format	صيغة اقتباس داخل النص	noun	hard
block-quote-format-rule	قاعدة اقتباس كتلة	noun	hard
ellipsis-omission-mark	علامة حذف في الاقتباس	noun	hard
bracketed-editorial-note	ملاحظة تحريرية بين قوسين	noun	hard
sic-error-notation-mark	علامة تصحيح خطأ أصلي	noun	hard
paraphrase-citation-credit	إسناد إعادة الصياغة	noun	hard
summarize-source-paragraph	فقرة تلخيص مصدر	noun	hard
synthesize-multiple-sources	تركيب عدة مصادر	noun	hard
argument-map-visual	خريطة حجة بصرية	noun	hard
claim-evidence-reasoning-chain	سلسلة ادعاء ودليل واستدلال	noun	hard
writing-process-prewrite-stage	مرحلة ما قبل الكتابة	noun	hard
writing-process-draft-stage	مرحلة المسودة	noun	hard
writing-process-revise-stage	مرحلة المراجعة	noun	hard
writing-process-edit-stage	مرحلة التحرير	noun	hard
writing-process-publish-stage	مرحلة النشر	noun	hard
`);

export const BANK_D = parse(`
blockchain-ledger-system	نظام دفتر سلسلة الكتل	noun	hard
cloud-computing-service	خدمة الحوسبة السحابية	noun	hard
edge-computing-node	عقدة حوسبة طرفية	noun	hard
quantum-computing-qubit	بت كمي للحوسبة الكمية	noun	hard
machine-learning-model	نموذج تعلم آلي	noun	hard
neural-network-layer	طبقة شبكة عصبية	noun	hard
deep-learning-algorithm	خوارزمية تعلم عميق	noun	hard
natural-language-processing	معالجة اللغة الطبيعية	noun	hard
computer-vision-module	وحدة رؤية حاسوبية	noun	hard
robotics-automation-arm	ذراع أتمتة روبوتية	noun	hard
drone-flight-controller	وحدة تحكم طائرة بدون طيار	noun	hard
three-d-printing-filament	خيط طباعة ثلاثية الأبعاد	noun	hard
augmented-reality-overlay	طبقة واقع معزز	noun	hard
virtual-reality-headset	سماعة واقع افتراضي	noun	hard
mixed-reality-experience	تجربة واقع مختلط	noun	hard
internet-of-things-sensor	مستشعر إنترنت الأشياء	noun	hard
smart-home-hub-device	جهاز محور منزل ذكي	noun	hard
wearable-fitness-tracker	متتبع لياقة قابل للارتداء	noun	hard
biometric-fingerprint-scan	مسح بصمة حيوية	noun	hard
facial-recognition-system	نظام التعرف على الوجه	noun	hard
cybersecurity-firewall-rule	قاعدة جدار حماية	noun	hard
encryption-key-exchange	تبادل مفتاح تشفير	noun	hard
two-factor-authentication-code	رمز مصادقة ثنائية	noun	hard
password-manager-vault	خزنة مدير كلمات المرور	noun	hard
phishing-email-scam	احتيال بريد تصيد	noun	hard
ransomware-attack-threat	تهديد هجوم فدية	noun	hard
malware-detection-scan	فحص كشف برمجيات خبيثة	noun	hard
data-backup-routine	روتين نسخ احتياطي	noun	hard
version-control-repository	مستودع التحكم بالإصدارات	noun	hard
open-source-license-type	نوع ترخيص مفتوح المصدر	noun	hard
application-programming-interface	واجهة برمجة التطبيقات	noun	hard
database-query-language	لغة استعلام قاعدة بيانات	noun	hard
structured-query-command	أمر استعلام منظم	noun	hard
spreadsheet-formula-cell	خلية صيغة جدول	noun	hard
pivot-table-summary	ملخص جدول محوري	noun	hard
data-visualization-chart	مخطط تصور بيانات	noun	hard
algorithm-flowchart-design	تصميم مخطط خوارزمية	noun	hard
debugging-code-session	جلسة تصحيح الشيفرة	noun	hard
unit-test-automation	أتمتة اختبار وحدة	noun	hard
agile-sprint-planning	تخطيط سباق أجايل	noun	hard
user-interface-wireframe	إطار سلكي لواجهة المستخدم	noun	hard
user-experience-research	بحث تجربة المستخدم	noun	hard
accessibility-design-standard	معيار تصميم إتاحة	noun	hard
responsive-web-layout	تخطيط ويب متجاوب	noun	hard
content-management-system	نظام إدارة المحتوى	noun	hard
search-engine-optimization	تحسين محركات البحث	noun	hard
digital-citizenship-rule	قاعدة المواطنة الرقمية	noun	hard
online-privacy-setting	إعداد الخصوصية عبر الإنترنت	noun	hard
screen-time-balance-habit	عادة توازن وقت الشاشة	noun	hard
coding-loop-structure	بنية حلقة برمجية	noun	hard
conditional-branch-statement	عبارة فرع شرطي	noun	hard
variable-assignment-step	خطوة إسناد متغير	noun	hard
function-parameter-value	قيمة معامل دالة	noun	hard
array-index-access	وصول فهرس مصفوفة	noun	hard
binary-search-algorithm	خوارزمية بحث ثنائي	noun	hard
sorting-algorithm-comparison	مقارنة خوارزميات الفرز	noun	hard
recursion-base-case	حالة أساس للتكرار	noun	hard
object-oriented-class-design	تصميم صنف كائني	noun	hard
inheritance-class-hierarchy	تسلسل وراثة الأصناف	noun	hard
polymorphism-method-override	تجاوز دالة تعدد الأشكال	noun	hard
encapsulation-data-hiding	إخفاء بيانات التغليف	noun	hard
microcontroller-circuit-board	لوحة دائرة متحكم دقيق	noun	hard
sensor-actuator-pair	زوج مستشعر ومشغل	noun	hard
breadboard-prototype-circuit	دائرة نموذج لوح تجارب	noun	hard
soldering-iron-safety-tip	نصيحة سلامة مكواة لحام	noun	hard
renewable-tech-innovation	ابتكار تقنية متجددة	noun	hard
electric-vehicle-battery-pack	حزمة بطارية مركبة كهربائية	noun	hard
fiber-optic-cable-line	كابل ألياف بصرية	noun	hard
satellite-communication-link	رابط اتصال بالأقمار	noun	hard
gps-navigation-module	وحدة ملاحة تحديد المواقع	noun	hard
bluetooth-pairing-process	عملية إقران بلوتوث	noun	hard
wifi-router-configuration	إعداد موجه واي فاي	noun	hard
ethernet-cable-connection	اتصال كابل إيثرنت	noun	hard
operating-system-kernel-layer	طبقة نواة نظام التشغيل	noun	hard
file-extension-type	نوع امتداد الملف	noun	hard
compression-algorithm-ratio	نسبة خوارزمية ضغط	noun	hard
pixel-resolution-setting	إعداد دقة البكسل	noun	hard
color-hex-code-value	قيمة رمز لون سداسي	noun	hard
vector-graphic-scalable	رسم متجه قابل للتكبير	noun	hard
raster-image-pixel-grid	شبكة بكسل صورة نقطية	noun	hard
typography-font-pairing	اقتران خطوط الطباعة	noun	hard
kerning-letter-spacing	تباعد الحروف	noun	hard
leading-line-spacing	تباعد الأسطر	noun	hard
color-theory-complement-pair	زوج ألوان متكاملة	noun	hard
warm-cool-palette-choice	اختيار لوحة دافئة أو باردة	noun	hard
monochrome-palette-design	تصميم لوحة أحادية	noun	hard
analogous-color-scheme	مخطط ألوان متجاورة	noun	hard
triadic-color-balance	توازن ألوان ثلاثي	noun	hard
value-scale-shading-chart	مخطط تظليل قيمة	noun	hard
perspective-drawing-horizon	أفق رسم المنظور	noun	hard
vanishing-point-technique	تقنية نقطة التلاشي	noun	hard
one-point-perspective-view	منظر منظور بنقطة واحدة	noun	hard
two-point-perspective-view	منظر منظور بنقطتين	noun	hard
composition-rule-thirds	قاعدة الأثلاث في التكوين	noun	hard
negative-space-design-use	استخدام الفراغ السلبي	noun	hard
focal-point-emphasis-area	منطقة تركيز بؤرة	noun	hard
balance-symmetry-asymmetry	توازن تماثل ولا تماثل	noun	hard
rhythm-visual-repetition	تكرار إيقاعي بصري	noun	hard
contrast-value-color-use	استخدام تباين القيمة واللون	noun	hard
texture-implied-drawing	رسم ملمس ضمني	noun	hard
collage-mixed-media-piece	عمل كولاج وسائط مختلطة	noun	hard
printmaking-woodcut-block	كتلة نقش خشبي	noun	hard
linocut-print-technique	تقنية طباعة لينوليوم	noun	hard
screen-printing-stencil-layer	طبقة استنسل طباعة حريرية	noun	hard
ceramic-glaze-firing-kiln	فرن تشكيل طلاء خزفي	noun	hard
pottery-wheel-throwing-skill	مهارة تشكيل على دوارة	noun	hard
weaving-loom-pattern	نمط نول النسيج	noun	hard
embroidery-stitch-pattern	نمط غرزة تطريز	noun	hard
calligraphy-nib-stroke	ضربة ريشة خط عربي	noun	hard
origami-fold-sequence	تسلسل طية أوريغامي	noun	hard
sculpture-armature-frame	هيكل تمثال داعم	noun	hard
relief-sculpture-depth	عمق نحت بارز	noun	hard
mural-public-art-wall	جدار فن عام جدارية	noun	hard
street-art-graffiti-style	أسلوب فن شارع وكتابة جدارية	noun	hard
art-critique-framework	إطار نقد فني	noun	hard
museum-gallery-curator-tour	جولة أمين معرض	noun	hard
renaissance-perspective-skill	مهارة منظور عصر النهضة	noun	hard
impressionist-light-study	دراسة ضوء انطباعي	noun	hard
cubist-fragmented-form	شكل مجزأ تشكيلي	noun	hard
surrealist-dream-imagery	صور خيالية سريالية	noun	hard
abstract-expressionist-stroke	ضربة تعبيرية تجريدية	noun	hard
pop-art-commercial-motif	دافع فن بوب تجاري	noun	hard
digital-art-tablet-draw	رسم رقمي على لوح	noun	hard
animation-frame-sequence	تسلسل إطارات رسوم متحركة	noun	hard
stop-motion-clay-scene	مشهد رسوم طينية إطار بإطار	noun	hard
storyboard-keyframe-sketch	رسم إطار رئيسي	noun	hard
film-editing-cut-transition	انتقال قطع مونتاج	noun	hard
sound-design-foley-effect	تأثير فولي لتصميم الصوت	noun	hard
orchestra-conductor-baton	عصا قائد أوركسترا	noun	hard
symphony-four-movement-form	شكل سيمفونية بأربعة فصول	noun	hard
concerto-soloist-feature	إبراز عازف منفرد كونشرتو	noun	hard
sonata-allegro-structure	بنية سوناتا أليغرو	noun	hard
chamber-music-ensemble	فرقة موسيقى حجرة	noun	hard
jazz-improvisation-solo	عزف ارتجالي جاز	noun	hard
blues-twelve-bar-pattern	نمط بلوز باثني عشر بار	noun	hard
rock-power-chord-riff	لحن وتر قوة روك	noun	hard
hip-hop-beat-sample	عينة إيقاع هيب هوب	noun	hard
reggae-offbeat-rhythm	إيقاع ريغي على الضعف	noun	hard
folk-ballad-acoustic-guitar	قيثارة صوتية قصة شعبية	noun	hard
classical-opera-aria-song	أغنية آرية أوبرا	noun	hard
musical-theater-chorus-scene	مشهد جوقة مسرح موسيقي	noun	hard
film-score-theme-motif	دافع لحن موسيقى تصويرية	noun	hard
tempo-moderato-marking	علامة إيقاع معتدل	noun	hard
dynamics-crescendo-mark	علامة تصاعد ديناميكي	noun	hard
time-signature-four-four	إيقاع أربعة أرباع	noun	hard
key-signature-sharp-flat	علامة مفتاح دييز أو بيمول	noun	hard
major-scale-pattern	نمط سلم كبير	noun	hard
minor-scale-pattern	نمط سلم صغير	noun	hard
interval-perfect-fifth	فترة خامسة تامة	noun	hard
chord-triad-major-minor	وتر ثلاثي كبير أو صغير	noun	hard
harmony-voice-leading-rule	قاعدة قيادة الأصوات	noun	hard
counterpoint-melody-line	خط لحن تعدد الأصوات	noun	hard
orchestration-instrument-choice	اختيار آلات الأوركسترة	noun	hard
transposition-key-change	نقل تغيير المفتاح	noun	hard
sight-reading-practice-skill	مهارة قراءة موسيقى مباشرة	noun	hard
ear-training-interval-quiz	اختبار تدريب أذن للفترات	noun	hard
metronome-tempo-practice	تمرين إيقاع بمترونوم	noun	hard
recording-studio-mix-session	جلسة مزج استوديو	noun	hard
microphone-polar-pattern	نمط استقطاب ميكروفون	noun	hard
acoustic-guitar-fingerpick	عزف أصابع قيثارة صوتية	noun	hard
electric-guitar-amplifier-tone	نغمة مضخم قيثارة كهربائية	noun	hard
piano-pedal-sustain-use	استخدام دواسة استدامة بيانو	noun	hard
violin-bow-technique	تقنية قوس كمان	noun	hard
cello-endpin-adjustment	ضبط دعامة كمان جهير	noun	hard
flute-embouchure-hole	فتحة وضعية فلوت	noun	hard
trumpet-valve-combination	تركيبة صمام بوق	noun	hard
drum-kit-rudiment-roll	لفة أساسية طقم طبول	noun	hard
percussion-timpani-tuning	ضبط طبل تيمباني	noun	hard
choir-soprano-alto-part	جزء سوبرانو وألتو	noun	hard
a-cappella-vocal-harmony	انسجام صوتي دون عزف	noun	hard
music-notation-software-use	استخدام برنامج تدوين موسيقي	noun	hard
soccer-penalty-kick-rule	قاعدة ركلة جزاء كرة قدم	noun	hard
basketball-fast-break-play	لعبة هجمة مرتدة سلة	noun	hard
volleyball-set-spike-combo	مزيج تمرير وضربة ساحقة	noun	hard
baseball-double-play-turn	دوران لعبة مزدوجة بيسبول	noun	hard
softball-bunting-technique	تقنية ضربة تسديد ناعمة	noun	hard
track-sprint-start-block	كتلة انطلاق سباق	noun	hard
relay-baton-exchange-zone	منطقة تبادل عصا سباق	noun	hard
long-jump-approach-run	جري اقتراب وثب طويل	noun	hard
high-jump-fosbury-flop	أسلوب فوسبري وثب عالي	noun	hard
pole-vault-plant-swing	دفع وتأرجح قفز بالزانة	noun	hard
shot-put-glide-technique	تقنية انزلاق دفع الجلة	noun	hard
discus-throw-spin-release	دوران وإطلاق رمي القرص	noun	hard
javelin-throw-approach-angle	زاوية اقتراب رمي الرمح	noun	hard
swim-freestyle-breathing-pattern	نمط تنفس سباحة حرة	noun	hard
backstroke-arm-recovery	استعادة ذراع سباحة ظهر	noun	hard
breaststroke-kick-timing	توقيت ركلة سباحة صدر	noun	hard
butterfly-stroke-dolphin-kick	ركلة دلفين سباحة فراشة	noun	hard
gymnastics-floor-routine-sequence	تسلسل روتين أرضي جمباز	noun	hard
balance-beam-dismount-landing	هبوط نزول عارضة توازن	noun	hard
uneven-bars-release-move	حركة تحرر عارضتين	noun	hard
wrestling-takedown-defense	دفاع إسقاط مصارعة	noun	hard
fencing-parry-riposte-move	حركة دفاع ورد مبارزة	noun	hard
archery-anchor-point-aim	تصويب نقطة تثبيت رماية	noun	hard
rowing-stroke-power-phase	مرحلة قوة ضربة تجديف	noun	hard
cycling-peloton-draft-benefit	فائدة انسحاب مجموعة دراجات	noun	hard
skateboard-ollie-pop-trick	حيلة أولي لوح تزلج	noun	hard
snowboard-halfpipe-run	جولة نصف أنبوب تزلج	noun	hard
ski-slalom-gate-turn	انعطاف بوابة تزلج على المنحدرات	noun	hard
ice-hockey-power-play-advantage	أفضلية لعب عدد ناشون هوكي	noun	hard
figure-skating-triple-jump	قفزة ثلاثية تزلج فني	noun	hard
martial-arts-kata-form	شكل كاتا فنون قتالية	noun	hard
taekwondo-roundhouse-kick	ركلة دائرية تايكوندو	noun	hard
yoga-sun-salutation-flow	تدفق تحية الشمس يوغا	noun	hard
pilates-core-stability-exercise	تمرين ثبات وسط بيلاتس	noun	hard
crossfit-wod-circuit	دائرة تمرين كروس فيت	noun	hard
marathon-pacing-strategy	استراتيجية ضبط وتيرة ماراثون	noun	hard
triathlon-transition-area-setup	إعداد منطقة انتقال ترياثلون	noun	hard
sportsmanship-fair-play-rule	قاعدة لعب نظيف	noun	hard
team-captain-leadership-role	دور قائد فريق	noun	hard
coach-half-time-pep-talk	حديث تحفيزي بين الشوطين	noun	hard
referee-penalty-signal-call	إشارة حكم بعقوبة	noun	hard
instant-replay-review-call	مراجعة إعادة فورية	noun	hard
sports-injury-ice-compress-rest	راحة وثلج وضغط لإصابة	noun	hard
concussion-protocol-checklist	قائمة بروتوكول ارتجاج	noun	hard
hydration-electrolyte-balance	توازن ترطيب وإلكتروليت	noun	hard
warm-up-dynamic-stretch-routine	روتين إحماء وتمدد ديناميكي	noun	hard
cool-down-static-stretch-routine	روتين تهدئة وتمدد ثابت	noun	hard
nutrition-macro-nutrient-balance	توازن مغذيات كبرى	noun	hard
protein-muscle-recovery-meal	وجبة تعافي عضلي بروتين	noun	hard
carbohydrate-energy-fuel-source	مصدر طاقة كربوهيدرات	noun	hard
healthy-sleep-hygiene-habit	عادة نظافة نوم صحية	noun	hard
stress-management-breathing-exercise	تمرين تنفس لإدارة التوتر	noun	hard
mindfulness-meditation-practice	ممارسة تأمل وعي	noun	hard
growth-mindset-attitude-trait	صفة عقلية نمو	noun	hard
fixed-mindset-limit-belief	اعتقاد حد عقلية ثابتة	noun	hard
self-discipline-daily-habit	عادة يومية انضباط ذاتي	noun	hard
integrity-honest-choice	اختيار نزاهة وصدق	noun	hard
empathy-perspective-taking-skill	مهارة وضع النفس مكان الآخر	noun	hard
compassion-kind-action-habit	عادة فعل لطيف برحمة	noun	hard
gratitude-journal-entry-habit	عادة مدخل يوميات امتنان	noun	hard
perseverance-long-goal-effort	جهد هدف طويل بمثابرة	noun	hard
resilience-bounce-back-strength	قوة التعافي والصمود	noun	hard
courage-brave-decision-moment	لحظة قرار شجاع	noun	hard
humility-learning-from-mistake	تواضع التعلم من الخطأ	noun	hard
respect-inclusive-language-use	استخدام لغة شاملة باحترام	noun	hard
responsibility-task-ownership	ملكية المهمة بمسؤولية	noun	hard
cooperation-team-project-role	دور مشروع تعاوني	noun	hard
leadership-service-example	مثال قيادة بالخدمة	noun	hard
citizenship-community-service-hour	ساعة خدمة مجتمعية	noun	hard
conflict-resolution-peer-talk	حوار أقران لحل نزاع	noun	hard
active-listening-paraphrase-skill	مهارة إعادة صياغة استماع	noun	hard
assertive-communication-phrase	عبارة تواصل حازم	noun	hard
boundary-setting-respectful-no	رفض محترم لحدود شخصية	noun	hard
digital-empathy-online-comment	تعاطف رقمي في تعليق	noun	hard
anti-bullying-bystander-action	إجراء متفرج ضد التنمر	noun	hard
inclusion-wheelchair-access-plan	خطة إتاحة كرسي متحرك	noun	hard
cultural-appreciation-not-appropriation	تقدير ثقافي دون استيلاء	noun	hard
volunteer-charity-drive-event	حدث حملة تطوع خيرية	noun	hard
environmental-stewardship-project	مشروع عناية بيئية	noun	hard
recycling-sorting-station-duty	واجب محطة فرز إعادة تدوير	noun	hard
water-conservation-habit-tip	نصيحة عادة ترشيد مياه	noun	hard
energy-saving-light-bulb-choice	اختيار مصباح موفر طاقة	noun	hard
public-health-vaccination-fact	حقيقة تطعيم صحة عامة	noun	hard
handwashing-soap-duration-rule	قاعدة مدة غسل اليدين بالصابون	noun	hard
dental-floss-daily-habit	عادة خيط أسنان يومية	noun	hard
posture-ergonomic-desk-setup	إعداد مكتب مريح للوضعية	noun	hard
vision-screen-break-rule	قاعدة استراحة للعين من الشاشة	noun	hard
hearing-protection-earplug-use	استخدام سدادات حماية سمع	noun	hard
first-aid-bandage-wound-care	عناية جرح ضمادة إسعاف	noun	hard
cpr-chest-compression-rhythm	إيقاع ضغط صدر إنعاش	noun	hard
aed-defibrillator-use-step	خطوة استخدام جهاز صدمات	noun	hard
allergy-epinephrine-pen-plan	خطة قلم أدرينالين للحساسية	noun	hard
asthma-inhaler-spacer-technique	تقنية بخاخ ربو مع فاصل	noun	hard
diabetes-blood-sugar-check	فحص سكر دم سكري	noun	hard
mental-health-counselor-support	دعم مستشار صحة نفسية	noun	hard
growth-spurt-puberty-change	تغير طفرة نمو بلوغ	noun	hard
balanced-meal-plate-portion	حصة طبق وجبة متوازنة	noun	hard
food-label-serving-size-read	قراءة حجم الحصة على الملصق	noun	hard
food-allergy-cross-contact-risk	خطر تلوث متقاطع حساسية	noun	hard
vegetarian-protein-source-choice	اختيار مصدر بروتين نباتي	noun	hard
food-safety-refrigerator-temp	درجة تبريد ثلاجة سلامة غذاء	noun	hard
hand-sanitizer-alcohol-percent	نسبة كحول معقم يدين	noun	hard
sunscreen-spf-reapply-rule	قاعدة إعادة واقي شمس	noun	hard
tick-bite-check-after-hike	فحص لدغة قراد بعد نزهة	noun	hard
insect-repellent-spray-use	استخدام رذاذ طارد حشرات	noun	hard
logic-deductive-reasoning-chain	سلسلة استدلال استنتاجي	noun	hard
logic-inductive-pattern-guess	تخمين نمط استقرائي	noun	hard
syllogism-premise-conclusion	مقدمة ونتيجة قياس منطقي	noun	hard
valid-argument-form-check	فحص صورة حجة صحيحة	noun	hard
sound-argument-premise-truth	صدق مقدمات حجة سليمة	noun	hard
truth-table-logic-gate	جدول صدق بوابة منطقية	noun	hard
boolean-and-or-not-rule	قاعدة و أو لا منطقية	noun	hard
venn-diagram-set-overlap	تداخل مجموعات مخطط فن	noun	hard
set-union-intersection-operation	عملية اتحاد وتقاطع مجموعات	noun	hard
conditional-if-then-statement	عبارة إذا فإن شرطية	noun	hard
biconditional-if-and-only-if	عبارة إذا وفقط إذا	noun	hard
contrapositive-logic-equivalent	مكافئ منطقي لنقيض العكس	noun	hard
proof-by-contradiction-method	أسلوب برهان بالتناقض	noun	hard
mathematical-induction-step	خطوة استقراء رياضي	noun	hard
pattern-recognition-puzzle-skill	مهارة لغز تمييز نمط	noun	hard
sequence-next-term-predict	توقع الحد التالي في متتالية	noun	hard
analogy-relationship-pair-type	نوع زوج علاقة تشبيه	noun	hard
classification-category-sort-rule	قاعدة فرز تصنيف فئات	noun	hard
decision-matrix-criteria-weight	وزن معايير مصفوفة قرار	noun	hard
pros-cons-t-chart-analysis	تحليل مخطط إيجابيات وسلبيات	noun	hard
cost-benefit-thought-experiment	تجربة فكر تكلفة وفائدة	noun	hard
ethical-dilemma-case-study	دراسة حالة معضلة أخلاقية	noun	hard
trolley-problem-thought-test	اختبار فكري مشكلة العربة	noun	hard
critical-thinking-question-prompt	موجه سؤال تفكير نقدي	noun	hard
socratic-why-chain-question	سلسلة أسئلة لماذا سقراطية	noun	hard
brainstorm-idea-filter-stage	مرحلة تصفية أفكار عصف	noun	hard
mind-map-branch-idea-node	عقدة فرع خريطة ذهنية	noun	hard
lateral-thinking-creative-leap	قفزة تفكير جانبي إبداعي	noun	hard
root-cause-five-whys-method	أسلوب لماذا خمس مرات للسبب	noun	hard
systems-thinking-feedback-loop	حلقة تغذية راجعة تفكير منظومي	noun	hard
game-theory-strategy-choice	اختيار استراتيجية نظرية ألعاب	noun	hard
prisoner-dilemma-cooperation-test	اختبار تعاون معضلة السجين	noun	hard
probability-tree-outcome-path	مسار نتيجة شجرة احتمال	noun	hard
expected-value-decision-calc	حساب قيمة متوقعة للقرار	noun	hard
risk-assessment-likelihood-impact	أثر واحتمال تقييم مخاطر	noun	hard
scientific-method-step-order	ترتيب خطوات المنهج العلمي	noun	hard
observation-hypothesis-test-cycle	دورة ملاحظة وفرضية واختبار	noun	hard
control-variable-isolation-rule	قاعدة عزل متغير ضابط	noun	hard
replication-study-validation	تحقق دراسة تكرار	noun	hard
peer-review-science-process	عملية مراجعة الأقران العلمية	noun	hard
data-integrity-honesty-rule	قاعدة نزاهة البيانات	noun	hard
citation-integrity-no-fabrication	نزاهة اقتباس دون اختلاق	noun	hard
intellectual-honesty-admit-error	أمانة فكرية بالاعتراف بالخطأ	noun	hard
curiosity-driven-inquiry-habit	عادة استقصاء مدفوعة فضول	noun	hard
skepticism-evidence-demand-trait	صفة شك يتطلب دليلاً	noun	hard
open-minded-revision-willingness	استعداد مراجعة بعقل منفتح	noun	hard
collaborative-problem-solving-step	خطوة حل مشكلة تعاوني	noun	hard
design-thinking-empathize-stage	مرحلة تعاطف تفكير تصميمي	noun	hard
design-thinking-prototype-test	اختبار نموذج تفكير تصميمي	noun	hard
engineering-ethics-safety-first	أخلاقيات هندسة السلامة أولاً	noun	hard
technology-ethics-privacy-balance	توازن أخلاقيات تقنية وخصوصية	noun	hard
art-ethics-cultural-respect	احترام ثقافي أخلاقيات فن	noun	hard
sports-ethics-anti-doping-rule	قاعدة مكافحة منشطات أخلاقيات رياضة	noun	hard
health-literacy-source-check	فحص مصدر محو أمية صحية	noun	hard
character-reflection-journal-prompt	موجه يوميات تأمل شخصية	noun	hard
goal-setting-smart-criteria-plan	خطة معايير هدف ذكي	noun	hard
time-management-priority-matrix	مصفوفة أولويات إدارة وقت	noun	hard
habit-stacking-routine-design	تصميم روتين تكديس عادات	noun	hard
growth-goal-reflection-checkpoint	نقطة مراجعة هدف نمو	noun	hard
`);
