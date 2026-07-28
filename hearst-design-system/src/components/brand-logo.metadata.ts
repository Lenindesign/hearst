import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Brand Logo",
  description:
    "Production renderer for canonical Hearst destination and publication wordmarks from the local SVG asset registry.",
  level: "molecule",
  path: "brand-logo.tsx",
  exports: ["BrandLogo", "BrandLogoProps"],
  whenToUse: [
    "A destination masthead, publication masthead, reader surface, or stakeholder specification needs official brand identity",
    "A monochrome registered wordmark needs the documented light-on-dark treatment",
    "A brand name must remain consistent across production and Storybook",
  ],
  whenNotToUse: [
    "A dense metadata row needs a compact publication mark — use BrandSourceIcon",
    "No approved asset exists in lib/logos.ts — leave the logo absent until the canonical asset is registered",
    "A caller wants to stretch every publication to a common width — size by visual cap height and preserve intrinsic proportions",
  ],
  tokens: {
    colors: [],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [],
  usedBy: [
    "article-page",
    "ambient-reader",
    "brand-promotion-river-module",
    "content-reader-masthead",
    "home-page",
    "homepage-layouts",
    "hot-rod-events-page",
    "nav-bar",
    "reader-account-ui",
  ],
  brandAware: true,
  responsive: true,
  variants: [
    "native wordmark",
    "monochrome color override",
    "accessible standalone identity",
    "decorative adjacent identity",
    "loading",
    "asset error",
  ],
  caveats: [
    "The asset registry and canonical accessible names are owned together in lib/logos.ts; Storybook does not maintain a parallel logo list.",
    "Consumers own cap height and available width through className. The component preserves each SVG viewBox and never forces a common aspect ratio.",
    "Only registered local SVG wordmarks are injected. The loader removes embedded styles, executable or foreign content, event handlers, and source title/description nodes; the wrapper owns one consistent accessible name.",
    "Unknown registry keys intentionally render nothing. Load failures preserve the named wrapper with data-state='error' so consumers and tests can distinguish an unavailable approved asset from an unknown brand.",
    "The color override is for approved monochrome treatments. Compact and multicolor publication icons remain the responsibility of BrandSourceIcon.",
  ],
  storybook: {
    kind: "direct",
    stories: [
      "src/stories/BrandLogos.stories.tsx",
      "src/stories/Typography.stories.tsx",
    ],
    rationale:
      "Five direct Brand Logo stories import the exact production export and specify the complete destination and publication registries, canonical accessible names, sanitized SVG semantics, documented light-on-dark treatment, decorative usage, unknown-key omission, intrinsic sizing, and 320px containment. The production-aligned Typography story also uses the same renderer for its selected publication identity.",
  },
};

export default metadata;
