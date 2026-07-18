import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hearst-ew-headline",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Hearst E&W",
  description: "A personalized daily destination prototype for Hearst health, gear, fitness, and wellness brands.",
};

export const dynamic = "force-dynamic";

export default async function HearstEWPage() {
  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "ew" }),
    getPersonalizeVideoFeed({ destination: "ew" }),
  ]);

  return (
    <div className={newsreader.variable}>
      <ThemeProvider defaultBrandSlug="hearst-ew">
        <HomePageTemplate liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} />
      </ThemeProvider>
    </div>
  );
}
