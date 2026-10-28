import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstLiveArticle } from "@/lib/hearst-live-article";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { LiveArticleData, LiveFeedData } from "@/lib/live-feed-types";
import {
  getHearstInternationalFeedForStoryUrl,
  getHearstInternationalFeedRssUrls,
  getHearstInternationalFeedBrandSlug,
  hearstInternationalCountryNames,
} from "@/lib/hearst-international-feeds";
import { parseHearstInternationalRssItems } from "@/lib/hearst-international-rss";
import { getHearstBrandSection, hearstSectionThemeSlugs } from "@/lib/hearst-routes";
import {
  getPersonalizeLifestyleLiveFeed,
  getPersonalizeLiveFeed,
  getPersonalizeVideoFeed,
} from "@/lib/personalize-live-feed";
import {
  getHearstStoryReturnHref,
  normalizeReaderReturnHref,
} from "@/lib/story-routes";
import {
  getStaticHearstArticleParams,
  getStaticHearstStoryById,
} from "@/lib/hearst-static-stories";

type ReaderArticlePageProps = {
  params: Promise<{ storyId: string }>;
  searchParams?: Promise<{ ambient?: string | string[]; from?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getStaticHearstArticleParams();
}

function findLiveStory(data: LiveFeedData | undefined, storyId: string) {
  return data?.stories.find((story) => story.id === storyId);
}

const liveStoryBrandSlugs = [
  "the-pioneer-woman",
  "good-housekeeping",
  "house-beautiful",
  "country-living",
  "car-and-driver",
  "womans-day",
  "cosmopolitan",
  "popular-mechanics",
  "harpers-bazaar",
  "motortrend",
  "prevention",
  "seventeen",
  "redbook",
  "hot-rod",
] as const;

function getLiveStoryBrandSlug(storyId: string) {
  const liveId = storyId
    .replace(/^live-video-/, "")
    .replace(/^live-/, "");
  return liveStoryBrandSlugs.find((brandSlug) => liveId.startsWith(`${brandSlug}-`));
}

function normalizeStoryUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`.toLowerCase();
  } catch {
    return value;
  }
}

function titleFromStoryUrl(sourceUrl: string) {
  const slug = new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1) ?? "Hearst story";
  return decodeURIComponent(slug)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

async function getInternationalReaderStory(storyId: string): Promise<LifestyleRiverStory | undefined> {
  const prefix = "international-";
  if (!storyId.startsWith(prefix)) return undefined;

  const sourceUrl = storyId.slice(prefix.length);
  const feed = getHearstInternationalFeedForStoryUrl(sourceUrl);
  if (!feed) return undefined;
  const country = hearstInternationalCountryNames[feed.country] ?? feed.country;

  for (const rssUrl of getHearstInternationalFeedRssUrls(feed)) {
    try {
      const response = await fetch(rssUrl, {
        headers: { accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8" },
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) continue;

      const rssStory = parseHearstInternationalRssItems(await response.text(), feed.name)
        .find((candidate) => normalizeStoryUrl(candidate.url) === normalizeStoryUrl(sourceUrl));
      if (!rssStory) continue;

      return {
        id: `international-${encodeURIComponent(rssStory.url)}`,
        brand: feed.name,
        brandSlug: getHearstInternationalFeedBrandSlug(feed),
        topic: "For You",
        title: rssStory.title,
        summary: rssStory.description,
        image: rssStory.imageUrl ?? "",
        byline: `${feed.name} official edition`,
        readTime: "Source",
        popularity: 80,
        signal: "Trending",
        tags: [feed.name, country, "International"],
        age: 0,
        publishedAt: rssStory.publishedAt ?? undefined,
        sourceUrl: rssStory.url,
      };
    } catch {
      // Try the next configured RSS endpoint for this edition.
    }
  }

  // Keep the source story readable if its edition feed is temporarily unavailable
  // or no longer includes the item. The article reader can still resolve its metadata.
  return {
    id: `international-${encodeURIComponent(sourceUrl)}`,
    brand: feed.name,
    brandSlug: getHearstInternationalFeedBrandSlug(feed),
    topic: "For You",
    title: titleFromStoryUrl(sourceUrl),
    summary: `Continue to the original ${feed.name} story.`,
    image: "",
    byline: `${feed.name} official edition`,
    readTime: "Source",
    popularity: 80,
    signal: "Trending",
    tags: [feed.name, country, "International"],
    age: 0,
    sourceUrl,
  };
}

function buildStaticReaderFeed(
  story: NonNullable<ReturnType<typeof getStaticHearstStoryById>>,
  staticData: ReturnType<typeof getHearstDestinationStaticData>,
): LiveFeedData {
  const section = getHearstBrandSection(story.brandSlug);
  const stories = [
    story,
    ...staticData[section].stories.filter((candidate) => candidate.id !== story.id),
  ];

  return {
    stories,
    sourceNotes: staticData[section].sourceNotes.map((note) => ({ ...note })),
    dataSourceCopy: "a compact local story queue for fast reader startup.",
    fetchedAt: new Date().toISOString(),
    isFallback: true,
    productName: "Hearst story reader",
  };
}

async function safeLiveFeed(fetcher: () => Promise<LiveFeedData>) {
  try {
    return await fetcher();
  } catch {
    return undefined;
  }
}

async function safeLiveArticle(sourceUrl: string | undefined): Promise<LiveArticleData | undefined> {
  if (!sourceUrl) return undefined;

  try {
    return await getHearstLiveArticle(sourceUrl);
  } catch {
    return undefined;
  }
}

function getReaderReturnHrefFromSearchParams(searchParams?: { from?: string | string[] }) {
  const from = Array.isArray(searchParams?.from) ? searchParams?.from[0] : searchParams?.from;
  return normalizeReaderReturnHref(from);
}

function shouldOpenAmbientReaderFromSearchParams(searchParams?: { ambient?: string | string[] }) {
  const ambient = Array.isArray(searchParams?.ambient) ? searchParams?.ambient[0] : searchParams?.ambient;
  return ambient === "1" || ambient === "true";
}

function decodeReaderStoryId(value: string) {
  let decoded = decodeURIComponent(value);
  if (decoded.startsWith("international-")) {
    const sourceUrl = decoded.slice("international-".length);
    try {
      new URL(sourceUrl);
    } catch {
      try {
        decoded = decodeURIComponent(decoded);
      } catch {
        return decoded;
      }
    }
  }
  return decoded;
}

export async function generateMetadata({ params }: ReaderArticlePageProps): Promise<Metadata> {
  const { storyId } = await params;
  const story = getStaticHearstStoryById(storyId);

  return {
    title: story ? `${story.title} | Hearst+` : "Hearst story",
    description: story?.summary ?? "A Hearst personalized reader story.",
    openGraph: {
      title: story ? `${story.title} | Hearst+` : "Hearst story",
      description: story?.summary ?? "A Hearst personalized reader story.",
      images: [{ url: `/read/${encodeURIComponent(storyId)}/opengraph-image/`, width: 1200, height: 630, alt: story?.title ?? "Hearst story" }],
    },
    twitter: {
      card: "summary_large_image",
      title: story ? `${story.title} | Hearst+` : "Hearst story",
      description: story?.summary ?? "A Hearst personalized reader story.",
      images: [`/read/${encodeURIComponent(storyId)}/opengraph-image/`],
    },
  };
}

export default async function ReaderArticlePage({ params, searchParams }: ReaderArticlePageProps) {
  const { storyId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const decodedStoryId = decodeReaderStoryId(storyId);

  const staticStory = getStaticHearstStoryById(decodedStoryId);
  const internationalStory = staticStory ? undefined : await getInternationalReaderStory(decodedStoryId);
  const staticDestinationData = getHearstDestinationStaticData({ storyLimitPerDestination: 12 });
  const requestedBrandSlug = staticStory?.brandSlug ?? internationalStory?.brandSlug ?? getLiveStoryBrandSlug(decodedStoryId);
  const requestedSection = requestedBrandSlug ? getHearstBrandSection(requestedBrandSlug) : "all";
  const isVideoStory = decodedStoryId.startsWith("live-video-");
  let liveFeedData: LiveFeedData | undefined;
  let lifestyleLiveFeedData: LiveFeedData | undefined;
  let videoFeedData: LiveFeedData | undefined;

  if (staticStory) {
    liveFeedData = buildStaticReaderFeed(staticStory, staticDestinationData);
  } else if (internationalStory) {
    liveFeedData = {
      stories: [internationalStory],
      sourceNotes: [],
      dataSourceCopy: "the official Hearst international edition RSS feed.",
      fetchedAt: new Date().toISOString(),
      isFallback: false,
      productName: "Hearst International",
    };
  } else if (requestedBrandSlug && isVideoStory) {
    videoFeedData = await safeLiveFeed(() => getPersonalizeVideoFeed({
      destination: requestedSection,
      brandSlug: requestedBrandSlug,
    }));
  } else if (requestedBrandSlug) {
    [liveFeedData, lifestyleLiveFeedData] = await Promise.all([
      safeLiveFeed(() => getPersonalizeLiveFeed({
        destination: requestedSection,
        brandSlug: requestedBrandSlug,
      })),
      requestedBrandSlug === "cosmopolitan"
        ? safeLiveFeed(getPersonalizeLifestyleLiveFeed)
        : Promise.resolve(undefined),
    ]);
  } else {
    [liveFeedData, lifestyleLiveFeedData, videoFeedData] = await Promise.all([
      safeLiveFeed(getPersonalizeLiveFeed),
      safeLiveFeed(getPersonalizeLifestyleLiveFeed),
      safeLiveFeed(() => getPersonalizeVideoFeed({ destination: "all" })),
    ]);
  }
  const story =
    staticStory ??
    internationalStory ??
    findLiveStory(liveFeedData, decodedStoryId) ??
    findLiveStory(lifestyleLiveFeedData, decodedStoryId) ??
    findLiveStory(videoFeedData, decodedStoryId);

  if (!story) notFound();

  const section = getHearstBrandSection(story.brandSlug);
  const initialOpenStoryId = internationalStory?.id ?? decodedStoryId;
  const storyInLiveFeed = findLiveStory(liveFeedData, initialOpenStoryId);
  const storyInLifestyleLiveFeed = findLiveStory(lifestyleLiveFeedData, initialOpenStoryId);
  const readerReturnHref = getReaderReturnHrefFromSearchParams(resolvedSearchParams) ?? getHearstStoryReturnHref(story);
  const initialOpenAmbientReader = shouldOpenAmbientReaderFromSearchParams(resolvedSearchParams);
  const initialLiveArticle = await safeLiveArticle(story.sourceUrl);

  return (
    <ThemeProvider defaultBrandSlug={hearstSectionThemeSlugs[section]}>
      <HomePageTemplate
        staticDestinationData={staticDestinationData}
        initialBrandSlug={hearstSectionThemeSlugs[section]}
        initialOpenStoryId={initialOpenStoryId}
        initialLiveArticle={initialLiveArticle}
        initialOpenAmbientReader={initialOpenAmbientReader}
        readerReturnHref={readerReturnHref}
        liveFeedData={storyInLiveFeed ? liveFeedData : storyInLifestyleLiveFeed ? lifestyleLiveFeedData : undefined}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
        initialFilter={story.mediaKind === "video" || story.videoUrl ? "Videos" : undefined}
      />
    </ThemeProvider>
  );
}
