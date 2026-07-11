import { writeFile } from "node:fs/promises";

const TARGET_STORY_COUNT = 200;

const brands = [
  {
    brand: "Cosmopolitan",
    brandSlug: "cosmopolitan",
    feeds: ["https://www.cosmopolitan.com/rss/all.xml"],
  },
  {
    brand: "Country Living",
    brandSlug: "country-living",
    feeds: ["https://www.countryliving.com/rss/all.xml"],
  },
  {
    brand: "Delish",
    brandSlug: "delish",
    feeds: ["https://www.delish.com/rss/all.xml"],
  },
  {
    brand: "Good Housekeeping",
    brandSlug: "good-housekeeping",
    feeds: [
      "https://www.goodhousekeeping.com/rss/all.xml",
      "https://www.goodhousekeeping.com/rss/beauty.xml",
      "https://www.goodhousekeeping.com/rss/food-recipes.xml",
      "https://www.goodhousekeeping.com/rss/health.xml",
      "https://www.goodhousekeeping.com/rss/holidays.xml",
      "https://www.goodhousekeeping.com/rss/home.xml",
      "https://www.goodhousekeeping.com/rss/life.xml",
    ],
  },
  {
    brand: "House Beautiful",
    brandSlug: "house-beautiful",
    feeds: ["https://www.housebeautiful.com/rss/all.xml"],
  },
  {
    brand: "The Pioneer Woman",
    brandSlug: "pioneer-woman",
    feeds: ["https://www.thepioneerwoman.com/rss/all.xml"],
  },
  {
    brand: "Prevention",
    brandSlug: "prevention",
    feeds: ["https://www.prevention.com/rss/all.xml"],
  },
  {
    brand: "Redbook",
    brandSlug: "redbook",
    feeds: ["https://www.redbookmag.com/rss/all.xml"],
  },
  {
    brand: "Seventeen",
    brandSlug: "seventeen",
    feeds: [
      "https://www.seventeen.com/rss/all.xml",
      "https://www.seventeen.com/rss/celebrity.xml",
    ],
  },
  {
    brand: "Woman's Day",
    brandSlug: "womans-day",
    feeds: [
      "https://www.womansday.com/rss/all.xml",
      "https://www.womansday.com/rss/life.xml",
    ],
  },
];

