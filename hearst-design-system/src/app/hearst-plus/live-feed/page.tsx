import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getPersonalizeLiveFeed } from "@/lib/personalize-live-feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hearst+ Live Feed",
  description: "A live-feed version of the Hearst+ personalized daily destination prototype.",
};

export default async function HearstPlusLiveFeedPage() {
  const liveFeedData = await getPersonalizeLiveFeed();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate liveFeedData={liveFeedData} />
    </ThemeProvider>
  );
}
