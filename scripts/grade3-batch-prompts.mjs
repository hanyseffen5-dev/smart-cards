/** Sentence-aligned scene hints for Grade 3 illustrations (10 per batch) */
import { STYLE } from "./lib/daniel-image-style.mjs";

export { STYLE };

export const BATCH1_PROMPTS = {
  "thirty-one":
    "Warm classroom seen from above with EXACTLY thirty-one small student desks in neat rows with chairs, count all desks carefully 31 total not 30 not 32, empty friendly school room, NO text NO digits. Matches 'Our class has thirty-one desks arranged in rows.'",
  "thirty-two":
    "Girl walking up outdoor stone steps toward library door, EXACTLY thirty-two visible stair steps from bottom to top counted carefully, school building at top, NO text NO numbers on steps. Matches 'She counted thirty-two steps to the library door.'",
  "thirty-three":
    "Student at desk with very thick open reading textbook, tall stack of many unread pages still remaining on the right side, bookmark near the beginning showing most of the assignment left to read, homework mood, NO text NO digits. Matches 'Thirty-three pages remain in our reading assignment.'",
  "thirty-four":
    "Yellow school bus driving along a winding city street passing many distinct street corners with small bus-stop signs, thirty-four separate corner intersections visible along the route illustration, NO street numbers NO text. Matches 'The bus route stops at thirty-four street corners.'",
  "thirty-five":
    "Classroom wall round clock with minute hand at seven and hour hand near twelve showing thirty-five minutes waiting, empty desks, anticipation before bell rings, clock face has dots not numbers. Matches 'Thirty-five minutes passed before the bell rang.'",
  "thirty-six":
    "Open wooden puzzle box on table with EXACTLY thirty-six flat wooden jigsaw pieces arranged in perfect 6 by 6 grid, count 6 rows of 6 equals 36 pieces, NO text. Matches 'The puzzle box holds thirty-six wooden pieces.'",
  "thirty-seven":
    "School science fair gym with EXACTLY thirty-seven diverse students standing in line at signup table with colorful poster boards, count every student carefully 37 total, NO text NO digits. Matches 'Thirty-seven students signed up for the science fair.'",
  "thirty-eight":
    "Hiker at mountain trail wooden marker post with long winding path ahead through hills suggesting a very long distance journey remaining, scenic trail, NO readable numbers on sign. Matches 'The trail marker shows thirty-eight kilometers left.'",
  "thirty-nine":
    "Happy child at school spelling game podium with many gold star stickers on a chart behind showing a very high score celebration, classmates cheering, NO readable numbers or digits anywhere. Matches 'He scored thirty-nine points in the spelling game.'",
  thousand:
    "Classroom ceiling completely filled with very many colorful origami paper cranes hanging on strings in dense clusters suggesting an enormous quantity like a thousand cranes, festive peaceful mood, NO text NO digits. Matches 'A thousand paper cranes hung from the classroom ceiling.'",
};

export const BATCH2_PROMPTS = {
  continent:
    "World globe showing large green Africa continent clearly south of Europe, friendly geography lesson, NO labels NO text.",
  peninsula:
    "Narrow green land peninsula stretching into cold blue northern sea with waves and ice hints, birds flying, NO text.",
  canyon:
    "Deep rocky canyon with rushing blue river carving through red cliffs, dramatic but friendly children's view, NO text.",
  plateau:
    "Wide flat grassy plateau on high land with white sheep grazing peacefully, blue sky, NO text.",
  hemisphere:
    "Earth globe split view highlighting southern hemisphere with Brazil-shaped green land in south, equator line as curve not labeled, NO text NO words.",
  equator:
    "Tropical sunny countries on globe around middle warm equator belt with palm trees and bright sun, geography class, NO text.",
  compass:
    "Golden pocket compass in child's hand with red needle clearly pointing toward north star direction, adventure mood, NO letters on compass.",
  atlas:
    "Two kids leaning over large open atlas book on desk pointing at Egypt-shaped region on map as colored shapes only, NO readable text.",
  longitude:
    "Transparent globe with curved vertical longitude lines running from North Pole ice cap to South Pole ice cap, classroom science, NO labels.",
  latitude:
    "Earth globe with horizontal parallel latitude circles around the middle near equator warm colors, geography lesson, NO text NO numbers.",
};

export const BATCH3_PROMPTS = {
  microscope:
    "Student peering into classroom microscope seeing tiny round cells on slide, science table goggles nearby, NO text.",
  telescope:
    "Child at night looking through telescope on tripod seeing large friendly Jupiter planet with four small moons in sky, stars, NO text.",
  laboratory:
    "Students wearing safety goggles inside bright school science laboratory with beakers and test tubes, friendly, NO text.",
  prism:
    "Glass triangular prism on sunny windowsill splitting white light beam into rainbow colors on wall, science demo, NO text.",
  gravity:
    "Apple and ball falling downward toward cartoon Earth cross-section showing pull toward center, simple physics, NO text NO numbers.",
  energy:
    "House roof with solar panels capturing bright yellow sunlight beams, green yard, clean energy mood, NO text.",
  molecule:
    "Cute diagram of water molecule as three connected round balls two small one big like H2O model on science desk, NO letters NO numbers.",
  observation:
    "Child with notebook carefully watching potted plant sprouting new leaves with magnifying glass, noticing changes, NO text.",
  hypothesis:
    "Science fair seed sprouting experiment two trays one warm lamp one cool comparing growth, student thinking, NO text NO digits.",
  evidence:
    "Museum display of friendly dinosaur fossil bones in glass case with child amazed, fossil evidence, NO text.",
};

export const BATCH4_PROMPTS = {
  paragraph:
    "Open essay notebook showing three separate short blocks of squiggle lines as paragraphs with first block highlighted, student writing, NO readable words.",
  chapter:
    "Child closing thick storybook with bookmark at chapter four shown as four small star stickers on spine not digits, library background, NO readable text.",
  glossary:
    "Back of textbook glossary pages with tiny definition squiggles and magnifying glass, science terms book, NO legible words.",
  synonym:
    "Two cheerful children side by side with identical big joyful smiles and same happy mood, showing happy and cheerful mean the same thing as synonyms, NO text NO words visible.",
  antonym:
    "Split scene left icy cold blue snowflake child shivering right warm red sun hot child fanning, hot versus cold contrast, NO text.",
  prefix:
    "Wooden letter tiles showing un- block snapping onto happy face tile turning to sad face cartoon transformation, word building, NO readable full words.",
  suffix:
    "Word-building scene: small caring heart symbol transforms when colorful suffix puzzle piece attaches, becoming a careful child gently holding a fragile plant with extra caution, showing -ful turns care into careful, NO readable words.",
  summarize:
    "Student presenting three fingers while pointing at short stack of three index cards summarizing a story, classroom, NO readable text.",
  outline:
    "Girl writing bullet outline on paper with three branching sections before report draft on desk, organized homework, NO legible words.",
  quotation:
    "Comic speech bubble with curved quote marks around squiggle said by two kids one speaking one listening, punctuation lesson, NO readable sentences.",
};

export const BATCH5_PROMPTS = {
  nutrition:
    "Colorful balanced lunch tray with fruits vegetables grains and milk on cafeteria table, healthy eating mood, NO text NO labels.",
  vitamin:
    "Bright orange fruit slice next to friendly immune shield character, vitamin C concept, sunny kitchen, NO text NO numbers.",
  muscle:
    "Child jogging on school track with strong happy leg muscles shown gently in cartoon style, exercise builds strength, NO text.",
  skeleton:
    "Friendly classroom skeleton model on stand showing bones supporting body, science lesson cute not scary, NO text NO labels.",
  heartbeat:
    "Doctor listening with stethoscope to calm child chest showing gentle steady heart rhythm waves, healthy checkup, NO text NO digits.",
  breathing:
    "Student doing slow deep breathing with eyes closed before classroom presentation, calm peaceful posture, NO text.",
  allergy:
    "Child carefully reading food package label with peanut icon crossed out, allergy safety awareness, NO readable words on label.",
  hygiene:
    "Kids washing hands with soap at school sink before lunch, germ prevention, bubbles and towels, NO text.",
  stamina:
    "Child jogging daily on nature trail building endurance for long school hike ahead, mountains in distance, NO text.",
  balance:
    "Child doing simple yoga tree pose on mat in gym class improving body balance, peaceful, NO text NO numbers.",
};

export const BATCH6_PROMPTS = {
  pollution:
    "City skyline with factory smoke stacks and gray haze over buildings, air pollution concept friendly educational not scary, NO text.",
  conservation:
    "Family turning off faucet while collecting clean water in glass jar for future use, water saving at home, NO text NO digits.",
  habitat:
    "Wetland marsh with frogs on lily pads and heron bird among reeds, natural animal home, NO text.",
  endangered:
    "Friendly orange tiger in protected green forest area with park ranger shield sign as shapes only, conservation mood, NO text NO words.",
  renewable:
    "Wind turbines on green hills generating clean electricity with breezy sky, renewable energy, NO text NO numbers.",
  drought:
    "Dry cracked brown farm field under hot sun with wilted crops, long drought scene, NO text NO digits.",
  ecosystem:
    "Colorful coral reef underwater with fish and sea turtles in fragile ocean ecosystem, friendly marine life, NO text.",
  wetland:
    "Coastal wetland reeds with birds nesting among tall grass near calm water, peaceful nature, NO text.",
  compost:
    "Kitchen fruit scraps in bin turning into rich dark compost for backyard garden vegetables, recycling nature cycle, NO text.",
  species:
    "Park ranger with binoculars counting many different colorful bird species in trees, twelve distinct birds, NO text NO digits.",
};

export const BATCH7_PROMPTS = {
  multiply:
    "Classroom math table with six neat groups of four colorful blocks each showing multiplication concept, friendly teacher nearby, NO digits NO text.",
  divide:
    "Round pizza cut into equal slices shared fairly among eight happy friends sitting in circle, dividing equally, NO numbers.",
  numerator:
    "Fraction pie chart drawn on chalkboard with top portion highlighted as numerator part of three-fourths concept, NO readable digits or fractions.",
  decimal:
    "Clear glass jar half filled with water showing one half full concept as decimal half, simple math demo, NO 0.5 NO numbers.",
  perimeter:
    "Child measuring tape wrapped around rectangular school garden fence measuring outer edge perimeter, green plants inside, NO text.",
  angle:
    "Clear L-shaped perfect right angle drawn on classroom chalkboard with small curved arc at the corner indicating exactly ninety degrees, geometry math lesson diagram, NO numbers NO degree symbol NO text.",
  diameter:
    "Large friendly circle on chalkboard with straight line passing through center point from edge to edge as diameter, NO labels.",
  estimate:
    "Child looking thoughtfully at glass jar full of colorful marbles guessing how many fit, estimation homework, NO numbers.",
  pattern:
    "Row of colored blocks each step slightly taller increasing in steady repeating pattern left to right, math pattern lesson, NO digits.",
  sequence:
    "Solar system poster showing planets in order from sun Mercury Venus Earth Mars as colorful balls in sequence, NO planet names NO text.",
};

export const BATCH8_PROMPTS = {
  January:
    "Snowy new year classroom calendar page showing first month winter scene with snowflakes and fresh start mood, NO month name NO text.",
  February:
    "Gray rainy February day child with umbrella on short cloudy afternoon walk, cold rain mood, NO text NO calendar.",
  March:
    "Early spring garden with first colorful flowers beginning to bloom in March sunshine, tulips and daffodils, NO text.",
  April:
    "Gentle April rain shower watering green sprouting garden with rainbow hint, spring growth, NO text NO month name.",
  decade:
    "Horizontal timeline ribbon with exactly ten equal year segments shown as ten small calendar icons in a row, clearly a full decade of ten complete years, history lesson, NO digits NO text.",
  century:
    "Ancient stone castle on hill looking very old built long ago more than a century, historical mood, NO dates NO text.",
  schedule:
    "Student checking colorful wall schedule board to find when art class begins with paint palette icon highlighted, NO readable words.",
  deadline:
    "Student at desk with project almost done and calendar page showing urgent final day marked with red star not digits, deadline pressure, NO text.",
  timetable:
    "Train station departure board showing rows of hourly train times as colored blocks not readable numbers, timetable concept, NO legible text.",
  anniversary:
    "School gym celebration with banner balloons and students on stage for fiftieth school anniversary concert, festive, NO readable numbers or words.",
};

