import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Hearst Design System",
    brandUrl: "https://www.hearst.com",
    brandImage: "https://www.hearst.com/o/hearst-theme/images/Nav_HearstLogo.svg",
    brandTarget: "_blank",
  }),
});

