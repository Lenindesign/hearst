import "server-only";

import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { filterExcludedStories, isExcludedContentTitle } from "@/lib/content-exclusions";
import type { LiveFeedData, LiveFeedSourceNote } from "@/lib/live-feed-types";

const PERSONALIZE_STAGE_URL = "https://personalize-stage.motortrend.com/recommendations";
const PERSONALIZE_PRODUCTION_URL = "https://personalize.motortrend.com/recommendations";

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

const lifestyleLiveBrands = [
  ["cosmopolitan", "Cosmopolitan", "cosmopolitan", "Style"],
] as const;

const autosVideoFeedBrands = [
  ["motortrend", "MotorTrend", "motortrend", "Reviews"],
  ["caranddriver", "Car and Driver", "car-and-driver", "Reviews"],
  ["delish", "Delish", "delish", "Food"],
  ["cosmopolitan", "Cosmopolitan", "cosmopolitan", "Style"],
  ["goodhousekeeping", "Good Housekeeping", "good-housekeeping", "Home"],
  ["housebeautiful", "House Beautiful", "house-beautiful", "Home"],
  ["hotrod", "HOT ROD", "hot-rod", "Cars"],
  ["countryliving", "Country Living", "country-living", "Home"],
  ["thepioneerwoman", "The Pioneer Woman", "the-pioneer-woman", "Food"],
  ["prevention", "Prevention", "prevention", "Wellness"],
  ["seventeen", "Seventeen", "seventeen", "Style"],
  ["womansday", "Woman's Day", "womans-day", "Lifestyle"],
] as const;

type PersonalizeDestination = "all" | "lifestyle" | "autos" | "flux" | "ew";

const videoRequestOptionsByBrand = {
  caranddriver: {
    useCase: "similar_items",
  },
  delish: {
    useCase: "trending_now",
  },
  cosmopolitan: {
    useCase: "trending_now",
  },
  goodhousekeeping: {
    useCase: "trending_now",
  },
  housebeautiful: {
    useCase: "trending_now",
  },
  hotrod: {
    useCase: "trending_now",
  },
  countryliving: {
    useCase: "trending_now",
  },
  thepioneerwoman: {
    useCase: "trending_now",
  },
  prevention: {
    useCase: "trending_now",
  },
  seventeen: {
    useCase: "trending_now",
  },
  womansday: {
    useCase: "trending_now",
  },
} satisfies Partial<Record<(typeof autosVideoFeedBrands)[number][0], { size?: number; useCase: string }>>;

const liveBrandSlugsByDestination: Record<PersonalizeDestination, readonly string[]> = {
  all: supportedBrands.map(([, , brandSlug]) => brandSlug),
  autos: ["car-and-driver", "motortrend", "hot-rod"],
  lifestyle: [
    "cosmopolitan",
    "delish",
    "good-housekeeping",
    "house-beautiful",
    "country-living",
    "the-pioneer-woman",
    "prevention",
    "seventeen",
    "womans-day",
  ],
  flux: ["cosmopolitan", "seventeen"],
  ew: ["prevention"],
};

const videoBrandSlugsByDestination: Record<PersonalizeDestination, readonly string[]> = {
  all: autosVideoFeedBrands.map(([, , brandSlug]) => brandSlug),
  autos: ["motortrend", "car-and-driver", "hot-rod"],
  lifestyle: [
    "cosmopolitan",
    "delish",
    "good-housekeeping",
    "house-beautiful",
    "country-living",
    "the-pioneer-woman",
    "prevention",
    "seventeen",
    "womans-day",
  ],
  flux: ["cosmopolitan", "seventeen"],
  ew: ["prevention"],
};

type SupportedPersonalizeBrand =
  | (typeof supportedBrands)[number]
  | (typeof lifestyleLiveBrands)[number]
  | (typeof autosVideoFeedBrands)[number];

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
    height?: number;
    preset_name?: string;
    width?: number;
  }>;
};

