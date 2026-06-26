/**
 * Build grade6-daily-word-list.txt from dictionary + common-word heuristics.
 * Run: node scripts/build-grade6-daily-word-list.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { GRADE6_FINAL } from "./seed-data/grade6-final.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const finalSet = new Set(GRADE6_FINAL.map((c) => normWord(c.word)));
const blocked = new Set(GRADE6_FORBIDDEN_WORDS);
for (const c of GRADE6_CARDS) {
  if (!finalSet.has(normWord(c.word))) blocked.add(normWord(c.word));
}

/** Common everyday English (home, school, town, food, nature). */
const PRIORITY = `
apron attic awning badge bakery balcony bandage banner barber barn barrel basket bathtub
battery beacon beaker beard bedroom beet bell belt bench berry bicycle binder blanket blender
blouse bolt bonnet booth bouquet bowl bracelet braid brand brass bread breakfast broom brush
bucket buffet bulb bun bundle bunker burger butter button cabin cactus cage calendar candle
candy canoe carpet carrot carton castle ceiling celery cellar cereal chain chair chalk channel
chapel charcoal chart cheese cherry chili chimney chip chocolate choir chopstick church cinema
circle circus clamp clay clerk cliff clinic cloak closet cloth cloud clown coach cocoa coconut
coffee cola collar comb comfort comic cookie copper coral cork cornfield cottage cotton couch
cough cracker cradle craft crane crate crayon cream creek crib cricket croissant crop crosswalk
crow crown crumb cucumber cupboard curtain cushion daisy dashboard dawn daylight deck denim
desk dessert diamond diary diner dirt dish dishcloth dishwasher dock doghouse doll doorway
doughnut dragonfly drawer dresser drill driveway drum dryer duckling dumpling dust dustpan
eagle earring easel echo editor eel eggplant elbow elevator emerald envelope eraser escalator
evening evidence exam fabric factory falcon farmhouse faucet feather fence fern ferry festival
fiddle field fig finger fingerprint fireplace firework fishbowl fisherman fishing fist flagpole
flash flashlight flask flavor flight floor flour flower flute foam fog folder fondue forest
fork fortress fountain frame freezer fridge friendship fringe frost fryer funnel furnace
gadget gallery garage garbage garlic garment gateway gazebo gecko gem generator ghost ginger
glacier globe glove glue goldfish gong gorilla gown grain grape grasshopper grave gravel
gravy greenhouse grill grocer grocery grove guard guest guitar haircut hallway ham hammock
handball handkerchief handle handshake hanger harbor hardware harmony harvest hatch haystack
headband headline headset heater hedge hedgehog heel helicopter helmet helper herb herd hexagon
highway hillside hinge hockey holder homeroom honey hood hook hopscotch horizon horn hostel
hotdog hourglass housewife hover huddle hull hummingbird hunger hunter hurdle hurricane hydrant
icicle icon igloo impact inch index indoor infant ink inlet insect instant instrument interest
internet interview intro ivy jacket jelly jewel journal jungle kangaroo karate kayak keeper
ketchup keyboard khaki kindergarten kitten kneel knight knit knob knot koala ladybug lagoon
lamb lane lantern laptop lard lark laser latch laundry lawn layer leak leap leather lecture
lemon lemonade lens leopard lettuce lever license lid lighthouse lily lime linen lipstick
liquid litter lizard lobby local locker locket lodge lollipop longitude loom loop lotion
lounge luggage lumber lung lure lyric macaroni magnet maid mailbox makeup mango mansion maple
marble margin marker marshmallow mason meadow mechanic melon merchant mercury merry mischief mist
mitten mixer moat mobile modem moisture mold mole monitor monk moose mosaic moss moth motorcycle
mound movement muffin mulberry mushroom mustard mutton napkin narrow navy necklace nectar needle
nightingale nightmare noodle nozzle nursery oatmeal oasis oat omelet opera orchard orchid ore
otter pacifier paddle pail painter palace palm pamphlet pancake panda panel pantry parade
parcel parking parrot parsley passage passport pasta pastry patch patio pavement paw peacock
peanut pebble pedal peel pelican penguin perfume pharmacy picnic picture pigeon pile pillow
pilot pineapple pirate pistachio pitch pizza playground plow plum plumber pocket poet poison
pole pony popcorn porch pork portrait postcard poster pouch powder pudding puff pumpkin punch
puppet puppy purse pyramid quail quilt raccoon rack radar raft rag railroad rainbow raisin
rake ranch rapids raven razor reader receipt recycle reed reef reel referee refrigerator register
reindeer relay remote ribbon rickshaw ridge rifle rink ripple robin rocket roller rooster router
royal ruby rumble runner rust rye sack saddle safari salmon salon samosa sandbox sapling sash
satellite saucer sausage savanna savings scallop scar scarf scent scoop scratch sculptor seagull
seam series servant shampoo shelter shield shift shrimp shrub sculptor sidewalk silk sill singer
skate skillet sled sleeve slime slope slug smarty smokestack snail snowflake snowman socket
softball softball soldier solid sonnet spade spaghetti span spark sparrow spatula speck spiderweb
spinach splinter sponge sprout squirrel stable stadium stairway stampede stapler starfish statue
steak steam steel stew sticky stingray stockpile stork stove strawberry streamer stretch stripe
stroller stump subject subway sugarcane suitcase sunflower sunset supermarket surfboard surgeon
surround sushi swallow swan sweater sweep switchboard syrup tablet tailgate tambourine tangerine
tapestry target tart tattoo tavern teapot teddy teenager telegram telescope temple tennis tent
terrace textbook thermos thicket thunderstorm ticket tidy tile toaster toddler tomato toolbox
toothbrush toothbrush toothpaste tornado tortilla towel tower township tractor traffic trail
trampoline traveler tray treasure treadmill triangle tricycle trophy trout tulip tunnel turkey
turtle tutor tuxedo twig typewriter umbrella uncle uniform union universe upper urban useful
vacation valley vampire van vase vault velvet vendor verse vest village vine violin visitor
volcano volleyball volume voucher wagon wallet walnut wand warehouse warrior watermelon wax
weekend weightlifter welcome westward wheat wheelchair whistle wig wilderness windshield wizard
wolf workbook workplace worm worry wreath wristband writer yard yarn yogurt zebra zipper
apron attic bakery balcony bandage banner barn bathtub battery beacon beaker beard bell
belt bench berry bicycle binder blanket blender blouse bolt bowl bread breakfast broom brush
bucket buffet bulb bun bundle burger butter button cabin cactus cage calendar candle candy
canoe carpet carrot carton castle ceiling celery cellar cereal chain chair chalk channel chapel
charcoal chart cheese cherry chimney chip chocolate choir church cinema circle clamp clay clerk
cliff clinic cloak closet cloth cloud clown coach cocoa coconut coffee collar comb comfort comic
cookie copper coral cornfield cottage cotton couch cough cracker craft crane crayon cream cricket
crop crosswalk crow crown cucumber cupboard curtain cushion dawn denim desk dock doctor dragonfly
drawer dress drill driveway drum dryer eagle easel echo editor eel elbow elevator envelope eraser
escalator evening exam fabric factory falcon faucet fence fern ferry festival field fig finger
fireplace fisherman fishing flash flashlight flask flight floor flour flower flute fog folder forest
fork fountain frame freezer fridge frost funnel furnace gadget gallery garage garbage garlic gateway
gecko gem generator ginger glacier globe glove glue goldfish gorilla grain grape grasshopper greenhouse
grove guard guest guitar hallway ham handball handkerchief handle hanger harbor hardware harmony harvest
heater hedgehog heel helicopter helmet herb hero hexagon highway hockey holder honey horizon horn
hospital hotel hummingbird hurricane hut hymn ice idea jacket jam jar jaw jazz jeans jeep juice
jungle kangaroo karate kayak ketchup kettle keyboard kick kitten knight knit koala ladybug lagoon
lake lamb lane lantern laser laundry leak leather lecture lemon lens leopard lettuce lever library
lid lighthouse lightning lime linen lion liquid lizard local locker log macaroni magnet mailbox mango
mansion maple marble marker meadow mechanic melon merchant mist mobile moisture mole monitor moose mosaic
moss moth muffin mustard napkin narrow nectar nightingale nightmare noodle nursery oatmeal oasis opera orchard
ore otter palace palm pancake panda pantry parade parcel parking parrot passport pasta pastry patio pavement
paw peacock pebble peel pelican penguin penny pharmacy picture pigeon pillow pilot pineapple pitch pizza
playground plow plum plumber pocket poet pole pony popcorn porch pork portrait postcard poster potato
pumpkin puppy purse pyramid quail quilt raccoon raft rag rainbow rake ranch raven receipt recycle
refrigerator reindeer relay remote ribbon ridge rocket roller rooster router rubber rug runner rust rye
salmon sandbox sandwich satellite sausage savanna scar scarf scene scissors sculptor shampoo shelter shield shrimp
sidewalk silk singer skate sleeve slope snail snow spatula spinach sponge sprout squirrel stable stadium
stapler starfish statue stew sticky stork stove strawberry stroller stump subway suitcase sunset surgeon swallow
swan sweater sweep syrup tablet tambourine tangerine tapestry tavern teapot teddy teenager temple tennis terrace
textbook thermos thunderstorm ticket tidy tile toaster tomato toothbrush toothpaste tornado towel tower tractor traffic
trail treasure treadmill triangle trophy trout tunnel turkey turtle tutor umbrella uniform valley van vase
vault vegetable vehicle verse vest village vine violin visitor volcano volleyball volume vote wagon wallet
warehouse watermelon wax welcome wheat wheelchair whistle wig windshield workbook worm yard yogurt zebra zipper
`.split(/\s+/).map((w) => normWord(w)).filter(Boolean);

function looksCommon(w) {
  if (w.length < 3 || w.length > 12) return false;
  if (!/^[a-z]+$/.test(w)) return false;
  if (!/[aeiouy]/.test(w)) return false;
  return true;
}

const out = [];
const seen = new Set();
for (const w of PRIORITY) {
  if (!looksCommon(w) || blocked.has(w) || seen.has(w)) continue;
  seen.add(w);
  out.push(w);
}

writeFileSync(join(root, "scripts/data/grade6-daily-word-list.txt"), `${out.join("\n")}\n`, "utf8");
console.log(`Wrote ${out.length} daily word candidates (priority only, no dictionary filler).`);
