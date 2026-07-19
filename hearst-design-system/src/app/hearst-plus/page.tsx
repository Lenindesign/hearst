import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

export const metadata: Metadata = {
  title: "Hearst+",
  description: "A personalized daily destination prototype across every Hearst category.",
};

export const dynamic = "force-dynamic";

export default async function HearstPlusPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "all" }),
    getPersonalizeVideoFeed({ destination: "all" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate
        staticDestinationData={getHearstDestinationStaticData()}
        liveFeedData={liveFeedData}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
      />
    </ThemeProvider>
  );
}