type ApiResponse = {
  data?: { recommendations?: Array<ApiRecommendation | ApiVideoRecommendation> } | null;
  error?: { detail?: string } | null;
};

const videoBrandIds = new Set(["caranddriver", "goodhousekeeping"]);

function stripHtml(value?: string | null) {
  return (value ?? "")
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
  brand: SupportedPersonalizeBrand,
  index: number,
): LifestyleRiverStory | null {
  const [, brandName, brandSlug, fallbackTopic] = brand;
  const title = stripHtml(item.title);
  const image = withProtocol(item.media?.[0]?.url ?? item.preview_image);
  if (!item.id || !title || !image || isExcludedContentTitle(title)) return null;

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

function getPreferredVideoTranscoding(item: ApiVideoRecommendation) {
  const mp4Transcodings = (item.transcodings ?? []).filter((transcoding) =>
    transcoding.full_url?.toLowerCase().includes(".mp4")
  );
  const preferredNames = ["720p", "480p", "360p", "1080p", "240p"];

  for (const name of preferredNames) {
    const match = mp4Transcodings.find((transcoding) =>
      `${transcoding.display_name ?? ""} ${transcoding.preset_name ?? ""}`.toLowerCase().includes(name)
    );
    if (match?.full_url) return match;
  }

  return mp4Transcodings[0];
}

function mapVideoRecommendation(
  item: ApiVideoRecommendation,
  brand: SupportedPersonalizeBrand,
  index: number,
): LifestyleRiverStory | null {
  const [, brandName, brandSlug, fallbackTopic] = brand;
  const title = stripHtml(item.title);
  const image = withProtocol(item.preview_image);
  const preferredTranscoding = getPreferredVideoTranscoding(item);
  const videoUrl = withProtocol(preferredTranscoding?.full_url);
  if (!item.id || !title || !image || !videoUrl || isExcludedContentTitle(title)) return null;

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
    videoWidth: preferredTranscoding?.width,
    videoHeight: preferredTranscoding?.height,
  };
}

function fallbackData({
  stories: fallbackStories = [...autosRiverStories, ...lifestyleRiverStories].slice(0, 80),
  dataSourceCopy = "the local story snapshot because the Personalize stage feed is temporarily unavailable.",
  productName,
}: {
  stories?: LifestyleRiverStory[];
  dataSourceCopy?: string;
  productName?: string;
} = {}): LiveFeedData {
  const stories = filterExcludedStories(fallbackStories);
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
    dataSourceCopy,
    fetchedAt: new Date().toISOString(),
    isFallback: true,
    productName,
  };
}

