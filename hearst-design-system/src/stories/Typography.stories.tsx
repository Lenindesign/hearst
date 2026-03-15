import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useContext } from "react";
import { brands } from "@/lib/brands";

function useBrand() {
  const el = document.querySelector("[data-brand]");
  const slug = el?.getAttribute("data-brand") || "cosmopolitan";
  return brands.find((b) => b.slug === slug) || brands[0];
}

function FontSpecimen({
  label,
  fontFamily,
  weights,
}: {
  label: string;
  fontFamily: string;
  weights: { weight: number; name: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <span className="text-sm text-muted-foreground">{fontFamily}</span>
      </div>
      <p
        className="text-4xl leading-tight"
        style={{ fontFamily: `"${fontFamily}", system-ui, sans-serif`, fontWeight: 400 }}
      >
        The quick brown fox jumps over the lazy dog
      </p>
      <p
        className="text-lg text-muted-foreground"
        style={{ fontFamily: `"${fontFamily}", system-ui, sans-serif` }}
      >
        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%&amp;*
      </p>
      <div className="flex flex-wrap gap-6">
        {weights.map(({ weight, name }) => (
          <div key={weight} className="space-y-1">
            <p
              className="text-xl"
              style={{ fontFamily: `"${fontFamily}", system-ui, sans-serif`, fontWeight: weight }}
            >
              Aa Bb Cc
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {name} ({weight})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypographyShowcase() {
  const brand = useBrand();

  const sansWeights = [
    { weight: 400, name: "Regular" },
    { weight: 500, name: "Medium" },
    { weight: 600, name: "Semibold" },
    { weight: 700, name: "Bold" },
    { weight: 800, name: "Extra Bold" },
  ];

  return (
    <div className="w-[720px] space-y-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">{brand.name}</h2>
        <p className="text-sm text-muted-foreground">
          Primary: <strong>{brand.fontDefault}</strong> · Secondary:{" "}
          <strong>{brand.fontSecondary}</strong> · Headline:{" "}
          <strong>{brand.fontHeadline}</strong> ({brand.fontHeadlineWeight})
        </p>
      </div>

      <FontSpecimen
        label="Primary Font"
        fontFamily={brand.fontDefault}
        weights={sansWeights}
      />

      <hr className="border-border" />

      <FontSpecimen
        label="Secondary Font"
        fontFamily={brand.fontSecondary}
        weights={sansWeights}
      />

      <hr className="border-border" />

      <FontSpecimen
        label="Headline Font"
        fontFamily={brand.fontHeadline}
        weights={[
          { weight: brand.fontHeadlineWeight, name: "Headline Weight" },
          { weight: 400, name: "Regular" },
          { weight: 700, name: "Bold" },
        ]}
      />
    </div>
  );
}

function TypeScale() {
  const brand = useBrand();
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
    <div className="w-[720px] space-y-6">
      {sizes.map(({ name, class: cls, px }) => (
        <div key={name} className="flex items-baseline gap-4">
          <span className="w-20 shrink-0 text-xs font-mono text-muted-foreground text-right">
            {name}
            <br />
            {px}
          </span>
          <p className={`${cls} font-brand leading-tight`}>
            The quick brown fox
          </p>
        </div>
      ))}
    </div>
  );
}

function HeadlineVsBody() {
  const brand = useBrand();

  return (
    <div className="w-[720px] space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
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
          className="text-lg text-muted-foreground leading-relaxed"
          style={{ fontFamily: `"${brand.fontDefault}", system-ui, sans-serif` }}
        >
          An in-depth look at the trends, people, and moments that are shaping
          our world right now. From the runway to the red carpet, we break down
          everything you need to know.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
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
  title: "Foundation/Typography",
};

export default meta;
type Story = StoryObj;

export const FontFamilies: Story = {
  render: () => <TypographyShowcase />,
};

export const Scale: Story = {
  render: () => <TypeScale />,
};

export const Pairing: Story = {
  name: "Headline + Body Pairing",
  render: () => <HeadlineVsBody />,
};
