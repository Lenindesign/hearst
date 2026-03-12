"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const BREAKPOINTS = [
  {
    name: "SM",
    viewport: 360,
    container: 328,
    padding: 16,
    columns: 4,
    gutter: 16,
    description: "Mobile devices. Single-column stacking layout.",
  },
  {
    name: "MD",
    viewport: 768,
    container: 704,
    padding: 32,
    columns: 8,
    gutter: 24,
    description: "Tablets. Transition to multi-column possible.",
  },
  {
    name: "LG",
    viewport: 1024,
    container: 960,
    padding: 32,
    columns: 12,
    gutter: 24,
    description: "Small desktop. Two-region shells (Main + RightRail).",
  },
  {
    name: "XL",
    viewport: 1440,
    container: 1440,
    padding: 0,
    columns: 12,
    gutter: 24,
    description: "Standard desktop. Full 12-column grid.",
  },
  {
    name: "2XL",
    viewport: 1600,
    container: 1440,
    padding: 80,
    columns: 12,
    gutter: 24,
    description: "Wide desktop. Container capped at 1440px; outer whitespace.",
    note: true,
  },
];

const GRID_RULES = [
  "Column widths are derived, not tokenized",
  "Only margins, gutters, and column count are inputs",
  "Grid styles are applied to the container, not the viewport",
  "Base styles target mobile (no media query)",
  "Media queries activate at 768px, 1024px, 1440px, 1600px",
];

const LAYOUT_TOKENS = [
  { token: "layout.viewport.sm", value: "360", usage: "Mobile viewport" },
  { token: "layout.viewport.md", value: "768", usage: "Tablet viewport" },
  { token: "layout.viewport.lg", value: "1024", usage: "Small desktop viewport" },
  { token: "layout.viewport.xl", value: "1440", usage: "Standard desktop viewport" },
  { token: "layout.viewport.2xl", value: "1600", usage: "Wide desktop viewport" },
];

function ViewportVisual({ bp }: { bp: (typeof BREAKPOINTS)[number] }) {
  const maxW = 200;
  const scale = maxW / 1600;
  const vpW = Math.round(bp.viewport * scale);
  const cW = Math.round(bp.container * scale);
  const padW = Math.round(((bp.viewport - bp.container) / 2) * scale);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative border border-border rounded-sm bg-muted/30 flex items-center justify-center"
        style={{ width: vpW, height: 80 }}
      >
        {padW > 2 && (
          <>
            <div
              className="absolute left-0 top-0 bottom-0 bg-muted/60"
              style={{ width: padW }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 bg-muted/60"
              style={{ width: padW }}
            />
          </>
        )}
        <div
          className="bg-primary/15 rounded-[2px] h-[60px]"
          style={{ width: cW }}
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold">{bp.name}</p>
        <p className="text-[10px] text-muted-foreground">{bp.viewport}px</p>
      </div>
    </div>
  );
}

