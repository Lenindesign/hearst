import Link from "next/link";

import { HomePageTemplate } from "@/components/home-page";
import type { HearstDestinationSection, UtilityBrandMenuGroup, UtilityBrandMenuGroups, UtilityMenuLink } from "@/components/hearst-plus/utility-bar";
import { taxonomyStories } from "@/components/specs/chapters/taxonomy-data";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllBrands } from "@/lib/hearst-routes";
import { getLocalStoryFeed } from "@/lib/hearst-local-feed";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getPersonalizeVideoFeed } from "@/lib/hearst-video-feed";
import {
  brandFamilies,
  getProposedInterest,
  getReaderInterestFilterKey,
  getReaderSubtopicFilterKey,
  getReaderTaxonomyPreviewRoute,
  readerInterestSubtopics,
  readerInterests,
  storyMatchesReaderInterestFilter,
  type ReaderInterest,
} from "@/lib/reader-taxonomy";

/**
 * Taxonomy preview (HP-TAX-001, option C): the production Hearst+ feed with the
 * proposed reader taxonomy in its navigation. Interests lead the utility bar and
 * the section row; the five brand families group the brand menus. Ads, analytics
 * and story scope still use the sales cohorts, exactly as in production.
 */
const brandNames = new Map(getHearstAllBrands().map((brand) => [brand.brandSlug, brand.brand]));

/** A brand appears under an interest when at least this many of today's stories map to it. */
const MIN_INTEREST_STORIES = 3;

function getInterestBrands(interest: ReaderInterest) {
  const counts = new Map<string, number>();
  for (const story of taxonomyStories) {
    if (getProposedInterest(story) === interest) counts.set(story.brandSlug, (counts.get(story.brandSlug) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([slug, count]) => count >= MIN_INTEREST_STORIES && brandNames.has(slug))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([brandSlug]) => ({ brand: brandNames.get(brandSlug) ?? brandSlug, brandSlug }));
}

function getInterestStoryCount(interest: ReaderInterest) {
  return taxonomyStories.filter((story) => getProposedInterest(story) === interest).length;
}

const interestModes = new Map(readerInterests.map(({ label }) => [label, getReaderInterestFilterKey(label)]));

const allAndInterestSections: HearstDestinationSection[] = [
  { mode: "all", label: "All", href: getReaderTaxonomyPreviewRoute(), hasBrandMenu: true },
  ...readerInterests.map(({ label }) => ({
    mode: interestModes.get(label) as `interest:${string}`,
    label,
    href: getReaderTaxonomyPreviewRoute(label),
    hasBrandMenu: true,
  })),
];

/** Local News, A&E Family and International sit behind More, so the bar holds All, eight interests and More. */
const moreLinks: UtilityMenuLink[] = [
  { label: "Local News", href: "/hearst-plus/local-news/", description: "Stations and newspapers near you" },
  { label: "A&E Family", href: "/hearst-plus/entertainment/", description: "A&E, HISTORY, Lifetime and more" },
  { label: "International", href: "/hearst-plus/international/", description: "Hearst editions in seven countries" },
];

const sections: HearstDestinationSection[] = [
  ...allAndInterestSections,
  // The trigger opens the menu on hover and focus; a click goes to its first entry.
  { mode: "more", label: "More", href: moreLinks[0].href, hasBrandMenu: true },
];

/** Phones have no More menu: the drawer lists the interests and the other sections as tiles. */
const mobileSections: HearstDestinationSection[] = [
  ...allAndInterestSections,
  { mode: "local-news", label: "Local News", href: "/hearst-plus/local-news/" },
  { mode: "entertainment-culture", label: "A&E Family", href: "/hearst-plus/entertainment/" },
];

const familyGroups: UtilityBrandMenuGroup[] = brandFamilies.map((family) => ({
  mode: `family:${family.id}`,
  label: family.label,
  description: family.categories,
  brands: family.brands.map((brandSlug) => ({ brand: brandNames.get(brandSlug) ?? brandSlug, brandSlug })),
}));

const brandMenuGroups: UtilityBrandMenuGroups = {
  all: familyGroups,
  linksByMode: { more: moreLinks },
  byMode: Object.fromEntries(
    readerInterests.map(({ label }) => [
      interestModes.get(label) as string,
      [{
        mode: interestModes.get(label) as string,
        label,
        description: `${getInterestStoryCount(label)} stories today`,
        brands: getInterestBrands(label),
      }],
    ]),
  ),
};

/**
 * The section row says "what kind" while the utility bar says "where": on All it holds the
 * content types that are not interests, which keep their own pages; on an interest it holds
 * that interest's subtopics (those with enough stories today) and its videos, filtered in place.
 */
const MIN_SUBTOPIC_STORIES = 2;

const allRowLinks = ["Videos", "Events", "Community", "Games"];
const allRowHrefs: Record<string, string> = {
  Videos: "/hearst-plus/videos/",
  Events: "/hearst-plus/events/",
  Community: "/communities/",
  Games: "/hearst-plus/games/",
};

function getInterestRow(interest: ReaderInterest) {
  const interestKey = getReaderInterestFilterKey(interest);
  const subtopics = readerInterestSubtopics[interest].filter((subtopic) => {
    const key = getReaderSubtopicFilterKey(interest, subtopic.slug);
    return taxonomyStories.filter((story) => storyMatchesReaderInterestFilter(story, key)).length >= MIN_SUBTOPIC_STORIES;
  });
  const videosKey = getReaderSubtopicFilterKey(interest, "videos");
  return {
    links: [interestKey, ...subtopics.map((subtopic) => getReaderSubtopicFilterKey(interest, subtopic.slug)), videosKey],
    labels: {
      [interestKey]: `All ${interest}`,
      ...Object.fromEntries(subtopics.map((subtopic) => [getReaderSubtopicFilterKey(interest, subtopic.slug), subtopic.label])),
      [videosKey]: "Videos",
    } as Record<string, string>,
  };
}

export async function TaxonomyPreviewPage({ interest }: { interest?: ReaderInterest }) {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getLocalStoryFeed({ destination: "all" }),
    getPersonalizeVideoFeed({ destination: "all" }),
  ]);
  const row = interest ? getInterestRow(interest) : undefined;

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate
        staticDestinationData={getHearstDestinationStaticData()}
        liveFeedData={liveFeedData}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
        onboardingBrandInventory={getHearstAllStoryInventory()}
        initialFilter={interest ? getReaderInterestFilterKey(interest) : undefined}
        navLinksOverride={row ? row.links : allRowLinks}
        navLinkLabelOverrides={row?.labels}
        navLinkHrefOverrides={row ? undefined : allRowHrefs}
        mastheadDescriptorOverride={interest}
        activeDestinationOverride={interest ?? "All"}
        utilitySectionsOverride={sections}
        utilityBrandMenuGroupsOverride={brandMenuGroups}
        mobileSectionsOverride={mobileSections}
      />
      <aside
        aria-label="Taxonomy preview"
        className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-max flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-foreground px-4 py-2 text-xs text-background shadow-[var(--hp-shadow-card)] sm:left-auto sm:right-4 sm:mx-0"
      >
        <span><b className="font-semibold">Taxonomy preview.</b><span className="hidden sm:inline"> A proposal, not the live navigation.</span></span>
        <Link href="/specs/#taxonomy" className="inline-flex min-h-6 items-center font-semibold underline underline-offset-4">
          Read the proposal
        </Link>
      </aside>
    </ThemeProvider>
  );
}
