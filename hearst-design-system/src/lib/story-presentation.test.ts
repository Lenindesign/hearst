import assert from "node:assert/strict";
import test from "node:test";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getLifestyleCardKind,
  getLifestyleImagePosition,
  getLifestyleKindLabel,
  isExplicitGalleryStory,
  lifestyleDefaultLeadStoryId,
} from "@/components/hearst-plus/story-presentation-model";

function makeStory(
  overrides: Partial<LifestyleRiverStory> = {},
): LifestyleRiverStory {
  return {
    id: "story-presentation-test",
    brand: "Good Housekeeping",
    brandSlug: "good-housekeeping",
    topic: "Wellness",
    title: "A practical guide for a better morning",
    summary: "A production-shaped story fixture.",
    image: "https://hips.hearstapps.com/hmg-prod/images/example.jpg",
    readTime: "5 Min Read",
    popularity: 50,
    signal: "Editor Pick",
    tags: ["wellness"],
    age: 1,
    ...overrides,
  };
}

test("classifies a standard story as an article", () => {
  assert.equal(getLifestyleCardKind(makeStory()), "article");
});

test("gives explicit gallery metadata precedence over inferred presentation", () => {
  const story = makeStory({
    sourceUrl: "https://example.com/photos/home-tour",
    tags: ["photo-gallery"],
  });

  assert.equal(isExplicitGalleryStory(story), true);
  assert.equal(getLifestyleCardKind(story), "gallery");
});

test("classifies playable media as video", () => {
  assert.equal(
    getLifestyleCardKind(makeStory({ videoUrl: "/storybook-video-fixture.mp4" })),
    "video",
  );
});

test("classifies food stories as recipes", () => {
  assert.equal(
    getLifestyleCardKind(makeStory({ topic: "Food Recipes" })),
    "recipe",
  );
  assert.equal(
    getLifestyleKindLabel("recipe", makeStory({ topic: "Food Recipes" })),
    "Recipe",
  );
});

test("classifies year-make-model stories as specs", () => {
  const story = makeStory({
    brand: "Car and Driver",
    brandSlug: "car-and-driver",
    topic: "Reviews",
    title: "2026 Honda Civic Type R First Drive",
  });

  assert.equal(getLifestyleCardKind(story), "recipe");
  assert.equal(getLifestyleKindLabel("recipe", story), "Specs");
});

test("distinguishes shopping edits from non-shopping guides", () => {
  const shoppingStory = makeStory({
    topic: "Shopping",
    title: "The best editor-tested kitchen picks",
  });
  const guideStory = makeStory({
    topic: "Tech",
    title: "The best editor-tested headphones",
  });

  assert.equal(getLifestyleCardKind(shoppingStory), "shopping");
  assert.equal(getLifestyleKindLabel("shopping", shoppingStory), "Shop");
  assert.equal(getLifestyleCardKind(guideStory), "shopping");
  assert.equal(getLifestyleKindLabel("shopping", guideStory), "Guide");
});

test("keeps reviewed portrait crops stable for the lead and people-forward stories", () => {
  assert.equal(
    getLifestyleImagePosition(makeStory({ id: lifestyleDefaultLeadStoryId })),
    "center 22%",
  );
  assert.equal(
    getLifestyleImagePosition(makeStory({
      brand: "ELLE",
      brandSlug: "elle",
      topic: "Culture",
      title: "A new profile",
    })),
    "center 16%",
  );
});

test("biases people-led event photos upward in featured crops", () => {
  assert.equal(
    getLifestyleImagePosition(makeStory({
      brand: "Delish",
      brandSlug: "delish",
      topic: "Food News",
      title: "Meg Stalter Paid Way Too Much For The Saddest Mushroom Entrée",
      imageCredit: "Dave Benett",
    })),
    "center 16%",
  );
});

test("keeps the reviewed Meg Stalter crop stable", () => {
  assert.equal(
    getLifestyleImagePosition(makeStory({
      id: "delish-food-news-a73359231-meg-stalter-knorr",
      brand: "Delish",
      brandSlug: "delish",
      topic: "Food News",
      title: "Meg Stalter Paid Way Too Much For The Saddest Mushroom Entrée",
      imageCredit: "Dave Benett",
    })),
    "center 14%",
  );
});
