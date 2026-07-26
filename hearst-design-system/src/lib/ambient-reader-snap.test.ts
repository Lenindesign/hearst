import assert from "node:assert/strict";
import test from "node:test";

import {
  ambientReaderCenterSurfaceIndex,
  getSettledAmbientSurfaceIndex,
  shouldInsertAmbientInterstitial,
} from "./ambient-reader-snap";

test("selects the settled horizontal reader surface", () => {
  assert.equal(ambientReaderCenterSurfaceIndex, 1);
  assert.equal(getSettledAmbientSurfaceIndex(0, 390), 0);
  assert.equal(getSettledAmbientSurfaceIndex(389, 390), 1);
  assert.equal(getSettledAmbientSurfaceIndex(780, 390), 2);
  assert.equal(getSettledAmbientSurfaceIndex(4_000, 390), 2);
});

test("inserts an interstitial before every third newly opened article", () => {
  assert.equal(
    shouldInsertAmbientInterstitial({
      alreadyOpened: false,
      articleVisitCount: 2,
    }),
    true,
  );
  assert.equal(
    shouldInsertAmbientInterstitial({
      alreadyOpened: false,
      articleVisitCount: 1,
    }),
    false,
  );
  assert.equal(
    shouldInsertAmbientInterstitial({
      alreadyOpened: true,
      articleVisitCount: 1,
    }),
    false,
  );
});
