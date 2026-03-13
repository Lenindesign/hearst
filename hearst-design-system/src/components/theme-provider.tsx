"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { brands, type BrandTheme } from "@/lib/brands";

interface ThemeContextType {
  brand: BrandTheme;
  setBrand: (slug: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function hexToOklch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = linearize(r),
    gl = linearize(g),
    bl = linearize(b);

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const lc = Math.cbrt(l),
    mc = Math.cbrt(m),
    sc = Math.cbrt(s);

  const L = 0.2104542553 * lc + 0.793617785 * mc - 0.0040720468 * sc;
  const a = 1.9779984951 * lc - 2.428592205 * mc + 0.4505937099 * sc;
  const bv = 0.0259040371 * lc + 0.7827717662 * mc - 0.808675766 * sc;

  const C = Math.sqrt(a * a + bv * bv);
  let H = (Math.atan2(bv, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

function brandToCssVars(brand: BrandTheme): Record<string, string> {
  const primary = brand.colors["1"] || Object.values(brand.colors)[0] || "#000000";
  const primaryFg = getContrastColor(primary);
  const secondary = brand.colors["2"] || brand.colors["3"] || "#f5f5f5";
  const secondaryFg = getContrastColor(secondary);
  const accent = brand.colors["3"] || brand.colors["2"] || "#e5e5e5";
  const accentFg = getContrastColor(accent);

  return {
    "--primary": hexToOklch(primary),
    "--primary-foreground": hexToOklch(primaryFg),
    "--secondary": hexToOklch(secondary),
    "--secondary-foreground": hexToOklch(secondaryFg),
    "--accent": hexToOklch(accent),
    "--accent-foreground": hexToOklch(accentFg),
    "--ring": hexToOklch(primary),
    "--chart-1": hexToOklch(primary),
    "--chart-2": hexToOklch(brand.colors["2"] || primary),
    "--chart-3": hexToOklch(brand.colors["3"] || primary),
    "--chart-4": hexToOklch(brand.colors["4"] || primary),
    "--chart-5": hexToOklch(brand.colors["5"] || primary),
    "--font-brand": `"${brand.fontDefault}", system-ui, sans-serif`,
    "--font-brand-secondary": `"${brand.fontSecondary}", Georgia, serif`,
    "--font-headline": `"${brand.fontHeadline}", system-ui, sans-serif`,
    "--font-headline-weight": `${brand.fontHeadlineWeight}`,
  };
}

const GOOGLE_FONTS: Record<string, string> = {
  "Inter": "Inter:wght@300;400;500;600;700;800;900",
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
};

function useGoogleFonts(fonts: string[]) {
  useEffect(() => {
    const families: string[] = [];
    const seen = new Set<string>();

    for (const font of ["Inter", ...fonts]) {
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
  }, [fonts.join(",")]);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [brandSlug, setBrandSlug] = useState("cosmopolitan");

  const brand = useMemo(
    () => brands.find((b) => b.slug === brandSlug) || brands[0],
    [brandSlug]
  );

  const setBrand = useCallback((slug: string) => setBrandSlug(slug), []);

  const cssVars = useMemo(() => brandToCssVars(brand), [brand]);

  useGoogleFonts([brand.fontDefault, brand.fontSecondary, brand.fontHeadline]);

  return (
    <ThemeContext.Provider value={{ brand, setBrand }}>
      <div data-brand={brand.slug} style={cssVars as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
