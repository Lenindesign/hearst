import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Full-width hero slider | Hearst+",
  description: "Explore Hearst+ with a full-width featured story slider and discovery sidebars below.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Full-width hero slider | Hearst+",
    "A full-width featured story slider with Hearst+ discovery sidebars below.",
  ),
};

export const dynamic = "force-dynamic";

export default async function HearstPlusFullWidthHeroPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "all" }).catch(() => undefined),
    getPersonalizeVideoFeed({ destination: "all" }).catch(() => undefined),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate
        staticDestinationData={getHearstDestinationStaticData()}
        liveFeedData={liveFeedData}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
        onboardingBrandInventory={getHearstAllStoryInventory()}
        fullWidthFeaturedHero
      />
    </ThemeProvider>
  );
}
