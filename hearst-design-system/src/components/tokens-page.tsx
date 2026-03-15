"use client";

import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const TOKEN_MAP = [
  {
    category: "Brand Colors",
    tokens: [
      { token: "brand-1", css: "--brand-primary", tailwind: "bg-primary / text-primary", desc: "Primary brand color" },
      { token: "brand-2", css: "--brand-secondary", tailwind: "bg-secondary", desc: "Secondary brand color" },
      { token: "brand-3", css: "--brand-3", tailwind: "bg-accent", desc: "Accent color" },
      { token: "brand-4", css: "--brand-4", tailwind: "—", desc: "Brand color 4" },
      { token: "brand-5", css: "--brand-5", tailwind: "—", desc: "Brand color 5" },
      { token: "brand-6", css: "--brand-6", tailwind: "—", desc: "Brand color 6" },
    ],
  },
  {
    category: "Typography",
    tokens: [
      { token: "font-primary", css: "--font-brand", tailwind: "font-brand", desc: "Primary body font" },
      { token: "font-secondary", css: "--font-brand-secondary", tailwind: "font-brand-secondary", desc: "Secondary / accent font" },
      { token: "font-headline", css: "--font-headline", tailwind: ".headline", desc: "Headline font family" },
      { token: "font-headline-weight", css: "--font-headline-weight", tailwind: ".headline", desc: "Headline font weight" },
      { token: "font-family-default", css: "--font-brand-sans", tailwind: "—", desc: "Default sans-serif (from Token Studio)" },
      { token: "font-family-serif", css: "--font-brand-serif", tailwind: "—", desc: "Serif font (from Token Studio)" },
    ],
  },
  {
    category: "Semantic Colors",
    tokens: [
      { token: "palette-content-default", css: "--palette-content-default", tailwind: "text-foreground", desc: "Default text color" },
      { token: "palette-content-brand", css: "--palette-content-brand", tailwind: "—", desc: "Brand-colored text" },
      { token: "palette-content-default-link", css: "--palette-content-default-link", tailwind: "—", desc: "Link color" },
      { token: "palette-background-page", css: "--palette-background-page", tailwind: "bg-background", desc: "Page background" },
      { token: "palette-background-subtle", css: "--palette-background-subtle", tailwind: "bg-muted", desc: "Subtle background" },
      { token: "palette-background-brand", css: "--palette-background-brand", tailwind: "—", desc: "Brand background" },
      { token: "palette-background-subtle-brand", css: "--palette-background-subtle-brand", tailwind: "—", desc: "Subtle brand background" },
    ],
  },
  {
    category: "Spacing",
    tokens: [
      { token: "space-3xs", css: "--space-3xs", tailwind: "gap-0.5", desc: "2px" },
      { token: "space-2xs", css: "--space-2xs", tailwind: "gap-1", desc: "4px" },
      { token: "space-xs", css: "--space-xs", tailwind: "gap-2", desc: "8px" },
      { token: "space-sm", css: "--space-sm", tailwind: "gap-3", desc: "12px" },
      { token: "space-md", css: "--space-md", tailwind: "gap-4", desc: "16px" },
      { token: "space-lg", css: "--space-lg", tailwind: "gap-5", desc: "20px" },
      { token: "space-xl", css: "--space-xl", tailwind: "gap-6", desc: "24px" },
      { token: "space-2xl", css: "--space-2xl", tailwind: "gap-8", desc: "32px" },
      { token: "space-3xl", css: "--space-3xl", tailwind: "gap-12", desc: "48px" },
    ],
  },
  {
    category: "Neutral Palette",
    tokens: [
      { token: "palette-neutral-100", css: "--palette-neutral-100", tailwind: "—", desc: "Lightest neutral" },
      { token: "palette-neutral-200", css: "--palette-neutral-200", tailwind: "—", desc: "Light borders" },
      { token: "palette-neutral-300", css: "--palette-neutral-300", tailwind: "—", desc: "Borders" },
      { token: "palette-neutral-400", css: "--palette-neutral-400", tailwind: "—", desc: "Disabled text" },
      { token: "palette-neutral-600", css: "--palette-neutral-600", tailwind: "—", desc: "Secondary text" },
      { token: "palette-neutral-800", css: "--palette-neutral-800", tailwind: "—", desc: "Strong text" },
      { token: "palette-neutral-1000", css: "--palette-neutral-1000", tailwind: "—", desc: "Darkest neutral" },
    ],
  },
  {
    category: "Border Radius",
    tokens: [
      { token: "border-radius-2xs", css: "--border-radius-2xs", tailwind: "rounded", desc: "4px" },
      { token: "border-radius-xs", css: "--border-radius-xs", tailwind: "rounded-md", desc: "8px" },
      { token: "border-radius-sm", css: "--border-radius-sm", tailwind: "rounded-lg", desc: "12px" },
      { token: "border-radius-md", css: "--border-radius-md", tailwind: "rounded-xl", desc: "16px" },
    ],
  },
];

