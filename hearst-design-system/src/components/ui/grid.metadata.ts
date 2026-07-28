import type { ComponentMetadata } from "@/lib/component-metadata";

export const gridMetadata: ComponentMetadata = {
  name: "Grid System",
  description:
    "Responsive 4 / 8 / 12 column grid with PageContainer, Grid, and Col primitives.",
  level: "atom",
  path: "ui/grid.tsx",
  exports: [
    "PageContainer",
    "Grid",
    "Col",
    "GridOverlay",
    "useBreakpoint",
    "BREAKPOINTS",
    "GRID_COLUMNS",
    "Breakpoint",
    "GridColumnCount",
    "PageContainerProps",
    "GridProps",
    "ColProps",
    "GridOverlayProps",
  ],
  whenToUse: [
    "As the spatial foundation for every page or template.",
    "When laying out content that should align with sibling pages.",
    "When you need declarative span/start props instead of hand-rolled grid utilities.",
  ],
  whenNotToUse: [
    "For tightly coupled component-internal layouts (use flex/grid locally).",
    "Below the level of an organism — atoms and molecules should not own a PageContainer.",
  ],
  tokens: {
    colors: [],
    typography: [],
    spacing: [
      {
        variable: "--grid-gutter-mobile / --grid-gutter-tablet / --grid-gutter-desktop",
        via: "css-var",
        usage: "Documented in globals.css; mirrored by gap utilities.",
      },
      {
        variable: "--grid-margin-mobile / --grid-margin-tablet / --grid-margin-desktop",
        via: "css-var",
        usage: "Outer padding on PageContainer.",
      },
    ],
    borders: [],
    other: [
      {
        variable: "--width-content-max / --breakpoint-*",
        via: "css-var",
        usage: "PageContainer width and breakpoint values shared with JS.",
      },
    ],
  },
  dependencies: [],
  usedBy: ["article-page", "utility-bar", "home-page", "hot-rod-events-page"],
  brandAware: false,
  responsive: true,
  variants: ["PageContainer.width", "Grid.columns", "Grid.gap", "Col.span/spanMd/spanLg"],
  slots: ["children"],
  caveats: [
    "All span/start values are restricted to literals so Tailwind can detect them at build time. Do not pass dynamic numbers — extend the lookup tables in grid.tsx instead.",
    "Grid.columns defaults to the responsive 4 / 8 / 12 contract. A single integer from 1 through 12 intentionally fixes that count at base, md, and lg.",
    "useBreakpoint is for documentation and edge cases; layout should stay in CSS.",
  ],
};

export default gridMetadata;
