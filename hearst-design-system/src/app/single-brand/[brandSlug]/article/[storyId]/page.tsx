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
  const feed = await getSingleBrandLiveFeed(brandSlug);
  const story = feed.stories.find((s) => s.id === storyId);
  return { title: story ? `${story.title} — ${name}` : name };
}

export default async function SingleBrandArticlePage({ params }: PageProps) {
  const { brandSlug, storyId } = await params;
  if (!isSingleBrand(brandSlug)) notFound();

  const feed = await getSingleBrandLiveFeed(brandSlug);
  // Degrade gracefully: with the live feed, story ids are dynamic, so a shared
  // or stale deep-link may not be in the current feed. Rather than 404, open
  // the reader only when the story is present; otherwise render the brand home.
  const hasStory = feed.stories.some((s) => s.id === storyId);

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
        initialOpenStoryId={hasStory ? storyId : undefined}
        readerReturnHref={`/single-brand/${brandSlug}`}
        forceDestinationRiver
        singleBrandName={getSingleBrandName(brandSlug)}
      />
    </ThemeProvider>
  );
}
