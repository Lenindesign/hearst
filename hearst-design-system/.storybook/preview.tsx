import type { Preview } from "@storybook/react";
import { themeOptions } from "../src/lib/theme-options";
import { ThemeDecorator } from "./ThemeDecorator";
import { hearstPlusStorybookTheme } from "./swiss-theme";
import "../src/app/globals.css";

const brandOptions = themeOptions.reduce(
  (acc, b) => ({ ...acc, [b.name]: b.slug }),
  {} as Record<string, string>
);

const preview: Preview = {
  globalTypes: {
    brand: {
      name: "Brand",
      description: "Hearst publication theme",
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
    brand: "hearst-all",
  },
  decorators: [ThemeDecorator],
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disable: true },
    docs: {
      theme: hearstPlusStorybookTheme,
    },
    options: {
      storySort: {
        order: [
          "Hearst Plus",
          [
            "Start",
            ["Overview", "Architecture", "Component Architecture", "Technology Stack", "Designer Principles"],
            "Product",
            ["For You Feed", "Onboarding Journey"],
            "Foundation",
            ["Grid System", "Colors", "Typography", "Tokens", "Token Naming", "Token Usage"],
            "HDS Primitives",
            "Templates",
            "Delivery",
            ["Workflow", "Token Workflow", "Figma", "Pencil", "Quality"],
          ],
        ],
      },
    },
  },
};

export default preview;
