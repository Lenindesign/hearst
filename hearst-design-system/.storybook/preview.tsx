import React from "react";
import type { Preview } from "@storybook/react";
import { brands } from "../src/lib/brands";
import { ThemeDecorator } from "./ThemeDecorator";
import "../src/app/globals.css";

const brandOptions = brands.reduce(
  (acc, b) => ({ ...acc, [b.name]: b.slug }),
  {} as Record<string, string>
);

const preview: Preview = {
  globalTypes: {
    brand: {
      name: "Brand",
      description: "Hearst brand theme",
      toolbar: {
        icon: "paintbrush",
        items: Object.keys(brandOptions).map((name) => ({
          value: brandOptions[name],
          title: name,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: "cosmopolitan",
  },
  decorators: [ThemeDecorator],
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          "Welcome",
          "The Toolbox",
          "AI Agents",
          "Token Naming Guide",
          "Typography Token Strategy",
          "Token Workflow",
          "QA and Jira",
          "Figma Integration",
          "Pencil Integration",
          "Foundation",
          ["Colors", "Typography", "Tokens"],
          "Templates",
          "FRE Components",
          "Components",
        ],
      },
    },
  },
};

export default preview;
