import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Story Metadata",
  description:
    "Shared Hearst+ publication source, byline, live-feed, and recommendation metadata contracts.",
  level: "molecule",
  path: "hearst-plus/story-metadata.tsx",
  exports: [
    "getLifestyleByline",
    "LifestyleBrandSource",
    "LiveStoryBadge",
    "LifestyleRecommendationReason",
  ],
  whenToUse: [
    "A reader card needs the canonical publication route, topic, and byline",
    "A live-feed record needs a non-color-only current-story status",
    "A recommendation needs a concise explanatory reason",
  ],
  whenNotToUse: [
    "The surface needs article-body author details or a full publication masthead",
    "A recommendation reason is unavailable — omit the element instead of inventing copy",
    "A non-Hearst source cannot resolve through the production publication routes",
  ],
  tokens: {
    colors: [
      {
        variable: "--palette-alert-success-600",
        via: "css-var",
        usage: "Live-feed status dot",
      },
      {
        variable: "--muted-foreground",
        via: "tailwind",
        usage: "Source and recommendation copy",
      },
    ],
    typography: [
      {
        variable: "--text-token-4xs",
        via: "css-var",
        usage: "Compact publication metadata",
      },
    ],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "hearst-plus/brand-source-icon",
    "lifestyle-river-types",
  ],
  usedBy: [
    "ambient-reader",
    "brand-promotion-river-module",
    "content-reader-context-rail",
    "content-reader-recommendations",
    "discovery-sidebar",
    "featured-story-carousel",
    "reader-action-bar",
    "story-actions",
    "video-cards",
    "home-page",
  ],
  brandAware: true,
  responsive: true,
  variants: [
    "publication source link",
    "live-feed status",
    "recommendation reason",
    "byline precedence",
  ],
  caveats: [
    "Bylines resolve in production order: live article, checked-in story, then publication editors.",
    "LiveStoryBadge must retain its screen-reader text because the visible status is color-only.",
    "Publication source links stop event propagation so nested card navigation does not also activate.",
  ],
};

export default metadata;
