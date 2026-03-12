"use client";

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

function ColorSwatch({
  color,
  name,
  hex,
  dark,
}: {
  color: string;
  name: string;
  hex: string;
  dark?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className="h-12 rounded-md border border-border/50"
        style={{ backgroundColor: color }}
      />
      <p
        className={`text-[10px] font-semibold ${dark ? "text-foreground" : "text-muted-foreground"}`}
      >
        {name}
      </p>
      <p className="text-[10px] text-muted-foreground font-mono">{hex}</p>
    </div>
  );
}

const NEUTRALS = [
  { name: "100", hex: "#FFFFFF", color: "#FFFFFF" },
  { name: "200", hex: "#F5F5F5", color: "#F5F5F5" },
  { name: "300", hex: "#EDEDED", color: "#EDEDED" },
  { name: "400", hex: "#D6D6D6", color: "#D6D6D6" },
  { name: "500", hex: "#BDBDBD", color: "#BDBDBD" },
  { name: "600", hex: "#949494", color: "#949494" },
  { name: "700", hex: "#757575", color: "#757575" },
  { name: "800", hex: "#575757", color: "#575757" },
  { name: "900", hex: "#3B3B3B", color: "#3B3B3B" },
  { name: "1000", hex: "#1C1C1C", color: "#1C1C1C" },
];

const SEMANTIC_COLORS = [
  {
    name: "Success",
    description: "Positive outcomes, confirmations",
    shades: [
      { name: "100", hex: "#DCFCE7", color: "#DCFCE7" },
      { name: "600", hex: "#1B7D3A", color: "#1B7D3A" },
    ],
  },
  {
    name: "Danger",
    description: "Errors, critical alerts, destructive actions",
    shades: [
      { name: "100", hex: "#FEECEC", color: "#FEECEC" },
      { name: "600", hex: "#CC2828", color: "#CC2828" },
    ],
  },
  {
    name: "Warning",
    description: "Caution, non-critical issues",
    shades: [
      { name: "100", hex: "#FEF3C7", color: "#FEF3C7" },
      { name: "600", hex: "#D97706", color: "#D97706" },
    ],
  },
  {
    name: "Info",
    description: "General guidance, informational messages",
    shades: [
      { name: "100", hex: "#DBEAFE", color: "#DBEAFE" },
      { name: "600", hex: "#2563EB", color: "#2563EB" },
    ],
  },
];

export function ColorPage() {
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0] || "#000";

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Foundations
        </p>
        <h1 className="text-4xl font-semibold tracking-tight font-headline">Color</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Our color system is built around a vibrant spectrum of colors,
          thoughtfully selected to engage users and enhance communication. The
          palette includes neutral grays for interface foundations, semantic
          colors for status communication, and brand colors that adapt per
          theme.
        </p>
      </div>

      <Separator />

      {/* Brand Color */}
      <section className="space-y-6">
        <SectionHeader
          title="Brand Color"
          description="The primary brand color adapts per theme. It's used for interactive elements, links, and accent highlights."
        />
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
          <div className="space-y-2">
            <div
              className="h-24 rounded-lg border border-border/50"
              style={{ backgroundColor: primary }}
            />
            <p className="text-sm font-semibold">{brand.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{primary}</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The brand color is mapped to the <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">--primary</code> CSS
                variable and the <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">$brand-1</code> design
                token. It automatically updates when switching between brands.
                All interactive elements (buttons, links, focus rings) derive
                their color from this token.
              </p>
              <div className="flex gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <span className="text-xs font-mono">--primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20" />
                  <span className="text-xs font-mono">--primary / 20%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary-foreground border border-border" />
                  <span className="text-xs font-mono">--primary-foreground</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Neutral Palette */}
      <section className="space-y-6">
        <SectionHeader
          title="Neutral Palette"
          description="The foundation of the interface. Neutral grays create subtle contrast and distinguish between content and interface elements."
        />
        <div className="grid grid-cols-10 gap-2">
          {NEUTRALS.map((n) => (
            <ColorSwatch key={n.name} {...n} />
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="font-semibold mb-1">Backgrounds</p>
                <p className="text-muted-foreground">100–200 for surfaces</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Borders</p>
                <p className="text-muted-foreground">300–400 for dividers</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Subtle Text</p>
                <p className="text-muted-foreground">600–700 for secondary</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Primary Text</p>
                <p className="text-muted-foreground">900–1000 for headings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Semantic Colors */}
      <section className="space-y-6">
        <SectionHeader
          title="Semantic Colors"
          description="Semantic colors convey meaning consistently. Each role has a light (100) and strong (600) shade for backgrounds and text/icons."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEMANTIC_COLORS.map((sc) => (
            <Card key={sc.name}>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold">{sc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sc.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {sc.shades.map((shade) => (
                    <div key={shade.name} className="space-y-1">
                      <div
                        className="h-10 rounded-md border border-border/50"
                        style={{ backgroundColor: shade.color }}
                      />
                      <div className="flex justify-between">
                        <span className="text-[10px] font-semibold">
                          {shade.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {shade.hex}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Accessibility */}
      <section className="space-y-6">
        <SectionHeader
          title="Accessibility"
          description="Color should never be the sole means of conveying information (WCAG 2.2 Guideline 1.4.1)."
        />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                    Aa
                  </div>
                  <div>
                    <p className="text-xs font-semibold">4.5:1 minimum</p>
                    <p className="text-[10px] text-muted-foreground">
                      Normal text (WCAG AA)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                    Aa
                  </div>
                  <div>
                    <p className="text-xs font-semibold">3:1 minimum</p>
                    <p className="text-[10px] text-muted-foreground">
                      Large text (WCAG AA)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold">
                    UI
                  </div>
                  <div>
                    <p className="text-xs font-semibold">3:1 minimum</p>
                    <p className="text-[10px] text-muted-foreground">
                      UI components (WCAG AA)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Always pair color with additional visual cues — icons, text
              labels, patterns, or borders — to ensure information is accessible
              to users with color vision deficiencies.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Token Mapping */}
      <section className="space-y-6">
        <SectionHeader
          title="Token Mapping"
          description="How color tokens map to CSS custom properties."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Design Token</span>
            <span>CSS Variable</span>
            <span>Usage</span>
          </div>
          {[
            { token: "$brand-1", css: "--primary", usage: "Interactive elements, links, accents" },
            { token: "$content-default", css: "--foreground", usage: "Primary text, headings" },
            { token: "$content-subtle", css: "--muted-foreground", usage: "Secondary text, placeholders" },
            { token: "$content-on-brand", css: "--primary-foreground", usage: "Text on brand backgrounds" },
            { token: "$palette-neutral-300", css: "--border", usage: "Borders, dividers" },
            { token: "$palette-alert-danger-600", css: "destructive", usage: "Error states, danger actions" },
            { token: "$palette-alert-success-600", css: "success", usage: "Success states, confirmations" },
            { token: "$palette-alert-warning-600", css: "warning", usage: "Warning states, caution" },
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-2.5 text-xs border-t"
            >
              <code className="font-mono font-medium">{row.token}</code>
              <code className="font-mono text-primary">{row.css}</code>
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
              The color system adapts per brand through the{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">$brand-1</code>{" "}
              token. Neutral grays and semantic colors remain consistent across
              all brands, while the primary accent color changes. Switch brands
              in the header to see the color system adapt.
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