function TokenTable({
  tokens,
}: {
  tokens: { token: string; css: string; tailwind: string; desc: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              Token (JSON)
            </th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              CSS Variable
            </th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              Tailwind / Utility
            </th>
            <th className="text-left py-2 font-medium text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.token} className="border-b last:border-0">
              <td className="py-2.5 pr-4">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {t.token}
                </code>
              </td>
              <td className="py-2.5 pr-4">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {t.css}
                </code>
              </td>
              <td className="py-2.5 pr-4">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {t.tailwind}
                </code>
              </td>
              <td className="py-2.5 text-muted-foreground">{t.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResolvedTokensForBrand() {
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0] || "#000";
  const meaningful = Object.entries(brand.colors).filter(
    ([, v]) => v.toLowerCase() !== "#ffffff"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 rounded" style={{ backgroundColor: primary }} />
          {brand.name} — Resolved Values
        </CardTitle>
        <CardDescription>
          How this brand&apos;s tokens resolve across Git, Figma, Pencil, and code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Token</th>
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Value</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Preview</th>
              </tr>
            </thead>
            <tbody>
              {meaningful.map(([k, v]) => (
                <tr key={k} className="border-b last:border-0">
                  <td className="py-2.5 pr-4">
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">brand-{k}</code>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs">{v}</td>
                  <td className="py-2.5">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: v }} />
                  </td>
                </tr>
              ))}
              <tr className="border-b">
                <td className="py-2.5 pr-4">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">font-primary</code>
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs">{brand.fontDefault}</td>
                <td className="py-2.5 text-sm" style={{ fontFamily: `"${brand.fontDefault}", system-ui` }}>
                  Aa Bb Cc
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2.5 pr-4">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">font-secondary</code>
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs">{brand.fontSecondary}</td>
                <td className="py-2.5 text-sm" style={{ fontFamily: `"${brand.fontSecondary}", Georgia, serif` }}>
                  Aa Bb Cc
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">font-headline</code>
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs">
                  {brand.fontHeadline} ({brand.fontHeadlineWeight})
                </td>
                <td
                  className="py-2.5 text-sm"
                  style={{
                    fontFamily: `"${brand.fontHeadline}", system-ui`,
                    fontWeight: brand.fontHeadlineWeight,
                  }}
                >
                  Aa Bb Cc
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function FigmaVariablesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Figma Variables
          <Badge variant="outline" className="text-xs">60 variables</Badge>
          <Badge variant="outline" className="text-xs">29 modes</Badge>
        </CardTitle>
        <CardDescription>
          Figma Variables are synced from Git via <code className="text-xs">npm run push-figma</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { group: "brand", count: 6, desc: "Brand palette colors" },
            { group: "font", count: 8, desc: "Font families & weights" },
            { group: "palette", count: 46, desc: "Semantic & neutral colors" },
          ].map((g) => (
            <div key={g.group} className="p-3 rounded-lg border text-center">
              <p className="font-semibold">{g.group}/</p>
              <p className="text-xs text-muted-foreground">{g.count} variables</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          Each variable includes <code className="text-xs">codeSyntax.WEB</code> so
          developers see the CSS variable name in Figma&apos;s inspect panel.
          Colors can be bound to fills and strokes. Font variables serve as a
          reference lookup (Figma does not support binding variables to font family).
        </p>
      </CardContent>
    </Card>
  );
}

export function TokensPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Design System Token Reference
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            How design tokens flow from Git (source of truth) to Figma, Pencil,
            CSS, and React components. All systems stay in sync via build scripts.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How the token pipeline works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <div className="flex-1 text-center p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                <p className="font-semibold">Git <code className="text-xs">tokens/</code></p>
                <p className="text-muted-foreground text-xs mt-1">
                  Single source of truth
                </p>
              </div>
              <div className="text-muted-foreground text-lg">→</div>
              <div className="flex-1 text-center p-4 rounded-lg bg-muted">
                <p className="font-semibold">
                  <code className="text-xs">npm run build-tokens</code>
                </p>
                <p className="text-muted-foreground text-xs mt-1">Build script</p>
              </div>
              <div className="text-muted-foreground text-lg">→</div>
              <div className="flex-1 space-y-2">
                <div className="text-center p-3 rounded-lg border">
                  <Badge variant="outline">Code</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    brands.ts + tokens.css
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <Badge variant="outline">Figma</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    <code className="text-xs">push-figma</code> → Variables
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <Badge variant="outline">Pencil</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    <code className="text-xs">push-pencil</code> → .pen file
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mapping">
          <TabsList>
            <TabsTrigger value="mapping">Token Mapping</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Values</TabsTrigger>
            <TabsTrigger value="figma">Figma Variables</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="mapping" className="space-y-6 mt-6">
            {TOKEN_MAP.map((section) => (
              <Card key={section.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TokenTable tokens={section.tokens} />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <ResolvedTokensForBrand />
          </TabsContent>

          <TabsContent value="figma" className="mt-6">
            <FigmaVariablesCard />
          </TabsContent>

          <TabsContent value="usage" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>In Pencil (.pen files)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto">
{`// Reference a variable in Pencil node properties:
fill: "$brand-1"                    // themed brand color
fontFamily: "$font-family-default"  // brand's sans-serif font
gap: "$space-md"                    // 16px spacing
cornerRadius: "$border-radius-sm"   // 12px radius

// Apply a brand theme to a frame:
theme: { brand: "Cosmopolitan" }    // resolves all $brand-* vars`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>In React / Tailwind</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto">
{`// Shadcn semantic classes (auto-themed):
<Button>Primary</Button>                // uses --primary (brand-1)
<Badge variant="secondary">Tag</Badge>  // uses --secondary (brand-2)

// Font utilities:
<p className="font-brand">Body text</p>           // --font-brand
<p className="font-brand-secondary">Eyebrow</p>   // --font-brand-secondary
<h1 className="headline">Article Title</h1>       // --font-headline + weight

// CSS custom properties directly:
<div style={{ color: 'var(--brand-primary)' }}>Branded text</div>
<div style={{ background: 'var(--palette-background-subtle-brand)' }}>...</div>

// Brand switching in React:
const { setBrand } = useTheme();
setBrand("esquire");`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adding or changing tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Edit the JSON files in <code className="text-xs">tokens/</code> (the
                  single source of truth), then rebuild:
                </p>
                <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto">
{`# 1. Edit the token JSON
#    Global token  → tokens/core/global.json
#    Brand-specific → tokens/brands/{slug}.json
#    Font override  → tokens/brands/_meta.json

# 2. Rebuild generated files
npm run build-tokens

# 3. Commit token JSON + generated files
git add tokens/ src/lib/brands.ts src/lib/tokens.css
git commit -m "tokens: update brand-1 for cosmopolitan"

# 4. After merge, sync consumers
npm run push-figma    # → Figma Variables (designers see the change)
npm run push-pencil   # → Pencil .pen file (handoff specs update)`}
                </pre>
                <Separator />
                <p className="font-medium">Generated files (never edit directly):</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><code className="text-xs">src/lib/brands.ts</code> — TypeScript brand data for React</li>
                  <li><code className="text-xs">src/lib/tokens.css</code> — CSS custom properties per brand</li>
                </ul>
                <Separator />
                <p className="font-medium">Source files (edit these):</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><code className="text-xs">tokens/core/global.json</code> — 401 global tokens (spacing, borders, neutrals)</li>
                  <li><code className="text-xs">tokens/brands/*.json</code> — Per-brand tokens (29 brands, ~600 tokens each)</li>
                  <li><code className="text-xs">tokens/brands/_meta.json</code> — Font overrides (headline, secondary)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground py-8">
          <Link href="/" className="hover:underline">
            ← Back to component showcase
          </Link>
        </footer>
      </main>
    </div>
  );
}
