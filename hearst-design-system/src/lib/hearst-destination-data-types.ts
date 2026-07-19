import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { HearstDestinationMode } from "@/lib/hearst-routes";

export type HearstDestinationSourceNote = {
  brand: string;
  brandSlug: string;
  feedCount: number;
  importedCount: number;
  selectedCount: number;
};

export type HearstDestinationStaticData = Record<
  HearstDestinationMode,
  {
    stories: LifestyleRiverStory[];
    sourceNotes: readonly HearstDestinationSourceNote[];
  }
>;
