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

type ApiVideoRecommendation = {
  __typename?: "Video";
  description?: string;
  duration?: number;
  id?: string;
  preview_image?: string;
  published_at?: string;
  slug?: string;
  title?: string;
  transcodings?: Array<{
    codec?: string | null;
    display_name?: string;
    full_url?: string;
    preset_name?: string;
  }>;
};

type ApiResponse = {
  data?: { recommendations?: Array<ApiRecommendation | ApiVideoRecommendation> } | null;
  error?: { detail?: string } | null;
};

const videoBrandIds = new Set(["caranddriver", "goodhousekeeping"]);

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

function getPreferredVideoUrl(item: ApiVideoRecommendation) {
  const mp4Transcodings = (item.transcodings ?? []).filter((transcoding) =>
    transcoding.full_url?.toLowerCase().includes(".mp4")
  );
  const preferredNames = ["720p", "480p", "360p", "1080p", "240p"];

  for (const name of preferredNames) {
    const match = mp4Transcodings.find((transcoding) =>
      `${transcoding.display_name ?? ""} ${transcoding.preset_name ?? ""}`.toLowerCase().includes(name)
    );
    if (match?.full_url) return match.full_url;
  }

  return mp4Transcodings[0]?.full_url;
}

function mapVideoRecommendation(
  item: ApiVideoRecommendation,
  brand: (typeof supportedBrands)[number],
  index: number,
): LifestyleRiverStory | null {
  const [, brandName, brandSlug, fallbackTopic] = brand;
  const title = stripHtml(item.title);
  const image = withProtocol(item.preview_image);
  const videoUrl = withProtocol(getPreferredVideoUrl(item));
  if (!item.id || !title || !image || !videoUrl) return null;

  const publishedAt = item.published_at;
  const publishedTime = publishedAt ? new Date(publishedAt).getTime() : Date.now();
  const age = Math.max(0, Math.floor((Date.now() - publishedTime) / 86_400_000));
  const duration = Math.max(1, item.duration ?? 0);
  const summary = stripHtml(item.description) || `Watch this video from ${brandName}.`;

  return {
    id: `live-video-${brandSlug}-${item.id}`,
    brand: brandName,
    brandSlug,
    topic: fallbackTopic,
    title,
    summary,
    image,
    readTime: `${Math.max(1, Math.ceil(duration / 60))} min watch`,
    popularity: Math.max(1, 99 - index),
    signal: index % 2 === 0 ? "Trending" : "Editor Pick",
    tags: buildTags(title, fallbackTopic, brandName).concat("video"),
    age,
    publishedAt,
    mediaKind: "video",
    videoUrl,
    videoDuration: duration,
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
          const fetchRecommendations = async (type: "all" | "video", size: number) => {
            const url = new URL(PERSONALIZE_URL);
            url.searchParams.set("type", type);
            url.searchParams.set("brand", apiBrand);
            url.searchParams.set("size", String(size));
            url.searchParams.set("useCase", "similar_items");
            url.searchParams.set("version", "1");

            const response = await fetch(url, {
              headers: { accept: "application/json", "api-key": apiKey },
              cache: "no-store",
              signal: AbortSignal.timeout(8_000),
            });
            if (!response.ok) throw new Error(`Personalize returned ${response.status} for ${apiBrand} ${type}`);
            const payload = (await response.json()) as ApiResponse;
            if (payload.error) throw new Error(payload.error.detail || `Personalize failed for ${apiBrand} ${type}`);
            return payload.data?.recommendations ?? [];
          };

          const [items, videoItems] = await Promise.all([
            fetchRecommendations("all", 10),
            videoBrandIds.has(apiBrand)
              ? fetchRecommendations("video", 4).catch((error) => {
                  console.error(`Unable to load ${apiBrand} video recommendations`, error);
                  return [];
                })
              : Promise.resolve([]),
          ]);

          return { brand, items, videoItems };
        } catch (error) {
          console.error(`Unable to load ${apiBrand} recommendations`, error);
          return { brand, items: [], videoItems: [] };
        }
      }),
    );

    const stories: LifestyleRiverStory[] = [];
    const sourceNotes: LiveFeedSourceNote[] = [];
    results.forEach(({ brand, items, videoItems }, brandIndex) => {
      const mapped = items
        .filter((item): item is ApiRecommendation => "media" in item)
        .map((item, itemIndex) => mapRecommendation(item, brand, brandIndex * 10 + itemIndex))
        .filter((story): story is LifestyleRiverStory => Boolean(story));
      const mappedVideos = (videoItems as ApiVideoRecommendation[])
        .filter((item) => Array.isArray(item.transcodings))
        .map((item, itemIndex) => mapVideoRecommendation(item, brand, brandIndex * 10 + itemIndex))
        .filter((story): story is LifestyleRiverStory => Boolean(story));
      stories.push(...mapped, ...mappedVideos);
      sourceNotes.push({
        brand: brand[1],
        brandSlug: brand[2],
        feedCount: videoBrandIds.has(brand[0]) ? 2 : 1,
        importedCount: items.length + videoItems.length,
        selectedCount: mapped.length + mappedVideos.length,
      });
    });

    if (stories.length === 0) return fallbackData();

    return {
      stories: stories.sort((a, b) => b.popularity - a.popularity),
      sourceNotes: sourceNotes.filter((note) => note.selectedCount > 0),
      dataSourceCopy: "the Personalize stage API, including playable Hearst video, across the currently supported Autos and Lifestyle brands.",
      fetchedAt: new Date().toISOString(),
      isFallback: false,
    };
  } catch (error) {
    console.error("Unable to load Personalize live feed", error);
    return fallbackData();
  }
}
