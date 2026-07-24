import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory, getHearstGlobalStoryInventory } from "@/lib/hearst-story-inventory";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";
import {
  getHearstSectionBrand,
  getHearstSectionBrandSlugs,
  hearstSectionThemeSlugs,
  type HearstBrandSection,
} from "@/lib/hearst-routes";

type SectionBrandPageProps = {
  params: Promise<{ brandSlug: string }>;
};

export function generateSectionBrandStaticParams(section: HearstBrandSection) {
  return getHearstSectionBrandSlugs(section).map((brandSlug) => ({ brandSlug }));
}

export async function generateSectionBrandMetadata(
  section: HearstBrandSection,
  { params }: SectionBrandPageProps
): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = getHearstSectionBrand(section, brandSlug);

  if (!brand) return {};

  return {
    title: `${brand.brand} | Hearst ${section === "ew" ? "Enthusiast & Wellness" : section === "flux" ? "Fashion & Luxury" : section}`,
    description: `A personalized ${brand.brand} story feed within the Hearst ${section} destination.`,
  };
}

export async function SectionBrandRoutePage({
  section,
  params,
}: SectionBrandPageProps & { section: HearstBrandSection }) {
  const { brandSlug } = await params;
  const brand = getHearstSectionBrand(section, brandSlug);

  if (!brand) notFound();

  const [liveFeedData, videoFeedData, globalBrandInventory] = await Promise.all([
    getPersonalizeLiveFeed({ destination: section, brandSlug: brand.brandSlug }),
    getPersonalizeVideoFeed({ destination: section }),
    getHearstGlobalStoryInventory(section),
  ]);

  return (
    <ThemeProvider defaultBrandSlug={hearstSectionThemeSlugs[section]}>
      <HomePageTemplate
        // Seed publication routes with their full local inventory so the river
        // is useful before the progressive live-feed request completes.
        staticDestinationData={getHearstDestinationStaticData({ includeBrandSlug: brand.brandSlug })}
        key={brand.brandSlug}
        initialBrandSlug={brand.brandSlug}
        liveFeedData={liveFeedData}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
        globalBrandInventory={globalBrandInventory}
        onboardingBrandInventory={getHearstAllStoryInventory()}
      />
    </ThemeProvider>
  );
}
