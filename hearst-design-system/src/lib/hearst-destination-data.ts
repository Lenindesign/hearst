import "server-only";

import { autosRiverSourceNotes, autosRiverStories } from "@/components/autos-river-data";
import { ewRiverSourceNotes, ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverSourceNotes, fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverSourceNotes, lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { filterExcludedStories } from "@/lib/content-exclusions";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";

const cachedDestinationData = new Map<string, HearstDestinationStaticData>();

function getStoryIdentity(story: { id: string; sourceUrl?: string }) {
  return story.sourceUrl?.trim().toLowerCase() || story.id;
}

function selectDestinationStories(
  stories: typeof lifestyleRiverStories,
  normalizedLimit: number,
  includeBrandSlug?: string,
) {
  const filteredStories = filterExcludedStories(stories);
  const compactStories = filteredStories.slice(0, normalizedLimit);

  if (!includeBrandSlug) return compactStories;

  const seen = new Set(compactStories.map(getStoryIdentity));
  const brandStories = filteredStories.filter((story) => story.brandSlug === includeBrandSlug);

  return [
    ...compactStories,
    ...brandStories.filter((story) => {
      const identity = getStoryIdentity(story);
      if (seen.has(identity)) return false;
      seen.add(identity);
      return true;
    }),
  ];
}

export function getHearstDestinationStaticData({
  storyLimitPerDestination = 20,
  includeBrandSlug,
}: {
  storyLimitPerDestination?: number;
  includeBrandSlug?: string;
} = {}): HearstDestinationStaticData {
  const normalizedLimit = Math.max(1, Math.floor(storyLimitPerDestination));
  const cacheKey = `${normalizedLimit}:${includeBrandSlug ?? ""}`;
  const cached = cachedDestinationData.get(cacheKey);
  if (cached) return cached;

  const lifestyleStories = selectDestinationStories(lifestyleRiverStories, normalizedLimit, includeBrandSlug);
  const autosStories = selectDestinationStories(autosRiverStories, normalizedLimit, includeBrandSlug);
  const fluxStories = selectDestinationStories(fluxRiverStories, normalizedLimit, includeBrandSlug);
  const ewStories = selectDestinationStories(ewRiverStories, normalizedLimit, includeBrandSlug);

  const destinationData: HearstDestinationStaticData = {
    all: {
      stories: [...lifestyleStories, ...autosStories, ...fluxStories, ...ewStories],
      sourceNotes: [
        ...lifestyleRiverSourceNotes,
        ...autosRiverSourceNotes,
        ...fluxRiverSourceNotes,
        ...ewRiverSourceNotes,
      ],
    },
    lifestyle: { stories: lifestyleStories, sourceNotes: lifestyleRiverSourceNotes },
    autos: { stories: autosStories, sourceNotes: autosRiverSourceNotes },
    flux: { stories: fluxStories, sourceNotes: fluxRiverSourceNotes },
    ew: { stories: ewStories, sourceNotes: ewRiverSourceNotes },
  };

  cachedDestinationData.set(cacheKey, destinationData);
  return destinationData;
}
