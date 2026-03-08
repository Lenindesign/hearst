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

const PENCIL_TO_CSS_MAP = [
  {
    category: "Brand Colors",
    tokens: [
      {
        pencil: "$brand-1",
        css: "--brand-primary",
        tailwind: "bg-primary / text-primary",
        desc: "Primary brand color",
      },
      {
        pencil: "$brand-2",
        css: "--brand-2",
        tailwind: "bg-secondary",
        desc: "Secondary brand color",
      },
      {
        pencil: "$brand-3",
        css: "--brand-3",
        tailwind: "bg-accent",
        desc: "Accent color",
      },
      {
        pencil: "$brand-4",
        css: "--brand-4",
        tailwind: "—",
        desc: "Brand color 4",
      },
      {
        pencil: "$brand-5",
        css: "--brand-5",
        tailwind: "—",
        desc: "Brand color 5",
      },
      {
        pencil: "$brand-6",
        css: "--brand-6",
        tailwind: "—",
        desc: "Brand color 6",
      },
    ],
  },
  {
    category: "Typography",
    tokens: [
      {
        pencil: "$font-family-default",
        css: "--font-brand-sans",
        tailwind: "font-sans",
        desc: "Default sans-serif font",
      },
      {
        pencil: "$font-family-serif",
        css: "--font-brand-secondary",
        tailwind: "font-secondary",
        desc: "Secondary font",
      },
    ],
  },
  {
    category: "Semantic Colors",
    tokens: [
      {
        pencil: "$content-default",
        css: "--foreground",
        tailwind: "text-foreground",
        desc: "Default text color",
      },
      {
        pencil: "$content-subtle",
        css: "--muted-foreground",
        tailwind: "text-muted-foreground",
        desc: "Subtle/secondary text",
      },
      {
        pencil: "$background-default",
        css: "--background",
        tailwind: "bg-background",
        desc: "Page background",
      },
      {
        pencil: "$background-subtle",
        css: "--muted",
        tailwind: "bg-muted",
        desc: "Subtle background",
      },
      {
        pencil: "$content-error",
        css: "--destructive",
        tailwind: "text-destructive",
        desc: "Error/destructive color",
      },
    ],
  },
  {
    category: "Spacing",
    tokens: [
      { pencil: "$space-xs", css: "0.5rem", tailwind: "p-2 / gap-2", desc: "8px" },
      { pencil: "$space-sm", css: "0.75rem", tailwind: "p-3 / gap-3", desc: "12px" },
      { pencil: "$space-md", css: "1rem", tailwind: "p-4 / gap-4", desc: "16px" },
      { pencil: "$space-lg", css: "1.5rem", tailwind: "p-6 / gap-6", desc: "24px" },
      { pencil: "$space-xl", css: "2rem", tailwind: "p-8 / gap-8", desc: "32px" },
    ],
  },
  {
    category: "Border Radius",
    tokens: [
      {
        pencil: "$border-radius-sm",
        css: "--radius-sm",
        tailwind: "rounded-sm",
        desc: "Small radius",
      },
      {
        pencil: "$border-radius-md",
        css: "--radius-md",
        tailwind: "rounded-md",
        desc: "Medium radius",
      },
      {
        pencil: "$border-radius-lg",
        css: "--radius-lg",
        tailwind: "rounded-lg",
        desc: "Large radius",
      },
      {
        pencil: "$border-radius-rounded",
        css: "9999px",
        tailwind: "rounded-full",
        desc: "Fully rounded",
      },
    ],
  },
];

