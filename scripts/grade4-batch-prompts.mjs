/** Sentence-aligned scene hints for Grade 4 illustrations (10 per batch) */
import { STYLE } from "./lib/daniel-image-style.mjs";
import {
  BATCH51_PROMPTS,
  BATCH52_PROMPTS,
  BATCH53_PROMPTS,
  BATCH54_PROMPTS,
  BATCH55_PROMPTS,
  BATCH56_PROMPTS,
  BATCH57_PROMPTS,
  BATCH58_PROMPTS,
  BATCH59_PROMPTS,
  BATCH60_PROMPTS,
} from "./grade4-batch51-60-prompts.mjs";
import {
  BATCH61_PROMPTS,
  BATCH62_PROMPTS,
  BATCH63_PROMPTS,
  BATCH64_PROMPTS,
  BATCH65_PROMPTS,
  BATCH66_PROMPTS,
  BATCH67_PROMPTS,
  BATCH68_PROMPTS,
  BATCH69_PROMPTS,
  BATCH70_PROMPTS,
} from "./grade4-batch61-70-prompts.mjs";
import {
  BATCH71_PROMPTS,
  BATCH72_PROMPTS,
  BATCH73_PROMPTS,
  BATCH74_PROMPTS,
  BATCH75_PROMPTS,
  BATCH76_PROMPTS,
  BATCH77_PROMPTS,
  BATCH78_PROMPTS,
  BATCH79_PROMPTS,
  BATCH80_PROMPTS,
} from "./grade4-batch71-80-prompts.mjs";
import {
  BATCH81_PROMPTS,
  BATCH82_PROMPTS,
  BATCH83_PROMPTS,
  BATCH84_PROMPTS,
  BATCH85_PROMPTS,
  BATCH86_PROMPTS,
  BATCH87_PROMPTS,
  BATCH88_PROMPTS,
  BATCH89_PROMPTS,
  BATCH90_PROMPTS,
} from "./grade4-batch81-90-prompts.mjs";
import {
  BATCH91_PROMPTS,
  BATCH92_PROMPTS,
  BATCH93_PROMPTS,
  BATCH94_PROMPTS,
  BATCH95_PROMPTS,
  BATCH96_PROMPTS,
  BATCH97_PROMPTS,
  BATCH98_PROMPTS,
  BATCH99_PROMPTS,
  BATCH100_PROMPTS,
} from "./grade4-batch91-100-prompts.mjs";

export { STYLE };

export const BATCH1_PROMPTS = {
  "forty-one":
    "School science club signup table with EXACTLY forty-one diverse students in line signing a roster clipboard, count every student carefully 41 total, friendly classroom, NO text NO digits. Matches 'Forty-one students signed the science club roster.'",
  "forty-two":
    "Library shelf with EXACTLY forty-two colorful books about rockets planets and space travel stacked and standing, count all books carefully 42 total, NO readable titles NO digits. Matches 'The library owns forty-two books about space travel.'",
  "forty-three":
    "Girl at desk with stack of multiplication worksheets, EXACTLY forty-three completed problem sheets in neat pile before lunch bell, school desk, NO text NO numbers. Matches 'She solved forty-three multiplication problems before lunch.'",
  "forty-four":
    "Night festival path lined with EXACTLY forty-four glowing paper lanterns hanging on strings lighting walkway, count every lantern 44 total, festive mood, NO text NO digits. Matches 'Forty-four lanterns lit the path during the festival.'",
  "forty-five":
    "Relay race finish line with stopwatch showing forty-five seconds, four runners passing baton on track, sports day, clock has dots not numbers. Matches 'The relay team finished in forty-five seconds flat.'",
  "forty-six":
    "Large classroom wall map with EXACTLY forty-six small colored county regions marked as shapes, geography lesson, count regions carefully 46 total, NO labels NO text. Matches 'Forty-six counties appear on the large wall map.'",
  "forty-seven":
    "Boy at desk with stamp collection album showing EXACTLY forty-seven stamps from different countries with flags as colors only, count stamps 47 total, NO country names NO digits. Matches 'He collected forty-seven stamps from different countries.'",
  "forty-eight":
    "Classroom floor seen from above with colorful tile pattern of EXACTLY forty-eight square tiles in grid, count all tiles 48 total, geometric pattern, NO text NO numbers. Matches 'Forty-eight tiles covered the classroom floor pattern.'",
  "forty-nine":
    "School choir on stage with EXACTLY forty-nine children wearing blue robes singing together, count every singer 49 total, music class, NO text NO digits. Matches 'The choir has forty-nine members wearing blue robes.'",
  "fifty-one":
    "Classroom vote with ballot box and raised hands, EXACTLY fifty-one students voting on class rule, count voters 51 total, democratic mood, NO readable text NO digits. Matches 'Fifty-one votes were needed to pass the class rule.'",
};

export const BATCH2_PROMPTS = {
  amendment:
    "Student giving speech at school podium with microphone showing freedom of expression, first amendment civics lesson, classmates listening respectfully, NO text NO words.",
  veto:
    "Mayor at desk stamping REJECTED on unfair bill document with red stamp shape only not readable words, town hall setting, NO legible text.",
  ballot:
    "Voter in private booth placing one name choice on secret ballot paper shown as blank checkbox, election day, NO readable names NO text.",
  electorate:
    "Diverse group of voters lining up to choose new student council president at school election table, civic participation, NO text NO words.",
  referendum:
    "School community voting yes or no on building new gymnasium with ballot box and gym blueprint poster as shapes only, NO readable text.",
  judiciary:
    "Friendly courtroom scene with judge gavel and scales of justice interpreting fair laws, students observing civics field trip, NO text NO words.",
  executive:
    "Three branches of government diagram as cartoon tree with executive branch figure carrying out laws from Congress building, civics class, NO labels NO text.",
  federal:
    "National park ranger and highway worker representing federal agencies managing parks and roads, scenic mountains and road, NO text NO logos.",
  municipal:
    "Municipal workers in orange vests repairing cracked sidewalk with tools and fresh cement, city street, NO text NO signs.",
  citizenship:
    "Child helping elderly neighbor carry groceries while another votes at community booth, good citizenship helping and voting wisely, NO text.",
};

export const BATCH3_PROMPTS = {
  metaphor:
    "Open poetry book with flowing river winding through clock face showing time as river metaphor, creative writing class, NO readable words NO text.",
  simile:
    "Classroom buzzing with busy students compared to beehive, teacher pointing at beehive poster and active classroom side by side, simile lesson, NO text.",
  personification:
    "Gentle wind with friendly face whispering through green trees with curved sound lines, personification poetry mood, NO text NO words.",
  onomatopoeia:
    "Busy cartoon bee buzzing with sound wave lines around it, onomatopoeia word buzz illustrated as sound, garden scene, NO text NO letters.",
  alliteration:
    "Three colorful word blocks starting with same letter sound repeated, Peter picked peppers tongue twister mood as shapes only, language arts, NO readable words.",
  hyperbole:
    "Child struggling to lift enormously exaggerated heavy school bag comically huge like a ton, funny hyperbole expression, NO text NO numbers.",
  idiom:
    "Student hitting open textbooks with fist gently meaning study hard idiom hit the books, desk with books stacked, NO readable text.",
  proverb:
    "Tortoise slowly winning race ahead of sleeping hare, slow and steady wins the race proverb scene, NO text NO words.",
  autobiography:
    "Girl writing life story book about growing up on farm with barn chickens and fields in thought bubble, autobiography memoir writing, NO readable text.",
  memoir:
    "Old sailor writing adventure memoir at desk with ship voyage memories in thought bubble waves and compass, NO readable words NO text.",
};

export const BATCH4_PROMPTS = {
  rhombus:
    "Bright diamond rhombus shape on geometry board with four equal sides marked by tick marks not numbers, math class, NO text NO digits.",
  parallelogram:
    "Colorful floor tile pattern forming bright slanted parallelogram shape, geometry in everyday life, NO text NO numbers.",
  octagon:
    "Red stop sign shaped as octagon eight-sided sign on roadside, friendly traffic safety lesson, NO readable letters on sign.",
  isosceles:
    "Triangle on chalkboard with two equal sides marked by matching tick marks, isosceles triangle geometry lesson, NO text NO numbers.",
  scalene:
    "Three different-length sides triangle on geometry worksheet all sides unequal, scalene triangle demo, NO text NO digits.",
  obtuse:
    "Wide open angle wider than right angle shown with protractor arc, obtuse angle geometry lesson, NO numbers NO text.",
  protractor:
    "Student using semicircle protractor to measure corner angle of paper triangle on desk, geometry homework, NO readable numbers.",
  remainder:
    "Division problem seventeen divided by five shown as five groups of three with two leftover dots remainder, math manipulatives, NO digits NO text.",
  divisor:
    "Twenty apples divided into four equal groups of five showing four as divisor, division lesson with fruit, NO numbers NO text.",
  prime:
    "Number seven shown as circle with only two factor dots one and seven, prime number concept, NO digits NO text.",
};

export const BATCH5_PROMPTS = {
  insulator:
    "Yellow rubber gloves protecting hands around exposed electrical wires, insulator safety science demo, NO text NO labels.",
  resistor:
    "Simple circuit board with resistor component limiting current flow shown as narrow pipe in circuit diagram, electronics class, NO text NO numbers.",
  voltage:
    "Low voltage classroom model train running safely on small track with gentle power meter, science table, NO readable numbers.",
  magnetism:
    "Strong bar magnet attracting cluster of metal paper clips on desk, magnetism science demo, NO text NO labels.",
  electromagnet:
    "Copper wire wrapped around iron nail picking up paper clips as simple electromagnet, hands-on science project, NO text.",
  inertia:
    "Rolling ball continuing to move on flat surface until friction from rough patch slows it, physics demo, NO text NO numbers.",
  momentum:
    "Red wagon gaining speed rolling down grassy hill with child holding on, momentum physics scene, NO text NO digits.",
  density:
    "Clear glass with oil layer floating on top of water showing density difference, science experiment, NO text NO labels.",
  mass:
    "Scientist placing rock sample on balance scale measuring mass in lab, geology class, NO readable numbers NO text.",
  ampere:
    "Electric meter gauge showing current flow through wire with needle indicator, ampere measurement demo, NO digits NO text.",
};

