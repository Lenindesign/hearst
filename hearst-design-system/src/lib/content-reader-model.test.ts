import assert from "node:assert/strict";
import test from "node:test";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getLifestyleArticleRecommendations,
  getLifestyleCommentCount,
  getLifestyleContextStories,
  getLifestyleSeedComments,
  getReadyLiveArticle,
  scoreLifestyleRelatedStory,
} from "@/components/hearst-plus/content-reader-model";

function makeStory(
  id: string,
  overrides: Partial<LifestyleRiverStory> = {},
): LifestyleRiverStory {
  return {
    id,
    brand: "Good Housekeeping",
    brandSlug: "good-housekeeping",
    topic: "Wellness",
    title: `A useful story ${id}`,
    summary: "A production-shaped reader fixture.",
    image: "https://hips.hearstapps.com/hmg-prod/images/example.jpg",
    readTime: "5 Min Read",
    popularity: 50,
    signal: "Editor Pick",
    tags: ["wellness", "morning"],
    age: 2,
    ...overrides,
  };
}

test("returns article data only after the reader source is ready", () => {
  const data = {
    blocks: [{ type: "paragraph" as const, text: "Ready article body" }],
    sourceUrl: "https://example.com/story",
  };

  assert.equal(getReadyLiveArticle({ status: "loading" }), undefined);
  assert.equal(getReadyLiveArticle({ status: "error" }), undefined);
  assert.deepEqual(getReadyLiveArticle({ status: "ready", data }), data);
});

test("keeps comment totals deterministic and applies local additions", () => {
  const story = makeStory("comments", { popularity: 63, age: 4 });

  assert.equal(getLifestyleCommentCount(story), 13);
  assert.equal(getLifestyleCommentCount(story, 2), 15);
  assert.equal(
    getLifestyleCommentCount(
      makeStory("minimum", { popularity: 0, age: 0 }),
    ),
    3,
  );
});

test("builds stable format-aware seed comments", () => {
  const recipe = makeStory("recipe", {
    topic: "Food Recipes",
    title: "A simple weeknight dinner",
  });
  const first = getLifestyleSeedComments(recipe);
  const second = getLifestyleSeedComments(recipe);

  assert.deepEqual(first, second);
  assert.equal(first.length, 3);
  assert.match(first[0].id, /^recipe-seed-comment-0$/);
  assert.ok(first.some((comment) => /prep list|shopping list|weekend/.test(comment.body)));
});

test("builds bounded context groups without repeating the open story", () => {
  const current = makeStory("current");
  const stories = [
    current,
    makeStory("shared-intent-high", {
      brand: "ELLE",
      brandSlug: "elle",
      topic: "Style",
      tags: ["morning"],
      popularity: 90,
    }),
    makeStory("shared-intent-low", {
      brand: "Prevention",
      brandSlug: "prevention",
      topic: "Health",
      tags: ["wellness"],
      popularity: 40,
    }),
    makeStory("same-brand", {
      topic: "Home",
      tags: ["interiors"],
      popularity: 80,
    }),
    makeStory("same-topic-high", {
      brand: "ELLE",
      brandSlug: "elle",
      tags: ["culture"],
      popularity: 70,
    }),
    makeStory("same-topic-low", {
      brand: "Cosmopolitan",
      brandSlug: "cosmopolitan",
      tags: ["relationships"],
      popularity: 30,
    }),
    makeStory("shared-tag", {
      brand: "ELLE",
      brandSlug: "elle",
      topic: "Style",
      tags: ["morning"],
      popularity: 70,
    }),
  ];

  const context = getLifestyleContextStories(current, stories);

  assert.deepEqual(
    context.sameTopic.map((story) => story.id),
    ["same-topic-high", "same-topic-low"],
  );
  assert.deepEqual(
    context.sameBrand.map((story) => story.id),
    ["same-brand"],
  );
  assert.ok(context.sameBrand.every((story) => story.id !== current.id));
  assert.ok(context.sharedIntent.some((story) => story.id === "shared-tag"));
  const groupedIds = [
    ...context.sharedIntent,
    ...context.sameBrand,
    ...context.sameTopic,
  ].map((story) => story.id);
  assert.equal(new Set(groupedIds).size, groupedIds.length);
  assert.deepEqual(context.intentTags, ["wellness", "morning"]);
});

test("ranks exact-topic recommendations first and returns unique stories", () => {
  const current = makeStory("current");
  const sameTopic = makeStory("same-topic", {
    popularity: 10,
    tags: ["different"],
  });
  const sameBrandAndTags = makeStory("same-brand-tags", {
    topic: "Home",
    popularity: 100,
  });
  const unrelated = makeStory("unrelated", {
    brand: "ELLE",
    brandSlug: "elle",
    topic: "Style",
    tags: ["fashion"],
    popularity: 100,
  });

  assert.ok(
    scoreLifestyleRelatedStory(current, sameTopic)
    > scoreLifestyleRelatedStory(current, unrelated),
  );
  assert.deepEqual(
    getLifestyleArticleRecommendations(current, [
      current,
      unrelated,
      sameBrandAndTags,
      sameTopic,
      sameTopic,
    ]).map((story) => story.id),
    ["same-topic", "same-brand-tags", "unrelated"],
  );
});