function GridVisual({
  columns,
  gutter,
  label,
}: {
  columns: number;
  gutter: number;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex" style={{ gap: gutter / 3 }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="bg-primary/10 rounded-[2px] flex-1"
            style={{ height: 40 }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span>
          {columns} cols &middot; {gutter}px gutter
        </span>
      </div>
    </div>
  );
}

export function LayoutPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Foundations
        </p>
        <h1 className="text-4xl font-semibold tracking-tight font-headline">Layout</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          The layout system defines responsive breakpoints, container widths,
          and grid configurations. It uses a mobile-first approach with 5
          viewport sizes from 360px to 1600px. Grids use tokenized margins,
          gutters, and column counts &mdash; column widths are always derived.
        </p>
      </div>

      <Separator />

      {/* Breakpoints */}
      <section className="space-y-6">
        <SectionHeader
          title="Breakpoints"
          description="Five responsive breakpoints define the viewport sizes. Base styles target mobile (no media query); media queries activate at 768px and above."
        />
        <div className="grid grid-cols-5 gap-4">
          {BREAKPOINTS.map((bp) => (
            <Card key={bp.name}>
              <CardContent className="pt-4 space-y-2 text-center">
                <Badge variant="secondary" className="w-full justify-center">
                  {bp.name}
                </Badge>
                <p className="text-2xl font-semibold text-primary font-headline">
                  {bp.viewport}px
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {bp.columns} cols &middot; {bp.gutter}px gutter
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Viewport Visualization */}
      <section className="space-y-6">
        <SectionHeader
          title="Viewport & Container"
          description="Each breakpoint defines a viewport width and a centered container. The container holds the content grid; viewport whitespace is not padding."
        />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-end justify-between gap-4">
              {BREAKPOINTS.map((bp) => (
                <ViewportVisual key={bp.name} bp={bp} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-6 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-[2px] border border-border bg-muted/30" />
                <span>Viewport</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-[2px] bg-primary/15" />
                <span>Container</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-[2px] bg-muted/60" />
                <span>Padding / Whitespace</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Container Specs Table */}
      <section className="space-y-6">
        <SectionHeader
          title="Container Specifications"
          description="Container widths are derived from viewport width minus padding. The grid is applied to the container, not the viewport."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[80px_90px_90px_80px_70px_70px_1fr] gap-x-3 bg-muted px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Break&shy;point</span>
            <span>Viewport</span>
            <span>Container</span>
            <span>Padding</span>
            <span>Cols</span>
            <span>Gutter</span>
            <span>Notes</span>
          </div>
          {BREAKPOINTS.map((bp) => (
            <div
              key={bp.name}
              className="grid grid-cols-[80px_90px_90px_80px_70px_70px_1fr] gap-x-3 px-4 py-2.5 text-xs border-t items-center"
            >
              <span className="font-semibold">{bp.name}</span>
              <code className="font-mono text-muted-foreground">
                {bp.viewport}px
              </code>
              <code className="font-mono font-medium text-primary">
                {bp.container}px
              </code>
              <code className="font-mono text-muted-foreground">
                {bp.padding}px{bp.note ? "*" : ""}
              </code>
              <span>{bp.columns}</span>
              <code className="font-mono text-muted-foreground">
                {bp.gutter}px
              </code>
              <span className="text-muted-foreground">{bp.description}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground italic">
          * 2XL padding is viewport whitespace, not container padding. The
          1440px container is edge-aligned.
        </p>
      </section>

      <Separator />

      {/* Grid System */}
      <section className="space-y-6">
        <SectionHeader
          title="Grid System"
          description="The grid uses tokenized margins, gutters, and column counts. Column widths are always derived from the container width."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">SM &mdash; 4 columns</p>
              <GridVisual columns={4} gutter={16} label="360px viewport" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">LG &mdash; 12 columns</p>
              <GridVisual columns={12} gutter={24} label="1024px viewport" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">XL &mdash; 12 columns</p>
              <GridVisual columns={12} gutter={24} label="1440px viewport" />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Grid Rules */}
      <section className="space-y-6">
        <SectionHeader
          title="Implementation Rules"
          description="Key rules for implementing the layout system in CSS."
        />
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {GRID_RULES.map((rule, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{rule}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold mb-2">
              CSS Implementation Pattern
            </p>
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto leading-relaxed">
              {`/* Mobile-first: base styles = SM (360) */
.container { max-width: 328px; margin: 0 auto; padding: 0 16px; }

/* MD: 768px */
@media (min-width: 768px) {
  .container { max-width: 704px; padding: 0 32px; }
}

/* LG: 1024px */
@media (min-width: 1024px) {
  .container { max-width: 960px; }
}

/* XL: 1440px */
@media (min-width: 1440px) {
  .container { max-width: 1440px; padding: 0; }
}

/* 2XL: 1600px — container stays 1440, viewport whitespace */`}
            </pre>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Token Mapping */}
      <section className="space-y-6">
        <SectionHeader
          title="Layout Tokens"
          description="Design tokens for viewport breakpoints. Breakpoint values are constants in CSS (not custom properties) since media queries don't support var()."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Value</span>
            <span>Usage</span>
          </div>
          {LAYOUT_TOKENS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-2.5 text-xs border-t"
            >
              <code className="font-mono font-medium">{row.token}</code>
              <code className="font-mono text-primary">{row.value}px</code>
              <span className="text-muted-foreground">{row.usage}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Brand note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0 mt-0.5">
              {brand.name}
            </Badge>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The layout system is consistent across all brands. Breakpoints,
              container widths, grid columns, and gutters remain the same
              regardless of the active theme. Only visual properties (colors,
              fonts, border radius) change per brand.
            </p>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-muted-foreground py-8">
        Hearst Design System &middot; Foundations &middot; Built with shadcn/ui
      </footer>
    </main>
  );
}
