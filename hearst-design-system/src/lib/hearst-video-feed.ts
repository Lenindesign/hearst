import "server-only";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { filterExcludedStories, isExcludedContentTitle } from "@/lib/content-exclusions";
import type { LiveFeedData, LiveFeedSourceNote } from "@/lib/live-feed-types";
import {
  getPreferredVideoTranscoding,
  getVideoTranscodingDimensions,
  type VideoTranscoding,
} from "@/lib/video-transcoding";
import { selectVideoAspectRatioQuotas } from "@/lib/video-feed-selection";

type VideoDestination = "all" | "lifestyle" | "autos" | "flux" | "ew";

const brands = [
  ["motortrend", "MotorTrend", "motortrend", "Reviews"],
  ["caranddriver", "Car and Driver", "car-and-driver", "Reviews"],
  ["hotrod", "HOT ROD", "hot-rod", "Cars"],
  ["delish", "Delish", "delish", "Food"],
  ["cosmopolitan", "Cosmopolitan", "cosmopolitan", "Style"],
  ["goodhousekeeping", "Good Housekeeping", "good-housekeeping", "Home"],
  ["housebeautiful", "House Beautiful", "house-beautiful", "Home"],
  ["countryliving", "Country Living", "country-living", "Home"],
  ["thepioneerwoman", "The Pioneer Woman", "the-pioneer-woman", "Food"],
  ["prevention", "Prevention", "prevention", "Wellness"],
  ["redbookmag", "Redbook", "redbook", "Lifestyle"],
  ["seventeen", "Seventeen", "seventeen", "Style"],
  ["womansday", "Woman's Day", "womans-day", "Lifestyle"],
] as const;

type VideoBrand = (typeof brands)[number];
type ApiVideo = {
  id?: string;
  title?: string | null;
  description?: string | null;
  preview_image?: string | null;
  published_at?: string | null;
  duration?: number;
  transcodings?: VideoTranscoding[];
};

const brandSlugsByDestination: Record<VideoDestination, readonly string[]> = {
  all: brands.map(([, , slug]) => slug),
  autos: ["motortrend", "car-and-driver", "hot-rod"],
  lifestyle: ["delish", "cosmopolitan", "good-housekeeping", "house-beautiful", "country-living", "the-pioneer-woman", "prevention", "redbook", "seventeen", "womans-day"],
  flux: ["cosmopolitan", "seventeen"],
  ew: ["prevention"],
};

function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function withProtocol(value?: string | null) {
  return value?.startsWith("//") ? `https:${value}` : value;
}

function mapVideo(item: ApiVideo, brand: VideoBrand, index: number): LifestyleRiverStory | undefined {
  const [, brandName, brandSlug, topic] = brand;
  const title = stripHtml(item.title);
  const image = withProtocol(item.preview_image);
  const transcodings = item.transcodings ?? [];
  const videoUrl = withProtocol(getPreferredVideoTranscoding(transcodings)?.full_url);
  if (!item.id || !title || !image || !videoUrl || isExcludedContentTitle(title)) return undefined;
  const duration = Math.max(1, item.duration ?? 0);
  const publishedAt = item.published_at ?? undefined;
  const dimensions = getVideoTranscodingDimensions(transcodings);
  return {
    id: `live-video-${brandSlug}-${item.id}`,
    brand: brandName,
    brandSlug,
    topic,
    title,
    summary: stripHtml(item.description) || `Watch this video from ${brandName}.`,
    image,
    readTime: `${Math.max(1, Math.ceil(duration / 60))} min watch`,
    popularity: Math.max(1, 99 - index),
    signal: index % 2 === 0 ? "Trending" : "Editor Pick",
    tags: [topic.toLowerCase(), brandName.toLowerCase(), "video"],
    age: publishedAt ? Math.max(0, Math.floor((Date.now() - Date.parse(publishedAt)) / 86_400_000)) : 0,
    publishedAt,
    mediaKind: "video",
    videoUrl,
    videoDuration: duration,
    videoWidth: dimensions?.width,
    videoHeight: dimensions?.height,
  };
}

