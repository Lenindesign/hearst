import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Separator",
  description:
    "Accessible one-pixel horizontal or vertical boundary built on Base UI Separator.",
  level: "atom",
  path: "ui/separator.tsx",
  exports: ["Separator"],
  whenToUse: [
    "A production layout needs a consistent one-pixel boundary",
    "A horizontal or vertical boundary must expose separator semantics to assistive technology",
    "Repeated lists, footers, or reference sections use the shared semantic border color",
  ],
  whenNotToUse: [
    "A horizontal rule needs thickness or emphasis variants — use Divider",
    "Spacing and hierarchy already communicate the grouping",
    "The line is purely decorative and should not be announced as a content boundary",
  ],
  tokens: {
    colors: [
      { variable: "--border", via: "tailwind", usage: "bg-border" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [],
  usedBy: [
    "accordion-page",
    "article-page",
    "badge-page",
    "button-page",
    "card-page",
    "carousel-page",
    "chip-page",
    "color-page",
    "divider-page",
    "form-label-page",
    "article-byline",
    "big-story-feed",
    "related-articles",
    "site-footer",
    "homepage-layouts",
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
  responsive: true,
  variants: ["horizontal", "vertical"],
  caveats: [
    "Separator is always one pixel thick; use Divider for visual weight variants.",
    "The Base UI primitive renders role=separator and aria-orientation for both axes.",
  ],
};

export default metadata;
