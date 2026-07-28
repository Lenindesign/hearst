import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "SpecialOffers",
  description:
    "Promotional offer bar displaying deal pills with dollar icons and optional expiration dates. Designed for automotive and commerce brand contexts.",
  level: "molecule",
  path: "special-offers.tsx",
  exports: ["SpecialOffers", "Offer"],

  whenToUse: [
    "Automotive brand pages (Car and Driver, Autoweek) showing financing deals",
    "Commerce sections with time-limited promotions",
    "Any context requiring multiple promotional badges in a row",
  ],
  whenNotToUse: [
    "Single-line promotional banners — use a Banner component",
    "Non-promotional content tags — use Badge or Chip",
  ],

  tokens: {
    colors: [
      { variable: "--component-special-offers-background-start", via: "tailwind", usage: "from-[var(--component-special-offers-background-start)]" },
      { variable: "--component-special-offers-background-end", via: "tailwind", usage: "to-[var(--component-special-offers-background-end)]" },
      { variable: "--component-special-offers-border-default", via: "tailwind", usage: "border-[var(--component-special-offers-border-default)]" },
      { variable: "--component-special-offers-title-content-default", via: "tailwind", usage: "text-[var(--component-special-offers-title-content-default)]" },
      { variable: "--component-special-offers-pill-background-default", via: "tailwind", usage: "bg-[var(--component-special-offers-pill-background-default)]" },
      { variable: "--component-special-offers-pill-border-default", via: "tailwind", usage: "border-[var(--component-special-offers-pill-border-default)]" },
      { variable: "--component-special-offers-icon-background-default", via: "tailwind", usage: "bg-[var(--component-special-offers-icon-background-default)]" },
      { variable: "--component-special-offers-content-default", via: "tailwind", usage: "text-[var(--component-special-offers-content-default)]" },
      { variable: "--component-special-offers-expiration-content-default", via: "tailwind", usage: "text-[var(--component-special-offers-expiration-content-default)]" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },

  dependencies: ["ui/icons"],
  usedBy: [],
  brandAware: false,
  responsive: true,

  violations: [],

  caveats: [
    "The semantic offer palette is intentionally shared across brands; publication-specific promotion themes require an approved token override.",
  ],
};

export default metadata;
