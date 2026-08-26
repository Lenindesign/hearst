/**
 * Single-brand adapters for the Hearst+ template.
 *
 * Rather than build a new layout, the single-brand experience reuses the real
 * Hearst+ `HomePageTemplate` and constrains it to one brand via its props:
 * a brand-filtered `liveFeedData` (mode "replace"), `initialBrandSlug` for
 * theme/section, and a `mastheadLogoOverride` so the masthead shows the brand
 * instead of "HEARST+". The article experience is the template's built-in
 * modal reader with infinite "up next" scroll.
 */
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { getBrandLogoSrc, getBrandLogoLabel } from "@/lib/logos";
import type { LiveFeedData } from "@/lib/live-feed-types";

/** Pilot cohort of single-brand destinations. */
export const SINGLE_BRANDS: { slug: string; name: string }[] = [
  { slug: "delish", name: "Delish" },
  { slug: "cosmopolitan", name: "Cosmopolitan" },
  { slug: "redbook", name: "Redbook" },
];

export function isSingleBrand(slug: string): boolean {
  return SINGLE_BRANDS.some((b) => b.slug === slug);
}

export function getSingleBrandName(slug: string): string | undefined {
  return SINGLE_BRANDS.find((b) => b.slug === slug)?.name;
}

/** Build a single-brand LiveFeedData from the real lifestyle feed. */
export function getSingleBrandLiveFeed(slug: string): LiveFeedData {
  const stories = lifestyleRiverStories.filter((s) => s.brandSlug === slug);
  const brandName = getSingleBrandName(slug) ?? stories[0]?.brand ?? slug;
  return {
    stories,
    sourceNotes: [
      {
        brand: brandName,
        brandSlug: slug,
        feedCount: 1,
        importedCount: stories.length,
        selectedCount: stories.length,
      },
    ],
    dataSourceCopy: `${brandName} RSS metadata (titles, links, summaries, images).`,
    fetchedAt: new Date().toISOString(),
    isFallback: false,
    productName: `${brandName} Live`,
  };
}

/** Masthead override so the template shows the brand logo, not "HEARST+". */
export function getSingleBrandMasthead(
  slug: string,
): { src: string; label: string } | null {
  const src = getBrandLogoSrc(slug);
  if (!src) return null;
  return { src, label: getBrandLogoLabel(slug) ?? slug };
}
