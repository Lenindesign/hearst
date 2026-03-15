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
    <div className="w-[720px] space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Spacing Scale</h2>
      <div className="space-y-3">
        {spaces.map(({ name, value, tw }) => (
          <div key={name} className="flex items-center gap-4">
            <span className="w-16 text-xs font-mono text-muted-foreground text-right">
              {name}
            </span>
            <div
              className="h-6 rounded bg-primary/80"
              style={{ width: value }}
            />
            <span className="text-sm">{value}</span>
            <span className="text-xs font-mono text-muted-foreground">{tw}</span>
            <span className="text-xs font-mono text-muted-foreground">
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
    <div className="w-[720px] space-y-6">
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
    <div className="w-[720px] space-y-6">
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
    { token: "brand-1", css: "--brand-primary", tw: "bg-primary", desc: "Brand accent" },
    { token: "brand-2", css: "--brand-secondary", tw: "—", desc: "Secondary brand" },
    { token: "font-primary", css: "--font-brand", tw: "font-brand", desc: "Body font" },
    { token: "font-secondary", css: "--font-brand-secondary", tw: "font-brand-secondary", desc: "Accent font" },
    { token: "font-headline", css: "--font-headline", tw: ".headline", desc: "Headline font" },
    { token: "font-headline-weight", css: "--font-headline-weight", tw: ".headline", desc: "Headline weight" },
    { token: "palette-neutral-200", css: "--palette-neutral-200", tw: "—", desc: "Light border" },
    { token: "palette-neutral-600", css: "--palette-neutral-600", tw: "—", desc: "Secondary text" },
    { token: "palette-content-default", css: "--palette-content-default", tw: "—", desc: "Body text" },
    { token: "palette-background-page", css: "--palette-background-page", tw: "—", desc: "Page bg" },
    { token: "space-md", css: "--space-md", tw: "gap-4", desc: "16px spacing" },
    { token: "border-radius-sm", css: "--border-radius-sm", tw: "rounded-xl", desc: "12px radius" },
  ];

  return (
    <div className="w-[800px] space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Token → CSS → Tailwind Map</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4 font-medium">Token (JSON)</th>
            <th className="py-2 pr-4 font-medium">CSS Variable</th>
            <th className="py-2 pr-4 font-medium">Tailwind</th>
            <th className="py-2 font-medium">Usage</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.token} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">{r.token}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                {r.css}
              </td>
              <td className="py-2 pr-4 font-mono text-xs">{r.tw}</td>
              <td className="py-2 text-muted-foreground">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const meta: Meta = {
  title: "Foundation/Tokens",
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