export const BATCH9_PROMPTS = {
  broadcast:
    "School morning announcement speaker on desk with microphone sharing weather sun cloud icon and news bulletin board, broadcast mood, NO text.",
  interview:
    "Young reporter with notepad asking questions to friendly mayor at small interview table with microphone, NO readable text.",
  audience:
    "Theater audience of children clapping loudly after school play on stage with curtains, happy crowd, NO text.",
  publish:
    "School club students printing and stacking monthly newsletter copies at table ready to distribute, publishing mood, NO readable headlines.",
  editor:
    "Editor at desk with red pencil correcting squiggle lines on article manuscript pages, careful proofreading, NO legible words.",
  headline:
    "Large newspaper board headline banner above science fair trophy winners display with exclamation shapes, NO readable words.",
  opinion:
    "Student raising hand respectfully sharing opinion during friendly classroom circle discussion, diverse kids listening, NO text.",
  debate:
    "Two debate teams at podiums arguing both sides of issue with thinking poses, school debate competition, NO readable signs.",
  persuade:
    "Student presenting chart with facts and examples to convince classmates at projector board, persuasive speech, NO legible text.",
  announce:
    "School principal at podium with microphone announcing contest winners to excited students in assembly hall, NO readable text.",
};

export const BATCH10_PROMPTS = {
  analyze:
    "Scientists in lab coats studying charts graphs and data on table before drawing conclusion lightbulb moment, analyze data, NO readable numbers.",
  contrast:
    "Split essay page left sunny hot summer beach right snowy cold winter scene contrasting seasons, writing homework, NO text.",
  organize:
    "Student sorting notes into neat labeled color-coded folder sections on desk, organized study, NO legible labels.",
  classify:
    "Biologist sorting friendly animals into groups mammals birds fish on chart table by traits, classification lesson, NO text labels.",
  cooperate:
    "Team of children building puzzle together listening to each other cooperating happily, teamwork, NO text.",
  negotiate:
    "Classmates at round table discussing and agreeing on group project rules with handshake, negotiation, NO readable papers.",
  volunteer:
    "Students volunteering with gloves and bags cleaning neighborhood park picking up litter, community service, NO text.",
  community:
    "Neighborhood community gathering donations in jar for new library building fund with happy families, NO readable signs.",
  heritage:
    "Museum hall with cultural heritage artifacts pottery masks and costumes in glass cases preserving history, NO text labels.",
  ceremony:
    "Graduation ceremony stage with students in caps receiving certificates honored by proud teachers and parents, NO readable text.",
};

export const BATCH11_PROMPTS = {
  May:
    "Sunny May park with children playing under longer bright daylight and warm golden sunshine, spring turning to summer mood, NO text NO calendar.",
  June:
    "Happy last day of school in June with students running out of building carrying backpacks toward summer vacation, NO text NO month name.",
  July:
    "Night sky over quiet town with colorful fireworks bursting above rooftops on warm July evening celebration, NO text NO digits.",
  August:
    "Very hot August afternoon with child resting under shade tree fanning face while sun beats down on still quiet street, NO text.",
  September:
    "Fresh September school entrance with new backpacks and welcome decorations as new school year begins, autumn leaves starting, NO readable text.",
  October:
    "Orange and red autumn leaves falling from trees in October park walk with pumpkin basket, cozy fall mood, NO text NO month name.",
  November:
    "Chilly November morning walk with child in warm coat and scarf feeling cold wind blowing autumn leaves, NO text NO calendar.",
  December:
    "December holiday scene with family home glowing warm lights and festive decorations gathering together, cozy winter mood, NO readable text.",
  autumn:
    "Rolling hills painted gold and red with autumn trees and falling leaves in beautiful fall landscape, NO text.",
  season:
    "Four small seasonal panels in one scene showing winter snow spring flowers summer sun autumn leaves changing weather and clothes, NO text NO labels.",
};

export const BATCH12_PROMPTS = {
  government:
    "Local city hall opening ceremony for brand new public swimming pool with mayor cutting ribbon and happy families, NO readable signs.",
  democracy:
    "Classroom mock election with students placing paper ballots into ballot box choosing class president, voting democracy lesson, NO readable text.",
  election:
    "School gym election day with candidate posters as colorful shapes and students lining up to vote at table, NO legible words.",
  constitution:
    "Important old document scroll on display in museum case listing citizen rights shown as icon symbols not readable words, NO text.",
  citizen:
    "Diverse friendly citizens in neighborhood following fair community rules helping each other cross street and recycle, NO text.",
  mayor:
    "Friendly mayor in suit cutting ribbon at grand opening of new city bridge last Saturday with crowd cheering, NO readable signs.",
  council:
    "City council meeting room with members voting to approve planting more street trees shown on plan board, NO legible text.",
  freedom:
    "Peaceful classroom discussion circle where students share ideas safely with speech bubble shapes not words, freedom of expression, NO text.",
  justice:
    "Balanced scales of justice on judge desk with diverse children treated equally and fairly in friendly courtroom lesson, NO text NO words.",
  equality:
    "Boys and girls on same starting line ready for equal fair race with identical opportunities, sports day equality, NO text NO numbers.",
};

export const BATCH13_PROMPTS = {
  orbit:
    "Friendly moon traveling in curved orbit path around cartoon Earth in space diagram with dotted arc, NO text NO labels.",
  solar:
    "House roof with bright solar panels capturing yellow sunlight beams turning into useful electricity wires to home, NO text.",
  lunar:
    "Gray dusty lunar surface landscape in photo style with astronaut boot prints and Earth in sky, moon surface mood, NO text.",
  asteroid:
    "Rocky asteroid object tumbling through dark starry space alone, friendly educational not scary, NO text NO numbers.",
  comet:
    "Bright comet streaking across night sky with long glowing tail trailing behind, stars background, NO text.",
  galaxy:
    "Spiral galaxy full of billions of tiny distant sparkling stars in deep space view, awe inspiring, NO text NO labels.",
  atmosphere:
    "Earth cross-section showing blue protective atmosphere layer shielding planet from harsh space rays, science diagram friendly, NO text.",
  climate:
    "Hot dry desert landscape with sun beating down staying warm and dry for many months, desert climate, NO text NO digits.",
  meteor:
    "Bright meteor streaking across dark night sky like a spark trailing light, stargazing child watching, NO text.",
  eclipse:
    "Solar eclipse moment with moon blocking sun creating dark ring corona effect in sky, safe educational view, NO text NO numbers.",
};

export const BATCH14_PROMPTS = {
  sculpture:
    "White marble sculpture statue standing proudly in museum courtyard garden with visitors admiring, NO text NO plaque.",
  orchestra:
    "School orchestra on concert stage playing lively piece with violins drums and conductor waving baton, NO sheet music text.",
  symphony:
    "Concert hall with sweeping string section playing grand symphony with many violins and cellos, NO readable program.",
  gallery:
    "Art gallery walls displaying colorful paintings by young local student artists with visitors viewing, NO readable titles.",
  portrait:
    "Girl at easel painting smiling portrait of grandmother on canvas in sunny art room, NO readable face details as text.",
  pottery:
    "Pottery class child shaping wet clay on spinning wheel into bowl with teacher helping, NO text.",
  rhythm:
    "Parade drummers marching keeping steady rhythm on drums with colorful flags, NO text NO music notes as letters.",
  melody:
    "Flute player in hall carrying gentle flowing melody with soft musical wave shapes not text, peaceful concert, NO words.",
  performance:
    "Children dance troupe on stage earning loud applause from audience after school performance, curtains open, NO text.",
  festival:
    "International food festival booths with dishes flags as colored shapes from many countries families tasting, NO readable signs.",
};

export const BATCH15_PROMPTS = {
  luggage:
    "Traveler at airport check-in counter attaching name tag label to rolling suitcase luggage before flight, NO readable label text.",
  passport:
    "Traveler showing closed passport booklet to border gate officer at airport, international travel mood, NO readable passport text.",
  destination:
    "Family arriving at quiet peaceful coastal village destination with boats and blue water welcome scene, NO text NO sign.",
  voyage:
    "Large ship sailing across wide ocean on very long two-week voyage with waves and horizon, NO text NO dates.",
  cruise:
    "Happy families playing games on sunny cruise ship deck with pool and life rings, vacation mood, NO readable text.",
  cargo:
    "Workers at dawn loading heavy cargo crates into ship hold with crane and forklift, NO readable labels.",
  freight:
    "Long freight train carrying heavy goods containers between cities through countryside, NO text NO numbers on cars.",
  navigation:
    "Sailor on open sea at night using sextant and stars for navigation steering ship wheel, NO text NO coordinates.",
  departure:
    "Airport departure board showing rows of flights as colored time blocks not readable numbers, travelers waiting, NO legible text.",
  arrival:
    "Family waiting excitedly in airport arrival hall greeting visiting cousins coming through gates, NO readable signs.",
};

export const BATCH16_PROMPTS = {
  orchard:
    "Spring apple orchard with white blossoms blooming on rows of apple trees in sunny farm, NO text.",
  grain:
    "Farmer storing golden grain harvest in tall silos after harvest season with tractor nearby, NO text NO numbers.",
  cucumber:
    "Cool fresh cucumber slices on colorful summer salad plate with tomatoes, refreshing food, NO text.",
  spinach:
    "Green spinach leaves adding color to steaming vegetable soup pot on stove, NO text NO labels.",
  broccoli:
    "Steamed broccoli florets on plate with small lemon wedge, healthy dinner, NO text.",
  celery:
    "Fresh crunchy celery sticks on cutting board with dip bowl child about to bite, NO text.",
  vanilla:
    "Homemade vanilla ice cream scoop in bowl with vanilla pod beside sweet dessert, NO text NO labels.",
  flour:
    "Baker sifting white flour into mixing bowl before making cake batter on kitchen counter, NO text.",
  pastry:
    "Bakery window with warm golden pastry filled with apple slices steaming fresh, NO readable price tags.",
  seasoning:
    "Cook sprinkling small pinch of colorful seasoning spices onto plain rice bowl improving flavor, NO text NO labels.",
};

export const BATCH17_PROMPTS = {
  courage:
    "Nervous but brave child standing at podium speaking in front of large school audience finding courage, NO text.",
  patience:
    "Child waiting calmly in line for turn on playground with peaceful patient expression, NO text NO numbers.",
  curious:
    "Curious student in class raising hand asking thoughtful question with wonder eyes, teacher smiling, NO text.",
  jealous:
    "Boy watching friend on stage receiving prize trophy feeling jealous envious expression, classroom award day, NO readable text.",
  grateful:
    "Girl writing thank-you note card at desk feeling grateful for friend who helped her, heartwarming, NO readable words.",
  confident:
    "Confident child reading story aloud to class without fear standing tall with book open, NO readable text.",
  determined:
    "Determined young athlete jogging in rain on muddy track training hard despite weather, NO text.",
  respectful:
    "Respectful students listening quietly without interrupting speaker during class presentation, good manners, NO text.",
  responsible:
    "Responsible child feeding pet dog on schedule with food bowl and clock showing routine, NO readable clock numbers.",
  humble:
    "Humble champion athlete thanking teammates with handshake after winning race medal, modest celebration, NO text.",
};

export const BATCH18_PROMPTS = {
  investigate:
    "Detective child with magnifying glass investigating clues footprints and map on table solving mystery, NO readable text.",
  construct:
    "Engineers in hard hats constructing large bridge spanning wide blue river with cranes, NO text NO numbers.",
  demolish:
    "Construction crew carefully demolishing unsafe old building with wrecking ball and safety barriers planned, NO text.",
  translate:
    "Student at desk with two language books pointing between English sentence squiggles and Arabic squiggles translating homework, NO readable words.",
  illustrate:
    "Science textbook open with friendly drawings illustrating step-by-step plant growth roots absorbing water, NO legible text.",
  recommend:
    "Excited child handing adventure novel book to friend recommending it with thumbs up, library background, NO readable title.",
  improve:
    "Child practicing handwriting daily in notebook showing neat letters improving over time on desk, NO readable words.",
  adjust:
    "Student adjusting office chair height so feet touch floor properly at school desk, ergonomic, NO text.",
  confirm:
    "Student double-checking test answers on paper before handing test to teacher confirming responses, NO readable text.",
  examine:
    "Kind doctor examining patient child with stethoscope finding cause of tummy ache gently, NO text.",
};

