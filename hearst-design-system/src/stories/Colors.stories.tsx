import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { brands } from "@/lib/brands";

function useBrand() {
  const el = document.querySelector("[data-brand]");
  const slug = el?.getAttribute("data-brand") || "cosmopolitan";
  return brands.find((b) => b.slug === slug) || brands[0];
}

function Swatch({
  hex,
  label,
  sublabel,
}: {
  hex: string;
  label: string;
  sublabel?: string;
}) {
  const isLight =
    hex.toLowerCase() === "#ffffff" ||
    hex.toLowerCase() === "#fff" ||
    hex.toLowerCase().startsWith("#f");
  return (
    <div className="space-y-1.5">
      <div
        className="w-20 h-20 rounded-lg shadow-sm"
        style={{
          backgroundColor: hex,
          border: isLight ? "1px solid #e5e5e5" : "none",
        }}
      />
      <p className="text-xs font-mono">{hex}</p>
      <p className="text-xs font-medium">{label}</p>
      {sublabel && (
        <p className="text-[10px] text-muted-foreground font-mono">{sublabel}</p>
      )}
    </div>
  );
}

function CssVarSwatch({
  varName,
  label,
  fallback,
}: {
  varName: string;
  label: string;
  fallback?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className="w-20 h-20 rounded-lg shadow-sm border border-border/30"
        style={{ backgroundColor: `var(${varName}, ${fallback || "#ccc"})` }}
      />
      <p className="text-xs font-medium">{label}</p>
      <p className="text-[10px] text-muted-foreground font-mono">{varName}</p>
    </div>
  );
}

function BrandPalette() {
  const brand = useBrand();
  const sorted = Object.entries(brand.colors)
    .sort((a, b) => {
      const an = parseInt(a[0]),
        bn = parseInt(b[0]);
      if (!isNaN(an) && !isNaN(bn)) return an - bn;
      return a[0].localeCompare(b[0]);
    })
    .filter(([, hex]) => hex.toLowerCase() !== "#ffffff");

  return (
    <div className="w-[720px] space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">
          {brand.name} — Brand Palette
        </h2>
        <p className="text-sm text-muted-foreground">
          {sorted.length} active brand colors (white values hidden)
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {sorted.map(([key, hex]) => (
          <Swatch
            key={key}
            hex={hex}
            label={`brand-${key}`}
            sublabel={`--palette-brand-${key}`}
          />
        ))}
      </div>
    </div>
  );
}

function SemanticColors() {
  const semantics = [
    { var: "--palette-content-default", label: "Content Default", fb: "#121212" },
    { var: "--palette-content-brand", label: "Content Brand", fb: "#000" },
    { var: "--palette-content-default-link", label: "Link", fb: "#000" },
    { var: "--palette-content-default-link-hover", label: "Link Hover", fb: "#333" },
    { var: "--palette-content-brand-hover", label: "Brand Hover", fb: "#333" },
    { var: "--palette-content-knockout-hover", label: "Knockout Hover", fb: "#fff" },
  ];

  const backgrounds = [
    { var: "--palette-background-page", label: "Page", fb: "#fff" },
    { var: "--palette-background-default", label: "Default", fb: "#fff" },
    { var: "--palette-background-subtle", label: "Subtle", fb: "#f5f5f5" },
    { var: "--palette-background-brand", label: "Brand", fb: "#000" },
    { var: "--palette-background-brand-hover", label: "Brand Hover", fb: "#333" },
    { var: "--palette-background-knockout", label: "Knockout", fb: "#000" },
    { var: "--palette-background-utility", label: "Utility", fb: "#f0f0f0" },
    { var: "--palette-background-subtle-brand", label: "Subtle Brand", fb: "#f5f0e8" },
  ];

  return (
    <div className="w-[720px] space-y-10">
      <div>
        <h3 className="text-lg font-semibold mb-4">Content Colors</h3>
        <div className="flex flex-wrap gap-4">
          {semantics.map((s) => (
            <CssVarSwatch key={s.var} varName={s.var} label={s.label} fallback={s.fb} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Background Colors</h3>
        <div className="flex flex-wrap gap-4">
          {backgrounds.map((s) => (
            <CssVarSwatch key={s.var} varName={s.var} label={s.label} fallback={s.fb} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NeutralScale() {
  const neutrals = [
    { shade: "lightest", fb: "#ffffff" },
    { shade: "100", fb: "#f5f5f5" },
    { shade: "200", fb: "#ededed" },
    { shade: "300", fb: "#d6d6d6" },
    { shade: "400", fb: "#b8b8b8" },
    { shade: "500", fb: "#949494" },
    { shade: "600", fb: "#757575" },
    { shade: "700", fb: "#575757" },
    { shade: "800", fb: "#3b3b3b" },
    { shade: "900", fb: "#282828" },
    { shade: "1000", fb: "#1c1c1c" },
  ];

  return (
    <div className="w-[720px] space-y-6">
      <h3 className="text-lg font-semibold">Neutral Scale</h3>
      <div className="flex gap-1">
        {neutrals.map(({ shade, fb }) => (
          <div key={shade} className="flex-1 space-y-1.5">
            <div
              className="h-16 rounded"
              style={{
                backgroundColor: `var(--palette-neutral-${shade}, ${fb})`,
                border: shade === "lightest" ? "1px solid #e5e5e5" : "none",
              }}
            />
            <p className="text-[10px] font-mono text-center text-muted-foreground">
              {shade}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllBrandsOverview() {
  return (
    <div className="w-[720px] space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">All 29 Brands</h2>
      <div className="space-y-2">
        {brands.map((brand) => {
          const meaningful = Object.entries(brand.colors).filter(
            ([, hex]) => hex.toLowerCase() !== "#ffffff"
          );
          return (
            <div key={brand.slug} className="flex items-center gap-3">
              <span className="w-40 text-sm font-medium truncate">
                {brand.name}
              </span>
              <div className="flex gap-1">
                {meaningful.slice(0, 8).map(([key, hex]) => (
                  <div
                    key={key}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: hex }}
                    title={`brand-${key}: ${hex}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Foundation/Colors",
};

export default meta;
type Story = StoryObj;

export const BrandColors: Story = {
  render: () => <BrandPalette />,
};

export const Semantic: Story = {
  render: () => <SemanticColors />,
};

export const Neutrals: Story = {
  render: () => <NeutralScale />,
};

export const AllBrands: Story = {
  name: "All 29 Brands",
  render: () => <AllBrandsOverview />,
};
