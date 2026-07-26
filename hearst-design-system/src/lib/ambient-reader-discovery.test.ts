import assert from "node:assert/strict";
import test from "node:test";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  appendAmbientReaderDiscoveryStoryIds,
  getAmbientReaderDiscoveryScopes,
  getAmbientReaderDiscoveryTier,
  rankAmbientReaderDiscoveryStories,
} from "./ambient-reader-discovery";

function story(
  id: string,
  brandSlug: string,
  topic: string,
  tags: string[] = [],
  popularity = 50,
): LifestyleRiverStory {
  return {
    id,
    brand: brandSlug,
    brandSlug,
    topic,
    title: id,
    summary: id,
    image: "/placeholder.jpg",
    readTime: "5 min",
    popularity,
    signal: "Trending",
    tags,
    age: 1,
    sourceUrl: `https://example.com/${id}`,
  };
}

test("widens discovery from brand category through other sections", () => {
  const anchor = story("anchor", "town-and-country", "Travel", ["royals"]);
  const sameBrandCategory = story("same-brand-category", "town-and-country", "Travel");
  const sameSectionCategory = story("same-section-category", "elle", "Travel");
  const sameBrand = story("same-brand", "town-and-country", "Society");
  const sameSection = story("same-section", "harpers-bazaar", "Culture");
  const otherSection = story("other-section", "car-and-driver", "Reviews");

  assert.deepEqual(
    [
      sameBrandCategory,
      sameSectionCategory,
      sameBrand,
      sameSection,
      otherSection,
    ].map((candidate) => getAmbientReaderDiscoveryTier(anchor, candidate)),
    [0, 1, 2, 3, 4],
  );
});

test("ranks relevance rings before popularity and preserves the existing queue", () => {
  const anchor = story("anchor", "town-and-country", "Travel", ["royals"]);
  const candidates = [
    story("other-section", "car-and-driver", "Reviews", ["royals"], 99),
    story("same-brand", "town-and-country", "Society", [], 20),
    story("same-topic", "elle", "Travel", [], 30),
  ];

  assert.deepEqual(
    rankAmbientReaderDiscoveryStories(anchor, candidates).map(({ id }) => id),
    ["same-topic", "same-brand", "other-section"],
  );
  assert.deepEqual(
    appendAmbientReaderDiscoveryStoryIds(
      ["anchor", "same-brand"],
      anchor,
      candidates,
    ),
    ["anchor", "same-brand", "same-topic", "other-section"],
  );
});

test("builds progressively wider API scopes", () => {
  const anchor = story("anchor", "town-and-country", "Travel");

  assert.deepEqual(
    getAmbientReaderDiscoveryScopes(anchor).map(({ key }) => key),
    [
      "brand-category",
      "section-category",
      "brand",
      "section",
      "all-sections",
    ],
  );
});
