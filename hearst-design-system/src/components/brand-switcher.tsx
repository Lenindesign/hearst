"use client";

import { brands } from "@/lib/brands";
import { useTheme } from "./theme-provider";

export function BrandSwitcher() {
  const { brand, setBrand } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Brand
      </label>
      <select
        value={brand.slug}
        onChange={(e) => setBrand(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {brands.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}