export const BATCH19_PROMPTS = {
  presentation:
    "Girl at projector giving school presentation explaining volcano eruption with diagram poster, NO readable text.",
  research:
    "Students at library tables with books and notes doing research for better report writing, NO legible titles.",
  assignment:
    "Student at home desk finishing math assignment workbook before tomorrow morning deadline, NO readable numbers.",
  diagram:
    "Clear science diagram poster showing plant roots absorbing water from soil into stem, educational, NO labels NO text.",
  formula:
    "Chalkboard rectangle area lesson with length times width concept shown as blocks not readable formula, NO digits.",
  theory:
    "Classroom poster of famous scientist silhouette with light beam bending concept changing understanding of light, NO readable text.",
  tutor:
    "Friendly private tutor at table helping student understand difficult fraction pizza slices concept, NO numbers NO text.",
  scholarship:
    "Proud student receiving scholarship certificate envelope for excellent grades from principal on stage, NO readable text.",
  campus:
    "Family touring sunny university campus with old buildings green lawns and students walking paths, NO readable signs.",
  textbook:
    "Student opening thick textbook to chapter five about ecosystems with plant and animal illustrations, NO legible words.",
};

export const BATCH20_PROMPTS = {
  software:
    "Computer screen showing program updating with progress bar fixing bugs gear icons, software update mood, NO readable text NO code.",
  hardware:
    "Desktop computer setup showing screen keyboard mouse and tower as computer hardware parts labeled by shapes only, NO text.",
  digital:
    "Digital clock on nightstand showing time with glowing segment display blocks not readable digits, NO numbers NO letters.",
  download:
    "Laptop with download progress bar almost complete after quiet wait at desk with coffee, NO readable percentages.",
  network:
    "School computer lab with cables and wifi signals connecting every classroom computer in network diagram, NO text.",
  measurement:
    "Builder using measuring tape on wooden beam at construction site for accurate measurement preventing mistakes, NO readable numbers.",
  volume:
    "Clear water tank with fill line showing volume of water inside calculated for science class, NO digits NO labels.",
  capacity:
    "Huge stadium packed with very many cheering fans filling entire seats suggesting large capacity crowd, NO readable numbers.",
  million:
    "Desert camp at night with sky completely filled with countless sparkling stars suggesting enormous quantity like a million, NO digits NO text.",
  billion:
    "Ancient Earth globe in space with very deep time mood showing planet incredibly old billions of years, layered rock timeline, NO dates NO numbers.",
};

export const BATCH21_PROMPTS = {
  ancient:
    "Prehistoric cave scene with stone hand axe and carved bone tools on rocky ground, ancient tools made from stone and bone, NO text.",
  empire:
    "Vast ancient empire map view stretching across golden desert dunes and snow-capped mountain ranges, wide kingdom territory, NO labels NO text.",
  pharaoh:
    "Egyptian pharaoh in golden crown standing before colorful temple wall paintings with pillars, royal ruler in temple art, NO hieroglyph text.",
  pyramid:
    "Tourists with backpacks gazing up in wonder at tall ancient stone pyramid under blue sky, marveling at monument, NO text.",
  civilization:
    "Green river valley with early settlement huts and farms where water is plentiful, river civilization growing, NO text NO labels.",
  artifact:
    "Museum glass display case showing small clay pot artifact from ancient tomb with soft spotlight, NO readable labels.",
  archaeology:
    "Archaeologist brushing dirt carefully from old pottery shard at dig site learning about life long ago, NO text.",
  dynasty:
    "Long family tree mural showing many generations of kings ruling one kingdom through time as connected portraits, NO names NO text.",
  ancestor:
    "Old sepia-style scene of ancestor figure arriving by wooden sailing ship at distant shore many years ago, NO text NO dates.",
  ruins:
    "Ancient stone ruins on hill with wind and rain clouds slowly weathering crumbling walls, old worn ruins, NO text.",
};

export const BATCH22_PROMPTS = {
  force:
    "Strong child pushing heavy wooden crate across floor showing physical force moving heavy object, NO text NO numbers.",
  friction:
    "Sled sliding on rough bumpy ice surface slowing down due to friction, winter physics scene, NO text.",
  motion:
    "Friendly scientist under apple tree watching apple fall while moon orbits in sky, studying motion of falling objects, NO text.",
  velocity:
    "Train speeding up leaving station platform with motion blur showing increasing velocity, NO readable numbers.",
  acceleration:
    "Passengers pushed back into train seats as train rapidly accelerates forward, physics moment, NO text.",
  magnetic:
    "Horseshoe magnet attracting cluster of metal paper clips on desk, magnetic field pulling metal, NO text.",
  electricity:
    "Room with glowing ceiling light spinning fan and computer all powered by electricity from wall outlet, NO text.",
  circuit:
    "Simple science circuit with battery wires and small bulb glowing when circuit is closed complete loop, NO labels.",
  conductor:
    "Copper wire coil shown as good conductor with tiny lightning sparks carrying electricity, science demo, NO text.",
  resistance:
    "Thick copper wire versus thin wire comparison showing thick wire allows easier electric flow less resistance, NO numbers.",
};

export const BATCH23_PROMPTS = {
  architecture:
    "Modern glass building with curved steel beams and sleek contemporary architecture skyline, NO text NO logos.",
  foundation:
    "Construction workers pouring wet concrete into wooden forms for building foundation at construction site, NO text.",
  structure:
    "Large bridge steel structure supporting many cars and trucks crossing heavy traffic, strong bridge framework, NO text.",
  column:
    "Grand library entrance lined with tall white marble columns on both sides, NO text NO names.",
  dome:
    "Bright golden dome rising above city skyline on important building, NO text NO labels.",
  monument:
    "Families gathering peacefully near tall stone war monument at sunny noon, remembrance mood, NO readable inscriptions.",
  temple:
    "Ancient stone temple steps guarded by carved lion statues on each side, NO text.",
  cathedral:
    "Cathedral interior with colorful stained glass windows casting rainbow light on floor, NO text NO words.",
  terrace:
    "Sunny rooftop terrace with flower pots blooming in spring sunshine, NO text.",
  corridor:
    "Long quiet school corridor with students walking softly in single file, NO text NO room numbers.",
};

export const BATCH24_PROMPTS = {
  physician:
    "Friendly physician in white coat checking child temperature with thermometer and looking at throat, medical checkup, NO text.",
  dosage:
    "Medicine bottle with label showing dosage instructions as colored blocks not readable text, pharmacy safety, NO legible words.",
  gauze:
    "Clean white gauze bandage wrapped gently over small scraped knee on child, first aid, NO text.",
  splint:
    "Small finger held straight with wooden splint and wrap while healing, NO text.",
  crisis:
    "Calm community leader speaking reassuringly to worried neighbors during emergency crisis with supplies, NO text.",
  symptom:
    "Child with thermometer showing fever as symptom of illness resting in bed with caring parent, NO readable numbers.",
  treatment:
    "Flu treatment scene with child resting in bed drinking fluids and cozy blanket, rest and fluids, NO text.",
  clinic:
    "Neighborhood clinic building opening early morning with patients arriving on weekday, NO readable sign text.",
  pulse:
    "Nurse gently counting pulse on child wrist with watch for one minute, NO readable numbers on watch.",
  infection:
    "Children washing hands thoroughly with soap at sink to prevent spread of infection, NO text.",
};

export const BATCH25_PROMPTS = {
  currency:
    "Different colorful paper money bills from various countries laid on table showing each country own currency, NO readable denominations.",
  profit:
    "School bake sale table with cookies and cupcakes earning money in jar labeled for school trip profit, NO readable text.",
  budget:
    "Students planning classroom supplies budget with notebook list and calculator on desk, NO legible numbers.",
  expense:
    "School trip planning board showing bus tickets as largest expense item with ticket icons, NO readable prices.",
  invoice:
    "Shop clerk handing paper invoice document to customer for stack of ordered books, NO legible text on invoice.",
  merchant:
    "Friendly merchant at busy port market trading colorful spice sacks and jars, NO text NO labels.",
  warehouse:
    "Large warehouse filled with stacked cardboard boxes before holiday sale season, NO readable labels.",
  bargain:
    "Happy girl holding warm winter boots with sale tag showing good bargain find, NO readable price.",
  loan:
    "Library desk with librarian lending stack of books to student for weeks-long library loan, NO text.",
  interest:
    "Piggy bank next to savings passbook showing small interest coins growing over time, NO readable numbers.",
};

export const BATCH26_PROMPTS = {
  tornado:
    "Families hurrying to underground safe shelter after tornado warning siren, emergency safety, NO text.",
  blizzard:
    "Cars completely buried under deep snow during fierce blizzard winter storm, NO text.",
  flood:
    "Low green fields flooded with muddy water after heavy rain, NO text NO numbers.",
  humidity:
    "Sticky humid summer day with child fanning face in muggy hot air, NO text NO thermometer numbers.",
  haze:
    "Soft morning haze over rolling hills making distant colors pastel and muted, NO text.",
  drizzle:
    "Light drizzle rain falling as children walk to school with small umbrellas, NO text.",
  prediction:
    "Weather forecast board showing strong wind warning for tonight with wind icons, NO readable text.",
  gale:
    "Sailors on deck securing ropes tightly before strong gale wind arrives at sea, NO text.",
  thunderstorm:
    "Family staying safely indoors watching loud thunderstorm through window with lightning flash, NO text.",
  monsoon:
    "Heavy monsoon rain pouring on coastal farm fields with crops and palm trees, NO text.",
};

export const BATCH27_PROMPTS = {
  fiction:
    "Child reading science fiction book imagining futuristic spaceship and alien planet in thought bubble shapes, NO readable text.",
  biography:
    "Open biography book with explorer portrait and adventure map showing brave exploration life story, NO legible words.",
  poetry:
    "Child reciting poetry on small stage with rhythmic hand gestures and vivid imagery shapes floating, NO text.",
  novel:
    "Boy cozy on rainy weekend reading thick mystery novel with rain on window, NO readable title.",
  author:
    "Author at bookstore signing copies of new book for smiling readers with pen, NO readable text on books.",
  composer:
    "Composer at piano writing sheet music notes as squiggles for children ballet performance, NO legible music text.",
  fable:
    "Storybook fable scene of hardworking ant and relaxed grasshopper teaching honest work lesson, NO text.",
  legend:
    "Village elder telling legend story of hero saving village to gathered children around campfire, NO text.",
  narrative:
    "Girl telling engaging story to captivated audience all listening closely with wide eyes, NO text.",
  publisher:
    "Printing press rolling out many stacked copies of atlas books for publisher shipment, NO readable text.",
};

export const BATCH28_PROMPTS = {
  instrument:
    "Music classroom with students each holding different band instrument trumpet flute drums, choosing for band class, NO text.",
  cello:
    "Musician playing large cello producing deep warm rich tone with vibration waves, NO text NO sheet music.",
  flute:
    "Flute player at open window with gentle melody floating as soft musical wave shapes outside, NO text.",
  clarinet:
    "Clarinet player joining marching band parade with drums and flags, NO readable music.",
  harmony:
    "School choir children singing together voices blending in beautiful harmony, NO text NO lyrics.",
  chorus:
    "Chorus group on stage singing final verse together with conductor, NO readable lyrics.",
  duet:
    "Two friends playing piano duet together on one piano at school recital, NO sheet music text.",
  tempo:
    "Conductor slowing hand motion to reduce tempo near end of orchestral piece, NO text.",
  octave:
    "Singer reaching one octave higher note shown as higher musical wave above previous note, NO text NO numbers.",
  rehearsal:
    "Band rehearsal fixing mistakes before concert with conductor pointing out corrections, NO readable music.",
};

