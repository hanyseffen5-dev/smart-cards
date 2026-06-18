import sharp from "sharp";

const MIN_ASPECT_FOR_CROP = 1.15;
const MIN_ORANGE_RUN = 8;

function isOrangePixel(r, g, b) {
  return r > 190 && g > 100 && g < 200 && b < 140 && r - b > 80;
}

async function detectIllustrationBoundary(buffer) {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const { width, height } = meta;
  if (width / height < MIN_ASPECT_FOR_CROP) return null;

  const raw = await image.raw().toBuffer();
  const channels = meta.channels || 3;

  function columnOrangeRatio(x) {
    let orangeCount = 0;
    const sampleStep = Math.max(1, Math.floor(height / 60));
    let samples = 0;
    for (let y = Math.floor(height * 0.08); y < Math.floor(height * 0.92); y += sampleStep) {
      const idx = (y * width + x) * channels;
      if (isOrangePixel(raw[idx], raw[idx + 1], raw[idx + 2])) orangeCount++;
      samples++;
    }
    return orangeCount / samples;
  }

  const ratios = Array.from({ length: width }, (_, x) => columnOrangeRatio(x));

  // Orange text panel is a contiguous block on the right edge.
  let orangeFromRight = 0;
  for (let x = width - 1; x >= 0; x--) {
    if (ratios[x] > 0.5) orangeFromRight++;
    else break;
  }

  let boundary = null;
  if (orangeFromRight >= 10) {
    boundary = width - orangeFromRight;
  }

  // Full composite: orange panel begins after illustration (sustained run from the left).
  if (boundary === null) {
    let run = 0;
    for (let x = 0; x < width; x++) {
      if (ratios[x] > 0.55) {
        run++;
        if (run >= MIN_ORANGE_RUN) {
          boundary = x - run;
          break;
        }
      } else {
        run = 0;
      }
    }
  }

  if (boundary === null) return Math.floor(width * 0.72);

  const pad = Math.max(4, Math.floor(width * 0.01));
  boundary = Math.max(10, boundary - pad);

  // On wide composites the illustration is usually the left ~35–45%.
  const minWidth = width >= 700 ? Math.floor(width * 0.32) : Math.floor(width * 0.48);
  return Math.max(minWidth, Math.min(boundary, Math.floor(width * 0.85)));
}

export async function cropIllustrationFromFile(filePath) {
  const buffer = await sharp(filePath).png().toBuffer();
  return cropIllustrationFromBuffer(buffer);
}

export async function cropIllustrationFromBuffer(buffer) {
  const boundary = await detectIllustrationBoundary(buffer);
  if (boundary === null) return buffer;

  const meta = await sharp(buffer).metadata();
  if (boundary >= meta.width - 4) return buffer;

  return sharp(buffer)
    .extract({ left: 0, top: 0, width: boundary, height: meta.height })
    .png()
    .toBuffer();
}

export function bufferToDataUrl(pngBuffer) {
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}
