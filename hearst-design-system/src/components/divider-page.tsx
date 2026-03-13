"use client";

import { useTheme } from "./theme-provider";
import { Divider } from "@/components/ui/divider";
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

const BASIC_CODE = `<Divider />                          {/* sm subtle (default) */}
<Divider size="md" />                {/* md subtle */}
<Divider size="lg" variant="default" /> {/* lg default (dark) */}`;

const API_PROPS = [
  { name: "size", type: '"sm" | "md" | "lg"', default: '"sm"', desc: "Height of the divider — 1px, 2px, or 4px" },
  { name: "variant", type: '"subtle" | "default"', default: '"subtle"', desc: "Color intensity — subtle (gray) or default (dark)" },
  { name: "className", type: "string", default: "—", desc: "Additional CSS classes" },
];

const SIZES: Array<{ size: "sm" | "md" | "lg"; label: string; height: string }> = [
  { size: "sm", label: "Small", height: "1px" },
  { size: "md", label: "Medium", height: "2px" },
  { size: "lg", label: "Large", height: "4px" },
];

const VARIANTS: Array<{ variant: "subtle" | "default"; label: string; desc: string }> = [
  { variant: "subtle", label: "Subtle", desc: "Light gray for soft, unobtrusive separation between related content." },
  { variant: "default", label: "Default", desc: "Dark fill for strong visual breaks between distinct sections." },
];

export function DividerPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl tracking-tight headline">Divider</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Dividers are horizontal rules used to visually separate content
          sections. They come in three sizes (sm, md, lg) and two variants
          (subtle and default) to create different levels of visual hierarchy.
        </p>
      </div>

      <Separator />

      {/* All Variants */}
      <section className="space-y-6">
        <SectionHeader
          title="Sizes & Variants"
          description="Six combinations of size and variant. Subtle uses neutral gray for light separation; default uses dark fill for strong visual breaks."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SIZES.map((s) =>
            VARIANTS.map((v) => (
              <Card key={`${s.size}-${v.variant}`}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      {s.label}
                    </p>
                    <Badge variant="secondary">
                      {s.size} / {v.variant}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {s.height}
                    </span>
                  </div>
                  <div className="py-4">
                    <Divider size={s.size} variant={v.variant} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <CodeBlock>{BASIC_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The divider is a single horizontal rule element with configurable height and color."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Content above</p>
              <Divider size="md" variant="default" />
              <p className="text-xs text-muted-foreground">Content below</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Content above</p>
              <Divider size="sm" variant="subtle" />
              <p className="text-xs text-muted-foreground">Content below</p>
            </div>
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Rule"
              description="A full-width horizontal line. Height determined by size prop (1px, 2px, or 4px). No border — uses background fill."
            />
            <AnatomyItem
              number={2}
              title="Color"
              description="Variant controls the fill color. Subtle uses the border token (neutral gray), default uses the foreground token (dark)."
            />
            <AnatomyItem
              number={3}
              title="Spacing"
              description="The divider itself has no built-in margin. Surrounding spacing is controlled by the parent layout's gap or padding."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common divider patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Section Separator</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use a large default divider between major page sections for a
                strong visual break.
              </p>
              <div className="space-y-3 text-sm">
                <p className="font-medium">Section One</p>
                <p className="text-muted-foreground text-xs">
                  Content for the first section goes here.
                </p>
                <Divider size="lg" variant="default" />
                <p className="font-medium">Section Two</p>
                <p className="text-muted-foreground text-xs">
                  Content for the second section goes here.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">List Item Separator</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use a small subtle divider between list items for light
                separation without visual noise.
              </p>
              <div className="space-y-0">
                {["Article One", "Article Two", "Article Three"].map(
                  (item, i, arr) => (
                    <div key={item}>
                      <div className="py-3">
                        <p className="text-sm font-medium">{item}</p>
                        <p className="text-xs text-muted-foreground">
                          Published 2 hours ago
                        </p>
                      </div>
                      {i < arr.length - 1 && (
                        <Divider size="sm" variant="subtle" />
                      )}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Card Footer Divider</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use a medium subtle divider to separate card content from
                footer actions.
              </p>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4">
                  <p className="text-sm font-medium">Card Title</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Card description content goes here with some details.
                  </p>
                </div>
                <Divider size="md" variant="subtle" />
                <div className="p-4 flex justify-end gap-2">
                  <span className="text-xs text-primary font-medium cursor-pointer">
                    Read More
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Size Comparison</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All three sizes side by side for visual reference.
              </p>
              <div className="space-y-6">
                {SIZES.map((s) => (
                  <div key={s.size} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{s.size}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {s.height}
                      </span>
                    </div>
                    <Divider size={s.size} variant="default" />
                  </div>
                ))}
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
          description="Props for the Divider component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Divider />"}
            </code>
          </div>
          <div className="grid grid-cols-[120px_1fr_80px_1fr] gap-x-4 px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b bg-muted/30">
            <span>Prop</span>
            <span>Type</span>
            <span>Default</span>
            <span>Description</span>
          </div>
          {API_PROPS.map((prop) => (
            <div
              key={prop.name}
              className="grid grid-cols-[120px_1fr_80px_1fr] gap-x-4 px-4 py-2.5 text-xs border-b last:border-0"
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
          description="CSS custom properties consumed by the divider component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--border", usedBy: "Subtle variant fill", value: "oklch(0.922 0 0)" },
            { token: "--foreground", usedBy: "Default variant fill", value: "oklch(0.145 0 0)" },
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
              Dividers use the border and foreground tokens which adapt
              subtly across brands. The subtle variant provides a neutral
              separator while the default variant uses the full foreground
              color for maximum contrast. Switch brands in the header to see
              the divider adapt.
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
