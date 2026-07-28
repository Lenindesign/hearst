import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Content Reader Dialog Shell",
  description:
    "Production body-level modal shell for the standard Hearst+ story reader, including responsive geometry, modal isolation, nested-layer coordination, keyboard containment, and opener restoration.",
  level: "organism",
  path: "hearst-plus/content-reader-dialog-shell.tsx",
  exports: [
    "rememberContentReaderReturnFocus",
    "ContentReaderDialogShell",
    "ContentReaderDialogShellProps",
  ],
  whenToUse: [
    "The routed Hearst+ application opens its standard in-app story reader",
    "A reader composition needs one body-level modal boundary around the production masthead, story queue, article content, recommendations, comments, and advertising",
    "A nested fullscreen gallery or Ambient Reader must temporarily isolate the standard reader beneath it",
  ],
  whenNotToUse: [
    "A standalone dialog does not need the complete story-reader lifecycle — use the appropriate modal primitive or owned product dialog",
    "A story needs only its article body, masthead, controls, comments, recommendations, or image viewer — use those extracted reader components directly",
    "A Storybook example would render an empty shell without the shipped reader composition — use the integrated Reader Overlays specifications",
  ],
  tokens: {
    colors: [
      {
        variable: "--foreground",
        via: "tailwind",
        usage: "semantic backdrop tint and reader foreground",
      },
      {
        variable: "--background",
        via: "tailwind",
        usage: "reader canvas surface",
      },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "ui/use-modal-isolation",
  ],
  usedBy: [
    "home-page",
  ],
  brandAware: false,
  responsive: true,
  variants: [
    "light reader",
    "dark reader",
    "phone full-viewport",
    "inset desktop",
    "nested dialog isolated",
  ],
  slots: [
    "reader content",
  ],
  caveats: [
    "The shell owns modality and geometry, not publication identity or article content; those remain child production components.",
    "The backdrop is intentionally non-semantic. The shell itself is the single dialog named Story reader.",
    "Focus restoration first uses the live opener, then a stored aria-label after routed return, and retries for up to three seconds while the route remounts.",
    "Setting nestedDialogOpen suppresses this shell's Escape and Tab handling while the topmost gallery or Ambient Reader owns focus.",
  ],
  storybook: {
    kind: "integrated",
    stories: [
      "src/stories/HearstPlusReaderOverlays.stories.tsx",
    ],
    rationale:
      "The shell has no production-meaningful empty state. Five Reader Overlays stories exercise it through the exact HomePageTemplate composition, including publication and destination identity, forward and reverse focus wrapping, Escape and opener restoration, nested gallery isolation, Ambient Reader handoff, and article failure. An isolated shell story would remove the behavior its API exists to coordinate.",
  },
};

export default metadata;
