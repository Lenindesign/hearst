import assert from "node:assert/strict";
import test from "node:test";

import {
  getExactVideoAspectRatio,
  selectVideoAspectRatioQuotas,
} from "./video-feed-selection";

test("recognizes only exact 16:9 and 9:16 dimensions", () => {
  assert.equal(getExactVideoAspectRatio({ videoWidth: 1920, videoHeight: 1080 }), "16:9");
  assert.equal(getExactVideoAspectRatio({ videoWidth: 360, videoHeight: 640 }), "9:16");
  assert.equal(getExactVideoAspectRatio({ videoWidth: 1024, videoHeight: 1280 }), null);
  assert.equal(getExactVideoAspectRatio({ videoWidth: 1080, videoHeight: 1080 }), null);
  assert.equal(getExactVideoAspectRatio({ videoWidth: 0, videoHeight: 0 }), null);
});

test("preserves source ranking while enforcing independent aspect-ratio quotas", () => {
  const videos = [
    { id: "portrait-1", videoWidth: 360, videoHeight: 640 },
    { id: "square", videoWidth: 1080, videoHeight: 1080 },
    { id: "landscape-1", videoWidth: 1920, videoHeight: 1080 },
    { id: "portrait-2", videoWidth: 1080, videoHeight: 1920 },
    { id: "four-five", videoWidth: 1024, videoHeight: 1280 },
    { id: "landscape-2", videoWidth: 1280, videoHeight: 720 },
    { id: "portrait-3", videoWidth: 720, videoHeight: 1280 },
    { id: "landscape-3", videoWidth: 640, videoHeight: 360 },
  ];

  const selected = selectVideoAspectRatioQuotas(videos, {
    landscapeLimit: 2,
    portraitLimit: 2,
  });

  assert.deepEqual(
    selected.map((video) => video.id),
    ["portrait-1", "landscape-1", "portrait-2", "landscape-2"],
  );
});

test("keeps every exact portrait video available in the supported 25-item brand inventory", () => {
  const videos = Array.from({ length: 26 }, (_, index) => ({
    id: `portrait-${index + 1}`,
    videoWidth: 1080,
    videoHeight: 1920,
  }));

  const selected = selectVideoAspectRatioQuotas(videos);

  assert.equal(selected.length, 25);
  assert.equal(selected[0]?.id, "portrait-1");
  assert.equal(selected.at(-1)?.id, "portrait-25");
});
