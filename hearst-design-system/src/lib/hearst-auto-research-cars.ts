import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { hearstAutoResearchCarRatings } from "@/lib/hearst-auto-research-car-catalog";

/**
 * Car and Driver model-page scores verified from the source pages for the
 * current demo inventory. Add a story here only after confirming its score
 * from the Car and Driver model page.
 */
const verifiedResearchCarRatings: Record<string, string> = {
  "car-and-driver-kia-ev9-2027": "10/10",
  "car-and-driver-ineos-grenadier-quartermaster-2027": "7.5/10",
  "car-and-driver-bmw-3-series": "9.5/10",
  "car-and-driver-nissan-rogue-hybrid": "8.5/10",
  ...hearstAutoResearchCarRatings,
};

export function getHearstAutoResearchCarRating(storyId: string) {
  return verifiedResearchCarRatings[storyId];
}

export function isHearstAutoResearchCar(story: Pick<LifestyleRiverStory, "id" | "brandSlug">) {
  return story.brandSlug === "car-and-driver" && Boolean(getHearstAutoResearchCarRating(story.id));
}