export const BATCH6_PROMPTS = {
  cytoplasm:
    "Cross-section of living cell with jelly-like cytoplasm filling inside space around nucleus, biology microscope view, NO labels NO text.",
  membrane:
    "Single cell with thin protective membrane wrapping around it like soft bubble, cell biology lesson, NO text NO labels.",
  sedimentary:
    "Layered sedimentary rock cliff showing fossil fish bones embedded in strata, earth science, NO text NO words.",
  igneous:
    "Volcanic lava cooling slowly into dark igneous rock formation, geology lesson, NO text NO labels.",
  metamorphic:
    "Deep underground cross-section with heat and pressure arrows transforming rock into metamorphic layers, earth science, NO text.",
  tundra:
    "Caribou reindeer roaming windy flat tundra landscape with low shrubs during brief summer, arctic biome, NO text.",
  savanna:
    "Golden savanna grassland with scattered acacia trees and distant giraffe silhouette, African biome, NO text NO labels.",
  rainforest:
    "Lush green rainforest with daily rain falling and tropical plants, wet biome ecosystem, NO text NO words.",
  aquifer:
    "Cross-section showing well drawing clean water from deep underground aquifer layer, earth science, NO text NO labels.",
  watershed:
    "Rain falling on hills flowing through streams toward same river mouth, watershed diagram as landscape, NO text NO labels.",
};

export const BATCH7_PROMPTS = {
  revolution:
    "American Revolution scene with colonists and British soldiers in friendly storybook style, historical change mood, NO text NO flags with words.",
  independence:
    "Fourth of July celebration with fireworks and colonists celebrating freedom from British rule, Independence Day, NO readable text.",
  declaration:
    "Founding fathers presenting declaration document listing reasons for freedom to gathered colonists, historical scene, NO legible words.",
  colonist:
    "Colonial farmer working granted farmland with distant king castle in background, early American settlement, NO text NO words.",
  settlement:
    "First small wooden settlement village beside wide slow river with boats, pioneer town, NO text NO signs.",
  frontier:
    "Pioneers with covered wagon pushing west across open plains frontier, American expansion, NO text NO words.",
  immigrant:
    "Family arriving with suitcase and sharing food recipes from homeland at welcome table, immigration story, NO text.",
  emigrant:
    "Person leaving home village with bag heading toward busy port city skyline seeking work, emigration journey, NO text.",
  industrialization:
    "Factory with smokestacks and fast steam train arriving at industrial town, industrialization era, NO text NO words.",
  reconstruction:
    "Workers rebuilding southern town buildings and roads after war, reconstruction era hope, NO text NO labels.",
};

export const BATCH8_PROMPTS = {
  spreadsheet:
    "Computer screen showing colorful spreadsheet grid tracking weekly fundraiser totals as colored bars not numbers, NO readable digits NO text.",
  plagiarism:
    "Student caught copying paragraph from book without credit, teacher showing original source side by side, academic honesty lesson, NO readable text.",
  bibliography:
    "Back of report with list of book sources as stacked book icons bibliography page, research writing, NO legible titles.",
  citation:
    "Research paper with small footnote arrow pointing to source book where fact was found, citation lesson, NO readable text.",
  appendix:
    "Report with extra charts and graphs in appendix section at back supporting main document, NO readable text NO numbers.",
  hyperlink:
    "Computer mouse cursor clicking glowing blue link opening museum timeline webpage, digital literacy, NO readable URL text.",
  pixel:
    "Photo zoomed in extremely close showing tiny square pixels grid on screen, digital image lesson, NO text NO numbers.",
  cache:
    "Browser refresh fixing slow loading lesson page, cache clearing with speed boost arrows, computer class, NO readable text.",
  bandwidth:
    "Video buffering on classroom screen with slow loading spinner due to low bandwidth, students waiting, NO text NO words.",
  router:
    "Wi-Fi router on library shelf sending signal waves to laptops, school network, NO text NO brand logos.",
};

export const BATCH9_PROMPTS = {
  hydration:
    "Athletes drinking water bottles during sports practice staying alert and hydrated, health class, NO text NO labels.",
  dehydration:
    "Tired child with headache after long outdoor soccer game needing water, dehydration warning, NO text NO words.",
  carbohydrate:
    "Whole grain bread and pasta on breakfast table providing energy for morning run shoes nearby, nutrition lesson, NO text NO labels.",
  protein:
    "Plate with beans and eggs supplying protein for growing muscles shown with strong arm flex, nutrition, NO text NO labels.",
  calorie:
    "Yogurt container with nutrition label shown as colored bars not readable numbers, calorie counting lesson, NO legible text.",
  posture:
    "Student sitting straight at desk with good back posture while typing on keyboard, ergonomics lesson, NO text.",
  endurance:
    "Runner jogging daily building stamina for long mountain hike ahead, endurance training, NO text NO numbers.",
  teamwork:
    "Group of students cooperating to finish bridge model together at science table, teamwork collaboration, NO text.",
  empathy:
    "Child comforting sad friend trying to understand their feelings, empathy emotional intelligence, NO text NO words.",
  perseverance:
    "Girl practicing piano solo repeatedly until perfect, perseverance and dedication, music room, NO text NO sheet music words.",
};

export const BATCH10_PROMPTS = {
  choreography:
    "Dance troupe performing synchronized steps matching drumbeat on stage, choreography dance class, NO text NO words.",
  percussion:
    "Drums cymbals and tambourines arranged as percussion instruments in music room, band class, NO text NO labels.",
  mural:
    "Students painting large colorful mural on school wall celebrating local heroes, community art project, NO readable text.",
  audition:
    "Girl singing confidently on stage at school play audition with judges watching, theater tryout, NO text NO words.",
  bleachers:
    "Sports stadium bleachers filled with cheering fans before championship game, school spirit, NO text NO numbers.",
  gymnastics:
    "Child practicing balance on low gymnastics beam in gym class, gymnastics lesson, NO text NO words.",
  archery:
    "Student focusing with bow and arrow at archery target range steady hands, sports practice, NO text NO numbers on target.",
  volleyball:
    "School volleyball team celebrating winning district tournament with net and ball, team victory, NO text NO words.",
  encore:
    "Concert crowd shouting and clapping requesting encore after final song, musicians bowing on stage, NO text NO words.",
  premiere:
    "School film premiere with red carpet parents and teachers watching student movie on screen, NO readable text NO titles.",
};

export const BATCH11_PROMPTS = {
  "fifty-two":
    "Many campers in tents sleeping under starry night sky at summer camp, suggesting fifty-two campers, cozy outdoor scene, NO text NO digits. Matches 'Fifty-two campers slept under the starry sky.'",
  "fifty-three":
    "Passenger train car interior with many rows of seats, suggesting fifty-three seats per car, friendly travel scene, NO text NO numbers. Matches 'The train has fifty-three seats in each passenger car.'",
  "fifty-four":
    "Girl reading thick stack of book pages at library desk before bell rings, many pages suggesting fifty-four, NO readable text NO digits. Matches 'She read fifty-four pages before the library bell rang.'",
  "fifty-five":
    "Large group of volunteers planting young trees along a creek bank, community service scene suggesting fifty-five planters, NO text NO numbers. Matches 'Fifty-five volunteers planted trees along the creek.'",
  "fifty-six":
    "Museum display case with many ancient gold and silver coins arranged in rows, suggesting fifty-six coins, NO readable labels NO digits. Matches 'The museum display shows fifty-six ancient coins.'",
  "fifty-seven":
    "Colorful beaded necklace on craft fair table with many beads strung together, suggesting fifty-seven beads, NO text NO numbers. Matches 'Fifty-seven beads formed a necklace for the craft fair.'",
  "fifty-eight":
    "Child finishing large jigsaw puzzle on table with clock showing long time passed, puzzle completion scene, clock has dots not numbers. Matches 'The puzzle took fifty-eight minutes to finish.'",
  "fifty-nine":
    "School hallway lined with many colorful national flags hanging from ceiling for world cultures week, suggesting fifty-nine flags, NO readable text NO digits. Matches 'Fifty-nine flags lined the hallway for world cultures week.'",
  "sixty-one":
    "Regional spelling bee stage with many student contestants seated in rows waiting to spell, suggesting sixty-one entries, NO readable words NO digits. Matches 'Sixty-one entries competed in the regional spelling bee.'",
  "sixty-two":
    "Greenhouse interior with many small tomato seedlings in pots on shelves, suggesting sixty-two seedlings, NO text NO numbers. Matches 'The greenhouse holds sixty-two tomato seedlings.'",
};

export const BATCH12_PROMPTS = {
  conjunction:
    "Grammar classroom chart showing two idea bubbles joined by a bridge link, conjunction lesson connecting related ideas, NO readable words NO text.",
  preposition:
    "Friendly cat hiding under a wooden table with arrow shape showing location under, preposition lesson scene, NO text NO words.",
  interjection:
    "Surprised child with wide eyes and open mouth showing Wow surprise expression, interjection lesson mood, NO text NO letters.",
  adverb:
    "Girl running quickly with motion lines showing speed, adverb describing how she ran, school playground, NO text NO words.",
  clause:
    "Grammar worksheet showing two sentence parts each with subject stick figure and action verb icon, clause lesson, NO readable text.",
  persuasive:
    "Student giving persuasive speech at podium with recycling bins and classmates convinced to recycle, essay presentation, NO readable text.",
  expository:
    "Student presenting factual report with charts and diagrams explaining facts without opinion bubbles, expository writing lesson, NO readable text.",
  descriptive:
    "Child writing at desk with vivid thought bubble showing sunny beach scene they are describing, descriptive writing lesson, NO text.",
  revise:
    "Student at desk crossing out and fixing spelling on draft paper with pencil, revising homework scene, NO readable words NO text.",
  footnote:
    "Open book page bottom with small arrow pointing to source book icon, footnote citation lesson, NO legible text NO words.",
};

export const BATCH13_PROMPTS = {
  dividend:
    "Division lesson with eighteen objects grouped into three equal groups showing eighteen as the total being divided, math manipulatives, NO digits NO text.",
  factor:
    "Twelve objects arranged as three groups of four showing three is a factor of twelve, math classroom, NO numbers NO text.",
  percent:
    "Classroom chart showing portion of students walking to school versus riding bus, twenty percent concept as pie slice, NO readable numbers NO text.",
  ratio:
    "Two piles of beads red and blue showing two red for every one blue bead ratio, math table, NO digits NO text.",
  proportion:
    "Student scaling up a small map drawing to larger version using proportion grid, geography math lesson, NO readable numbers NO text.",
  coordinate:
    "Treasure X mark plotted on grid graph at position four seven, coordinate plane lesson, grid has dots not numbers. Matches 'Plot the treasure at coordinate four, seven on the grid.'",
  axis:
    "Bar chart with vertical axis line showing temperature bars going up, graph lesson, NO readable numbers NO text. Matches 'The vertical axis shows temperature on our chart.'",
  quadrant:
    "Coordinate graph with point B marked in upper-right quadrant section, geometry grid lesson, NO readable labels NO digits.",
  median:
    "Test score chart with middle score highlighted as median when one score is very low, statistics lesson, NO readable numbers NO text.",
  mode:
    "Survey results chart with blue color bar tallest showing most common answer mode, statistics class, NO readable text NO digits.",
};

