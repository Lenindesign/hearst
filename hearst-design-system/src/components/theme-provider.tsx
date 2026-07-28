"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { type BrandTheme } from "@/lib/brands";
import { brandToCssVars } from "@/lib/theme-css-vars";
import { themeOptions } from "@/lib/theme-options";

export type ThemeColorMode = "light" | "dark";

export interface ThemeContextType {
  brand: BrandTheme;
  setBrand: (slug: string) => void;
  colorMode: ThemeColorMode;
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

const GOOGLE_FONTS: Record<string, string> = {
  "Inter": "Inter:wght@300;400;500;600;700;800;900",
  "Newsreader": "Newsreader:wght@400;500;600;700;800",
  "Barlow Condensed": "Barlow+Condensed:wght@300;400;500;600;700",
  "Barlow Semi Condensed": "Barlow+Semi+Condensed:wght@300;400;500;600;700",
  "Knockout Condensed": "Barlow+Condensed:wght@700;800;900",
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

    const id = "brand-google-fonts";
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

export function ThemeProvider({
  children,
  defaultBrandSlug = "cosmopolitan",
  persistColorMode = true,
}: {
  children: React.ReactNode;
  defaultBrandSlug?: string;
  persistColorMode?: boolean;
}) {
  const isFluxDefault = defaultBrandSlug === "hearst-flux";
  const defaultColorMode = isFluxDefault ? "dark" : "light";
  const colorModeStorageKey = `hearst-color-mode:${defaultBrandSlug}`;
  const [brandSlug, setBrandSlug] = useState(defaultBrandSlug);
  const [colorMode, setColorMode] = useState<ThemeColorMode>(defaultColorMode);
  const colorModeReady = useRef(false);

  const brand = useMemo(
    () => themeOptions.find((b) => b.slug === brandSlug) || themeOptions[0],
    [brandSlug]
  );

  const setBrand = useCallback((slug: string) => setBrandSlug(slug), []);
  const toggleColorMode = useCallback(() => {
    setColorMode((current) => current === "dark" ? "light" : "dark");
  }, []);

  const cssVars = useMemo(() => brandToCssVars(brand, colorMode), [brand, colorMode]);

  useEffect(() => {
    const storedMode = persistColorMode ? window.localStorage.getItem(colorModeStorageKey) : null;
    const resolvedMode = storedMode === "dark" || storedMode === "light"
      ? storedMode
      : defaultColorMode;
    document.documentElement.classList.toggle("dark", resolvedMode === "dark");
    document.documentElement.style.colorScheme = resolvedMode;
    // Initial client preference is only available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColorMode(resolvedMode);
  }, [colorModeStorageKey, defaultColorMode, persistColorMode]);

  useEffect(() => {
    if (!colorModeReady.current) {
      colorModeReady.current = true;
      return;
    }
    document.documentElement.classList.toggle("dark", colorMode === "dark");
    document.documentElement.style.colorScheme = colorMode;
    if (persistColorMode) {
      window.localStorage.setItem(colorModeStorageKey, colorMode);
    }
  }, [colorMode, colorModeStorageKey, persistColorMode]);

  useGoogleFonts([brand.fontDefault, brand.fontSecondary, brand.fontHeadline]);

  return (
    <ThemeContext.Provider value={{ brand, setBrand, colorMode, toggleColorMode }}>
      <div data-brand={brand.slug} style={cssVars as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
