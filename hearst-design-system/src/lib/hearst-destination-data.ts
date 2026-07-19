import "server-only";

import { autosRiverSourceNotes, autosRiverStories } from "@/components/autos-river-data";
import { ewRiverSourceNotes, ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverSourceNotes, fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverSourceNotes, lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { filterExcludedStories } from "@/lib/content-exclusions";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";

const cachedDestinationData = new Map<number, HearstDestinationStaticData>();

export function getHearstDestinationStaticData({
  storyLimitPerDestination = 20,
}: {
  storyLimitPerDestination?: number;
} = {}): HearstDestinationStaticData {
  const normalizedLimit = Math.max(1, Math.floor(storyLimitPerDestination));
  const cached = cachedDestinationData.get(normalizedLimit);
  if (cached) return cached;

  const lifestyleStories = filterExcludedStories(lifestyleRiverStories).slice(0, normalizedLimit);
  const autosStories = filterExcludedStories(autosRiverStories).slice(0, normalizedLimit);
  const fluxStories = filterExcludedStories(fluxRiverStories).slice(0, normalizedLimit);
  const ewStories = filterExcludedStories(ewRiverStories).slice(0, normalizedLimit);

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

  cachedDestinationData.set(normalizedLimit, destinationData);
  return destinationData;
}
