import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Hearst E&W",
  description: "A personalized daily destination prototype for Hearst health, gear, fitness, and wellness brands.",
  ...socialGraphMetadata("/hearst-ew/opengraph-image/", "Hearst Enthusiast & Wellness", "A personalized daily destination for Hearst health, gear, fitness, and wellness brands."),
};

export const dynamic = "force-dynamic";

export default async function HearstEWPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "ew" }),
    getPersonalizeVideoFeed({ destination: "ew" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-ew">
      <HomePageTemplate staticDestinationData={getHearstDestinationStaticData()} liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} onboardingBrandInventory={getHearstAllStoryInventory()} />
    </ThemeProvider>
  );
}
