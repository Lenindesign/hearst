import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hearst-flux-headline",
  weight: "700",
});

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
    <div className={newsreader.variable}>
      <ThemeProvider defaultBrandSlug="hearst-flux" persistColorMode={false}>
        <HomePageTemplate liveFeedData={liveFeedData} liveFeedMode="blend" videoFeedData={videoFeedData} />
      </ThemeProvider>
    </div>
  );
}
