import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getCompleteArticleFeed } from "@/lib/complete-article-feed";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";

export const metadata: Metadata = {
  title: "Complete Article Viewer | Hearst+",
  description: "Read complete Hearst articles in one continuous, lazy-loading viewer.",
};

export const dynamic = "force-dynamic";

export default async function CompleteArticlesPage() {
  const completeArticleFeed = await getCompleteArticleFeed();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate
        staticDestinationData={getHearstDestinationStaticData({ storyLimitPerDestination: 3 })}
        liveFeedData={completeArticleFeed}
        liveFeedMode="replace"
        initialOpenStoryId={completeArticleFeed.stories[0]?.id}
        readerReturnHref="/hearst-plus/complete-articles/"
      />
    </ThemeProvider>
  );
}
