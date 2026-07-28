import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getLifestyleCardKind } from "@/components/hearst-plus/story-presentation-model";
import { mergeUniqueStories } from "@/components/hearst-plus/story-utils";
import type { LiveFeedData } from "@/lib/live-feed-types";
import { getExactVideoAspectRatio } from "@/lib/video-feed-selection";

export function getPlayableVideoStories(stories: LifestyleRiverStory[]) {
  return stories.filter((story) => getLifestyleCardKind(story) === "video");
}

export function reconcileVideoBrandFilters(
  activeBrandFilters: string[],
  videoStories: LifestyleRiverStory[],
) {
  if (activeBrandFilters.length === 0) return activeBrandFilters;

  const availableVideoBrands = new Set(videoStories.map((story) => story.brand));
  return activeBrandFilters.filter((brandName) => availableVideoBrands.has(brandName));
}

export function isExactPortraitVideo(story: LifestyleRiverStory) {
  return Boolean(story.videoUrl)
    && getExactVideoAspectRatio(story) === "9:16";
}

export function isDelishPortraitShort(story: LifestyleRiverStory) {
  return story.brandSlug === "delish" && isExactPortraitVideo(story);
}

export function mergeDelishPortraitStories(
  ...storyGroups: LifestyleRiverStory[][]
) {
  return mergeUniqueStories(...storyGroups).filter(isDelishPortraitShort);
}

export function getDelishShortsRiverInsertIndex(
  riverStories: LifestyleRiverStory[],
) {
  const leadingDelishStoryIndex = riverStories.findIndex(
    (story) => story.brandSlug === "delish",
  );

  return leadingDelishStoryIndex === -1 ? -1 : leadingDelishStoryIndex + 1;
}

export function resolveProgressiveVideoFeed(
  videoFeedData: LiveFeedData | undefined,
  progressiveStories: LifestyleRiverStory[],
) {
  if (!videoFeedData) return undefined;

  return {
    ...videoFeedData,
    stories: mergeUniqueStories(videoFeedData.stories, progressiveStories),
  };
}

export function hasPlayableVideoStories(
  videoFeedData: LiveFeedData | undefined,
) {
  return Boolean(
    videoFeedData
      && getPlayableVideoStories(videoFeedData.stories).length > 0,
  );
}

export type VideoDestinationQueue = {
  videoStories: LifestyleRiverStory[];
  standardVideoStories: LifestyleRiverStory[];
  featuredVideo?: LifestyleRiverStory;
  remainingVideoStories: LifestyleRiverStory[];
  trendingVideoStories: LifestyleRiverStory[];
};

export function buildVideoDestinationQueue(
  stories: LifestyleRiverStory[],
  promotedStoryIds: ReadonlySet<string>,
): VideoDestinationQueue {
  const videoStories = getPlayableVideoStories(stories);
  const standardVideoStories = videoStories.filter(
    (story) => !promotedStoryIds.has(story.id),
  );
  const featuredVideo = standardVideoStories[0] ?? videoStories[0];
  const remainingVideoStories = featuredVideo
    ? standardVideoStories.filter((story) => story.id !== featuredVideo.id)
    : standardVideoStories;
  const trendingVideoStories = videoStories
    .filter((story) => story.id !== featuredVideo?.id)
    .sort((left, right) =>
      right.popularity - left.popularity
      || Date.parse(right.publishedAt ?? "") - Date.parse(left.publishedAt ?? "")
      || left.title.localeCompare(right.title)
    )
    .slice(0, 4);

  return {
    videoStories,
    standardVideoStories,
    featuredVideo,
    remainingVideoStories,
    trendingVideoStories,
  };
}