export const BATCH14_PROMPTS = {
  osmosis:
    "Cross-section of plant cell with water droplets moving through thin membrane, osmosis biology demo, NO labels NO text.",
  diffusion:
    "Clear glass of still water with food coloring slowly spreading from center outward, diffusion science experiment, NO text NO labels.",
  acid:
    "Child tasting sour lemon juice with puckered face, acid in lemon juice science lesson, NO text NO words.",
  base:
    "Baking soda box open beside mixing bowl in kitchen recipe scene, mild base used in cooking, NO readable labels NO text.",
  alkaline:
    "Soapy water in bowl compared with plain water glass showing alkaline soap water, pH science demo, NO text NO numbers.",
  neutral:
    "Pure water glass on pH scale balance in middle neutral position, chemistry lesson, NO readable numbers NO text.",
  chloroplast:
    "Microscope view of green leaf cross-section with chloroplasts capturing sunlight rays, plant biology, NO labels NO text.",
  mitochondria:
    "Muscle cell diagram with mitochondria organelles supplying energy sparks to working muscle, biology lesson, NO labels NO text.",
  catalyst:
    "Science beaker reaction speeding up with catalyst spark without shrinking catalyst piece, chemistry demo, NO text NO numbers.",
  enzyme:
    "Saliva breaking down starchy bread in mouth science diagram friendly cartoon style, enzyme biology lesson, NO text NO labels.",
};

export const BATCH15_PROMPTS = {
  meteorite:
    "Meteorite rock landed in green field leaving small round crater, space science scene, NO text NO labels.",
  "light-year":
    "Distant star far away in space with long dotted path showing vast distance light-year concept, astronomy lesson, NO readable numbers NO text.",
  pulsar:
    "Spinning neutron star sending steady radio pulse waves across dark space, pulsar astronomy scene, NO text NO digits.",
  quasar:
    "Scientists at powerful telescope observing bright distant quasar in night sky, observatory scene, NO readable text NO labels.",
  observatory:
    "Domed observatory building at night with telescope viewing planets and stars, field trip scene, NO text NO words.",
  cosmonaut:
    "Cosmonaut in spacesuit training for months before rocket launch, space center preparation, NO flags with text NO logos.",
  meteoroid:
    "Bright meteoroid burning as streak of light entering Earth atmosphere at night, astronomy scene, NO text NO numbers.",
  interstellar:
    "Cosmic dust drifting between distant star systems in deep space, interstellar scene, NO text NO labels.",
  extraterrestrial:
    "School science club debating friendly cartoon alien life question with thought bubbles as shapes only, NO readable text NO words.",
  spectroscope:
    "Spectroscope instrument splitting starlight into rainbow colored bands on table, astronomy lab, NO text NO labels.",
};

export const BATCH16_PROMPTS = {
  economy:
    "Busy town with families working at shops and factories showing strong economy creating jobs, NO text NO signs with words.",
  inflation:
    "Market stall with price tags slowly rising over years shown as stacked time layers, inflation concept, NO readable prices NO digits.",
  recession:
    "Quiet main street with fewer new shop openings and closed storefront shutters, recession mood, NO readable text NO signs.",
  supply:
    "Market with very few apples left on table and high price arrow shape, low supply raised price, NO readable numbers NO text.",
  demand:
    "Concert ticket booth with long line and sold out sign shape, high demand sold out quickly, NO readable words NO digits.",
  entrepreneur:
    "Young student selling handmade colorful bracelets at online laptop shop setup, young entrepreneur scene, NO readable text NO logos.",
  export:
    "Farmers loading grain sacks onto ship at coastal port for export, agriculture trade scene, NO text NO labels.",
  import:
    "Store receiving cocoa bean sacks shipped from tropical country with palm trees in background, import scene, NO readable text.",
  barter:
    "Neighbors exchanging basket of eggs for fresh garden vegetables at fence, barter trade scene, NO text NO words.",
  tax:
    "City hall coins flowing toward school building park and library icons funded by tax, civic lesson, NO readable text NO numbers.",
};

export const BATCH17_PROMPTS = {
  podcast:
    "Students recording science podcast with microphone explaining experiment steps on table, NO readable text NO words.",
  streaming:
    "Classroom screen streaming school assembly live with stable wifi signal waves, digital lesson, NO readable text NO URLs.",
  bluetooth:
    "Bluetooth speaker wirelessly linked to classroom tablet with connection wave icon, NO brand logos NO text.",
  copyright:
    "Author protecting original story book and artwork with shield icon, copyright lesson, NO readable titles NO text.",
  trademark:
    "Company logo symbol protected as trademark belonging to one business, brand identity lesson, NO readable company name NO text.",
  phishing:
    "Suspicious email on screen tricking person to share password with warning red flag, online safety lesson, NO readable text NO passwords.",
  malware:
    "Computer warning about dangerous email attachment with virus bug icon, cybersecurity caution, NO readable text NO words.",
  screenshot:
    "Student saving screenshot of helpful diagram on tablet screen capture moment, digital literacy, NO readable text NO URLs.",
  avatar:
    "Child choosing friendly cartoon avatar profile picture that hides personal home details, online safety, NO readable text NO address.",
  cybersecurity:
    "Classroom cybersecurity lesson spotting online scam emails on screen, students learning digital safety, NO readable text NO words.",
};

export const BATCH18_PROMPTS = {
  resilience:
    "Boy getting up to try again after losing sports match with determined smile, resilience character lesson, NO text NO words.",
  mindfulness:
    "Students sitting calmly meditating before big test with peaceful expressions, mindfulness practice, NO text NO words.",
  integrity:
    "Child returning found wallet to teacher when no one is watching, integrity doing right thing, NO readable text NO money numbers.",
  honesty:
    "Two project partners shaking hands with trust built through honest teamwork, NO text NO words.",
  humility:
    "Sports champion congratulating other team with handshake after winning, humility scene, NO text NO readable jersey words.",
  generosity:
    "Food drive boxes overflowing with canned goods filled by Friday deadline, generosity community service, NO readable labels NO text.",
  responsibility:
    "Student feeding cute class hamster in cage as weekly classroom job, responsibility lesson, NO text NO words.",
  accountability:
    "Student honestly admitting to teacher after breaking classroom rule, accountability lesson, NO readable text NO words.",
  leadership:
    "Girl guiding group focused on building bridge model together at science table, leadership scene, NO text NO words.",
  cooperation:
    "Two classes working together painting large mural on school wall on time, cooperation teamwork, NO readable text NO words.",
};

export const BATCH19_PROMPTS = {
  ballet:
    "Ballet dancers practicing graceful leaps across theater stage, dance class scene, NO text NO words.",
  opera:
    "Opera singer on stage with live orchestra pit below powerful performance, NO readable text NO sheet music words.",
  playwright:
    "Playwright at desk writing funny dialogue with laughing audience in thought bubble, theater writing, NO readable text NO words.",
  saxophone:
    "Musician playing saxophone solo closing jazz concert on stage, NO text NO readable signage.",
  banjo:
    "Folk musician tapping foot while playing banjo at country fair, NO text NO words.",
  ukulele:
    "Girl strumming ukulele at sunny beach talent show stage, NO readable text NO words.",
  fresco:
    "Ancient wall fresco painting showing faded blue sky mural in old building, art history lesson, NO readable text NO words.",
  ceramics:
    "Ceramics class students shaping bowls from wet gray clay on pottery wheels, NO text NO words.",
  calligraphy:
    "Artist creating flowing decorative letter strokes with brush and ink as art, calligraphy lesson, NO readable letters NO text.",
  engraving:
    "Fine decorative engraving on silver trophy plate with ornate patterns, NO readable text NO words.",
};

export const BATCH20_PROMPTS = {
  badminton:
    "Badminton shuttlecock flying over gym net during school match, NO text NO numbers on court.",
  lacrosse:
    "Lacrosse players cradling ball in netted sticks on field, sports practice, NO text NO readable jersey words.",
  fencing:
    "Two fencers in protective masks during quick duel on fencing strip, NO text NO numbers.",
  wrestling:
    "Wrestling practice with coach teaching safe holds on gym mat, NO text NO words.",
  skateboard:
    "Boy landing skateboard trick at neighborhood park ramp, NO text NO graffiti words.",
  surfing:
    "Surfing lesson beginning with balance practice on calm shallow water, NO text NO words.",
  snowboarding:
    "Snowboarder carving curved tracks down snowy slope, winter sports scene, NO text NO words.",
  diving:
    "Diving judges at pool scoring athlete splash at swim meet, NO readable score numbers NO text.",
  snorkeling:
    "Child snorkeling near coral reef watching bright colorful fish underwater, NO text NO words.",
  sailing:
    "Sailing class students adjusting sails while reading wind direction on calm lake, NO text NO readable boat names.",
};

export const BATCH21_PROMPTS = {
  "sixty-three":
    "Mountain hikers reaching wooden shelter at dusk after long trail, many hikers suggesting sixty-three reached shelter, cozy outdoor scene, NO text NO digits. Matches 'Sixty-three hikers reached the mountain shelter by dusk.'",
  "sixty-four":
    "Chess club practice board with checkerboard grid of squares, chess lesson scene suggesting sixty-four squares, NO text NO numbers. Matches 'The chess club has sixty-four squares on each practice board.'",
  "sixty-five":
    "Read-a-thon booth selling colorful bookmarks to students, many bookmarks suggesting sixty-five sold, library event, NO readable text NO digits. Matches 'Sixty-five bookmarks were sold at the read-a-thon.'",
  "sixty-six":
    "Family road trip car driving along famous desert highway with vintage route sign shape only not readable numbers, adventure mood, NO legible text. Matches 'Route sixty-six appears on our road trip map.'",
  "sixty-seven":
    "Wetland nature guide book open showing many animal species icons as colored shapes, marsh birds and frogs, suggesting sixty-seven species listed, NO readable text NO digits. Matches 'Sixty-seven species were listed in the wetland guide.'",
  "sixty-eight":
    "Huge sports stadium filled with cheering fans in seats, vast crowd suggesting sixty-eight thousand fans, championship mood, NO text NO numbers.",
  "sixty-nine":
    "River festival at night with many glowing paper lanterns floating above water, festive lights suggesting sixty-nine lanterns, NO text NO digits. Matches 'Sixty-nine lanterns floated above the river festival.'",
  "seventy-one":
    "School awards ceremony with many students receiving perfect attendance certificates on stage, suggesting seventy-one award winners, NO readable text NO digits. Matches 'Seventy-one students earned perfect attendance awards.'",
  "seventy-two":
    "Jigsaw puzzle box spilled on table with many interlocking pieces spread out, puzzle completion scene suggesting seventy-two pieces, NO text NO numbers. Matches 'The puzzle box contains seventy-two interlocking pieces.'",
  "seventy-three":
    "Club meeting vote with ballot box and raised hands approving new charter document as blank paper, many voters suggesting seventy-three votes, NO readable text NO digits. Matches 'Seventy-three votes approved the new club charter.'",
};

