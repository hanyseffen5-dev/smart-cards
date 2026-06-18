/** Sentence-aligned redo for user-requested grade 4 card positions */
import { GENERATE_IMAGE_STYLE } from "./lib/daniel-image-style.mjs";

const S = GENERATE_IMAGE_STYLE;

export const REDO_USER_CARDS_PROMPTS = {
  "sixty-one":
    `${S} Many children compete at a regional spelling bee on a school stage with a microphone and audience. Scene from sentence: Sixty-one entries competed in the regional spelling bee.`,
  "sixty-two":
    `${S} A greenhouse interior filled with many rows of small tomato seedlings in trays on shelves. Scene from sentence: The greenhouse holds sixty-two tomato seedlings.`,
  spectroscope:
    `${S} A friendly spectroscope device splitting starlight into colorful rainbow bands in a dark observatory scene. Scene from sentence: A spectroscope splits starlight into colored bands.`,
  supply:
    `${S} A market stall with very few apples in a basket and a worried vendor, suggesting low supply. Scene from sentence: Low supply of apples raised the price at the market.`,
  tax:
    `${S} A friendly city scene showing a school, a park with playground, and a public library funded by city services. Scene from sentence: City tax funds schools, parks, and public libraries.`,
  streaming:
    `${S} A student watches a school assembly live on a laptop with a stable wifi connection icon, cozy desk setup. Scene from sentence: Streaming the assembly required a stable internet connection.`,
  trademark:
    `${S} A single company building with one distinctive friendly logo symbol on the wall, no readable text. Scene from sentence: The logo is a trademark that belongs to one company.`,
  ukulele:
    `${S} A girl strumming a ukulele on a sunny beach talent show stage with a small audience. Scene from sentence: She strummed a ukulele at the beach talent show.`,
  wrestling:
    `${S} Kids learning safe wrestling holds on a gym mat with a friendly coach supervising. Scene from sentence: Wrestling practice taught safe holds on the mat.`,
  skateboard:
    `${S} A boy landing a skateboard trick at a neighborhood park with ramps. Scene from sentence: He landed a trick on his skateboard at the park.`,
  surfing:
    `${S} Surfing lesson on calm shallow water, beginner balancing on a surfboard near shore. Scene from sentence: Surfing lessons begin with balance on calm water.`,
  snowboarding:
    `${S} A snowboarder gliding down a snowy slope leaving curved track lines in the snow behind. Scene from sentence: Snowboarding down the slope left curved tracks behind.`,
  snorkeling:
    `${S} Snorkelers in clear water watching bright colorful fish near a coral reef. Scene from sentence: Snorkeling let us watch bright fish near the reef.`,
  "sixty-three":
    `${S} Many hikers arriving at a cozy mountain shelter at dusk with backpacks and sunset sky. Scene from sentence: Sixty-three hikers reached the mountain shelter by dusk.`,
  "sixty-four":
    `${S} A chess club room with practice chessboards showing the classic square pattern, friendly kids playing. Scene from sentence: The chess club has sixty-four squares on each practice board.`,
  "sixty-five":
    `${S} A school read-a-thon booth selling many colorful bookmarks to excited children. Scene from sentence: Sixty-five bookmarks were sold at the read-a-thon.`,
  "sixty-six":
    `${S} A family road trip scene with an open map on the car dashboard and a long scenic highway stretching ahead, no readable text or numbers. Scene from sentence: Route sixty-six appears on our road trip map.`,
  "sixty-seven":
    `${S} A wetland field guide book open showing many different bird and plant species in a marsh scene. Scene from sentence: Sixty-seven species were listed in the wetland guide.`,
  "sixty-eight":
    `${S} A huge stadium packed with cheering fans waving flags and clapping, energetic but friendly. Scene from sentence: The stadium seats sixty-eight thousand cheering fans.`,
  "sixty-nine":
    `${S} A river festival at night with many glowing lanterns floating above the water. Scene from sentence: Sixty-nine lanterns floated above the river festival.`,
  strait:
    `${S} Two ships passing through a narrow blue strait of water between two green coastlines. Scene from sentence: Ships pass through the strait between two coasts.`,
  thermal:
    `${S} A stove warming a pot of soup with gentle heat waves rising, cozy kitchen scene. Scene from sentence: Thermal energy from the stove warmed the soup.`,
  stanza:
    `${S} A poem displayed as four colorful rhyming blocks on a classroom poster, no readable letters. Scene from sentence: Each stanza of the poem rhymes in a steady pattern.`,
  verse:
    `${S} A student happily memorizing a school song with floating musical notes, no readable text. Scene from sentence: She memorized every verse of the school song.`,
  sphere:
    `${S} Earth shown as a round sphere spinning in space with stars, friendly cartoon style. Scene from sentence: Earth is nearly a sphere spinning in space.`,
  suffrage:
    `${S} A friendly historical voting scene with women casting ballots at a ballot box, hopeful mood. Scene from sentence: Women's suffrage gave millions the right to vote.`,
  thorax:
    `${S} A friendly labeled insect diagram showing wings attached to the middle thorax section, educational cartoon. Scene from sentence: An insect's wings attach to the middle thorax.`,
  tendon:
    `${S} A simple finger anatomy diagram showing a tendon connecting muscle to bone, friendly educational style. Scene from sentence: A tendon connects muscle to bone in your finger.`,
  wedge:
    `${S} A metal wedge splitting a log of firewood when struck with a mallet, backyard scene. Scene from sentence: A wedge splits firewood when you strike it.`,
  wheelbarrow:
    `${S} A wheelbarrow filled with dark mulch in a sunny garden with flowers and shrubs. Scene from sentence: We filled the wheelbarrow with mulch for the garden.`,
  stereotype:
    `${S} Diverse friendly classmates learning about each other's cultures together, breaking assumptions. Scene from sentence: Challenge a stereotype by learning about real people.`,
  tolerance:
    `${S} Classmates in a circle respectfully listening to different opinions with friendly expressions. Scene from sentence: Tolerance helps classmates respect different opinions.`,
  softball:
    `${S} A softball team practicing sliding safely into a base on a dusty field. Scene from sentence: Our softball team practiced sliding into base.`,
  triathlon:
    `${S} A triathlon scene combining swimming in a lake, biking on a road, and running on a trail. Scene from sentence: A triathlon combines swimming, biking, and running.`,
  tsunami:
    `${S} Coastal families calmly moving to higher ground on a hill after a tsunami warning, safe and friendly. Scene from sentence: A tsunami warning sent coastal families to higher ground.`,
  sleet:
    `${S} Sleet and icy rain tapping against classroom windows while kids look out from inside. Scene from sentence: Sleet tapped against the classroom windows all morning.`,
  variable:
    `${S} A friendly coding scene with colorful blocks representing a score variable called points, no readable code text. Scene from sentence: Store the score in a variable called points.`,
  syntax:
    `${S} Colorful organized code blocks stacked neatly on a screen, suggesting correct structure, no readable text. Scene from sentence: Correct syntax keeps the code from crashing.`,
  sovereignty:
    `${S} A proud friendly nation governing itself with its own parliament building and flag, no readable text. Scene from sentence: National sovereignty means a country governs itself.`,
  sovereign:
    `${S} Citizens of a sovereign nation voting to choose their leaders at a friendly polling station. Scene from sentence: Each sovereign nation chooses its own leaders.`,
  spore:
    `${S} Wind carrying tiny spores from a fern plant that sprout into new baby ferns. Scene from sentence: Wind carries spores that grow into new ferns.`,
  symbiosis:
    `${S} Bees pollinating colorful flowers in a sunny meadow, both helping each other. Scene from sentence: Symbiosis helps bees and flowers help each other.`,
  subplot:
    `${S} A funny side scene of a hero's talkative cartoon dog causing silly chaos while the hero watches amused. Scene from sentence: A funny subplot follows the hero's talkative dog.`,
  trilogy:
    `${S} Three matching fantasy books stacked on a cozy winter break reading nook with hot cocoa. Scene from sentence: Fans read the entire trilogy over winter break.`,
  tectonic:
    `${S} A cross-section showing tectonic plates slowly shifting beneath continents with gentle movement arrows. Scene from sentence: Tectonic plates slowly shift beneath continents.`,
  stalactite:
    `${S} A cave ceiling with a stalactite hanging down like an icicle above a calm underground pool. Scene from sentence: A stalactite hung like an icicle from the cave roof.`,
  veterinarian:
    `${S} A kind veterinarian gently checking the wing of a rescued owl in a clinic. Scene from sentence: The veterinarian checked the rescued owl's wing.`,
  surgeon:
    `${S} A surgeon practicing careful stitches on a medical training model in a bright clinic. Scene from sentence: The surgeon practiced careful stitches on a model.`,
  zoologist:
    `${S} A zoologist with binoculars tracking wolves from a distance in a national park forest. Scene from sentence: The zoologist tracked wolves in the national park.`,
  "triple jump":
    `${S} An athlete performing triple jump on a track: hop, step, then final long jump into sand. Scene from sentence: Triple jump uses a hop, a step, and a final jump.`,
  sodium:
    `${S} A food nutrition label on a cereal box highlighting sodium content with abstract bars, no readable text. Scene from sentence: Food labels list sodium in milligrams per serving.`,
  telecast:
    `${S} A live parade broadcast on a TV screen showing colorful floats on Main Street. Scene from sentence: The telecast showed the parade live from Main Street.`,
  subscriber:
    `${S} A happy person receiving a science magazine from a mailbox each month. Scene from sentence: Each subscriber receives the science magazine monthly.`,
  transistor:
    `${S} A tiny transistor switching electric signals on a friendly circuit board with glowing paths. Scene from sentence: A transistor switches electric signals on and off.`,
  sultan:
    `${S} A friendly sultan welcoming traders with goods at a busy colorful harbor marketplace. Scene from sentence: The sultan welcomed traders to the busy harbor.`,
  viking:
    `${S} A Viking longship with a striped sail crossing cold blue northern seas with gentle waves. Scene from sentence: Viking ships crossed cold northern seas.`,
  sustainability:
    `${S} Kids recycling, planting trees, and saving water to use resources wisely without waste. Scene from sentence: Sustainability means using resources without wasting them.`,
  stewardship:
    `${S} Park stewards cleaning trails and planting flowers to keep the park safe and beautiful. Scene from sentence: Stewardship of the park keeps trails clean and safe.`,
  treble:
    `${S} A flute player producing high bright musical notes with floating sound waves upward. Scene from sentence: Flutes often play in the treble range.`,
  staccato:
    `${S} Short separated musical notes shown as distinct bouncy dots on a staff, no readable text. Scene from sentence: Staccato notes sound short and separated.`,
  sprinkler:
    `${S} Ceiling fire sprinklers spraying water during a school safety drill, kids calmly lining up. Scene from sentence: Ceiling sprinklers sprayed water during the drill.`,
  yield:
    `${S} A driver stopping and yielding to pedestrians at a marked crosswalk. Scene from sentence: Drivers yield to walkers at the marked crossing.`,
  synthesize:
    `${S} A student combining notes from three source books into one organized report on a desk. Scene from sentence: Synthesize facts from three sources into one report.`,
  speculate:
    `${S} Scientists with telescopes looking at a distant moon and imagining oceans, thoughtful wonder. Scene from sentence: Scientists speculate about oceans on distant moons.`,
};

export const REDO_USER_CARDS_WORDS = Object.keys(REDO_USER_CARDS_PROMPTS);
