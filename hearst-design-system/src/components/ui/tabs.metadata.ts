import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Tabs",
  description:
    "Base UI tab set with roving focus, selected and disabled states, horizontal or vertical orientation, and default or line treatments.",
  level: "atom",
  path: "ui/tabs.tsx",
  exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent", "tabsListVariants"],
  whenToUse: [
    "A bounded surface contains peer views that can switch without navigation",
    "Token or component tooling needs persistent local context while changing one content panel",
  ],
  whenNotToUse: [
    "The choice changes the application route or destination",
    "Readers need to compare every section at once",
  ],
  tokens: {
    colors: [],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [],
  usedBy: ["button-page", "card-page", "token-dashboard", "tokens-page"],
  brandAware: true,
  responsive: false,
  variants: ["default", "line", "horizontal", "vertical"],
  slots: ["list", "trigger", "content"],
};

export default metadata;