export const BATCH29_PROMPTS = {
  marathon:
    "Runners training on city road for months preparing for upcoming city marathon race, NO text NO bib numbers.",
  arena:
    "Large sports arena filled with cheering fans before championship game starts, NO readable banners.",
  scorekeeper:
    "Scorekeeper at basketball game updating score board after each basket with flip cards not digits, NO numbers.",
  opponent:
    "Two sports teams shaking hands fairly after game opponent showing good sportsmanship, NO text.",
  ribbon:
    "Girl pinning blue first-place ribbon on winning science poster display, NO readable text on poster.",
  triumph:
    "Student celebrating triumph victory at spelling contest with trophy and confetti, NO readable words.",
  tournament:
    "Eight chess teams seated at tables competing in school chess tournament, NO readable signs.",
  athlete:
    "Athletes stretching legs and arms on track before relay race begins, NO text NO numbers.",
  sprint:
    "Runner winning fifty-meter sprint race by one step at finish line, NO readable numbers on track.",
  relay:
    "Relay race team smoothly passing baton between runners on track, NO text NO bib numbers.",
};

export const BATCH30_PROMPTS = {
  expand:
    "Train railroad metal rails slightly expanded and buckled on hot summer day heat expansion, NO text.",
  shrink:
    "Wool sweater shrinking in hot washing machine with child surprised holding smaller sweater, NO text.",
  develop:
    "Seed sprouting and developing into small green plant with sun and water droplets, growth sequence, NO text.",
  transform:
    "Ice cube melting and transforming into flowing water puddle with warm sun rays, NO text.",
  migrate:
    "V-formation flock of geese flying south migrating before cold winter arrives, NO text.",
  adapt:
    "Desert cactus and hardy plants adapting to survive with very little rain in sandy desert, NO text.",
  survive:
    "Lone strong tree surviving fierce storm winds on cliff edge while others fallen, NO text.",
  thrive:
    "Vegetable garden thriving with lush tomatoes and greens in rich well-watered dark soil, NO text.",
  reduce:
    "Child turning off light switch to reduce electricity use with darkened room and off lamp, NO text.",
  increase:
    "Student vocabulary growing shown as more word cards appearing on desk from daily reading habit, NO readable words.",
};

export const BATCH31_PROMPTS = {
  mineral:
    "Shiny clear quartz crystal mineral embedded in gray rocky stone on science table, common mineral in rocks, NO text.",
  crystal:
    "White salt drying into beautiful clear geometric crystal shapes on sunny plate, NO text NO numbers.",
  gemstone:
    "Jeweler polishing bright sparkling blue gemstone at workbench with soft light, NO text.",
  fossil:
    "Fish fossil imprint trapped inside flat gray limestone rock slab, ancient preserved fish shape, NO text.",
  magma:
    "Cross-section of Earth showing glowing hot orange magma rising from deep underground, geology lesson, NO text.",
  lava:
    "Slow red orange lava flowing gently down mountain volcano slope, NO text NO numbers.",
  sediment:
    "River water slowing at lake bottom with layers of brown sediment settling, peaceful lake scene, NO text.",
  erosion:
    "Soft cliff face being worn away by wind and water streams causing erosion, NO text.",
  glacier:
    "Massive blue-white glacier slowly moving across mountain valley each year, NO text NO measurements.",
  boulder:
    "Large round gray boulder blocking forest hiking trail path, NO text.",
};

export const BATCH32_PROMPTS = {
  element:
    "Friendly science poster style scene showing oxygen as essential element with green plants and breathing child, NO readable text.",
  compound:
    "Two round water molecule balls combining into one water drop compound, simple chemistry, NO letters NO numbers.",
  mixture:
    "Colorful trail mix bowl with nuts dried fruit and chocolate pieces tasty mixture, NO labels.",
  dissolve:
    "Sugar cube dissolving and disappearing in warm steaming tea cup, NO text.",
  vapor:
    "Gentle water vapor steam rising from hot soup bowl on kitchen table, NO text.",
  particle:
    "Tiny dust particles floating and sparkling in bright sunbeam through window, NO text.",
  chemical:
    "Locked cabinet storing harsh chemical bottles safely away from curious children, safety scene, NO readable labels.",
  react:
    "Vinegar poured on baking soda in bowl creating bubbly foaming reaction, science experiment, NO text.",
  solute:
    "Salt grains being stirred and dissolving into clear glass of water as solute, NO text.",
  solvent:
    "Clear water in glass dissolving colorful sugar cubes as solvent for substances, NO text.",
};

export const BATCH33_PROMPTS = {
  custom:
    "Child politely bowing and greeting elder grandparent showing respectful greeting custom, warm family scene, NO text.",
  ritual:
    "Family morning ritual before school with breakfast together and backpacks ready, cozy routine, NO text.",
  symbol:
    "White dove bird carrying olive branch as symbol of peace in sunny sky, NO text NO words.",
  banner:
    "Students painting colorful welcome banner with brush and paint for school guests, NO readable text on banner.",
  anthem:
    "Crowd standing quietly hand on heart during national anthem at school assembly, NO readable lyrics.",
  patriotism:
    "Children planting tree and cleaning park showing love and care for country and community, NO text.",
  colony:
    "History classroom diorama of old settlement colony gaining independence with flags and simple buildings, NO readable text.",
  border:
    "Friendly border checkpoint with guard checking passport booklet at country entry gate, NO readable passport text.",
  region:
    "Rolling hills with olive trees and sunny farmland famous Mediterranean region landscape, NO text NO labels.",
  territory:
    "Wolf pack standing protectively on hill defending their forest territory from distant wolves, NO text.",
};

export const BATCH34_PROMPTS = {
  enormous:
    "Enormous friendly whale surfacing beside small boat making sailors look tiny, ocean scene, NO text.",
  miniature:
    "Girl proudly showing tiny miniature model replica of her school building on desk, NO readable text.",
  abundant:
    "Valley farm fields overflowing with abundant golden wheat and vegetables after rain, NO text.",
  scarce:
    "Dry cracked earth with nearly empty water jug showing scarce clean water during drought, NO text NO numbers.",
  temporary:
    "Colorful temporary fence around fairground that will come down after festival, NO readable signs.",
  permanent:
    "Stone trail marker post permanently marking hiking trail start in forest, NO readable words.",
  visible:
    "Snowy mountain peak clearly visible through bedroom window on clear day, NO text.",
  invisible:
    "Microscope on desk revealing invisible germs as cute round dots on slide, NO text NO labels.",
  flexible:
    "Willow tree branch bending flexibly in wind without breaking, spring scene, NO text.",
  rigid:
    "Straight rigid metal bar that will not bend when child tries to flex it, NO text.",
};

export const BATCH35_PROMPTS = {
  explain:
    "Teacher at whiteboard explaining math idea to student with clear gesture and example objects, NO readable board text.",
  describe:
    "Child describing forest using senses with eyes ears and nose icons in thought bubbles trees birds flowers, NO text.",
  define:
    "Student using thick glossary book at back of textbook to define unfamiliar word, NO legible words.",
  respond:
    "Student raising hand responding to teacher question with complete sentence speech bubble as squiggles, NO readable text.",
  request:
    "Student politely requesting extra time for project from teacher at desk, NO readable clock numbers.",
  compliment:
    "Child kindly complimenting classmate on beautiful art project with warm smile, NO text.",
  encourage:
    "Teacher encouraging nervous student to try again at chalkboard with supportive hand on shoulder, NO readable text.",
  disagree:
    "Two friends discussing with different opinions but smiling and respecting each other, NO text.",
  support:
    "Team members supporting nervous teammate before presentation with encouraging huddle, NO text.",
  regret:
    "Older brother happy helping younger sister tie shoes showing no regret only kindness, NO text.",
};

export const BATCH36_PROMPTS = {
  photosynthesis:
    "Green plant leaves absorbing bright sunlight making food photosynthesis with sun rays and leaf glow, NO text.",
  pollen:
    "Friendly bee carrying yellow pollen from one colorful flower to another, garden scene, NO text.",
  seedling:
    "Small green seedling sprout in pot needing water droplets and gentle sunlight, NO text.",
  greenhouse:
    "Red tomatoes growing faster inside warm glass greenhouse with sun streaming in, NO text.",
  fertilizer:
    "Gardener sprinkling organic fertilizer on rich dark garden soil with healthy plants, NO labels NO text.",
  irrigation:
    "Irrigation water channels bringing blue water to dry brown farm fields, NO text.",
  prune:
    "Gardener carefully pruning dead brown branches from bush in early spring garden, NO text.",
  germinate:
    "Seeds germinating and sprouting from warm moist soil in planting tray, NO text.",
  wilt:
    "Sad wilted flowers drooping in dry pot without enough water, NO text.",
  sapling:
    "Child planting small tree sapling that may grow into tall oak someday, NO text.",
};

export const BATCH37_PROMPTS = {
  amphibian:
    "Friendly green frog amphibian sitting on rock near pond living on land and in water, NO text.",
  reptile:
    "Friendly snake reptile with dry scaly skin on sunny rock, storybook safe not scary, NO text.",
  mammal:
    "Large whale mammal swimming in ocean even though it lives in water, NO text.",
  carnivore:
    "Lion carnivore on savanna hunting scene storybook friendly, NO blood NO text.",
  herbivore:
    "Gentle deer herbivore eating green leaves and grass in forest, NO text.",
  predator:
    "Hawk predator bird circling sky searching for small prey below, NO violence NO text.",
  prey:
    "Small rabbits as prey hiding in forest while owl watches from tree, gentle nature scene, NO text.",
  larvae:
    "Tiny caterpillar larvae hatching from small eggs on green leaf, butterfly life cycle, NO text.",
  pupa:
    "Chrysalis pupa hanging from branch while caterpillar transforms inside, NO text.",
  nocturnal:
    "Cute owl nocturnal bird wide awake at night with moon and stars, NO text.",
};

export const BATCH38_PROMPTS = {
  policy:
    "School bike rack with students wearing safety helmets per school policy, NO readable signs.",
  permit:
    "Park ranger handing camping permit paper to family at national park entrance, NO legible text.",
  penalty:
    "Teacher explaining quiz penalty for cheating with empty desk and sad student learning lesson, NO readable text.",
  forbidden:
    "School hallway with no running sign icon and students walking safely, NO readable words.",
  allowed:
    "Students doing group work with quiet talking allowed shown by soft speech bubbles as squiggles, NO text.",
  consequence:
    "Child thinking about choice consequence with fork in path showing two outcomes, NO text.",
  regulation:
    "Fire safety regulation scene with sprinkler exit signs and safe building, NO readable text.",
  consent:
    "Parent signing permission slip for school field trip giving consent, NO legible words on paper.",
  ordinance:
    "Quiet peaceful town night scene with soft music limit ordinance mood stars and sleeping houses, NO readable text.",
  guideline:
    "Child safely using scissors following safety guideline poster with careful hands, NO readable poster text.",
};

export const BATCH39_PROMPTS = {
  millimeter:
    "Tiny ant next to ruler showing ant is very small only few millimeters long, ruler has tick marks NO digits NO numbers.",
  milliliter:
    "Medicine dosing cup with small amount of syrup for child, NO readable measurements.",
  metric:
    "Science classroom measuring length with metric ruler and meter stick on desk, NO readable numbers.",
  celsius:
    "Glass of water with ice cubes freezing at cold temperature science demo, thermometer shows dots not numbers NO text.",
  fahrenheit:
    "Kitchen oven heating with warm glow baking cookies, oven dial has dots not numbers NO text.",
  breadth:
    "Person measuring breadth width of wooden table with tape measure before buying cloth, NO readable numbers.",
  altitude:
    "Airplane flying high above fluffy clouds at high altitude, NO text NO numbers.",
  depth:
    "Children measuring depth of swimming pool with long pole from pool edge, NO readable numbers.",
  circumference:
    "Child wrapping tape around thick tree trunk measuring circumference, NO readable numbers.",
  radius:
    "Circle diagram with line from center to edge showing radius concept on chalkboard, NO numbers NO text.",
};

