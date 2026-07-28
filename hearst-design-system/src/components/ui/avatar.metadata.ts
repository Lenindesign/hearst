import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Avatar",
  description:
    "Base UI identity image with fallback, status badge, grouped presentation, and bounded count treatment.",
  level: "atom",
  path: "ui/avatar.tsx",
  exports: [
    "Avatar",
    "AvatarImage",
    "AvatarFallback",
    "AvatarGroup",
    "AvatarGroupCount",
    "AvatarBadge",
  ],
  whenToUse: [
    "A reader, author, or account identity needs a compact image with deterministic fallback",
    "A bounded group needs overlapping identity images and an explicit remaining count",
  ],
  whenNotToUse: [
    "A publication or destination identity is required; use the registered brand logo",
    "A decorative portrait has no identity meaning",
  ],
  tokens: {
    colors: [
      { variable: "--muted", via: "tailwind", usage: "bg-muted" },
      {
        variable: "--muted-foreground",
        via: "tailwind",
        usage: "text-muted-foreground",
      },
      { variable: "--primary", via: "tailwind", usage: "bg-primary" },
      {
        variable: "--primary-foreground",
        via: "tailwind",
        usage: "text-primary-foreground",
      },
    ],
    typography: [],
    spacing: [],
    borders: [
      { variable: "--border", via: "tailwind", usage: "after:border-border" },
      { variable: "--background", via: "tailwind", usage: "ring-background" },
    ],
    other: [],
  },
  dependencies: [],
  usedBy: ["reader-action-bar", "reader-account-ui"],
  brandAware: true,
  responsive: false,
  variants: ["sm", "default", "lg"],
  slots: ["image", "fallback", "badge", "group", "group-count"],
  caveats: [
    "AvatarImage needs meaningful alternative text when the identity is not already named by adjacent content.",
  ],
};

export default metadata;
