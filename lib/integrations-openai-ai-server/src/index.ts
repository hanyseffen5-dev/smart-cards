export {
  GEMINI_MODEL,
  getGenAI,
  getGeminiModel,
  generateText,
  extractTextFromImage,
  extractTextFromPdf,
  translateToArabic,
  translateToArabicWithMyMemory,
  translateExampleToArabic,
} from "./client";
export {
  generateImageBuffer,
  generateWordImage,
  formatKidsEducationalPrompt,
  editImages,
} from "./image";
export type { GeneratedImage, ImageSize } from "./image";
export { batchProcess, batchProcessWithSSE, isRateLimitError, type BatchOptions } from "./batch";