export const BATCH40_PROMPTS = {
  satellite:
    "Satellite orbiting Earth sending weather cloud pictures to ground station, space scene, NO text.",
  drone:
    "Small drone flying above soccer field filming game from sky, NO logos NO text.",
  sensor:
    "Motion sensor on hallway ceiling turning on lights when student walks by, NO text.",
  automation:
    "Factory conveyor belt automatically packing cardboard boxes quickly, friendly automation, NO logos NO text.",
  virtual:
    "Child wearing headset taking virtual tour of art museum on computer screen showing paintings, NO readable text.",
  artificial:
    "Science lab with bright artificial ceiling lights replacing sunlight through blinded windows, NO text.",
  intelligence:
    "Student solving puzzle problem showing practical intelligence with lightbulb idea, NO text.",
  algorithm:
    "Computer sorting colorful blocks from smallest to largest step by step algorithm concept, NO numbers NO text.",
  geometry:
    "Geometry class desk with shapes triangles circles angles and ruler tools, NO readable text.",
  probability:
    "Cloudy afternoon sky with umbrella and rain boots suggesting high probability of rain, NO text NO numbers.",
};

export const BATCH41_PROMPTS = {
  patent:
    "Happy inventor holding official patent certificate scroll for clever new hand tool invention celebration, workshop table, NO readable text NO numbers.",
  invention:
    "Vintage telephone invention on display showing communication device that changed history, museum style friendly, NO text NO labels.",
  innovation:
    "Student wearing backpack with small solar panels charging phone showing green tech innovation, sunny school yard, NO text NO logos.",
  pioneer:
    "Brave pioneer explorer with map and hat charting trail through unknown snowy mountains, adventure mood, NO readable map text.",
  breakthrough:
    "Science lab team cheering around improved battery prototype glowing on table breakthrough moment, goggles and beakers, NO text.",
  discovery:
    "Girl scientist amazed discovering shiny new beetle species with magnifying glass in garden, exciting news mood, NO text NO labels.",
  device:
    "Classroom air quality monitor device on desk with green healthy air indicator lights, students learning, NO readable digits.",
  gadget:
    "Dad using handy jar-opening kitchen gadget to twist tight lid easily, helpful tool smile, NO text NO labels.",
  prototype:
    "Students proudly showing cardboard prototype model of recycling sorting machine at science fair table, NO readable text.",
  mechanism:
    "Cutaway friendly wall clock showing tiny colorful gears and moving mechanism keeping time, NO numbers on clock face.",
};

export const BATCH42_PROMPTS = {
  coral:
    "Warm shallow tropical sea with slow-growing colorful coral formations and small fish, peaceful marine scene, NO text.",
  reef:
    "Bright underwater reef with fish hiding among rocky coral formations, clear blue water, NO text NO labels.",
  tide:
    "Rising ocean tide gently covering sandy beach rocks as water line moves up shore, coastal scene, NO text NO numbers.",
  current:
    "Small boat being pulled slightly off course by strong visible ocean current arrows in water, friendly sailors, NO text.",
  anchor:
    "Sailor dropping heavy ship anchor into calm blue bay water with rope chain, peaceful harbor, NO text.",
  submarine:
    "Yellow submarine exploring dark deep ocean floor with spotlight and curious fish outside porthole, NO text NO logos.",
  seaweed:
    "Green seaweed washed onto sandy shore after storm with gentle waves, beach cleanup mood, NO text.",
  plankton:
    "Microscopic view of tiny drifting plankton floating near bright sunlit ocean surface, science lesson cute dots, NO text.",
  jellyfish:
    "Translucent friendly jellyfish pulsing gently through crystal clear turquoise water, NO scary mood NO text.",
  kelp:
    "Tall swaying kelp forest underwater in coastal current with fish swimming between long green strands, NO text.",
};

export const BATCH43_PROMPTS = {
  northeast:
    "Simple map with capital city dot and small village clearly to the northeast direction arrow, geography lesson shapes only, NO readable text.",
  northwest:
    "Afternoon park scene with trees bending from wind blowing from northwest shown by curved wind lines, NO text NO compass letters.",
  southeast:
    "Flock of birds flying toward southeast wetland marshes with arrow hint in sky, migration mood, NO text NO labels.",
  southwest:
    "Vast desert landscape stretching far toward southwest horizon with sun low in sky, NO text NO map labels.",
  navigate:
    "Pilot in cockpit using map chart and radio headset to navigate airplane safely, friendly controls, NO readable instruments.",
  landmark:
    "Famous old stone tower city landmark visible above rooftops tourists pointing, NO readable signs.",
  route:
    "Family car choosing safest winding route through green hills on road map spread on hood, NO legible place names.",
  pathway:
    "Curved stone garden pathway leading to wooden gate among flowers, peaceful home garden, NO text.",
  orientation:
    "Child holding map and compass improving sense of direction in town square practice, NO readable map words.",
  coordinates:
    "Handheld GPS device showing location pin on simple map grid as colored shapes only, NO digits NO text.",
};

export const BATCH44_PROMPTS = {
  dawn:
    "Farmers starting work at pink dawn sky over fields with rooster and morning mist, early day mood, NO text NO clock.",
  dusk:
    "Streetlamps turning on along quiet neighborhood at purple dusk sky, cozy evening, NO text.",
  twilight:
    "Soft purple twilight clouds over calm lake reflecting gentle colors, peaceful sky, NO text.",
  daybreak:
    "Forest filled with birds singing at daybreak sun rays through trees, morning nature, NO text.",
  nightfall:
    "Campers gathering firewood stack before dark nightfall around tent with orange sky fading, NO text.",
  duration:
    "Movie theater ticket stub next to clock showing long two-hour film duration concept with popcorn, clock has dots not numbers, NO text.",
  interval:
    "Theater stage with red curtain closed during short break interval between two acts, audience waiting, NO readable program text.",
  moment:
    "Student pausing one moment searching backpack for notebook before class, patient friend waiting, NO text.",
  instant:
    "Camera flash capturing instant of pure joy child jumping in air at birthday, photo freeze mood, NO text.",
  era:
    "Museum dinosaur skeleton display representing long-ago dinosaur era before humans timeline feel, NO dates NO text.",
};

export const BATCH45_PROMPTS = {
  detergent:
    "Laundry sink with detergent bottle pouring bubbles into water before washing colorful clothes, NO readable labels.",
  appliance:
    "Parent unplugging kitchen toaster appliance from wall socket when not in use safety lesson, NO text NO brand.",
  utensil:
    "Kitchen drawer open near stove neatly storing wooden spoons spatulas cooking utensils, NO text NO labels.",
  cupboard:
    "Neat stacked plates on kitchen cupboard shelf above counter cozy home, NO text.",
  drawer:
    "Desk top drawer open full of pencils erasers and ruler student supplies, NO text.",
  drain:
    "Bathroom sink with water flowing down round drain after hand washing soap bubbles, NO text.",
  leak:
    "Small drip leak from pipe under kitchen sink with bowl catching drops child noticing, NO scary mood NO text.",
  plumbing:
    "Cross-section friendly house showing clean water pipes bringing water to tap plumbing system, NO labels NO text.",
  carpet:
    "Cozy living room with soft fluffy carpet children sitting reading comfortably, warm home, NO text.",
  bleach:
    "Careful gloved hands adding small bleach bottle to white towel laundry tub safety distance, NO readable label text.",
};

export const BATCH46_PROMPTS = {
  frustrated:
    "Girl frowning slightly trying puzzle piece that will not fit into jigsaw frustrated expression, table scene, NO text.",
  embarrassed:
    "Boy blushing embarrassed after small trip on school stage performance still smiling shy, NO text.",
  astonished:
    "Children mouths open astonished amazed watching magician pull rabbit from hat trick, NO text.",
  relieved:
    "Parents hugging relieved smiling as school bus arrives safely at stop with children waving, NO text.",
  anxious:
    "Girl hands clammy anxious waiting backstage before first piano recital with sheet music, supportive mood, NO text.",
  delighted:
    "Children delighted jumping at surprise birthday party with balloons and cake, joyful faces, NO text.",
  disappointed:
    "Boy disappointed looking at canceled picnic rain through window umbrella unused, gentle sad mood, NO text.",
  furious:
    "Coach furious arms crossed about unfair referee call on sports field but still cartoon-safe not violent, NO text.",
  content:
    "Girl content peaceful reading book by warm glowing fireplace with cat, cozy satisfied smile, NO text.",
  overwhelmed:
    "Student overwhelmed at desk with tall stack of many homework papers hands on head, NO readable text on papers.",
};

export const BATCH47_PROMPTS = {
  design:
    "Architect at drafting table designing safe beautiful school building model with ruler, blueprints as squiggles, NO readable text.",
  sketch:
    "Child sketching invention idea in notebook before building cardboard model on table, creative process, NO legible words.",
  craft:
    "Kids crafting colorful bead bracelets at craft table threading strings, art class, NO text.",
  assemble:
    "Father and child following picture steps assembling wooden bookshelf with screwdriver parts spread, NO readable instructions.",
  repair:
    "Dad repairing bent bicycle wheel with tools in garage child watching learning, NO text NO brand logos.",
  install:
    "Technicians on ladder installing bright new gym ceiling lights while students watch safely below, NO text.",
  remove:
    "Child politely removing muddy sneakers at front door mat before entering clean hallway, NO text.",
  replace:
    "Person replacing old water filter cartridge under sink for clean drinking water, NO readable labels.",
  decorate:
    "Students decorating school hall with hanging paper stars and streamers for event, festive, NO readable banners.",
  polish:
    "Girl sitting on bench polishing school shoes with cloth until shiny reflection, proud smile, NO text.",
};

export const BATCH48_PROMPTS = {
  governor:
    "Governor speaking at microphone ribbon-cutting new school building opening students clapping, NO readable signs.",
  senator:
    "Senator at podium proposing forest protection law with trees poster behind as shapes only, parliament mood, NO text.",
  parliament:
    "Large parliament hall with rows of seats debating education budget with books icon, dignified, NO readable text.",
  ambassador:
    "Friendly ambassador welcoming international students with flags as colored shapes at school entrance, NO country names.",
  diplomat:
    "Skilled diplomat shaking hands helping two country leaders agree at round table dispute solving, NO flags with text.",
  treaty:
    "Two nations representatives signing peace treaty document at desk with doves decoration, NO legible writing.",
  alliance:
    "Alliance of neighboring towns sharing sandbags and food trucks during flood help together, community teamwork, NO text.",
  summit:
    "World leaders at climate summit round table with earth globe centerpiece discussing, NO readable name tags.",
  legislature:
    "Legislature chamber voting hands raised on new public health law with heart symbol banner, NO text.",
  cabinet:
    "Government cabinet ministers around table discussing safer roads plan with road diagram squiggles, NO readable text.",
};

export const BATCH49_PROMPTS = {
  denominator:
    "Fraction pie drawn on board bottom part highlighted as denominator concept for one-half lesson, NO digits NO fraction symbols.",
  quotient:
    "Math classroom showing twelve items divided into three equal groups result concept without showing numbers, blocks only, NO digits.",
  pentagon:
    "Perfect five-sided pentagon shape traced on geometry paper with five equal sides highlighted, NO numbers NO labels.",
  hexagon:
    "Honeycomb close-up with perfect six-sided hexagon cells golden honey friendly bees, NO text.",
  trapezoid:
    "Wide trapezoid-shaped wooden table top viewed from angle geometry lesson, four sides one pair parallel, NO measurements.",
  algebra:
    "Algebra class desk with letter tiles and unknown number boxes puzzle friendly math, NO readable equations.",
  statistics:
    "Students comparing fair test score bar charts on poster boards statistics lesson, bars as colors no numbers, NO text.",
  percentage:
    "Classroom circle chart showing small slice chosen science project without numeric labels, twenty percent concept as few students raising hands out of group, NO digits.",
  parallel:
    "Two parallel train tracks and road lines stretching far never meeting even on horizon, geometry demo, NO text.",
  vertical:
    "Child drawing tall vertical line on paper from top to bottom with ruler, geometry lesson, NO numbers.",
};

