import { readFileSync } from "node:fs";
import path from "node:path";
import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { BrandLogo } from "@/components/brand-logo";
import { ButtonStyleLink } from "@/components/cta-specs/button-brand-preview";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { Button } from "@/components/ui/button";
import { brandCtaCapturedAt, brandCtaSpecs, type BrandCtaSpec } from "@/lib/brand-cta-specs";
import { brands, type BrandTheme } from "@/lib/brands";
import { getHearstBrandSection, hearstSectionThemeSlugs } from "@/lib/hearst-routes";
import { getBrandLogoSrc } from "@/lib/logos";
import { brandToCssVars } from "@/lib/theme-css-vars";
import { themeOptions } from "@/lib/theme-options";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tokens and Brand Guides | Hearst+",
  description: "How Hearst+ design tokens flow from Git to components, how one token resolves for each brand, the runtime scopes and guards, and a generated style guide for all 29 brand themes.",
};

const pipeline = [
  ["P1", "Source", "tokens/ in Git: core, semantic and component JSON, one file per brand, and _meta.json for production font overrides. The only place a value is authored."],
  ["P2", "Build", "npm run build-tokens resolves every alias, fixes known source typos and validates the graph."],
  ["P3", "Output", "Writes src/lib/brands.ts (29 typed brand objects) and src/lib/tokens.css (10,508 custom properties). Generated files are never edited by hand."],
  ["P4", "Runtime", "theme-options.ts adds the 7 section themes; brandToCssVars() turns a brand into 282 CSS custom properties and runs the guards."],
  ["P5", "Scope", "Vars are set on :root, the product wrapper, the section wrapper and the publication wrapper. Portaled overlays copy the nearest scope."],
  ["P6", "Map", "Tailwind @theme inline maps vars to utilities (bg-primary, text-foreground); component CSS reads component tokens through [data-slot] selectors."],
  ["P7", "Render", "Button, Card, Badge, Link and every module read tokens, never hex values, so one component renders correctly in every brand."],
] as const;

const tierRows = [
  ["T1", "Core", "core/*.json", "624", "Raw values: color ramps, sizes, spacing, radius. palette.gray.11 = #1c1c1c."],
  ["T2", "Semantic", "semantic/color, typography, layout", "412", "Roles that alias core: palette.primary.1000, palette.neutral.1000, type scale, space."],
  ["T3", "Component", "semantic/component/tokens.json", "398", "Per-component decisions that alias semantic roles: button background, chip border, badge content."],
  ["T4", "Brand", "brands/{slug}.json", "29 × 607", "Every token resolved for one brand, with that brand's overrides applied."],
] as const;

const nameParts = [
  ["component", "Tier", "Which layer owns the decision"],
  ["button", "Component", "The HDS component that reads it"],
  ["background", "Property", "background, content, border, icon, radius"],
  ["primary", "Intent", "primary, neutral, danger, knockout"],
  ["solid", "Variant", "solid, outlined, transparent"],
  ["default", "State", "default, hover, active, disabled"],
] as const;

const chain = [
  ["T3", "component.button.background.primary.solid-default", "{palette.primary.1000}"],
  ["T2", "palette.primary.1000", "{palette.neutral.1000}"],
  ["T2", "palette.neutral.1000", "{_palette.gray.11}"],
  ["T1", "palette.gray.11", "#1c1c1c (White Label)"],
  ["T4", "cosmopolitan.json → component-button-background-primary-solid-default", "#d70000"],
  ["V", "--component-button-background-primary-solid-default", "set by brandToCssVars on the brand scope"],
  ["C", "[data-slot=button][data-variant=default]", "background-color: var(--component-button-background-primary-solid-default)"],
] as const;

const scopes = [
  ["S0", ":root", "Core defaults from tokens.css and globals.css."],
  ["S1", ".hearst-plus-theme", "Product variables (--hp-*): canvas, surfaces, rail and layout tokens."],
  ["S2", "Section wrapper", "brandToCssVars(section theme) for Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, Local News, A&E and Hearst+."],
  ["S3", "[data-brand] wrapper", "brandToCssVars(publication) on brand pages and inside the reader; it wins over the section."],
  ["S4", "Portal root", "Dialogs render in <body>, outside the wrappers, so useInheritedThemeScope copies the nearest scope onto the portal root."],
] as const;

