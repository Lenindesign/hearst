import "server-only";

import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { getAmbientCommerceStories } from "@/lib/ambient-commerce-stories";
import { filterExcludedStories } from "@/lib/content-exclusions";
import { hearstAutoResearchCarCatalog } from "@/lib/hearst-auto-research-car-catalog";
import { todayEditLocalNewsStory } from "@/lib/hearst-plus-today-edit-stories";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

const mensHealthTrainingPlanStory: LifestyleRiverStory = {
  id: "mens-health-fitness-a74297441-workout-challenge-30-day",
  brand: "Men’s Health",
  brandSlug: "mens-health",
  topic: "Fitness",
  title: "The Men’s Health 30-Day Workout Challenge",
  summary: "You can get moving to get in shape—but you have to commit.",
  image: "https://hips.hearstapps.com/hmg-prod/images/e121f8cc-f786-4c8c-a1fd-c0d694f73bf2.png?crop=0.5xw%3A1xh%3B0.273xw%2C0xh&resize=640%3A%2A",
  byline: "Brett Williams, NASM",
  readTime: "6 min read",
  popularity: 80,
  signal: "Editor Pick",
  tags: ["fitness", "workout", "training", "challenge"],
  age: 0,
  publishedAt: "2026-10-30T17:30:00.000Z",
  sourceUrl: "https://www.menshealth.com/fitness/a74297441/workout-challenge-30-day/",
};

const currentFeedStories = filterExcludedStories([
  ...lifestyleRiverStories,
  ...autosRiverStories,
  ...hearstAutoResearchCarCatalog,
  ...fluxRiverStories,
  ...ewRiverStories,
]);

// Verified commerce guides retain a snapshot after natural RSS rotation so a
// reader can still open a guide that remains in Shop the stories.
const staticHearstStories = Array.from(
  new Map(
    [...currentFeedStories, ...getAmbientCommerceStories(), todayEditLocalNewsStory, mensHealthTrainingPlanStory].map((story) => [story.id, story]),
  ).values(),
);

export function getStaticHearstStoryById(storyId: string) {
  const decodedStoryId = decodeURIComponent(storyId);
  return staticHearstStories.find((story) => story.id === decodedStoryId);
}

export function getStaticHearstArticleParams() {
  return staticHearstStories.map((story) => ({ storyId: story.id }));
}
