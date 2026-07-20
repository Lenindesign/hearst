import { writeFile } from "node:fs/promises";

const TARGET_STORY_COUNT = 200;

const brands = [
  {
    brand: "Autoweek",
    brandSlug: "autoweek",
    feeds: ["https://www.autoweek.com/rss/all.xml"],
  },
  {
    brand: "Bring a Trailer",
    brandSlug: "bring-a-trailer",
    feeds: ["https://bringatrailer.com/feed/"],
  },
  {
    brand: "Car and Driver",
    brandSlug: "car-and-driver",
    feeds: ["https://www.caranddriver.com/rss/all.xml"],
  },
  {
    brand: "HOT ROD",
    brandSlug: "hot-rod",
    feeds: ["https://www.hotrod.com/rss/all.xml"],
  },
  {
    brand: "MotorTrend",
    brandSlug: "motortrend",
    pages: [
      "https://www.motortrend.com/",
      "https://www.motortrend.com/automobilemag/",
      "https://www.motortrend.com/roadkill/",
    ],
  },
  {
    brand: "Road & Track",
    brandSlug: "road-and-track",
    feeds: ["https://www.roadandtrack.com/rss/all.xml"],
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

function getAttribute(block, attribute) {
  const match = block.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function getMediaUrl(block) {
  const media = block.match(/<media:content\b[^>]*\burl="([^"]+)"/i);
  if (media?.[1]) return decodeXml(media[1]);

  const thumbnail = block.match(/<media:thumbnail\b[^>]*\burl="([^"]+)"/i);
  if (thumbnail?.[1]) return decodeXml(thumbnail[1]);

  const enclosure = block.match(/<enclosure\b[^>]*\burl="([^"]+)"/i);
  if (enclosure?.[1]) return decodeXml(enclosure[1]);

  const htmlImage = decodeXml(block).match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  return htmlImage?.[1] ? decodeXml(htmlImage[1]) : "";
}

function getMediaCredit(block) {
  return stripHtml(getTag(block, "media:credit") || getTag(block, "media:copyright"));
}

function getTopicFromUrl(url, feedUrl = "") {
  const path = new URL(url).pathname.split("/").filter(Boolean);
  const section = (path[0] || feedUrl.replace("/rss/", "").replace(".xml", "")).toLowerCase();
  const searchable = `${url} ${path.join(" ")}`.toLowerCase();

  if (/ev|electric|hybrid|charging|battery/.test(searchable)) return "EVs";
  if (/review|test|drive|comparison|long-term|first-drive|road-test/.test(searchable)) return "Reviews";
  if (/buying|buyers|best|trim|used|lease|price|deals|cost/.test(searchable)) return "Buying Guides";
  if (/racing|race|nascar|f1|formula-1|indycar|motorsport|lemans|drag/.test(searchable)) return "Racing";
  if (/truck|pickup|suv|off-road|4x4|tow/.test(searchable)) return "Trucks";
  if (/classic|archive|collector|auction|bringatrailer|barn-find|restomod|muscle/.test(searchable)) return "Classics";
  if (/auction|listing|bid|sold/.test(searchable)) return "Auctions";
  if (/hotrod|hot-rod|camaro|mustang|charger|corvette|engine|horsepower|performance/.test(searchable)) return "Performance";
  if (["news", "features", "how-to", "events"].includes(section)) {
    return section === "how-to"
      ? "Buying Guides"
      : section[0].toUpperCase() + section.slice(1).replace("-", " ");
  }

  return "News";
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

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Hearst Autos Storybook Prototype Importer" },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
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
      const topic = sourceUrl ? getTopicFromUrl(sourceUrl, feedUrl) : "News";

      if (!title || !sourceUrl || !image) return null;

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

function extractArticleUrls(html) {
  return Array.from(
    new Set(
      Array.from(html.matchAll(/href=["'](https?:\/\/www\.motortrend\.com\/[^"']+|\/[^"']+)["']/g))
        .map((match) => (match[1].startsWith("/") ? `https://www.motortrend.com${match[1]}` : match[1]))
        .filter((url) => /motortrend\.com\/(news|reviews|features|how-to|events)\//.test(url))
        .map((url) => url.split("?")[0].replace(/\/$/, ""))
    )
  );
}

function getMetaContent(html, property) {
  const tag = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]*>`, "i"))?.[0];
  return tag ? getAttribute(tag, "content") : "";
}

async function parseArticlePage(url, brand) {
  const html = await fetchText(url);
  const title =
    getMetaContent(html, "og:title") ||
    stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const summary = getMetaContent(html, "og:description");
  const image = getMetaContent(html, "og:image");
  const publishedAt = getMetaContent(html, "article:published_time") || new Date().toISOString();

  if (!title || !image) return null;

  return {
    id: makeId(brand.brandSlug, url),
    brand: brand.brand,
    brandSlug: brand.brandSlug,
    topic: getTopicFromUrl(url),
    title: title.replace(/\s*\|\s*MotorTrend\s*$/i, ""),
    summary: summary || `${brand.brand} editors recommend this autos story.`,
    image,
    imageCredit: brand.brand,
    readTime: makeReadTime(summary, title),
    publishedAt: new Date(publishedAt || Date.now()).toISOString(),
    sourceUrl: url,
  };
}

async function parsePages(pageUrls, brand) {
  const articleUrls = [];

  for (const pageUrl of pageUrls) {
    try {
      articleUrls.push(...extractArticleUrls(await fetchText(pageUrl)));
    } catch (error) {
      console.warn(`Skipped ${pageUrl}: ${error.message}`);
    }
  }

  const stories = [];
  for (const url of Array.from(new Set(articleUrls)).slice(0, 60)) {
    try {
      const story = await parseArticlePage(url, brand);
      if (story) stories.push(story);
    } catch (error) {
      console.warn(`Skipped ${url}: ${error.message}`);
    }
  }

  return stories;
}

const collected = [];
const sourceNotes = [];

for (const brand of brands) {
  const before = collected.length;

  for (const feed of brand.feeds ?? []) {
    try {
      const xml = await fetchText(feed);
      collected.push(...parseFeed(xml, feed, brand));
    } catch (error) {
      console.warn(`Skipped ${feed}: ${error.message}`);
    }
  }

  if (brand.pages?.length) {
    collected.push(...(await parsePages(brand.pages, brand)));
  }

  sourceNotes.push({
    brand: brand.brand,
    brandSlug: brand.brandSlug,
    feedCount: (brand.feeds?.length ?? 0) + (brand.pages?.length ?? 0),
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
  throw new Error(`Only imported ${deduped.length} image-backed autos stories`);
}

const generatedAt = new Date().toISOString();
const output = `// Generated by scripts/import-autos-rss.mjs on ${generatedAt}.
// Public RSS/page metadata only: titles, links, summaries, dates, and real image URLs.

import type { LifestyleRiverStory } from "./lifestyle-river-types";

export const autosRiverSourceNotes = ${JSON.stringify(enrichedSourceNotes, null, 2)} as const;

export const autosRiverStories: LifestyleRiverStory[] = ${JSON.stringify(deduped, null, 2)};
`;

await writeFile("src/components/autos-river-data.ts", output);

console.log(`Imported ${deduped.length} autos stories with real images.`);
console.table(enrichedSourceNotes);
