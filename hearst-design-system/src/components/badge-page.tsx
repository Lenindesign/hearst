"use client";

import { useTheme } from "./theme-provider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  TriangleAlert,
  X,
  Star,
  MapPin,
  Tag,
  Clock,
  Flame,
  Zap,
  Shield,
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

const VARIANT_CODE = `<Badge>Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="highlight">Highlight</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="neutral-dark">Neutral Dark</Badge>
<Badge variant="neutral-light">Neutral Light</Badge>`;

const ICON_CODE = `<Badge variant="success">
  <Check data-icon="inline-start" />
  Published
</Badge>

<Badge variant="warning">
  <TriangleAlert data-icon="inline-start" />
  Pending
</Badge>`;

const API_PROPS = [
  { name: "variant", type: '"default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "highlight" | "danger" | "neutral-dark" | "neutral-light" | "ghost" | "link"', default: '"default"', desc: "Visual style variant" },
  { name: "render", type: "RenderProp", default: "—", desc: "Custom render element" },
];

type BadgeVariant = "default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "highlight" | "danger" | "neutral-dark" | "neutral-light" | "ghost" | "link";

const COLOR_VARIANTS: { variant: BadgeVariant; label: string; desc: string }[] = [
  { variant: "default", label: "Primary", desc: "Brand color fill, white text. For branded labels and categories." },
  { variant: "neutral-dark", label: "Neutral Dark", desc: "Semi-transparent dark fill. For secondary metadata." },
  { variant: "neutral-light", label: "Neutral Light", desc: "Subtle tint fill. For low-emphasis tags." },
  { variant: "success", label: "Success", desc: "Green tint. For positive states like published, active, or complete." },
  { variant: "warning", label: "Warning", desc: "Orange tint. For caution states like pending or needs review." },
  { variant: "highlight", label: "Highlight", desc: "Yellow tint. For featured, promoted, or new items." },
  { variant: "danger", label: "Danger", desc: "Red tint. For error states, expired, or removed items." },
];

const STYLE_VARIANTS: { variant: BadgeVariant; label: string; desc: string }[] = [
  { variant: "secondary", label: "Secondary", desc: "Muted background. For low-emphasis labels." },
  { variant: "outline", label: "Outline", desc: "Border only. For minimal visual weight." },
  { variant: "destructive", label: "Destructive", desc: "Red tint with destructive token. Matches button destructive." },
  { variant: "ghost", label: "Ghost", desc: "No background. Appears on hover." },
  { variant: "link", label: "Link", desc: "Text-only with underline on hover." },
];

export function BadgePage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl font-semibold tracking-tight font-headline">Badge</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Badges are compact labels used to highlight status, categories, or
          metadata. Twelve variants cover semantic colors, style options, and
          interactive patterns while adapting to each brand.
        </p>
      </div>

      <Separator />

      {/* Color Variants */}
      <section className="space-y-6">
        <SectionHeader
          title="Color Variants"
          description="Seven color variants for different semantic purposes. Each adapts to the active brand theme."
        />
        <div className="flex flex-wrap gap-2">
          {COLOR_VARIANTS.map((v) => (
            <Badge key={v.variant} variant={v.variant}>
              {v.label}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {COLOR_VARIANTS.map((v) => (
            <div key={v.variant} className="space-y-1.5">
              <p className="text-sm font-semibold">{v.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Style Variants */}
      <section className="space-y-6">
        <SectionHeader
          title="Style Variants"
          description="Additional style variants for different visual contexts."
        />
        <div className="flex flex-wrap gap-2">
          {STYLE_VARIANTS.map((v) => (
            <Badge key={v.variant} variant={v.variant}>
              {v.label}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {STYLE_VARIANTS.map((v) => (
            <div key={v.variant} className="space-y-1.5">
              <p className="text-sm font-semibold">{v.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="Each badge is composed of two slots: an optional leading icon and a label."
        />
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
          <Badge>
            <MapPin data-icon="inline-start" />
            Badge Label
          </Badge>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Icon"
              description="Optional leading icon. 12×12px from Lucide. Hidden by default, can be enabled per instance."
            />
            <AnatomyItem
              number={2}
              title="Label"
              description="Badge text. Uses brand default font at medium (500) weight, 12px."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* With Icons */}
      <section className="space-y-6">
        <SectionHeader
          title="With Icons"
          description="Badges can include a leading icon for additional context."
        />
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">
            <Check data-icon="inline-start" />
            Published
          </Badge>
          <Badge variant="warning">
            <TriangleAlert data-icon="inline-start" />
            Pending
          </Badge>
          <Badge variant="danger">
            <X data-icon="inline-start" />
            Expired
          </Badge>
          <Badge variant="highlight">
            <Star data-icon="inline-start" />
            Featured
          </Badge>
          <Badge>
            <Flame data-icon="inline-start" />
            Trending
          </Badge>
          <Badge variant="neutral-dark">
            <Clock data-icon="inline-start" />
            Draft
          </Badge>
        </div>
        <CodeBlock>{ICON_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common badge patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Article Status</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">
                  <Check data-icon="inline-start" />
                  Published
                </Badge>
                <Badge variant="warning">
                  <Clock data-icon="inline-start" />
                  Scheduled
                </Badge>
                <Badge variant="neutral-dark">Draft</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Content Tags</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral-light">Automotive</Badge>
                <Badge variant="neutral-light">Reviews</Badge>
                <Badge variant="neutral-light">Electric</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Feature Flags</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="highlight">
                  <Zap data-icon="inline-start" />
                  New
                </Badge>
                <Badge>
                  <Shield data-icon="inline-start" />
                  Premium
                </Badge>
                <Badge variant="outline">
                  <Tag data-icon="inline-start" />
                  Sale
                </Badge>
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
          description="Props for the Badge component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Badge />"}
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
              <code className="font-mono text-primary break-all">{prop.type}</code>
              <code className="font-mono text-muted-foreground">
                {prop.default}
              </code>
              <span className="text-muted-foreground">{prop.desc}</span>
            </div>
          ))}
        </div>

        <CodeBlock>{VARIANT_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Design Tokens */}
      <section className="space-y-6">
        <SectionHeader
          title="Design Tokens"
          description="CSS custom properties consumed by the badge component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--primary", usedBy: "Default variant fill", value: brand.colors["1"] || "—" },
            { token: "--primary-foreground", usedBy: "Default variant text", value: "#ffffff" },
            { token: "--secondary", usedBy: "Secondary variant fill", value: "oklch(0.97 0 0)" },
            { token: "--destructive", usedBy: "Destructive variant", value: "oklch(0.58 0.22 27)" },
            { token: "--border", usedBy: "Outline variant border", value: "oklch(0.922 0 0)" },
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
              The primary badge uses{" "}
              <span
                className="font-mono font-semibold"
                style={{ color: brand.colors["1"] || Object.values(brand.colors)[0] }}
              >
                {brand.colors["1"] || Object.values(brand.colors)[0]}
              </span>{" "}
              as the fill color. Semantic variants (success, warning, danger, highlight) use
              fixed colors across all brands. Switch brands in the header to see badges adapt.
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
