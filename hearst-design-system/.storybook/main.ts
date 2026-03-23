import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
      "next/link": path.resolve(__dirname, "mocks/next-link.tsx"),
      "next/navigation": path.resolve(__dirname, "mocks/next-navigation.ts"),
    };

    config.css = config.css || {};
    config.css.postcss = path.resolve(__dirname, "..");

    if (process.env.STORYBOOK_BASE) {
      config.base = process.env.STORYBOOK_BASE;
    }

    return config;
  },
};

export default config;
