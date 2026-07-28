import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getHearstBrandSection,
  type HearstBrandSection,
} from "@/lib/hearst-routes";
import { mergeUniqueStories } from "./story-utils";

export type ReaderQueueModel = {
  availableStories: LifestyleRiverStory[];
  scopedStories: LifestyleRiverStory[];
  stories: LifestyleRiverStory[];
  queue: LifestyleRiverStory[];
  openIndex: number;
  currentStory?: LifestyleRiverStory;
};

export type BuildReaderQueueOptions = {
  stories: LifestyleRiverStory[];
  availableStories?: LifestyleRiverStory[];
  fetchedStories?: LifestyleRiverStory[];
  activeBrandSlug?: string | null;
  destinationOverride?: HearstBrandSection | null;
  openStoryId?: string | null;
};

/**
 * Builds the production content-reader queue without owning UI or routing.
 *
 * The selected publication is preferred when it has stories. A destination
 * override takes precedence, and a story opened from outside the currently
 * rendered river is appended so the requested article always opens.
 */
export function buildReaderQueue({
  stories,
  availableStories = [],
  fetchedStories = [],
  activeBrandSlug,
  destinationOverride,
  openStoryId,
}: BuildReaderQueueOptions): ReaderQueueModel {
  const mergedAvailableStories = mergeUniqueStories(
    stories,
    availableStories,
    fetchedStories,
  );
  const publicationStories = activeBrandSlug
    ? mergedAvailableStories.filter(
        (story) => story.brandSlug === activeBrandSlug,
      )
    : [];
  const scopedStories = destinationOverride
    ? mergedAvailableStories.filter(
        (story) =>
          getHearstBrandSection(story.brandSlug) === destinationOverride,
      )
    : publicationStories.length > 0
      ? publicationStories
      : stories;
  const readerStories =
    openStoryId &&
    !scopedStories.some((story) => story.id === openStoryId)
      ? [
          ...scopedStories,
          ...mergedAvailableStories.filter(
            (story) => story.id === openStoryId,
          ),
        ]
      : scopedStories;
  const openIndex = openStoryId
    ? readerStories.findIndex((story) => story.id === openStoryId)
    : -1;
  const queue =
    openIndex >= 0
      ? [
          ...readerStories.slice(openIndex),
          ...readerStories.slice(0, openIndex),
        ]
      : [];

  return {
    availableStories: mergedAvailableStories,
    scopedStories,
    stories: readerStories,
    queue,
    openIndex,
    currentStory: queue[0],
  };
}
