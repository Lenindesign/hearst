import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Adaptive Video",
  description:
    "Shared production video player for direct MP4 and adaptive HLS playback with retryable failure handling.",
  level: "molecule",
  path: "adaptive-video.tsx",
  exports: ["AdaptiveVideo", "AdaptiveVideoProps"],
  whenToUse: [
    "A Hearst+ video surface must play a selected direct H.264 MP4 or HLS source",
    "The same media element must expose native playback attributes and a forwarded ref",
    "Playback failure must replace an inert video with an announced retry state",
  ],
  whenNotToUse: [
    "The record has no playable video source — filter it before building a video feed",
    "The surface needs the Delish Shorts reel, story actions, or feed-card chrome — compose those around AdaptiveVideo",
    "The source is an unsupported aspect ratio or codec that production eligibility rules reject",
  ],
  tokens: {
    colors: [],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: ["ui/button"],
  usedBy: [
    "delish-shorts-viewer",
    "video-cards",
    "home-page",
  ],
  brandAware: false,
  responsive: true,
  variants: [
    "direct MP4",
    "adaptive HLS",
    "portrait media",
    "retryable playback error",
    "unavailable source",
  ],
  caveats: [
    "HLS plays natively where supported and otherwise loads hls.js with one network and one media recovery attempt.",
    "Autoplay callers must supply muted playback when browser policy requires it.",
    "Caption and transcript availability remains a production content requirement outside this playback primitive.",
    "A missing source is announced as unavailable and intentionally does not expose a retry control.",
  ],
};

export default metadata;
