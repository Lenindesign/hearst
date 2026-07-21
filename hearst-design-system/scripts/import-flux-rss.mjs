import { writeFile } from "node:fs/promises";

const TARGET_STORY_COUNT = 200;

const brands = [
  { brand: "Elle", brandSlug: "elle", feeds: ["https://www.elle.com/rss/all.xml"] },
  { brand: "Elle Décor", brandSlug: "elle-decor", feeds: ["https://www.elledecor.com/rss/all.xml"] },
  { brand: "Esquire", brandSlug: "esquire", feeds: ["https://www.esquire.com/rss/all.xml"] },
  { brand: "Harper's Bazaar", brandSlug: "harpers-bazaar", feeds: ["https://www.harpersbazaar.com/rss/all.xml"] },
  { brand: "Town & Country", brandSlug: "town-and-country", feeds: ["https://www.townandcountrymag.com/rss/all.xml"] },
  { brand: "Veranda", brandSlug: "veranda", feeds: ["https://www.veranda.com/rss/all.xml"] },
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
  const thumbnail = block.match(/<media:thumbnail\b[^>]*\burl="([^"]+)"/i);
  if (thumbnail?.[1]) return decodeXml(thumbnail[1]);
  const enclosure = block.match(/<enclosure\b[^>]*\burl="([^"]+)"/i);
  return enclosure?.[1] ? decodeXml(enclosure[1]) : "";
}

function getMediaCredit(block) {
  return stripHtml(getTag(block, "media:credit") || getTag(block, "media:copyright"));
}

function getTopicFromUrl(url, feedUrl) {
  const path = new URL(url).pathname.split("/").filter(Boolean);
  const feedPath = new URL(feedUrl).pathname;
  const section = (path[0] || feedPath.replace("/rss/", "").replace(".xml", "")).toLowerCase();
  const searchable = `${section} ${url}`.toLowerCase();

  if (/fashion|style|runway|street-style|trends|accessories/.test(searchable)) return "Style";
  if (/beauty|makeup|hair|skin|fragrance/.test(searchable)) return "Beauty";
  if (/home|decor|design|interior|rooms|gardens|veranda|elledecor/.test(searchable)) return "Design";
  if (/celebrity|entertainment|culture|movies|tv|music|books/.test(searchable)) return "Culture";
  if (/fashion-week|red-carpet|awards|parties|society|royals/.test(searchable)) return "Events";
  if (/shopping|products|best|gifts|sales|deals|jewelry/.test(searchable)) return "Shopping";
  if (/travel|hotels|restaurants|food|wine/.test(searchable)) return "Travel";
  if (/politics|news|features|women|opinion/.test(searchable)) return "Features";

  return section
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ") || "Culture";
}

function makeTags(story) {
  const words = `${story.topic} ${story.brand} ${story.title}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 7);

  return Array.from(new Set([
    story.topic.toLowerCase(),
    story.brand.toLowerCase(),
    ...words,
  ])).slice(0, 8);
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

function getAgeInHours(publishedAt) {
  const publishedTime = Date.parse(publishedAt ?? "");
  if (!Number.isFinite(publishedTime)) return 168;
  return Math.max(0, Math.floor((Date.now() - publishedTime) / 3_600_000));
}

function toIsoDate(value) {
  const timestamp = Date.parse(stripHtml(value));
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
}

async function fetchFeed(feedUrl) {
  const response = await fetch(feedUrl, {
    headers: { "user-agent": "Hearst Flux Storybook Prototype Importer" },
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
      const byline = stripHtml(getTag(item, "dc:creator") || getTag(item, "author")).replace(/^by\s+/i, "");
      const publishedAt = toIsoDate(getTag(item, "pubDate"));
      const topic = sourceUrl ? getTopicFromUrl(sourceUrl, feedUrl) : "Culture";

      if (!title || !sourceUrl || !image || !publishedAt) return null;

      return {
        id: makeId(brand.brandSlug, sourceUrl),
        brand: brand.brand,
        brandSlug: brand.brandSlug,
        topic,
        title,
        summary: summary || `${brand.brand} editors recommend this ${topic.toLowerCase()} story.`,
        image,
        imageCredit: getMediaCredit(item),
        byline: byline || undefined,
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

const deduped = selected.map((story, index) => ({
  ...story,
  popularity: Math.max(55, 100 - (index % 46)),
  signal: makeSignal(index),
  tags: makeTags(story),
  age: getAgeInHours(story.publishedAt),
}));

if (deduped.length < TARGET_STORY_COUNT) {
  throw new Error(`Only imported ${deduped.length} image-backed Flux stories`);
}

const generatedAt = new Date().toISOString();
const output = `// Generated by scripts/import-flux-rss.mjs on ${generatedAt}.
// Public RSS metadata only: titles, links, summaries, dates, and real image URLs.

import type { LifestyleRiverStory } from "./lifestyle-river-types";

export const fluxRiverSourceNotes = ${JSON.stringify(enrichedSourceNotes, null, 2)} as const;

export const fluxRiverStories: LifestyleRiverStory[] = ${JSON.stringify(deduped, null, 2)};
`;

await writeFile("src/components/flux-river-data.ts", output);

console.log(`Imported ${deduped.length} Flux stories with real images.`);
console.table(enrichedSourceNotes);
