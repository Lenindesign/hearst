import { autosRiverSourceNotes, autosRiverStories } from "@/components/autos-river-data";
import { ewRiverSourceNotes, ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverSourceNotes, fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverSourceNotes, lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";

const storyLimitPerDestination = 20;

const lifestyleStories = lifestyleRiverStories.slice(0, storyLimitPerDestination);
const autosStories = autosRiverStories.slice(0, storyLimitPerDestination);
const fluxStories = fluxRiverStories.slice(0, storyLimitPerDestination);
const ewStories = ewRiverStories.slice(0, storyLimitPerDestination);

export const hearstPlusStoryData: HearstDestinationStaticData = {
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
