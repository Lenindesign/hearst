import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getPersonalizeAutosVideoFeed } from "@/lib/personalize-live-feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Autos Video Feed",
  description: "An autos video-only feed powered by production Personalize recommendations from MotorTrend and Car and Driver.",
  alternates: {
    canonical: "/hearst-plus/motortrend-videos/",
  },
  openGraph: {
    title: "Autos Video Feed",
    description: "An autos video-only feed powered by production Personalize recommendations from MotorTrend and Car and Driver.",
    url: "/hearst-plus/motortrend-videos/",
    siteName: "Hearst+ Prototype",
    type: "website",
    images: [
      {
        url: "/hearst-plus/opengraph-image/",
        width: 1200,
        height: 630,
        alt: "Autos Video Feed personalized magazine reader preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autos Video Feed",
    description: "An autos video-only feed powered by production Personalize recommendations from MotorTrend and Car and Driver.",
    images: ["/hearst-plus/opengraph-image/"],
  },
};

export default async function MotorTrendVideosPage() {
  const liveFeedData = await getPersonalizeAutosVideoFeed();

  return (
    <ThemeProvider defaultBrandSlug="hearst-autos">
      <HomePageTemplate
        staticDestinationData={getHearstDestinationStaticData()}
        liveFeedData={liveFeedData}
        initialFilter="Videos"
        navLinksOverride={["For You", "Style", "Reviews", "Fitness", "Cars", "Home", "Videos", "Shopping", "Games"]}
      />
    </ThemeProvider>
  );
}