function getScopedBrands(destination: VideoDestination, brandSlug?: string) {
  const slug = brandSlug === "pioneer-woman" ? "the-pioneer-woman" : brandSlug;
  const allowed = slug ? [slug] : brandSlugsByDestination[destination];
  return brands.filter(([, , candidate]) => allowed.includes(candidate));
}

function localPlayableFallback(brandSlugs: readonly string[]) {
  return filterExcludedStories([
    ...autosRiverStories,
    ...lifestyleRiverStories,
    ...fluxRiverStories,
    ...ewRiverStories,
  ]).filter((story) => brandSlugs.includes(story.brandSlug) && Boolean(story.videoUrl));
}

export async function getPersonalizeVideoFeed({
  destination = "all",
  brandSlug,
  productName,
  sizePerBrand = 25,
}: {
  destination?: VideoDestination;
  brandSlug?: string;
  productName?: string;
  sizePerBrand?: number;
} = {}): Promise<LiveFeedData> {
  const scopedBrands = getScopedBrands(destination, brandSlug);
  const slugList = scopedBrands.map(([, , slug]) => slug);
  const fallbackStories = localPlayableFallback(slugList);
  const scopedProductName = productName ?? (brandSlug
    ? `${scopedBrands[0]?.[1] ?? "Brand"} Video Feed`
    : destination === "all"
      ? "Hearst+ Videos"
      : `${destination === "ew" ? "Enthusiast & Wellness" : destination === "flux" ? "Fashion & Luxury" : destination[0].toUpperCase() + destination.slice(1)} Videos`);
  const apiKey = process.env.PERSONALIZE_LIFESTYLE_API_KEY;

  if (!apiKey || scopedBrands.length === 0) {
    return {
      stories: fallbackStories,
      sourceNotes: [],
      dataSourceCopy: apiKey ? "the available playable videos in the validated Hearst RSS catalog." : "the saved playable-video catalog; the video recommendation key is not configured.",
      fetchedAt: "",
      isFallback: true,
      productName: scopedProductName,
    };
  }

  const results = await Promise.all(scopedBrands.map(async (brand) => {
    const [apiBrand] = brand;
    const url = new URL("https://personalize.motortrend.com/recommendations");
    for (const [key, value] of Object.entries({ type: "video", brand: apiBrand, size: String(Math.min(25, Math.max(1, sizePerBrand))), useCase: "trending_now", version: "1" })) {
      url.searchParams.set(key, value);
    }
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "api-key": apiKey },
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) return { brand, items: [] as ApiVideo[] };
      const payload = await response.json() as { data?: { recommendations?: ApiVideo[] } | null; error?: { detail?: string } | null };
      return { brand, items: payload.error ? [] : payload.data?.recommendations ?? [] };
    } catch {
      return { brand, items: [] as ApiVideo[] };
    }
  }));

  const stories = selectVideoAspectRatioQuotas(results.flatMap(({ brand, items }) =>
    items.map((item, index) => mapVideo(item, brand, index)).filter((story): story is LifestyleRiverStory => Boolean(story))
  ));
  const sourceNotes: LiveFeedSourceNote[] = results.flatMap(({ brand, items }) => {
    const selectedCount = stories.filter((story) => story.brandSlug === brand[2]).length;
    return selectedCount ? [{ brand: brand[1], brandSlug: brand[2], feedCount: 1, importedCount: items.length, selectedCount }] : [];
  });

  return {
    stories: stories.length ? stories : fallbackStories,
    sourceNotes: stories.length ? sourceNotes : [],
    dataSourceCopy: stories.length
      ? "current playable video recommendations from the Hearst video service, scoped to this section."
      : "the saved playable-video catalog because no current video recommendations were returned.",
    fetchedAt: stories.length ? new Date().toISOString() : "",
    isFallback: stories.length === 0,
    productName: scopedProductName,
  };
}

export function getPersonalizeAutosVideoFeed(): Promise<LiveFeedData> {
  return getPersonalizeVideoFeed({ destination: "all", productName: "Hearst+ Videos" });
}
