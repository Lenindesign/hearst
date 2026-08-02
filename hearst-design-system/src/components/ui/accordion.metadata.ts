import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Accordion",
  description:
    "Base UI disclosure group with shared item, trigger, indicator, disabled, and animated panel behavior.",
  level: "atom",
  path: "ui/accordion.tsx",
  exports: ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"],
  whenToUse: [
    "Several related sections need progressive disclosure in one bounded surface",
    "A disclosure group needs keyboard behavior, disabled state, and single or multiple expansion",
  ],
  whenNotToUse: [
    "The content is short enough to remain visible without interaction",
    "Switching peer application views or routes; use Tabs or navigation instead",
  ],
  tokens: {
    colors: [
      { variable: "--ring", via: "tailwind", usage: "focus-visible:ring-ring/50" },
      {
        variable: "--muted-foreground",
        via: "tailwind",
        usage: "text-muted-foreground",
      },
    ],
    typography: [],
    spacing: [],
    borders: [
      { variable: "--border", via: "tailwind", usage: "border-b" },
    ],
    other: [],
  },
  dependencies: ["ui/icons"],
  usedBy: ["accordion-page", "reader-account-ui"],
  brandAware: true,
  responsive: false,
  variants: ["single", "multiple", "indicator-start", "indicator-end"],
  slots: ["item", "trigger", "content"],
  caveats: [
    "The consuming surface owns section labels and decides whether collapsing already-open content is appropriate.",
  ],
};

export default metadata;