const guards = [
  ["G1", "Button label contrast", "If a theme's label is below 4.5:1 on its solid button, the label becomes the first of white, #121212 or black that passes."],
  ["G2", "Ad headline color", "--component-ad-headline takes the CTA color only when it reaches 3:1 on the card; otherwise the text color."],
  ["G3", "Missing ghost tokens", "Ghost buttons fall back to a transparent border and fill when a section theme omits them."],
  ["G4", "Dark mode primary", "The primary color is lifted until it reaches 4.5:1 on the dark surface."],
] as const;

const sectionLabels: Record<string, string> = {
  lifestyle: "Lifestyle",
  autos: "Autos",
  flux: "Fashion & Luxury",
  ew: "Enthusiast & Wellness",
};

const BASE_THEMES = new Set(["white-label", "fre"]);

/** Logos whose SVG paints itself white (a --primary: #fff default) need the logo component to set a color. */
function isKnockoutLogo(src: string) {
  try {
    const svg = readFileSync(path.join(process.cwd(), "public", src), "utf8");
    return /--primary\s*:\s*#f{3}(?:f{3})?\b/i.test(svg);
  } catch {
    return false;
  }
}

function brandVars(brand: BrandTheme): CSSProperties {
  const sectionSlug = hearstSectionThemeSlugs[getHearstBrandSection(brand.slug)];
  const base = themeOptions.find((option) => option.slug === sectionSlug);
  return { ...(base && !BASE_THEMES.has(brand.slug) ? brandToCssVars(base, "light") : {}), ...brandToCssVars(brand, "light") } as CSSProperties;
}

/** The brand's live-site CTA, drawn exactly as captured (font, weight, size, case, tracking, colors, radius). */
function OfficialCta({ cta }: { cta: BrandCtaSpec }) {
  const onDark = cta.background === "transparent";
  return (
    <div className={cn("flex min-h-16 items-center justify-center rounded-[6px] px-4 py-3", onDark ? "bg-[#111]" : "bg-white")}>
      <span
        className="inline-flex items-center justify-center whitespace-nowrap"
        style={{
          fontFamily: `"${cta.fontFamily}", var(--font-brand), system-ui, sans-serif`,
          fontWeight: cta.fontWeight,
          fontSize: cta.fontSize,
          textTransform: cta.textTransform,
          letterSpacing: cta.letterSpacing === "normal" ? undefined : cta.letterSpacing,
          color: cta.color,
          backgroundColor: cta.background,
          borderRadius: Math.min(cta.radius, cta.height / 2),
          minHeight: cta.height,
          padding: cta.padding,
          lineHeight: 1,
        }}
      >
        {/* Same optical centering as the HDS Button: trim the line box to cap height and baseline, so fonts with
            uneven ascent and descent metrics (Lausanne, League Spartan, Teko, Futura) still center. Labels with
            descenders keep normal metrics so nothing is clipped. */}
        <span className={/[gjpqyJQ]/.test(cta.label) ? undefined : "hds-cap-aligned-label"}>{cta.label}</span>
      </span>
    </div>
  );
}

function brandSwatches(brand: BrandTheme) {
  const seen = new Set<string>();
  return Object.entries(brand.colors)
    .filter(([, value]) => {
      const hex = String(value).toLowerCase();
      if (hex === "#ffffff" || seen.has(hex)) return false;
      seen.add(hex);
      return true;
    })
    .slice(0, 8);
}

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="type-k1 text-muted-foreground">{eyebrow}</p>
      <h2 id={id} className="headline type-t2 mt-3">{title}</h2>
      {children ? <p className="type-d2 mt-3 text-muted-foreground">{children}</p> : null}
    </div>
  );
}

