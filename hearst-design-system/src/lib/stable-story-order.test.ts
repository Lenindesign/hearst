import assert from "node:assert/strict";
import test from "node:test";
import { mergeStableStoryOrder } from "./stable-story-order";

test("uses the candidate order when the feed scope changes", () => {
  assert.deepEqual(mergeStableStoryOrder(
    { scopeKey: "for-you", storyIds: ["story-b", "story-a"] },
    "saved",
    ["story-c", "story-a"]
  ), {
    scopeKey: "saved",
    storyIds: ["story-c", "story-a"],
  });
});

test("preserves existing positions and appends newly loaded stories", () => {
  assert.deepEqual(mergeStableStoryOrder(
    { scopeKey: "for-you", storyIds: ["story-b", "story-a"] },
    "for-you",
    ["story-a", "story-c", "story-b", "story-d"]
  ), {
    scopeKey: "for-you",
    storyIds: ["story-b", "story-a", "story-c", "story-d"],
  });
});

test("returns the existing state when no stories were added", () => {
  const current = { scopeKey: "for-you", storyIds: ["story-b", "story-a"] };

  assert.equal(mergeStableStoryOrder(current, "for-you", ["story-a", "story-b"]), current);
});