export const BATCH22_PROMPTS = {
  archipelago:
    "Chain of many small volcanic islands in blue ocean forming archipelago, geography lesson, tropical birds, NO labels NO text. Matches 'The archipelago includes dozens of small volcanic islands.'",
  estuary:
    "River meeting salty ocean water where fish swim in brackish estuary, marsh grasses and birds, NO text NO labels. Matches 'Fish spawn where the river meets the salty estuary.'",
  delta:
    "Wide muddy river mouth delta with rich soil and branching waterways at river end, earth science, NO text NO labels. Matches 'Rich soil built the delta at the river mouth.'",
  fjord:
    "Narrow deep fjord between steep rocky cliffs with calm blue water and small boat, Norway-style landscape, NO text NO words. Matches 'Steep cliffs rise beside the narrow fjord.'",
  isthmus:
    "Narrow strip of land isthmus connecting two larger continents with ocean on both sides, geography diagram as landscape, NO labels NO text. Matches 'An isthmus connects the two larger landmasses.'",
  mesa:
    "Flat-topped mesa plateau towering above desert plain at sunset, southwestern landscape, NO text NO labels. Matches 'A flat mesa towered above the desert plain.'",
  butte:
    "Lonely isolated butte rock hill casting long shadow at sunset on open plains, NO text NO words. Matches 'A lonely butte cast a long shadow at sunset.'",
  strait:
    "Cargo ships passing through narrow strait channel between two coastlines, geography scene, NO readable ship names NO text. Matches 'Ships pass through the strait between two coasts.'",
  gulf:
    "Fishing boats anchored in calm peaceful gulf waters each morning with gentle waves, coastal scene, NO text NO labels. Matches 'Fishing boats anchor in the calm gulf each morning.'",
  cape:
    "Lighthouse on rocky cape point with sweeping light beam across stormy coast, NO text NO words. Matches 'Lighthouse beams sweep across the rocky cape.'",
};

export const BATCH23_PROMPTS = {
  kinetic:
    "Rolling soccer ball on grass with motion lines showing kinetic energy from movement, physics demo, NO text NO numbers. Matches 'A rolling ball has kinetic energy from its motion.'",
  potential:
    "Heavy weight raised high on rope pulley storing potential energy before dropping, science class demo, NO readable numbers NO text. Matches 'A raised weight stores potential energy until it drops.'",
  gravitational:
    "Moon circling Earth with curved arrow showing gravitational pull keeping orbit, space science friendly cartoon, NO text NO labels. Matches 'Gravitational pull keeps the moon circling Earth.'",
  thermal:
    "Soup pot warming on stove with steam rising showing thermal energy from heat, kitchen science, NO text NO labels. Matches 'Thermal energy from the stove warmed the soup.'",
  mechanical:
    "Old clock with visible gears turning inside showing mechanical energy moving parts, NO text NO numbers. Matches 'Mechanical energy moves gears inside the clock.'",
  conduction:
    "Metal spoon in hot soup heating up quickly by conduction with wavy heat lines, science experiment, NO text NO labels. Matches 'Metal spoons heat up quickly by conduction.'",
  convection:
    "Room with warm air rising and cool air sinking showing convection currents as soft colored flows, NO text NO labels. Matches 'Convection currents mix warm and cool air in the room.'",
  radiation:
    "Sun sending light rays across space to Earth showing radiation through vacuum, astronomy lesson, NO text NO numbers. Matches 'Sunlight reaches Earth through radiation across space.'",
  absorption:
    "Dark fabric shirt and light fabric shirt side by side in sun with dark one absorbing more heat, science demo, NO text NO labels. Matches 'Dark fabric improves absorption of heat from the sun.'",
  insulation:
    "Classroom wall cross-section with fluffy pink insulation keeping room warm while snow outside window, winter scene, NO text NO labels. Matches 'Wall insulation keeps classrooms warm in winter.'",
};

export const BATCH24_PROMPTS = {
  inference:
    "Student reading story book with thought bubble guessing hidden character motive behind curtain, reading comprehension, NO readable text NO words. Matches 'Use inference to guess the character's hidden motive.'",
  stanza:
    "Open poetry book with four rhyming verse blocks as colored shapes in steady pattern, creative writing, NO readable words NO text. Matches 'Each stanza of the poem rhymes in a steady pattern.'",
  verse:
    "Child memorizing school song lyrics shown as musical notes and heart without readable words, singing practice, NO text NO letters. Matches 'She memorized every verse of the school song.'",
  dialect:
    "Coastal town story scene with friendly fisherman speaking unique local dialect to visitor, seaside village, NO readable speech text. Matches 'The story uses dialect words from a coastal town.'",
  figurative:
    "Creative writing class comparing ideas with metaphor bridges and simile sparkles between thought bubbles, NO readable text. Matches 'Figurative language compares ideas in creative ways.'",
  literal:
    "Teacher pointing at dictionary definition matching exact word meaning literally without figurative symbols, NO readable text NO words. Matches 'The literal meaning is exactly what the words say.'",
  allusion:
    "Book title on shelf with thought bubble referencing famous Greek myth hero silhouette with columns, literary allusion lesson, NO readable titles NO text. Matches 'The title makes an allusion to a famous Greek myth.'",
  foreshadowing:
    "Storybook scene with dark storm clouds looming over castle hinting trouble ahead, foreshadowing mood, NO text NO words. Matches 'Dark clouds were foreshadowing trouble in the tale.'",
  flashback:
    "Hero adult remembering shy child self in soft circular flashback bubble, storytelling scene, NO text NO words. Matches 'A flashback showed the hero as a shy child.'",
  climax:
    "Suspenseful moment when bridge gates finally open and crowd cheers at story climax, NO readable text NO signs. Matches 'The climax arrives when the bridge finally opens.'",
};

export const BATCH25_PROMPTS = {
  cylinder:
    "Metal soup can shaped as cylinder on kitchen counter, geometry in daily life, NO text NO labels. Matches 'A soup can is shaped like a metal cylinder.'",
  sphere:
    "Earth globe as sphere spinning in space with stars, geography astronomy, NO text NO labels. Matches 'Earth is nearly a sphere spinning in space.'",
  equilateral:
    "Triangle on chalkboard with three equal sides marked by matching tick marks, equilateral triangle lesson, NO numbers NO text. Matches 'An equilateral triangle has three equal sides.'",
  acute:
    "Protractor measuring small acute angle narrower than right angle corner, geometry class, NO readable numbers NO text. Matches 'Each acute angle is smaller than ninety degrees.'",
  histogram:
    "Bar histogram chart showing snack choices with tallest bar for most picked snack as colored bars not numbers, statistics lesson, NO readable digits NO text. Matches 'Our histogram shows how many students chose each snack.'",
  improper:
    "Fraction pies showing five-fourths as more than one whole circle plus extra slice, improper fraction lesson, NO digits NO text. Matches 'Five-fourths is an improper fraction greater than one.'",
  composite:
    "Number twelve shown as array of dots arranged in three groups of four showing many factors, composite number concept, NO digits NO text. Matches 'Twelve is a composite number with many factors.'",
  multiple:
    "Number line with hops showing five times four equals twenty as multiple of five, math lesson, dots not readable numbers. Matches 'Twenty is a multiple of five because five times four equals twenty.'",
  mixed:
    "Recipe card showing two and one half cups as mixed number with whole cake and half slice, baking math, NO readable text NO digits. Matches 'Two and one-half is a mixed number in the recipe.'",
  equivalent:
    "Number line showing one half and two fourths at same point as equivalent fractions, NO readable numbers NO text. Matches 'One-half is equivalent to two-fourths on the number line.'",
};

export const BATCH26_PROMPTS = {
  abolition:
    "Historical abolition movement march with people holding freedom lanterns peacefully ending slavery, storybook-safe civics, NO readable signs NO text. Matches 'Abolition movements worked to end slavery legally.'",
  segregation:
    "Old unfair separate water fountains scene shown as history lesson with sad child, educational not harsh, NO readable labels NO text. Matches 'Segregation once separated people by unfair rules.'",
  integration:
    "Diverse students happily entering same classroom together school integration, friendly inclusive mood, NO text NO words. Matches 'School integration opened classrooms to every student.'",
  suffrage:
    "Women marching peacefully with voting ballot boxes gaining right to vote, women's suffrage history, NO readable text NO signs. Matches 'Women's suffrage gave millions the right to vote.'",
  emancipation:
    "Historical emancipation proclamation scroll unrolled freeing enslaved people celebration, storybook style, NO legible words NO text. Matches 'The emancipation proclamation declared many enslaved people free.'",
  ratify:
    "State capitol building with lawmakers debating then stamping approve on amendment document as blank paper, NO readable text. Matches 'States ratify amendments after careful debate.'",
  census:
    "Friendly census worker knocking door with clipboard counting families in town, community scene, NO readable forms NO digits. Matches 'The census counts how many people live in each town.'",
  repeal:
    "Lawmakers voting to repeal outdated rule by crumpling old scroll and passing new one, civics lesson, NO readable text. Matches 'Lawmakers voted to repeal the outdated rule.'",
  boycott:
    "Community refusing to buy goods from unfair company shop with crossed-out cart and support local fair market, NO readable signs NO text. Matches 'A boycott refused to buy goods from unfair companies.'",
  protest:
    "Students holding peaceful protest signs as blank shapes marching for safer crosswalk at school street, NO readable words NO text. Matches 'Students held a peaceful protest for safer crosswalks.'",
};

export const BATCH27_PROMPTS = {
  antenna:
    "Beetle insect moving long antennae to sense nearby food crumb on leaf, biology close-up friendly, NO text NO labels. Matches 'The beetle moved its antenna to sense nearby food.'",
  thorax:
    "Insect diagram showing wings attached to middle thorax section between head and abdomen, biology lesson, NO labels NO text. Matches 'An insect's wings attach to the middle thorax.'",
  abdomen:
    "Wasp insect with narrow pointed abdomen end flying near garden flower, NO text NO labels. Matches 'The abdomen of the wasp ends in a narrow point.'",
  exoskeleton:
    "Hard crab shell exoskeleton protecting soft body inside on beach sand, marine biology, NO text NO labels. Matches 'A hard exoskeleton protects the crab's soft body.'",
  cartilage:
    "Knee joint cross-section with soft cartilage cushion between bones preventing rub, body science, NO labels NO text. Matches 'Cartilage cushions joints so bones do not rub.'",
  tendon:
    "Finger anatomy showing tendon connecting muscle to bone like rope, biology friendly, NO labels NO text. Matches 'A tendon connects muscle to bone in your finger.'",
  ligament:
    "Girl with knee brace resting off soccer field after torn ligament injury recovery, sports safety, NO text NO words. Matches 'A torn ligament kept her off the soccer field.'",
  capillary:
    "Microscopic view of tiny blood capillaries weaving through tissue paths, biology diagram friendly, NO labels NO text. Matches 'Capillaries carry blood through tiny tissue paths.'",
  platelet:
    "Small cut on finger with platelets forming clot stop bleeding bandage nearby, health science, NO text NO numbers. Matches 'Platelets help stop bleeding from a small cut.'",
  plasma:
    "Blood sample in test tube showing yellow liquid plasma carrying red cells, science class, NO labels NO text. Matches 'Plasma is the liquid part that carries blood cells.'",
};

