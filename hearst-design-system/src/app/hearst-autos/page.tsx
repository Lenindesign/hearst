import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllStoryInventory } from "@/lib/hearst-story-inventory";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Hearst Autos",
  description: "A personalized daily destination prototype for Hearst auto brands.",
  ...socialGraphMetadata("/hearst-autos/opengraph-image/", "Hearst Autos", "A personalized daily destination for Hearst auto brands."),
};

export const dynamic = "force-dynamic";

export default async function HearstAutosPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "autos" }),
    getPersonalizeVideoFeed({ destination: "autos" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-plus">
      <HomePageTemplate staticDestinationData={getHearstDestinationStaticData()} liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} onboardingBrandInventory={getHearstAllStoryInventory()} />
    </ThemeProvider>
  );
}
