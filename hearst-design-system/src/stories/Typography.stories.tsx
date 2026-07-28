import React, { useEffect, useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BrandLogo } from "@/components/brand-logo";
import { BigStoryImageRight } from "@/components/fre/big-story";
import { useTheme } from "@/components/theme-provider";
import { BRAND_ARTICLES } from "./article-data";

const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
};

function normalizeFontFamily(value: string) {
  return value.replaceAll('"', "").replaceAll("'", "").trim().toLowerCase();
}

function readDeclaredFontWeights(fontFamily: string) {
  if (typeof document === "undefined") return [];

  const expectedFamily = normalizeFontFamily(fontFamily);
  const weights = new Set<number>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      if (normalizeFontFamily(rule.style.fontFamily) !== expectedFamily) continue;

      const value = rule.style.fontWeight;
      if (value === "normal") weights.add(400);
      if (value === "bold") weights.add(700);
      const numericWeight = Number.parseInt(value, 10);
      if (Number.isFinite(numericWeight)) weights.add(numericWeight);
    }
  }

  return Array.from(weights).sort((a, b) => a - b);
}

function useFontEvidence(fontFamilies: string[]) {
  const [evidence, setEvidence] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setEvidence(
        Object.fromEntries(
          fontFamilies.map((family) => [family, readDeclaredFontWeights(family)]),
        ),
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fontFamilies]);

  return evidence;
}