async function loadPersonalizeFeed({
  apiKey,
  endpoint,
  brands,
  videoBrandIds: allowedVideoBrandIds,
  dataSourceCopy,
  fallback,
  requestType = "all",
  useCase = "similar_items",
  size = 10,
  videoSize = 4,
  productName,
  requestOptionsByBrand,
}: {
  apiKey?: string;
  endpoint: string;
  brands: readonly SupportedPersonalizeBrand[];
  videoBrandIds: ReadonlySet<string>;
  dataSourceCopy: string;
  fallback: () => LiveFeedData;
  requestType?: "all" | "video";
  useCase?: string;
  size?: number;
  videoSize?: number;
  productName?: string;
  requestOptionsByBrand?: Partial<Record<string, { categories?: string; size?: number; useCase?: string }>>;
}): Promise<LiveFeedData> {
  if (!apiKey) return fallback();

  try {
    const results = await Promise.all(
      brands.map(async (brand) => {
        const [apiBrand] = brand;
        try {
          const fetchRecommendations = async (type: "all" | "video", requestSize: number) => {
            const brandRequestOptions = requestOptionsByBrand?.[apiBrand];
            const url = new URL(endpoint);
            url.searchParams.set("type", type);
            url.searchParams.set("brand", apiBrand);
            url.searchParams.set("size", String(brandRequestOptions?.size ?? requestSize));
            url.searchParams.set("useCase", brandRequestOptions?.useCase ?? useCase);
            url.searchParams.set("version", "1");
            if (brandRequestOptions?.categories) {
              url.searchParams.set("categories", brandRequestOptions.categories);
            }

            const response = await fetch(url, {
              headers: { accept: "application/json", "api-key": apiKey },
              next: { revalidate: 60 },
              signal: AbortSignal.timeout(8_000),
            });
            if (!response.ok) throw new Error(`Personalize returned ${response.status} for ${apiBrand} ${type}`);
            const payload = (await response.json()) as ApiResponse;
            if (payload.error) throw new Error(payload.error.detail || `Personalize failed for ${apiBrand} ${type}`);
            return payload.data?.recommendations ?? [];
          };

          if (requestType === "video") {
            const videoItems = allowedVideoBrandIds.has(apiBrand) ? await fetchRecommendations("video", size) : [];
            return { brand, items: [], videoItems };
          }

          const [items, videoItems] = await Promise.all([
            fetchRecommendations("all", size),
            allowedVideoBrandIds.has(apiBrand)
              ? fetchRecommendations("video", videoSize).catch((error) => {
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
        feedCount: requestType === "video" || !allowedVideoBrandIds.has(brand[0]) ? 1 : 2,
        importedCount: items.length + videoItems.length,
        selectedCount: mapped.length + mappedVideos.length,
      });
    });

    if (stories.length === 0) return fallback();

    return {
      stories: stories.sort((a, b) => b.popularity - a.popularity),
      sourceNotes: sourceNotes.filter((note) => note.selectedCount > 0),
      dataSourceCopy,
      fetchedAt: new Date().toISOString(),
      isFallback: false,
      productName,
    };
  } catch (error) {
    console.error("Unable to load Personalize live feed", error);
    return fallback();
  }
}

function getScopedLiveBrands({
  destination = "all",
  brandSlug,
}: {
  destination?: PersonalizeDestination;
  brandSlug?: string;
} = {}) {
  const allowedBrandSlugs = brandSlug
    ? [brandSlug]
    : liveBrandSlugsByDestination[destination] ?? liveBrandSlugsByDestination.all;

  return supportedBrands.filter(([, , liveBrandSlug]) => allowedBrandSlugs.includes(liveBrandSlug));
}

export async function getPersonalizeLiveFeed({
  destination = "all",
  brandSlug,
  sizePerBrand = 8,
  videoSizePerBrand = 2,
}: {
  destination?: PersonalizeDestination;
  brandSlug?: string;
  sizePerBrand?: number;
  videoSizePerBrand?: number;
} = {}): Promise<LiveFeedData> {
  const brands = getScopedLiveBrands({ destination, brandSlug });
  const fallbackStoryPool = destination === "autos"
    ? autosRiverStories
    : destination === "flux"
      ? fluxRiverStories
      : destination === "ew"
        ? ewRiverStories
        : destination === "lifestyle"
          ? lifestyleRiverStories
          : [...autosRiverStories, ...lifestyleRiverStories, ...fluxRiverStories, ...ewRiverStories];
  const fallbackStories = brandSlug
    ? fallbackStoryPool.filter((story) => story.brandSlug === brandSlug)
    : fallbackStoryPool.filter((story) => brands.some(([, , liveBrandSlug]) => liveBrandSlug === story.brandSlug));

  if (brands.length === 0) {
    return fallbackData({
      stories: [],
      dataSourceCopy: "the Personalize stage API, with no scoped live article brands configured for this destination yet.",
    });
  }

  return loadPersonalizeFeed({
    apiKey: process.env.PERSONALIZE_API_KEY,
    endpoint: PERSONALIZE_STAGE_URL,
    brands,
    videoBrandIds,
    size: sizePerBrand,
    videoSize: videoSizePerBrand,
    dataSourceCopy: `the Personalize stage API, scoped to ${brands.map(([, brandName]) => brandName).join(", ")} current article recommendations.`,
    fallback: () => fallbackData({
      stories: fallbackStories,
      dataSourceCopy: "the local destination snapshot because the Personalize live article feed is temporarily unavailable.",
    }),
  });
}

export async function getPersonalizeLifestyleLiveFeed(): Promise<LiveFeedData> {
  return loadPersonalizeFeed({
    apiKey: process.env.PERSONALIZE_LIFESTYLE_API_KEY,
    endpoint: PERSONALIZE_PRODUCTION_URL,
    brands: lifestyleLiveBrands,
    videoBrandIds: new Set(),
    dataSourceCopy: "the production Personalize API seeded by Cosmopolitan for a Lifestyle Live prototype.",
    fallback: () => fallbackData({
      stories: lifestyleRiverStories.filter((story) => story.brandSlug === "cosmopolitan").slice(0, 40),
      dataSourceCopy: "the local Cosmopolitan lifestyle snapshot because the production Personalize feed is temporarily unavailable.",
    }),
  });
}

function getScopedVideoBrands({
  destination = "all",
  brandSlug,
}: {
  destination?: PersonalizeDestination;
  brandSlug?: string;
} = {}) {
  const allowedBrandSlugs = brandSlug
    ? [brandSlug]
    : videoBrandSlugsByDestination[destination] ?? videoBrandSlugsByDestination.all;

  return autosVideoFeedBrands.filter(([, , videoBrandSlug]) =>
    allowedBrandSlugs.some((allowedBrandSlug) => allowedBrandSlug === videoBrandSlug)
  );
}

export async function getPersonalizeVideoFeed({
  destination = "all",
  brandSlug,
  productName,
  sizePerBrand = 6,
}: {
  destination?: PersonalizeDestination;
  brandSlug?: string;
  productName?: string;
  sizePerBrand?: number;
} = {}): Promise<LiveFeedData> {
  const brands = getScopedVideoBrands({ destination, brandSlug });
  const fallbackBrandSlugs = brands.map(([, , videoBrandSlug]) => videoBrandSlug);
  const localVideoFallbackStories = [
    ...autosRiverStories,
    ...lifestyleRiverStories,
    ...fluxRiverStories,
    ...ewRiverStories,
  ]
    .filter((story) => fallbackBrandSlugs.some((brandSlug) => brandSlug === story.brandSlug))
    .filter((story) => story.mediaKind === "video" || Boolean(story.videoUrl))
    .slice(0, 100);
  const scopedProductName = productName ?? (brandSlug
    ? `${brands[0]?.[1] ?? "Brand"} Video Feed`
    : destination === "all"
      ? "Hearst+ Videos"
      : `${destination === "ew" ? "Enthusiast & Wellness" : destination === "flux" ? "Fashion & Luxury" : destination[0].toUpperCase() + destination.slice(1)} Videos`);

  if (brands.length === 0) {
    return fallbackData({
      stories: [],
      dataSourceCopy: "the production Personalize API, with no scoped video brands configured for this destination yet.",
      productName: scopedProductName,
    });
  }

  return loadPersonalizeFeed({
    apiKey: process.env.PERSONALIZE_LIFESTYLE_API_KEY,
    endpoint: PERSONALIZE_PRODUCTION_URL,
    brands,
    videoBrandIds: new Set(brands.map(([apiBrand]) => apiBrand)),
    requestType: "video",
    useCase: "trending_now",
    size: sizePerBrand,
    requestOptionsByBrand: videoRequestOptionsByBrand,
    productName: scopedProductName,
    dataSourceCopy: `the production Personalize API, using ${brands.map(([, brandName]) => brandName).join(", ")} video recommendations.`,
    fallback: () => fallbackData({
      stories: localVideoFallbackStories,
      dataSourceCopy: "the local story snapshot because the production Personalize video feed is temporarily unavailable.",
      productName: scopedProductName,
    }),
  });
}

export async function getPersonalizeAutosVideoFeed(): Promise<LiveFeedData> {
  return getPersonalizeVideoFeed({ destination: "all", productName: "Hearst+ Videos" });
}
