import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

export const metadata: Metadata = {
  title: "Hearst Flux",
  description: "A personalized daily destination prototype for Hearst fashion, culture, design, and luxury brands.",
};

export const dynamic = "force-dynamic";

export default async function HearstFluxPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "flux" }),
    getPersonalizeVideoFeed({ destination: "flux" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-flux" persistColorMode={false}>
      <HomePageTemplate staticDestinationData={getHearstDestinationStaticData()} liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} onboardingBrandInventory={getHearstAllStoryInventory()} />
    </ThemeProvider>
  );
}
