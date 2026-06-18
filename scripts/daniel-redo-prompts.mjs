/**
 * Optional visual hints per word (example sentence comes from DB at generation time).
 */
import { REDO_IDS } from "./daniel-redo-ids.mjs";

export { REDO_IDS };

export const REDO_PROMPTS = {
  water:
    "Child happily drinking clear WATER from glass at table, healthy smile. Matches: Please drink water.",
  drink:
    "Person at breakfast table DRINKING hot tea from mug, morning sun. Matches: I drink tea in the morning.",
  other:
    "Two books on desk, child pointing at the OTHER book not the first. Matches: I want the other book.",
  proposal:
    "Young man presenting simple clear PROPOSAL on paper to small group listening. Matches: His proposal was simple and clear.",
  healthy:
    "Girl eating colorful HEALTHY plate with vegetables and fruit, happy. Matches: She eats healthy food.",
  strong:
    "Strong boy easily lifting cardboard box with both hands, proud. Matches: He is strong enough to carry the box.",
  "clear-minded":
    "Student at desk fresh and alert after sleep, bright morning, focused eyes. Matches: After sleeping well, I feel clear-minded.",
  honor:
    "Children respectfully helping parents at home, warm gratitude. Matches: We honor our parents.",
  faithfulness:
    "Two loyal friends helping each other over years, linked hearts symbol. Matches: Her faithfulness to her friends was strong.",
  excel:
    "Girl at chalkboard solving math with gold star, teacher nodding. Matches: She excels in math.",
  wisdom:
    "Grandparents on sofa sharing story with grandchild, warm lamp. Matches: Grandparents often share wisdom.",
  ability:
    "Boy learning fast with books and checkmarks showing ABILITY, proud teacher. Matches: He has the ability to learn fast.",
  understand:
    "Student smiling at open textbook, lightbulb moment of UNDERSTANDING. Matches: I understand the lesson now.",
  vision:
    "Young Daniel-like figure in bed seeing peaceful glowing dream VISION above him at night. Matches: He described a vision he saw at night.",
  interpret:
    "Wise counselor explaining scroll to king in palace, pointing kindly. Matches: Can you interpret this message?",
  dream:
    "Child sleeping with soft dreamy clouds and stars above bed. Matches: I had a strange dream.",
  silent:
    "Quiet house at night, moon through window, peaceful sleep. Matches: The house was silent at night.",
  awake:
    "Child AWAKE early stretching by window, sunrise and alarm clock. Matches: I awake early every morning.",
  terror:
    "Boy startled covering ears from loud thunder outside, scared eyes. Matches: He felt terror when he heard the loud noise.",
  vivid:
    "Child imagining bright colorful scene in thought bubble from story. Matches: The story gave me a vivid picture in my mind.",
  forgotten:
    "Old keys FORGOTTEN inside dusty drawer, cobweb corner. Matches: The old keys were forgotten in a drawer.",
  waking:
    "Person just WAKING in bed reaching for glass of water on nightstand. Matches: After waking, he drank a glass of water.",
  disturbed:
    "Girl worried reading bad news letter at table, upset face. Matches: She felt disturbed by the bad news.",
  demand:
    "Teacher calmly expecting good behavior, students sitting nicely. Matches: The teacher will demand good behavior in class.",
  magician:
    "Babylonian court MAGICIAN in robes doing coin trick for king, storybook. Matches: The magician did a surprising trick.",
  astrologer:
    "Ancient ASTROLOGER in robes pointing at star chart under night sky. Matches: The astrologer talked about the stars.",
  meaning:
    "Student with dictionary and word card, curious face. Matches: What is the meaning of this word?",
  fury:
    "Angry king shouting in palace after argument, advisor stepping back. Matches: He shouted in fury after the argument.",
  decree:
    "King on throne holding royal scroll DECREEING new rule, courtiers listening. Matches: The leader will decree a new rule.",
  death:
    "Gentle life cycle: green sprout to flower to wilted petal, NO violence NO gore. Matches: The story was about life and death.",
  wise:
    "Wise grandfather with beard reading scroll, child listening. Matches: My grandfather is a wise person.",
  pray:
    "Family kneeling praying together in evening soft candle light. Matches: They pray together every evening.",
  reveal:
    "Teacher lifting cloth to REVEAL answer on board, students watching. Matches: Please reveal the answer to the question.",
  mystery:
    "Missing book with magnifying glass and question marks on desk. Matches: The missing book was a mystery.",
  stand:
    "Child STANDING politely near classroom door waiting, straight posture. Matches: Please stand near the door.",
  heaven:
    "Family looking up at beautiful starry night sky together. Matches: They looked up at the heaven at night.",
  describe:
    "Child describing favorite beach with hand gestures, thought bubble with waves. Matches: Can you describe your favorite place?",
  colossal:
    "Tiny people looking up at COLOSSAL golden statue in city square, Babylon style. Matches: They saw a colossal statue in the city.",
  statue:
    "Large stone STATUE in center of green park with pigeons. Matches: The statue is in the center of the park.",
  head:
    "Boy wearing colorful hat on his HEAD, friendly portrait. Matches: He has a hat on his head.",
  gold:
    "Shiny GOLD ring in velvet box sparkling. Matches: This ring is made of gold.",
  chest:
    "Person calm hand placed over CHEST over heart, NOT wooden treasure chest. Matches: He put his hand on his chest.",
  silver:
    "Woman wearing shiny SILVER necklace close-up sparkle. Matches: She wore a silver necklace.",
  belly:
    "Child holding full belly after meal, gentle comic expression. Matches: My belly hurts after eating too much.",
  bronze:
    "Bronze third-place medal on ribbon on sports podium. Matches: The medal was made of bronze.",
  leg:
    "Boy with bandage on LEG after running, caring parent nearby. Matches: He hurt his leg while running.",
  foot:
    "Tired FEET in sneakers resting on bench after long walk. Matches: My foot is tired after walking.",
  mix:
    "Hand stirring spoon MIXING sugar into tea cup, steam rising. Matches: Mix the sugar with the tea.",
  clay:
    "Child shaping small cup from brown CLAY at craft table. Matches: The child made a cup from clay.",
  end:
    "Movie theater audience clapping at END of film, curtains closing. Matches: At the end of the movie, everyone clapped.",
  grow:
    "Small plant GROWING bigger in pot OR problem chart growing if ignored, storybook metaphor. Matches: The problem can grow if we do nothing.",
};

export const REDO_WORDS = Object.keys(REDO_PROMPTS);

/** Same technique as daniel-batch3-prompts (flat cream flashcard). */
export const STYLE =
  "Flat minimalist 2D vector children's flashcard illustration, 1:1 square, soft warm cream off-white background, muted warm pastels (beige, soft orange, pale blue), simple dot eyes and curved mouths, rounded friendly shapes, cozy hand-drawn feel, centered composition, NO text NO letters NO words NO numbers.";
