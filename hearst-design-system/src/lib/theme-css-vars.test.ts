import assert from "node:assert/strict";
import test from "node:test";

import { themeOptions } from "./theme-options";
import { brandToCssVars } from "./theme-css-vars";

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((index) => {
    const channel = parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

test("every opaque solid button background a theme emits has an AA label color", () => {
  for (const theme of themeOptions) {
    for (const mode of ["light", "dark"] as const) {
      const vars = brandToCssVars(theme, mode);
      for (const family of ["primary-solid", "secondary-solid"]) {
        for (const state of ["default", "hover", "active"]) {
          const background = vars[`--component-button-background-${family}-${state}`]?.match(/#([0-9a-f]{6})([0-9a-f]{2})?(?![0-9a-f])/i);
          if (!background || (background[2] && background[2].toLowerCase() !== "ff")) continue;
          const content = vars[`--component-button-content-${family}-${state}`];
          assert.ok(content, `${theme.slug} ${mode} ${family} ${state} has no label color`);
          assert.ok(
            contrast(`#${background[1]}`, content) >= 4.5,
            `${theme.slug} ${mode} ${family} ${state}: ${content} on #${background[1]}`,
          );
        }
      }
    }
  }
});

test("Hearst Flux primary button uses a light label on its slate background", () => {
  const flux = themeOptions.find((theme) => theme.slug === "hearst-flux");
  assert.ok(flux);
  const vars = brandToCssVars(flux);
  assert.equal(vars["--component-button-background-primary-solid-default"], "#12354E");
  assert.equal(vars["--component-button-content-primary-solid-default"], "#ffffff");
});
