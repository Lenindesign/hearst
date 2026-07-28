import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "HOT ROD Events Templates",
  description:
    "Production HOT ROD event hub and event-detail templates for Power Tour and Drag Week routes.",
  level: "template",
  path: "hot-rod-events-page.tsx",
  exports: [
    "HotRodEventsPage",
    "HotRodDragWeekPage",
  ],
  whenToUse: [
    "The HOT ROD Events route needs the complete event calendar, Power Tour coverage, and annual-series navigation",
    "The Power Tour route needs the current edition detail treatment without the complete event calendar",
    "The Drag Week route needs its race schedule, sold-out racer state, spectator ticket options, and official resource links",
  ],
  whenNotToUse: [
    "A general Autos or publication page needs shared navigation or cards — use the reusable production components directly",
    "Another publication needs an event template — this composition and its scoped palette are approved only for HOT ROD",
    "Event availability must be fetched live — these templates render checked-in public event information and explicitly direct readers to official sources",
  ],
  tokens: {
    colors: [
      { variable: "--hot-rod-events-red", via: "css-var", usage: "event actions, status, and editorial accent" },
      { variable: "--hot-rod-events-red-dark", via: "css-var", usage: "event action hover treatment" },
      { variable: "--hot-rod-events-red-light", via: "css-var", usage: "reserved scoped event accent" },
      { variable: "--hot-rod-events-black", via: "css-var", usage: "event hero and schedule surfaces" },
      { variable: "--hot-rod-events-asphalt", via: "css-var", usage: "event dark supporting surface" },
      { variable: "--hot-rod-events-cream", via: "css-var", usage: "route and resources surface" },
      { variable: "--background", via: "tailwind", usage: "bg-background for shared light sections" },
      { variable: "--foreground", via: "tailwind", usage: "text-foreground for shared body content" },
      { variable: "--border", via: "tailwind", usage: "border-border for shared dividers and cards" },
    ],
    typography: [
      { variable: "--font-brand", via: "css-var", usage: "HOT ROD navigation and body copy" },
      { variable: "--font-headline", via: "css-var", usage: "condensed event headings" },
    ],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "brand-logo",
    "fre/site-footer",
    "hearst-plus/utility-bar",
    "home-page",
    "theme-provider",
    "ui/button",
    "ui/grid",
    "ui/icons",
  ],
  usedBy: [],
  brandAware: true,
  responsive: true,
  variants: [
    "event hub",
    "Power Tour detail",
    "Drag Week detail",
    "calendar view",
    "list view",
    "registration open",
    "registration closed",
    "sold out",
    "underway",
    "concluded",
  ],
  caveats: [
    "Production application routes are the source of truth. The direct stories import these exact exports and do not maintain a parallel template.",
    "The HOT ROD palette is an approved route-scoped composition documented in BRAND_STYLES.md; it must not leak into shared Autos or publication components.",
    "Event dates, availability, ticket terms, and external links are checked-in public information rather than a live organizer integration. The production footer tells readers to confirm with the organizer.",
    "The horizontal production navigation intentionally scrolls on narrow screens; active-item visibility and edge discoverability require continued responsive review.",
  ],
  storybook: {
    kind: "direct",
    stories: [
      "src/stories/HearstPlusHotRodEvents.stories.tsx",
    ],
    rationale:
      "Five direct stories import the exact routed exports and specify the event hub, Power Tour detail, Drag Week detail, calendar/list interaction, event and ticket states, and the two distinct mobile compositions.",
  },
  violations: [
    {
      type: "hardcoded-color",
      value: "#C8101E, #991019, #FF6A73, #111111, #242424, #F3EBDD",
      location: "route-scoped HOT ROD Events custom-property values",
      severity: "warning",
    },
  ],
};

export default metadata;
