import { create } from "@storybook/theming";

export const hearstPlusStorybookTheme = create({
  base: "light",

  brandTitle: "Hearst+",
  brandUrl: "/?path=/story/hearst-plus-product-for-you-feed--for-you-feed",
  brandImage: "/logos/hearst-plus.svg",
  brandTarget: "_self",

  colorPrimary: "#111111",
  colorSecondary: "#0057B8",

  appBg: "#F2F2EF",
  appContentBg: "#FFFFFF",
  appPreviewBg: "#E9E9E5",
  appBorderColor: "#C9C9C4",
  appBorderRadius: 0,

  fontBase: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
  fontCode: `"SFMono-Regular", Consolas, "Liberation Mono", monospace`,

  textColor: "#111111",
  textInverseColor: "#FFFFFF",
  textMutedColor: "#5B5B57",

  barTextColor: "#3D3D39",
  barSelectedColor: "#0057B8",
  barHoverColor: "#0057B8",
  barBg: "#FFFFFF",

  inputBg: "#FFFFFF",
  inputBorder: "#8A8A84",
  inputTextColor: "#111111",
  inputBorderRadius: 0,

  buttonBg: "#FFFFFF",
  buttonBorder: "#8A8A84",

  booleanBg: "#D9D9D4",
  booleanSelectedBg: "#0057B8",
});
