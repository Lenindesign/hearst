import type { BrandTheme } from "@/lib/brands";
import { supplementalBrandProfiles, themeOptions } from "@/lib/theme-options";

const selectedBrandThemeAliases: Record<string, string> = {
  "pioneer-woman": "the-pioneer-woman",
};

export function getSelectedBrandTheme(
  selectedBrand: { name: string; slug: string } | null,
  baseTheme: BrandTheme,
) {
  if (!selectedBrand) return null;

  const normalizedSlug = selectedBrandThemeAliases[selectedBrand.slug] ?? selectedBrand.slug;
  const existingTheme = themeOptions.find((option) => option.slug === normalizedSlug);
  if (existingTheme) return existingTheme;

  const supplemental = supplementalBrandProfiles[selectedBrand.slug];
  if (!supplemental) return null;

  return {
    ...baseTheme,
    name: selectedBrand.name,
    slug: selectedBrand.slug,
    colors: {
      ...baseTheme.colors,
      "1": supplemental.primary,
      "2": supplemental.secondary,
      "3": supplemental.secondary,
    },
    fontDefault: supplemental.fontDefault,
    fontSecondary: supplemental.fontDefault,
    fontHeadline: supplemental.fontHeadline,
    fontHeadlineWeight: supplemental.fontHeadlineWeight,
    semanticColors: {
      ...baseTheme.semanticColors,
      "palette-background-brand": supplemental.primary,
      "palette-background-default-link": supplemental.primary,
      "palette-background-utility": supplemental.primary,
      "palette-content-brand": supplemental.primary,
    },
    componentTokens: {
      ...baseTheme.componentTokens,
      "component-button-background-primary-solid-default": supplemental.primary,
      "component-chip-border-neutral-selected": supplemental.primary,
      "component-chip-content-neutral-selected": supplemental.primary,
      "component-badge-background-primary": supplemental.primary,
    },
  } satisfies BrandTheme;
}
