import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Design System Navigation",
  description:
    "Production shell navigation for the routed Hearst design-system documentation site, including brand preview, component subnavigation, Storybook handoff, and responsive disclosure behavior.",
  level: "organism",
  path: "nav-bar.tsx",
  exports: [
    "DesignSystemNavBar",
    "NavBar",
    "DesignSystemNavBarProps",
  ],
  whenToUse: [
    "A routed design-system documentation page needs the shared tool header and current-section navigation",
    "A component specification page needs the complete component subnavigation",
    "Storybook needs to verify the exact presentational shell independently from Next.js routing",
  ],
  whenNotToUse: [
    "A Hearst+ reader destination needs product navigation — use the production UtilityBar and MainNav boundaries",
    "An article reader needs its publication or destination masthead — use ContentReaderMasthead",
    "A consumer product needs a generic application header — this information architecture is specific to the design-system documentation tool",
  ],
  tokens: {
    colors: [
      { variable: "--background", via: "tailwind", usage: "sticky header, disclosure, and scroll hints" },
      { variable: "--foreground", via: "tailwind", usage: "active navigation, active component labels, and fallback brand mark" },
      { variable: "--muted", via: "tailwind", usage: "active and hover navigation states" },
      { variable: "--muted-foreground", via: "tailwind", usage: "inactive links and current preview label" },
      { variable: "--primary", via: "tailwind", usage: "active component subnavigation background tint" },
      { variable: "--border", via: "tailwind", usage: "header and disclosure boundaries" },
    ],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "theme-provider",
    "brand-switcher",
    "brand-logo",
    "ui/icons",
  ],
  usedBy: [
    "home-page",
    "token-dashboard",
    "tokens-page",
  ],
  brandAware: true,
  responsive: true,
  variants: [
    "primary documentation navigation",
    "component documentation navigation",
    "mobile disclosure closed",
    "mobile disclosure open",
  ],
  caveats: [
    "This is production for the design-system documentation tool, not for the Hearst+ reader product. Storybook keeps it in a separate Tooling hierarchy so the two navigation systems are not conflated.",
    "NavBar supplies the live Next.js pathname and environment-aware Storybook URL. DesignSystemNavBar is the same renderer with those two inputs made explicit for deterministic specifications.",
    "The mobile menu is a non-modal disclosure: it does not dim, inert, or trap the page. Escape closes it and restores the toggle focus; every phone link and toggle retains a 44px target.",
    "At desktop widths the documentation title stays visually hidden until 1536px so primary navigation and the brand preview remain available without clipping.",
  ],
  storybook: {
    kind: "direct",
    stories: [
      "src/stories/DesignSystemNavigation.stories.tsx",
    ],
    rationale:
      "The direct stories import the exact DesignSystemNavBar renderer used by NavBar. They specify the documentation-home state, component subnavigation and current-page semantics, named brand preview, external Storybook handoff, and mobile disclosure target, Escape, and focus-restoration behavior.",
  },
};

export default metadata;
