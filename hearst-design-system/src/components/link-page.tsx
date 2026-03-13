"use client";

import { useTheme } from "./theme-provider";
import { LinkComponent } from "@/components/ui/link";
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

const BASIC_CODE = `<LinkComponent href="/about">About Us</LinkComponent>
<LinkComponent href="https://example.com" external>Visit Site</LinkComponent>
<LinkComponent variant="neutral" underline={false}>Neutral Link</LinkComponent>`;

const API_PROPS = [
  { name: "variant", type: '"primary" | "neutral"', default: '"primary"', desc: "Color variant — brand or foreground" },
  { name: "underline", type: "boolean", default: "true", desc: "Whether text is underlined" },
  { name: "size", type: '"inherit" | "xs" | "sm" | "base" | "lg" | "xl" | "2xl"', default: '"inherit"', desc: "Text size (inherit from parent by default)" },
  { name: "external", type: "boolean", default: "false", desc: "Adds external-link icon and target=_blank" },
  { name: "href", type: "string", default: "—", desc: "Navigation URL" },
];

export function LinkPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl tracking-tight headline">Link</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Links navigate users to other pages or external resources. They come
          in primary and neutral color variants with optional underline and an
          external link icon. Inline links inherit the surrounding text size by
          default.
        </p>
      </div>

      <Separator />

      {/* Variants */}
      <section className="space-y-6">
        <SectionHeader
          title="Variants"
          description="Primary uses the brand color; neutral uses the foreground color. Both support underline and external icon."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-4 space-y-3 text-center">
              <Badge variant="secondary" className="w-full justify-center">
                Primary + Underline
              </Badge>
              <div>
                <LinkComponent href="#">Link Text</LinkComponent>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3 text-center">
              <Badge variant="secondary" className="w-full justify-center">
                Primary + No Underline
              </Badge>
              <div>
                <LinkComponent href="#" underline={false}>
                  Link Text
                </LinkComponent>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3 text-center">
              <Badge variant="secondary" className="w-full justify-center">
                Neutral + Underline
              </Badge>
              <div>
                <LinkComponent href="#" variant="neutral">
                  Link Text
                </LinkComponent>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3 text-center">
              <Badge variant="secondary" className="w-full justify-center">
                Neutral + No Underline
              </Badge>
              <div>
                <LinkComponent href="#" variant="neutral" underline={false}>
                  Link Text
                </LinkComponent>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* External Links */}
      <section className="space-y-6">
        <SectionHeader
          title="External Links"
          description="The external prop adds an arrow-square-out icon and sets target=_blank with rel=noopener noreferrer."
        />
        <div className="grid grid-cols-2 gap-6 max-w-lg">
          <Card>
            <CardContent className="pt-4 space-y-3 text-center">
              <Badge variant="secondary" className="w-full justify-center">
                Primary External
              </Badge>
              <div>
                <LinkComponent href="#" external>
                  Visit Site
                </LinkComponent>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3 text-center">
              <Badge variant="secondary" className="w-full justify-center">
                Neutral External
              </Badge>
              <div>
                <LinkComponent href="#" variant="neutral" external>
                  Visit Site
                </LinkComponent>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Inline Usage */}
      <section className="space-y-6">
        <SectionHeader
          title="Inline Usage"
          description="Links inherit the surrounding text size when used inline within paragraphs."
        />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-base leading-relaxed">
              Read our{" "}
              <LinkComponent href="#">privacy policy</LinkComponent> and{" "}
              <LinkComponent href="#">terms of service</LinkComponent> before
              creating an account. For questions, visit the{" "}
              <LinkComponent href="#" external>
                help center
              </LinkComponent>
              .
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You can also check the{" "}
              <LinkComponent href="#" variant="neutral">
                documentation
              </LinkComponent>{" "}
              for more details.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Sizes */}
      <section className="space-y-6">
        <SectionHeader
          title="Sizes"
          description="Override the inherited size with explicit size values."
        />
        <div className="space-y-4">
          {(["xs", "sm", "base", "lg", "xl", "2xl"] as const).map((s) => (
            <div key={s} className="flex items-center gap-4">
              <Badge variant="secondary" className="w-12 justify-center">
                {s}
              </Badge>
              <LinkComponent href="#" size={s} external>
                Link Text
              </LinkComponent>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The link component is a styled anchor with optional icon."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6 flex items-center justify-center">
            <LinkComponent href="#" external size="xl">
              Link Text
            </LinkComponent>
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Link Text"
              description="Semibold text in primary (brand) or neutral color. Optionally underlined."
            />
            <AnatomyItem
              number={2}
              title="External Icon (Optional)"
              description="Arrow-square-out icon indicating the link opens in a new tab or navigates externally."
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
          description="Common link patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Article Footer</p>
              <div className="space-y-1">
                <LinkComponent href="#" size="sm">
                  Read Full Article
                </LinkComponent>
                <p className="text-xs text-muted-foreground">
                  Primary link for article continuation.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Navigation</p>
              <div className="flex gap-4">
                <LinkComponent
                  href="#"
                  variant="neutral"
                  underline={false}
                  size="sm"
                >
                  Home
                </LinkComponent>
                <LinkComponent
                  href="#"
                  variant="neutral"
                  underline={false}
                  size="sm"
                >
                  About
                </LinkComponent>
                <LinkComponent
                  href="#"
                  variant="neutral"
                  underline={false}
                  size="sm"
                >
                  Contact
                </LinkComponent>
              </div>
              <p className="text-xs text-muted-foreground">
                Neutral links without underline for navigation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Source Attribution</p>
              <p className="text-sm text-muted-foreground">
                Source:{" "}
                <LinkComponent href="#" external size="sm">
                  Associated Press
                </LinkComponent>
              </p>
              <p className="text-xs text-muted-foreground">
                External link with icon for source attribution.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Breadcrumbs</p>
              <div className="flex items-center gap-2 text-sm">
                <LinkComponent
                  href="#"
                  variant="neutral"
                  underline={false}
                  size="sm"
                >
                  Home
                </LinkComponent>
                <span className="text-muted-foreground">/</span>
                <LinkComponent
                  href="#"
                  variant="neutral"
                  underline={false}
                  size="sm"
                >
                  Cars
                </LinkComponent>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm font-medium">2025 Models</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Breadcrumb navigation with neutral links.
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
          description="Props for the LinkComponent."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<LinkComponent />"}
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
          description="CSS custom properties consumed by the link component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--primary", usedBy: "Primary variant text & icon", value: "$brand-1" },
            { token: "--foreground", usedBy: "Neutral variant text & icon", value: "$content-default" },
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
              The link component uses the primary token for brand-colored links
              and the foreground token for neutral links. Both adapt
              automatically when switching brands. The external icon scales with
              the text size for consistent proportions.
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
