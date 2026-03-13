"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
  type CarouselApi,
} from "@/components/ui/carousel";
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

function DotIndicators() {
  const { api } = useCarousel();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (count === 0) return null;

  return (
    <div className="flex justify-center gap-1.5 pt-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i === current ? "bg-primary" : "bg-muted-foreground/25"
          }`}
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

const BASIC_CODE = `<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`;

const MULTI_CODE = `<Carousel opts={{ align: "start" }}>
  <CarouselContent>
    <CarouselItem className="basis-1/3">Card 1</CarouselItem>
    <CarouselItem className="basis-1/3">Card 2</CarouselItem>
    <CarouselItem className="basis-1/3">Card 3</CarouselItem>
    ...
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`;

const API_PROPS = [
  { name: "opts", type: "EmblaOptionsType", default: "—", desc: "Embla carousel options (loop, align, dragFree, etc.)" },
  { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', desc: "Scroll axis direction" },
  { name: "plugins", type: "EmblaPluginType[]", default: "—", desc: "Embla plugins (autoplay, auto-scroll, etc.)" },
  { name: "setApi", type: "(api) => void", default: "—", desc: "Callback to receive the carousel API instance" },
];

const SLIDE_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
];

function SlideCard({ index, className }: { index: number; className?: string }) {
  return (
    <div
      className={`flex aspect-[3/2] items-center justify-center rounded-lg text-lg font-bold ${
        SLIDE_COLORS[index % SLIDE_COLORS.length]
      } ${className ?? ""}`}
    >
      Slide {index + 1}
    </div>
  );
}

export function CarouselPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl tracking-tight headline">Carousel</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Carousels display a scrollable set of content items with navigation
          controls. They include a headline, prev/next arrow buttons, a
          horizontal items track, and dot indicators for position.
        </p>
      </div>

      <Separator />

      {/* Basic Example */}
      <section className="space-y-6">
        <SectionHeader
          title="Basic Carousel"
          description="A single-slide carousel with previous/next arrow buttons. Swipe or use the arrows to navigate."
        />
        <div className="border rounded-lg p-6">
          <Carousel className="mx-12">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem key={i}>
                  <SlideCard index={i} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <DotIndicators />
          </Carousel>
        </div>
        <CodeBlock>{BASIC_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Multi-slide */}
      <section className="space-y-6">
        <SectionHeader
          title="Multiple Slides"
          description="Show multiple items at once using basis utility classes. Here each slide takes one-third of the container width."
        />
        <div className="border rounded-lg p-6">
          <Carousel opts={{ align: "start" }} className="mx-12">
            <CarouselContent>
              {Array.from({ length: 8 }).map((_, i) => (
                <CarouselItem key={i} className="basis-1/3">
                  <SlideCard index={i} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <DotIndicators />
          </Carousel>
        </div>
        <CodeBlock>{MULTI_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The carousel is composed of a container, a scrollable track, slide items, and navigation controls."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6">
            <Carousel className="mx-12">
              <CarouselContent>
                {Array.from({ length: 3 }).map((_, i) => (
                  <CarouselItem key={i}>
                    <SlideCard index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
              <DotIndicators />
            </Carousel>
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Carousel Container"
              description="Root wrapper with role='region' and aria-roledescription='carousel'. Handles keyboard navigation (arrow keys)."
            />
            <AnatomyItem
              number={2}
              title="Content Track"
              description="Overflow-hidden container with a flex row of slides. Powered by Embla Carousel for smooth scroll snapping."
            />
            <AnatomyItem
              number={3}
              title="Slide Item"
              description="Individual content slot with role='group' and aria-roledescription='slide'. Width controlled via basis classes."
            />
            <AnatomyItem
              number={4}
              title="Navigation Buttons"
              description="Previous/Next buttons positioned absolutely. Circular outline buttons with chevron icons. Disabled at scroll boundaries."
            />
            <AnatomyItem
              number={5}
              title="Dot Indicators"
              description="Optional position dots below the track. Active dot uses brand color, inactive uses muted foreground."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Variants */}
      <section className="space-y-6">
        <SectionHeader
          title="Variants"
          description="Different carousel configurations for common use cases."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Loop</p>
                <Badge variant="secondary">loop: true</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Infinite scrolling — wraps from last slide back to first and
                vice versa. Navigation buttons are never disabled.
              </p>
              <Carousel opts={{ loop: true }} className="mx-10">
                <CarouselContent>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem key={i}>
                      <SlideCard index={i} className="aspect-[2/1]" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Free Drag</p>
                <Badge variant="secondary">dragFree: true</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Slides move freely without snap points. Content settles at the
                natural momentum position after dragging.
              </p>
              <Carousel opts={{ dragFree: true, align: "start" }} className="mx-10">
                <CarouselContent>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CarouselItem key={i} className="basis-2/5">
                      <SlideCard index={i} className="aspect-[2/1]" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common carousel patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Article Cards Carousel</p>
              <Carousel opts={{ align: "start" }} className="mx-12">
                <CarouselContent>
                  {[
                    "Breaking News: Major Policy Shift",
                    "Tech Review: Latest Smartphone",
                    "Travel Guide: Hidden Gems",
                    "Health & Wellness Tips",
                    "Finance: Market Update",
                  ].map((title, i) => (
                    <CarouselItem key={i} className="basis-1/3">
                      <div className="rounded-lg border overflow-hidden">
                        <div
                          className={`aspect-[3/2] ${SLIDE_COLORS[i % SLIDE_COLORS.length]} flex items-center justify-center p-4 text-sm font-medium text-center`}
                        >
                          {title}
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Category
                          </p>
                          <p className="text-sm font-semibold leading-snug line-clamp-2">
                            {title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            3 min read
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                <DotIndicators />
              </Carousel>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Hero Image Gallery</p>
              <Carousel opts={{ loop: true }} className="mx-12">
                <CarouselContent>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem key={i}>
                      <div
                        className={`aspect-[21/9] rounded-lg ${SLIDE_COLORS[i % SLIDE_COLORS.length]} flex items-center justify-center text-2xl font-bold`}
                      >
                        Hero Image {i + 1}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                <DotIndicators />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <SectionHeader
          title="API Reference"
          description="Props for the Carousel root component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Carousel />"}
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
          description="CSS custom properties consumed by the carousel component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--primary", usedBy: "Active dot indicator", value: "Brand primary color" },
            { token: "--muted-foreground", usedBy: "Inactive dots, chevron icons", value: "oklch(0.556 0 0)" },
            { token: "--border", usedBy: "Navigation button border", value: "oklch(0.922 0 0)" },
            { token: "--background", usedBy: "Navigation button fill", value: "oklch(1 0 0)" },
            { token: "--ring", usedBy: "Focus ring on buttons", value: "oklch(0.708 0 0)" },
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
              The carousel navigation buttons use outline styling that adapts
              across brands via border and background tokens. Active dot
              indicators use the brand primary color. Switch brands in the
              header to see the carousel adapt.
            </p>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-muted-foreground py-8">
        Hearst Design System &middot; Components Library &middot; Built with
        shadcn/ui + Embla Carousel
      </footer>
    </main>
  );
}
