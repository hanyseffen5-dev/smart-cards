import { isGeminiConfigured } from "./backgroundWorkers";
import { buildSceneImagePromptWithGemini } from "./geminiImagePrompt";
import { buildImagePrompt } from "./imagePrompt";

/**
 * Turn an example sentence into a concrete picture description (not the raw sentence).
 * Pollinations draws scenes, not grammar — this step is required for accurate flashcards.
 */
export async function resolveVisualSceneForImage(
  word: string,
  translation?: string | null,
  example: string | null | undefined,
): Promise<string> {
  const sentence = example?.trim();
  if (!sentence) {
    throw new Error(`No example sentence for "${word}".`);
  }

  if (isGeminiConfigured()) {
    try {
      const fromGemini = await buildSceneImagePromptWithGemini(word, translation, sentence);
      if (fromGemini.length > 20) return fromGemini;
    } catch {
      // fall through to rules
    }
  }

  const fromRules = ruleBasedVisualScene(sentence, word);
  if (fromRules) return fromRules;

  return buildImagePrompt(word, translation, sentence);
}

/** Keyword-based fallback when Gemini is unavailable. */
function ruleBasedVisualScene(example: string, word: string): string | null {
  const e = example.toLowerCase();
  const w = word.toLowerCase();

  if (/\bwalked?\b.*\bslowly\b|\bslowly\b.*\bwalk/.test(e)) {
    return "A young girl with a backpack walking very slowly on a sidewalk toward a small school building, gentle smile, sunny day, full body visible";
  }
  if (/\breasoning\b|\bclear and convincing\b|\bconvincing\b/.test(e) && /\bthink|reason|clear\b/.test(e)) {
    return "A thoughtful schoolgirl pointing up at a glowing yellow lightbulb above her head, a friendly teacher nodding with an impressed smile, classroom pastel background";
  }
  if (/\bbroccoli\b|\bdislike\b|\bdon't like\b|\bdo not like\b/.test(e)) {
    return "Two children at a kitchen table frowning and pushing away a plate of green broccoli, crossed arms, unhappy faces";
  }
  if (/\bdisturbing\b|\bscary\b|\bsound\b.*\bdoor\b|\bdoor\b.*\bsound\b/.test(e)) {
    return "Two worried children standing near an open door, dark hallway inside, wavy lines near the door suggesting a strange sound";
  }
  if (/\bstarving\b|\bhungry\b|\bempty plate\b/.test(e)) {
    return "A tired child sitting at a table staring at an empty plate, sad hungry expression, simple kitchen background";
  }
  if (/\bcamel\b|\bdesert\b/.test(e)) {
    return "A friendly camel standing in golden desert sand under a bright sun, small dunes, clear sky";
  }
  if (/\brain\b|\braining\b/.test(e)) {
    return "A child holding a colorful umbrella while rain falls, puddles on the ground, cozy jacket";
  }
  if (/\bunder\b.*\btable\b|\bunder the\b/.test(e)) {
    return "A bright red ball clearly placed under a wooden table, simple room, nothing else confusing";
  }
  if (/\btest\b|\bexam\b|\bschool\b.*\bwrit/.test(e)) {
    return "A student sitting at a desk writing on a test paper, focused expression, classroom setting";
  }
  if (/\bthink|thought|idea\b/.test(e)) {
    return "A child with a happy face and a glowing lightbulb floating above their head, simple pastel background";
  }
  if (/\brun\b|\bran\b|\bfast\b/.test(e)) {
    return "A child running quickly through a park, motion lines, energetic happy face";
  }
  if (/\beat\b|\bfood\b|\beat\b/.test(e)) {
    return "A child happily eating food at a table, plate with simple food, cheerful expression";
  }
  if (/\bsleep\b|\bslept\b|\bbed\b/.test(e)) {
    return "A child sleeping peacefully in a bed, night sky through window, cozy blanket";
  }
  if (/\bplay\b|\bplaying\b|\bgame\b/.test(e)) {
    return "Children playing together with a ball in a playground, laughing, bright colors";
  }
  if (/\breading helps\b|\bhelps your mind\b/.test(e)) {
    return "A child sitting and reading an open storybook, focused happy face, books nearby, no lightbulb";
  }
  if (/\byoung boy ran\b|\bran fast\b/.test(e)) {
    return "A young small boy running fast on a track with motion lines, energetic, no adults";
  }
  if (/\btransformation\b.*\bcity\b|\bcity saw a transformation\b/.test(e)) {
    return "Split view: old small village on the left, modern city on the right, same location, no butterfly";
  }
  if (/\backnowledge\b.*\bmistake\b|\bwill acknowledge\b/.test(e)) {
    return "A boy at school raising his hand admitting a mistake to a teacher, sorry expression";
  }
  if (/\bone month has four weeks\b/.test(e)) {
    return "A wall calendar showing one month page with four horizontal week rows highlighted";
  }
  if (/\blost her reason\b.*\bfear\b/.test(e)) {
    return "A terrified girl covering her ears, dizzy spirals, fear, not a thinking lightbulb";
  }
  if (/\bdo not boast\b.*\bmoney\b/.test(e)) {
    return "A boy showing off coins while friends look annoyed, boasting about money";
  }
  if (/\bsat among\b.*\bfriends\b/.test(e)) {
    return "A boy sitting in a circle among several friends on grass";
  }
  if (/\bcow eats grass\b/.test(e)) {
    return "A cow in a green field eating grass, close view";
  }
  if (/\bhold a meeting\b/.test(e)) {
    return "People sitting around a table in a meeting room with charts";
  }
  if (/\bwrong to mock\b/.test(e)) {
    return "One child laughing at another who made a mistake while others look disapproving";
  }
  if (/\bnone of the answers\b/.test(e)) {
    return "A quiz paper with all answers marked wrong with red X marks";
  }
  if (/\bheart of the city\b/.test(e)) {
    return "Busy downtown city center with tall buildings and streets, not an anatomical heart";
  }
  if (/\bdivide the cake\b/.test(e)) {
    return "A round cake cut into four equal slices on a plate";
  }
  if (/\braised his hand\b.*\bquestion\b/.test(e)) {
    return "A student raising their hand high in a classroom to ask a question";
  }
  if (/\bfriendship stayed unbroken\b/.test(e)) {
    return "Two friends holding hands, timeline showing many years together, still close";
  }

  if (abstractOverrides[w]) return abstractOverrides[w];

  return null;
}

const abstractOverrides: Record<string, string> = {
  slowly:
    "A girl walking very slowly on a path toward a school, small steps, clock or snail motif optional, sunny pastel scene",
  reasoning:
    "A student explaining an idea to a teacher, glowing lightbulb between them, both look engaged and happy",
  dislike:
    "Two children refusing broccoli on a plate, disgusted cute faces, kitchen table",
  disturbing:
    "Children looking anxious near a spooky open doorway, dark inside, sound wave lines",
};
