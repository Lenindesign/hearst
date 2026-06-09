import React, { useMemo, useEffect } from "react";
import type { Decorator } from "@storybook/react";
import { ThemeContext } from "../src/components/theme-provider";
import { brandToCssVars } from "../src/lib/theme-css-vars";
import { themeOptions } from "../src/lib/theme-options";

const GOOGLE_FONTS: Record<string, string> = {
  "Inter": "Inter:wght@300;400;500;600;700;800;900",
  "Newsreader": "Newsreader:wght@400;500;600;700;800",
  "Barlow Condensed": "Barlow+Condensed:wght@300;400;500;600;700",
  "Barlow Semi Condensed": "Barlow+Semi+Condensed:wght@300;400;500;600;700",
  "Montserrat": "Montserrat:wght@300;400;500;600;700;800",
  "Poppins": "Poppins:wght@300;400;500;600;700",
  "Manrope": "Manrope:wght@300;400;500;600;700;800",
  "Livvic": "Livvic:wght@300;400;500;600;700",
  "Lora": "Lora:wght@400;500;600;700",
  "Petrona": "Petrona:wght@400;500;600;700",
  "Playfair Display": "Playfair+Display:wght@400;500;600;700;800",
  "PlayfairDisplay": "Playfair+Display:wght@400;500;600;700;800",
  "PlayFair": "Playfair+Display:wght@400;500;600;700;800",
  "Shippori Mincho": "Shippori+Mincho:wght@400;500;600;700;800",
  "Nunito Sans": "Nunito+Sans:wght@300;400;600;700;800",
};

function useGoogleFonts(fonts: string[]) {
  const fontKey = fonts.join(",");

  useEffect(() => {
    const families: string[] = [];
    const seen = new Set<string>();
    const requestedFonts = fontKey.split(",").filter(Boolean);

    for (const font of ["Inter", "Newsreader", ...requestedFonts]) {
      if (!font || seen.has(font)) continue;
      seen.add(font);
      if (GOOGLE_FONTS[font]) families.push(GOOGLE_FONTS[font]);
    }
    if (families.length === 0) return;
    const id = "sb-brand-google-fonts";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    const href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
    if (link) {
      link.href = href;
    } else {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, [fontKey]);
}

export const ThemeDecorator: Decorator = (Story, context) => {
  const brandSlug = context.globals.brand || "cosmopolitan";
  const brand = useMemo(
    () => themeOptions.find((b) => b.slug === brandSlug) || themeOptions[0],
    [brandSlug]
  );
  const cssVars = useMemo(() => brandToCssVars(brand), [brand]);
  const themeCtx = useMemo(
    () => ({ brand, setBrand: () => {} }),
    [brand]
  );

  useGoogleFonts([brand.fontDefault, brand.fontSecondary, brand.fontHeadline]);

  return (
    <ThemeContext.Provider value={themeCtx}>
      <div
        data-brand={brand.slug}
        style={{
          ...cssVars,
          fontFamily: `"${brand.fontDefault}", system-ui, sans-serif`,
          padding: "2rem",
        } as React.CSSProperties}
      >
        <Story />
      </div>
    </ThemeContext.Provider>
  );
};
