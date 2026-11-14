"use client";

import * as React from "react";

import { ReaderAccountProvider } from "@/components/reader-account";
import { ThemeContext, useGoogleFonts, type ThemeContextType } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { getHearstBrandSection, hearstSectionThemeSlugs } from "@/lib/hearst-routes";
import { brandToCssVars } from "@/lib/theme-css-vars";
import { themeOptions } from "@/lib/theme-options";
import { cn } from "@/lib/utils";

/**
 * Live references on /specs/ render the production components, not copies.
 * LiveBrandFrame scopes them to a brand the way the Storybook ThemeDecorator does;
 * LiveViewport shows a real app route in a frame at a chosen window width.
 */

export type LiveBrand = { slug: string; label: string };

/** Brands that differ most in type, radius and color. */
export const liveBrands: LiveBrand[] = [
  { slug: "hearst-all", label: "Hearst+" },
  { slug: "cosmopolitan", label: "Cosmopolitan" },
  { slug: "esquire", label: "Esquire" },
  { slug: "car-and-driver", label: "Car and Driver" },
];

function isSectionTheme(slug: string) {
  return slug.startsWith("hearst-") || slug === "white-label" || slug === "fre";
}

/** Same theme merge as the Storybook ThemeDecorator: section base, then the brand. */
export function useBrandScope(slug: string) {
  return React.useMemo(() => {
    const brand = themeOptions.find((option) => option.slug === slug) ?? themeOptions[0];
    const baseSlug = isSectionTheme(brand.slug) ? brand.slug : hearstSectionThemeSlugs[getHearstBrandSection(brand.slug)];
    const base = themeOptions.find((option) => option.slug === baseSlug) ?? brand;
    const style = { ...brandToCssVars(base, "light"), ...brandToCssVars(brand, "light") } as React.CSSProperties;
    return { brand, base, style };
  }, [slug]);
}

/** Only the brand CSS variables (the CTA preview uses this). */
export function useBrandVars(slug: string) {
  return useBrandScope(slug).style;
}

/** A row of radio buttons styled like the CTA preview's brand picker. */
export function LiveChoice<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={String(option.value)}
          role="radio"
          aria-checked={value === option.value}
          variant="outline"
          size="touch"
          className="aria-checked:border-foreground aria-checked:bg-foreground aria-checked:text-background aria-checked:hover:bg-foreground"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

const noop = () => undefined;

/**
 * Renders production components under one brand at a time, with the theme and
 * reader-account context they need. Children get the active brand slug.
 */
export function LiveBrandFrame({
  id,
  brands = liveBrands,
  note,
  className,
  children,
}: {
  /** Unique per frame; keys the font stylesheet so frames do not overwrite each other. */
  id: string;
  brands?: LiveBrand[];
  note?: React.ReactNode;
  className?: string;
  children: (brandSlug: string) => React.ReactNode;
}) {
  const [slug, setSlug] = React.useState(brands[0].slug);
  const { brand, base, style } = useBrandScope(slug);
  useGoogleFonts([brand.fontDefault, brand.fontSecondary, brand.fontHeadline], `specs-live-fonts-${id}`);

  const themeContext = React.useMemo<ThemeContextType>(
    () => ({ brand, setBrand: setSlug, colorMode: "light", toggleColorMode: noop }),
    [brand],
  );

  return (
    <div className="min-w-0">
      <LiveChoice label="Preview brand" options={brands.map((b) => ({ value: b.slug, label: b.label }))} value={slug} onChange={setSlug} />
      {note ? <div className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{note}</div> : null}
      <ThemeContext.Provider value={themeContext}>
        <div
          data-brand={base.slug}
          data-specs-live-brand={brand.slug}
          style={style}
          className={cn(
            "mt-6 min-w-0 overflow-hidden rounded-card bg-[var(--hp-page,var(--background))] p-4 font-[family-name:var(--font-brand)] text-foreground shadow-[var(--hp-shadow-card)] sm:p-6",
            className,
          )}
        >
          <ReaderAccountProvider>{children(brand.slug)}</ReaderAccountProvider>
        </div>
      </ThemeContext.Provider>
    </div>
  );
}

export type LiveViewportWidth = { width: number; label: string };

/**
 * A real app route in an iframe at a chosen window width, scaled down to fit
 * the column. The frame is the window, so viewport breakpoints, sticky headers
 * and scroll behavior run exactly as they do in the app.
 */
export function LiveViewport({
  src,
  title,
  widths,
  defaultWidth,
  height = 720,
}: {
  src: string;
  title: string;
  widths: LiveViewportWidth[];
  defaultWidth?: number;
  /** Window height in CSS px before scaling. */
  height?: number;
}) {
  const [width, setWidth] = React.useState(defaultWidth ?? widths[widths.length - 1].width);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const scale = boxWidth ? Math.min(1, boxWidth / width) : 1;

  return (
    <div className="min-w-0">
      <LiveChoice label="Window width" options={widths.map((w) => ({ value: w.width, label: w.label }))} value={width} onChange={setWidth} />
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        Window <span className="font-semibold tabular-nums text-foreground">{width} × {height}</span>
        {scale < 1 ? <> · shown at <span className="tabular-nums">{Math.round(scale * 100)}%</span></> : null}
        {" · "}
        <a href={src} target="_blank" rel="noreferrer" className="font-semibold break-all text-foreground underline underline-offset-4">
          Open {src} in a new tab
        </a>
      </p>
      <div ref={boxRef} className="mt-6 min-w-0">
        <div
          className="overflow-hidden rounded-card border border-border bg-background"
          style={{ width: width * scale, height: height * scale }}
        >
          <iframe
            src={src}
            title={title}
            loading="lazy"
            className="block border-0 bg-background"
            style={{ width, height, transform: `scale(${scale})`, transformOrigin: "0 0" }}
          />
        </div>
      </div>
    </div>
  );
}
