"use client";

import { useTheme } from "./theme-provider";
import { FormLabel } from "@/components/ui/form-label";
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

const BASIC_CODE = `<FormLabel required helpText="We'll never share your email.">
  Email Address
</FormLabel>

<FormLabel required error="Password must be at least 8 characters.">
  Password
</FormLabel>

<FormLabel>
  Phone Number
</FormLabel>`;

const API_PROPS = [
  { name: "children", type: "ReactNode", default: "—", desc: "Label text content" },
  { name: "required", type: "boolean", default: "false", desc: "Shows orange required indicator dot" },
  { name: "helpText", type: "string", default: "—", desc: "Descriptive help text with info icon" },
  { name: "error", type: "string", default: "—", desc: "Error message with warning icon (hides help text)" },
  { name: "htmlFor", type: "string", default: "—", desc: "Associates label with an input by ID" },
];

export function FormLabelPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">Form Label</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Form labels identify input fields with a text label, optional required
          indicator, help text, and error messages. They provide context and
          validation feedback for form controls.
        </p>
      </div>

      <Separator />

      {/* States */}
      <section className="space-y-6">
        <SectionHeader
          title="States"
          description="Form labels adapt to show different combinations of required indicator, help text, and error messages."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Default with Help</p>
              <div className="border rounded-lg p-4">
                <FormLabel required helpText="We'll never share your email.">
                  Email Address
                </FormLabel>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Label with required dot and help text. The most common state
                for required fields.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">With Error</p>
              <div className="border rounded-lg p-4">
                <FormLabel
                  required
                  error="Password must be at least 8 characters."
                >
                  Password
                </FormLabel>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Label with required dot and error message. Help text is hidden
                when an error is present.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Optional</p>
              <div className="border rounded-lg p-4">
                <FormLabel>Phone Number</FormLabel>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Label only — no required dot, help text, or error. Used for
                optional fields.
              </p>
            </CardContent>
          </Card>
        </div>
        <CodeBlock>{BASIC_CODE}</CodeBlock>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The form label is composed of a label row, optional required dot, and optional message rows."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6 space-y-4">
            <FormLabel
              required
              helpText="Descriptive guidance for this field."
            >
              Field Label
            </FormLabel>
            <div className="pt-2">
              <FormLabel required error="This field has a validation error.">
                Another Field
              </FormLabel>
            </div>
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Label Text"
              description="Primary text identifying the field. Uses brand default font at semibold weight, 14px (text-sm)."
            />
            <AnatomyItem
              number={2}
              title="Required Indicator"
              description="6px orange dot next to the label. Indicates the field is mandatory. Hidden for optional fields."
            />
            <AnatomyItem
              number={3}
              title="Help Text"
              description="Optional descriptive text below the label with info icon. Uses muted foreground color, 12px. Provides guidance for the field."
            />
            <AnatomyItem
              number={4}
              title="Error Text"
              description="Validation error message with warning icon. Red color, 12px. Shown when the field has an error — replaces help text."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-6">
        <SectionHeader
          title="Usage Examples"
          description="Common form label patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Login Form</p>
              <div className="space-y-4">
                <div>
                  <FormLabel required htmlFor="email">
                    Email
                  </FormLabel>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1.5 w-full h-9 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
                <div>
                  <FormLabel
                    required
                    htmlFor="password"
                    error="Password is required."
                  >
                    Password
                  </FormLabel>
                  <input
                    id="password"
                    type="password"
                    className="mt-1.5 w-full h-9 px-3 text-sm border border-red-300 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Profile Settings</p>
              <div className="space-y-4">
                <div>
                  <FormLabel required helpText="This will be displayed publicly.">
                    Display Name
                  </FormLabel>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="mt-1.5 w-full h-9 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
                <div>
                  <FormLabel helpText="Optional. Include your city and state.">
                    Location
                  </FormLabel>
                  <input
                    type="text"
                    placeholder="e.g. New York, NY"
                    className="mt-1.5 w-full h-9 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Newsletter Signup</p>
              <div className="space-y-4">
                <div>
                  <FormLabel required>Email Address</FormLabel>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1.5 w-full h-9 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
                <div>
                  <FormLabel helpText="Choose your preferred topics.">
                    Interests
                  </FormLabel>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {["News", "Sports", "Tech", "Health"].map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-xs rounded-full border bg-background"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">All States</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Side-by-side comparison of all form label states.
              </p>
              <div className="space-y-3 border rounded-lg p-4">
                <FormLabel required helpText="With help text.">
                  Required + Help
                </FormLabel>
                <FormLabel required error="With error message.">
                  Required + Error
                </FormLabel>
                <FormLabel required>Required Only</FormLabel>
                <FormLabel helpText="Optional with guidance.">
                  Optional + Help
                </FormLabel>
                <FormLabel>Optional Only</FormLabel>
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
          description="Props for the FormLabel component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<FormLabel />"}
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
          description="CSS custom properties consumed by the form label component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--foreground", usedBy: "Label text", value: "oklch(0.145 0 0)" },
            { token: "--muted-foreground", usedBy: "Help text, info icon", value: "oklch(0.556 0 0)" },
            { token: "amber-600", usedBy: "Required indicator dot", value: "#D97706" },
            { token: "red-700", usedBy: "Error text, warning icon", value: "#B91C1C" },
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
              Form labels use the foreground token for label text and
              muted-foreground for help text, which adapt across brands. The
              required dot (amber) and error color (red) remain consistent
              across all brands for clear validation feedback. Switch brands
              in the header to see the label adapt.
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
