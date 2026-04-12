import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "ArticleCard",
  description:
    "Editorial content card with image, eyebrow category, title, description, and author metadata. The primary content unit across Hearst brands.",
  level: "molecule",
  path: "ui/article-card.tsx",
  exports: [
    "ArticleCard",
    "ArticleCardImage",
    "ArticleCardContent",
    "ArticleCardEyebrow",
    "ArticleCardTitle",
    "ArticleCardDescription",
    "ArticleCardMeta",
    "ArticleCardMetaItem",
    "ArticleCardMetaDot",
    "ArticleCardAuthor",
    "ArticleCardFooter",
    "articleCardVariants",
  ],

  whenToUse: [
    "Article listings and feeds across all 29 brands",
    "Homepage content grids",
    "Related articles sections",
    "Search results with editorial content",
  ],
  whenNotToUse: [
    "Product cards or commerce content — build a ProductCard molecule",
    "Non-editorial content without author/date metadata",
  ],

  tokens: {
    colors: [
      { variable: "--card", via: "tailwind", usage: "bg-card" },
      { variable: "--card-foreground", via: "tailwind", usage: "text-card-foreground" },
      { variable: "--primary", via: "tailwind", usage: "text-primary" },
      { variable: "--foreground", via: "tailwind", usage: "text-foreground" },
    ],
    typography: [
      { variable: "--text-token-4xs", via: "css-var", usage: "var(--text-token-4xs)" },
      { variable: "--text-token-3xs", via: "css-var", usage: "var(--text-token-3xs)" },
      { variable: "--font-brand-secondary", via: "css-var", usage: "var(--font-brand-secondary)" },
    ],
    spacing: [],
    borders: [
      { variable: "--foreground", via: "tailwind", usage: "ring-foreground/10" },
    ],
    other: [],
  },

  dependencies: [],
  usedBy: ["card-page", "home-page", "article-page"],
  brandAware: true,
  responsive: true,
  variants: ["vertical", "horizontal", "featured"],
  slots: ["image", "content", "meta", "footer"],
};

export default metadata;
