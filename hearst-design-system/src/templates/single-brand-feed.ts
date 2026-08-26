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
import { getBrandLogoSrc, getBrandLogoLabel } from "@/lib/logos";
import { getPersonalizeLiveFeed } from "@/lib/personalize-live-feed";
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

/**
 * Fetch a single-brand LiveFeedData from the Personalize live feed, scoped to
 * one brand. `getPersonalizeLiveFeed` handles the network call and, if the
 * Personalize API is unavailable, falls back to the local static snapshot
 * filtered to the same brand — so this always resolves to brand-scoped stories.
 */
export async function getSingleBrandLiveFeed(slug: string): Promise<LiveFeedData> {
  const brandName = getSingleBrandName(slug) ?? slug;
  const feed = await getPersonalizeLiveFeed({
    destination: "lifestyle",
    brandSlug: slug,
    sizePerBrand: 24,
  });
  return { ...feed, productName: `${brandName} Live` };
}

/** Masthead override so the template shows the brand logo, not "HEARST+". */
export function getSingleBrandMasthead(
  slug: string,
): { src: string; label: string } | null {
  const src = getBrandLogoSrc(slug);
  if (!src) return null;
  return { src, label: getBrandLogoLabel(slug) ?? slug };
}
