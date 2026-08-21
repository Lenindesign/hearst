import assert from "node:assert/strict";
import test from "node:test";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getBrandPromotionForSlot,
  scoreBrandPromotionStory,
} from "@/components/hearst-plus/brand-promotion-model";

function makeStory(
  id: string,
  brand: string,
  brandSlug: string,
  overrides: Partial<LifestyleRiverStory> = {},
): LifestyleRiverStory {
  return {
    id,
    brand,
    brandSlug,
    topic: "Culture",
    title: `Story ${id}`,
    summary: "A production-shaped editorial fixture.",
    image: "https://hips.hearstapps.com/hmg-prod/images/example.jpg",
    readTime: "5 Min Read",
    popularity: 70,
    signal: "Editor Pick",
    tags: ["culture"],
    age: 3,
    ...overrides,
  };
}

test("requires at least three unique stories for a brand spotlight", () => {
  const stories = [
    makeStory("elle-1", "Elle", "elle"),
    makeStory("elle-2", "Elle", "elle"),
  ];

  assert.equal(
    getBrandPromotionForSlot({
      stories,
      fallbackStories: stories,
      activeFilter: "For You",
      slotNumber: 2,
    }),
    null,
  );
});

test("deduplicates stories and ranks the active topic first", () => {
  const stories = [
    makeStory("elle-1", "Elle", "elle", { topic: "Culture", popularity: 99 }),
    makeStory("elle-2", "Elle", "elle", { topic: "Style", popularity: 20 }),
    makeStory("elle-3", "Elle", "elle", { topic: "Style", popularity: 10 }),
    makeStory("elle-4", "Elle", "elle", { topic: "Culture", popularity: 98 }),
  ];

  const promotion = getBrandPromotionForSlot({
    stories,
    fallbackStories: [stories[0], ...stories],
    activeFilter: "Style",
    slotNumber: 2,
  });

  assert.ok(promotion);
  assert.deepEqual(
    promotion.stories.map((story) => story.id),
    ["elle-2", "elle-3", "elle-1", "elle-4"],
  );
  assert.equal(new Set(promotion.stories.map((story) => story.id)).size, 4);
  assert.ok(
    scoreBrandPromotionStory(stories[1], "Style")
      > scoreBrandPromotionStory(stories[0], "Style"),
  );
});

test("excludes the active publication and rotates eligible priority brands", () => {
  const stories = [
    ...Array.from({ length: 3 }, (_, index) =>
      makeStory(`elle-${index}`, "Elle", "elle")
    ),
    ...Array.from({ length: 3 }, (_, index) =>
      makeStory(`cd-${index}`, "Car and Driver", "car-and-driver")
    ),
    ...Array.from({ length: 3 }, (_, index) =>
      makeStory(`delish-${index}`, "Delish", "delish")
    ),
  ];

  const promotion = getBrandPromotionForSlot({
    stories,
    fallbackStories: stories,
    activeFilter: "For You",
    slotNumber: 4,
    excludedBrandSlug: "elle",
  });

  assert.ok(promotion);
  assert.equal(promotion.brandSlug, "delish");
  assert.ok(promotion.stories.every((story) => story.brandSlug !== "elle"));
});

test("excludes brands already used by earlier promotion modules", () => {
  const stories = [
    ...Array.from({ length: 3 }, (_, index) => makeStory(`elle-${index}`, "Elle", "elle")),
    ...Array.from({ length: 3 }, (_, index) => makeStory(`cd-${index}`, "Car and Driver", "car-and-driver")),
    ...Array.from({ length: 3 }, (_, index) => makeStory(`delish-${index}`, "Delish", "delish")),
  ];

  const promotion = getBrandPromotionForSlot({
    stories,
    fallbackStories: stories,
    activeFilter: "For You",
    slotNumber: 4,
    excludedBrandSlugs: ["elle", "car-and-driver"],
  });

  assert.ok(promotion);
  assert.equal(promotion.brandSlug, "delish");
});
