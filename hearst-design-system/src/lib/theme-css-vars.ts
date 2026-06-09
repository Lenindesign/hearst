import type { BrandTheme } from "./brands";

function hexToOklch(hex: string): string {
  if (!hex || !hex.startsWith("#") || hex.length < 7) return "oklch(0 0 0)";

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = linearize(r);
  const gl = linearize(g);
  const bl = linearize(b);

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const lc = Math.cbrt(l);
  const mc = Math.cbrt(m);
  const sc = Math.cbrt(s);

  const L = 0.2104542553 * lc + 0.793617785 * mc - 0.0040720468 * sc;
  const a = 1.9779984951 * lc - 2.428592205 * mc + 0.4505937099 * sc;
  const bv = 0.0259040371 * lc + 0.7827717662 * mc - 0.808675766 * sc;

  const C = Math.sqrt(a * a + bv * bv);
  const H = ((Math.atan2(bv, a) * 180) / Math.PI + 360) % 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

function toCssVars(tokens: Record<string, string | number>) {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [
      `--${key}`,
      typeof value === "number" ? `${value}px` : value,
    ]),
  );
}

export function brandToCssVars(brand: BrandTheme): Record<string, string> {
  const primary = brand.colors["1"] || Object.values(brand.colors)[0] || "#000000";
  const primaryFg = getContrastColor(primary);
  const secondary = brand.colors["2"] || brand.colors["3"] || "#f5f5f5";
  const secondaryFg = getContrastColor(secondary);
  const accent = brand.colors["3"] || brand.colors["2"] || "#e5e5e5";
  const accentFg = getContrastColor(accent);
  const brandColorVars = Object.fromEntries(
    Object.entries(brand.colors).map(([key, value]) => [`--brand-${key}`, value]),
  );

  return {
    ...toCssVars(brand.semanticColors),
    ...toCssVars(brand.componentTokens),
    ...brandColorVars,
    "--brand-primary": primary,
    "--brand-secondary": secondary,
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
