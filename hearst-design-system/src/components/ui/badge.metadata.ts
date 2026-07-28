import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Badge",
  description:
    "Compact label for status, category, or supporting metadata with semantic and legacy utility treatments.",
  level: "atom",
  path: "ui/badge.tsx",
  exports: ["Badge", "badgeVariants"],
  whenToUse: [
    "A short non-interactive status or category must remain visually distinct from body copy",
    "A link needs compact badge styling while preserving link semantics through the render prop",
  ],
  whenNotToUse: [
    "The label changes selection state; use Chip or Toggle",
    "The value needs explanatory text or an action; use Alert or a labelled control",
  ],
  tokens: {
    colors: [
      { variable: "--primary", via: "tailwind", usage: "bg-primary text-primary-foreground" },
      {
        variable: "--secondary",
        via: "tailwind",
        usage: "bg-secondary text-secondary-foreground",
      },
      { variable: "--destructive", via: "tailwind", usage: "text-destructive" },
      { variable: "--foreground", via: "tailwind", usage: "text-foreground" },
      { variable: "--ring", via: "tailwind", usage: "focus-visible:ring-ring/50" },
    ],
    typography: [],
    spacing: [],
    borders: [
      { variable: "--border", via: "tailwind", usage: "border-border" },
    ],
    other: [],
  },
  dependencies: [],
  usedBy: [
    "accordion-page",
    "badge-page",
    "button-page",
    "card-page",
    "carousel-page",
    "chip-page",
    "color-page",
    "divider-page",
    "form-label-page",
    "image-page",
    "input-page",
    "layout-page",
    "link-page",
    "media-page",
    "pagination-page",
    "token-dashboard",
    "tokens-page",
    "typography-page",
  ],
  brandAware: true,
  responsive: false,
  variants: [
    "default",
    "secondary",
    "destructive",
    "outline",
    "ghost",
    "link",
    "success",
    "warning",
    "highlight",
    "danger",
    "neutral-dark",
    "neutral-light",
  ],
  caveats: [
    "Status meaning must also be present in text; color alone is not sufficient.",
    "The success, warning, highlight, danger, and neutral variants still use fixed Tailwind palettes rather than canonical semantic status tokens.",
  ],
  violations: [
    {
      type: "non-semantic-tailwind",
      value: "emerald / amber / yellow / red / slate palettes",
      location: "badgeVariants status and neutral variants",
      severity: "warning",
    },
  ],
};

export default metadata;
