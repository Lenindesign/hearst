/// <reference types="vite/client" />

import type { Meta, StoryObj } from "@storybook/react";
import { TokenRelationshipGraph, type TokenGraphBrand } from "@/components/token-relationship-graph";
import { brands as generatedBrands } from "@/lib/brands";
import { flattenTokenTree } from "@/lib/token-relationship-model";
import componentDefinitions from "../../tokens/semantic/component/tokens.json";

type TokenModule = Record<string, unknown>;

const coreModules = import.meta.glob<TokenModule>("../../tokens/core/*.json", {
  eager: true,
  import: "default",
});

const semanticModules = import.meta.glob<TokenModule>(
  ["../../tokens/semantic/**/*.json", "!../../tokens/semantic/component/tokens.json"],
  { eager: true, import: "default" }
);

function relativeTokenSource(path: string) {
  return path.replace(/^.*\/tokens\//, "tokens/");
}

function brandLabel(slug: string) {
  const known: Record<string, string> = {
    autoweek: "AutoWeek",
    "car-and-driver": "Car and Driver",
    "elle-decor": "ELLE Decor",
    fre: "Hearst FRÉ",
    "good-housekeeping": "Good Housekeeping",
    "harpers-bazaar": "Harper’s BAZAAR",
    "mens-health": "Men’s Health",
    "oprah-daily": "Oprah Daily",
    "road-and-track": "Road & Track",
    "runners-world": "Runner’s World",
    "the-pioneer-woman": "The Pioneer Woman",
    "town-and-country": "Town & Country",
    "white-label": "White Label",
    "womans-day": "Woman’s Day",
    "womens-health": "Women’s Health",
  };
  return known[slug] ?? slug.split("-").map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");
}

const coreTokens = Object.entries(coreModules).flatMap(([source, tree]) =>
  flattenTokenTree(tree, relativeTokenSource(source))
);

const semanticTokens = Object.entries(semanticModules).flatMap(([source, tree]) =>
  flattenTokenTree(tree, relativeTokenSource(source))
);

const componentTokens = flattenTokenTree(
  componentDefinitions,
  "tokens/semantic/component/tokens.json"
);

const brands: TokenGraphBrand[] = generatedBrands
  .map((brand) => ({
    slug: brand.slug,
    label: brandLabel(brand.slug),
    source: `tokens/brands/${brand.slug}.json`,
    tokens: {
      "brand-1": { type: "color", value: brand.colors["1"] },
      ...Object.fromEntries(
        Object.entries(brand.semanticColors).map(([name, value]) => [name, { type: "color", value }])
      ),
      ...Object.fromEntries(
        Object.entries(brand.componentTokens).map(([name, value]) => [name, { value }])
      ),
    },
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const meta = {
  title: "Hearst Plus/Foundation/Token Relationships",
  component: TokenRelationshipGraph,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Explore canonical core, semantic, and component references alongside the resolved values stored in each brand token snapshot. Brand files are resolved snapshots, so the final lane intentionally says Brand rather than claiming inheritance metadata the files do not contain.",
      },
    },
  },
} satisfies Meta<typeof TokenRelationshipGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Explorer: Story = {
  args: {
    brands,
    coreTokens,
    semanticTokens,
    componentTokens,
    initialBrand: "autoweek",
  },
};
