import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";
import { storybookFixtureData } from "./generated/hearst-plus-fixtures";

const {
  lifestyle: { stories: lifestyleRiverStories, sourceNotes: lifestyleRiverSourceNotes },
  autos: { stories: autosRiverStories, sourceNotes: autosRiverSourceNotes },
  flux: { stories: fluxRiverStories, sourceNotes: fluxRiverSourceNotes },
  ew: { stories: ewRiverStories, sourceNotes: ewRiverSourceNotes },
} = storybookFixtureData;

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