export const BATCH50_PROMPTS = {
  achievement:
    "Proud student holding finished thick book trophy sticker achievement celebration at desk, NO readable text.",
  challenge:
    "Kids tackling hard math challenge puzzle on board thinking deeply together, determined friendly faces, NO digits.",
  obstacle:
    "Team helping each other climb over log obstacle on outdoor course teamwork, NO text.",
  strategy:
    "Student at test desk answering easy questions first with strategy checklist cards easy then hard, NO readable text.",
  tactic:
    "Relay race team using smart baton pass tactic saving time cheering teammates, track field, NO numbers.",
  mission:
    "Space mission rocket returning photos of distant moons displayed on mission control screens as circles, NO text NO NASA logos.",
  purpose:
    "Science experiment table with hypothesis note purpose of testing idea with seeds and sun lamp, NO legible writing.",
  ambition:
    "Girl dreaming thought bubble of marine biologist studying whales on boat future ambition poster, NO text.",
  success:
    "Student bowing on stage after successful play practice and patience led to applause success, NO readable text.",
  failure:
    "Child learning from failed tower of blocks trying different approach rebuilding with smile growth mindset, NO text.",
};

export const BATCH51_PROMPTS = {
  timber:
    "Builders carrying strong wooden timber beams for house frame construction at friendly building site, NO text.",
  evergreen:
    "Snowy winter forest with pine evergreen trees staying bright green while snow covers ground, NO text.",
  deciduous:
    "Deciduous tree in autumn losing orange and red leaves falling to ground, friendly park scene, NO text.",
  trunk:
    "Wide thick oak tree trunk supporting heavy tree with friendly squirrel, forest scene, NO text.",
  branch:
    "Small bird building nest on low tree branch, spring woodland, NO text.",
  canopy:
    "Dense forest leaf canopy overhead blocking harsh bright midday sun rays on hiking trail below, NO text.",
  sap:
    "Sticky golden sap dripping from cut maple tree trunk with bucket below, woodland, NO text.",
  woodland:
    "Quiet deer wandering through peaceful sunlit woodland path between trees, NO text.",
  grove:
    "Sunny hillside covered with neat rows of olive grove trees, Mediterranean mood, NO text.",
  twig:
    "Girl collecting dry twig near campfire to start camping fire, outdoor campsite, NO text.",
};

export const BATCH52_PROMPTS = {
  copper:
    "Shiny copper pots heating on kitchen stove with warm steam, cozy kitchen, NO text.",
  bronze:
    "Green patina bronze statue in park turned green over years, friendly public square, NO text.",
  aluminum:
    "Aluminum foil wrapping leftover food on kitchen counter keeping it fresh, NO labels NO text.",
  titanium:
    "Lightweight strong titanium metal bars and small airplane part on workshop table, science mood, NO text.",
  ceramic:
    "Colorful ceramic tiles covering bathroom floor in neat pattern, clean bathroom, NO text.",
  nylon:
    "Thick nylon rope tied firmly to post holding steady in windy outdoor scene, NO text.",
  graphite:
    "Pencil cut open showing dark gray graphite core making marks on paper, desk scene, NO text.",
  porcelain:
    "Delicate white porcelain teacups sitting neatly on wooden shelf, NO text.",
  fiberglass:
    "Pink fiberglass insulation batts in attic keeping warm cozy house interior below, NO text.",
  alloy:
    "Steel alloy metal sample bars with iron and carbon science display on table, friendly workshop, NO digits NO text.",
};

export const BATCH53_PROMPTS = {
  predict:
    "Scientists with weather tools and radar screen predicting tomorrow rain clouds, friendly lab, NO readable text.",
  conclude:
    "Students at desk concluding plants need sunlight comparing plant under lamp versus dark corner, science lesson, NO text.",
  infer:
    "Detective child looking at muddy boots inferring someone walked in wet garden path, NO text.",
  assume:
    "Student pausing to read test question carefully instead of assuming answer too quickly, classroom, NO text.",
  doubt:
    "Skeptical child with raised eyebrow doubting unbelievable story until seeing proof photo, NO readable text.",
  suspect:
    "Friendly detectives searching school locker suspecting missing keys are inside, mystery mood, NO text.",
  recall:
    "Student thinking hard recalling capital city on globe pointing at Egypt region shape, geography class, NO labels.",
  memorize:
    "Child memorizing poem standing at school assembly stage with notecards, NO readable words.",
  recite:
    "Girl reciting pledge with hand on heart before class starts, morning school routine, NO readable text.",
  reflect:
    "Student sitting quietly journaling reflecting on what learned today at sunset desk, thoughtful mood, NO text.",
};

export const BATCH54_PROMPTS = {
  alert:
    "School fire alarm alerting students during fire drill exiting calmly, red alarm bell, NO text.",
  vigilance:
    "Lifeguard watching pool with constant vigilance preventing accidents near swimming pool, NO text.",
  hazard:
    "Wet slippery hallway floor with caution cone showing hazard puddle, school corridor, NO text.",
  evacuate:
    "Students evacuating school building in orderly line during safety drill, NO text.",
  stretcher:
    "Medics placing injured hiker on orange stretcher in outdoor rescue scene, friendly safe mood, NO text.",
  paramedic:
    "Paramedic checking pulse of injured hiker with stethoscope outdoors, emergency care, NO text.",
  precaution:
    "Students wearing safety goggles in science lab as precaution before experiment, NO text.",
  extinguish:
    "Firefighters quickly extinguishing small blaze with hose spray, heroic safe scene, NO scary faces.",
  lifeboat:
    "Crew boarding orange lifeboat during stormy sea rescue drill, waves and rain, NO text.",
  lifejacket:
    "Passengers on boat all wearing bright orange lifejackets smiling safely, NO text.",
};

export const BATCH55_PROMPTS = {
  locomotive:
    "Powerful steam locomotive pulling long line of ten heavy freight train cars on tracks, NO digits.",
  carriage:
    "Old-fashioned horse-drawn carriage carrying people through historic city street, NO text.",
  ferry:
    "Large ferry boat carrying cars across wide blue river, sunny day, NO text.",
  yacht:
    "White yacht sailing smoothly on calm bay water, peaceful seaside, NO text.",
  kayak:
    "Two kids paddling red kayak along rocky shoreline, adventure mood, NO text.",
  canoe:
    "Long wooden canoe loaded with camping supplies on lakeshore, NO text.",
  tram:
    "Colorful city tram stopping at corner of old town street with passengers, NO text.",
  glider:
    "Silent glider airplane soaring above green fields and hills, blue sky, NO text.",
  parachute:
    "Parachute opening wide above skydiver landing safely on green field, NO text.",
  runway:
    "Airplane accelerating down long airport runway for takeoff, NO airline logos NO text.",
};

export const BATCH56_PROMPTS = {
  mosaic:
    "Students creating colorful glass tile mosaic art project on table, craft classroom, NO text.",
  embroidery:
    "Fine colorful embroidery decorating edge of cloth on embroidery hoop, craft desk, NO text.",
  origami:
    "Flat paper transforming into folded origami animals crane and frog on desk, NO text.",
  collage:
    "Art collage mixing photos fabric scraps and painted shapes on poster board, creative desk, NO text.",
  canvas:
    "Artist stretching white canvas over wooden frame in sunny studio, NO text.",
  palette:
    "Artist wooden palette with blended paint colors and brush, NO text.",
  watercolor:
    "Soft light watercolor painting of flowers with wet brush and palette, art class, NO text.",
  kiln:
    "Hot pottery kiln with clay bowls hardening inside craft studio, warm glow, NO text.",
  glaze:
    "Shiny glazed ceramic bowl smooth and bright after firing, craft table, NO text.",
  pigment:
    "Natural deep red pigment powder mixing into paint on palette, art science, NO text.",
};

export const BATCH57_PROMPTS = {
  astronaut:
    "Astronaut in training suit practicing inside space center simulator before launch, NO NASA logos NO text.",
  astronomer:
    "Astronomer mapping stars with large telescope under starry night sky, observatory, NO text.",
  pharmacist:
    "Friendly pharmacist explaining medicine bottle to customer at pharmacy counter, NO readable labels.",
  librarian:
    "Librarian helping children find dinosaur books on library shelf, NO readable titles.",
  architect:
    "Architect drawing building plans for new community center at drafting desk, blueprints as lines only NO text.",
  engineer:
    "Engineer presenting earthquake-resistant bridge model design on table, NO text.",
  surveyor:
    "Land surveyor measuring field with tripod instrument before construction, NO digits.",
  journalist:
    "Journalist with notepad writing report at lively school fair event, NO readable writing.",
  photographer:
    "Photographer capturing graduation smiles with camera at school ceremony, NO text.",
  botanist:
    "Botanist studying rare colorful flowers in lush rainforest with notebook, NO text.",
};

export const BATCH58_PROMPTS = {
  rapid:
    "Hikers surprised by rapid sudden weather change clouds and wind on mountain trail, NO text.",
  gradual:
    "Thermometer showing gradual temperature rise over week with gentle upward arrow shape not numbers, sunny week mood, NO digits.",
  sudden:
    "Sudden gust of wind blowing papers off desk through open window, surprised student, NO text.",
  frequent:
    "Child practicing piano frequently every day with calendar showing many practice stickers not numbers, NO digits.",
  rare:
    "Rare snow falling in warm coastal city with palm trees and surprised residents, NO text.",
  typical:
    "Typical school day starting with morning assembly students in line outside building, NO text.",
  unusual:
    "Unusual cloud shaped like a ship sailing across blue sky, kids pointing up amazed, NO text.",
  ordinary:
    "Child examining ordinary plain rock that splits open revealing interesting fossil inside, NO text.",
  extraordinary:
    "Girl with extraordinary memory reciting long list from memory amazing whole class, NO readable text.",
  brilliant:
    "Brilliant stars filling clear desert night sky above camping tent, NO text.",
};

export const BATCH59_PROMPTS = {
  impossible:
    "Student racing to finish homework before school bell rings feeling impossible deadline pressure, NO clock numbers.",
  rewrite:
    "Student rewriting messy notebook paragraph into neat organized sentences at desk, NO readable words.",
  preview:
    "Class watching short preview clip of new science film on projector screen, NO readable titles.",
  postwar:
    "Postwar city rebuilding schools and hospitals with construction cranes and workers, hopeful mood, NO text.",
  underground:
    "Underground train tunnel beneath city with subway train passing through, cross-section view, NO text.",
  overflow:
    "Heavy rain causing river overflow flooding riverbank with water spilling over, NO text.",
  underdog:
    "Underdog smaller sports team celebrating winning final game trophy against bigger team, NO text.",
  horizontal:
    "Student drawing horizontal line across middle of blank page with ruler, geometry lesson, NO text.",
  diagonal:
    "Sandwich cut along diagonal line into two triangle halves on plate, NO text.",
  symmetry:
    "Butterfly with perfectly symmetrical matching wings on flower, nature close-up, NO text.",
};

export const BATCH60_PROMPTS = {
  wisdom:
    "Grandparents sharing wisdom with grandchildren on porch telling stories from years of experience, warm mood, NO text.",
  knowledge:
    "Child reading book building knowledge with globe and maps around cozy reading nook, NO readable text.",
  experience:
    "Kids camping outdoors gaining experience setting tent and cooking by fire, NO text.",
  memory:
    "Photo album keeping memory alive of fun school field trip with bus and friends, NO readable text.",
  creativity:
    "Art class encouraging creativity with paint splashes new ideas and colorful projects, NO text.",
  curiosity:
    "Curious scientist child asking bold questions with magnifying glass and question mark thought bubble not text, NO letters.",
  fairness:
    "Teacher dividing equal shares of snacks to every student showing fairness equal chance, NO text.",
  loyalty:
    "Two loyal friends supporting each other through rainy hard times walking together under one umbrella, NO text.",
  reflection:
    "Calm lake showing clear mirror reflection of mountains and clouds, NO text.",
  refraction:
    "Light beam bending refraction when entering glass of water with straw appearing bent, science demo, NO text.",
};

