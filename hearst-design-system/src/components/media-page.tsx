"use client";

import { useTheme } from "./theme-provider";
import { Media } from "@/components/ui/media";
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

const BASIC_CODE = `<Media ratio="16:9" icon="play" iconPosition="center" />
<Media ratio="4:3" icon="headphones" iconPosition="bottom-right" iconMode="dark" />
<Media ratio="1:1" src="/video-thumb.jpg" icon="play" iconPosition="center" />`;

const POSITIONS = [
  { position: "center", label: "Center" },
  { position: "top-left", label: "Top-Left" },
  { position: "top-right", label: "Top-Right" },
  { position: "bottom-left", label: "Bottom-Left" },
  { position: "bottom-right", label: "Bottom-Right" },
] as const;

const API_PROPS = [
  { name: "ratio", type: '"1:1" | "4:3" | "3:2" | "16:9" | "21:9" | "2:1" | "4:5" | "3:4" | "4:6" | "9:16"', default: '"16:9"', desc: "Aspect ratio constraint" },
  { name: "inset", type: '"none" | "2xs" | "xs" | "sm" | "md"', default: '"none"', desc: "Padding around the image" },
  { name: "rounded", type: '"none" | "sm" | "md" | "lg"', default: '"none"', desc: "Border radius" },
  { name: "src", type: "string", default: "—", desc: "Image source URL" },
  { name: "alt", type: "string", default: '""', desc: "Alt text for accessibility" },
  { name: "icon", type: '"play" | "headphones"', default: '"play"', desc: "Media type icon" },
  { name: "iconPosition", type: '"center" | "top-left" | "top-right" | "bottom-left" | "bottom-right"', default: '"center"', desc: "Position of the icon overlay" },
  { name: "iconMode", type: '"light" | "dark"', default: '"light"', desc: "Icon background color mode" },
  { name: "iconSize", type: "number", default: "40", desc: "Icon container size in pixels" },
];

export function MediaPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">Media</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Media components extend the Image component with an overlay layer
          containing a media icon (play, headphones). The icon can be positioned
          at 5 locations with light or dark mode backgrounds. Used for video
          thumbnails, audio content, and interactive media.
        </p>
      </div>

      <Separator />

      {/* Icon Positions */}
      <section className="space-y-6">
        <SectionHeader
          title="Icon Positions"
          description="The media icon can be placed at five positions: center, top-left, top-right, bottom-left, and bottom-right."
        />
        <div className="grid grid-cols-5 gap-4">
          {POSITIONS.map((p) => (
            <div key={p.position} className="space-y-2">
              <Media
                ratio="4:3"
                icon="play"
                iconPosition={p.position}
                rounded="md"
              />
              <p className="text-xs text-center font-semibold text-muted-foreground">
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Icon Types */}
      <section className="space-y-6">
        <SectionHeader
          title="Icon Types"
          description="Choose the icon that represents the media content type."
        />
        <div className="grid grid-cols-2 gap-6 max-w-lg">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Media ratio="16:9" icon="play" rounded="md" />
              <div className="text-center">
                <p className="text-sm font-semibold">Play</p>
                <p className="text-xs text-muted-foreground">Video content</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Media ratio="16:9" icon="headphones" rounded="md" />
              <div className="text-center">
                <p className="text-sm font-semibold">Headphones</p>
                <p className="text-xs text-muted-foreground">Audio / podcast</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Light vs Dark Mode */}
      <section className="space-y-6">
        <SectionHeader
          title="Icon Mode"
          description="The icon container supports light and dark backgrounds for contrast on different imagery."
        />
        <div className="grid grid-cols-2 gap-6 max-w-lg">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Media ratio="16:9" icon="play" iconMode="light" rounded="md" />
              <div className="text-center">
                <Badge variant="secondary">Light</Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  White background, dark icon
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Media ratio="16:9" icon="play" iconMode="dark" rounded="md" />
              <div className="text-center">
                <Badge variant="secondary">Dark</Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Dark background, white icon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The media component layers an icon overlay on top of an aspect-ratio image container."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6">
            <Media ratio="16:9" icon="play" rounded="md" />
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Image Container"
              description="Aspect-ratio constrained frame with clipping. Identical to the Image component."
            />
            <AnatomyItem
              number={2}
              title="Overlay Layer"
              description="Absolute-positioned layer over the image. Handles icon placement at 5 positions."
            />
            <AnatomyItem
              number={3}
              title="Icon Wrap"
              description="40px circular container with white or dark semi-transparent background. Holds the media icon."
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
          description="Common media patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Video Thumbnail</p>
              <Media ratio="16:9" icon="play" iconPosition="center" rounded="lg" />
              <p className="text-xs text-muted-foreground">
                Centered play icon on a 16:9 video thumbnail.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Podcast Episode</p>
              <Media ratio="1:1" icon="headphones" iconPosition="bottom-right" rounded="lg" />
              <p className="text-xs text-muted-foreground">
                Headphones icon at bottom-right for audio content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Article Video Card</p>
              <div className="space-y-2">
                <Media ratio="3:2" icon="play" iconPosition="bottom-left" rounded="md" />
                <p className="text-xs font-semibold">Breaking: Latest Updates</p>
                <p className="text-[10px] text-muted-foreground">2 min read</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Play icon at bottom-left for article video cards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Dark Mode Overlay</p>
              <Media ratio="16:9" icon="play" iconMode="dark" iconPosition="center" rounded="lg" />
              <p className="text-xs text-muted-foreground">
                Dark icon background for light imagery.
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
          description="Props for the Media component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Media />"}
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
          description="CSS custom properties consumed by the media component."
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
              The media component extends Image with an icon overlay. It inherits
              all Image tokens (muted background, border radius) and adds icon
              positioning. The icon container uses white/90 or black/70 opacity
              for consistent contrast. Switch brands in the header to see the
              component adapt.
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