export const BATCH28_PROMPTS = {
  blueprint:
    "Engineer unrolling large blueprint paper checking every line for building plan on desk, construction office, NO readable lines NO text. Matches 'The engineer checked every line on the blueprint.'",
  lever:
    "Child using wooden lever and rock fulcrum to lift heavy stone with less force, simple machines, NO text NO numbers. Matches 'A lever helps lift heavy stones with less force.'",
  pulley:
    "Flag pole pulley system raising colorful flag up tall pole, school yard, NO text NO readable flag words.",
  wedge:
    "Axe wedge splitting firewood log when struck with mallet, simple machine demo, NO text NO words. Matches 'A wedge splits firewood when you strike it.'",
  fulcrum:
    "Playground seesaw balancing on central fulcrum with two kids gently bouncing, NO text NO numbers. Matches 'The seesaw balances on a central fulcrum.'",
  gear:
    "Bicycle hub with interlocking metal gears turning one another, mechanics lesson, NO text NO labels. Matches 'One gear turns another inside the bicycle hub.'",
  axle:
    "Bicycle wheels spinning smoothly on greased center axle, close-up mechanics, NO text NO labels. Matches 'Wheels spin smoothly on a greased axle.'",
  ramp:
    "Wheelchair ramp at school entrance with gentle safe slope for accessibility, NO text NO signs. Matches 'The wheelchair ramp meets safety slope rules.'",
  crane:
    "Tall construction crane lifting steel beams onto building roof at worksite, NO text NO labels. Matches 'A tall crane lifted steel beams onto the roof.'",
  wheelbarrow:
    "Garden wheelbarrow filled with mulch being pushed toward flower beds, yard work, NO text NO words. Matches 'We filled the wheelbarrow with mulch for the garden.'",
};

export const BATCH29_PROMPTS = {
  folklore:
    "Elder telling children story by bending river legend with curved river illustration, local folklore mood, NO text NO words. Matches 'Local folklore explains why the river bends sharply.'",
  mythology:
    "Greek mythology scene with friendly gods heroes and gentle monsters on clouds, storybook style, NO readable names NO text. Matches 'Greek mythology features gods, heroes, and monsters.'",
  relic:
    "Ancient relic treasure sealed inside stone tomb with soft torch light, archaeology mood, NO text NO labels. Matches 'The relic was sealed inside a stone tomb.'",
  exhibit:
    "Museum dinosaur skeleton exhibit with long line of families waiting Saturday visit, NO readable signs NO text. Matches 'The dinosaur exhibit drew long lines on Saturday.'",
  curator:
    "Museum curator carefully placing artifacts in glass gallery cases, NO readable labels NO text. Matches 'The curator chose artifacts for the new gallery.'",
  hieroglyph:
    "Egyptian wall with colorful hieroglyph picture symbols telling story without readable letters, NO text NO words. Matches 'Each hieroglyph on the wall told part of a story.'",
  excavate:
    "Archaeology team gently brushing dirt to excavate buried pottery shard at dig site, NO text NO labels. Matches 'Teams excavate carefully to uncover buried pottery.'",
  pilgrimage:
    "Travelers walking ancient trail toward distant shrine on hill pilgrimage journey, NO text NO signs. Matches 'Their pilgrimage followed an ancient trail to the shrine.'",
  antiquity:
    "Ancient marble statues from antiquity displayed behind museum glass cases, art history, NO readable plaques NO text. Matches 'Statues from antiquity stand behind glass cases.'",
  chronology:
    "Classroom timeline wall showing chronology of major inventions as ordered icons without dates text, NO readable text NO numbers. Matches 'Our timeline shows the chronology of major inventions.'",
};

export const BATCH30_PROMPTS = {
  stereotype:
    "Student learning about real diverse classmates breaking wrong stereotype thought bubble, kindness lesson, NO readable text NO words. Matches 'Challenge a stereotype by learning about real people.'",
  prejudice:
    "Child unfairly judging newcomer before meeting them with crossed arms then smiling after talking, social studies, NO text NO words. Matches 'Prejudice unfairly judges people before knowing them.'",
  discrimination:
    "School and workplace scene with law shield stopping unfair discrimination, inclusive civics lesson, NO readable text NO signs. Matches 'Laws aim to stop discrimination in schools and jobs.'",
  diversity:
    "Diverse classroom circle discussion with many cultures sharing ideas warmly, NO text NO words. Matches 'Classroom diversity makes discussions richer and kinder.'",
  inclusion:
    "Teacher inviting student in wheelchair to join group activity at center table inclusion, NO text NO words. Matches 'Inclusion invites every student to join the activity.'",
  tolerance:
    "Classmates respectfully listening to different opinions during debate tolerance lesson, NO readable text NO words. Matches 'Tolerance helps classmates respect different opinions.'",
  dignity:
    "Student greeting school event guest with handshake treating them with dignity and respect, NO text NO words. Matches 'Treat every guest with dignity at the school event.'",
  equity:
    "Teacher giving different support tools to students who need them equally fair equity scene, NO text NO labels. Matches 'Equity means giving each student the support they need.'",
  representation:
    "Student council with fair representation from every group sharing ideas at round table, NO text NO words. Matches 'Fair representation lets every group share ideas.'",
  ally:
    "Student ally speaking up kindly when friend treated unfairly on playground, supportive friendship, NO text NO words. Matches 'An ally speaks up when someone is treated unfairly.'",
};

export const BATCH31_PROMPTS = {
  "seventy-four":
    "School awards ceremony with many chairs set in neat rows suggesting seventy-four seats, auditorium stage with trophies, NO text NO digits. Matches 'Seventy-four chairs were set for the awards ceremony.'",
  "seventy-five":
    "Students painting large school mural with many different shades of blue paint on wall, art class, NO text NO numbers. Matches 'The mural used seventy-five shades of blue paint.'",
  "seventy-six":
    "Summer camp scene with many campers receiving outdoor skills badges on vests, forest camp, suggesting seventy-six campers, NO text NO digits. Matches 'Seventy-six campers earned their outdoor skills badges.'",
  "seventy-seven":
    "School room door with robotics club tools robots and wires inside classroom, room number shown as dots not digits, NO readable text. Matches 'Room seventy-seven holds the robotics club tools.'",
  "seventy-eight":
    "Colorful beaded necklace on craft fair table with many beads strung together suggesting seventy-eight beads, NO text NO numbers. Matches 'Seventy-eight beads formed a necklace for the craft sale.'",
  "seventy-nine":
    "School choir on spring tour singing on stage with many song sheets as blank pages suggesting seventy-nine songs, NO readable text NO digits. Matches 'The choir sang seventy-nine songs during the spring tour.'",
  "eighty-one":
    "Large group of students at new coding club with laptops and robot kits, many members suggesting eighty-one students, NO text NO digits. Matches 'Eighty-one students joined the new coding club.'",
  "eighty-two":
    "Yellow school bus driving route with many bus stop signs along road suggesting eighty-two stops, NO readable numbers NO text. Matches 'The bus route makes eighty-two stops each weekday.'",
  "eighty-three":
    "Community tree planting along school driveway with many young saplings in row suggesting eighty-three trees, NO text NO numbers. Matches 'Eighty-three trees were planted along the school drive.'",
  "eighty-four":
    "Thick puzzle book open on desk with many riddle pages as blank shapes suggesting eighty-four riddles, NO readable text NO digits. Matches 'The puzzle book lists eighty-four riddles to solve.'",
};

export const BATCH32_PROMPTS = {
  cricket:
    "Cricket players guarding wickets with bat and ball on grassy field, friendly sports scene, NO text NO words. Matches 'Cricket players guard the wickets on a grassy field.'",
  softball:
    "Softball player sliding safely into base during team practice on diamond field, NO text NO numbers. Matches 'Our softball team practiced sliding into base.'",
  handball:
    "Handball player scoring goal as ball crosses line on indoor court, sports lesson, NO text NO digits. Matches 'Handball goals count when the ball crosses the line.'",
  curling:
    "Curling team sweeping ice with brooms to guide heavy stone on rink, winter sports, NO text NO words. Matches 'Curling teams sweep ice to guide the heavy stone.'",
  bobsled:
    "Bobsled team racing down icy track at high speed, winter Olympics mood, NO text NO numbers. Matches 'The bobsled raced down the icy track in seconds.'",
  triathlon:
    "Athlete doing triathlon with swimming pool bike and running track shown together, three sports combined, NO text NO labels. Matches 'A triathlon combines swimming, biking, and running.'",
  pentathlon:
    "Five different athletic skill stations fencing swimming riding running shooting as friendly icons, pentathlon lesson, NO text NO words. Matches 'The pentathlon tests five different athletic skills.'",
  decathlon:
    "Decathlon athlete competing at track and field with ten event icons around stadium, NO text NO numbers. Matches 'Decathlon athletes compete in ten track events.'",
  hurdles:
    "Runner leaping smoothly over track hurdles without breaking stride, sports day, NO text NO digits. Matches 'Runners leap over hurdles without breaking stride.'",
  discus:
    "Girl spinning and throwing discus far across grassy field, track and field practice, NO text NO numbers. Matches 'She spun and threw the discus far across the field.'",
};

export const BATCH33_PROMPTS = {
  tsunami:
    "Coastal families calmly walking to higher ground after tsunami warning siren, safety lesson not scary, NO text NO words. Matches 'A tsunami warning sent coastal families to higher ground.'",
  floodplain:
    "Homes on flat floodplain beside river with strong levee wall protecting them, geography lesson, NO text NO labels. Matches 'Homes on the floodplain need strong levees.'",
  barometer:
    "Weather barometer on wall dropping before dark storm clouds arrive, science classroom, NO readable numbers NO text. Matches 'The barometer dropped before the storm arrived.'",
  anemometer:
    "Anemometer wind gauge spinning faster as wind blows stronger on school roof, weather station, NO digits NO text. Matches 'An anemometer spins faster when the wind strengthens.'",
  hygrometer:
    "Hygrometer humidity meter in greenhouse showing rising moisture with tropical plants, science demo, NO readable numbers NO text. Matches 'The hygrometer showed rising humidity in the greenhouse.'",
  sleet:
    "Sleet ice pellets tapping against classroom window on gray morning, weather lesson, NO text NO words. Matches 'Sleet tapped against the classroom windows all morning.'",
  hailstone:
    "Large hailstone leaving dent in metal roof after storm, cross-section view friendly, NO text NO numbers. Matches 'A large hailstone dented the metal roof.'",
  overcast:
    "Overcast gray cloudy sky over cool afternoon school playground, moody but friendly, NO text NO words. Matches 'Overcast skies made the afternoon feel cool and gray.'",
  microclimate:
    "Sunny warm school courtyard garden with tender plants thriving in sheltered microclimate while snow outside, NO text NO labels. Matches 'The courtyard has a warm microclimate for tender plants.'",
  cloudburst:
    "Sudden heavy cloudburst rain flooding playground drains with puddles, dramatic weather, NO text NO digits. Matches 'A sudden cloudburst flooded the playground drains.'",
};

