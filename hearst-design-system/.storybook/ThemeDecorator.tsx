import React, { useCallback, useMemo, useEffect, useState } from "react";
import type { Decorator } from "@storybook/react";
import { ReaderAccountProvider } from "../src/components/reader-account";
import {
  ThemeContext,
  type ThemeColorMode,
  type ThemeContextType,
} from "../src/components/theme-provider";
import { brandToCssVars } from "../src/lib/theme-css-vars";
import { themeOptions } from "../src/lib/theme-options";
import {
  getHearstBrandSection,
  hearstSectionThemeSlugs,
} from "../src/lib/hearst-routes";

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
  const brandSlug = context.globals.brand || "hearst-all";
  const fullscreen = context.parameters.layout === "fullscreen";
  const syncDocumentColorMode = context.parameters.themeRootSync !== false;
  const [colorMode, setColorMode] = useState<ThemeColorMode>("light");
  const [runtimeBrandSlug, setRuntimeBrandSlug] = useState(brandSlug);

  useEffect(() => {
    setRuntimeBrandSlug(brandSlug);
  }, [brandSlug]);

  const brand = useMemo(
    () => themeOptions.find((b) => b.slug === runtimeBrandSlug) || themeOptions[0],
    [runtimeBrandSlug]
  );
  const baseBrand = useMemo(() => {
    if (
      brand.slug.startsWith("hearst-")
      || brand.slug === "white-label"
      || brand.slug === "fre"
    ) {
      return brand;
    }

    const section = getHearstBrandSection(brand.slug);
    const baseSlug = hearstSectionThemeSlugs[section];
    return themeOptions.find((candidate) => candidate.slug === baseSlug) || themeOptions[0];
  }, [brand]);
  const cssVars = useMemo(
    () => ({
      ...brandToCssVars(baseBrand, colorMode),
      ...brandToCssVars(brand, colorMode),
    }),
    [baseBrand, brand, colorMode]
  );
  const toggleColorMode = useCallback(
    () => setColorMode((current) => current === "dark" ? "light" : "dark"),
    []
  );
  const themeCtx = useMemo<ThemeContextType>(
    () => ({
      brand,
      setBrand: setRuntimeBrandSlug,
      colorMode,
      toggleColorMode,
    }),
    [brand, colorMode, toggleColorMode]
  );

  useGoogleFonts([brand.fontDefault, brand.fontSecondary, brand.fontHeadline]);

  useEffect(() => {
    if (!syncDocumentColorMode) return;
    document.documentElement.classList.toggle("dark", colorMode === "dark");
    document.documentElement.style.colorScheme = colorMode;
  }, [colorMode, syncDocumentColorMode]);

  return (
    <ThemeContext.Provider value={themeCtx}>
      <div
        data-brand={baseBrand.slug}
        data-storybook-brand={brand.slug}
        style={{
          ...cssVars,
          fontFamily: `"${brand.fontDefault}", system-ui, sans-serif`,
          boxSizing: "border-box",
          minWidth: 0,
          width: "100%",
          padding: fullscreen ? 0 : "clamp(0.75rem, 3vw, 2rem)",
        } as React.CSSProperties}
      >
        <ReaderAccountProvider>
          <Story />
        </ReaderAccountProvider>
      </div>
    </ThemeContext.Provider>
  );
};
