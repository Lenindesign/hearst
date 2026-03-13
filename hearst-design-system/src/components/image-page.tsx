"use client";

import { useTheme } from "./theme-provider";
import { AspectImage } from "@/components/ui/aspect-image";
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

const BASIC_CODE = `<AspectImage ratio="16:9" src="/hero.jpg" alt="Hero" />
<AspectImage ratio="1:1" rounded="lg" />
<AspectImage ratio="4:5" inset="sm" />`;

const LANDSCAPE_RATIOS: Array<{ ratio: "2:1" | "16:9" | "3:2" | "4:3" | "1:1"; label: string }> = [
  { ratio: "2:1", label: "2:1 — Ultra-wide hero banners" },
  { ratio: "16:9", label: "16:9 — Video, hero images" },
  { ratio: "3:2", label: "3:2 — Article thumbnails" },
  { ratio: "4:3", label: "4:3 — Classic photo format" },
  { ratio: "1:1", label: "1:1 — Square avatars, icons" },
];

const PORTRAIT_RATIOS: Array<{ ratio: "4:5" | "3:4" | "4:6" | "9:16"; label: string }> = [
  { ratio: "4:5", label: "4:5 — Instagram portrait" },
  { ratio: "3:4", label: "3:4 — Classic portrait" },
  { ratio: "4:6", label: "4:6 — Tall portrait" },
  { ratio: "9:16", label: "9:16 — Story / reel format" },
];

const API_PROPS = [
  { name: "ratio", type: '"1:1" | "4:3" | "3:2" | "16:9" | "2:1" | "4:5" | "3:4" | "4:6" | "9:16"', default: '"16:9"', desc: "Aspect ratio constraint" },
  { name: "inset", type: '"none" | "2xs" | "xs" | "sm" | "md"', default: '"none"', desc: "Padding around the image" },
  { name: "rounded", type: '"none" | "sm" | "md" | "lg"', default: '"none"', desc: "Border radius" },
  { name: "src", type: "string", default: "—", desc: "Image source URL" },
  { name: "alt", type: "string", default: '""', desc: "Alt text for accessibility" },
];

export function ImagePage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl tracking-tight headline">Image</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Image components provide consistent aspect-ratio containers for media
          content. They support 9 aspect ratios (landscape, square, and
          portrait) with optional inset padding. Images use object-fit: cover
          to fill the container.
        </p>
      </div>

      <Separator />

      {/* Landscape Ratios */}
      <section className="space-y-6">
        <SectionHeader
          title="Landscape & Square"
          description="Horizontal and square ratios for hero images, thumbnails, video embeds, and avatars."
        />
        <div className="grid grid-cols-5 gap-4 items-end">
          {LANDSCAPE_RATIOS.map((r) => (
            <div key={r.ratio} className="space-y-2">
              <AspectImage ratio={r.ratio} rounded="md" />
              <p className="text-xs text-center font-semibold text-muted-foreground">
                {r.ratio}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Portrait Ratios */}
      <section className="space-y-6">
        <SectionHeader
          title="Portrait"
          description="Vertical ratios for social media content, story formats, and tall imagery."
        />
        <div className="flex gap-4 items-end">
          {PORTRAIT_RATIOS.map((r) => (
            <div key={r.ratio} className="space-y-2 w-40">
              <AspectImage ratio={r.ratio} rounded="md" />
              <p className="text-xs text-center font-semibold text-muted-foreground">
                {r.ratio}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Inset */}
      <section className="space-y-6">
        <SectionHeader
          title="Inset Padding"
          description="Optional padding around the image within its container. The background color shows through the inset gap."
        />
        <div className="grid grid-cols-5 gap-4">
          {(["none", "2xs", "xs", "sm", "md"] as const).map((ins) => (
            <Card key={ins}>
              <CardContent className="pt-4 space-y-3">
                <Badge variant="secondary" className="text-center w-full justify-center">
                  {ins}
                </Badge>
                <AspectImage ratio="1:1" inset={ins} rounded="md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The image component is a constrained container with an image fill."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6 space-y-4">
            <AspectImage ratio="16:9" rounded="md" />
            <AspectImage ratio="1:1" inset="sm" rounded="md" />
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Container"
              description="Overflow-hidden wrapper with aspect-ratio constraint. Background color visible when using inset padding."
            />
            <AnatomyItem
              number={2}
              title="Image"
              description="The image element fills the container with object-fit: cover, cropping as needed to maintain the aspect ratio."
            />
            <AnatomyItem
              number={3}
              title="Inset (Optional)"
              description="Padding between the container edge and the image. Creates a border-like gap showing the background color."
            />
          </div>
        </div>
        <CodeBlock>{BASIC_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common image patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Hero Banner</p>
              <AspectImage ratio="2:1" rounded="lg" />
              <p className="text-xs text-muted-foreground">
                Ultra-wide 2:1 ratio for full-width hero sections.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Article Grid</p>
              <div className="grid grid-cols-3 gap-2">
                <AspectImage ratio="3:2" rounded="sm" />
                <AspectImage ratio="3:2" rounded="sm" />
                <AspectImage ratio="3:2" rounded="sm" />
              </div>
              <p className="text-xs text-muted-foreground">
                3:2 ratio for consistent article thumbnail grids.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Profile Avatars</p>
              <div className="flex gap-3">
                <AspectImage ratio="1:1" rounded="lg" className="w-16" />
                <AspectImage ratio="1:1" rounded="lg" className="w-12" />
                <AspectImage ratio="1:1" rounded="lg" className="w-10" />
                <AspectImage ratio="1:1" rounded="lg" className="w-8" />
              </div>
              <p className="text-xs text-muted-foreground">
                1:1 square ratio at various sizes for user avatars.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Social Story</p>
              <div className="flex gap-3">
                <AspectImage ratio="9:16" rounded="lg" className="w-24" />
                <AspectImage ratio="4:5" rounded="lg" className="w-24" />
              </div>
              <p className="text-xs text-muted-foreground">
                Portrait ratios for social media story and post formats.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <SectionHeader
          title="API Reference"
          description="Props for the AspectImage component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<AspectImage />"}
            </code>
          </div>
          <div className="grid grid-cols-[100px_1fr_80px_1fr] gap-x-4 px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b bg-muted/30">
            <span>Prop</span>
            <span>Type</span>
            <span>Default</span>
            <span>Description</span>
          </div>
          {API_PROPS.map((prop) => (
            <div
              key={prop.name}
              className="grid grid-cols-[100px_1fr_80px_1fr] gap-x-4 px-4 py-2.5 text-xs border-b last:border-0"
            >
              <code className="font-mono font-medium">{prop.name}</code>
              <code className="font-mono text-primary text-[10px]">{prop.type}</code>
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
          description="CSS custom properties consumed by the image component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--muted", usedBy: "Placeholder background", value: "oklch(0.965 0 0)" },
            { token: "--muted-foreground", usedBy: "Placeholder text", value: "oklch(0.556 0 0)" },
            { token: "--radius-sm / md / lg", usedBy: "Border radius variants", value: "Derived from --radius" },
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
              The image component uses the muted token for placeholder
              backgrounds and border radius tokens that adapt across brands.
              Aspect ratios remain consistent across all brands. Switch brands
              in the header to see the image component adapt.
            </p>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-muted-foreground py-8">
        Hearst Design System &middot; Components Library &middot; Built with
        shadcn/ui
      </footer>
    </main>
  );
}
