import assert from "node:assert/strict";
import test from "node:test";

import {
  getSettledShortIndex,
  getShortPreloadIndexes,
  isActiveShortEvent,
  shouldAutoplayActivatedShort,
} from "./shorts-playback";

test("selects a short only from the settled snap position", () => {
  assert.equal(getSettledShortIndex(0, 800, 5), 0);
  assert.equal(getSettledShortIndex(799, 800, 5), 1);
  assert.equal(getSettledShortIndex(3_200, 800, 5), 4);
  assert.equal(getSettledShortIndex(8_000, 800, 5), 4);
});

test("preloads the active short and its bounded neighbors", () => {
  assert.deepEqual(getShortPreloadIndexes(0, 5), [0, 1]);
  assert.deepEqual(getShortPreloadIndexes(2, 5), [1, 2, 3]);
  assert.deepEqual(getShortPreloadIndexes(4, 5), [3, 4]);
});

test("autoplays a newly active short only while muted", () => {
  assert.equal(
    shouldAutoplayActivatedShort({
      muted: true,
      playingRequested: true,
      storyChanged: true,
    }),
    true,
  );
  assert.equal(
    shouldAutoplayActivatedShort({
      muted: false,
      playingRequested: true,
      storyChanged: true,
    }),
    false,
  );
  assert.equal(
    shouldAutoplayActivatedShort({
      muted: false,
      playingRequested: true,
      storyChanged: false,
    }),
    true,
  );
});

test("ignores media events from an outgoing short", () => {
  assert.equal(isActiveShortEvent("outgoing", "incoming"), false);
  assert.equal(isActiveShortEvent("incoming", "incoming"), true);
});
