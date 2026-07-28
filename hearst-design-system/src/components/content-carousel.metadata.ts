import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "ContentCarousel",
  description:
    "Horizontal editorial-card carousel with previous and next controls plus optional position indicators.",
  level: "organism",
  path: "content-carousel.tsx",
  exports: ["ContentCarousel", "CarouselCard"],

  whenToUse: [
    "Editorial content feeds that need horizontal browsing (Editor's Picks, Trending)",
    "Image galleries with titles",
    "Any horizontally scrollable card row with prev/next navigation",
  ],
  whenNotToUse: [
    "Single hero images — use a static hero section",
    "Vertical content lists — use a grid or stack layout",
    "Fewer than 3 items — a static row is simpler",
  ],

  tokens: {
    colors: [
      { variable: "--foreground", via: "tailwind", usage: "bg-foreground" },
      { variable: "--background", via: "tailwind", usage: "text-background" },
      { variable: "--muted", via: "tailwind", usage: "bg-muted" },
      { variable: "--muted-foreground", via: "tailwind", usage: "bg-muted-foreground/30" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },

  dependencies: ["ui/carousel", "ui/icons"],
  usedBy: [],
  brandAware: true,
  responsive: true,
  variants: [],
  slots: [],
  caveats: [
    "The current 255px by 341px card treatment is a fixed presentation contract and requires explicit mobile and content-length review before broader production reuse.",
    "The component owns presentation and controls only; a consuming product module must own editorial ranking, empty state, and destination behavior.",
    "Uses the shared Embla-backed ui/carousel track.",
  ],
};

export default metadata;
