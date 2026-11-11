import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getLocalStoryFeed } from "@/lib/hearst-local-feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hearst+ Live Feed",
  description: "A live-feed version of the Hearst+ personalized daily destination prototype.",
  alternates: {
    canonical: "/hearst-plus/live-feed/",
  },
  openGraph: {
    title: "Hearst+ Live Feed",
    description: "A live-feed version of the Hearst+ personalized daily destination prototype.",
    url: "/hearst-plus/live-feed/",
    siteName: "Hearst+ Prototype",
    type: "website",
    images: [
      {
        url: "/images/hearst-plus-share.jpg",
        width: 1200,
        height: 630,
        alt: "Hearst+ Live Feed personalized magazine reader preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hearst+ Live Feed",
    description: "A live-feed version of the Hearst+ personalized daily destination prototype.",
    images: ["/images/hearst-plus-share.jpg"],
  },
};

export default async function HearstPlusLiveFeedPage() {
  const liveFeedData = await getLocalStoryFeed();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate staticDestinationData={getHearstDestinationStaticData()} liveFeedData={liveFeedData} />
    </ThemeProvider>
  );
}
