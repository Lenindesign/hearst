import {
  getHearstInternationalFeedRssUrls,
  hearstInternationalFeeds,
  type HearstInternationalFeed,
} from "@/lib/hearst-international-feeds";
import {
  parseHearstInternationalRssItems,
  type HearstInternationalRssStory,
} from "@/lib/hearst-international-rss";

export type HearstInternationalMixStory = HearstInternationalRssStory & {
  country: string;
  feedUrl: string;
};

export type HearstInternationalMix = {
  stories: HearstInternationalMixStory[];
  connectedFeeds: number;
  totalFeeds: number;
  fetchedAt: string;
};

const PER_FEED = 6;
const MAX_STORIES = 144;
const CONCURRENCY = 12;
const TIMEOUT_MS = 6000;
const CACHE_MS = 10 * 60 * 1000;

let cache: { at: number; data: HearstInternationalMix } | null = null;
let pending: Promise<HearstInternationalMix> | null = null;

async function loadFeed(feed: HearstInternationalFeed): Promise<HearstInternationalMixStory[]> {
  for (const rssUrl of getHearstInternationalFeedRssUrls(feed)) {
    try {
      const response = await fetch(rssUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8" },
      });
      if (!response.ok) continue;
      const stories = parseHearstInternationalRssItems(await response.text(), feed.name);
      if (stories.length > 0) {
        return newestFirst(stories)
          .slice(0, PER_FEED)
          .map((story) => ({ ...story, country: feed.country, feedUrl: feed.url }));
      }
    } catch {
      // A slow or broken edition is skipped; the mix uses the editions that answered.
    }
  }
  return [];
}

function newestFirst<T extends { publishedAt: string | null }>(stories: T[]) {
  const time = (value: string | null) => (value ? Date.parse(value) || 0 : 0);
  return [...stories].sort((a, b) => time(b.publishedAt) - time(a.publishedAt));
}

/**
 * Interleave editions so the river alternates countries and brands: round r takes the r-th newest
 * story from every edition, with editions ordered so neighbouring slots come from different countries.
 */
export function mixHearstInternationalStories(perFeed: HearstInternationalMixStory[][], limit = MAX_STORIES) {
  const byCountry = new Map<string, HearstInternationalMixStory[][]>();
  for (const stories of perFeed) {
    if (stories.length === 0) continue;
    const country = stories[0].country;
    byCountry.set(country, [...(byCountry.get(country) ?? []), stories]);
  }
  const countries = [...byCountry.keys()];
  const feedOrder: HearstInternationalMixStory[][] = [];
  for (let index = 0; feedOrder.length < perFeed.filter((stories) => stories.length > 0).length; index += 1) {
    for (const country of countries) {
      const feed = byCountry.get(country)?.[index];
      if (feed) feedOrder.push(feed);
    }
  }

  const mixed: HearstInternationalMixStory[] = [];
  const seen = new Set<string>();
  for (let round = 0; round < PER_FEED && mixed.length < limit; round += 1) {
    for (const stories of feedOrder) {
      const story = stories[round];
      if (!story || seen.has(story.url)) continue;
      seen.add(story.url);
      mixed.push(story);
      if (mixed.length >= limit) break;
    }
  }
  return mixed;
}

async function loadMix(): Promise<HearstInternationalMix> {
  const results: HearstInternationalMixStory[][] = new Array(hearstInternationalFeeds.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, hearstInternationalFeeds.length) }, async () => {
      while (next < hearstInternationalFeeds.length) {
        const index = next;
        next += 1;
        results[index] = await loadFeed(hearstInternationalFeeds[index]);
      }
    }),
  );
  return {
    stories: mixHearstInternationalStories(results),
    connectedFeeds: results.filter((stories) => stories.length > 0).length,
    totalFeeds: hearstInternationalFeeds.length,
    fetchedAt: new Date().toISOString(),
  };
}

/** All international editions, mixed. Cached for 10 minutes; concurrent callers share one load. */
export async function getHearstInternationalMix(): Promise<HearstInternationalMix> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;
  pending ??= loadMix()
    .then((data) => {
      if (data.stories.length > 0) cache = { at: Date.now(), data };
      return data;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}
