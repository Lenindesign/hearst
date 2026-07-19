import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import type { LiveFeedData } from "@/lib/live-feed-types";
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
  searchParams?: Promise<{ from?: string | string[] }>;
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

function getReaderReturnHrefFromSearchParams(searchParams?: { from?: string | string[] }) {
  const from = Array.isArray(searchParams?.from) ? searchParams?.from[0] : searchParams?.from;
  return normalizeReaderReturnHref(from);
}

export async function generateMetadata({ params }: ReaderArticlePageProps): Promise<Metadata> {
  const { storyId } = await params;
  const story = getStaticHearstStoryById(storyId);

  return {
    title: story ? `${story.title} | Hearst+` : "Hearst story",
    description: story?.summary ?? "A Hearst personalized reader story.",
  };
}

export default async function ReaderArticlePage({ params, searchParams }: ReaderArticlePageProps) {
  const { storyId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const decodedStoryId = decodeURIComponent(storyId);

  const staticStory = getStaticHearstStoryById(decodedStoryId);
  const staticDestinationData = getHearstDestinationStaticData({ storyLimitPerDestination: 12 });
  const requestedBrandSlug = staticStory?.brandSlug ?? getLiveStoryBrandSlug(decodedStoryId);
  const requestedSection = requestedBrandSlug ? getHearstBrandSection(requestedBrandSlug) : "all";
  const isVideoStory = decodedStoryId.startsWith("live-video-");
  let liveFeedData: LiveFeedData | undefined;
  let lifestyleLiveFeedData: LiveFeedData | undefined;
  let videoFeedData: LiveFeedData | undefined;

  if (staticStory) {
    liveFeedData = buildStaticReaderFeed(staticStory, staticDestinationData);
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
    findLiveStory(liveFeedData, decodedStoryId) ??
    findLiveStory(lifestyleLiveFeedData, decodedStoryId) ??
    findLiveStory(videoFeedData, decodedStoryId);

  if (!story) notFound();

  const section = getHearstBrandSection(story.brandSlug);
  const storyInLiveFeed = findLiveStory(liveFeedData, decodedStoryId);
  const storyInLifestyleLiveFeed = findLiveStory(lifestyleLiveFeedData, decodedStoryId);
  const readerReturnHref = getReaderReturnHrefFromSearchParams(resolvedSearchParams) ?? getHearstStoryReturnHref(story);

  return (
    <ThemeProvider defaultBrandSlug={hearstSectionThemeSlugs[section]}>
      <HomePageTemplate
        staticDestinationData={staticDestinationData}
        initialBrandSlug={hearstSectionThemeSlugs[section]}
        initialOpenStoryId={decodedStoryId}
        readerReturnHref={readerReturnHref}
        liveFeedData={storyInLiveFeed ? liveFeedData : storyInLifestyleLiveFeed ? lifestyleLiveFeedData : undefined}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
        initialFilter={story.mediaKind === "video" || story.videoUrl ? "Videos" : undefined}
      />
    </ThemeProvider>
  );
}