export const BATCH61_PROMPTS = {
  intestine:
    "Friendly cartoon body diagram small intestine absorbing nutrients from food on plate, science class safe, NO text NO labels.",
  liver:
    "Liver organ helping clean chemicals from blood shown as friendly filter inside body cross-section, NO text NO labels.",
  kidney:
    "Kidney filtering waste from bloodstream shown as friendly bean-shaped organ with clean droplets, NO text NO labels.",
  lung:
    "Healthy lungs bringing oxygen into body shown as pink friendly lungs with soft air flow arrows not text, NO text NO labels.",
  vein:
    "Blue veins carrying blood back toward heart in friendly arm cross-section, NO text NO labels.",
  artery:
    "Arteries pumping fresh blood away from heart shown as red tubes from beating heart, NO text NO labels.",
  tissue:
    "Muscle tissue letting arm bend and move shown as friendly flexing bicep with soft tissue layers, NO text NO labels.",
  organ:
    "Heart organ beating without stopping shown as friendly pulsing heart character, NO text NO labels.",
  nucleus:
    "Cell nucleus controlling activities inside cell shown as round center in friendly cell diagram, NO text NO labels.",
  chromosome:
    "Chromosomes carrying instructions for how we grow shown as X-shaped pairs in friendly cell, NO text NO labels.",
};

export const BATCH62_PROMPTS = {
  microorganism:
    "Microscope revealing tiny microorganisms in pond water drop on slide, science table, NO text.",
  bacteria:
    "Some round friendly bacteria helpful green ones and few sad sick ones showing some helpful some cause illness, NO text NO labels.",
  virus:
    "Virus spreading quickly through crowded classroom with kids covering coughs safely, NO text NO labels.",
  vaccine:
    "Doctor giving vaccine shot to protect child against disease in clinic, friendly safe mood, NO text NO labels.",
  immunity:
    "Child sleeping well in cozy bed building strong immunity shield around body, NO text NO labels.",
  antibody:
    "Antibodies as friendly shield soldiers fighting round germs entering body, NO text NO labels.",
  epidemic:
    "Schools closed sign icon on gate during flu epidemic in town empty playground, NO readable text.",
  pandemic:
    "World globe with many countries connected showing pandemic affecting people in many countries, NO text NO labels.",
  sterile:
    "Surgeons using sterile wrapped tools during operation in bright hospital, NO text NO labels.",
  sanitize:
    "Child sanitizing hands with gel before eating lunch at cafeteria table, NO text NO labels.",
};

export const BATCH63_PROMPTS = {
  turbine:
    "Wind spinning blades of large white wind turbine on green hill, NO text NO numbers.",
  petroleum:
    "Petroleum oil being processed at refinery into fuel for cars friendly industrial scene, NO text NO logos.",
  methane:
    "Methane gas forming in landfill over time with gentle bubbles rising from trash mound, NO text NO labels.",
  biomass:
    "Biomass energy from plants and organic waste powering small farm generator, NO text NO labels.",
  charcoal:
    "Charcoal burning hot for outdoor grilling with burgers on barbecue, NO text NO labels.",
  geothermal:
    "Geothermal heat rising from deep inside Earth through steam vents on rocky ground, NO text NO labels.",
  hydropower:
    "Hydropower dam using flowing river water to spin turbines making electricity, NO text NO numbers.",
  generator:
    "Backup generator keeping lights on in house during power outage, NO text NO brand logos.",
  outlet:
    "Child plugging lamp cord into wall electrical outlet safely, NO text NO numbers.",
  watt:
    "Bright light bulb glowing showing power use concept with soft energy waves not numbers, NO digits NO text.",
};

export const BATCH64_PROMPTS = {
  plow:
    "Farmer using plow pulled by tractor to turn brown soil in field, NO text.",
  tractor:
    "Red tractor pulling wagon full of golden hay across farm field, NO text NO numbers.",
  barn:
    "Cows resting inside red barn at night with moon through window, NO text.",
  pasture:
    "Sheep grazing on green pasture after rain with puddles and fresh grass, NO text.",
  livestock:
    "Livestock farmer caring for cows goats and sheep in friendly farmyard, NO text NO labels.",
  poultry:
    "Poultry farm raising chickens for eggs and meat with hen and chicks, NO text NO labels.",
  dairy:
    "Dairy farm shop selling fresh milk bottles and cheese wheels, NO readable labels.",
  manure:
    "Farmer spreading manure to enrich green fields with tractor spreader, NO text NO labels.",
  silo:
    "Tall grain silo on farm storing golden grain harvest, NO text NO numbers.",
  crop:
    "Corn as main crop growing in sunny valley field rows, NO text NO labels.",
};

export const BATCH65_PROMPTS = {
  ascend:
    "Hikers ascending steep mountain trail before noon with sun high, NO text NO numbers.",
  descend:
    "Family descending dark staircase carefully holding railing, NO text NO numbers.",
  scramble:
    "Kids scrambling over rocks near creek splashing water, adventure mood, NO text.",
  stagger:
    "Tired runner beginning to stagger near finish line of race, NO text NO bib numbers.",
  stumble:
    "Child about to stumble on loose broken step on porch careful warning mood, NO text.",
  glide:
    "White swans gliding smoothly across quiet still lake, NO text.",
  drift:
    "Autumn leaves drifting across school playground in wind, NO text.",
  soar:
    "Eagles soaring high above mountain ridges blue sky, NO text.",
  plunge:
    "Brave divers plunging into cold swimming pool from diving board, NO text NO numbers.",
  retreat:
    "Soldiers retreating safely from dangerous battlefield toward camp tents storybook safe, NO violence NO text.",
};

export const BATCH66_PROMPTS = {
  barely:
    "Student at back of class barely hearing whisper from friend cupping ear, NO text NO words.",
  almost:
    "Kids running toward bus stop almost missing last bus home, NO text NO clock numbers.",
  entirely:
    "Jigsaw puzzle entirely finished on table before dinner plate nearby, NO text NO numbers.",
  partly:
    "Picnic under partly cloudy sky with sun peeking through clouds, NO text.",
  directly:
    "Student walking directly to school office after bell rings straight path, NO text NO signs.",
  lightly:
    "Child tapping lightly on bedroom door before entering polite knock, NO text.",
  heavily:
    "Heavy rain pouring down on roof and windows during night storm, NO text NO numbers.",
  clearly:
    "Student speaking clearly at front of class with open mouth and attentive classmates, NO readable text.",
  closely:
    "Child watching closely as science beaker changes color on desk, NO text NO labels.",
  deeply:
    "Runner taking deep breath before race at starting line eyes closed calm, NO text NO numbers.",
};

export const BATCH67_PROMPTS = {
  thriller:
    "Kids watching suspenseful thriller movie on TV guessing whodunit with popcorn, NO readable screen text.",
  comedy:
    "Family laughing through whole comedy show on stage with silly clown props, NO readable text.",
  drama:
    "School drama play on stage telling story about friendship with two kids hugging, NO readable text.",
  documentary:
    "Class watching documentary film showing deep ocean fish and coral on projector, NO readable text.",
  animation:
    "Animation studio desk with drawn cartoon character coming to life on screen, NO readable text.",
  subtitle:
    "Foreign film on TV with subtitle bars as squiggle lines at bottom not readable words, NO legible text.",
  caption:
    "Photo on wall with caption squiggle line below explaining scene in museum, NO readable words.",
  narrator:
    "Friendly narrator voice guiding story shown as person reading book to listening children circle, NO readable text.",
  screenplay:
    "Writers planning each scene in screenplay notebook with storyboard sketches not words, NO legible text.",
  sequel:
    "Excited fans waiting in line for book sequel volume two shown as stacked books not numbers, NO readable titles.",
};

export const BATCH68_PROMPTS = {
  wrench:
    "Dad using wrench to tighten loose bolt on wooden chair in garage, NO text NO brand.",
  screwdriver:
    "Screwdriver turning metal screw into wood board on workbench, NO text.",
  pliers:
    "Pliers gripping small wires firmly on electronics repair desk, NO text NO labels.",
  saw:
    "Dad using hand saw to cut wooden board on sawhorses in workshop, NO text.",
  drill:
    "Power drill making neat hole in wall for shelf bracket, NO text NO brand.",
  bolt:
    "Strong bolt holding wooden gate together at garden fence, NO text.",
  screw:
    "Child tightening screw on wobbly chair leg with screwdriver, NO text.",
  chisel:
    "Sculptor shaping stone block with sharp chisel and mallet in art studio, NO text.",
  clamp:
    "Wood clamp holding two glued pieces together while glue dries on bench, NO text.",
  sandpaper:
    "Child smoothing rough wood edge with sandpaper on craft table, NO text.",
};

export const BATCH69_PROMPTS = {
  constellation:
    "Orion famous winter constellation stars connected as dots in night sky not labeled, NO text NO letters.",
  nebula:
    "Colorful glowing nebula in telescope view with pink and blue space clouds, NO text NO labels.",
  supernova:
    "Supernova sending bright light burst across dark space with star explosion, NO text NO numbers.",
  astronomy:
    "Astronomy class studying planets and distant stars with posters as colored balls, NO planet names NO text.",
  rover:
    "Mars rover collecting rock samples on red dusty planet surface, NO NASA logos NO text.",
  proton:
    "Proton particle with positive plus sign shape in friendly atom diagram center, NO letters NO numbers.",
  neutron:
    "Neutron sitting inside nucleus with protons in friendly atom model, NO letters NO numbers.",
  electron:
    "Electrons moving around nucleus in atom shown as small dots on orbit paths, NO labels NO text.",
  spectrum:
    "Prism splitting white light into rainbow color spectrum on wall, NO text NO labels.",
  ultraviolet:
    "Bright sun sending ultraviolet rays toward child wearing hat and sunscreen at beach, NO text NO labels.",
};

export const BATCH70_PROMPTS = {
  prehistoric:
    "Prehistoric people painting animals on cave wall with torch light, NO text NO hieroglyphs.",
  supernatural:
    "Storybook tale with friendly glowing forest spirit among trees magical not scary, NO text.",
  megabyte:
    "Tablet showing photo file size bar almost full concept without readable numbers, NO digits NO text.",
  kilobyte:
    "Phone sending short text message with tiny data icon not readable numbers, NO digits NO text.",
  upload:
    "Student uploading homework file from laptop with upward arrow progress bar not numbers, NO readable text.",
  offline:
    "Child reading saved ebook pages on tablet with offline cloud icon crossed out wifi, NO readable text.",
  online:
    "Student joining online quiz from tablet with connected wifi icon, NO readable text.",
  infrared:
    "Infrared camera view showing heat colors of people and dog in dark room, NO text NO numbers.",
  wireless:
    "Wireless headphones connecting to phone without cable floating music waves not text, NO logos NO text.",
  encryption:
    "Padlock and shield protecting private messages on laptop screen with lock icons not readable text, NO legible words.",
};

export const BATCH71_PROMPTS = {
  jury:
    "Jury of diverse adults listening carefully to witness in courtroom, NO readable text.",
  verdict:
    "Jury reaching verdict after long discussion in courtroom, judge waiting, NO readable text.",
  lawsuit:
    "Company lawyers settling lawsuit handshake before trial courthouse steps, NO readable text.",
  defendant:
    "Defendant answering questions from judge in courtroom stand, NO readable text.",
  plaintiff:
    "Plaintiff asking for fair payment for damaged fence in courtroom, NO readable text.",
  attorney:
    "Attorney explaining courtroom rules to client before hearing, NO readable text.",
  courtroom:
    "Everyone standing when judge enters courtroom through door, NO readable text.",
  witness:
    "Witness describing what happened near school gate to police officer, NO readable text.",
  oath:
    "Witness taking oath to tell truth with hand raised in courtroom, NO readable text.",
  prosecutor:
    "Prosecutor presenting clear facts with evidence board to jury, NO readable text NO legible words.",
};

export const BATCH72_PROMPTS = {
  skyscraper:
    "Tall skyscraper with lights glowing in every window at night city, NO text NO logos.",
  escalator:
    "Kids riding escalator up to second floor in shopping mall, NO text.",
  staircase:
    "Wide marble staircase leading into grand museum entrance, NO text.",
  skyline:
    "Beautiful city skyline at sunset with orange sky, NO text NO labels.",
  facade:
    "Old theater with bright stone facade and columns, NO readable text.",
  beam:
    "Steel beams supporting roof of new gym under construction, NO text.",
  pillar:
    "Tall stone pillars holding up front of library building, NO text.",
  archway:
    "Students walking through stone archway into school garden, NO text.",
  lagoon:
    "Clear calm lagoon water near coastal beach with palm trees, NO text.",
  shoreline:
    "Shells lined along shoreline after morning tide on sandy beach, NO text.",
};

