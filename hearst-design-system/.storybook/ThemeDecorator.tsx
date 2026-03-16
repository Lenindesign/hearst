import React, { useMemo, useEffect } from "react";
import type { Decorator } from "@storybook/react";
import { brands, type BrandTheme } from "../src/lib/brands";
import { ThemeContext } from "../src/components/theme-provider";

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
  "Nunito Sans": "Nunito+Sans:wght@300;400;600;700;800",
};

function hexToOklch(hex: string): string {
  if (!hex || !hex.startsWith("#") || hex.length < 7) return "0 0 0";
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = linearize(r), gl = linearize(g), bl = linearize(b);
  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bv = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(a * a + bv * bv);
  const H = ((Math.atan2(bv, a) * 180) / Math.PI + 360) % 360;
  return `${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(2)}`;
}

function brandToCssVars(brand: BrandTheme): Record<string, string> {
  const primary = brand.colors["1"] || Object.values(brand.colors)[0] || "#000000";
  const secondary = brand.colors["2"] || "#666666";
  return {
    "--primary": hexToOklch(primary),
    "--primary-foreground": "1 0 0",
    "--secondary": hexToOklch(secondary),
    "--secondary-foreground": "0.145 0 0",
    "--accent": hexToOklch(primary),
    "--accent-foreground": "0.145 0 0",
    "--ring": hexToOklch(primary),
    "--brand-primary": primary,
    "--brand-secondary": secondary,
    "--font-brand": `"${brand.fontDefault}", system-ui, sans-serif`,
    "--font-brand-secondary": `"${brand.fontSecondary}", Georgia, serif`,
    "--font-headline": `"${brand.fontHeadline}", system-ui, sans-serif`,
    "--font-headline-weight": `${brand.fontHeadlineWeight}`,
  };
}

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
  }, [fonts.join(",")]);
}

export const ThemeDecorator: Decorator = (Story, context) => {
  const brandSlug = context.globals.brand || "cosmopolitan";
  const brand = useMemo(
    () => brands.find((b) => b.slug === brandSlug) || brands[0],
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
