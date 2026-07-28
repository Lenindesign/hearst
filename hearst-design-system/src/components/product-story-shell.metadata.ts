import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Product Specification Shell",
  description:
    "Production tooling modules shared by the four routed Hearst+ stakeholder specification pages: product story, value case, engineering blueprint, and token architecture.",
  level: "organism",
  path: "product-story-shell.tsx",
  exports: [
    "ProductHeader",
    "ProductFooter",
    "DemoNav",
    "StoryCard",
    "MobileMenuIcon",
    "BrandPortfolioGrid",
    "BrandLogoMarquee",
    "DestinationConvergence",
    "JourneyMatrix",
    "RankingExample",
    "ArchitectureFlow",
    "PaletteSystem",
    "BrandStyleGuide",
    "ProductPageId",
    "productImage",
    "streams",
    "prototypeStats",
    "brandSections",
    "portfolioBrands",
    "journeys",
    "valueProps",
    "systemSteps",
  ],
  whenToUse: [
    "A routed internal specification page needs the shared Hearst Magazines product-page navigation and footer",
    "Stakeholders need a source-backed diagram of the current Hearst+ portfolio, ranking, route, token, or journey contract",
    "Storybook needs to verify the exact modules already used by the production specification routes",
  ],
  whenNotToUse: [
    "A reader-facing Hearst+ destination needs navigation, cards, or ranking UI — use the production reader components",
    "A publication site needs a general marketing shell — this information architecture belongs only to the Hearst+ specification tool",
    "A new component needs reusable design-system tokens — do not copy the fixed stakeholder-narrative palette from this module",
  ],
  tokens: {
    colors: [],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "brand-logo-marquee",
    "fre/site-footer",
  ],
  usedBy: [],
  brandAware: true,
  responsive: true,
  variants: [
    "product story navigation",
    "value case navigation",
    "blueprint navigation",
    "token architecture navigation",
    "editorial story diagram",
    "commercial concept diagram",
    "compact brand portfolio",
    "complete brand portfolio",
  ],
  caveats: [
    "These are production modules for the stakeholder specification tool, not production reader components. Storybook keeps them in Design System Tooling so diagrams cannot be mistaken for shipped reader UI.",
    "DemoNav and StoryCard intentionally describe product concepts. Their figure and article names state that they are illustrative and non-interactive.",
    "The portfolio counts are current checked-in catalog facts. Run feed:validate before changing 859 stories, 29 brands, or the four destination totals.",
    "JourneyMatrix intentionally scrolls horizontally below its 820px table width; the page itself must never gain horizontal overflow.",
    "The fixed Hearst product-story palette and Tailwind slate scale predate the semantic tooling-token contract. The token audit retains this as known debt; do not copy those literals into new product components.",
  ],
  storybook: {
    kind: "direct",
    stories: [
      "src/stories/ProductSpecificationModules.stories.tsx",
    ],
    rationale:
      "The direct stories import the exact routed exports and separate them from reader-facing components. They specify desktop and phone navigation, current-page semantics, 44px targets, the non-interactive diagram boundary, both story-card concepts, portfolio and destination maps, journey/ranking evidence, architecture/palette guidance, brand style tiles, marquee behavior, and the shared footer.",
  },
  violations: [
    {
      type: "hardcoded-color",
      value: "#2D75B9",
      location: "shared product-page accent, focus, and Hearst logo treatment",
      severity: "warning",
    },
    {
      type: "hardcoded-color",
      value: "#102A43",
      location: "shared product-page deep surface and headline treatment",
      severity: "warning",
    },
    {
      type: "hardcoded-color",
      value: "#F8FAFC",
      location: "shared product-page canvas and diagram surface",
      severity: "warning",
    },
    {
      type: "non-semantic-tailwind",
      value: "slate-*",
      location: "stakeholder tooling borders, text, and neutral surfaces",
      severity: "warning",
    },
  ],
};

export default metadata;
