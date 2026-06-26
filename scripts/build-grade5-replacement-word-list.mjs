/**
 * Pick ~620 unique daily-life words for grade 5 compound replacements.
 * Run: node scripts/build-grade5-replacement-word-list.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE1_CARDS } from "./seed-data/grade1-cards.mjs";
import { GRADE2_CARDS } from "./seed-data/grade2-cards.mjs";
import { GRADE3_CARDS } from "./seed-data/grade3-cards.mjs";
import { GRADE4_CARDS } from "./seed-data/grade4-cards.mjs";
import { GRADE5_CARDS } from "./seed-data/grade5-cards.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = 620;

/** Fixed card positions for compound replacements in chunks A/B/C. */
export const GRADE5_COMPOUND_REPLACE_INDICES = (() => {
  const idx = [];
  idx.push(511); // trophic-level (missed when prior run used hyphen-only detection)
  for (let i = 514; i <= 749; i++) idx.push(i);
  for (let i = 750; i <= 999; i++) idx.push(i);
  for (let i = 1000; i <= 1109; i++) idx.push(i);
  return idx;
})();

const replaceSet = new Set(GRADE5_COMPOUND_REPLACE_INDICES);
const blocked = new Set();
for (const c of [...GRADE1_CARDS, ...GRADE2_CARDS, ...GRADE3_CARDS, ...GRADE4_CARDS, ...GRADE6_CARDS]) {
  blocked.add(normWord(c.word));
}
for (let i = 0; i < GRADE5_CARDS.length; i++) {
  if (!replaceSet.has(i)) blocked.add(normWord(GRADE5_CARDS[i].word));
}
try {
  const exp = JSON.parse(readFileSync(join(root, ".data", "curriculum-words-export.json"), "utf8"));
  for (const w of exp.words) blocked.add(normWord(w));
} catch {
  console.warn("curriculum-words-export.json missing — using seed cards only");
}

