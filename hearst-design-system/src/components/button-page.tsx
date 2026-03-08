"use client";

import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CirclePlus,
  ChevronRight,
  Trash2,
  Download,
  Send,
  Heart,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";

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

function AnatomyItem({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
        {number}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

const VARIANT_CODE = `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`;

const SIZE_CODE = `<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`;

const ICON_CODE = `<Button>
  <CirclePlus data-icon="inline-start" />
  With Icon
</Button>

<Button size="icon">
  <Heart />
</Button>`;

const API_PROPS = [
  { name: "variant", type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"default"', desc: "Visual style variant" },
  { name: "size", type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', default: '"default"', desc: "Button size" },
  { name: "disabled", type: "boolean", default: "false", desc: "Disables interaction" },
];

export function ButtonPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">Button</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Buttons trigger actions or navigate users. They adapt to each brand
          through design tokens for color, typography, and border radius. Six
          variants and four sizes cover all interaction patterns.
        </p>
      </div>

      <Separator />

      {/* Variants */}
      <section className="space-y-6">
        <SectionHeader
          title="Variants"
          description="Six button variants for different levels of visual emphasis and semantic meaning."
        />
        <div className="flex flex-wrap gap-3">
          <Button>
            <CirclePlus data-icon="inline-start" />
            Primary
          </Button>
          <Button variant="secondary">
            <CirclePlus data-icon="inline-start" />
            Secondary
          </Button>
          <Button variant="outline">
            <CirclePlus data-icon="inline-start" />
            Outline
          </Button>
          <Button variant="ghost">
            <CirclePlus data-icon="inline-start" />
            Ghost
          </Button>
          <Button variant="destructive">
            <Trash2 data-icon="inline-start" />
            Destructive
          </Button>
          <Button variant="link">Link</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {[
            { variant: "default" as const, label: "Primary", desc: "High emphasis. Brand color fill with white text. Use for primary actions." },
            { variant: "secondary" as const, label: "Secondary", desc: "Medium emphasis. White fill with brand color border and text." },
            { variant: "outline" as const, label: "Outline", desc: "Neutral emphasis. Gray border with dark text. Use alongside primary buttons." },
            { variant: "ghost" as const, label: "Ghost", desc: "Minimal emphasis. No fill or border. Use for tertiary actions." },
            { variant: "destructive" as const, label: "Destructive", desc: "Danger emphasis. Red tint fill with red text. For delete or destructive actions." },
            { variant: "link" as const, label: "Link", desc: "Text-only with underline on hover. For inline navigation." },
          ].map((v) => (
            <div key={v.variant} className="space-y-1.5">
              <p className="text-sm font-semibold">{v.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        <CodeBlock>{VARIANT_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="Each button is composed of three slots: an optional leading icon, a label, and an optional trailing icon."
        />
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
          <Button size="lg">
            <CirclePlus data-icon="inline-start" />
            Button Label
            <ChevronRight data-icon="inline-end" />
          </Button>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Icon Start"
              description="Optional leading icon. 16×16px from Lucide. Can be hidden per instance."
            />
            <AnatomyItem
              number={2}
              title="Label"
              description="Button text. Uses Inter at semibold (600) weight. Letter-spacing 0.4px."
            />
            <AnatomyItem
              number={3}
              title="Icon End"
              description="Optional trailing icon. Hidden by default. Useful for chevrons or external link indicators."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Sizes */}
      <section className="space-y-6">
        <SectionHeader
          title="Sizes"
          description="Four sizes to fit different contexts, from compact toolbars to prominent CTAs."
        />
        <Tabs defaultValue="text">
          <TabsList>
            <TabsTrigger value="text">With Label</TabsTrigger>
            <TabsTrigger value="icon">Icon Only</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-1 text-center">
                <Button size="xs">Extra Small</Button>
                <p className="text-[10px] text-muted-foreground">xs</p>
              </div>
              <div className="space-y-1 text-center">
                <Button size="sm">Small</Button>
                <p className="text-[10px] text-muted-foreground">sm</p>
              </div>
              <div className="space-y-1 text-center">
                <Button size="default">Default</Button>
                <p className="text-[10px] text-muted-foreground">default</p>
              </div>
              <div className="space-y-1 text-center">
                <Button size="lg">Large</Button>
                <p className="text-[10px] text-muted-foreground">lg</p>
              </div>
            </div>
            <CodeBlock>{SIZE_CODE}</CodeBlock>
          </TabsContent>

          <TabsContent value="icon" className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-1 text-center">
                <Button size="icon-xs">
                  <Heart />
                </Button>
                <p className="text-[10px] text-muted-foreground">icon-xs</p>
              </div>
              <div className="space-y-1 text-center">
                <Button size="icon-sm">
                  <Heart />
                </Button>
                <p className="text-[10px] text-muted-foreground">icon-sm</p>
              </div>
              <div className="space-y-1 text-center">
                <Button size="icon">
                  <Heart />
                </Button>
                <p className="text-[10px] text-muted-foreground">icon</p>
              </div>
              <div className="space-y-1 text-center">
                <Button size="icon-lg">
                  <Heart />
                </Button>
                <p className="text-[10px] text-muted-foreground">icon-lg</p>
              </div>
            </div>
            <CodeBlock>{ICON_CODE}</CodeBlock>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common button patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Form Actions</p>
              <div className="flex gap-2">
                <Button>
                  <Send data-icon="inline-start" />
                  Submit
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Article Actions</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Heart data-icon="inline-start" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 data-icon="inline-start" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark data-icon="inline-start" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Destructive Confirmation</p>
              <div className="flex gap-2">
                <Button variant="destructive">
                  <Trash2 data-icon="inline-start" />
                  Delete
                </Button>
                <Button variant="ghost">Keep</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Download</p>
              <Button variant="secondary">
                <Download data-icon="inline-start" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">External Link</p>
              <Button variant="link">
                View on Figma
                <ExternalLink data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Disabled State</p>
              <div className="flex gap-2">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Disabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <SectionHeader
          title="API Reference"
          description="Props for the Button component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Button />"}
            </code>
          </div>
          <div className="grid grid-cols-[140px_1fr_100px_1fr] gap-x-4 px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b bg-muted/30">
            <span>Prop</span>
            <span>Type</span>
            <span>Default</span>
            <span>Description</span>
          </div>
          {API_PROPS.map((prop) => (
            <div
              key={prop.name}
              className="grid grid-cols-[140px_1fr_100px_1fr] gap-x-4 px-4 py-2.5 text-xs border-b last:border-0"
            >
              <code className="font-mono font-medium">{prop.name}</code>
              <code className="font-mono text-primary">{prop.type}</code>
              <code className="font-mono text-muted-foreground">
                {prop.default}
              </code>
              <span className="text-muted-foreground">{prop.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Design Tokens */}
      <section className="space-y-6">
        <SectionHeader
          title="Design Tokens"
          description="CSS custom properties consumed by the button component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--primary", usedBy: "Primary fill, Secondary text/border", value: brand.colors["1"] || "—" },
            { token: "--primary-foreground", usedBy: "Primary text color", value: "#ffffff" },
            { token: "--destructive", usedBy: "Destructive variant", value: "oklch(0.58 0.22 27)" },
            { token: "--border", usedBy: "Outline variant border", value: "oklch(0.922 0 0)" },
            { token: "--muted", usedBy: "Ghost hover background", value: "oklch(0.97 0 0)" },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-2.5 text-xs border-t">
              <code className="font-mono font-medium">{row.token}</code>
              <span className="text-muted-foreground">{row.usedBy}</span>
              <span className="font-mono text-muted-foreground">{row.value}</span>
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
              Buttons use{" "}
              <span
                className="font-mono font-semibold"
                style={{ color: brand.colors["1"] || Object.values(brand.colors)[0] }}
              >
                {brand.colors["1"] || Object.values(brand.colors)[0]}
              </span>{" "}
              as the primary color. Switch brands in the header to see buttons adapt.
            </p>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-muted-foreground py-8">
        Hearst Design System &middot; Components Library &middot; Built with shadcn/ui
      </footer>
    </main>
  );
}
