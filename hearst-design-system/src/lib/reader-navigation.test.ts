import assert from "node:assert/strict";
import test from "node:test";

import {
  appendReaderReturnHref,
  getReaderOriginBrandSlug,
  getReaderReturnScrollStorageKey,
  orderReaderReturnStories,
  parseReaderReturnScrollSnapshot,
  type ReaderReturnScrollSnapshot,
} from "./reader-navigation";

const now = Date.parse("2026-07-26T12:00:00Z");
const returnHref = "/lifestyle/elle/?filter=style#latest";

function createSnapshot(
  overrides: Partial<ReaderReturnScrollSnapshot> = {},
): ReaderReturnScrollSnapshot {
  return {
    href: returnHref,
    scrollX: 0,
    scrollY: 640,
    storyId: "story-b",
    storyIds: ["story-b", "story-a"],
    createdAt: now,
    ...overrides,
  };
}

test("builds canonical reader URLs with only safe return routes", () => {
  assert.equal(
    appendReaderReturnHref("story / one", returnHref),
    "/read/story%20%2F%20one/?from=%2Flifestyle%2Felle%2F%3Ffilter%3Dstyle%23latest",
  );
  assert.equal(appendReaderReturnHref("story-one", "https://example.com"), "/read/story-one/");
  assert.equal(appendReaderReturnHref("story-one", "/read/story-two/"), "/read/story-one/");
});

test("scopes scroll snapshots to a normalized return URL", () => {
  assert.equal(
    getReaderReturnScrollStorageKey(encodeURIComponent(returnHref)),
    `hearst-plus-reader-return-scroll:${returnHref}`,
  );
  assert.equal(getReaderReturnScrollStorageKey("//example.com"), null);
});

test("parses a current production return snapshot", () => {
  assert.deepEqual(
    parseReaderReturnScrollSnapshot(JSON.stringify(createSnapshot()), returnHref, now),
    createSnapshot(),
  );
});

test("rejects stale, future, mismatched, and malformed return snapshots", () => {
  assert.equal(
    parseReaderReturnScrollSnapshot(
      JSON.stringify(createSnapshot({ createdAt: now - 30 * 60 * 1000 - 1 })),
      returnHref,
      now,
    ),
    null,
  );
  assert.equal(
    parseReaderReturnScrollSnapshot(
      JSON.stringify(createSnapshot({ createdAt: now + 1 })),
      returnHref,
      now,
    ),
    null,
  );
  assert.equal(
    parseReaderReturnScrollSnapshot(
      JSON.stringify(createSnapshot({ href: "/autos/car-and-driver/" })),
      returnHref,
      now,
    ),
    null,
  );
  assert.equal(parseReaderReturnScrollSnapshot("{", returnHref, now), null);
});

test("restores the saved reader order and appends newly available stories", () => {
  assert.deepEqual(
    orderReaderReturnStories(createSnapshot(), ["story-a", "story-c", "story-b"]),
    ["story-b", "story-a", "story-c"],
  );
  assert.deepEqual(
    orderReaderReturnStories(createSnapshot(), ["story-a", "story-c"]),
    ["story-a", "story-c"],
  );
});

test("resolves only supported production brand return routes", () => {
  assert.equal(getReaderOriginBrandSlug("/lifestyle/elle/?filter=style"), "elle");
  assert.equal(getReaderOriginBrandSlug("/brands/car-and-driver/"), "car-and-driver");
  assert.equal(getReaderOriginBrandSlug("/hearst-plus/"), null);
  assert.equal(getReaderOriginBrandSlug("https://example.com"), null);
});
