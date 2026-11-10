"use client";

import * as React from "react";

import { Button, buttonVariants, capAlignButtonLabel } from "@/components/ui/button";
import { Bookmark, ChevronRight, Trash2 } from "@/components/ui/icons";
import { getHearstBrandSection, hearstSectionThemeSlugs } from "@/lib/hearst-routes";
import { brandToCssVars } from "@/lib/theme-css-vars";
import { themeOptions } from "@/lib/theme-options";
import { cn } from "@/lib/utils";

/** Brands chosen to show the radius range: 0 (Cosmopolitan, square), 4 (Car and Driver, Hearst+), 64 (Esquire, pill). */
const previewBrands = [
  { slug: "cosmopolitan", label: "Cosmopolitan" },
  { slug: "esquire", label: "Esquire" },
  { slug: "car-and-driver", label: "Car and Driver" },
  { slug: "hearst-plus", label: "Hearst+" },
] as const;

/** "Sign up" has a descender, so capAlignedLabel="auto" leaves it on normal metrics. */
const opticalLabels = ["SIGN IN", "XS", "Read the review", "Sign up"] as const;
const sizes = ["xs", "sm", "default", "lg", "touch"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg", "icon-touch"] as const;
const variants = [
  ["default", "Primary"],
  ["outline", "Outline"],
  ["secondary", "Secondary"],
  ["ghost", "Ghost"],
  ["destructive", "Delete"],
  ["link", "Link action"],
] as const;

/** Same theme merge as the Storybook ThemeDecorator: section base, then the brand. */
function useBrandVars(slug: string) {
  return React.useMemo(() => {
    const brand = themeOptions.find((option) => option.slug === slug) ?? themeOptions[0];
    const isSectionTheme = brand.slug.startsWith("hearst-") || brand.slug === "white-label" || brand.slug === "fre";
    const baseSlug = isSectionTheme ? brand.slug : hearstSectionThemeSlugs[getHearstBrandSection(brand.slug)];
    const base = themeOptions.find((option) => option.slug === baseSlug) ?? brand;
    return { ...brandToCssVars(base, "light"), ...brandToCssVars(brand, "light") } as React.CSSProperties;
  }, [slug]);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-border py-5 md:grid-cols-[9rem_minmax(0,1fr)] md:items-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function ButtonBrandPreview() {
  const [slug, setSlug] = React.useState<string>(previewBrands[0].slug);
  const [radius, setRadius] = React.useState<string | null>(null);
  const style = useBrandVars(slug);
  const sampleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sample = sampleRef.current?.querySelector<HTMLElement>('[data-slot="button"]');
    setRadius(sample ? getComputedStyle(sample).borderTopLeftRadius : null);
  }, [slug]);

  return (
    <div className="min-w-0">
      <div role="radiogroup" aria-label="Preview brand" className="flex flex-wrap gap-2">
        {previewBrands.map((brand) => (
          <Button
            key={brand.slug}
            role="radio"
            aria-checked={slug === brand.slug}
            variant="outline"
            size="touch"
            className="aria-checked:border-foreground aria-checked:bg-foreground aria-checked:text-background aria-checked:hover:bg-foreground"
            onClick={() => setSlug(brand.slug)}
          >
            {brand.label}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        Rendered radius for this brand: <span className="font-semibold text-foreground tabular-nums">{radius ?? "—"}</span>
        {" "}from <code className="text-foreground">--component-button-radius-default</code>. Geometry stays the same; only tokens change.
      </p>

      <div ref={sampleRef} style={style} className="mt-6 rounded-card bg-background px-5 font-[family-name:var(--font-brand)] text-foreground shadow-[var(--hp-shadow-card)] sm:px-6">
        <Row label="Variants">
          {variants.map(([variant, label]) => (
            <Button key={variant} variant={variant}>{label}</Button>
          ))}
        </Row>
        <Row label="Sizes">
          {sizes.map((size) => (
            <Button key={size} size={size}>{size === "default" ? "Default" : size === "touch" ? "Touch" : size.toUpperCase()}</Button>
          ))}
        </Row>
        <Row label="Default metrics">
          {opticalLabels.map((label) => (
            <Button key={label} size="touch" variant={label === "Sign up" ? "outline" : "default"} capAlignedLabel={false}>{label}</Button>
          ))}
        </Row>
        <Row label="Optically centered (default)">
          {opticalLabels.map((label) => (
            <Button key={label} size="touch" variant={label === "Sign up" ? "outline" : "default"}>{label}</Button>
          ))}
          <p className="basis-full max-w-3xl text-sm leading-6 text-muted-foreground">
            A text line box reserves room for ascenders above the capitals and descenders below the baseline, so
            capitals sit a little high when the box is centered. Button wraps the label in{" "}
            <code className="text-foreground">.hds-cap-aligned-label</code>, which sets{" "}
            <code className="text-foreground">text-box-trim: trim-both</code> and{" "}
            <code className="text-foreground">text-box-edge: cap alphabetic</code>. The label box then runs from cap
            height to baseline, and flex centering places the capitals in the middle. It applies only when the text has
            no descenders (g, j, p, q, y, J, Q), so &ldquo;Sign up&rdquo; keeps normal metrics and nothing gets clipped.
            Icons beside the text are ignored, and browsers without text-box trimming keep the default alignment.
          </p>
        </Row>
        <Row label="Icon-only">
          {iconSizes.map((size) => (
            <Button key={size} size={size} variant={size === "icon-touch" ? "default" : "outline"} aria-label={`Save story (${size})`}>
              <Bookmark aria-hidden />
            </Button>
          ))}
          <Button size="icon-touch" variant="destructive" aria-label="Delete story">
            <Trash2 aria-hidden />
          </Button>
        </Row>
        <Row label="With icon">
          <Button size="touch">
            Continue
            <ChevronRight data-icon="inline-end" aria-hidden />
          </Button>
          <Button size="touch" variant="outline">
            <Bookmark data-icon="inline-start" aria-hidden />
            Save story
          </Button>
        </Row>
        <Row label="States">
          <Button loading loadingText="Saving story">Save story</Button>
          <Button variant="outline" disabled>Not available</Button>
          <Button variant="outline" aria-invalid>Review errors</Button>
          <Button variant="secondary" aria-expanded>Filters open</Button>
        </Row>
      </div>
    </div>
  );
}

/** A link styled by the shared Button variants (navigation stays a link). */
export function ButtonStyleLink({
  href,
  variant = "outline",
  className,
  external = false,
  children,
}: {
  href: string;
  variant?: "outline" | "ghost" | "link";
  className?: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      data-slot="button"
      data-variant={variant}
      data-size="touch"
      className={cn(buttonVariants({ variant, size: "touch" }), className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {capAlignButtonLabel(children)}
    </a>
  );
}
