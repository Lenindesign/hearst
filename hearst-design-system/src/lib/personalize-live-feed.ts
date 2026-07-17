import "server-only";

import { autosRiverStories } from "@/components/autos-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { LiveFeedData, LiveFeedSourceNote } from "@/lib/live-feed-types";

const PERSONALIZE_URL = "https://personalize-stage.motortrend.com/recommendations";

const supportedBrands = [
  ["caranddriver", "Car and Driver", "car-and-driver", "Cars"],
  ["motortrend", "MotorTrend", "motortrend", "Cars"],
  ["hotrod", "HOT ROD", "hot-rod", "Cars"],
  ["goodhousekeeping", "Good Housekeeping", "good-housekeeping", "Home"],
  ["cosmopolitan", "Cosmopolitan", "cosmopolitan", "Style"],
  ["countryliving", "Country Living", "country-living", "Home"],
  ["delish", "Delish", "delish", "Food"],
  ["housebeautiful", "House Beautiful", "house-beautiful", "Home"],
  ["thepioneerwoman", "The Pioneer Woman", "the-pioneer-woman", "Food"],
  ["prevention", "Prevention", "prevention", "Wellness"],
  ["redbookmag", "Redbook", "redbook", "Lifestyle"],
  ["seventeen", "Seventeen", "seventeen", "Style"],
  ["womansday", "Woman's Day", "womans-day", "Lifestyle"],
] as const;

type ApiRecommendation = {
  __typename?: string;
  id?: string;
  title?: string;
  media?: Array<{ url?: string }>;
  preview_image?: string;
  publish_from?: string;
  published_at?: string;
  description?: string;
  metadata?: {
    dek?: string;
    links?: { frontend?: { url?: string } };
  };
};

type ApiResponse = {
  data?: { recommendations?: ApiRecommendation[] } | null;
  error?: { detail?: string } | null;
};

function stripHtml(value = "") {
  return value
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function withProtocol(url?: string) {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function inferTopic(url: string | undefined, title: string, fallback: string) {
  const haystack = `${url ?? ""} ${title}`.toLowerCase();
  if (/recipe|food|cook|kitchen|drink/.test(haystack)) return "Food";
  if (/wellness|health|fitness|workout|nutrition/.test(haystack)) return "Wellness";
  if (/beauty|fashion|style|celebrity/.test(haystack)) return "Style";
  if (/home|decor|garden|cleaning/.test(haystack)) return "Home";
  if (/accessories|tested|best-/.test(haystack)) return "Shopping";
  if (/review|comparison|tested/.test(haystack)) return "Reviews";
  if (/news|revealed|new-/.test(haystack)) return "Cars";
  return fallback;
}

function buildTags(title: string, topic: string, brand: string) {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 6);
  return Array.from(new Set([topic.toLowerCase(), brand.toLowerCase(), ...words]));
}

function mapRecommendation(
  item: ApiRecommendation,
  brand: (typeof supportedBrands)[number],
  index: number,
): LifestyleRiverStory | null {
  const [, brandName, brandSlug, fallbackTopic] = brand;
  const title = stripHtml(item.title);
  const image = withProtocol(item.media?.[0]?.url ?? item.preview_image);
  if (!item.id || !title || !image) return null;

  const sourceUrl = withProtocol(item.metadata?.links?.frontend?.url);
  const publishedAt = item.publish_from ?? item.published_at;
  const topic = inferTopic(sourceUrl, title, fallbackTopic);
  const summary = stripHtml(item.metadata?.dek ?? item.description) || `Recommended by ${brandName}.`;
  const publishedTime = publishedAt ? new Date(publishedAt).getTime() : Date.now();
  const age = Math.max(0, Math.floor((Date.now() - publishedTime) / 86_400_000));
  const signals: LifestyleRiverStory["signal"][] = ["Most Popular", "Trending", "Editor Pick", "Continue"];

  return {
    id: `live-${brandSlug}-${item.id}`,
    brand: brandName,
    brandSlug,
    topic,
    title,
    summary,
    image,
    readTime: `${Math.max(2, Math.ceil((title.length + summary.length) / 450))} min read`,
    popularity: Math.max(1, 100 - index),
    signal: signals[index % signals.length],
    tags: buildTags(title, topic, brandName),
    age,
    publishedAt,
    sourceUrl,
  };
}

function fallbackData(): LiveFeedData {
  const stories = [...autosRiverStories, ...lifestyleRiverStories].slice(0, 80);
  const counts = new Map<string, LiveFeedSourceNote>();
  stories.forEach((story) => {
    const current = counts.get(story.brandSlug);
    if (current) {
      current.importedCount += 1;
      current.selectedCount += 1;
      return;
    }
    counts.set(story.brandSlug, {
      brand: story.brand,
      brandSlug: story.brandSlug,
      feedCount: 1,
      importedCount: 1,
      selectedCount: 1,
    });
  });

  return {
    stories,
    sourceNotes: Array.from(counts.values()),
    dataSourceCopy: "the local story snapshot because the Personalize stage feed is temporarily unavailable.",
    fetchedAt: new Date().toISOString(),
    isFallback: true,
  };
}

export async function getPersonalizeLiveFeed(): Promise<LiveFeedData> {
  const apiKey = process.env.PERSONALIZE_API_KEY;
  if (!apiKey) return fallbackData();

  try {
    const results = await Promise.all(
      supportedBrands.map(async (brand) => {
        const [apiBrand] = brand;
        try {
          const url = new URL(PERSONALIZE_URL);
          url.searchParams.set("type", "all");
          url.searchParams.set("brand", apiBrand);
          url.searchParams.set("size", "10");
          url.searchParams.set("useCase", "similar_items");
          url.searchParams.set("version", "1");

          const response = await fetch(url, {
            headers: { accept: "application/json", "api-key": apiKey },
            cache: "no-store",
            signal: AbortSignal.timeout(8_000),
          });
          if (!response.ok) throw new Error(`Personalize returned ${response.status} for ${apiBrand}`);
          const payload = (await response.json()) as ApiResponse;
          if (payload.error) throw new Error(payload.error.detail || `Personalize failed for ${apiBrand}`);
          return { brand, items: payload.data?.recommendations ?? [] };
        } catch (error) {
          console.error(`Unable to load ${apiBrand} recommendations`, error);
          return { brand, items: [] };
        }
      }),
    );

    const stories: LifestyleRiverStory[] = [];
    const sourceNotes: LiveFeedSourceNote[] = [];
    results.forEach(({ brand, items }, brandIndex) => {
      const mapped = items
        .map((item, itemIndex) => mapRecommendation(item, brand, brandIndex * 10 + itemIndex))
        .filter((story): story is LifestyleRiverStory => Boolean(story));
      stories.push(...mapped);
      sourceNotes.push({
        brand: brand[1],
        brandSlug: brand[2],
        feedCount: 1,
        importedCount: items.length,
        selectedCount: mapped.length,
      });
    });

    if (stories.length === 0) return fallbackData();

    return {
      stories: stories.sort((a, b) => b.popularity - a.popularity),
      sourceNotes: sourceNotes.filter((note) => note.selectedCount > 0),
      dataSourceCopy: "the Personalize stage API across the currently supported Autos and Lifestyle brands.",
      fetchedAt: new Date().toISOString(),
      isFallback: false,
    };
  } catch (error) {
    console.error("Unable to load Personalize live feed", error);
    return fallbackData();
  }
}
