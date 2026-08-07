import assert from "node:assert/strict";
import test from "node:test";

import type {
  LifestyleRiverProfile,
  LifestyleRiverStory,
} from "@/components/lifestyle-river-types";
import {
  applyOnboardingPreferences,
  baseDestinationConfigs,
  getBrandContextualFilters,
  getDestinationMode,
  getLifestyleRecommendationReason,
  getLifestyleScoreBreakdown,
  rankLifestyleRiver,
  type LifestyleDemoState,
} from "./hearst-personalization-model";

function makeStory(
  id: string,
  overrides: Partial<LifestyleRiverStory> = {},
): LifestyleRiverStory {
  return {
    id,
    brand: "Country Living",
    brandSlug: "country-living",
    topic: "Home",
    title: `Story ${id}`,
    summary: "A production-shaped editorial story.",
    image: "/images/hearst-plus-onboarding.png",
    readTime: "4 min",
    popularity: 50,
    signal: "Editor Pick",
    tags: ["home", "design"],
    age: 12,
    ...overrides,
  };
}

const profile: LifestyleRiverProfile = {
  followedTopics: ["Home"],
  followedBrands: ["Country Living"],
  savedTags: ["design"],
  boostedTags: ["home"],
  savedIds: [],
  hiddenIds: [],
};

const morningVisit: LifestyleDemoState = {
  daypart: "morning",
  returnHours: 0,
  contentDay: "today",
  isSimulated: false,
};

test("resolves destination and publication slugs to the production destination", () => {
  assert.equal(getDestinationMode("hearst-all"), "all");
  assert.equal(getDestinationMode("hearst-plus"), "autos");
  assert.equal(getDestinationMode("hearst-flux"), "flux");
  assert.equal(getDestinationMode("country-living"), "lifestyle");
  assert.equal(getDestinationMode("car-and-driver"), "autos");
  assert.equal(getDestinationMode("bicycling"), "ew");
});

test("surfaces communities in the combined Hearst+ navigation", () => {
  assert.deepEqual(baseDestinationConfigs.all.filters.slice(5, 9), [
    "Home",
    "Videos",
    "Communities",
    "Shopping",
  ]);
});

test("builds publication navigation from actual topic inventory", () => {
  const stories = [
    makeStory("home-1"),
    makeStory("home-2"),
    makeStory("food-1", { topic: "Food" }),
    makeStory("other-brand", {
      brand: "Delish",
      brandSlug: "delish",
      topic: "Food",
    }),
  ];

  assert.deepEqual(
    getBrandContextualFilters("country-living", stories, true),
    ["For You", "Home", "Food", "Videos", "Community"],
  );
  assert.deepEqual(
    getBrandContextualFilters("hot-rod", stories),
    [
      "For You",
      "EVs",
      "Performance",
      "Reviews",
      "Trucks",
      "Racing",
      "Buying Guides",
      "Events",
      "Videos",
      "Community",
    ],
  );
});

test("applies onboarding interests, brands, and source-backed tags", () => {
  const result = applyOnboardingPreferences(
    profile,
    [
      makeStory("home"),
      makeStory("food", {
        brand: "Delish",
        brandSlug: "delish",
        topic: "Food",
        tags: ["dinner", "quick"],
      }),
    ],
    {
      interests: ["Food"],
      brands: ["Delish"],
      tags: ["weeknight"],
    },
  );

  assert.deepEqual(result.followedTopics, ["Food"]);
  assert.deepEqual(result.followedBrands, ["Delish"]);
  assert.deepEqual(result.savedTags, ["weeknight", "dinner", "quick"]);
  assert.deepEqual(result.boostedTags, result.savedTags);
  assert.equal(result.personalizationMode, "onboarding");
});

test("preserves the editorial starting point only on the first morning visit", () => {
  const story = makeStory("lead");
  const config = {
    ...baseDestinationConfigs.lifestyle,
    defaultLeadStoryId: story.id,
  };

  assert.equal(
    getLifestyleScoreBreakdown(story, profile, morningVisit, config)
      .defaultLead,
    24,
  );
  assert.equal(
    getLifestyleScoreBreakdown(
      story,
      profile,
      { ...morningVisit, returnHours: 4, previousLeadId: story.id },
      config,
    ).defaultLead,
    0,
  );
});

test("suppresses a repeated lead and promotes genuinely fresh return content", () => {
  const previousLead = makeStory("previous", { age: 2 });
  const freshAlternative = makeStory("fresh", {
    brand: "House Beautiful",
    brandSlug: "house-beautiful",
    age: 2,
  });
  const returnVisit: LifestyleDemoState = {
    daypart: "afternoon",
    returnHours: 5,
    contentDay: "today",
    previousLeadId: previousLead.id,
    isSimulated: true,
  };
  const previousBreakdown = getLifestyleScoreBreakdown(
    previousLead,
    profile,
    returnVisit,
  );
  const freshBreakdown = getLifestyleScoreBreakdown(
    freshAlternative,
    profile,
    returnVisit,
  );

  assert.equal(previousBreakdown.repeatLeadPenalty, -140);
  assert.equal(freshBreakdown.returnFreshness, 24);
  assert.equal(
    getLifestyleRecommendationReason(
      freshAlternative,
      profile,
      returnVisit,
    ),
    "New since your last visit",
  );
});

test("adds next-edition novelty only to stories other than the previous lead", () => {
  const previousLead = makeStory("previous");
  const nextStory = makeStory("next");
  const nextDay: LifestyleDemoState = {
    daypart: "morning",
    returnHours: 18,
    contentDay: "nextDay",
    previousLeadId: previousLead.id,
    isSimulated: true,
  };

  assert.equal(
    getLifestyleScoreBreakdown(previousLead, profile, nextDay)
      .nextDayNovelty,
    0,
  );
  assert.equal(
    getLifestyleScoreBreakdown(nextStory, profile, nextDay).nextDayNovelty,
    28,
  );
});

test("prevents a third consecutive brand or topic when an alternative exists", () => {
  const stories = [
    makeStory("a-1", { popularity: 100 }),
    makeStory("a-2", { popularity: 99 }),
    makeStory("a-3", { popularity: 98 }),
    makeStory("b-1", {
      brand: "Delish",
      brandSlug: "delish",
      topic: "Food",
      popularity: 40,
    }),
    makeStory("a-4", { popularity: 39 }),
  ];
  const ranked = rankLifestyleRiver(stories, profile, morningVisit);

  assert.deepEqual(
    ranked.slice(0, 3).map((story) => story.id),
    ["a-1", "a-2", "b-1"],
  );
});
