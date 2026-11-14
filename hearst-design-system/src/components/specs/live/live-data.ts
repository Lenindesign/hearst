import "server-only";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";

/** Brand slugs of the LiveBrandFrame default picker (live-kit.tsx liveBrands), for server-side data. */
export const liveBrandSlugs = ["hearst-all", "cosmopolitan", "esquire", "car-and-driver"];

/** Stories for live references, keyed by preview brand. Hearst+ gets one story per brand, like Today's Picks. */
export type LiveStoriesByBrand = Record<string, LifestyleRiverStory[]>;

function catalog() {
  return getHearstDestinationStaticData({ storyLimitPerDestination: 80 }).all.stories.filter((story) => story.image);
}

export function getLiveStoriesByBrand(brandSlugs: string[], count: number): LiveStoriesByBrand {
  const stories = catalog();
  const result: LiveStoriesByBrand = {};
  for (const slug of brandSlugs) {
    if (slug.startsWith("hearst-")) {
      const seen = new Set<string>();
      result[slug] = stories.filter((story) => {
        if (seen.has(story.brandSlug)) return false;
        seen.add(story.brandSlug);
        return true;
      }).slice(0, count);
    } else {
      result[slug] = stories.filter((story) => story.brandSlug === slug).slice(0, count);
    }
  }
  return result;
}

/** A story the /read/ route can open, for the reader's live reference. */
export function getLiveReaderStoryId(brandSlug = "cosmopolitan") {
  const stories = catalog();
  return (stories.find((story) => story.brandSlug === brandSlug && story.sourceUrl) ?? stories[0]).id;
}
