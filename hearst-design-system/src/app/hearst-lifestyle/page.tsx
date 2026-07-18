import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hearst-lifestyle-headline",
  weight: ["400", "500", "600", "700", "800"],
});

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
    <div className={newsreader.variable}>
      <ThemeProvider defaultBrandSlug="hearst-lifestyle">
        <HomePageTemplate liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} />
      </ThemeProvider>
    </div>
  );
}
