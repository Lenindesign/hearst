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
    colors: [],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },

  dependencies: [],
  usedBy: [],
  brandAware: false,
  responsive: true,

  violations: [
    {
      type: "non-semantic-tailwind",
      value: "border-emerald-700, bg-emerald-950, text-emerald-400, bg-emerald-500, text-emerald-300",
      location: "special-offers.tsx lines 25-56",
      severity: "warning",
    },
  ],

  caveats: [
    "Currently uses hardcoded emerald Tailwind colors — should be tokenized to support brand theming",
    "Not brand-aware yet: all brands get the same green treatment",
  ],
};

export default metadata;
