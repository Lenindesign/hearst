import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import {
  getSingleBrandLiveFeed,
  getSingleBrandMasthead,
  getSingleBrandName,
  isSingleBrand,
} from "@/templates/single-brand-feed";

type PageProps = { params: Promise<{ brandSlug: string; storyId: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug, storyId } = await params;
  const name = getSingleBrandName(brandSlug);
  if (!name) return { title: "Not found" };
  const story = getSingleBrandLiveFeed(brandSlug).stories.find((s) => s.id === storyId);
  return { title: story ? `${story.title} — ${name}` : name };
}

export default async function SingleBrandArticlePage({ params }: PageProps) {
  const { brandSlug, storyId } = await params;
  if (!isSingleBrand(brandSlug)) notFound();

  const feed = getSingleBrandLiveFeed(brandSlug);
  if (!feed.stories.some((s) => s.id === storyId)) notFound();

  // Reuse the Hearst+ template but open its built-in modal reader (with infinite
  // "up next" scroll) directly on this story — the article "template".
  return (
    <ThemeProvider defaultBrandSlug={brandSlug} persistColorMode={false}>
      <HomePageTemplate
        initialBrandSlug={brandSlug}
        liveFeedData={feed}
        liveFeedMode="replace"
        mastheadLogoOverride={getSingleBrandMasthead(brandSlug)}
        staticDestinationData={getHearstDestinationStaticData()}
        initialOpenStoryId={storyId}
        readerReturnHref={`/single-brand/${brandSlug}`}
        forceDestinationRiver
      />
    </ThemeProvider>
  );
}