function TokenTable({
  tokens,
}: {
  tokens: {
    pencil: string;
    css: string;
    tailwind: string;
    desc: string;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              Pencil Variable
            </th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              CSS Property
            </th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              Tailwind Class
            </th>
            <th className="text-left py-2 font-medium text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.pencil} className="border-b last:border-0">
              <td className="py-2.5 pr-4">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {t.pencil}
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
          <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: primary }}
          />
          {brand.name} — Resolved Values
        </CardTitle>
        <CardDescription>
          How this brand&apos;s tokens resolve in both Pencil and code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                  Token
                </th>
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                  Resolved Value
                </th>
                <th className="text-left py-2 font-medium text-muted-foreground">
                  Preview
                </th>
              </tr>
            </thead>
            <tbody>
              {meaningful.map(([k, v]) => (
                <tr key={k} className="border-b last:border-0">
                  <td className="py-2.5 pr-4">
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      brand-{k}
                    </code>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs">{v}</td>
                  <td className="py-2.5">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: v }}
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-b">
                <td className="py-2.5 pr-4">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    font-family-default
                  </code>
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs">
                  {brand.fontDefault}
                </td>
                <td
                  className="py-2.5 text-sm"
                  style={{ fontFamily: `"${brand.fontDefault}", system-ui` }}
                >
                  Aa Bb Cc
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    font-family-serif
                  </code>
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs">
                  {brand.fontSecondary}
                </td>
                <td
                  className="py-2.5 text-sm"
                  style={{
                    fontFamily: `"${brand.fontSecondary}", Georgia, serif`,
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

export function TokensPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pencil ↔ Code Token Mapping
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            This reference shows how design tokens in Pencil map to CSS custom
            properties and Tailwind classes. Both systems are synced from the
            same Figma Token Studio API.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How the sync works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <div className="flex-1 text-center p-4 rounded-lg bg-muted">
                <p className="font-semibold">Figma Token Studio API</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Single source of truth
                </p>
              </div>
              <div className="text-muted-foreground text-lg">→</div>
              <div className="flex-1 text-center p-4 rounded-lg bg-muted">
                <p className="font-semibold">
                  <code className="text-xs">npm run sync-tokens</code>
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Sync script
                </p>
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
                  <Badge variant="outline">Pencil</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    pencil-variables.json → set_variables
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
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="mapping" className="space-y-6 mt-6">
            {PENCIL_TO_CSS_MAP.map((section) => (
              <Card key={section.category}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {section.category}
                  </CardTitle>
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

          <TabsContent value="usage" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>In Pencil (.pen files)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto">
{`// Reference a variable in Pencil node properties:
fill: "$brand-1"              // uses the themed brand color
fontFamily: "$font-family-default"  // uses the brand's sans-serif font
gap: "$space-md"              // uses 16px spacing
cornerRadius: "$border-radius-sm"  // uses 12px radius

// Apply a brand theme to a frame:
theme: { brand: "Cosmopolitan" }   // resolves all $brand-* vars for Cosmo`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>In React / Tailwind</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto">
{`// Use shadcn's semantic classes (auto-themed):
<Button>Primary</Button>           // uses --primary (brand-1)
<Badge variant="secondary">Tag</Badge>  // uses --secondary (brand-2)

// Use CSS custom properties directly:
<div style={{ color: 'var(--brand-primary)' }}>
  Branded text
</div>

// Use data-brand attribute for per-brand CSS:
<div data-brand="cosmopolitan">
  {/* All --brand-* vars resolve to Cosmo values */}
</div>

// Switch brand in React:
const { setBrand } = useTheme();
setBrand("esquire");`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Syncing tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Run the sync script to pull latest tokens from the Figma Token
                  Studio API and regenerate all output files:
                </p>
                <pre className="text-xs font-mono bg-muted p-4 rounded-lg">
                  npm run sync-tokens
                </pre>
                <p className="text-muted-foreground">This generates:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <code className="text-xs">src/lib/brands.ts</code> — TypeScript brand
                    data for React
                  </li>
                  <li>
                    <code className="text-xs">src/lib/tokens.css</code> — CSS custom
                    properties per brand
                  </li>
                  <li>
                    <code className="text-xs">src/lib/pencil-variables.json</code> — JSON
                    for Pencil MCP set_variables
                  </li>
                </ul>
                <Separator />
                <p className="text-muted-foreground">
                  To update Pencil, open the .pen file and use the Pencil MCP:
                </p>
                <pre className="text-xs font-mono bg-muted p-4 rounded-lg">
{`// In Cursor, with pencil-new.pen open:
CallMcpTool("user-pencil", "set_variables", {
  filePath: "pencil-new.pen",
  variables: require("./src/lib/pencil-variables.json")
})`}
                </pre>
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
