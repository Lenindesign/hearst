import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Utility Bar",
  description:
    "Production Hearst+ destination switcher, publication menu, utility links, and reader-account entry.",
  level: "organism",
  path: "hearst-plus/utility-bar.tsx",
  exports: ["UtilityBar", "UtilityBarProps", "hearstDestinationSections"],
  whenToUse: [
    "A Hearst+ destination or publication page needs the shared top-level destination switcher",
    "The surface must expose Shop, Newsletter, and reader-account entry in the production header hierarchy",
    "A dark Videos surface needs the scoped knockout navigation treatment",
  ],
  whenNotToUse: [
    "A component needs its own tabs or filters — use local navigation rather than duplicating the application utility bar",
    "A Storybook-only page needs design-system navigation — use NavBar",
    "A publication masthead needs topic navigation — use MainNav below the utility bar",
  ],
  tokens: {
    colors: [
      { variable: "--primary", via: "tailwind", usage: "light utility-bar background and active content" },
      { variable: "--primary-foreground", via: "tailwind", usage: "light utility-bar content" },
      { variable: "--component-navigation-utility-background-knockout", via: "css-var", usage: "dark Videos background" },
      { variable: "--component-navigation-utility-content-knockout", via: "css-var", usage: "dark Videos content" },
      { variable: "--component-navigation-utility-content-accent", via: "css-var", usage: "dark active destination and section accent" },
      { variable: "--component-navigation-utility-megamenu-background-knockout", via: "css-var", usage: "dark publication-menu surface" },
    ],
    typography: [
      { variable: "--text-token-4xs", via: "css-var", usage: "compact utility labels" },
    ],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "hearst-plus/brand-source-icon",
    "reader-account-ui",
    "reader-account",
    "theme-provider",
    "ui/button",
    "ui/grid",
    "ui/link",
  ],
  usedBy: [
    "home-page",
    "hot-rod-events-page",
  ],
  brandAware: true,
  responsive: true,
  variants: [
    "light destination",
    "dark Videos",
    "guest account entry",
    "signed-in profile entry",
    "selected publication",
    "destination publication menu",
    "mobile horizontal destination navigation",
  ],
  caveats: [
    "The mobile bar is 44px tall so its required touch targets remain inside the layout boundary; desktop retains the compact 32px bar.",
    "Destination links open their publication menu on hover or keyboard focus and still navigate to the canonical destination route.",
    "Publication icons reuse BrandSourceIcon so failed remote assets preserve deterministic source initials.",
    "Reader account data comes from the shared browser-local prototype provider; the utility bar only invokes the supplied account callbacks.",
  ],
};

export default metadata;
