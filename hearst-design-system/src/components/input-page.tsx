"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Search, Lock, User } from "lucide-react";

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

const BASIC_CODE = `<Input label="Email" placeholder="you@example.com" leadingIcon={Mail} required />
<Input label="Search" placeholder="Search..." leadingIcon={Search} size="lg" />
<Input label="Password" error="Password is required" leadingIcon={Lock} />`;

function InteractiveDemo() {
  const [val, setVal] = React.useState("");

  return (
    <Input
      label="Email Address"
      placeholder="you@example.com"
      leadingIcon={Mail}
      required
      helpText="We'll never share your email."
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onClear={() => setVal("")}
    />
  );
}

function ErrorDemo() {
  const [val, setVal] = React.useState("bad-email");

  return (
    <Input
      label="Email Address"
      placeholder="you@example.com"
      leadingIcon={Mail}
      required
      error="Please enter a valid email address."
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onClear={() => setVal("")}
    />
  );
}

const API_PROPS = [
  { name: "size", type: '"xl" | "lg" | "md"', default: '"xl"', desc: "Field height: 48px, 32px, or 24px" },
  { name: "label", type: "string", default: "—", desc: "Text label above the field" },
  { name: "required", type: "boolean", default: "false", desc: "Shows required indicator dot" },
  { name: "helpText", type: "string", default: "—", desc: "Help message below the field" },
  { name: "error", type: "string", default: "—", desc: "Error message (replaces helpText)" },
  { name: "leadingIcon", type: "LucideIcon", default: "—", desc: "Icon before the input text" },
  { name: "onClear", type: "() => void", default: "—", desc: "Clear button handler (shows X when value present)" },
  { name: "disabled", type: "boolean", default: "false", desc: "Disables the input" },
  { name: "placeholder", type: "string", default: "—", desc: "Placeholder text" },
  { name: "value", type: "string", default: "—", desc: "Controlled input value" },
];

export function InputPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl tracking-tight headline">Input</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Input fields allow users to enter text data. They support a label,
          leading icon, placeholder, clear button, help text, and error state.
          Available in three sizes (xl, lg, md) with default and disabled
          variants.
        </p>
      </div>

      <Separator />

      {/* Interactive Demo */}
      <section className="space-y-6">
        <SectionHeader
          title="Interactive Demo"
          description="Type in the field to see the clear button appear. The help text shows below the field."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InteractiveDemo />
          <ErrorDemo />
          <Input
            label="Username"
            placeholder="Enter username"
            leadingIcon={User}
            helpText="Choose a unique username."
            disabled
          />
        </div>
      </section>

      <Separator />

      {/* Sizes */}
      <section className="space-y-6">
        <SectionHeader
          title="Sizes"
          description="Three field heights to fit different layout densities."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                xl — 48px
              </Badge>
              <Input
                size="xl"
                label="Email"
                placeholder="you@example.com"
                leadingIcon={Mail}
                helpText="Extra-large size for prominent forms."
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                lg — 32px
              </Badge>
              <Input
                size="lg"
                label="Search"
                placeholder="Search articles..."
                leadingIcon={Search}
                helpText="Large size for standard forms."
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                md — 24px
              </Badge>
              <Input
                size="md"
                label="Filter"
                placeholder="Filter..."
                leadingIcon={Search}
                helpText="Medium size for compact layouts."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* States */}
      <section className="space-y-6">
        <SectionHeader
          title="States"
          description="Input fields support default, focus, error, and disabled states."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Default with Help</p>
              <Input
                label="Full Name"
                placeholder="John Doe"
                leadingIcon={User}
                required
                helpText="Enter your legal name."
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Error</p>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leadingIcon={Lock}
                required
                error="Password must be at least 8 characters."
                value="abc"
                readOnly
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Disabled</p>
              <Input
                label="Email"
                placeholder="you@example.com"
                leadingIcon={Mail}
                helpText="This field is disabled."
                disabled
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">No Icon</p>
              <Input
                label="Notes"
                placeholder="Add a note..."
                helpText="Optional leading icon."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The input component is a composite of label, field, and message layers."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6">
            <Input
              label="Email Address"
              placeholder="you@example.com"
              leadingIcon={Mail}
              required
              helpText="We'll never share your email."
            />
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Label"
              description="Text label above the field with an optional required indicator dot."
            />
            <AnatomyItem
              number={2}
              title="Leading Icon"
              description="Optional icon before the input text. Provides visual context (e.g. mail, search)."
            />
            <AnatomyItem
              number={3}
              title="Input Field"
              description="The text input area with placeholder and value states. Bordered container with padding."
            />
            <AnatomyItem
              number={4}
              title="Help / Error Text"
              description="Contextual message below the field. Switches between help text (info icon) and error text (warning icon)."
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
          description="Common input patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Login Form</p>
              <div className="space-y-3">
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  leadingIcon={Mail}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  leadingIcon={Lock}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Standard login form with email and password fields.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Search Bar</p>
              <Input
                size="lg"
                placeholder="Search articles, topics, authors..."
                leadingIcon={Search}
              />
              <p className="text-xs text-muted-foreground">
                Compact search input without a label.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Newsletter Signup</p>
              <Input
                label="Email"
                placeholder="Enter your email"
                leadingIcon={Mail}
                required
                helpText="Get the latest stories delivered to your inbox."
              />
              <p className="text-xs text-muted-foreground">
                Email input with contextual help text.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Size Comparison</p>
              <div className="space-y-3">
                <Input size="xl" placeholder="XL — 48px" leadingIcon={Mail} />
                <Input size="lg" placeholder="LG — 32px" leadingIcon={Mail} />
                <Input size="md" placeholder="MD — 24px" leadingIcon={Mail} />
              </div>
              <p className="text-xs text-muted-foreground">
                All three sizes side by side.
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
          description="Props for the Input component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Input />"}
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
              <code className="font-mono text-primary text-[10px]">
                {prop.type}
              </code>
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
          description="CSS custom properties consumed by the input component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--border", usedBy: "Field border (default)", value: "$palette-neutral-300" },
            { token: "--foreground", usedBy: "Field border (focus)", value: "$content-default" },
            { token: "--background", usedBy: "Field background", value: "#ffffff" },
            { token: "--muted-foreground", usedBy: "Placeholder, icons, help text", value: "$content-subtle" },
            { token: "--radius-sm", usedBy: "Field border radius", value: "Derived from --radius" },
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-2.5 text-xs border-t"
            >
              <code className="font-mono font-medium">{row.token}</code>
              <span className="text-muted-foreground">{row.usedBy}</span>
              <span className="font-mono text-muted-foreground">
                {row.value}
              </span>
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
              The input component uses border, background, and foreground tokens
              that adapt to each brand theme. The focus ring color matches the
              foreground token, and error states use a consistent red palette
              across all brands. Switch brands in the header to see the input
              adapt.
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
