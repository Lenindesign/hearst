import { readFile, writeFile } from "node:fs/promises";

const files = [
  { path: "src/components/lifestyle-river-data.ts", exportName: "lifestyleRiverStories" },
  { path: "src/components/autos-river-data.ts", exportName: "autosRiverStories" },
  { path: "src/components/flux-river-data.ts", exportName: "fluxRiverStories" },
  { path: "src/components/ew-river-data.ts", exportName: "ewRiverStories" },
];

const userAgent = "Mozilla/5.0 (compatible; HearstPrototypeBylineFetcher/1.0)";
const concurrency = 8;

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function cleanByline(value = "") {
  return decodeHtml(String(value))
    .replace(/^by\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function authorToString(author) {
  if (!author) return "";
  if (typeof author === "string") return cleanByline(author);
  if (Array.isArray(author)) {
    return author
      .map(authorToString)
      .filter(Boolean)
      .join(", ");
  }
  if (typeof author === "object") {
    return cleanByline(author.name || author.givenName || "");
  }
  return "";
}

function walkJsonLd(value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    for (const item of value) {
      const byline = walkJsonLd(item);
      if (byline) return byline;
    }
    return "";
  }
  if (typeof value !== "object") return "";

  const type = Array.isArray(value["@type"]) ? value["@type"].join(" ") : value["@type"];
  if (typeof type === "string" && /Article|NewsArticle|BlogPosting/i.test(type)) {
    const byline = authorToString(value.author || value.creator);
    if (byline) return byline;
  }

  if (value["@graph"]) return walkJsonLd(value["@graph"]);
  return "";
}

function extractByline(html) {
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const byline = walkJsonLd(parsed);
      if (byline) return byline;
    } catch {
      // Keep trying other metadata blocks.
    }
  }

  const metaPatterns = [
    /<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']author["'][^>]*>/i,
    /<meta[^>]+name=["']parsely-author["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+property=["']article:author["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  ];

  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    const byline = cleanByline(match?.[1] || "");
    if (byline) return byline;
  }

  return "";
}

function extractStories(source, exportName) {
  const pattern = new RegExp(`export const ${exportName}: LifestyleRiverStory\\[] = ([\\s\\S]*?)\\n\\];`);
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not find ${exportName}`);
  return JSON.parse(`${match[1]}\n]`);
}

async function fetchByline(story) {
  if (!story.sourceUrl) return "";

  try {
    const response = await fetch(story.sourceUrl, {
      headers: { "user-agent": userAgent },
      redirect: "follow",
    });
    if (!response.ok) return "";
    const html = await response.text();
    return extractByline(html);
  } catch {
    return "";
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await mapper(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function upsertByline(source, story, byline) {
  const idNeedle = `"id": ${JSON.stringify(story.id)}`;
  const idIndex = source.indexOf(idNeedle);
  if (idIndex === -1) return source;

  const start = source.lastIndexOf("\n  {", idIndex);
  const end = source.indexOf("\n  }", idIndex);
  if (start === -1 || end === -1) return source;

  const before = source.slice(0, start);
  let block = source.slice(start, end + 5);
  const after = source.slice(end + 5);
  const line = `    "byline": ${JSON.stringify(byline)},`;

  if (/^\s+"byline":/m.test(block)) {
    block = block.replace(/^\s+"byline":\s*"[^"]*",/m, line);
  } else if (/^\s+"imageCredit":/m.test(block)) {
    block = block.replace(/^(\s+"imageCredit":\s*"[^"]*",)$/m, `$1\n${line}`);
  } else {
    block = block.replace(/^(\s+"image":\s*"[^"]*",)$/m, `$1\n${line}`);
  }

  return `${before}${block}${after}`;
}

let totalFetched = 0;
let totalUpdated = 0;

for (const file of files) {
  let source = await readFile(file.path, "utf8");
  const stories = extractStories(source, file.exportName);
  const missing = stories.filter((story) => story.sourceUrl && !story.byline);

  console.log(`${file.path}: ${missing.length} stories need bylines`);

  const enriched = await mapLimit(missing, concurrency, async (story, index) => {
    const byline = await fetchByline(story);
    totalFetched += 1;
    if ((index + 1) % 25 === 0 || index + 1 === missing.length) {
      console.log(`  fetched ${index + 1}/${missing.length}`);
    }
    return { story, byline };
  });

  let updated = 0;
  for (const { story, byline } of enriched) {
    if (!byline) continue;
    source = upsertByline(source, story, byline);
    updated += 1;
  }

  if (updated > 0) await writeFile(file.path, source);
  totalUpdated += updated;
  console.log(`${file.path}: added ${updated} bylines`);
}

console.log(`Fetched ${totalFetched} pages. Added ${totalUpdated} bylines.`);
