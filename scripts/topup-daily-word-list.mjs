/**
 * Top up grade6-daily-word-list.txt to 420+ using simple free single-word parts.
 * Run: node scripts/topup-daily-word-list.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normWord } from "./lib/normalize.mjs";
import { GRADE6_FORBIDDEN_WORDS } from "./seed-data/grade6-forbidden.mjs";
import { GRADE6_CARDS } from "./seed-data/grade6-cards.mjs";
import { GRADE6_FINAL } from "./seed-data/grade6-final.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const listPath = join(root, "scripts/data/grade6-daily-word-list.txt");
const TARGET = 430;

const finalSet = new Set(GRADE6_FINAL.map((c) => normWord(c.word)));
const blocked = new Set(GRADE6_FORBIDDEN_WORDS);
for (const c of GRADE6_CARDS) {
  if (!finalSet.has(normWord(c.word))) blocked.add(normWord(c.word));
}

const existing = readFileSync(listPath, "utf8")
  .split(/\r?\n/)
  .map((l) => normWord(l.trim()))
  .filter(Boolean);
const have = new Set(existing);

/** Simple everyday single words (extra pool). */
const EXTRA = `
price flame tube layer effect rate form group proof view statement goggles discount
markup sales deposit recycling notation operations numbers mental arithmetic geometric
engineering experimental cellular quake volcanic pacific niche relation source custom
precision accuracy rounding estimate compatible input output pattern sequence section
blueprint prototype variable control conclusion safety measurement interpretation trend
outlier average median frequency spread quantity scalar friction momentum density
pressure principle formula replication transcription synthesis enzyme antibody vaccine
pathogen bacteria virus meeting hearing testimony pride tolerance dignity patent copyright
portal literacy checking propaganda poster operation policy reform debate claim treaty
monument curator genealogy weaving navigation chronometer glossary spelling syllable
capitalization punctuation quotation ellipsis fragment agreement consistency mood voice
phrase placement conjugation formation cohesion thesis outline hook rebuttal publishing
article headline editorial caption hashtag resolution examination citation spotting
understatement imitation reference discussion censorship presentation posture projection
pacing audience demonstration impromptu memorized celebration memorial farewell storyboard
script abalone acrobat admiral airbrush airfield airlift airlock airman airways alcove
alfalfa almanac alpaca altar amber amethyst amigo amulet angelfish angler anorak antelope
antler anvil apricot armband armchair armrest armpit arrowhead artichoke arugula ashtray
asparagus audiobook autograph aviary axolotl baboon backache backboard backfire backhand
backhoe backlit backrest backseat backside backspin backstop backtalk backwash backwoods
backyard badminton bagel bagpipe bailiff bakeware ballad ballast ballboy ballgame ballpark
ballpoint ballroom baloney bamboo bandit banister banjo banknote barbell barbershop barnacle
barnyard barometer barracks barrette barricade barstool bashful basketful bassinet bathrobe
bathroom batter bayonet beanbag beanie beaver bedbug bedframe bedroll bedsheet bedtime
beekeeper beehive beeswax beetroot bellboy bellhop belltower benchpress benefactor bento
beret betta biker bikini billboard birdbath birdcage birdhouse bisque bistro blackbird
blackboard blacksmith bladder blastoff blimp blizzard blockade bloodhound bloomers blusher
bobcat bodyguard bogeyman boiler bookend bookmark bookshop bookworm boombox bootcamp
borderline borough botany boulder boulevard boutique bowtie boxcar boxers brainwash brake
branch bratwurst breadbox breadfruit breathalyzer breezeway bricklayer bridesmaid briefcase
brimstone broadcaster broccoli brooch broomstick brownie brunch brushstroke bubblegum
buckboard buckle budgie buffalo builder bulldog bulldozer bulletin bunny burrito busboy
busdriver bushel bushwalk busload buspass busstop butcher
`.split(/\s+/).map(normWord).filter(Boolean);

function simple(w) {
  return w.length >= 4 && w.length <= 11 && /^[a-z]+$/.test(w) && /[aeiouy]/.test(w);
}

const out = [...existing];
for (const w of EXTRA) {
  if (out.length >= TARGET) break;
  if (!simple(w) || blocked.has(w) || have.has(w)) continue;
  have.add(w);
  out.push(w);
}

for (const c of GRADE6_FINAL) {
  if (out.length >= TARGET) break;
  for (const p of c.word.split("-")) {
    const w = normWord(p);
    if (!simple(w) || blocked.has(w) || have.has(w)) continue;
    have.add(w);
    out.push(w);
  }
}

writeFileSync(listPath, `${out.join("\n")}\n`, "utf8");
console.log(`Word list: ${existing.length} → ${out.length} (target ${TARGET})`);
