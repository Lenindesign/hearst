import "server-only";

import { autosRiverSourceNotes, autosRiverStories } from "@/components/autos-river-data";
import { ewRiverSourceNotes, ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverSourceNotes, fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverSourceNotes, lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { filterExcludedStories } from "@/lib/content-exclusions";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";

let cachedDestinationData: HearstDestinationStaticData | undefined;

export function getHearstDestinationStaticData(): HearstDestinationStaticData {
  if (cachedDestinationData) return cachedDestinationData;

  const lifestyleStories = filterExcludedStories(lifestyleRiverStories);
  const autosStories = filterExcludedStories(autosRiverStories);
  const fluxStories = filterExcludedStories(fluxRiverStories);
  const ewStories = filterExcludedStories(ewRiverStories);

  cachedDestinationData = {
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

  return cachedDestinationData;
}
