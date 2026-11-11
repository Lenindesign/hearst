import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getLocalStoryFeed } from "@/lib/hearst-local-feed";
import { getPersonalizeVideoFeed } from "@/lib/hearst-video-feed";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Full-width hero slider | Hearst+",
  description: "Explore Hearst+ with a full-width featured story slider and discovery sidebars below.",
  ...socialGraphMetadata(
    "/images/hearst-plus-share.jpg",
    "Full-width hero slider | Hearst+",
    "A full-width featured story slider with Hearst+ discovery sidebars below.",
  ),
};

export const dynamic = "force-dynamic";

export default async function HearstPlusFullWidthHeroPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    Promise.resolve(getLocalStoryFeed({ destination: "all" })),
    Promise.resolve(getPersonalizeVideoFeed({ destination: "all" })),
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
