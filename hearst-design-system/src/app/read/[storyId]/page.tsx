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

async function safeLiveFeed(fetcher: () => Promise<LiveFeedData>) {
  try {
    return await fetcher();
  } catch {
    return undefined;
  }
}

function getReaderReturnHrefFromSearchParams(searchParams?: { from?: string | string[] }) {
  const from = Array.isArray(searchParams?.from) ? searchParams?.from[0] : searchParams?.from;

  if (!from) return null;

  let decoded = from;
  try {
    decoded = decodeURIComponent(from);
  } catch {
    decoded = from;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.startsWith("/read/")) {
    return null;
  }

  return decoded;
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
  const [liveFeedData, lifestyleLiveFeedData, videoFeedData] = await Promise.all([
    safeLiveFeed(getPersonalizeLiveFeed),
    safeLiveFeed(getPersonalizeLifestyleLiveFeed),
    safeLiveFeed(() => getPersonalizeVideoFeed({ destination: "all" })),
  ]);
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
        staticDestinationData={getHearstDestinationStaticData()}
        initialBrandSlug={hearstSectionThemeSlugs[section]}
        initialOpenStoryId={decodedStoryId}
        readerReturnHref={readerReturnHref}
        liveFeedData={storyInLiveFeed ? liveFeedData : storyInLifestyleLiveFeed ? lifestyleLiveFeedData : undefined}
        videoFeedData={videoFeedData}
        initialFilter={story.mediaKind === "video" || story.videoUrl ? "Videos" : undefined}
      />
    </ThemeProvider>
  );
}
