import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Card",
  description:
    "Container for grouped content with optional header, footer, and action slots. Foundation for article cards, feature cards, and dashboard panels.",
  level: "atom",
  path: "ui/card.tsx",
  exports: [
    "Card",
    "CardHeader",
    "CardFooter",
    "CardTitle",
    "CardAction",
    "CardDescription",
    "CardContent",
  ],

  whenToUse: [
    "Grouping related content visually (articles, products, profiles)",
    "Dashboard panels or data summaries",
    "Any elevated surface that separates content from the background",
  ],
  whenNotToUse: [
    "Simple layout sections without visual separation — use a div with spacing",
    "Navigation items — use a list or nav pattern",
  ],

  tokens: {
    colors: [
      { variable: "--card", via: "tailwind", usage: "bg-card" },
      { variable: "--card-foreground", via: "tailwind", usage: "text-card-foreground" },
      { variable: "--foreground", via: "tailwind", usage: "ring-foreground/10" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },

  dependencies: [],
  usedBy: [
    "card-page",
    "badge-page",
    "button-page",
    "chip-page",
    "carousel-page",
    "accordion-page",
    "divider-page",
    "form-label-page",
    "image-page",
    "input-page",
    "link-page",
    "media-page",
    "pagination-page",
    "token-dashboard",
    "home-page",
    "article-page",
    "tokens-page",
    "typography-page",
  ],
  brandAware: true,
  responsive: false,
  slots: ["header", "content", "footer", "action"],
};

export default metadata;