export const BATCH34_PROMPTS = {
  variable:
    "Coding lesson storing game score in variable box labeled with colored shape not words on laptop screen, NO readable text NO digits. Matches 'Store the score in a variable called points.'",
  function:
    "Simple code diagram showing function adding two number blocks and returning sum arrow, computer class, NO readable numbers NO text. Matches 'The function adds two numbers and returns the sum.'",
  loop:
    "Animation loop repeating same cartoon character motion ten times shown as circular arrows, coding class, NO text NO numbers. Matches 'A loop repeats the animation ten times.'",
  debug:
    "Students debugging program on laptop finding missing piece in code puzzle, computer science, NO readable code text. Matches 'We debug the program to find the missing semicolon.'",
  syntax:
    "Correct code syntax blocks fitting together like puzzle while broken blocks fall off, programming lesson, NO readable text. Matches 'Correct syntax keeps the code from crashing.'",
  binary:
    "Computer chip with binary pattern of dots and dashes not zeros and ones as shapes, digital literacy, NO digits NO letters. Matches 'Computers use binary code made of zeros and ones.'",
  interface:
    "App interface on tablet with large colorful buttons for young users, friendly UI design, NO readable text NO labels. Matches 'The app interface has large buttons for young users.'",
  server:
    "School computer server rack storing student projects safely overnight with lock icon, NO text NO brand logos. Matches 'The school server stores projects safely overnight.'",
  client:
    "Laptop computers connected to network as clients with wifi waves to central hub, NO readable text NO URLs. Matches 'Each laptop acts as a client on the network.'",
  integer:
    "Whole number seven shown as complete circle with no decimal slice, math concept friendly, NO digits NO text. Matches 'Seven is an integer with no decimal part.'",
};

export const BATCH35_PROMPTS = {
  bicameral:
    "Government building diagram with two separate chambers side by side bicameral legislature civics lesson, NO labels NO text. Matches 'A bicameral legislature has two separate chambers.'",
  impeachment:
    "Serious civics classroom lesson about impeachment process with officials at podium, educational not scary, NO readable text NO words. Matches 'Impeachment is a serious process for removing officials.'",
  sovereignty:
    "Independent nation with own flag shape and leaders governing themselves, national sovereignty civics, NO readable text NO words on flag. Matches 'National sovereignty means a country governs itself.'",
  diplomacy:
    "Two nation representatives shaking hands at table settling border dispute with map, diplomacy lesson, NO readable text NO labels. Matches 'Diplomacy helped the nations settle the border dispute.'",
  embassy:
    "Visitors lining up outside embassy gate with friendly guard, international civics field trip, NO readable signs NO text. Matches 'Visitors lined up outside the embassy gate.'",
  federation:
    "Federation diagram linking many state shapes under one central government building, civics class, NO labels NO text. Matches 'The federation links states under one central government.'",
  confederation:
    "Confederation with local state buildings holding most power and weak central hub, civics lesson, NO labels NO text. Matches 'A confederation gives most power to local states.'",
  sovereign:
    "Diverse sovereign nations each choosing their own leaders at ballot boxes, world civics, NO readable text NO words. Matches 'Each sovereign nation chooses its own leaders.'",
  nominee:
    "Election nominee giving speech about safer streets at school podium, campaign scene, NO readable text NO words. Matches 'The nominee gave a speech about safer streets.'",
  incumbent:
    "Incumbent mayor at desk promising new library hours to community, town hall scene, NO readable text NO schedules. Matches 'The incumbent mayor promised new library hours.'",
};

export const BATCH36_PROMPTS = {
  metamorphosis:
    "Caterpillar transforming into butterfly on leaf showing metamorphosis stages, biology lesson, NO text NO labels. Matches 'Metamorphosis turns a caterpillar into a butterfly.'",
  spore:
    "Wind blowing tiny spores from fern plant that grow into new ferns, biology scene, NO text NO labels. Matches 'Wind carries spores that grow into new ferns.'",
  fungus:
    "Gray fungus spreading across damp log in forest, nature science, NO text NO words. Matches 'A fungus spread across the damp log in the forest.'",
  protozoa:
    "Microscope view of tiny protozoa swimming in drop of pond water, biology class, NO labels NO text. Matches 'Protozoa swim in drops of pond water.'",
  parasite:
    "Tick parasite on friendly cartoon dog fur feeding gently shown as biology lesson not scary, NO text NO labels. Matches 'A tick is a parasite that feeds on animal blood.'",
  symbiosis:
    "Bees and flowers helping each other symbiosis in sunny garden, pollination lesson, NO text NO words. Matches 'Symbiosis helps bees and flowers help each other.'",
  lichen:
    "Gray lichen coating old stone wall in garden, earth science close-up, NO text NO labels. Matches 'Gray lichen coated the old stone wall.'",
  moss:
    "Soft green moss covering shady side of rock in forest, nature study, NO text NO words. Matches 'Soft moss covered the shady side of the rock.'",
  fern:
    "Tall fern unfurling new fronds beside forest trail, botany lesson, NO text NO labels. Matches 'A tall fern unfurled beside the forest trail.'",
  perennial:
    "Perennial flowers returning every spring in school garden with seasonal arrows, NO text NO words. Matches 'Perennial flowers return every spring in our garden.'",
};

export const BATCH37_PROMPTS = {
  exponent:
    "Math lesson showing two cubed with small three as exponent above cube stack, geometry blocks not readable digits, NO text NO numbers. Matches 'In two cubed, the exponent is the number three.'",
  coefficient:
    "Algebra tiles showing five times x with five highlighted as coefficient, math class, NO readable letters NO digits. Matches 'In 5x, five is the coefficient of the variable.'",
  equation:
    "Student solving equation n plus four equals ten on whiteboard with balance scale, NO readable numbers NO text. Matches 'Solve the equation n plus four equals ten.'",
  inequality:
    "Number line showing x greater than two with many possible answers shaded, inequality lesson, NO readable digits NO text. Matches 'The inequality x is greater than two has many answers.'",
  expression:
    "Math expression three a plus two shown as colored blocks algebra lesson, NO readable text NO digits. Matches 'The expression 3a plus 2 shows a math phrase.'",
  distributive:
    "Distributive property demo multiplying two times four plus one with grouped blocks, NO readable numbers NO text. Matches 'Use the distributive property to multiply 2 times 4 plus 1.'",
  commutative:
    "Addition commutative property three plus five same as five plus three with block groups swapped, NO readable digits NO text. Matches 'Addition is commutative because 3 plus 5 equals 5 plus 3.'",
  associative:
    "Associative addition grouping with parentheses shown as colored brackets around number blocks, NO readable numbers NO text. Matches 'Grouping changes with the associative rule of addition.'",
  estimation:
    "Student estimating beans in jar guessing about two hundred with thought bubble, math activity, NO readable numbers NO text. Matches 'Estimation helped us guess the jar held about 200 beans.'",
  rounding:
    "Rounding forty-seven to nearest ten gives fifty shown on number line with arrow, NO readable digits NO text. Matches 'Rounding 47 to the nearest ten gives 50.'",
};

export const BATCH38_PROMPTS = {
  protagonist:
    "Story protagonist hero solving mystery finding clue in final chapter of adventure book scene, NO readable text NO words. Matches 'The protagonist solves the mystery by the final chapter.'",
  antagonist:
    "Story antagonist villain hiding clues from detective in mystery tale, storybook style not scary, NO readable text. Matches 'The antagonist hides clues from the detective.'",
  subplot:
    "Funny subplot with hero's talkative dog causing comedy beside main adventure scene, storytelling lesson, NO readable text. Matches 'A funny subplot follows the hero's talkative dog.'",
  prequel:
    "Prequel story showing how kingdom first united with young king and villages, fantasy history, NO readable text NO words. Matches 'The prequel shows how the kingdom first united.'",
  trilogy:
    "Three matching fantasy books read together over cozy winter break scene, trilogy concept, NO readable titles NO text. Matches 'Fans read the entire trilogy over winter break.'",
  genre:
    "Girl choosing mystery genre books from school library shelf with magnifying glass icon, NO readable titles NO text. Matches 'Mystery is her favorite genre in the school library.'",
  cinematography:
    "Film camera capturing beautiful sunrise over lake cinematography scene, movie making class, NO readable text NO words. Matches 'Beautiful cinematography captured the sunrise over the lake.'",
  screenwriter:
    "Screenwriter at desk revising dialogue script with natural conversation bubbles as shapes only, NO readable text. Matches 'The screenwriter revised dialogue until it sounded natural.'",
  director:
    "Film director choosing music for final scene with orchestra and movie set, NO readable text NO sheet music words. Matches 'The director chose music for the final scene.'",
  producer:
    "Movie producer scheduling filming with calendar and rain cloud before rainy season, film class, NO readable dates NO text. Matches 'The producer scheduled filming before the rainy season.'",
};

export const BATCH39_PROMPTS = {
  tectonic:
    "Cross-section Earth showing tectonic plates slowly shifting beneath continents, geology lesson, NO labels NO text. Matches 'Tectonic plates slowly shift beneath continents.'",
  geologist:
    "Geologist examining and dating rocks from cliff face with hammer and sample bag, earth science, NO readable text NO labels. Matches 'The geologist dated rocks from the cliff face.'",
  ore:
    "Miners underground extracting metal from iron ore rock in mine tunnel, geology lesson, NO text NO labels. Matches 'Miners extract metal from iron ore underground.'",
  seismic:
    "Seismic waves rippling through ground after underground earthquake shown as gentle waves, NO text NO numbers. Matches 'Seismic waves traveled after the underground quake.'",
  epicenter:
    "Map with star marking earthquake epicenter miles from small town, geography lesson, NO readable text NO digits. Matches 'Maps marked the epicenter miles from our town.'",
  aftershock:
    "Small aftershock rattling cups on kitchen shelf gently, earthquake science not scary, NO text NO words. Matches 'A small aftershock rattled cups on the shelf.'",
  mantle:
    "Earth cross-section with hot rock in mantle moving crust above, geology diagram friendly, NO labels NO text. Matches 'Hot rock in the mantle moves the crust above.'",
  crust:
    "Earth crust cross-section thinner under ocean than under mountains, geology lesson, NO labels NO text. Matches 'Earth's crust is thinner under the ocean.'",
  geode:
    "Child splitting geode rock revealing sparkling purple crystals inside, geology discovery, NO text NO labels. Matches 'Splitting the geode revealed sparkling crystals inside.'",
  stalactite:
    "Stalactite hanging like icicle from cave roof with dripping water, earth science, NO text NO words. Matches 'A stalactite hung like an icicle from the cave roof.'",
};

