import type { HearstDestinationMode } from "@/lib/hearst-routes";

/**
 * Editorial awards a publication announces (APP_RULES.md › Award announcements).
 *
 * An award names one winning story that is already in the feed. While the
 * award is active, the river of each listed destination and publication page
 * opens with the award card, and the winning story's other cards carry the
 * award ribbon. Every field here comes from the publication's own story; the
 * card never adds claims the story does not make.
 */
export type StoryAward = {
  id: string;
  /** The winning story (feed story id). */
  storyId: string;
  /** Stories from the same award package, linked under the CTA. */
  relatedStoryIds: string[];
  awardingBrand: string;
  awardingBrandSlug: string;
  /** Award name as the publication writes it, without the year. */
  name: string;
  year: string;
  /** Destination rivers that open with the award card. */
  destinations: HearstDestinationMode[];
  /** Publication pages (brand slugs) that open with the award card. */
  brandSlugs: string[];
  /** The winning story's photo already shows the publication's award mark, so the card adds no seal. */
  photoCarriesMark?: boolean;
  /** ISO dates: the card shows from startsAt and is gone after endsAt. */
  startsAt: string;
  endsAt: string;
};

export const storyAwards: StoryAward[] = [
  {
    id: "motortrend-2027-suv-of-the-year",
    storyId: "motortrend-reviews-rivian-r2-2027-suv-of-the-year",
    relatedStoryIds: ["motortrend-features-2027-suvoty-suv-of-the-year-electric-suvs-lieberman"],
    awardingBrand: "MotorTrend",
    awardingBrandSlug: "motortrend",
    name: "SUV of the Year",
    year: "2027",
    destinations: ["autos"],
    brandSlugs: ["motortrend"],
    photoCarriesMark: true,
    startsAt: "2026-11-11",
    endsAt: "2027-01-31",
  },
];

const isActive = (award: StoryAward, now: number) =>
  now >= Date.parse(`${award.startsAt}T00:00:00Z`) && now <= Date.parse(`${award.endsAt}T23:59:59Z`);

/** The award a story won, if it is active. Drives the ribbon on that story's cards. */
export function getStoryAward(storyId: string, now = Date.now()) {
  return storyAwards.find((award) => award.storyId === storyId && isActive(award, now)) ?? null;
}

/**
 * The award card for a river, if any. A publication page shows its own awards;
 * a destination shows awards listed for it. One award card per page: the first
 * active match wins.
 */
export function getRiverStoryAward(
  { destination, brandSlug }: { destination: HearstDestinationMode; brandSlug?: string | null },
  now = Date.now(),
) {
  return storyAwards.find((award) => {
    if (!isActive(award, now)) return false;
    return brandSlug ? award.brandSlugs.includes(brandSlug) : award.destinations.includes(destination);
  }) ?? null;
}