function SpecTable({ caption, headers, rows, mono = [] }: { caption: string; headers: string[]; rows: readonly (readonly string[])[]; mono?: number[] }) {
  return (
    <div className="overflow-x-auto rounded-card bg-card shadow-[var(--hp-shadow-card)]">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="type-k1 border-b border-border px-4 py-3 text-muted-foreground">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")} className="border-b border-border last:border-b-0">
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} className={cn("type-b2 px-4 py-3 align-top", index === 0 && "font-semibold", mono.includes(index) && "font-mono text-[0.8125rem]")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BrandGuide({ brand }: { brand: BrandTheme }) {
  const logo = getBrandLogoSrc(brand.slug);
  const swatches = brandSwatches(brand);
  const radius = brand.componentTokens["component-button-radius-default"] ?? 0;
  const primary = brand.componentTokens["component-button-background-primary-solid-default"];
  const cta = brandCtaSpecs[brand.slug];
  return (
    <article
      id={`brand-${brand.slug}`}
      className="flex min-w-0 scroll-mt-24 flex-col overflow-hidden rounded-card border border-border bg-card shadow-[var(--hp-shadow-card)]"
      aria-labelledby={`brand-${brand.slug}-name`}
    >
      <div className="flex h-24 items-center justify-center border-b border-border bg-white px-6">
        {logo && !isKnockoutLogo(logo) ? (
          // eslint-disable-next-line @next/next/no-img-element -- brand logo SVG in its own colors
          <img src={logo} alt={`${brand.name} logo`} className="max-h-12 w-auto max-w-full object-contain" />
        ) : logo ? (
          <BrandLogo
            slug={brand.slug}
            label={`${brand.name} logo`}
            className="flex h-12 w-full items-center justify-center [&_svg]:h-full [&_svg]:max-h-12 [&_svg]:w-auto [&_svg]:max-w-full"
          />
        ) : (
          <span className="headline type-t3">{brand.name}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 id={`brand-${brand.slug}-name`} className="type-t5 font-bold">{brand.name}</h3>
          <code className="type-c1 text-muted-foreground">{brand.slug}</code>
        </div>
        <div>
          <p className="type-k1 text-muted-foreground">Colors</p>
          <ul className="mt-2 grid grid-cols-4 gap-2">
            {swatches.map(([key, value]) => (
              <li key={key} className="min-w-0">
                <span className="block h-9 rounded-[4px] border border-black/10" style={{ backgroundColor: String(value) }} aria-hidden />
                <span className="type-c1 mt-1 block truncate font-mono">{String(value).toUpperCase()}</span>
                <span className="type-c1 block text-muted-foreground">brand-{key}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Brand token scope: the font names below render in their own families, and the preview reads the brand's
            --font-brand (body and buttons), --font-headline and --font-brand-secondary exactly as a brand page does. */}
        <div style={brandVars(brand)} className="mt-auto flex flex-col gap-4" data-brand={brand.slug}>
          <dl className="type-b2 grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1">
            <dt className="font-sans text-muted-foreground">Headline</dt>
            <dd className="truncate text-base" style={{ fontFamily: "var(--font-headline)", fontWeight: "var(--font-headline-weight)" as CSSProperties["fontWeight"] }}>{brand.fontHeadline} · {brand.fontHeadlineWeight}</dd>
            <dt className="font-sans text-muted-foreground">Secondary</dt>
            <dd className="truncate text-base font-[family-name:var(--font-brand-secondary)]">{brand.fontSecondary}</dd>
            <dt className="font-sans text-muted-foreground">Body / UI</dt>
            <dd className="font-brand truncate text-base">{brand.fontDefault}</dd>
            <dt className="font-sans text-muted-foreground">Button</dt>
            <dd className="truncate font-sans"><span className="font-mono">{String(primary ?? "—").toUpperCase()}</span> · radius {radius}px</dd>
            {brand.componentTokens["component-button-font-family"] ? (
              <>
                <dt className="font-sans text-muted-foreground">CTA type</dt>
                <dd className="truncate font-sans">
                  {String(brand.componentTokens["component-button-font-family"])} {String(brand.componentTokens["component-button-font-weight"])}
                  {brand.componentTokens["component-button-text-transform"] === "uppercase" ? " · uppercase" : ""} · tracking {String(brand.componentTokens["component-button-letter-spacing"])}
                </dd>
              </>
            ) : null}
          </dl>
          <div className="font-brand rounded-[6px] border border-border bg-background p-4 text-foreground">
            <p className="headline type-t3 line-clamp-2">The story everyone is reading</p>
            <p className="type-b2 mt-2 line-clamp-2 font-[family-name:var(--font-brand-secondary)] text-muted-foreground">A deck in the secondary family, set at the standard metrics.</p>
          </div>
          {cta ? (
            <div>
              <p className="type-k1 text-muted-foreground">Official CTA · live site</p>
              <div className="mt-2 rounded-[6px] border border-border">
                <OfficialCta cta={cta} />
              </div>
              <p className="type-c1 mt-2 font-sans text-muted-foreground">
                {cta.fontFamily} {cta.fontWeight} · {cta.fontSize}px · {cta.textTransform === "none" ? "as written" : cta.textTransform} · tracking {cta.letterSpacing} · radius {cta.radius >= cta.height / 2 ? "pill" : `${cta.radius}px`} · {cta.height}px tall
                {cta.hosted ? null : <span className="block">{cta.fontFamily} is not served by the app, so this sample uses the brand&rsquo;s fallback.</span>}
              </p>
              <p className="type-k1 mt-3 text-muted-foreground">HDS Button · brand tokens</p>
              <div className="font-brand mt-2 flex flex-wrap gap-2">
                <Button size="touch">Read the story</Button>
                <Button size="touch" variant="outline">Save</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button size="touch">Read the story</Button>
              <Button size="touch" variant="outline">Save</Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

const sectionClass = "scroll-mt-24 space-y-6 border-t border-border pt-10";

export default function TokenSpecsPage() {
  const publications = brands.filter((brand) => !BASE_THEMES.has(brand.slug));
  const baseThemes = brands.filter((brand) => BASE_THEMES.has(brand.slug));
  const bySection = Object.keys(sectionLabels).map((section) => ({
    section,
    label: sectionLabels[section],
    brands: publications.filter((brand) => getHearstBrandSection(brand.slug) === section),
  }));

  return (
    <div className="hearst-plus-theme min-h-screen bg-background font-sans text-foreground">
      <ProductHeader current="token-specs" />
      <main className="mx-auto max-w-[1360px] space-y-14 px-5 py-10 md:px-10 md:py-16">
        <header className="max-w-4xl">
          <p className="type-k1 text-muted-foreground">HDS foundations · Tokens</p>
          <h1 className="headline type-t1 mt-4">Tokens and brand guides</h1>
          <p className="type-d1 mt-5 max-w-3xl text-muted-foreground">
            One component contract, 29 brand expressions. Design decisions live as tokens in Git, a single build turns them into brand data, and the runtime scopes them as CSS custom properties so every Button, Card and headline renders in the right brand without a line of brand-specific code.
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
            {[["Pipeline", "#pipeline"], ["Tiers", "#tiers"], ["Resolve", "#resolve"], ["Scopes", "#scopes"], ["Film", "#film"], ["Drawing", "#drawing"], ["Brand guides", "#brands"]].map(([label, href]) => (
              <ButtonStyleLink key={href} href={href} variant="ghost" className="px-3">{label}</ButtonStyleLink>
            ))}
          </nav>
        </header>

        <section aria-labelledby="pipeline" className={sectionClass}>
          <SectionHeading id="pipeline" eyebrow="01 · Pipeline" title="From Git to a rendered pixel.">
            Seven stages, each with one job. A value is authored once in tokens/ and reaches every brand through generated data and runtime scope.
          </SectionHeading>
          <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pipeline.map(([code, name, body]) => (
              <li key={code} className="rounded-card bg-card p-5 shadow-[var(--hp-shadow-card)]">
                <p className="type-k1 text-muted-foreground">{code}</p>
                <p className="type-t5 mt-1 font-bold">{name}</p>
                <p className="type-b2 mt-2 text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="tiers" className={sectionClass}>
          <SectionHeading id="tiers" eyebrow="02 · Tiers and names" title="Four tiers, one naming grammar.">
            Each tier aliases the one below it. Components only read the semantic and component tiers, so a brand can change a color without touching a component.
          </SectionHeading>
          <SpecTable caption="Token tiers" headers={["Tier", "Name", "Files", "Tokens", "What lives here"]} rows={tierRows} mono={[2]} />
          <div className="rounded-card bg-card p-5 shadow-[var(--hp-shadow-card)]">
            <p className="type-k1 text-muted-foreground">Anatomy of a token name</p>
            <ol className="mt-4 flex flex-wrap gap-2">
              {nameParts.map(([part, role, detail]) => (
                <li key={part} className="min-w-[8.5rem] flex-1 rounded-[6px] border border-border p-3">
                  <code className="type-b2 font-mono font-semibold">{part}</code>
                  <p className="type-k1 mt-2 text-muted-foreground">{role}</p>
                  <p className="type-c1 mt-1 text-muted-foreground">{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="resolve" className={sectionClass}>
          <SectionHeading id="resolve" eyebrow="03 · Resolve one token" title="Same name, different brand, different value.">
            The primary button background follows its aliases down to a core gray in the default theme. Cosmopolitan&rsquo;s brand file resolves the same name to its red, and the runtime sets it as a CSS custom property the Button reads.
          </SectionHeading>
          <SpecTable caption="Alias chain for the primary button background" headers={["Step", "Token or selector", "Resolves to"]} rows={chain} mono={[1, 2]} />
        </section>

        <section aria-labelledby="scopes" className={sectionClass}>
          <SectionHeading id="scopes" eyebrow="04 · Scopes and guards" title="The nearest scope wins, and guards keep it readable." />
          <SpecTable caption="CSS custom property scopes" headers={["Scope", "Selector", "What it sets"]} rows={scopes} mono={[1]} />
          <SpecTable caption="Runtime guards" headers={["Guard", "Rule", "Behavior"]} rows={guards} />
        </section>

        <section aria-labelledby="film" className={sectionClass}>
          <SectionHeading id="film" eyebrow="05 · Motion film" title="Watch a token travel.">
            The four tiers stack up, a token name assembles part by part, one button token resolves down its alias chain and then swaps value brand by brand, the pipeline carries it to the browser, scopes nest, guards correct a failing color, and every brand guide passes by.
          </SectionHeading>
          <figure className="min-w-0">
            <video
              src="/specs/token-film.mp4"
              poster="/specs/token-drawing.svg"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Motion film of the token architecture: four token tiers stack from core to brand with their counts; a token name assembles into tier, component, property, intent, variant and state; the primary button background resolves from the component tier to a core gray, then the brand tier swaps its value for Cosmopolitan, Esquire, Car and Driver and others while a sample button changes color; the seven pipeline stages light up from Git to components; nested CSS scopes show the nearest scope winning and a dialog copying its theme; a failing label contrast is corrected by the guard; then each brand's logo, colors, fonts and radius pass in a tour, and the drawing sheet resolves."
              className="block aspect-video w-full rounded-card bg-white shadow-[var(--hp-shadow-card)]"
            />
          </figure>
        </section>

        <section aria-labelledby="drawing" className={sectionClass}>
          <SectionHeading id="drawing" eyebrow="06 · Dimensional drawing" title="UI-TOKEN-001 · token architecture.">
            The pipeline, the four tiers, one alias chain, the name anatomy, the scope cascade, the runtime guards and the brand boundary on one sheet.
          </SectionHeading>
          <figure className="min-w-0">
            <div className="overflow-x-auto rounded-card bg-white shadow-[var(--hp-shadow-card)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static vector drawing */}
              <img
                src="/specs/token-drawing.svg"
                width={1700}
                height={1060}
                alt="Dimensional drawing of the token architecture, revision A: a seven-stage pipeline from token JSON in Git through the build, generated brand data, the runtime, CSS scopes and Tailwind to components; four token tiers with 624 core, 412 semantic, 398 component and 29 brand files of 607 tokens; the primary button background resolving through palette aliases to #1C1C1C, and to #D70000 for Cosmopolitan; the six-part token name; nested scopes from :root to the publication wrapper and the portal root; four runtime guards; what a brand may set and what the system fixes; and tables."
                className="block h-auto w-full min-w-[960px]"
              />
            </div>
            <figcaption className="type-b2 mt-3 flex flex-wrap items-center justify-between gap-3 text-muted-foreground">
              <span>Rev A · 2026-11-09 · schematic</span>
              <ButtonStyleLink href="/specs/token-drawing.html">Open the full sheet with notes</ButtonStyleLink>
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="brands" className={sectionClass}>
          <SectionHeading id="brands" eyebrow="07 · Brand guides" title="29 brand themes, generated from the tokens.">
            {`${publications.length} publications and ${baseThemes.length} base themes. Swatches, fonts and radius are read from src/lib/brands.ts and each preview renders inside that brand's token scope. The official CTA under each preview is the brand's live-site header CTA, captured ${brandCtaCapturedAt}; its typeface, weight, case and tracking are now brand tokens, so the HDS Button below it renders the same way.`}
          </SectionHeading>
          {bySection.map(({ section, label, brands: sectionBrands }) => (
            <div key={section} className="space-y-4">
              <h3 className="type-k1 text-muted-foreground">{label} · {sectionBrands.length}</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sectionBrands.map((brand) => <BrandGuide key={brand.slug} brand={brand} />)}
              </div>
            </div>
          ))}
          <div className="space-y-4">
            <h3 className="type-k1 text-muted-foreground">Base themes · {baseThemes.length}</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {baseThemes.map((brand) => <BrandGuide key={brand.slug} brand={brand} />)}
            </div>
          </div>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
