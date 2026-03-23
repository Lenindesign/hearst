import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

const theme = create({
  base: "dark",
  brandTitle: "Hearst Design System",
  brandUrl: "/",
  brandImage: "/storybook-logo.svg",
  brandTarget: "_self",
});

addons.setConfig({ theme });