export const BATCH40_PROMPTS = {
  veterinarian:
    "Veterinarian gently checking rescued owl wing at wildlife clinic, caring animal doctor, NO text NO labels. Matches 'The veterinarian checked the rescued owl's wing.'",
  electrician:
    "Electrician wiring new lights in school gym with tools and ladder, career day, NO text NO labels. Matches 'An electrician wired the new lights in the gym.'",
  plumber:
    "Plumber fixing leaking sink in science classroom with wrench, career lesson, NO text NO words. Matches 'The plumber fixed the leaking sink in the science room.'",
  carpenter:
    "Carpenter building sturdy wooden shelves for school library with hammer and nails, NO text NO labels. Matches 'A carpenter built sturdy shelves for the library.'",
  surgeon:
    "Surgeon practicing careful stitches on medical training model, healthcare careers, NO text NO words. Matches 'The surgeon practiced careful stitches on a model.'",
  zoologist:
    "Zoologist tracking wolves with binoculars in national park forest, wildlife science career, NO text NO labels. Matches 'The zoologist tracked wolves in the national park.'",
  economist:
    "Economist explaining rising prices at market stall with chart arrows not numbers, civics economics, NO readable text NO digits. Matches 'An economist explained why prices rose at the market.'",
  archaeologist:
    "Archaeologist gently brushing soil from painted ancient bowl at dig site, NO text NO labels. Matches 'The archaeologist brushed soil from a painted bowl.'",
  dietitian:
    "Dietitian planning balanced healthy lunches on cafeteria tray with food groups, nutrition career, NO readable text NO labels. Matches 'A dietitian planned balanced lunches for the cafeteria.'",
  illustrator:
    "Illustrator drawing colorful maps for textbook at art desk, creative career, NO readable text NO map labels. Matches 'The illustrator drew colorful maps for our textbook.'",
};

export const BATCH41_PROMPTS = {
  "eighty-five":
    "Wedding reception guest book table with many guests signing, large group suggesting eighty-five guests, festive hall, NO readable text NO digits. Matches 'Eighty-five guests signed the wedding guest book.'",
  "eighty-six":
    "Warehouse interior with many wooden supply crates stacked in rows suggesting eighty-six crates, NO labels NO numbers. Matches 'The warehouse stores eighty-six crates of supplies.'",
  "eighty-seven":
    "Tall clock tower with long stone staircase winding upward suggesting many steps, friendly town scene, NO readable numbers NO text. Matches 'Eighty-seven steps lead up to the clock tower.'",
  "eighty-eight":
    "Grand piano keyboard seen from above with full width of white and black keys suggesting eighty-eight notes, music room, NO readable text NO digits. Matches 'Piano keys span eighty-eight notes on the keyboard.'",
  "eighty-nine":
    "Quiet river road with many cozy houses lining both sides suggesting eighty-nine homes, peaceful neighborhood, NO house numbers NO text. Matches 'Eighty-nine houses line the quiet river road.'",
  "ninety-one":
    "School gym ceiling decorated with many colorful balloons suggesting ninety-one balloons, celebration mood, NO text NO digits. Matches 'Ninety-one balloons decorated the gym ceiling.'",
  "ninety-two":
    "Thick quiz booklet on desk with many multiple-choice pages as blank bubbles suggesting ninety-two questions, classroom, NO readable text NO numbers. Matches 'The quiz has ninety-two multiple-choice questions.'",
  "ninety-three":
    "World map wall with many small flag pins from different countries suggesting ninety-three nations, online exchange lesson, NO country names NO digits. Matches 'Ninety-three countries joined the online exchange.'",
  "ninety-four":
    "Thick novel open on desk with bookmark near the end showing few pages left suggesting ninety-four pages remain, reading nook, NO readable text NO numbers. Matches 'Ninety-four pages remain in the thick novel.'",
  "ninety-five":
    "City bus route map with many bus stop dots along morning route suggesting ninety-five stops, transportation lesson, NO readable text NO digits. Matches 'The bus route added ninety-five new morning stops.'",
};

export const BATCH42_PROMPTS = {
  javelin:
    "Girl athlete throwing javelin in smooth overhand arc on track field, sports day, NO text NO numbers. Matches 'She threw the javelin in a smooth overhand arc.'",
  "shot put":
    "Shot put athlete pushing heavy metal ball from shoulder on grassy field, track and field, NO text NO digits. Matches 'Shot put athletes push a heavy metal ball from the shoulder.'",
  "pole vault":
    "Pole vault athlete leaping high over bar with flexible pole on track, sports lesson, NO text NO numbers. Matches 'Pole vault competitors leap over a high bar.'",
  "long jump":
    "Athlete landing far in sand pit after long jump on track, sports day, NO text NO digits. Matches 'Her long jump landed far past the sand pit edge.'",
  "high jump":
    "High jump bar being raised on standards after successful leap, track meet, NO readable numbers NO text. Matches 'The high jump bar rose after each successful leap.'",
  "triple jump":
    "Triple jump sequence showing hop step and final jump on runway, track and field lesson, NO text NO numbers. Matches 'Triple jump uses a hop, a step, and a final jump.'",
  heptathlon:
    "Seven different track and field sport icons around athlete on stadium, heptathlon concept, NO labels NO text. Matches 'The heptathlon tests seven track and field skills.'",
  biathlon:
    "Winter athlete cross-country skiing then aiming rifle at target, biathlon combined sport, NO text NO numbers. Matches 'Biathlon combines cross-country skiing with rifle shooting.'",
  orienteering:
    "Orienteering team racing through woods with map and compass, outdoor adventure, NO readable map text NO digits. Matches 'Orienteering teams race using maps and compasses.'",
  racquetball:
    "Racquetball player hitting ball in small indoor court with echo lines, sports gym, NO text NO words. Matches 'Racquetball echoes inside the small indoor court.'",
};

export const BATCH43_PROMPTS = {
  fiber:
    "Whole grain bread and oats on plate showing fiber for healthy digestion, nutrition lesson, NO labels NO text. Matches 'Whole grains provide fiber that helps digestion.'",
  nutrient:
    "Balanced plate with colorful food groups each playing role in growth, health class, NO readable labels NO text. Matches 'Each nutrient plays a role in healthy growth.'",
  antioxidant:
    "Bowl of mixed berries protecting body cells shown as friendly shield bubbles, science nutrition, NO text NO words. Matches 'Berries contain antioxidants that protect body cells.'",
  cholesterol:
    "Doctor checking patient during health checkup with heart chart on screen as shapes only, clinic, NO readable numbers NO text. Matches 'Doctors track cholesterol levels during checkups.'",
  sodium:
    "Food package label showing sodium as salt shaker icon without readable numbers, nutrition lesson, NO legible text NO digits. Matches 'Food labels list sodium in milligrams per serving.'",
  gluten:
    "Wheat bread slice and flour bag showing gluten from wheat, bakery science, NO readable text NO labels. Matches 'Some breads contain gluten from wheat flour.'",
  organic:
    "Organic apple orchard with ladybug and no spray bottles, healthy farming, NO text NO logos. Matches 'Organic apples grew without synthetic pesticides.'",
  preservative:
    "Juice bottle staying fresh on shelf with small shield icon, food science, NO readable labels NO text. Matches 'A preservative keeps the juice fresh longer.'",
  pasteurize:
    "Factory milk bottles moving through gentle heat tunnel to kill bacteria safely, food science, NO text NO numbers. Matches 'Factories pasteurize milk to kill harmful bacteria.'",
  fermentation:
    "Grape juice in jar slowly turning to vinegar with friendly bubbles, kitchen science experiment, NO readable text NO labels. Matches 'Fermentation turns grape juice into vinegar slowly.'",
};

export const BATCH44_PROMPTS = {
  editorial:
    "Newspaper editorial page with opinion column and bike lane sketch downtown, civics media, NO readable words NO text. Matches 'The editorial argued for safer bike lanes downtown.'",
  columnist:
    "Friendly columnist typing funny Friday stories at desk with coffee, journalism class, NO readable text NO words. Matches 'The columnist writes funny stories every Friday.'",
  newscast:
    "School TV studio students reporting lunch menu changes on camera, morning announcements, NO readable text NO words. Matches 'Our school newscast reports lunch menu changes.'",
  telecast:
    "Live parade on Main Street shown on TV camera with crowd waving, broadcast lesson, NO readable street signs NO text. Matches 'The telecast showed the parade live from Main Street.'",
  subscriber:
    "Mailbox with monthly science magazine stack for subscribers, NO readable titles NO text. Matches 'Each subscriber receives the science magazine monthly.'",
  moderator:
    "Student debate moderator with gavel keeping two teams calm and fair, school auditorium, NO readable text NO words. Matches 'The moderator kept the debate fair and calm.'",
  correspondent:
    "News correspondent with microphone reporting from coastal fishing town harbor, journalism career, NO text NO logos. Matches 'A correspondent filed reports from the coastal town.'",
  byline:
    "Newspaper front page with author name line as blank bar above story photo, media literacy, NO readable words NO text. Matches 'Her byline appeared above the front-page story.'",
  bulletin:
    "School bulletin board announcing early dismissal with clock icon, hallway scene, NO readable times NO text. Matches 'A bulletin announced the early dismissal time.'",
  newsletter:
    "Parent reading classroom newsletter on Monday morning at kitchen table with backpack nearby, NO readable text NO words. Matches 'Parents read the classroom newsletter each Monday.'",
};

export const BATCH45_PROMPTS = {
  isotope:
    "Carbon isotope used to date ancient wooden log with science timeline chart as shapes only, archaeology science, NO readable text NO numbers. Matches 'Carbon has an isotope used to date ancient wood.'",
  radioactive:
    "Radioactive materials in lead-lined shielded storage container with warning symbol shape only, lab safety, NO readable text NO words. Matches 'Radioactive materials require careful shielded storage.'",
  fusion:
    "Friendly star in space releasing bright energy from fusion reaction, astronomy lesson, NO text NO labels. Matches 'Fusion in stars releases enormous amounts of energy.'",
  fission:
    "Heavy atom splitting into smaller friendly particles in nuclear science diagram, classroom model, NO readable labels NO text. Matches 'Nuclear fission splits heavy atoms into smaller parts.'",
  quark:
    "Scientists examining tiny quarks inside proton neutron model with magnifying glass, particle physics, NO text NO words. Matches 'Scientists study quarks inside protons and neutrons.'",
  photon:
    "Tiny packet of light energy photon traveling as cheerful light beam from sun to leaf, physics lesson, NO text NO numbers. Matches 'A photon is a tiny packet of light energy.'",
  laser:
    "Laser beam cutting precise lines in metal sheet in workshop demo, technology class, NO readable text NO digits. Matches 'A laser beam cut precise lines in the metal sheet.'",
  semiconductor:
    "Semiconductor chips on circuit board powering phone and laptop icons, electronics lesson, NO brand logos NO text. Matches 'Semiconductor chips power phones and laptops.'",
  transistor:
    "Transistor switching electric signal on and off in simple circuit diagram with glowing path, NO readable labels NO text. Matches 'A transistor switches electric signals on and off.'",
  capacitor:
    "Capacitor storing charge for camera flash with bright pop of light, electronics demo, NO text NO numbers. Matches 'A capacitor stores charge for a camera flash.'",
};

