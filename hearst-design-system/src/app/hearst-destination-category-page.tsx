import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import {
  getHearstDestinationCategoryLabel,
  hearstDestinationCategoryLabels,
  type HearstDestinationMode,
} from "@/lib/hearst-routes";
import { getPersonalizeLiveFeed, getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

export type DestinationCategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

const destinationNames: Record<HearstDestinationMode, string> = {
  all: "Hearst+",
  lifestyle: "Hearst Lifestyle",
  autos: "Hearst Autos",
  flux: "Hearst Fashion & Luxury",
  ew: "Hearst Enthusiast & Wellness",
};

const destinationThemeSlugs: Record<HearstDestinationMode, string> = {
  all: "hearst-all",
  lifestyle: "hearst-lifestyle",
  autos: "hearst-plus",
  flux: "hearst-flux",
  ew: "hearst-ew",
};

export function generateDestinationCategoryStaticParams(destination: HearstDestinationMode) {
  return hearstDestinationCategoryLabels[destination].map((label) => ({
    categorySlug: label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  }));
}

export async function generateDestinationCategoryMetadata(
  destination: HearstDestinationMode,
  { params }: DestinationCategoryPageProps
): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryLabel = getHearstDestinationCategoryLabel(destination, categorySlug);
  if (!categoryLabel) return {};

  return {
    title: `${categoryLabel} | ${destinationNames[destination]}`,
    description: `${categoryLabel} stories personalized for the ${destinationNames[destination]} destination.`,
  };
}

export async function DestinationCategoryRoutePage({
  destination,
  params,
  className,
}: DestinationCategoryPageProps & {
  destination: HearstDestinationMode;
  className?: string;
}) {
  const { categorySlug } = await params;
  const categoryLabel = getHearstDestinationCategoryLabel(destination, categorySlug);
  if (!categoryLabel) notFound();

  const [liveFeedData, videoFeedData] = await Promise.all([
    getPersonalizeLiveFeed({ destination }),
    getPersonalizeVideoFeed({ destination }),
  ]);

  const content = (
    <ThemeProvider defaultBrandSlug={destinationThemeSlugs[destination]} persistColorMode={destination === "flux" ? false : undefined}>
      <HomePageTemplate
        initialFilter={categoryLabel}
        liveFeedData={liveFeedData}
        liveFeedMode="blend"
        videoFeedData={videoFeedData}
      />
    </ThemeProvider>
  );

  return className ? <div className={className}>{content}</div> : content;
}
