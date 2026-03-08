"use client";

import { useTheme } from "./theme-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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

const BASIC_CODE = `<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>
      Panel content goes here.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Another Section</AccordionTrigger>
    <AccordionContent>
      More content here.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const MULTIPLE_CODE = `<Accordion type="multiple" defaultValue={["item-1", "item-3"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>First</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
  ...
</Accordion>`;

const API_PROPS = [
  { name: "type", type: '"single" | "multiple"', default: "—", desc: "Single or multiple items open at once" },
  { name: "collapsible", type: "boolean", default: "false", desc: "Allow all items to close (single mode)" },
  { name: "defaultValue", type: "string | string[]", default: "—", desc: "Initially expanded item(s)" },
  { name: "value", type: "string | string[]", default: "—", desc: "Controlled expanded item(s)" },
  { name: "disabled", type: "boolean", default: "false", desc: "Disable all items" },
];

const FAQ_ITEMS = [
  {
    q: "What is a design system?",
    a: "A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications. It includes design tokens, UI components, patterns, and documentation.",
  },
  {
    q: "How do design tokens work?",
    a: "Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hard-coded values (such as hex values for color or pixel values for spacing) in order to maintain a scalable and consistent visual system.",
  },
  {
    q: "Can I customize components per brand?",
    a: "Yes. Every component consumes CSS custom properties (design tokens) that are overridden per brand. When you switch brands, colors, typography, and spacing adapt automatically without changing component code.",
  },
  {
    q: "What icon library is used?",
    a: "We use Lucide icons throughout the design system. Lucide is an open-source icon library with over 1,000 icons, designed with a consistent 24×24 grid and 2px stroke width.",
  },
];

const SETTINGS_ITEMS = [
  {
    title: "Notifications",
    content: "Configure email and push notification preferences. Choose which events trigger alerts and how they are delivered.",
  },
  {
    title: "Privacy",
    content: "Manage your data sharing preferences, cookie consent, and account visibility settings.",
  },
  {
    title: "Accessibility",
    content: "Adjust font sizes, contrast modes, reduced motion preferences, and screen reader optimizations.",
  },
];

export function AccordionPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">Accordion</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Accordions organize content into collapsible sections. Each item has a
          header with a chevron indicator and an expandable panel. They reduce
          visual clutter while keeping content accessible.
        </p>
      </div>

      <Separator />

      {/* Live Example */}
      <section className="space-y-6">
        <SectionHeader
          title="Live Example"
          description="A group of collapsible items. The first item is expanded by default. Click any header to toggle its panel."
        />
        <div className="border rounded-lg p-6">
          <Accordion defaultValue={["item-0"]}>
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <CodeBlock>{BASIC_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="Each accordion item is composed of a header row and an expandable panel."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6">
            <Accordion defaultValue={["anatomy"]}>
              <AccordionItem value="anatomy">
                <AccordionTrigger>Section Title</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Panel content goes here. This area can contain text, images,
                    or any other components.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Header"
              description="Horizontal row with header text and chevron indicator. Bottom border separates items."
            />
            <AnatomyItem
              number={2}
              title="Header Text"
              description="Section title. Uses brand default font at medium weight, 14px. Fills available width."
            />
            <AnatomyItem
              number={3}
              title="Indicator"
              description="Chevron icon that toggles between down (collapsed) and up (expanded). Positioned at the end of the header row."
            />
            <AnatomyItem
              number={4}
              title="Panel"
              description="Expandable content area with animated open/close. Can contain any content — text, lists, images, or nested components."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Modes */}
      <section className="space-y-6">
        <SectionHeader
          title="Modes"
          description="Two modes control how many items can be expanded simultaneously."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Single</p>
                <Badge variant="secondary">type=&quot;single&quot;</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Only one item can be open at a time. Opening a new item
                automatically closes the previous one. Use{" "}
                <code className="font-mono text-[11px]">collapsible</code> to
                allow closing all items.
              </p>
              <Accordion>
                <AccordionItem value="s1">
                  <AccordionTrigger>First section</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">Only one open at a time.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="s2">
                  <AccordionTrigger>Second section</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">Opening this closes the other.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Multiple</p>
                <Badge variant="secondary">type=&quot;multiple&quot;</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Any number of items can be open simultaneously. Each item
                toggles independently.
              </p>
              <Accordion multiple defaultValue={["m1"]}>
                <AccordionItem value="m1">
                  <AccordionTrigger>First section</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">Multiple items can be open.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="m2">
                  <AccordionTrigger>Second section</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">This can be open too.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <CodeBlock>{MULTIPLE_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common accordion patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">FAQ Section</p>
              <Accordion>
                {FAQ_ITEMS.slice(0, 3).map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Settings Panel</p>
              <Accordion multiple>
                {SETTINGS_ITEMS.map((item, i) => (
                  <AccordionItem key={i} value={`set-${i}`}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <SectionHeader
          title="API Reference"
          description="Props for the Accordion root component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Accordion />"}
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
          description="CSS custom properties consumed by the accordion component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--border", usedBy: "Item separator", value: "oklch(0.922 0 0)" },
            { token: "--muted-foreground", usedBy: "Chevron indicator color", value: "oklch(0.556 0 0)" },
            { token: "--ring", usedBy: "Focus ring", value: "oklch(0.708 0 0)" },
            { token: "--foreground", usedBy: "Header text", value: "oklch(0.145 0 0)" },
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
              The accordion uses neutral border and text tokens that adapt subtly
              across brands. The chevron indicator and focus ring follow the
              global token system. Switch brands in the header to see the
              accordion adapt.
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