export const BATCH46_PROMPTS = {
  crusade:
    "Friendly historical crusade march across desert toward distant city silhouettes, storybook history not violent, NO text NO words. Matches 'The crusade marched across deserts toward distant cities.'",
  mummy:
    "Ancient mummy resting in painted stone sarcophagus in museum exhibit, history lesson, NO readable hieroglyphs NO text. Matches 'The mummy rested in a painted stone sarcophagus.'",
  sultan:
    "Sultan welcoming traders to busy colorful harbor with ships and spices, world history, NO readable text NO labels. Matches 'The sultan welcomed traders to the busy harbor.'",
  caravan:
    "Desert caravan of camels carrying spice sacks along sandy trade route, history geography, NO text NO words. Matches 'A caravan carried spices along the desert route.'",
  medieval:
    "Medieval castle guarding narrow mountain pass with flags and towers, storybook history, NO readable text NO numbers. Matches 'Medieval castles guarded narrow mountain passes.'",
  renaissance:
    "Renaissance artist and inventor sketching new art and science ideas in bright studio, history lesson, NO readable text NO words. Matches 'The Renaissance sparked new art and science ideas.'",
  knighthood:
    "Young knight training with wooden sword learning honor and skills in castle yard, friendly history, NO text NO words. Matches 'Knighthood training taught honor and sword skills.'",
  conqueror:
    "Friendly storybook conqueror uniting rival villages with handshake and map, peaceful leadership not violent, NO readable text NO labels. Matches 'The conqueror united rival villages under one rule.'",
  viking:
    "Viking longship crossing cold northern sea with crew and waves, history adventure, NO readable text NO words. Matches 'Viking ships crossed cold northern seas.'",
  samurai:
    "Samurai warrior practicing honor code with katana in peaceful garden, Japanese history lesson, not scary, NO text NO words. Matches 'Samurai warriors followed strict codes of honor.'",
};

export const BATCH47_PROMPTS = {
  biome:
    "Desert biome with cactus and very little rain cloud, ecology lesson showing dry landscape, NO text NO labels. Matches 'A desert biome receives very little yearly rainfall.'",
  reforestation:
    "Volunteers planting thousands of native tree saplings on hillside, environmental project, NO text NO numbers. Matches 'Reforestation planted thousands of native saplings.'",
  biodegradable:
    "Biodegradable plates breaking down in compost bin with worms and leaves, eco science, NO readable text NO labels. Matches 'Biodegradable plates break down in compost bins.'",
  emissions:
    "School bus fleet switching to cleaner fuel with less smoke from exhaust, environment lesson, NO readable text NO digits. Matches 'Bus emissions dropped after the fleet switched fuel.'",
  recyclable:
    "Recyclable plastic bottles going into blue recycling bin, classroom eco station, NO readable labels NO text. Matches 'Recyclable bottles go in the blue bin.'",
  landfill:
    "Less trash truck going to landfill when family recycles at home sorting bins, ecology lesson, NO text NO words. Matches 'Less waste reaches the landfill when we recycle.'",
  pollutant:
    "Factory smokestack pollutant harming air shown as gray cloud over city with sad air face, environment science, NO text NO labels. Matches 'Factory smoke is a pollutant that harms air quality.'",
  sustainability:
    "Child using water and electricity wisely without waste, sustainability poster as icons only, NO readable text NO words. Matches 'Sustainability means using resources without wasting them.'",
  stewardship:
    "Park stewards cleaning trails and picking up litter keeping park safe, community service, NO text NO labels. Matches 'Stewardship of the park keeps trails clean and safe.'",
  desertification:
    "Once green farmland turning dry and dusty from desertification, ecology cross-section, NO text NO words. Matches 'Desertification turns fertile land dry and dusty.'",
};

export const BATCH48_PROMPTS = {
  chord:
    "Three piano keys pressed together forming cheerful major chord, music theory lesson, NO note letters NO text. Matches 'Three notes together form a cheerful major chord.'",
  scale:
    "Girl practicing piano scale with both hands on keyboard, music class, NO readable sheet music NO text. Matches 'She practiced a piano scale with both hands.'",
  treble:
    "Flute player in treble range with high wavy sound lines, orchestra lesson, NO text NO note names. Matches 'Flutes often play in the treble range.'",
  forte:
    "Drummer hitting cymbal loudly forte during chorus with bold sound waves, band practice, NO text NO words. Matches 'The drummer hit the cymbal forte during the chorus.'",
  pianissimo:
    "String section entering very softly pianissimo under soft stage lights, concert hall, NO sheet music text NO words. Matches 'The strings entered pianissimo under the soft lights.'",
  staccato:
    "Short separated staccato notes shown as bouncy dots on music staff without letters, music lesson, NO readable notes NO text. Matches 'Staccato notes sound short and separated.'",
  allegro:
    "Orchestra finale racing at fast allegro tempo with conductor waving quickly, music class, NO readable text NO words. Matches 'The finale raced along at an allegro tempo.'",
  clef:
    "Treble clef symbol at start of staff marking higher notes, music theory board, NO note names NO text. Matches 'The treble clef marks higher notes on the staff.'",
  sharp:
    "Piano key raised one half step for F sharp shown with upward arrow on keyboard, NO letter labels NO text. Matches 'Play F sharp by raising the note one half step.'",
  flat:
    "Piano key B flat sounding slightly lower shown with downward arrow, music lesson, NO letter text NO numbers. Matches 'B flat sounds slightly lower than plain B.'",
};

export const BATCH49_PROMPTS = {
  sprinkler:
    "Ceiling fire sprinklers spraying water during school safety drill in hallway, NO text NO labels. Matches 'Ceiling sprinklers sprayed water during the drill.'",
  extinguisher:
    "Red fire extinguisher mounted on lab wall with student pointing to it, safety lesson, NO readable labels NO text. Matches 'Know where the fire extinguisher hangs in the lab.'",
  detector:
    "Smoke detector on kitchen ceiling beeping with slightly burnt toast on counter, home safety, NO text NO words. Matches 'A smoke detector beeped when toast burned.'",
  reflector:
    "Bike reflectors shining bright when car headlights pass at night, road safety, NO text NO numbers. Matches 'Bike reflectors shine when car headlights pass.'",
  pedestrian:
    "Pedestrian crossing signal helping family cross street safely at crosswalk, traffic safety, NO readable text NO digits. Matches 'Pedestrian signals help people cross safely.'",
  yield:
    "Car yielding to walkers at marked crosswalk with stop hand gesture, driving safety lesson, NO readable signs NO text. Matches 'Drivers yield to walkers at the marked crossing.'",
  semaphore:
    "Old railroad semaphore signal telling train to stop on tracks, history of signals, NO readable text NO words. Matches 'Railroad semaphores once signaled trains to stop.'",
  flammable:
    "Flammable liquid bottles stored away from heater and stove with warning icon shape only, lab safety, NO readable text NO labels. Matches 'Store flammable liquids away from heat sources.'",
  combustible:
    "Workshop with combustible dust warning and vacuum cleaning sawdust safely, industrial safety, NO readable text NO words. Matches 'Combustible dust can be dangerous in workshops.'",
  evacuation:
    "Students following evacuation route signs to north parking lot during drill, school safety, NO readable text NO numbers. Matches 'The evacuation route leads to the north parking lot.'",
};

export const BATCH50_PROMPTS = {
  synthesize:
    "Student combining facts from three source books into one report on desk, research skills, NO readable text NO words. Matches 'Synthesize facts from three sources into one report.'",
  paraphrase:
    "Child rewriting paragraph in own words with pencil and blank notebook, writing lesson, NO readable source text NO words. Matches 'Paraphrase the paragraph in your own words.'",
  cite:
    "Student citing encyclopedia page where fact was found with bookmark and finger pointing, research honesty, NO readable text NO titles. Matches 'Cite the encyclopedia page where you found the fact.'",
  annotate:
    "Student writing questions in margins of poem book with pencil, close reading lesson, NO readable poem text NO words. Matches 'Annotate the poem with questions in the margins.'",
  brainstorm:
    "Kids brainstorming science fair ideas on sticky notes before choosing topic, creative thinking, NO readable text NO words. Matches 'Brainstorm ideas before choosing a science topic.'",
  interpret:
    "Student interpreting rainfall graph with umbrella and cloud icons explaining changes, math science, NO readable numbers NO text. Matches 'Interpret the graph to explain rainfall changes.'",
  prioritize:
    "Homework sorted by due date and difficulty with calendar and star stickers, study skills, NO readable dates NO text. Matches 'Prioritize homework by due date and difficulty.'",
  speculate:
    "Scientists looking through telescope speculating about oceans on distant moon with water waves thought bubble, space science, NO text NO words. Matches 'Scientists speculate about oceans on distant moons.'",
  generalize:
    "Teacher warning not to generalize from one tiny test tube experiment to whole world, science method, NO readable text NO numbers. Matches 'Do not generalize from one small experiment.'",
  elaborate:
    "Student adding one more example to answer on presentation board with extra detail bubble, classroom, NO readable text NO words. Matches 'Elaborate on your answer with one more example.'",
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
  batch81: BATCH81_PROMPTS,
  batch82: BATCH82_PROMPTS,
  batch83: BATCH83_PROMPTS,
  batch84: BATCH84_PROMPTS,
  batch85: BATCH85_PROMPTS,
  batch86: BATCH86_PROMPTS,
  batch87: BATCH87_PROMPTS,
  batch88: BATCH88_PROMPTS,
  batch89: BATCH89_PROMPTS,
  batch90: BATCH90_PROMPTS,
  batch91: BATCH91_PROMPTS,
  batch92: BATCH92_PROMPTS,
  batch93: BATCH93_PROMPTS,
  batch94: BATCH94_PROMPTS,
  batch95: BATCH95_PROMPTS,
  batch96: BATCH96_PROMPTS,
  batch97: BATCH97_PROMPTS,
  batch98: BATCH98_PROMPTS,
  batch99: BATCH99_PROMPTS,
  batch100: BATCH100_PROMPTS,
};
