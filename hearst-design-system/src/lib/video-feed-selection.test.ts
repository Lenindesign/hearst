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

test("rotates the lead video every edition day and interleaves brands", async () => {
  const { rotateVideosForEdition } = await import("./video-feed-selection");
  const videos = [
    { id: "mt-1", brandSlug: "motortrend", popularity: 99 },
    { id: "mt-2", brandSlug: "motortrend", popularity: 98 },
    { id: "cd-1", brandSlug: "car-and-driver", popularity: 99 },
    { id: "delish-1", brandSlug: "delish", popularity: 99 },
  ];
  const day = (iso: string) => rotateVideosForEdition(videos, new Date(iso));

  const today = day("2026-11-06T15:00:00Z");
  const tomorrow = day("2026-11-07T15:00:00Z");
  assert.notEqual(today[0].id, tomorrow[0].id);
  assert.equal(today.length, videos.length);
  assert.deepEqual(new Set(today.map((video) => video.id)), new Set(videos.map((video) => video.id)));
  assert.equal(today[0].popularity, 99);
  assert.ok(today[0].popularity > today[1].popularity);

  // The same edition day is stable, including late evening in New York.
  assert.equal(day("2026-11-06T04:30:00Z")[0].id, day("2026-11-05T15:00:00Z")[0].id);
  assert.equal(day("2026-11-07T03:30:00Z")[0].id, today[0].id);

  // Brands are interleaved, so the lead brand changes across consecutive days.
  const leadBrands = new Set(["2026-11-06", "2026-11-07", "2026-11-08"].map((date) => day(`${date}T15:00:00Z`)[0].brandSlug));
  assert.ok(leadBrands.size >= 2);
});
