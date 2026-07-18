import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

export const metadata: Metadata = {
  title: "Hearst Autos",
  description: "A personalized daily destination prototype for Hearst auto brands.",
};

export const dynamic = "force-dynamic";

export default async function HearstAutosPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "autos" }),
    getPersonalizeVideoFeed({ destination: "autos" }),
  ]);

  return (
    <ThemeProvider defaultBrandSlug="hearst-plus">
      <HomePageTemplate liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} />
    </ThemeProvider>
  );
}
