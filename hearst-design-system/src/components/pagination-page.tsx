"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { Pagination } from "@/components/ui/pagination";
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

const BASIC_CODE = `const [page, setPage] = React.useState(1);

<Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
<Pagination currentPage={page} totalPages={10} onPageChange={setPage} size="sm" />`;

function InteractiveDemo() {
  const [page, setPage] = React.useState(1);

  return (
    <div className="space-y-4">
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
      <p className="text-xs text-muted-foreground">
        Current page: <span className="font-semibold">{page}</span> of 10
      </p>
    </div>
  );
}

const API_PROPS = [
  { name: "currentPage", type: "number", default: "—", desc: "Currently active page (1-indexed)" },
  { name: "totalPages", type: "number", default: "—", desc: "Total number of pages" },
  { name: "onPageChange", type: "(page: number) => void", default: "—", desc: "Callback when page changes" },
  { name: "size", type: '"md" | "sm"', default: '"md"', desc: "Page button size: 32px or 24px" },
];

export function PaginationPage() {
  const { brand } = useTheme();
  const [demoPage, setDemoPage] = React.useState(5);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl font-semibold tracking-tight font-headline">Pagination</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Pagination allows users to navigate through multi-page content. It
          supports truncation with ellipsis for large page counts, two sizes
          (md, sm), and previous/next navigation arrows.
        </p>
      </div>

      <Separator />

      {/* Interactive Demo */}
      <section className="space-y-6">
        <SectionHeader
          title="Interactive Demo"
          description="Click page numbers or arrows to navigate. Ellipsis appears automatically for large page counts."
        />
        <InteractiveDemo />
      </section>

      <Separator />

      {/* Sizes */}
      <section className="space-y-6">
        <SectionHeader
          title="Sizes"
          description="Two sizes to fit different layout densities."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                md — 32px
              </Badge>
              <Pagination
                currentPage={3}
                totalPages={10}
                onPageChange={() => {}}
                size="md"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                sm — 24px
              </Badge>
              <Pagination
                currentPage={3}
                totalPages={10}
                onPageChange={() => {}}
                size="sm"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Truncation Patterns */}
      <section className="space-y-6">
        <SectionHeader
          title="Truncation Patterns"
          description="Ellipsis appears when there are more than 7 pages. The pattern adapts based on the current position."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Few Pages (no truncation)</p>
              <Pagination
                currentPage={2}
                totalPages={5}
                onPageChange={() => {}}
              />
              <p className="text-xs text-muted-foreground">
                All pages visible when total is 7 or fewer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Start (right ellipsis)</p>
              <Pagination
                currentPage={1}
                totalPages={20}
                onPageChange={() => {}}
              />
              <p className="text-xs text-muted-foreground">
                Ellipsis before the last page when near the start.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Middle (two ellipses)</p>
              <Pagination
                currentPage={demoPage}
                totalPages={20}
                onPageChange={setDemoPage}
              />
              <p className="text-xs text-muted-foreground">
                Ellipsis on both sides when in the middle. Try clicking!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">End (left ellipsis)</p>
              <Pagination
                currentPage={20}
                totalPages={20}
                onPageChange={() => {}}
              />
              <p className="text-xs text-muted-foreground">
                Ellipsis after the first page when near the end.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The pagination component is composed of navigation arrows, page buttons, and ellipsis indicators."
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="border rounded-lg p-6 flex items-center justify-center">
            <Pagination
              currentPage={3}
              totalPages={10}
              onPageChange={() => {}}
            />
          </div>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="Navigation Arrows"
              description="Previous and next chevron buttons. Circular with neutral border. Disabled at first/last page."
            />
            <AnatomyItem
              number={2}
              title="Page Numbers"
              description="Circular buttons showing page numbers. Active page has dark fill with white text."
            />
            <AnatomyItem
              number={3}
              title="Ellipsis"
              description="Truncation indicator for large page counts. Shows when pages are omitted between visible numbers."
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
          description="Common pagination patterns used across Hearst brand interfaces."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Article List</p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-muted rounded-md flex items-center px-3 text-xs text-muted-foreground"
                  >
                    Article {i}
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={1}
                totalPages={12}
                onPageChange={() => {}}
                size="sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Search Results</p>
              <p className="text-xs text-muted-foreground">
                Showing 1–10 of 200 results
              </p>
              <Pagination
                currentPage={1}
                totalPages={20}
                onPageChange={() => {}}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <SectionHeader
          title="API Reference"
          description="Props for the Pagination component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <code className="text-sm font-semibold font-mono">
              {"<Pagination />"}
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
          description="CSS custom properties consumed by the pagination component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            { token: "--foreground", usedBy: "Active page background", value: "$content-default" },
            { token: "--background", usedBy: "Active page text", value: "$content-on-brand" },
            { token: "--border", usedBy: "Arrow button border", value: "$palette-neutral-300" },
            { token: "--muted", usedBy: "Hover background", value: "oklch(0.965 0 0)" },
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
              The pagination component uses foreground/background tokens for the
              active page indicator and border tokens for navigation arrows.
              These adapt automatically when switching brands. The ellipsis
              truncation algorithm ensures a consistent, accessible experience
              regardless of total page count.
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
