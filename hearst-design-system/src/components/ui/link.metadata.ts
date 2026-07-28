import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Link",
  description:
    "Token-driven anchor with primary or neutral color, optional underline, inherited or explicit size, and external-link treatment.",
  level: "atom",
  path: "ui/link.tsx",
  exports: ["LinkComponent", "linkVariants"],
  whenToUse: [
    "Navigation has a verified href and must retain native anchor behavior",
    "Inline utility text needs a visible link treatment or explicit external destination",
  ],
  whenNotToUse: [
    "An action changes local state without navigation; use Button",
    "An editorial story row needs the production full-row reader-opening behavior",
  ],
  tokens: {
    colors: [
      { variable: "--primary", via: "tailwind", usage: "text-primary" },
      { variable: "--foreground", via: "tailwind", usage: "text-foreground" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: ["ui/icons"],
  usedBy: [
    "article-page",
    "four-across-grid",
    "site-footer",
    "site-header",
    "content-reader-masthead",
    "hearst-games-index",
    "utility-bar",
    "home-page",
    "homepage-layouts",
    "link-page",
  ],
  brandAware: true,
  responsive: false,
  variants: [
    "primary",
    "neutral",
    "underline",
    "no-underline",
    "inherit",
    "xs",
    "sm",
    "base",
    "lg",
    "xl",
    "2xl",
    "external",
  ],
  caveats: [
    "External mode opens a new tab and supplies noopener noreferrer; the visible copy must still communicate the destination.",
  ],
};

export default metadata;