export const BATCH73_PROMPTS = {
  stratosphere:
    "Jet plane flying high in stratosphere above fluffy clouds cross-section view, NO text NO labels.",
  troposphere:
    "Most clouds forming in troposphere near Earth atmosphere layers friendly diagram no labels, NO text NO words.",
  ozone:
    "Earth with protective ozone layer blocking harmful sun rays friendly science, NO text NO labels.",
  carbon:
    "Sparkling diamond gems made of pure carbon atoms science display, NO text NO C symbol.",
  dioxide:
    "Plants using carbon dioxide during photosynthesis with sun and leaf diagram no labels, NO text NO CO2.",
  oxygen:
    "Fish extracting oxygen from river water bubbles underwater scene, NO text.",
  nitrogen:
    "Air composition showing nitrogen as most of air we breathe friendly pie not numbers, NO digits NO text.",
  hydrogen:
    "Hydrogen as lightest element with floating balloon and stars universe scene, NO text NO H symbol.",
  helium:
    "Helium balloons floating because gas is very light at birthday party, NO text.",
  argon:
    "Argon gas inside glowing light bulb filament science demo, NO text NO labels.",
};

export const BATCH74_PROMPTS = {
  hurricane:
    "Hurricane bringing fierce winds and waves to coastal town, dramatic but friendly, NO text.",
  typhoon:
    "Typhoon delaying ships in busy harbor with strong wind and rain, NO text NO ship names.",
  cyclone:
    "Cyclone spinning dust across dry plain with swirling wind, NO text.",
  hailstorm:
    "Sudden hailstorm denting cars in parking lot with ice balls falling, NO text.",
  evaporation:
    "Evaporation drying puddles on sunny hot pavement with steam rising, NO text.",
  condensation:
    "Condensation water droplets forming on cold classroom window, NO text.",
  precipitation:
    "Weather chart showing heavy rain snow and hail precipitation types no readable numbers, NO digits NO text.",
  meteorologist:
    "Meteorologist on TV warning about strong winds tonight with weather map no labels, NO readable text.",
  sustainable:
    "Sustainable water and energy use with solar panels rain barrel and garden, NO text.",
  biodiversity:
    "Rainforest protecting rich biodiversity of colorful plants and animals, NO text NO labels.",
};

export const BATCH75_PROMPTS = {
  frequency:
    "High frequency sound waves diagram with small fast waves versus low slow waves no numbers, NO digits NO text.",
  amplitude:
    "Ocean wave showing large amplitude meaning strong wave height comparison, NO numbers NO text.",
  wavelength:
    "Different colors of light with different wavelength rainbow spectrum, NO text NO labels.",
  vibration:
    "Child feeling vibration when drum is struck with ripples in air, NO text.",
  resonance:
    "Bell resonance filling quiet hall with sound waves rippling, NO text.",
  echo:
    "Voices making echo inside empty cave with sound bouncing off walls, NO text.",
  decibel:
    "Loud concert exceeding safe volume with ear protection reminder friendly, NO digits NO readable text.",
  microphone:
    "Girl speaking clearly into classroom microphone at assembly, NO text.",
  headphones:
    "Student wearing headphones listening without disturbing classmates, NO text NO logos.",
  silhouette:
    "Silhouette of hawk against orange sunset sky, NO text.",
};

export const BATCH76_PROMPTS = {
  pollinate:
    "Bees pollinating colorful flowers in school garden, NO text.",
  chlorophyll:
    "Green leaves with chlorophyll giving leaves green color science close-up, NO text NO labels.",
  stamen:
    "Flower center stamen holding yellow pollen close-up botany, NO text.",
  pistil:
    "Flower pistil receiving pollen during plant reproduction botany diagram no labels, NO text NO words.",
  nectar:
    "Butterfly sipping sweet nectar from bright blossom, NO text.",
  conifer:
    "Tall conifer pine tree covered in fresh snow, NO text.",
  hibernation:
    "Bear entering hibernation sleeping in cozy cave when winter food scarce, NO text.",
  deforestation:
    "Deforestation clearing forest leaving sad animals without homes contrast with green forest, NO text.",
  pesticide:
    "Farmer spraying pesticide carefully to protect crops with mask and gloves, NO text NO brand labels.",
  ecology:
    "Ecology web showing living things depending on each other in pond ecosystem, NO text NO labels.",
};

export const BATCH77_PROMPTS = {
  invertebrate:
    "Simple earthworm invertebrate without backbone in garden soil, NO text.",
  vertebrate:
    "Fish bird and human as vertebrates with friendly spine diagram no labels, NO text NO words.",
  omnivore:
    "Bear omnivore eating both berries and fish at river, NO text.",
  diurnal:
    "Hawk diurnal hunter soaring actively during bright daylight, NO text.",
  instinct:
    "Baby sea turtles following instinct crawling toward ocean at night, NO text.",
  adaptation:
    "Arctic fox with thick fur adaptation to cold snowy mountain winter, NO text.",
  evolution:
    "Scientists studying evolution timeline with fossils and dinosaurs over millions of years no numbers, NO digits NO text.",
  extinction:
    "Habitat loss leading to extinction sad dodo bird and empty forest, NO text.",
  migration:
    "Geese flying in V formation beginning migration before first frost, NO text.",
  camouflage:
    "Green frog camouflage hiding among green leaves nearly invisible, NO text.",
};

export const BATCH78_PROMPTS = {
  excavation:
    "Archaeology excavation uncovering ancient pottery from village dig site, NO text.",
  granite:
    "Smooth worn granite steps on old building after many years, NO text.",
  limestone:
    "Limestone cliffs rising above blue sea coastal geology, NO text.",
  fault:
    "Earthquake fault line crack in ground with small tremor science demo, NO scary destruction NO text.",
  solstice:
    "Summer solstice longest day with sun high in sky and long shadows, NO text NO dates.",
  equinox:
    "Spring equinox with day and night nearly equal split sky sun and moon, NO text NO numbers.",
  horizon:
    "Ship disappearing beyond distant horizon on calm ocean, NO text.",
  helicopter:
    "Helicopter landing on hospital roof helipad emergency rescue, NO text NO logos.",
  spacecraft:
    "Spacecraft orbiting Earth in space with stars, NO NASA logos NO text.",
  celebration:
    "Town celebration parade with trophy and confetti after winning championship, NO readable text.",
};

export const BATCH79_PROMPTS = {
  anxiety:
    "Girl taking deep breaths reducing anxiety before test at desk, NO text.",
  relief:
    "Boy sighing with relief when storm passes safely looking out window, NO text.",
  gratitude:
    "Student writing thank you note of gratitude to teacher at desk, NO readable words.",
  jealousy:
    "Two friends sharing prize fairly jealousy fading into smiles, NO text.",
  frustration:
    "Child feeling frustration when puzzle piece will not fit, NO text.",
  admiration:
    "Class watching school performance with admiration clapping, NO text.",
  sympathy:
    "Friends showing sympathy comforting girl whose pet is ill, NO text.",
  embarrassment:
    "Boy red face embarrassment after tripping on stage, NO text.",
  confidence:
    "Girl on stage with confidence after practice bowing to applause, NO text.",
  determination:
    "Runner with determination finishing long race near finish line, NO text NO numbers.",
};

export const BATCH80_PROMPTS = {
  browser:
    "Student opening research site in safe browser window on laptop, NO readable URLs NO text.",
  database:
    "Library computer database listing science books on screen as icons not readable text, NO legible words.",
  firewall:
    "School network firewall blocking harmful traffic as shield on computer, NO readable text NO logos.",
  bilingual:
    "Bilingual classroom reading stories in two languages with English and Arabic books no readable text, NO legible words.",
  multicultural:
    "Multicultural festival with food stalls from many countries flags as colors only, NO text NO country names.",
  charity:
    "Students collecting books donation box for local charity, NO readable text.",
  donate:
    "Families donating warm coats during winter charity drive, NO text.",
  evaluate:
    "Judges evaluating science fair projects at tables with clipboards no readable text, NO legible words.",
  identify:
    "Child identifying bird by listening to its call in forest with binoculars, NO text.",
  competition:
    "Spelling competition with students from many schools on stage, NO readable text NO digits.",
};

export const BATCH_PROMPTS = {
  batch1: BATCH1_PROMPTS,
  batch2: BATCH2_PROMPTS,
  batch3: BATCH3_PROMPTS,
  batch4: BATCH4_PROMPTS,
  batch5: BATCH5_PROMPTS,
  batch6: BATCH6_PROMPTS,
  batch7: BATCH7_PROMPTS,
  batch8: BATCH8_PROMPTS,
  batch9: BATCH9_PROMPTS,
  batch10: BATCH10_PROMPTS,
  batch11: BATCH11_PROMPTS,
  batch12: BATCH12_PROMPTS,
  batch13: BATCH13_PROMPTS,
  batch14: BATCH14_PROMPTS,
  batch15: BATCH15_PROMPTS,
  batch16: BATCH16_PROMPTS,
  batch17: BATCH17_PROMPTS,
  batch18: BATCH18_PROMPTS,
  batch19: BATCH19_PROMPTS,
  batch20: BATCH20_PROMPTS,
  batch21: BATCH21_PROMPTS,
  batch22: BATCH22_PROMPTS,
  batch23: BATCH23_PROMPTS,
  batch24: BATCH24_PROMPTS,
  batch25: BATCH25_PROMPTS,
  batch26: BATCH26_PROMPTS,
  batch27: BATCH27_PROMPTS,
  batch28: BATCH28_PROMPTS,
  batch29: BATCH29_PROMPTS,
  batch30: BATCH30_PROMPTS,
  batch31: BATCH31_PROMPTS,
  batch32: BATCH32_PROMPTS,
  batch33: BATCH33_PROMPTS,
  batch34: BATCH34_PROMPTS,
  batch35: BATCH35_PROMPTS,
  batch36: BATCH36_PROMPTS,
  batch37: BATCH37_PROMPTS,
  batch38: BATCH38_PROMPTS,
  batch39: BATCH39_PROMPTS,
  batch40: BATCH40_PROMPTS,
  batch41: BATCH41_PROMPTS,
  batch42: BATCH42_PROMPTS,
  batch43: BATCH43_PROMPTS,
  batch44: BATCH44_PROMPTS,
  batch45: BATCH45_PROMPTS,
  batch46: BATCH46_PROMPTS,
  batch47: BATCH47_PROMPTS,
  batch48: BATCH48_PROMPTS,
  batch49: BATCH49_PROMPTS,
  batch50: BATCH50_PROMPTS,
  batch51: BATCH51_PROMPTS,
  batch52: BATCH52_PROMPTS,
  batch53: BATCH53_PROMPTS,
  batch54: BATCH54_PROMPTS,
  batch55: BATCH55_PROMPTS,
  batch56: BATCH56_PROMPTS,
  batch57: BATCH57_PROMPTS,
  batch58: BATCH58_PROMPTS,
  batch59: BATCH59_PROMPTS,
  batch60: BATCH60_PROMPTS,
  batch61: BATCH61_PROMPTS,
  batch62: BATCH62_PROMPTS,
  batch63: BATCH63_PROMPTS,
  batch64: BATCH64_PROMPTS,
  batch65: BATCH65_PROMPTS,
  batch66: BATCH66_PROMPTS,
  batch67: BATCH67_PROMPTS,
  batch68: BATCH68_PROMPTS,
  batch69: BATCH69_PROMPTS,
  batch70: BATCH70_PROMPTS,
  batch71: BATCH71_PROMPTS,
  batch72: BATCH72_PROMPTS,
  batch73: BATCH73_PROMPTS,
  batch74: BATCH74_PROMPTS,
  batch75: BATCH75_PROMPTS,
  batch76: BATCH76_PROMPTS,
  batch77: BATCH77_PROMPTS,
  batch78: BATCH78_PROMPTS,
  batch79: BATCH79_PROMPTS,
  batch80: BATCH80_PROMPTS,
};
