import assert from "node:assert/strict";
import test from "node:test";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  createStorySnapshot,
  mergeReaderAccounts,
  normalizeReaderAccount,
  type ReaderAccount,
} from "./reader-account-model";

function account(overrides: Partial<ReaderAccount> = {}): ReaderAccount {
  return normalizeReaderAccount({
    id: "reader-1",
    syncId: "a".repeat(64),
    firstName: "Reader",
    lastName: "One",
    email: "reader@example.com",
    createdAt: "2026-07-25T00:00:00.000Z",
    preferences: {
      followedTopics: [],
      followedBrands: [],
      savedTags: [],
      boostedTags: [],
      savedIds: [],
      hiddenIds: [],
    },
    commentsByStoryId: {},
    collections: [{
      id: "read-later",
      name: "Read Later",
      storyIds: [],
      createdAt: "2026-07-25T00:00:00.000Z",
      updatedAt: "2026-07-25T00:00:00.000Z",
    }],
    storySnapshots: {},
    ...overrides,
  });
}

function story(id: string): LifestyleRiverStory {
  return {
    id,
    brand: "Example",
    brandSlug: "example",
    topic: "News",
    title: `Story ${id}`,
    summary: "Summary",
    image: "/story.jpg",
    readTime: "4 min read",
    popularity: 10,
    signal: "Trending",
    tags: ["news"],
    age: 1,
    sourceUrl: `https://example.com/${id}`,
  };
}

test("preserves concurrent saves from two devices", () => {
  const base = account();
  const current = account({
    preferences: { ...base.preferences, savedIds: ["story-a"] },
    collections: [{ ...base.collections[0], storyIds: ["story-a"] }],
    storySnapshots: { "story-a": createStorySnapshot(story("story-a")) },
  });
  const incoming = account({
    preferences: { ...base.preferences, savedIds: ["story-b"] },
    collections: [{ ...base.collections[0], storyIds: ["story-b"] }],
    storySnapshots: { "story-b": createStorySnapshot(story("story-b")) },
  });

  const merged = mergeReaderAccounts(current, base, incoming);

  assert.deepEqual(merged.preferences.savedIds, ["story-a", "story-b"]);
  assert.deepEqual(merged.collections[0].storyIds, ["story-a", "story-b"]);
  assert.deepEqual(Object.keys(merged.storySnapshots).sort(), ["story-a", "story-b"]);
});

test("applies an explicit removal without dropping another device's new save", () => {
  const base = account({
    preferences: { ...account().preferences, savedIds: ["story-a"] },
    collections: [{ ...account().collections[0], storyIds: ["story-a"] }],
    storySnapshots: { "story-a": createStorySnapshot(story("story-a")) },
  });
  const current = account({
    preferences: { ...base.preferences, savedIds: ["story-a", "story-b"] },
    collections: [{ ...base.collections[0], storyIds: ["story-a", "story-b"] }],
    storySnapshots: {
      ...base.storySnapshots,
      "story-b": createStorySnapshot(story("story-b")),
    },
  });
  const incoming = account({
    preferences: { ...base.preferences, savedIds: [] },
    collections: [{ ...base.collections[0], storyIds: [] }],
    storySnapshots: {},
  });

  const merged = mergeReaderAccounts(current, base, incoming);

  assert.deepEqual(merged.preferences.savedIds, ["story-b"]);
  assert.deepEqual(merged.collections[0].storyIds, ["story-b"]);
  assert.deepEqual(Object.keys(merged.storySnapshots), ["story-b"]);
});

test("migrates older profiles without story snapshots", () => {
  const legacy = account();
  delete (legacy as Partial<ReaderAccount>).storySnapshots;

  assert.deepEqual(normalizeReaderAccount(legacy).storySnapshots, {});
});
