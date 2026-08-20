import {
  hearstNewspaperFeeds,
  hearstNewspaperPublications,
} from "../src/lib/hearst-newspaper-feed-framework";
import {
  hearstTVFeeds,
  hearstTVStations,
} from "../src/lib/hearst-tv-feed-framework";

type FeedCheck = {
  kind: "TV" | "Newspaper";
  id: string;
  name: string;
  url: string;
};

const timeoutMs = 8000;
const configuredFeeds: FeedCheck[] = [
  ...hearstTVFeeds
    .filter((feed) => feed.enabled && /^https?:\/\//.test(feed.feedUrl))
    .map((feed) => ({
      kind: "TV" as const,
      id: feed.stationId,
      name: hearstTVStations.find((station) => station.id === feed.stationId)?.callSign ?? feed.stationId,
      url: feed.feedUrl,
    })),
  ...hearstNewspaperFeeds
    .filter((feed) => feed.enabled && /^https?:\/\//.test(feed.feedUrl))
    .map((feed) => ({
      kind: "Newspaper" as const,
      id: feed.publicationId,
      name: hearstNewspaperPublications.find((publication) => publication.id === feed.publicationId)?.publicationName ?? feed.publicationId,
      url: feed.feedUrl,
    })),
];

async function checkFeed(feed: FeedCheck) {
  try {
    const response = await fetch(feed.url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { accept: "application/rss+xml, application/xml, text/xml;q=0.9" },
    });
    if (!response.ok) return { feed, error: `HTTP ${response.status}` };

    const body = await response.text();
    const items = [...body.matchAll(/<(item|entry)\b[\s\S]*?<\/(item|entry)>/gi)];
    if (items.length === 0) return { feed, error: "no RSS/Atom items" };
    if (!/<(?:title|link)\b/i.test(items[0][0])) return { feed, error: "first item has no title/link" };
    return { feed, itemCount: items.length };
  } catch (error) {
    return { feed, error: error instanceof Error ? error.message : "fetch failed" };
  }
}

const results = await Promise.all(configuredFeeds.map(checkFeed));
const failures = results.filter((result) => "error" in result);

for (const result of results) {
  if ("error" in result) {
    console.error(`FAIL ${result.feed.kind} ${result.feed.name} (${result.feed.id}): ${result.error}`);
  } else {
    console.log(`OK   ${result.feed.kind} ${result.feed.name} (${result.feed.id}): ${result.itemCount} items`);
  }
}

console.log(`Checked ${results.length} configured local-news feeds: ${results.length - failures.length} passed, ${failures.length} failed.`);
if (failures.length > 0) process.exitCode = 1;
