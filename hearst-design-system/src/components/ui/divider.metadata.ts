import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Divider",
  description:
    "Semantic horizontal separator with subtle or emphasized color and three thickness options.",
  level: "atom",
  path: "ui/divider.tsx",
  exports: ["Divider", "dividerVariants"],
  whenToUse: [
    "Adjacent content groups need a visible horizontal boundary",
    "A section boundary must use the shared semantic border or foreground role",
  ],
  whenNotToUse: [
    "Spacing or hierarchy already separates the content",
    "A vertical separator or decorative rule is required",
  ],
  tokens: {
    colors: [
      { variable: "--border", via: "tailwind", usage: "bg-border" },
      { variable: "--foreground", via: "tailwind", usage: "bg-foreground" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [],
  usedBy: ["divider-page", "home-page"],
  brandAware: true,
  responsive: false,
  variants: ["subtle", "default", "sm", "md", "lg"],
  caveats: [
    "The component renders an hr element and should separate related thematic content, not provide decoration alone.",
  ],
};

export default metadata;
