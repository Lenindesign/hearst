import "server-only";

import { unstable_cache } from "next/cache";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";
import type { HearstBrandSection } from "@/lib/hearst-routes";

const fullCatalogLimitPerDestination = 10_000;
const fullVideoInventoryPerBrand = 25;

function getStoryIdentity(story: LifestyleRiverStory) {
  const sourceUrl = story.sourceUrl?.trim().toLowerCase();
  if (sourceUrl) return `url:${sourceUrl}`;

  return `story:${story.brandSlug}:${story.title.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

function mergeUniqueStories(...storyGroups: LifestyleRiverStory[][]) {
  const seen = new Set<string>();

  return storyGroups.flat().filter((story) => {
    const identity = getStoryIdentity(story);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

const getCachedHearstStoryInventory = unstable_cache(
  async (section: HearstBrandSection) => {
    const staticStories = getHearstDestinationStaticData({
      storyLimitPerDestination: fullCatalogLimitPerDestination,
    })[section].stories;
    const [liveFeed, videoFeed] = await Promise.all([
      getPersonalizeLiveFeed({
        destination: section,
        sizePerBrand: 10,
        videoSizePerBrand: 4,
      }),
      getPersonalizeVideoFeed({
        destination: section,
        sizePerBrand: fullVideoInventoryPerBrand,
      }),
    ]);
    const stories = mergeUniqueStories(staticStories, liveFeed.stories, videoFeed.stories);

    return stories.reduce<Record<string, number>>((counts, story) => {
      counts[story.brandSlug] = (counts[story.brandSlug] ?? 0) + 1;
      return counts;
    }, {});
  },
  ["hearst-global-story-inventory"],
  { revalidate: 300 },
);

export function getHearstGlobalStoryInventory(section: HearstBrandSection) {
  return getCachedHearstStoryInventory(section);
}

export function getHearstAllStoryInventory() {
  const staticData = getHearstDestinationStaticData({
    storyLimitPerDestination: fullCatalogLimitPerDestination,
  });
  const stories = mergeUniqueStories(
    staticData.lifestyle.stories,
    staticData.autos.stories,
    staticData.flux.stories,
    staticData.ew.stories,
  );

  return stories.reduce<Record<string, number>>((counts, story) => {
    counts[story.brandSlug] = (counts[story.brandSlug] ?? 0) + 1;
    return counts;
  }, {});
}
