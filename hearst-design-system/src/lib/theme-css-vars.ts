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

const darkModeSectionPrimaryColors: Record<string, string> = {
  "hearst-all": "#74B9F5",
  "hearst-lifestyle": "#F0919A",
  "hearst-plus": "#A9BCC4",
  "hearst-flux": "#8FB6D3",
  "hearst-ew": "#C5D47E",
  "hearst-local-news": "#61CDBD",
  "hearst-entertainment": "#D5B869",
  elle: "#F2F2F2",
};

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((index) => {
    const channel = parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

const BUTTON_SOLID_FAMILIES = ["primary-solid", "secondary-solid"] as const;
const BUTTON_STATES = ["default", "hover", "active"] as const;
const BUTTON_LIGHT_CONTENT = "#ffffff";
const BUTTON_DARK_CONTENT = "#121212";

/** First opaque #rrggbb color in a token value; translucent #rrggbbaa colors return null. */
function firstHex(value: string | undefined) {
  const match = value?.match(/#([0-9a-f]{6})([0-9a-f]{2})?(?![0-9a-f])/i);
  if (!match || (match[2] && match[2].toLowerCase() !== "ff")) return null;
  return `#${match[1]}`;
}

function contrastRatio(a: string, b: string) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Every solid button background a theme emits gets a matching label color and
 * border in the same layer, so a brand that overrides only the background can
 * never inherit a label color chosen for a different background (for example
 * near-black text from a light-primary brand on Hearst Flux slate). A label
 * the theme set keeps its color when it reaches WCAG AA (4.5:1); otherwise the
 * first of white, near-black or black that reaches AA is used.
 */
function withReadableButtonContent(vars: Record<string, string>) {
  const result = { ...vars };
  for (const family of BUTTON_SOLID_FAMILIES) {
    for (const state of BUTTON_STATES) {
      const backgroundKey = `--component-button-background-${family}-${state}`;
      const contentKey = `--component-button-content-${family}-${state}`;
      const borderKey = `--component-button-border-${family}-${state}`;
      const background = firstHex(result[backgroundKey]);
      if (!background) continue;
      const current = firstHex(result[contentKey]);
      if (!current || contrastRatio(background, current) < 4.5) {
        const candidates = [BUTTON_LIGHT_CONTENT, BUTTON_DARK_CONTENT, "#000000"];
        result[contentKey] =
          candidates.find((candidate) => contrastRatio(background, candidate) >= 4.5) ??
          candidates.reduce((best, candidate) =>
            contrastRatio(background, candidate) > contrastRatio(background, best) ? candidate : best,
          );
      }
      if (!result[borderKey]) result[borderKey] = result[backgroundKey];
    }
  }
  return result;
}

function getDarkModePrimary(brandSlug: string, primary: string) {
  const curated = darkModeSectionPrimaryColors[brandSlug];
  if (curated) return curated;

  const darkSurfaceLuminance = relativeLuminance("#0B0B0B");
  const source = [1, 3, 5].map((index) => parseInt(primary.slice(index, index + 2), 16));

  for (let whiteMix = 0; whiteMix <= 0.75; whiteMix += 0.05) {
    const channels = source.map((channel) => Math.round(channel + (255 - channel) * whiteMix));
    const candidate = `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
    const contrast = (relativeLuminance(candidate) + 0.05) / (darkSurfaceLuminance + 0.05);
    if (contrast >= 4.5) return candidate;
  }

  return "#F2F2F2";
}

function toCssVars(tokens: Record<string, string | number>) {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [
      `--${key}`,
      typeof value === "number" ? `${value}px` : value,
    ]),
  );
}

const runtimeFontStacks: Record<string, string> = {
  Newsreader: 'var(--font-newsreader, "Newsreader"), Georgia, serif',
  "Schibsted Grotesk": 'var(--font-schibsted-grotesk, "Schibsted Grotesk"), system-ui, sans-serif',
  Livvic: 'var(--font-livvic, "Livvic"), system-ui, sans-serif',
  Petrona: 'var(--font-petrona, "Petrona"), Georgia, serif',
  "Knockout Condensed": 'var(--font-knockout-condensed, "Knockout Condensed", "League Gothic", "Barlow Condensed", Impact, sans-serif)',
};

function getRuntimeFontStack(fontFamily: string, fallback: string) {
  return runtimeFontStacks[fontFamily] ?? `"${fontFamily}", ${fallback}`;
}

export function brandToCssVars(brand: BrandTheme, colorMode: "light" | "dark" = "light"): Record<string, string> {
  const primary = brand.colors["1"] || Object.values(brand.colors)[0] || "#000000";
  const primaryFg = getContrastColor(primary);
  const secondary = brand.colors["2"] || brand.colors["3"] || "#f5f5f5";
  const secondaryFg = getContrastColor(secondary);
  const accent = brand.colors["3"] || brand.colors["2"] || "#e5e5e5";
  const accentFg = getContrastColor(accent);
  const darkPrimary = getDarkModePrimary(brand.slug, primary);
  const darkPrimaryFg = getContrastColor(darkPrimary);
  const sidebarHeading = brand.slug === "autoweek" && colorMode === "light"
    ? "#242424"
    : colorMode === "dark"
      ? hexToOklch(darkPrimary)
      : hexToOklch(primary);
  const brandColorVars = Object.fromEntries(
    Object.entries(brand.colors).map(([key, value]) => [`--brand-${key}`, value]),
  );

  const darkSurfaceVars: Record<string, string> = colorMode === "dark" ? {
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.74 0 0)",
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.32 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 14%)",
    "--input": "oklch(1 0 0 / 18%)",
    "--brand-primary": darkPrimary,
    "--primary": hexToOklch(darkPrimary),
    "--primary-foreground": hexToOklch(darkPrimaryFg),
    "--ring": hexToOklch(darkPrimary),
    "--chart-1": hexToOklch(darkPrimary),
    "--palette-content-brand": darkPrimary,
    "--palette-content-brand-hover": `color-mix(in oklab, ${darkPrimary} 84%, white 16%)`,
    "--palette-content-brand-active": `color-mix(in oklab, ${darkPrimary} 72%, white 28%)`,
    "--palette-content-default-link": darkPrimary,
    "--palette-content-default-link-hover": `color-mix(in oklab, ${darkPrimary} 84%, white 16%)`,
    "--palette-background-default-link": darkPrimary,
    "--palette-background-default-link-hover": `color-mix(in oklab, ${darkPrimary} 84%, white 16%)`,
    "--component-button-background-primary-solid-default": darkPrimary,
    "--component-button-background-primary-solid-hover": `color-mix(in oklab, ${darkPrimary} 86%, white 14%)`,
    "--component-button-background-primary-solid-active": `color-mix(in oklab, ${darkPrimary} 76%, white 24%)`,
    "--component-chip-border-neutral-selected": darkPrimary,
    "--component-chip-content-neutral-selected": darkPrimary,
    "--component-badge-background-primary": darkPrimary,
    "--component-badge-content-primary": darkPrimaryFg,
  } : {};

  return withReadableButtonContent({
    ...toCssVars(brand.semanticColors),
    ...toCssVars(brand.componentTokens),
    ...brandColorVars,
    "--brand-primary": primary,
    "--brand-secondary": secondary,
    "--hp-sidebar-heading": sidebarHeading,
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
    "--font-brand": getRuntimeFontStack(brand.fontDefault, "system-ui, sans-serif"),
    "--font-brand-secondary": getRuntimeFontStack(brand.fontSecondary, "Georgia, serif"),
    "--font-headline": getRuntimeFontStack(brand.fontHeadline, "system-ui, sans-serif"),
    "--font-headline-weight": `${brand.fontHeadlineWeight}`,
    "--font-headline-stretch": brand.fontHeadlineStretch || "normal",
    ...darkSurfaceVars,
  });
}
