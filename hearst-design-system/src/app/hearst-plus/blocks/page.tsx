import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getLocalStoryFeed } from "@/lib/hearst-local-feed";
import { getPersonalizeVideoFeed } from "@/lib/hearst-video-feed";

export const metadata: Metadata = {
  title: "Hearst+ Blocks",
  description: "Explore Hearst+ stories in grouped editorial blocks with related discovery modules.",
};

export const dynamic = "force-dynamic";

export default async function HearstPlusBlocksPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getLocalStoryFeed({ destination: "all" }),
    getPersonalizeVideoFeed({ destination: "all" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate
        blocksHomepage
        staticDestinationData={getHearstDestinationStaticData()}
        liveFeedData={liveFeedData}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
        onboardingBrandInventory={getHearstAllStoryInventory()}
      />
    </ThemeProvider>
  );
}
