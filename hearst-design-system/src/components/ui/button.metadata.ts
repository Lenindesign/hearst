import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Button",
  description:
    "Primary interactive element for actions. Supports multiple variants, sizes, and states via CVA.",
  level: "atom",
  path: "ui/button.tsx",
  exports: ["Button", "buttonVariants"],

  whenToUse: [
    "Any clickable action that triggers a state change or navigation",
    "Form submissions",
    "Dialog triggers and confirmations",
    "CTA elements in marketing layouts",
  ],
  whenNotToUse: [
    "Navigation between pages — use Link instead",
    "Toggling a boolean state — use Switch or Toggle",
    "Selecting from options — use Chip or ToggleGroup",
  ],

  tokens: {
    colors: [
      { variable: "--primary", via: "tailwind", usage: "bg-primary" },
      { variable: "--primary-foreground", via: "tailwind", usage: "text-primary-foreground" },
      { variable: "--secondary", via: "tailwind", usage: "bg-secondary" },
      { variable: "--secondary-foreground", via: "tailwind", usage: "text-secondary-foreground" },
      { variable: "--destructive", via: "tailwind", usage: "bg-destructive" },
      { variable: "--background", via: "tailwind", usage: "bg-background" },
      { variable: "--border", via: "tailwind", usage: "border-border" },
      { variable: "--ring", via: "tailwind", usage: "ring-ring/50" },
    ],
    typography: [],
    spacing: [
      { variable: "--radius-md", via: "css-var", usage: "var(--radius-md)" },
    ],
    borders: [
      { variable: "--border", via: "tailwind", usage: "border-border" },
    ],
    other: [],
  },

  dependencies: [],
  usedBy: [
    "carousel",
    "card-page",
    "button-page",
    "accordion-page",
    "input-page",
    "pagination",
    "home-page",
  ],
  brandAware: true,
  responsive: false,
  variants: ["default", "destructive", "outline", "secondary", "ghost", "link"],
  slots: [],
  caveats: [
    "Uses @base-ui/react/button under the hood for accessibility",
    "Icon-only buttons should use size='icon-sm' or 'icon' and include sr-only text",
  ],
};

export default metadata;
