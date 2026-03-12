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

const TYPE_SCALE = [
  { size: 12, lineHeight: 16, label: "Caption", weight: "normal" },
  { size: 13, lineHeight: 16, label: "Small", weight: "normal" },
  { size: 14, lineHeight: 16, label: "Body Small", weight: "normal" },
  { size: 15, lineHeight: 16, label: "Body", weight: "normal" },
  { size: 16, lineHeight: 20, label: "Body Large", weight: "normal" },
  { size: 18, lineHeight: 20, label: "Subheading", weight: "500" },
  { size: 20, lineHeight: 24, label: "Heading 6", weight: "600" },
  { size: 24, lineHeight: 28, label: "Heading 5", weight: "600" },
  { size: 28, lineHeight: 32, label: "Heading 4", weight: "700" },
  { size: 32, lineHeight: 36, label: "Heading 3", weight: "700" },
  { size: 48, lineHeight: 52, label: "Heading 2", weight: "800" },
  { size: 64, lineHeight: 72, label: "Heading 1", weight: "800" },
  { size: 96, lineHeight: 88, label: "Display 3", weight: "800" },
  { size: 112, lineHeight: 100, label: "Display 2", weight: "800" },
  { size: 128, lineHeight: 128, label: "Display 1", weight: "800" },
];

const FONT_TOKENS = [
  { token: "--font-brand", designToken: "$font-family-default", usage: "Buttons, UI elements, body text" },
  { token: "--font-headline", designToken: "Chronicle Display", usage: "All headlines — single source of truth (weight 600)" },
  { token: "--font-brand-secondary", designToken: "$font-family-serif", usage: "Eyebrows, secondary text, article content" },
];

export function TypographyPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Foundations
        </p>
        <h1 className="text-4xl font-semibold tracking-tight font-headline">Typography</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Our typography system uses brand-specific fonts loaded dynamically per
          theme. The type scale is a 15-step system from 12px to 128px with line
          heights aligned to a 4px grid. Font families adapt per brand while
          maintaining consistent sizing and rhythm.
        </p>
      </div>

      <Separator />

      {/* Font Families */}
      <section className="space-y-6">
        <SectionHeader
          title="Font Families"
          description="Each brand defines a headline and secondary font. These are loaded dynamically via Google Fonts and applied through CSS custom properties."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Badge variant="secondary" className="uppercase tracking-wider">
                Headline
              </Badge>
              <p className="text-3xl font-semibold font-headline">
                Aa Bb Cc Dd Ee
              </p>
              <p className="text-lg font-semibold font-headline">
                The quick brown fox jumps over the lazy dog
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                  --font-headline
                </code>
                <span>&middot;</span>
                <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                  Chronicle Display 600
                </code>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Badge variant="secondary" className="uppercase tracking-wider">
                Secondary
              </Badge>
              <p
                className="text-3xl font-semibold"
                style={{ fontFamily: "var(--font-brand-secondary)" }}
              >
                Aa Bb Cc Dd Ee
              </p>
              <p
                className="text-lg"
                style={{ fontFamily: "var(--font-brand-secondary)" }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                  --font-brand-secondary
                </code>
                <span>&middot;</span>
                <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                  $font-family-serif
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Type Scale */}
      <section className="space-y-6">
        <SectionHeader
          title="Type Scale"
          description="A 15-step type scale from 12px to 128px. Line heights are aligned to a 4px grid for consistent vertical rhythm."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[70px_80px_100px_1fr] gap-x-4 bg-muted px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Size</span>
            <span>Line Height</span>
            <span>Role</span>
            <span>Sample</span>
          </div>
          {TYPE_SCALE.map((step) => (
            <div
              key={step.size}
              className="grid grid-cols-[70px_80px_100px_1fr] gap-x-4 px-4 py-3 border-t items-center"
            >
              <code className="text-xs font-mono font-medium">
                {step.size}px
              </code>
              <code className="text-xs font-mono text-muted-foreground">
                {step.lineHeight}px
              </code>
              <span className="text-xs text-muted-foreground">
                {step.label}
              </span>
              <p
                className="truncate"
                style={{
                  fontSize: Math.min(step.size, 48),
                  lineHeight: `${Math.min(step.lineHeight, 52)}px`,
                  fontFamily: step.size >= 20 ? "var(--font-headline)" : "var(--font-brand)",
                  fontWeight: step.size >= 20 ? 600 : step.weight,
                }}
              >
                The quick brown fox
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Weights */}
      <section className="space-y-6">
        <SectionHeader
          title="Font Weights"
          description="Available weight variations for the brand headline font."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { weight: 400, label: "Regular" },
            { weight: 500, label: "Medium" },
            { weight: 600, label: "Semibold" },
            { weight: 700, label: "Bold" },
          ].map((w) => (
            <Card key={w.weight}>
              <CardContent className="pt-4 space-y-2">
                <p
                  className="text-2xl"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontWeight: w.weight,
                  }}
                >
                  Aa
                </p>
                <div>
                  <p className="text-xs font-semibold">{w.label}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {w.weight}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Line Height */}
      <section className="space-y-6">
        <SectionHeader
          title="Line Height"
          description="Line heights are aligned to a 4px grid for consistent vertical rhythm across all text sizes."
        />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {[
                { size: 12, lh: 16 },
                { size: 16, lh: 20 },
                { size: 20, lh: 24 },
                { size: 24, lh: 28 },
                { size: 32, lh: 36 },
              ].map((item) => (
                <div key={item.size} className="space-y-1">
                  <div
                    className="bg-primary/10 rounded px-2"
                    style={{
                      fontSize: item.size,
                      lineHeight: `${item.lh}px`,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    Ag
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono text-center">
                    {item.size}/{item.lh}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The 4px grid ensures that text blocks align vertically regardless
              of size, creating a harmonious visual rhythm across the interface.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Token Mapping */}
      <section className="space-y-6">
        <SectionHeader
          title="Token Mapping"
          description="How typography tokens map to CSS custom properties."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>CSS Variable</span>
            <span>Design Token</span>
            <span>Usage</span>
          </div>
          {FONT_TOKENS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-2.5 text-xs border-t"
            >
              <code className="font-mono font-medium">{row.token}</code>
              <code className="font-mono text-primary">
                {row.designToken}
              </code>
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
              Typography adapts per brand through the{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                --font-brand
              </code>{" "}
              and{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                --font-brand-secondary
              </code>{" "}
              CSS variables. Fonts are loaded dynamically via Google Fonts when a
              brand is selected. The type scale and line heights remain
              consistent across all brands. Switch brands in the header to see
              the fonts change.
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
