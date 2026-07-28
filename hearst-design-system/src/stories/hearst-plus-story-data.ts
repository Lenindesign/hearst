import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";
import type { LiveFeedData } from "@/lib/live-feed-types";
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

const STORYBOOK_VIDEO_FIXTURE = "/storybook-video-fixture.mp4";
const STORYBOOK_VERTICAL_VIDEO_FIXTURE = "/storybook-vertical-video-fixture.mp4";

function createVideoFeedData(
  destination: Exclude<keyof HearstDestinationStaticData, "all"> | "all",
): LiveFeedData {
  const source = hearstPlusStoryData[destination];
  let hasDelishShort = false;
  const stories = source.stories.map((story) => {
    const isDelishShort = !hasDelishShort && story.brandSlug === "delish";
    if (isDelishShort) hasDelishShort = true;

    return {
      ...story,
      id: `storybook-video-${story.id}`,
      mediaKind: "video" as const,
      videoUrl: isDelishShort
        ? STORYBOOK_VERTICAL_VIDEO_FIXTURE
        : STORYBOOK_VIDEO_FIXTURE,
      videoDuration: 5,
      videoWidth: isDelishShort ? 540 : 960,
      videoHeight: isDelishShort ? 960 : 540,
    };
  });

  return {
    stories,
    sourceNotes: source.sourceNotes.map((note) => ({ ...note })),
    dataSourceCopy:
      "Publication metadata and poster images come from the generated Hearst fixture; the playable clip is an explicit deterministic Storybook interaction fixture.",
    fetchedAt: "2026-07-26T00:00:00.000Z",
    isFallback: false,
    productName: "Storybook video interaction fixture",
  };
}

export const hearstPlusVideoStoryData = {
  all: createVideoFeedData("all"),
  lifestyle: createVideoFeedData("lifestyle"),
  autos: createVideoFeedData("autos"),
  flux: createVideoFeedData("flux"),
  ew: createVideoFeedData("ew"),
} satisfies Record<keyof HearstDestinationStaticData, LiveFeedData>;
