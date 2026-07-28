import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Input",
  description:
    "Labelled text input with required, help, error, leading-icon, clear, disabled, and three density states.",
  level: "atom",
  path: "ui/input.tsx",
  exports: ["Input", "inputFieldVariants"],
  whenToUse: [
    "A form needs a single-line text value with an explicit label and optional guidance",
    "Validation must connect an error message to the input through aria-describedby and aria-invalid",
  ],
  whenNotToUse: [
    "The value spans multiple lines; use Textarea",
    "The user chooses from a closed set; use the owned selection control for that product surface",
  ],
  tokens: {
    colors: [
      { variable: "--background", via: "tailwind", usage: "bg-background" },
      { variable: "--foreground", via: "tailwind", usage: "text-foreground" },
      {
        variable: "--muted-foreground",
        via: "tailwind",
        usage: "text-muted-foreground",
      },
    ],
    typography: [],
    spacing: [],
    borders: [
      { variable: "--border", via: "tailwind", usage: "border" },
      { variable: "--foreground", via: "tailwind", usage: "focus-within:border-foreground" },
    ],
    other: [],
  },
  dependencies: ["ui/icons"],
  usedBy: [
    "article-page",
    "home-page",
    "hearst-games-index",
    "homepage-layouts",
    "input-page",
    "reader-account-ui",
  ],
  brandAware: true,
  responsive: false,
  variants: ["md", "lg", "xl", "help", "error", "disabled", "clearable", "leading-icon"],
  slots: ["label", "field", "leading-icon", "clear", "help", "error"],
  caveats: [
    "The clear button is removed from sequential keyboard focus; consumers must not make clearing the only way to recover from a value.",
    "Required and error states consume semantic form-status tokens and must remain legible across publication themes.",
  ],
};

export default metadata;
