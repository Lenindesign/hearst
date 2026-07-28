import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Brand Source Icon",
  description:
    "Decorative publication identity mark with a resilient initials fallback.",
  level: "molecule",
  path: "hearst-plus/brand-source-icon.tsx",
  exports: ["BrandSourceIcon"],
  whenToUse: [
    "A Hearst+ story, source filter, or recommendation needs compact publication identity",
    "The visible publication name already provides the accessible label",
    "A production surface must preserve source identity when a remote brand asset is unavailable",
  ],
  whenNotToUse: [
    "The publication logo is the primary heading or masthead — use the official BrandLogo",
    "The mark would repeat no additional source information",
    "The icon would be the only accessible name for an interactive control",
  ],
  tokens: {
    colors: [
      { variable: "--border", via: "tailwind", usage: "border-border" },
      { variable: "--background", via: "tailwind", usage: "bg-background" },
      { variable: "--primary", via: "tailwind", usage: "text-primary" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [],
  usedBy: [
    "brand-promotion-river-module",
    "content-reader-context-rail",
    "content-reader-recommendations",
    "delish-shorts-viewer",
    "discovery-sidebar",
    "featured-story-carousel",
    "onboarding-modal",
    "reader-account-ui",
    "story-metadata",
    "utility-bar",
    "vertical-video-carousel",
    "video-cards",
    "home-page",
  ],
  brandAware: true,
  responsive: true,
  variants: ["official icon", "initials fallback", "custom size"],
  caveats: [
    "The icon is decorative; adjacent text or a parent control must provide the accessible publication name.",
    "Icon sources come only from lib/logos.ts so the routed app and Storybook cannot maintain divergent URL lists.",
  ],
};

export default metadata;