function decodeXml(value = "") {
  return value
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function stripHtml(value = "") {
  return decodeXml(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function getMediaUrl(block) {
  const media = block.match(/<media:content\b[^>]*\burl="([^"]+)"/i);
  if (media?.[1]) return decodeXml(media[1]);
  const enclosure = block.match(/<enclosure\b[^>]*\burl="([^"]+)"/i);
  return enclosure?.[1] ? decodeXml(enclosure[1]) : "";
}

function getMediaCredit(block) {
  return stripHtml(getTag(block, "media:credit") || getTag(block, "media:copyright"));
}

function getTopicFromUrl(url, feedUrl) {
  const path = new URL(url).pathname.split("/").filter(Boolean);
  const feedPath = new URL(feedUrl).pathname;
  const section = path[0] || feedPath.replace("/rss/", "").replace(".xml", "");
  const normalized = section.toLowerCase();

  if (["food", "food-recipes", "recipes", "cooking"].includes(normalized)) return "Food";
  if (["home", "home-design", "design-inspiration", "room-decorating", "gardening"].includes(normalized)) return "Home";
  if (["health", "health-fitness", "fitness", "wellness", "mind-body"].includes(normalized)) return "Wellness";
  if (["beauty", "style", "fashion", "beauty-style"].includes(normalized)) return "Style";
  if (["shopping", "products", "best-products", "life"].includes(normalized)) return "Shopping";
  if (["celebrity", "entertainment", "news", "culture"].includes(normalized)) return "Entertainment";
  if (["relationships", "love-sex", "sex-love", "life-love"].includes(normalized)) return "Relationships";
  if (["holidays", "christmas", "halloween", "crafts"].includes(normalized)) return "Family";
  if (["travel", "travel-tips"].includes(normalized)) return "Travel";

  return section
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ") || "Lifestyle";
}

function makeTags(story) {
  const words = `${story.topic} ${story.title}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 5);

  return Array.from(new Set([
    story.topic.toLowerCase(),
    story.brand.toLowerCase(),
    ...words,
  ])).slice(0, 6);
}

function makeId(brandSlug, url) {
  const path = new URL(url).pathname
    .replace(/^\/|\/$/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${brandSlug}-${path}`.toLowerCase();
}

function makeReadTime(summary, title) {
  const words = `${title} ${summary}`.split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.min(9, Math.round(words / 45) + 3))} min read`;
}

function makeSignal(index) {
  return ["Most Popular", "Trending", "Editor Pick", "Continue"][index % 4];
}

async function fetchFeed(feedUrl) {
  const response = await fetch(feedUrl, {
    headers: { "user-agent": "Hearst Design System Storybook Prototype Importer" },
  });
  if (!response.ok) throw new Error(`${response.status} ${feedUrl}`);
  return response.text();
}

function parseFeed(xml, feedUrl, brand) {
  return Array.from(xml.matchAll(/<item\b[\s\S]*?<\/item>/gi))
    .map((match) => match[0])
    .map((item) => {
      const title = stripHtml(getTag(item, "title"));
      const sourceUrl = stripHtml(getTag(item, "link"));
      const summary = stripHtml(getTag(item, "description"));
      const image = getMediaUrl(item);
      const publishedAt = new Date(stripHtml(getTag(item, "pubDate")) || Date.now()).toISOString();
      const topic = sourceUrl ? getTopicFromUrl(sourceUrl, feedUrl) : "Lifestyle";

      if (!title || !sourceUrl || !image || !image.includes("hearstapps.com")) return null;

      return {
        id: makeId(brand.brandSlug, sourceUrl),
        brand: brand.brand,
        brandSlug: brand.brandSlug,
        topic,
        title,
        summary: summary || `${brand.brand} editors recommend this ${topic.toLowerCase()} story.`,
        image,
        imageCredit: getMediaCredit(item),
        readTime: makeReadTime(summary, title),
        publishedAt,
        sourceUrl,
      };
    })
    .filter(Boolean);
}

const collected = [];
const sourceNotes = [];

for (const brand of brands) {
  const before = collected.length;

  for (const feed of brand.feeds) {
    try {
      const xml = await fetchFeed(feed);
      collected.push(...parseFeed(xml, feed, brand));
    } catch (error) {
      console.warn(`Skipped ${feed}: ${error.message}`);
    }
  }

  sourceNotes.push({
    brand: brand.brand,
    brandSlug: brand.brandSlug,
    feedCount: brand.feeds.length,
    importedCount: collected.length - before,
  });
}

const dedupedByUrl = Array.from(
  new Map(collected.map((story) => [story.sourceUrl, story])).values()
)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

const byBrand = dedupedByUrl.reduce((acc, story) => {
  acc.set(story.brandSlug, [...(acc.get(story.brandSlug) ?? []), story]);
  return acc;
}, new Map());

const activeBrandSlugs = brands
  .map((brand) => brand.brandSlug)
  .filter((brandSlug) => (byBrand.get(brandSlug)?.length ?? 0) > 0);
const selected = [];
const selectedUrls = new Set();
let round = 0;

while (
  selected.length < TARGET_STORY_COUNT &&
  activeBrandSlugs.some((brandSlug) => round < (byBrand.get(brandSlug)?.length ?? 0))
) {
  for (const brandSlug of activeBrandSlugs) {
    const story = byBrand.get(brandSlug)?.[round];
    if (story && !selectedUrls.has(story.sourceUrl)) {
      selected.push(story);
      selectedUrls.add(story.sourceUrl);
    }

    if (selected.length >= TARGET_STORY_COUNT) break;
  }

  round += 1;
}

const selectedCounts = selected.reduce((acc, story) => {
  acc[story.brandSlug] = (acc[story.brandSlug] ?? 0) + 1;
  return acc;
}, {});

const enrichedSourceNotes = sourceNotes.map((note) => ({
  ...note,
  selectedCount: selectedCounts[note.brandSlug] ?? 0,
}));

const deduped = selected
  .map((story, index) => ({
    ...story,
    popularity: Math.max(55, 100 - (index % 46)),
    signal: makeSignal(index),
    tags: makeTags(story),
    age: index + 1,
  }));

if (deduped.length < TARGET_STORY_COUNT) {
  throw new Error(`Only imported ${deduped.length} image-backed stories`);
}

const generatedAt = new Date().toISOString();
const output = `// Generated by scripts/import-lifestyle-rss.mjs on ${generatedAt}.
// Public RSS metadata only: titles, links, summaries, dates, and real Hearst CDN image URLs.

import type { LifestyleRiverStory } from "./lifestyle-river-types";

export const lifestyleRiverSourceNotes = ${JSON.stringify(enrichedSourceNotes, null, 2)} as const;

export const lifestyleRiverStories: LifestyleRiverStory[] = ${JSON.stringify(deduped, null, 2)};
`;

await writeFile("src/components/lifestyle-river-data.ts", output);

console.log(`Imported ${deduped.length} stories with real Hearst CDN images.`);
console.table(enrichedSourceNotes);
