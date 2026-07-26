import assert from "node:assert/strict";
import test from "node:test";

import { getPreferredVideoTranscoding } from "./video-transcoding";

test("rejects underscore-form H.265 and selects an H.264 MP4", () => {
  const selected = getPreferredVideoTranscoding([
    {
      codec: "H_265",
      display_name: "720P",
      full_url: "https://media.example/video_720p_hd.mp4",
      height: 1280,
      preset_name: "video_720p_hd",
      width: 720,
    },
    {
      codec: "H_264",
      display_name: "360P",
      full_url: "https://media.example/video_360p_sd.mp4",
      height: 640,
      preset_name: "video_360p_sd",
      width: 360,
    },
  ]);

  assert.equal(selected?.codec, "H_264");
  assert.equal(selected?.full_url, "https://media.example/video_360p_sd.mp4");
});

test("does not mistake an HLS manifest for a direct MP4", () => {
  const selected = getPreferredVideoTranscoding([
    {
      codec: "H_265",
      display_name: "720P",
      full_url: "https://media.example/video_720p_hd.mp4",
    },
    {
      full_url:
        "https://media.example/video_360p_sd.mp4,video_720p_hd.mp4/master.m3u8",
      preset_name: "apple_m3u8",
    },
  ]);

  assert.match(selected?.full_url ?? "", /\.m3u8$/);
});
