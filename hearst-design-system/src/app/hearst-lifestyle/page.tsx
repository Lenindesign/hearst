import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

export const metadata: Metadata = {
  title: "Hearst Lifestyle",
  description:
    "A personalized Hearst lifestyle destination prototype powered by cross-brand editorial signals.",
};

export const dynamic = "force-dynamic";

export default async function HearstLifestylePage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "lifestyle" }),
    getPersonalizeVideoFeed({ destination: "lifestyle" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-lifestyle">
      <HomePageTemplate staticDestinationData={getHearstDestinationStaticData()} liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} />
    </ThemeProvider>
  );
}
