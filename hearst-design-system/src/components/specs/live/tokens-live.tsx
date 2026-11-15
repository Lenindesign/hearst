"use client";

import * as React from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "@/components/ui/icons";

import { LiveBrandFrame, liveBrands } from "./live-kit";

/** Token names a component reads, resolved by the browser inside the active brand scope. */
const resolvedTokens = [
  ["--component-button-background-primary-solid-default", "Primary button fill"],
  ["--component-button-radius-default", "Button radius"],
  ["--palette-content-brand", "Brand ink"],
  ["--font-headline", "Headline face"],
  ["--font-brand", "Text face"],
] as const;

function ResolvedTokens({ brandSlug }: { brandSlug: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const style = getComputedStyle(node);
    setValues(Object.fromEntries(resolvedTokens.map(([name]) => [name, style.getPropertyValue(name).trim()])));
  }, [brandSlug]);

  return (
    <div ref={ref} className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start">
      <div className="min-w-0 space-y-6">
        <BrandLogo slug={brandSlug} className="flex h-10 w-full max-w-[240px] items-center [&_svg]:h-full [&_svg]:max-h-10 [&_svg]:w-auto [&_svg]:max-w-full" />
        <h4 className="headline text-3xl leading-tight">Same component, this brand&rsquo;s tokens.</h4>
        <div className="flex flex-wrap gap-3">
          <Button size="touch">
            Read the story
            <ChevronRight data-icon="inline-end" aria-hidden />
          </Button>
          <Button size="touch" variant="outline">Save</Button>
        </div>
      </div>
      <dl className="min-w-0 divide-y divide-border border-y border-border text-sm" aria-live="polite">
        {resolvedTokens.map(([name, label]) => (
          <div key={name} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="min-w-0">
              <code className="block truncate text-xs text-muted-foreground">{name}</code>
              <span className="mt-1 flex min-w-0 items-center gap-2 font-semibold text-foreground">
                {name.includes("background") || name.includes("content") ? (
                  <span aria-hidden className="size-4 shrink-0 rounded-[2px] border border-border" style={{ background: `var(${name})` }} />
                ) : null}
                <span className="truncate tabular-nums">{values[name] || "—"}</span>
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Tokens chapter: a Button and logo under one brand scope, with the values the browser resolved. */
export function TokensLive() {
  return (
    <LiveBrandFrame
      id="tokens"
      brands={liveBrands}
      note={<p>The production <code className="text-foreground">Button</code> and <code className="text-foreground">BrandLogo</code> inside a brand scope. The values on the right are read from the browser with <code className="text-foreground">getComputedStyle</code>, so they show what the nearest scope actually resolved.</p>}
    >
      {(slug) => <ResolvedTokens brandSlug={slug} />}
    </LiveBrandFrame>
  );
}
