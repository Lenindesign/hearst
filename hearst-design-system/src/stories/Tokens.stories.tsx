import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

function SpacingScale() {
  const spaces = [
    { name: "3xs", value: "2px", tw: "gap-0.5" },
    { name: "2xs", value: "4px", tw: "gap-1" },
    { name: "xs", value: "8px", tw: "gap-2" },
    { name: "sm", value: "12px", tw: "gap-3" },
    { name: "md", value: "16px", tw: "gap-4" },
    { name: "lg", value: "20px", tw: "gap-5" },
    { name: "xl", value: "24px", tw: "gap-6" },
    { name: "2xl", value: "32px", tw: "gap-8" },
    { name: "3xl", value: "48px", tw: "gap-12" },
    { name: "4xl", value: "64px", tw: "gap-16" },
    { name: "6xl", value: "80px", tw: "gap-20" },
  ];

  return (
    <div className="w-full max-w-[720px] min-w-0 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Spacing Scale</h2>
      <div className="space-y-3">
        {spaces.map(({ name, value, tw }) => (
          <div
            key={name}
            className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[4rem_auto_auto_1fr_1fr]"
          >
            <span className="text-right font-mono text-xs text-muted-foreground">
              {name}
            </span>
            <div
              className="h-6 rounded bg-primary/80"
              style={{ width: value }}
            />
            <span className="text-sm">{value}</span>
            <span className="col-start-2 font-mono text-xs text-muted-foreground sm:col-start-auto">{tw}</span>
            <span className="col-span-2 col-start-2 font-mono text-xs text-muted-foreground sm:col-span-1 sm:col-start-auto">
              --space-{name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BorderRadius() {
  const radii = [
    { name: "2xs", value: "4px" },
    { name: "xs", value: "8px" },
    { name: "sm", value: "12px" },
    { name: "md", value: "16px" },
    { name: "lg", value: "20px" },
    { name: "xl", value: "24px" },
    { name: "full", value: "9999px" },
  ];

  return (
    <div className="w-full max-w-[720px] min-w-0 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Border Radius</h2>
      <div className="flex flex-wrap gap-6">
        {radii.map(({ name, value }) => (
          <div key={name} className="space-y-2 text-center">
            <div
              className="w-20 h-20 bg-primary/20 border-2 border-primary/40"
              style={{ borderRadius: value }}
            />
            <p className="text-xs font-mono">{name}</p>
            <p className="text-[10px] text-muted-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Elevation() {
  const levels = [
    { name: "None", class: "shadow-none" },
    { name: "Base", class: "shadow-sm" },
    { name: "Raised", class: "shadow" },
    { name: "Floating", class: "shadow-md" },
    { name: "Overlay", class: "shadow-lg" },
    { name: "Modal", class: "shadow-xl" },
  ];

  return (
    <div className="w-full max-w-[720px] min-w-0 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Elevation</h2>
      <div className="flex flex-wrap gap-6">
        {levels.map(({ name, class: cls }) => (
          <div key={name} className="space-y-2 text-center">
            <div
              className={`w-24 h-24 rounded-lg bg-background border border-border/30 ${cls}`}
            />
            <p className="text-xs font-medium">{name}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{cls}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenMap() {
  const rows = [
    { token: "brand-1", css: "--brand-1", tailwind: "bg-[var(--brand-1)]", figma: "brand-1", desc: "Brand accent" },
    { token: "brand-2", css: "--brand-2", tailwind: "bg-[var(--brand-2)]", figma: "brand-2", desc: "Secondary brand" },
    { token: "font-primary", css: "--font-primary", tailwind: "[font-family:var(--font-primary)]", figma: "font-primary", desc: "Body font" },
    { token: "font-secondary", css: "--font-secondary", tailwind: "[font-family:var(--font-secondary)]", figma: "font-secondary", desc: "Accent font" },
    { token: "font-headline", css: "--font-headline", tailwind: "font-headline", figma: "font-headline", desc: "Headline font" },
    { token: "palette-neutral-200", css: "--palette-neutral-200", tailwind: "border-[var(--palette-neutral-200)]", figma: "palette-neutral-200", desc: "Light border" },
    { token: "palette-neutral-600", css: "--palette-neutral-600", tailwind: "text-[var(--palette-neutral-600)]", figma: "palette-neutral-600", desc: "Secondary text" },
    { token: "palette-content-default", css: "--palette-content-default", tailwind: "text-[var(--palette-content-default)]", figma: "palette-content-default", desc: "Body text" },
    { token: "palette-background-page", css: "--palette-background-page", tailwind: "bg-[var(--palette-background-page)]", figma: "palette-background-page", desc: "Page bg" },
    { token: "space-md", css: "--space-md", tailwind: "gap-[var(--space-md)]", figma: "space-md", desc: "16px spacing" },
    { token: "border-radius-sm", css: "--border-radius-sm", tailwind: "rounded-[var(--border-radius-sm)]", figma: "border-radius-sm", desc: "12px radius" },
  ];

  return (
    <div className="w-full max-w-[960px] space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Canonical Name Across Tools
      </h2>
      <p className="text-sm text-muted-foreground">
        Each token has one canonical JSON name. CSS variables preserve that
        name, Figma mirrors it, and Tailwind consumes the generated variable
        through token-backed utilities.
      </p>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article
            key={row.token}
            className="rounded-lg border border-border bg-background p-4"
          >
            <p className="font-mono text-sm font-semibold">{row.token}</p>
            <p className="mt-1 text-sm text-muted-foreground">{row.desc}</p>
            <dl className="mt-4 grid gap-3 text-xs">
              <div>
                <dt className="font-semibold text-foreground">CSS</dt>
                <dd className="mt-1 break-all font-mono text-muted-foreground">
                  {row.css}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Tailwind</dt>
                <dd className="mt-1 break-all font-mono text-violet-700">
                  {row.tailwind}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Figma</dt>
                <dd className="mt-1 break-all font-mono text-blue-600">
                  {row.figma}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">
                Canonical Name
                <span className="block text-[10px] font-normal text-muted-foreground">
                  Git JSON key
                </span>
              </th>
              <th className="py-2 pr-4 font-medium">
                CSS
                <span className="block text-[10px] font-normal text-muted-foreground">
                  -- prefix
                </span>
              </th>
              <th className="py-2 pr-4 font-medium">
                Tailwind
                <span className="block text-[10px] font-normal text-muted-foreground">
                  token-backed utility
                </span>
              </th>
              <th className="py-2 pr-4 font-medium">
                Figma
                <span className="block text-[10px] font-normal text-muted-foreground">
                  no prefix
                </span>
              </th>
              <th className="py-2 font-medium">Usage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.token} className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-xs font-semibold">
                  {r.token}
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                  {r.css}
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-violet-700">
                  {r.tailwind}
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-blue-600">
                  {r.figma}
                </td>
                <td className="py-2 text-muted-foreground">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Hearst Plus/Foundation/Tokens",
  decorators: [
    (Story) => (
      <div className="box-border w-full p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Spacing: Story = {
  render: () => <SpacingScale />,
};

export const Radius: Story = {
  name: "Border Radius",
  render: () => <BorderRadius />,
};

export const Shadows: Story = {
  name: "Elevation",
  render: () => <Elevation />,
};

export const Map: Story = {
  name: "Token Map",
  render: () => <TokenMap />,
};
