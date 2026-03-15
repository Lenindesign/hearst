"use client";

import { brands } from "@/lib/brands";
import { useTheme } from "./theme-provider";

export function BrandSwitcher() {
  const { brand, setBrand } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <select
        value={brand.slug}
        onChange={(e) => setBrand(e.target.value)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring max-w-[140px]"
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
