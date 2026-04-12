import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "ContentCarousel",
  description:
    "Horizontal scrolling card carousel with pill-shaped navigation buttons and optional dot indicators. Ported from Pencil spec carousel.pen node C2n6G.",
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

  dependencies: ["ui/carousel"],
  usedBy: [],
  brandAware: true,
  responsive: true,
  variants: [],
  slots: [],
  caveats: [
    "Card width is fixed at 255px to match Pencil spec — may need responsive adjustment",
    "Image aspect ratio is portrait (255×341) per the automotive/editorial Pencil template",
    "Uses Embla Carousel under the hood via ui/carousel primitives",
  ],
};

export default metadata;