function StatusBadge({
  loaded,
  children,
}: {
  loaded: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2 text-xs font-semibold ${
        loaded
          ? "border-primary/30 bg-primary/10 text-foreground"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      }`}
    >
      <span
        className={`mr-2 size-2 rounded-full ${loaded ? "bg-primary" : "bg-destructive"}`}
        aria-hidden
      />
      {children}
    </span>
  );
}

function RoleCard({
  role,
  purpose,
  fontFamily,
  token,
  weights,
  sample,
}: {
  role: string;
  purpose: string;
  fontFamily: string;
  token: string;
  weights: number[];
  sample: React.ReactNode;
}) {
  const loaded =
    typeof document !== "undefined" &&
    document.fonts.check(`16px "${fontFamily}"`);

  return (
    <article className="grid gap-5 border-t border-border py-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {role}
          </p>
          <h3 className="mt-1 text-xl font-bold">{fontFamily}</h3>
        </div>
        <p className="max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
          {purpose}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge loaded={loaded}>
            {loaded ? "Font loaded" : "Fallback active"}
          </StatusBadge>
          <code className="border border-border bg-muted px-2 py-1 text-xs">{token}</code>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Declared production weights
          </p>
          <p className="mt-1 text-sm">
            {weights.length > 0
              ? weights.map((weight) => `${WEIGHT_NAMES[weight] ?? "Weight"} ${weight}`).join(", ")
              : "No matching @font-face declaration found"}
          </p>
        </div>
      </div>
      <div className="min-w-0 self-center">{sample}</div>
    </article>
  );
}

function TechnicalSpecimen({
  fontFamily,
  weights,
}: {
  fontFamily: string;
  weights: number[];
}) {
  const specimenWeights = weights.length > 0 ? weights : [400];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold">{fontFamily}</p>
        <p
          className="mt-1 break-words text-base text-muted-foreground"
          style={{ fontFamily: `"${fontFamily}", system-ui, sans-serif` }}
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%&amp;*
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specimenWeights.map((weight) => (
          <div key={weight} className="border-t border-border pt-3">
            <p
              className="text-2xl"
              style={{ fontFamily: `"${fontFamily}", system-ui, sans-serif`, fontWeight: weight }}
            >
              Aa Bb Cc
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {WEIGHT_NAMES[weight] ?? "Weight"} ({weight})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypographyShowcase() {
  const { brand } = useTheme();
  const articleData = BRAND_ARTICLES[brand.slug] ?? BRAND_ARTICLES.cosmopolitan;
  const fontFamilies = useMemo(
    () => Array.from(new Set([brand.fontDefault, brand.fontSecondary, brand.fontHeadline])),
    [brand.fontDefault, brand.fontHeadline, brand.fontSecondary],
  );
  const evidence = useFontEvidence(fontFamilies);
  const primaryWeights = evidence[brand.fontDefault] ?? [];
  const secondaryWeights = evidence[brand.fontSecondary] ?? [];
  const headlineWeights = evidence[brand.fontHeadline] ?? [];

  return (
    <main className="w-full min-w-0">
      <section className="border-b border-border bg-card px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Brand typography
          </p>
          <h1 className="mt-3 flex min-h-12 items-center sm:min-h-16">
            <BrandLogo
              slug={brand.slug}
              decorative
              className="[&_svg]:h-12 [&_svg]:w-auto [&_svg]:max-w-[240px] sm:[&_svg]:h-16 sm:[&_svg]:max-w-[360px]"
            />
            <span className="sr-only">{brand.name}</span>
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            Review the typography as readers encounter it, then use the verified
            family names, roles, and weights for design and implementation.
          </p>

          <dl className="mt-8 grid border-y border-border sm:grid-cols-3">
            {[
              ["UI and body", brand.fontDefault],
              ["Editorial accent", brand.fontSecondary],
              ["Headlines", `${brand.fontHeadline} ${brand.fontHeadlineWeight}`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-border py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
              >
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-[1120px] space-y-14 px-4 py-10 sm:px-8 sm:py-14">
        <section aria-labelledby="production-heading">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Production example
              </p>
              <h2 id="production-heading" className="mt-2 text-2xl font-bold">
                See the system in context
              </h2>
              <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
                This is the shipped editorial module using the selected brand
                theme and current production-aligned story fixture.
              </p>
            </div>
            <div className="min-w-0 border border-border bg-background p-4 sm:p-6">
              <BigStoryImageRight
                label={articleData.content.breadcrumbs.at(-1)?.label ?? "Feature"}
                headline={articleData.content.headline}
                description={articleData.content.dek ?? ""}
                author={articleData.content.author}
                date={articleData.content.publishedDate}
                image={articleData.content.heroImage}
                imagePosition="top"
                aspectRatio="3/2"
                className="cursor-default"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="roles-heading">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Role guidance
          </p>
          <h2 id="roles-heading" className="mt-2 text-2xl font-bold">
            What each family is for
          </h2>

          <div className="mt-5">
            <RoleCard
              role="UI and body"
              purpose="Default for navigation, controls, metadata, descriptions, and longer reading text. Prioritize clarity and comfortable scanning."
              fontFamily={brand.fontDefault}
              token="var(--font-brand)"
              weights={primaryWeights}
              sample={
                <div
                  className="space-y-3"
                  style={{ fontFamily: `"${brand.fontDefault}", system-ui, sans-serif` }}
                >
                  <p className="text-sm font-semibold">Latest stories</p>
                  <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
                    Editors bring you the people, ideas, and moments worth knowing today.
                  </p>
                </div>
              }
            />
            <RoleCard
              role="Editorial accent"
              purpose="Use selectively for editorial labels and brand expression. Do not use it for controls or dense interface text."
              fontFamily={brand.fontSecondary}
              token="var(--font-brand-secondary)"
              weights={secondaryWeights}
              sample={
                <p
                  className="text-2xl leading-snug"
                  style={{
                    fontFamily: `"${brand.fontSecondary}", system-ui, sans-serif`,
                    fontWeight: secondaryWeights.includes(brand.fontHeadlineWeight)
                      ? brand.fontHeadlineWeight
                      : secondaryWeights[0] ?? 400,
                  }}
                >
                  Culture, style, and conversation
                </p>
              }
            />
            <RoleCard
              role="Headlines"
              purpose={`Use for editorial headlines at the approved ${brand.fontHeadlineWeight} weight. Preserve hierarchy by keeping utility copy in the primary family.`}
              fontFamily={brand.fontHeadline}
              token="var(--font-brand-headline)"
              weights={headlineWeights}
              sample={
                <p
                  className="text-3xl leading-tight sm:text-4xl"
                  style={{
                    fontFamily: `"${brand.fontHeadline}", system-ui, sans-serif`,
                    fontWeight: brand.fontHeadlineWeight,
                  }}
                >
                  A story worth making time for
                </p>
              }
            />
          </div>
        </section>

        <section
          className="grid gap-8 border-y border-border py-8 md:grid-cols-2 md:gap-12"
          aria-labelledby="review-heading"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Stakeholder review
            </p>
            <h2 id="review-heading" className="mt-2 text-2xl font-bold">
              What to evaluate
            </h2>
          </div>
          <ul className="space-y-4 text-sm leading-relaxed">
            <li>
              <strong>Brand voice:</strong> Does the headline feel unmistakably {brand.name}?
            </li>
            <li>
              <strong>Hierarchy:</strong> Can readers distinguish editorial content from utility copy immediately?
            </li>
            <li>
              <strong>Readability:</strong> Does body copy remain comfortable at phone width and at 200% zoom?
            </li>
          </ul>
        </section>

        <details className="group border border-border bg-card">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-5">
            Technical specimen and declared weights
            <span
              className="text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            >
              ↓
            </span>
          </summary>
          <div className="space-y-8 border-t border-border px-4 py-6 sm:px-5">
            {fontFamilies.map((fontFamily) => (
              <TechnicalSpecimen
                key={fontFamily}
                fontFamily={fontFamily}
                weights={evidence[fontFamily] ?? []}
              />
            ))}
            <p className="max-w-[70ch] text-xs leading-relaxed text-muted-foreground">
              Weight evidence is read from the current Storybook CSS font-face
              declarations. Missing weights are intentionally not synthesized in this specimen.
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}

function TypeScale() {
  const sizes = [
    { name: "Display", class: "text-6xl", px: "60px" },
    { name: "H1", class: "text-5xl", px: "48px" },
    { name: "H2", class: "text-4xl", px: "36px" },
    { name: "H3", class: "text-3xl", px: "30px" },
    { name: "H4", class: "text-2xl", px: "24px" },
    { name: "H5", class: "text-xl", px: "20px" },
    { name: "H6", class: "text-lg", px: "18px" },
    { name: "Body", class: "text-base", px: "16px" },
    { name: "Small", class: "text-sm", px: "14px" },
    { name: "Caption", class: "text-xs", px: "12px" },
  ];

  return (
    <div className="w-full max-w-[720px] min-w-0 space-y-6">
      {sizes.map(({ name, class: cls, px }) => (
        <div key={name} className="flex items-baseline gap-4">
          <span className="w-20 shrink-0 text-right font-mono text-xs text-muted-foreground">
            {name}
            <br />
            {px}
          </span>
          <p className={`${cls} font-brand leading-tight`}>The quick brown fox</p>
        </div>
      ))}
    </div>
  );
}

function HeadlineVsBody() {
  const { brand } = useTheme();

  return (
    <div className="w-full max-w-[720px] min-w-0 space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Headline + Body Pairing
        </p>
        <h1
          className="text-4xl leading-tight"
          style={{
            fontFamily: `"${brand.fontHeadline}", system-ui, sans-serif`,
            fontWeight: brand.fontHeadlineWeight,
          }}
        >
          The Definitive Guide to This Season&apos;s Most Important Story
        </h1>
        <p
          className="text-lg leading-relaxed text-muted-foreground"
          style={{ fontFamily: `"${brand.fontDefault}", system-ui, sans-serif` }}
        >
          An in-depth look at the trends, people, and moments that are shaping
          our world right now. From the runway to the red carpet, we break down
          everything you need to know.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Eyebrow + Headline + Body
        </p>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{
            fontFamily: `"${brand.fontSecondary}", system-ui, sans-serif`,
            color: "var(--brand-primary)",
          }}
        >
          Featured
        </p>
        <h2
          className="text-2xl leading-tight"
          style={{
            fontFamily: `"${brand.fontHeadline}", system-ui, sans-serif`,
            fontWeight: brand.fontHeadlineWeight,
          }}
        >
          Why Everyone Is Talking About This New Trend
        </h2>
        <p
          className="text-base text-muted-foreground"
          style={{ fontFamily: `"${brand.fontDefault}", system-ui, sans-serif` }}
        >
          Our editors weigh in on the movement that&apos;s redefining the
          industry. Here&apos;s what you need to know before it goes mainstream.
        </p>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Hearst Plus/Foundation/Typography",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Stakeholder-facing typography guidance grounded in the selected brand theme, the shipped editorial component, and font weights declared by the running Storybook.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const FontFamilies: Story = {
  render: () => <TypographyShowcase />,
};

export const Scale: Story = {
  parameters: { layout: "padded" },
  render: () => <TypeScale />,
};

export const Pairing: Story = {
  name: "Headline + Body Pairing",
  parameters: { layout: "padded" },
  render: () => <HeadlineVsBody />,
};
