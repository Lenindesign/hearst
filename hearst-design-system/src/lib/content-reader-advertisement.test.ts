import assert from "node:assert/strict";
import test from "node:test";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  selectContentReaderAdvertisement,
  type ContextualAdUnit,
  type ReaderAdvertisementDestination,
} from "@/components/hearst-plus/content-reader-advertisement";

function makeStory(
  overrides: Partial<LifestyleRiverStory> = {},
): LifestyleRiverStory {
  return {
    id: "current",
    brand: "Car and Driver",
    brandSlug: "car-and-driver",
    topic: "Reviews",
    title: "A production-shaped reader story",
    summary: "A source-backed article fixture.",
    image: "https://hips.hearstapps.com/hmg-prod/images/example.jpg",
    readTime: "5 Min Read",
    popularity: 75,
    signal: "Editor Pick",
    tags: ["reviews", "performance"],
    age: 2,
    ...overrides,
  };
}

function makeAd(
  id: string,
  overrides: Partial<ContextualAdUnit> = {},
): ContextualAdUnit {
  return {
    id,
    sponsor: "Verified Sponsor",
    title: `Campaign ${id}`,
    summary: "A contextual campaign fixture.",
    cta: "Learn more",
    topics: ["Reviews"],
    tags: ["reviews"],
    creativeLabel: "Review",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/example.jpg",
    palette: {
      background: "#ffffff",
      foreground: "#111111",
      accent: "#1b5f8a",
      soft: "#d9e8ed",
    },
    ...overrides,
  };
}

function makeCatalog(
  overrides: Partial<
    Record<ReaderAdvertisementDestination, ContextualAdUnit[]>
  > = {},
) {
  return {
    lifestyle: [makeAd("lifestyle")],
    autos: [makeAd("autos")],
    flux: [makeAd("flux")],
    ew: [makeAd("ew")],
    ...overrides,
  };
}

test("keeps reader advertisements inside the active story destination", () => {
  const catalog = makeCatalog({
    lifestyle: [
      makeAd("cross-destination", {
        topics: ["Reviews"],
        tags: ["reviews", "performance"],
      }),
    ],
    autos: [
      makeAd("autos-scoped", {
        topics: ["Buying Guides"],
        tags: ["buying"],
      }),
    ],
  });

  assert.equal(
    selectContentReaderAdvertisement(makeStory(), catalog)?.id,
    "autos-scoped",
  );
});

test("ranks matching topic and tags before rotating equivalent slots", () => {
  const catalog = makeCatalog({
    autos: [
      makeAd("generic", { topics: ["Buying Guides"], tags: ["buying"] }),
      makeAd("matching", {
        topics: ["Reviews"],
        tags: ["reviews", "performance"],
      }),
    ],
  });

  assert.equal(
    selectContentReaderAdvertisement(makeStory(), catalog)?.id,
    "matching",
  );
  assert.equal(
    selectContentReaderAdvertisement(makeStory(), catalog, 1)?.id,
    "generic",
  );
});

test("returns no reader advertisement when its destination has no inventory", () => {
  assert.equal(
    selectContentReaderAdvertisement(
      makeStory(),
      makeCatalog({ autos: [] }),
    ),
    null,
  );
});
