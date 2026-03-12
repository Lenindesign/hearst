"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { Chip } from "@/components/ui/chip";
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

const TOGGLE_CODE = `const [selected, setSelected] = useState(false);

<Chip
  variant={selected ? "selected" : "default"}
  onClick={() => setSelected(!selected)}
>
  Category
</Chip>`;

const DISMISS_CODE = `const [visible, setVisible] = useState(true);

{visible && (
  <Chip onDismiss={() => setVisible(false)}>
    Tag Name
  </Chip>
)}`;

const API_PROPS = [
  { name: "variant", type: '"default" | "selected"', default: '"default"', desc: "Visual state of the chip" },
  { name: "size", type: '"md" | "lg"', default: '"lg"', desc: "Chip height — md (24px) or lg (32px)" },
  { name: "onDismiss", type: "() => void", default: "—", desc: "Makes chip dismissible with X button" },
  { name: "disabled", type: "boolean", default: "false", desc: "Disables interaction" },
  { name: "children", type: "ReactNode", default: "—", desc: "Label content" },
];

function ToggleChipDemo() {
  const [selected, setSelected] = React.useState<Set<string>>(
    new Set(["News"])
  );

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const categories = ["News", "Sports", "Tech", "Health", "Finance", "Travel"];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Chip
          key={cat}
          variant={selected.has(cat) ? "selected" : "default"}
          onClick={() => toggle(cat)}
        >
          {cat}
        </Chip>
      ))}
    </div>
  );
}

function DismissibleChipDemo() {
  const [tags, setTags] = React.useState([
    "React",
    "TypeScript",
    "Tailwind",
    "Next.js",
    "shadcn/ui",
  ]);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Chip
          key={tag}
          onDismiss={() => setTags((prev) => prev.filter((t) => t !== tag))}
        >
          {tag}
        </Chip>
      ))}
      {tags.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          All tags removed.{" "}
          <button
            className="underline"
            onClick={() =>
              setTags(["React", "TypeScript", "Tailwind", "Next.js", "shadcn/ui"])
            }
          >
            Reset
          </button>
        </p>
      )}
    </div>
  );
}

export function ChipPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl font-semibold tracking-tight font-headline">Chip</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Chips are compact, pill-shaped elements used for filtering, selecting
          options, or displaying dismissible tags. They come in toggle and
          dismissible types, with primary and neutral color variants.
        </p>
      </div>

      <Separator />

      {/* Toggle Chips */}
      <section className="space-y-6">
        <SectionHeader
          title="Toggle Chips"
          description="Selectable chips that toggle between default and selected states. Use for filtering content by category."
        />
        <div className="border rounded-lg p-6">
          <ToggleChipDemo />
        </div>
        <CodeBlock>{TOGGLE_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Dismissible Chips */}
      <section className="space-y-6">
        <SectionHeader
          title="Dismissible Chips"
          description="Removable chips with an X close button. Use for displaying applied filters or tags that can be cleared."
        />
        <div className="border rounded-lg p-6">
          <DismissibleChipDemo />
        </div>
        <CodeBlock>{DISMISS_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Sizes */}
      <section className="space-y-6">
        <SectionHeader
          title="Sizes"
          description="Two sizes to fit different contexts — lg (32px) for primary UI and md (24px) for compact layouts."
        />
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="w-8 text-center">lg</Badge>
            <div className="flex gap-2">
              <Chip size="lg">Large</Chip>
              <Chip size="lg" variant="selected">Selected</Chip>
              <Chip size="lg" onDismiss={() => {}}>Dismiss</Chip>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="w-8 text-center">md</Badge>
            <div className="flex gap-2">
              <Chip size="md">Medium</Chip>
              <Chip size="md" variant="selected">Selected</Chip>
              <Chip size="md" onDismiss={() => {}}>Dismiss</Chip>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="Chips are composed of a pill container, a text label, and an optional close button."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex gap-3 items-center">
              <Chip>Toggle Chip</Chip>
              <Chip variant="selected">Selected</Chip>
            </div>
            <div className="flex gap-3 items-center">
              <Chip onDismiss={() => {}}>Dismissible Chip</Chip>
            </div>
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Container"
              description="Pill-shaped frame (fully rounded). White fill with neutral border in default state, dark fill in selected state."
            />
            <AnatomyItem
              number={2}
              title="Label"
              description="Text label using brand default font at semibold weight. Dark text in default, white text when selected."
            />
            <AnatomyItem
              number={3}
              title="Close Button (Dismissible only)"
              description="Circular button with X icon. Removes the chip when clicked. Only present on dismissible type."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common chip patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Content Filters</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Toggle chips as category filters on article listing pages.
                Multiple selections allowed.
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip variant="selected">All</Chip>
                <Chip>Politics</Chip>
                <Chip>Business</Chip>
                <Chip>Culture</Chip>
                <Chip>Opinion</Chip>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Applied Search Filters</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dismissible chips showing active search filters that can be
                individually removed.
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip onDismiss={() => {}}>Last 7 days</Chip>
                <Chip onDismiss={() => {}}>Car Reviews</Chip>
                <Chip onDismiss={() => {}}>Editor&apos;s Pick</Chip>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Tag Input</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dismissible chips inside an input field for tagging articles
                or content.
              </p>
              <div className="flex flex-wrap gap-2 border rounded-lg p-2">
                <Chip size="md" onDismiss={() => {}}>Design</Chip>
                <Chip size="md" onDismiss={() => {}}>UI/UX</Chip>
                <Chip size="md" onDismiss={() => {}}>Systems</Chip>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Disabled State</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chips can be disabled to prevent interaction while maintaining
                visual context.
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip disabled>Disabled</Chip>
                <Chip variant="selected" disabled>
                  Selected Disabled
                </Chip>
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
          description="Props for the Chip component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Chip />"}
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
          description="CSS custom properties consumed by the chip component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--foreground", usedBy: "Selected fill, default text", value: "oklch(0.145 0 0)" },
            { token: "--background", usedBy: "Default fill, selected text", value: "oklch(1 0 0)" },
            { token: "--border", usedBy: "Default chip border", value: "oklch(0.922 0 0)" },
            { token: "--muted", usedBy: "Hover background", value: "oklch(0.965 0 0)" },
            { token: "--ring", usedBy: "Focus ring", value: "oklch(0.708 0 0)" },
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
              Chips use foreground/background token pairs that invert between
              default and selected states. The pill shape and border adapt
              across brands via the global token system. Switch brands in the
              header to see the chip adapt.
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