const CANDIDATES = `
airbrush airfield airlift airlock airman airways alcove alfalfa almanac alpaca altar amber
amethyst amigo amulet angelfish angler anorak antelope antler anvil apricot armband armchair
armrest armpit arrowhead artichoke arugula ashtray asparagus audiobook autograph aviary axolotl
baboon backache backboard backfire backhand backhoe backlit backrest backseat backside backspin
backstop backtalk backwash backwoods backyard badminton bagel bagpipe bailiff bakeware ballast
ballboy ballgame ballpark ballpoint ballroom baloney bamboo bandit banister banjo banknote barbell
barbershop barnacle barnyard barometer barracks barrette barricade barstool bashful basketful
bassinet bathrobe bedbug bedframe bedroll bedsheet bedtime beekeeper beehive beeswax beetroot
bellboy bellhop belltower benchpress benefactor bento beret betta biker bikini billboard birdbath
birdcage birdhouse bisque bistro blackbird blackboard blacksmith bladder blastoff blimp blizzard
blockade bloodhound bloomers blusher bobcat bodyguard bogeyman boiler bookend bookmark bookshop
bookworm boombox bootcamp borderline borough botany boulder boulevard boutique bowtie boxcar boxers
brainwash brake branch bratwurst breadbox breadfruit breathalyzer breezeway bricklayer bridesmaid
briefcase brimstone broadcaster broccoli brooch broomstick brownie brunch brushstroke bubblegum
buckboard buckle budgie buffalo builder bulldog bulldozer bulletin bunny burrito busboy busdriver
bushel bushwalk busload buspass busstop butcher cabdriver caboose caddy cairn calzone camcorder
campfire campground campsite canister cantaloupe capstone carpool carport cartwheel catfish catwalk
cauliflower cayenne cellmate cellphone centimeter chalkboard champ changeroom chaplain charbroil
chariot checkers checkout checkpoint cheerleader cheesecake chessboard chickpea childcare chimenea
chimpanzee chipmunk chit chatroom chopper chowder cinnamon cityscape clamshell claymore cleanup
clothesline clubhouse cloverleaf clownfish coastguard cobblestone cockatoo cockroach codfish coleslaw
coliseum cologne colorblind comet comeback comicbook compactor confetti congressman cookout cookbook
cooldown copycat cornmeal cornstalk cornbread corsage corset cotillion countryman courtyard cowbell
cowboy cowgirl crayfish creamery crepe crescent crossbow crossroad crowbar cubicle cupcake curbside
curfew cutlery cutout cuttlefish cyclone cymbal daffodil dairymaid dandelion dartboard dashboard
daybreak daydream deadbolt deadline decathlon deckchair deepfreeze deerhound defrost deli deliverer
demolition denim depot derby deskjob dessertspoon detour dewdrop dialtone dicebox dietician dimmer
dinette dinghy dinosaur dirtbike dishware dishrag dishsoap dishtowel dishwasher dispatch dockyard
doghouse dollhouse dominoes doorbell doorframe doorknob doorstep doormat doorstop doughboy downpour
downstairs downtown dragonfly dragrace dressmaker dressup driftwood drillbit driveway drugstore
drumbeat drumstick duckling dumpling dustbin dustpan earache earbud earphone earplug earring easel
eardrum earthworm eastbound eavesdrop eggbeater eggnog eggshell eggplant eightball elastic elbowpad
elevator elk elkhorn embankment ember emerald embroidery emptiness enamel encampment enchilada encore
engineer englishman entree envelope eraser escalator espresso eyeglass eyepatch fabric factory
fairground fairway falconer farmhouse farmyard fastball fastfood fatherland featherbed feedbag
fencer fernfield ferryboat fieldhouse fieldtrip figment filmstrip finch fingerboard fingerprint
firecracker firehouse fireman firepit fireplug firetruck fishbowl fishhook fisherman fishnet
fishtail flagpole flamenco flapper flashbulb flashlight flatbed flatiron flatware flaxseed fleabag
floodgate floodlight floorboard florist flowerbed flowerpot flycatcher flypaper flyswatter foghorn
folktale foodcourt foodstuff footbridge footpath footprint footrest footstep footstool footwork
forehead foreman forestland forklift formica fortuneteller fountain foxglove foxhole framehouse
freckle freehand freestyle freetime freewheel freshbread friar frisbee frogman frostbite fruitcake
fruitcup fruitfly fruitloop fruitstand frybread fullback funhouse funnelcake furball furrow
furnace fuselage gadgetry gameboard gamekeeper gameroom gangplank gargoyle garland garlicbread
gaslight gasmask gaspump gatehouse gatekeeper gateway gatherer gazebo gearshift gearwheel gecko
gemstone generator ghosttown giftwrap gingerbread gingham girder giveaway glassware globetrotter
glowstick goalpost goatfish goatherd goldfish goldmine goldsmith gondola goodnight gooseberry
gopher gorilla goulash grackle grainfield granddad grandkid grandmom grandpa grapevine grassland
grassroot gravedigger gravestone graveyard gravyboat greenbean greengrocer greenhouse greengrocer
greyhound griddle grillroom grinch grocery grunion guarddog guardrail guesthouse guestroom guidebook
guidepost guineapig guitarcase gunpowder gust gusty gutterball gymnasium gypsy haberdashery hairband
hairbrush hairclip haircut hairdo hairdryer hairline hairnet hairpin hairspray hairstylist halibut
hallmark hallway halogen hamhock hammerhead hamster handball handcart handclap handcraft handcuff
handgrip handhold handiwork handkerchief handlebar handprint handrail handshake handstand handtruck
handwash handwork handyman hangar hangglider hangnail hangout hankie hardback hardcover hardhat
hardtop hardware hardwire harmonica harpist harvester hashbrown hatbox hatchet hatmaker hayfield
hayloft haymaker hayride haystack haywire hazelnut headband headboard headcount headgear headlamp
headlight headline headlock headrest headroom headscarf headstand headstone headwaiter headwind
healer healthful heartrate heatwave hedgehog hedgeclip heiress heirloom helicopter helipad helpdesk
helper henhouse henna herbicide herbivore herringbone hexagon hibachi hickory hideaway hideout
highchair highheel highlight highrise highway hillbilly hillside hilltop hindquarter hipbone hipster
hitchhike hobbyhorse hobgoblin hockey hockeystick hogwash holdup holster homemaker homeroom honeybee
honeymoon honeycomb hookworm hopscotch hornet horoscope horsefly horseman horseshoe horseradish
hotcake hotdog hotline hotplate hourglass houseboat housecat housecoat housefly housekeeper housetop
hovercraft hubcap huckleberry hula hoop humanoid hummingbird hunchback hurricane husky hydrant
iceberg icebox icebreaker icecap icecream icemaker icicle iconoclast igloo illustrator imagemaker
immigrant impala inchworm income tax indoor infirmary inkblot inkjet inkwell innkeeper innkeeper
insecticide insideout inspector instep intercom internist introvert ironclad ironwork irrigate
islander ivyjack javelin jawbone jawbreaker jazzband jellybean jellyfish jigsaw jingle jobholder
jockey jogger joiner joystick juggler jukebox jumpstart jumpsuit junkfood junkmail junkyard
kangaroo karate kayak kayaker kebab keeper kennel ketchup keyboard keychain keyhole keynote keystone
kickball kickstand kidnapper killjoy kilogram kimono kindergartener kingfish kingpin kios kiosk
kitchenware kiteboard knapsack kneecap kneepad knickknack knighthood knockdown knocker knothole
koalabear koi pond kookaburra kryptonite labcoat labrador ladybird ladybug lakeshore lakeside
lamppost landform landlady landlord landmark landmine landscape landslide langoustine lanternfish
larkspur lasagna lasso latchkey laundromat lawmaker lawnchair lawn mower lawnmower lawsuit lawyer
leadership leafhopper leafpile leafstalk leatherman lefthand legroom legwork lemonade leprechaun
letterbox letterhead leveler librarian lifeboat lifeguard lifejacket lifeline liftoff lightbulb
lightfoot lighthouse lightpost lightship lightyear lilac lilypad limelight limousine lineman linen
linkage lionfish lipbalm lipgloss lipstick liquidator listener litterbug livestock lizardfish
lobsterpot lockbox lockdown locksmith locomotive logbook logcabin loggerhead logjam longboard
longhorn longhouse longjump lookout loopback looseleaf lordship loudmouth lovebird lovebug lowland
lunchroom lunchbox lungfish macaroni mackerel madhouse maggot magnolia mailbag mailbox mailman
mainland mainmast mainstay makeup mallard mammoth manatee manhole manhunt mannequin manorhouse
mansion mapmaker mapleleaf marigold marionette marketplace marksman marshmallow martini mascot
masterpiece matchbook matchbox matchmaker matchstick matinee mattress mayflower meadowlark mealtime
meatball meatloaf mechanic medley megaphone melonball meltdown memento memorandum merchant mermaid
messhall metalwork meterstick microchip microworld midair midbrain middleman midlife midnight
midpoint midstream midwife milkmaid milkman milkshake milkweed millpond millstone mincemeat minefield
minivan minnow mintleaf mischief mistletoe mitten mixmaster mockery mocktail modem mohawk molehill
monkeybars moonbeam moonlight moonrise moonshine moonstone moosehead mopbucket motorbike motorboat
motorcade motorhome motorist mountaintop mousepad mouthful mouthpiece mudflat mudhole mudslide
muffin tin mulberry muledeer mummify mushroom musicbox muskrat mustardseed mutt muzzle nailbrush
nailfile nailpolish namesake napkin ring narwhal nautilus neckband necklace necktie needlework
neighbor nestbox nestegg nestling netball nettle newscast newsflash newspaper newsprint newsreel
newsstand nightfall nightgown nighthawk nightlight nightshirt nightstand nightwatch nosebleed
nosedive nosegay notebook notepad noticeboard nutcracker nutmeg nutria oaktree oatmeal oarlock
oasis obelisk observer octagon offbeat offhand offroad offshoot offshore offside oilcan oilcloth
oilfield oilpaint oilrig oilskin oilwell oldtimer oliveoil omelette onionring opossum orangutan
orchardist organist origami ornament oriole osprey ostrich otterhound outhouse outback outboard
outbreak outcast outclass outcrop outdo outdone outdoor outerwear outfield outfox outgrow outhouse
outlast outlaw outline outlive outlook outmatch outnumber outpace outplay outpost outrank outrun
outsider outsmart outspoken outvote outweigh overact overarm overbite overboard overbook overcoat
overcome overdo overdone overdraft overdrive overeat overfeed overfill overflow overgrown overhand
overhang overhaul overhead overhear overheat overjoy overkill overlaid overlap overlay overload
overlook overpass overpay overplay overrate override overrun overshoot oversight oversize overstate
overstay overstep overtake overtime overtone overture overturn overuse overview overwrite owlhoot
oxcart oxford oystercatcher pacemaker packhorse packrat paddleboat paddock pagoda paintball paintbrush
painter palette pallet palomino pamphlet panhandle panpipe pantheon panther pantry paperboy paperclip
paperwork paprika parachute paradeground parakeet paramedic parchment parkbench parkway parrotfish
parsley parttime passageway passbook passerby passport patchwork pathfinder pathway patroller pattie
pavement pawprint payphone peahen peapod pebblestone pecan pecanpie peddler pedestrian peephole
pegboard pelican pencilcase penguin penholder penknife pennant pennywise peony peppercorn pepperoni
perch perchance perfumery petal petunia pewter phoenix phonebook phonebooth phoneline photoalbum
photobooth photocopy photoframe photoplay pickaxe pickle picklejar pickpocket picnic basket pictureframe
piecrust piggyback piglet pigpen pigsty pigtail pigeonhole piggybank pillbox pillowcase pilotfish
pincushion pinecone pinewood pinhead pinhole pinkie pinnace pinstripe pintail pinwheel pipefish
pipeline piper pipette pirate ship pistachio pitchfork pitfall pitstop pixie pizza pie placemat
plaid planner plantain plaster plasterboard plasticware platoon playdate playhouse playmate playpen
playroom playtime plowshare plowman plumage plumb plunger pocketbook pocketknife podiatrist pokey
polaroid polecat polestar policeman pollster pollywog pomade pompadour pompon pondweed ponytail
poolside popcorn popgun popover popsicle porcupine porkchop porpoise portside postbox postcard
postmark postmaster postoffice potbelly potholder pothole potluck potpie potter pottery pouch
poultry powderpuff powerboat powerline powerplant powershift powwow prairie praline prankster prawn
precinct preface preheat preschool preserver pretzel preview prickly primrose printout prizefight
probation prodigy professor profile program projector promenade proofread propeller protractor
provender prowler prune pudding pufferfish puffin pullover pulpit pumpkinseed punchbowl puppeteer
puppy dog purifier pushcart pushpin putter puzzleboard quail quiltmaker quince raccoon racetrack
racketeer racquet radiogram ragdoll ragtime ragweed railroad rainbarrel rainboot raincheck raincoat
raindrop rainfall rainstorm rainwater rakeback ramble rancher rangefinder rascal ratchet ratfish
rattlesnake ravine rawhide raygun razorbill readout redbird redcap redcoat redfish redhead redwood
reindeer relay race rematch repairman reporter rescue restarea reststop retriever revolver rhubarb
ribcage ribbonfish ricecake ricochet riddle rider ridgepole rifleman rigging ringmaster ringtone
riverbank riverbed riverboat roadblock roadhouse roadkill roadrunner roadside roadster roadwork
roaster robber robinhood rockband rockfish rockslide rodent roebuck roofer rooster rootbeer rosebush
rosehip rosemarie rosemary rosette roundup rowboat rowhouse rubberband rubberduck rubble rucksack
rudder ruffian rugby rugmaker ruler runaway rundown runnerup runway rustproof rutabaga rye bread
saddlebag safecracker safelight safety safetybelt sailboat sailfish salesman salmonberry saltbox
saltshaker sandal sandbar sandcastle sanddune sandfish sandlot sandpaper sandpiper sandpit sandstorm
sandwich sangria sapling sardine satchel saucer sauerkraut savannah saxophone scabbard scaffold
scald scallion scallop scampi scapegoat scarecrow scarf scatterbrain scavenger schoolbag schoolboy
schoolbus schoolhouse schoolyard scientist scorpion scoundrel scrapbook scrapheap scrapmetal scrapyard
screenplay screwdriver scrubland scrubbrush scullery scullion sculptor scythe seabird seabreeze seacoast
seafarer seaglass seahorse sealant seaman seamstress seashell seashore seasick season seatbelt seaweed
secondhand secret agent seedling seer seesaw selector selfportrait semicircle semicolon senator
sendoff sentry sequin serenade serpent serviceman servicewoman setter setup sevens sevens seashell
sewing shadowbox shadowplay shakedown shallot shampoo shapeup sharecropper sharpshooter shawl shears
shepherd sheriff sherbet shingle shipmate shipshape shipwreck shirtfront shirtmaker shoelace shoemaker
shootout shopkeeper shoplift shopwindow shorebird shoreleave shortcake shortcut shortstop shotput
shoulderblade shovel showboat showcase showgirl showman showpiece showplace showtime shrapnel shrubbery
shrubland shuck shuffleboard shutterbug sideburn sidecar sidewalk sidestep sidestreet sidetrack
sidewalk sieve sightsee signboard signpost silkworm silverfish silverware simile singer singlehand
sinkhole siren sisterhood skateboard skatepark skater skeleton sketchbook sketchpad ski slope skiff
skillet skillful skim milk skinhead skunk skybox skylark skylight skyrocket skyscraper slacks slalom
slapstick slateboard slaw sledding sleepover sleepwalk sleeveless sleigh slicker slide rule slideshow
slingshot slipcover slipknot slipper slope sloth slowpoke slugger slumber slushy smallpox smartwatch
smokehouse smokestack smorgasbord smuggler snackbar snaggle snails snailmail snakebite snakeroot snapdragon
snapper snapshot snare snarl sneaker snicker sniper snippet snitch snorkel snowball snowbank snowbird
snowboard snowbound snowcap snowdrift snowfield snowflake snowman snowmobile snowplow snowshoe snowstorm
snowsuit snuffbox soapbox soapstone soccerball sockhop sod house softball softcover softdrink softshell
software softwood soilbank soldier sombrero songbird songbook songster sonnet soot sorghum souffle soundproof
soundtrack soup bowl sourdough southbound southpaw souvenir soy sauce spaceman spaceship spadework
spaghetti sparrowhawk spatula speakerphone spearfish spearmint speedboat speedbump speedometer spellbind
spellcheck spicewood spiderweb spigot spillway spinach spinet spiral staircase spitball spitfire splatter
splayfoot splinter splurge spokescat spokesperson spongecake sportscar sportswear spotlight springboard
springtime sprinkler sprinter sprout spud squash squire squirrelfish stadium staffroom stagecoach stagehand
stagger stairwell stalactite stalagmite stallion stampede standpipe standstill stapler starboard stardust
starfish starfruit starlight starling starter starfish starship starter statehouse stationmaster statue
steamboat steamroller steelworker steeplechase steerage stepladder stepmother stepsister stevedore stewpot
stickball stickpin stiletto stilllife stingray stirfry stirrup stockade stockbroker stockpile stockpot
stockroom stockyard stoker stomp stonefish stonework stoplight stopover stopwatch storefront stormcloud
stormdrain stormfront stormtrooper storyteller stout stovepipe stowaway straggler straightaway straightedge
strainer strand straphanger straw hat strawberry streambed streamer streetcar streetlamp streetlight
streetwise stretcher stricken strife stringbean stripmall stroller strongbox stronghold stucco studhorse
stuffing stump sturgeon sty styrofoam submerge submarine subscript subsection subsoil subtotal subwoofer
subway sugarcane sugarcoat sugarplum suitcase suitmaker sulky sunbeam sunblock sunburn sundae sundial
sunfish sunflower sunhat sunlamp sunlit sunroof sunrise sunset sunshade sunshine sunspot superglue
superhero supermarket supernova supersize supervisor surfboard surfer surgeon surname surtax survival
suspender swanboat swansong sweatband sweatshirt sweepstakes sweetbread sweetcorn sweetpea sweetpotato
swimsuit swing set switchboard swordfish syllable symphony synapse syrup tablecloth tableland tablespoon
tablet tableware tackboard taco tadpole tagalong tailcoat tailgate tailpipe tailwind takedown takeover
talent talkative talkshow tally tallyho tambourine tangerine tangle tangram tankard tanker tanner
tapdance tape deck tapemeasure tapeworm taproom taproot tarantula target tarot tartar taskforce
tastebud tastemaker tattletale taxicab taxpayer teacup teahouse teapot tearoom teaspoon technocrat
teddy bear teenager telecast telegraph telepathy telescope televise teller telltale temper templar
tenement tennisball tenor tentacle tenterhook termite terrarium terrazzo testtube tether textmessage
thatch theatergoer theaterhouse themepark thermos thermostat thicket thimble thinker thirdhand thornbush
threadbare threadmill threesome thresh thresher threshold thrift thrifty thrill throb thumbtack thunderbird
thunderbolt thunderclap thunderstorm thursday tiara ticktock tidbit tidy tiffany tiger lily tightrope
tightwad tilefish timberland timbrel timeframe timeshare timetable tinfoil tinker tinkerbell tinsel
tiramisu toadfish toadstool toaster tobacco toboggan toddler toehold toenail toffee toggle token
tollbooth tollgate tombstone toolbox toothache toothbrush toothpaste toothpick topcoat topiary toplight
topmast topnotch topsoil torchlight tornado touchstone towboat towhead townhall township towrope toybox
toymaker trackball trackmeet tractor trailer trainman trainyard tramcar trampoline transom trapdoor
trapeze trashcan travelogue treacle treason treeline treetop trekker trenchcoat trencher trendsetter
trespass trestle trews triathlon tricycle trident trifle trill trimmer triplet tripod trivet trojan
trombone trombone troopship trooper trophy trout trowel truce trucker truckload trueblue trumpet
trumpeter trunkfish truss trustbuster truth tryout tuba tuber tugboat tulipwood tumbleweed tunic
tunnel turban turbot turnabout turnbuckle turncoat turnip turnpike turnstile turntable turquoise turret
turtle dove turtleback turtleneck tuxedo twang tweak tweezers twilight twinbed twinge twinkle twist
twister twit twofer twosome typeface typewriter typhoon ukulele umpire unicycle union suit universe
unknown unlock unpack unplug unroll untie unwrap upbraid upcountry upend upgrade uphill uphold upholster
upland uplift upload uppercut upright upriver uproar uproot upscale upshot upside uptown upturn upward
urchin usher utopia vacationer vacuum valentine valise valley vamoose vane vanish vanity vapor
varnish vaulting vegetable vendor verdict veranda verse vestibule vet veteran viaduct vibrato victor
videotape viewer viewpoint vigil vigor village vine vineyard vintage vinyl viola violet violinist viper
viscount visitor vista vitamin vivacious vixen vocalist volcano volley volleyball volume vortex voter
voucher voyage voyager vulture waddle waffle wagon train wagon wheel wahoo waistband waistcoat waistline
waitress walkabout walkout walkover walkway wallaby wallboard wallet wallflower wallpaper walrus waltz
warble wardrobe warehouse warlock warlord warmonger warpath warp warp drive warplane warrant warrior
wartime washbasin washboard washcloth washer washout washtub wasp watchband watchdog watchmaker watchtower
watchword waterbed waterfall waterfowl waterhole watermark watermelon watermill waterpolo waterproof watershed
waterway waterwheel waterworks waveband waxwork wayfarer wayside weakling weapon weasel weathercock weatherproof
weathervane webfoot webmaster website wedding wedge weekday weekend weevil weightlifter welcome wagon
wellbeing wellhouse wellspring werewolf westbound westward whaleboat whalebone wharf wheatgrass wheelbarrow
wheelchair wheelhouse wheeze whelp whirlpool whirlwind whisk whirlpool whiskey whisper whistle whitewash
whittler whodunit wholegrain wholesale wholesome whoopee whopper whirlpool wicker wicket wideband widower
width wigwam wildcat wildfire wildflower wildlife wildwood willow wimp windbreak windchill windfall
windmill windowpane windowsill windpipe windstorm windsurf windward wineglass winemaker wingbeat wingman
wingspan wingtip wink winner wintry wiretap wisecrack wishbone witchcraft witch hazel wobble wolfhound
womanhood wonderland woodchuck woodcraft woodcutter woodpecker woodpile woodshop woodwind woodwork woolen
wordsmith workbench workday workhorse workhouse workman workout workshop worktable worldclass wormhole
worrier worship worthiness wound wraparound wrapper wreckage wrecker wrestler wriggle wrinkle wristband
writer wrongdoing wrongway yardstick yarn yearbook yearling yellowhammer yellowtail yeoman yodel yogi
yokel youngster youth yoyo zebra zeppelin zigzag zillion zinnia zipper zodiac zombie zookeeper zoologist
`.split(/\s+/).map(normWord).filter(Boolean);

function looksDaily(w) {
  if (w.length < 3 || w.length > 14) return false;
  if (!/^[a-z]+$/.test(w)) return false;
  if (!/[aeiouy]/.test(w)) return false;
  return true;
}

const out = [];
const seen = new Set();
for (const w of CANDIDATES) {
  if (out.length >= TARGET) break;
  if (!looksDaily(w) || blocked.has(w) || seen.has(w)) continue;
  seen.add(w);
  out.push(w);
}

const outPath = join(root, "scripts/data/grade5-replacement-word-list.txt");
writeFileSync(outPath, `${out.join("\n")}\n`, "utf8");
console.log(`Wrote ${out.length} words → ${outPath} (target ${TARGET}, blocked ${blocked.size})`);
if (out.length < 596) {
  console.error(`Need at least 596 words; only found ${out.length}.`);
  process.exit(1);
}
