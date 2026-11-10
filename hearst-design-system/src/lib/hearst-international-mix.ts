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
const CONCURRENCY = 24;
/** Per-edition RSS timeout. An edition that misses it is skipped until the next load. */
const TIMEOUT_MS = 6000;
/** A cold request answers with the editions that responded by this point; late editions join the cache. */
const RESPONSE_DEADLINE_MS = 2000;
/** Once this share of editions has settled, the stragglers get only a short grace period before the response. */
const SETTLED_SHARE = 0.9;
const STRAGGLER_GRACE_MS = 200;
const CACHE_MS = 10 * 60 * 1000;

// Held on globalThis so the page (which peeks at it) and the API route share one cache, even when the
// bundler gives each route its own copy of this module.
type MixState = { cache: { at: number; data: HearstInternationalMix } | null; pending: Promise<HearstInternationalMix> | null };
const state: MixState = ((globalThis as { __hearstInternationalMix?: MixState }).__hearstInternationalMix ??= {
  cache: null,
  pending: null,
});

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

type FeedLoader = (feed: HearstInternationalFeed) => Promise<HearstInternationalMixStory[]>;

function buildMix(results: (HearstInternationalMixStory[] | undefined)[], totalFeeds: number): HearstInternationalMix {
  const answered = Array.from(results, (stories) => stories ?? []);
  return {
    stories: mixHearstInternationalStories(answered),
    connectedFeeds: answered.filter((stories) => stories.length > 0).length,
    totalFeeds,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Read every edition in parallel. `first` resolves with the editions that have answered once 90% have
 * settled (after a short grace period) or at the response deadline, so one slow edition cannot hold the river; `complete` resolves once every edition has
 * answered or timed out, and is what the cache keeps.
 */
export function loadHearstInternationalMix(
  feeds: HearstInternationalFeed[] = hearstInternationalFeeds,
  {
    load = loadFeed,
    deadlineMs = RESPONSE_DEADLINE_MS,
    graceMs = STRAGGLER_GRACE_MS,
  }: { load?: FeedLoader; deadlineMs?: number; graceMs?: number } = {},
) {
  const results: (HearstInternationalMixStory[] | undefined)[] = new Array(feeds.length);
  let next = 0;
  let settled = 0;
  let respond: (() => void) | undefined;
  let graceTimer: ReturnType<typeof setTimeout> | undefined;
  const complete = Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, feeds.length) }, async () => {
      while (next < feeds.length) {
        const index = next;
        next += 1;
        results[index] = await load(feeds[index]).catch(() => []);
        settled += 1;
        if (!graceTimer && settled < feeds.length && settled >= Math.ceil(feeds.length * SETTLED_SHARE)) {
          graceTimer = setTimeout(() => respond?.(), graceMs);
        }
      }
    }),
  ).then(() => buildMix(results, feeds.length));
  let timer: ReturnType<typeof setTimeout> | undefined;
  const early = new Promise<HearstInternationalMix>((resolve) => {
    respond = () => resolve(buildMix(results, feeds.length));
    timer = setTimeout(respond, deadlineMs);
  });
  const first = Promise.race([complete, early]).finally(() => {
    clearTimeout(timer);
    clearTimeout(graceTimer);
  });
  return { first, complete };
}

function refresh() {
  if (state.pending) return state.pending;
  const { first, complete } = loadHearstInternationalMix();
  // Keep the deadline mix so requests that arrive before every edition answers are served at once;
  // the complete mix replaces it when the last edition answers or times out.
  state.pending = first.then((data) => {
    if (data.stories.length > 0 && !state.cache) state.cache = { at: Date.now(), data };
    return data;
  });
  void complete
    .then((data) => {
      if (data.stories.length > 0) state.cache = { at: Date.now(), data };
    })
    .finally(() => {
      state.pending = null;
    });
  return state.pending;
}

/** The cached mix, without starting a load. Lets the page render the river on first paint when it is warm. */
export function peekHearstInternationalMix(): HearstInternationalMix | null {
  return state.cache?.data ?? null;
}

/**
 * All international editions, mixed. A mix younger than 10 minutes is served from memory; an older one is
 * served immediately while a background load replaces it. A cold call waits at most for the response deadline.
 */
export async function getHearstInternationalMix(): Promise<HearstInternationalMix> {
  if (state.cache) {
    if (Date.now() - state.cache.at >= CACHE_MS) void refresh();
    return state.cache.data;
  }
  return refresh();
}
