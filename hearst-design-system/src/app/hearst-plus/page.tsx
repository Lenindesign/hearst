import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getLocalStoryFeed } from "@/lib/hearst-local-feed";
import { getPersonalizeVideoFeed } from "@/lib/hearst-video-feed";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Hearst+",
  description: "A personalized daily destination prototype across every Hearst category.",
  ...socialGraphMetadata("/images/hearst-plus-share.jpg", "Hearst+", "A personalized daily destination prototype across every Hearst category."),
};

export const dynamic = "force-dynamic";

export default async function HearstPlusPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getLocalStoryFeed({ destination: "all" }),
    getPersonalizeVideoFeed({ destination: "all" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate
        staticDestinationData={getHearstDestinationStaticData()}
        liveFeedData={liveFeedData}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
        onboardingBrandInventory={getHearstAllStoryInventory()}
      />
    </ThemeProvider>
  );
}
