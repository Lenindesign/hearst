import sharp from "sharp";
import smartcrop from "smartcrop";
import type { Crop, CropOptions } from "smartcrop";

type RatioName = "16:9" | "4:3" | "1:1" | "4:5" | "3:4";

interface LoadedImage {
  source: string;
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

interface RawImage {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

interface CropBoost {
  x: number;
  y: number;
  width: number;
  height: number;
  weight: number;
}

const HIPS_BASE = "https://hips.hearstapps.com/hmg-prod/images/";
const RATIO_TARGETS: Record<RatioName, { width: number; height: number }> = {
  "16:9": { width: 16, height: 9 },
  "4:3": { width: 4, height: 3 },
  "1:1": { width: 1, height: 1 },
  "4:5": { width: 4, height: 5 },
  "3:4": { width: 3, height: 4 },
};

function usage() {
  console.log(`Usage:
  npm run editorial:crops -- --image <hearst-image-id-or-url> [--ratio 16:9] [--boost x,y,w,h,weight]

Examples:
  npm run editorial:crops -- --image taylor-swift.jpg --ratio 16:9
  npm run editorial:crops -- --image https://hips.hearstapps.com/hmg-prod/images/example.jpg --ratio 4:5

Notes:
  - This is a preflight suggestion tool, not a browser runtime dependency.
  - Use --boost with face/person boxes from a detector or manual review to keep subjects protected.
`);
}

function parseArgs(argv: string[]) {
  const images: string[] = [];
  const boosts: CropBoost[] = [];
  let ratio: RatioName = "16:9";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];

    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }

    if (arg === "--image" && value) {
      images.push(value);
      index += 1;
      continue;
    }

    if (arg === "--ratio" && value) {
      if (!(value in RATIO_TARGETS)) {
        throw new Error(`Unsupported ratio "${value}". Use one of: ${Object.keys(RATIO_TARGETS).join(", ")}`);
      }
      ratio = value as RatioName;
      index += 1;
      continue;
    }

    if (arg === "--boost" && value) {
      const [x, y, width, height, weight = 1] = value.split(",").map(Number);
      if ([x, y, width, height, weight].some((part) => Number.isNaN(part))) {
        throw new Error(`Invalid boost "${value}". Expected x,y,width,height,weight.`);
      }
      boosts.push({ x, y, width, height, weight });
      index += 1;
      continue;
    }
  }

  if (images.length === 0) {
    usage();
    throw new Error("At least one --image is required.");
  }

  return { boosts, images, ratio };
}

function toImageUrl(source: string) {
  if (/^https?:\/\//.test(source)) return source;
  return `${HIPS_BASE}${source}`;
}

async function loadImage(source: string): Promise<LoadedImage> {
  const imageUrl = toImageUrl(source);
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Could not fetch ${imageUrl}: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const raw = await sharp(Buffer.from(arrayBuffer))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    source,
    width: raw.info.width,
    height: raw.info.height,
    data: new Uint8ClampedArray(raw.data),
  };
}

function imageOperations() {
  return {
    open: (image: RawImage) => Promise.resolve(image),
    resample: async (image: RawImage, width: number, height: number): Promise<RawImage> => {
      const raw = await sharp(Buffer.from(image.data), {
        raw: { width: image.width, height: image.height, channels: 4 },
      })
        .resize(Math.round(width), Math.round(height))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      return {
        width: raw.info.width,
        height: raw.info.height,
        data: new Uint8ClampedArray(raw.data),
      };
    },
    getData: (image: RawImage) => Promise.resolve(image),
  };
}

function round(value: number, precision = 4) {
  return Number(value.toFixed(precision));
}

function cropQuery(crop: Crop, image: LoadedImage) {
  const width = round(crop.width / image.width);
  const height = round(crop.height / image.height);
  const x = round(crop.x / image.width);
  const y = round(crop.y / image.height);
  return `crop=${width}xw:${height}xh;${x}xw,${y}xh&resize=1400:*`;
}

function objectPosition(crop: Crop, image: LoadedImage) {
  const x = round(((crop.x + crop.width / 2) / image.width) * 100, 1);
  const y = round(((crop.y + crop.height / 2) / image.height) * 100, 1);
  return `${x}% ${y}%`;
}

async function suggestCrop(image: LoadedImage, ratio: RatioName, boosts: CropBoost[]) {
  const target = RATIO_TARGETS[ratio];
  const result = await smartcrop.crop(image as unknown as CanvasImageSource, {
    ...target,
    boost: boosts,
    imageOperations: imageOperations(),
    minScale: 0.88,
  } as CropOptions & { imageOperations: ReturnType<typeof imageOperations> });

  return {
    source: image.source,
    original: { width: image.width, height: image.height },
    ratio,
    topCrop: result.topCrop,
    objectPosition: objectPosition(result.topCrop, image),
    hipsQuery: cropQuery(result.topCrop, image),
    reviewNote:
      boosts.length > 0
        ? "Boost regions were included. Confirm the crop against the intended face/person/product before publishing."
        : "No face/person detector was used. Treat this as a composition suggestion, then add boosts or manual imagePosition for people-led images.",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const suggestions = [];

  for (const imageSource of args.images) {
    const image = await loadImage(imageSource);
    suggestions.push(await suggestCrop(image, args.ratio, args.boosts));
  }

  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), suggestions }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
