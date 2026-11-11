import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getLocalLifestyleStoryFeed } from "@/lib/hearst-local-feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lifestyle Live",
  description: "A Lifestyle Live version of the Hearst personalized daily destination prototype.",
  alternates: {
    canonical: "/hearst-plus/lifestyle-live/",
  },
  openGraph: {
    title: "Lifestyle Live",
    description: "A Lifestyle Live version of the Hearst personalized daily destination prototype.",
    url: "/hearst-plus/lifestyle-live/",
    siteName: "Hearst+ Prototype",
    type: "website",
    images: [
      {
        url: "/images/hearst-plus-share.jpg",
        width: 1200,
        height: 630,
        alt: "Lifestyle Live personalized magazine reader preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lifestyle Live",
    description: "A Lifestyle Live version of the Hearst personalized daily destination prototype.",
    images: ["/images/hearst-plus-share.jpg"],
  },
};

export default async function LifestyleLivePage() {
  const liveFeedData = await getLocalLifestyleStoryFeed();

  return (
    <ThemeProvider defaultBrandSlug="hearst-lifestyle">
      <HomePageTemplate staticDestinationData={getHearstDestinationStaticData()} liveFeedData={liveFeedData} />
    </ThemeProvider>
  );
}
