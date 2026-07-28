import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Featured Story Carousel",
  description:
    "Production five-story editorial carousel for Today’s Picks and destination or publication featured-story modules.",
  level: "organism",
  path: "hearst-plus/featured-story-carousel.tsx",
  exports: [
    "FeaturedStoryCarousel",
    "FeaturedStoryCarouselProps",
  ],
  whenToUse: [
    "A ranked Hearst+ edition needs one prominent mixed-format lead module with article and video stories",
    "A destination or publication needs the shared Featured stories anatomy with its own eligible story allocation",
    "Readers need direct Save, More like this, Follow, swipe, keyboard, and slide-selection behavior in the lead module",
  ],
  whenNotToUse: [
    "The surface has fewer than one eligible story — omit the carousel rather than rendering an empty frame",
    "The experience needs a generic image carousel without editorial metadata or reader actions",
    "A story list must display every item simultaneously rather than one active story with bounded navigation",
  ],
  tokens: {
    colors: [
      { variable: "--hp-background", via: "css-var", usage: "destination foundation surrounding the production module" },
      { variable: "--hp-surface", via: "css-var", usage: "carousel action surface" },
      { variable: "--hp-text-primary", via: "css-var", usage: "destination text foundation" },
      { variable: "--hp-image-scrim-soft", via: "css-var", usage: "upper image-to-copy gradient" },
      { variable: "--hp-image-scrim-strong", via: "css-var", usage: "mid-image title contrast" },
      { variable: "--hp-image-scrim-solid", via: "css-var", usage: "lower image title contrast" },
      { variable: "--primary", via: "tailwind", usage: "focus, selected indicator, saved action, and brand-follow states" },
      { variable: "--muted", via: "tailwind", usage: "quiet control hover surfaces" },
      { variable: "--muted-foreground", via: "tailwind", usage: "quiet reader actions and inactive indicators" },
      { variable: "--border", via: "tailwind", usage: "module and action-surface borders" },
    ],
    typography: [
      { variable: "--font-headline", via: "class", usage: "production editorial story headline" },
    ],
    spacing: [],
    borders: [
      { variable: "--border", via: "tailwind", usage: "border-border on the module and source icon" },
    ],
    other: [
      { variable: "--hp-shadow-card", via: "css-var", usage: "production card elevation" },
    ],
  },
  dependencies: [
    "hearst-plus/brand-source-icon",
    "hearst-plus/story-metadata",
    "hearst-plus/use-prefers-reduced-motion",
    "hearst-plus/video-format",
    "lifestyle-river-types",
    "ui/button",
    "ui/icons",
  ],
  usedBy: [
    "home-page",
  ],
  brandAware: true,
  responsive: true,
  variants: [
    "Today’s Picks mixed edition",
    "destination or publication Featured stories",
    "interactive",
    "mobile",
    "saved story",
    "single story",
    "empty allocation",
    "reduced motion",
  ],
  caveats: [
    "Production feed allocation owns eligibility and ordering; this component owns only presentation and carousel behavior.",
    "Automatic rotation stops when the reader pauses, drags, or requests reduced motion. The active slide is the only operable slide.",
    "Checked-in Storybook fixtures intentionally stay deterministic and representative; they do not claim to reproduce one reader’s live personalized story order.",
    "Publication indicator palettes must resolve through approved brand tokens rather than arbitrary per-story colors.",
  ],
  storybook: {
    kind: "direct",
    stories: [
      "src/stories/HearstPlusFeaturedCarousel.stories.tsx",
    ],
    rationale:
      "Seven direct stories import the production component and specify mixed article/video allocation, active-slide semantics, reader actions, mobile targets, saved state, publication treatment, single-story fallback, empty allocation, and reduced-motion behavior.",
  },
};

export default metadata;
