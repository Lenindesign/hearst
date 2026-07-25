import { autosRiverStories } from "../src/components/autos-river-data";
import { ewRiverStories } from "../src/components/ew-river-data";
import { fluxRiverStories } from "../src/components/flux-river-data";
import { lifestyleRiverStories } from "../src/components/lifestyle-river-data";
import { writeFile } from "node:fs/promises";

type Story = (typeof lifestyleRiverStories)[number];
type StorySnapshot = Pick<
  Story,
  | "id"
  | "brand"
  | "brandSlug"
  | "topic"
  | "title"
  | "summary"
  | "image"
  | "imageCredit"
  | "byline"
  | "readTime"
  | "popularity"
  | "signal"
  | "tags"
  | "age"
  | "publishedAt"
  | "sourceUrl"
  | "mediaKind"
  | "videoUrl"
  | "videoDuration"
  | "videoWidth"
  | "videoHeight"
>;
type ProductEvidence = {
  amazonUrl: string;
  label: string;
  tag: string | null;
  productImage: string;
};
type AuditResult = {
  story: Story;
  status: "checked" | "unavailable";
  products: ProductEvidence[];
};

const commerceTerms = /\b(best|review|tested|test|shopping|shop|buy|deals?|products?|gear|tools?|equipment|furniture|decor|beauty|skin|hair|makeup|cologne|fragrance|perfume|watch|tracker|headphones|earbuds|bags?|shoes?|car|bike|kitchen|cookware|cleaner|cleaning|garden|outdoor)\b/i;
const amazonProductPattern = /data-product-url="(https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10})"/g;

function createStorySnapshot(story: Story): StorySnapshot {
  return {
    id: story.id,
    brand: story.brand,
    brandSlug: story.brandSlug,
    topic: story.topic,
    title: story.title,
    summary: story.summary,
    image: story.image,
    imageCredit: story.imageCredit,
    byline: story.byline,
    readTime: story.readTime,
    popularity: story.popularity,
    signal: story.signal,
    tags: story.tags,
    age: story.age,
    publishedAt: story.publishedAt,
    sourceUrl: story.sourceUrl,
    mediaKind: story.mediaKind,
    videoUrl: story.videoUrl,
    videoDuration: story.videoDuration,
    videoWidth: story.videoWidth,
    videoHeight: story.videoHeight,
  };
}

function getProductEvidence(html: string, amazonUrl: string): ProductEvidence | null {
  const position = html.indexOf(amazonUrl);
  if (position < 0) return null;

  const context = html.slice(Math.max(0, position - 5_000), position + 8_000);
  const label = context.match(/aria-label="[^"]+ for ([^"]+)"/i)?.[1]?.replace(/&amp;/g, "&");
  const tag = context.match(/embedded-product-custom-tag[^>]*>\s*([^<]+)/i)?.[1]?.trim();
  const images = [...context.matchAll(/https?:[^"\s]+\.(?:jpg|jpeg|png)[^"\s]*/gi)]
    .map((match) => match[0].replace(/&amp;/g, "&"));
  const productImage = images.find((image) => image.includes("product-images")) ?? images[0];

  return label && productImage
    ? { amazonUrl, label, tag: tag ?? null, productImage }
    : null;
}

async function inspectStory(story: Story): Promise<AuditResult> {
  if (!story.sourceUrl) return { story, status: "unavailable", products: [] };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(story.sourceUrl, {
      headers: { "user-agent": "HearstPlusCommerceAudit/1.0" },
      signal: controller.signal,
    });
    if (!response.ok) return { story, status: "unavailable" as const, products: [] };

    const html = await response.text();
    const urls = [...new Set([...html.matchAll(amazonProductPattern)].map((match) => match[1]))];
    const products = urls
      .map((url) => getProductEvidence(html, url))
      .filter((product): product is ProductEvidence => product !== null);
    return { story, status: "checked" as const, products };
  } catch {
    return { story, status: "unavailable" as const, products: [] };
  } finally {
    clearTimeout(timeout);
  }
}

async function runPool<T, TResult>(items: T[], worker: (item: T) => Promise<TResult>, concurrency = 8) {
  const pending = [...items];
  const results: TResult[] = [];
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (pending.length) {
      const item = pending.shift();
      if (item) results.push(await worker(item));
    }
  }));
  return results;
}

async function main() {
  const allStories = [...lifestyleRiverStories, ...autosRiverStories, ...fluxRiverStories, ...ewRiverStories];
  const candidateStories = allStories.filter((story) => commerceTerms.test(`${story.title} ${story.summary} ${story.topic}`));
  const results = await runPool(candidateStories, inspectStory);
  const verified = results.filter((result) => result.status === "checked" && result.products.length > 0);
  const collections = verified.map((result) => ({
    id: `source-product-${result.story.id}`,
    storyIds: [result.story.id],
    brandSlugs: [result.story.brandSlug],
    eyebrow: "Shop the story",
    title: "Products from this guide",
    description: `Products directly linked in this ${result.story.brand} story.`,
    story: createStorySnapshot(result.story),
    products: result.products.slice(0, 3).map((product) => ({
      name: product.label,
      context: product.tag ? `${product.tag} in this guide.` : "Selected in this story.",
      imageUrl: product.productImage,
      amazonUrl: product.amazonUrl,
      sourceUrl: result.story.sourceUrl,
    })),
  }));

  if (process.argv.includes("--write")) {
    const generated = `// Generated by scripts/audit-ambient-commerce.ts. Do not edit by hand.\n\nexport type AmbientCommerceProduct = {\n  name: string;\n  context: string;\n  imageUrl: string;\n  /** A canonical, non-affiliate Amazon product page. */\n  amazonUrl: string;\n  /** The source story used to verify the product, image, and context. */\n  sourceUrl: string;\n};\n\nexport type AmbientCommerceStorySnapshot = {\n  id: string;\n  brand: string;\n  brandSlug: string;\n  topic: string;\n  title: string;\n  summary: string;\n  image: string;\n  imageCredit?: string;\n  byline?: string;\n  readTime: string;\n  popularity: number;\n  signal: \"Most Popular\" | \"Trending\" | \"Editor Pick\" | \"Continue\";\n  tags: string[];\n  age: number;\n  publishedAt?: string;\n  sourceUrl?: string;\n  mediaKind?: \"video\";\n  videoUrl?: string;\n  videoDuration?: number;\n  videoWidth?: number;\n  videoHeight?: number;\n};\n\nexport type VerifiedAmbientCommerceCollection = {\n  id: string;\n  storyIds: string[];\n  brandSlugs: string[];\n  eyebrow: string;\n  title: string;\n  description: string;\n  /** Preserved editorial metadata, retained even after a story rotates out of RSS. */\n  story: AmbientCommerceStorySnapshot;\n  products: AmbientCommerceProduct[];\n};\n\nexport const verifiedAmbientCommerceCollections: VerifiedAmbientCommerceCollection[] = ${JSON.stringify(collections, null, 2)};\n`;
    await writeFile("src/lib/ambient-commerce-catalog.generated.ts", generated);
  }

  console.log(JSON.stringify({
    inventory: allStories.length,
    keywordCandidates: candidateStories.length,
    verifiedCandidateStories: verified.length,
    generatedCollections: collections.length,
    stories: verified.map((result) => ({
      id: result.story.id,
      brand: result.story.brand,
      title: result.story.title,
      sourceUrl: result.story.sourceUrl,
      products: result.products,
    })),
  }, null, 2));
}

void main();
