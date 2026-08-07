import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityForumsPage } from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllBrands, getHearstBrandRoute } from "@/lib/hearst-routes";
import { socialGraphMetadata } from "@/lib/social-graph-image";

type PageProps = {
  params: Promise<{ brandSlug: string; threadId: string }>;
};

function getThreadStory(brandSlug: string, threadId: string) {
  const data = getHearstDestinationStaticData({
    storyLimitPerDestination: 10_000,
  });
  return data.all.stories.find(
    (story) => story.brandSlug === brandSlug && story.id === threadId,
  );
}

export function generateStaticParams() {
  const data = getHearstDestinationStaticData({
    storyLimitPerDestination: 10_000,
  });
  return data.all.stories.map((story) => ({
    brandSlug: story.brandSlug,
    threadId: story.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug, threadId } = await params;
  const brand = getHearstAllBrands().find(
    (candidate) => candidate.brandSlug === brandSlug,
  );
  const story = getThreadStory(brandSlug, threadId);
  if (!brand) return {};

  const title = story
    ? `${story.title} | ${brand.brand} Group`
    : `${brand.brand} Group Discussion | Hearst+`;
  const description = story
    ? `Group discussion for ${story.title}.`
    : `Writer prompts, reader questions, and group discussions for ${brand.brand}.`;
  return {
    title,
    description,
    ...socialGraphMetadata(
      getHearstBrandRoute(brand.brandSlug),
      title,
      description,
    ),
  };
}

export default async function Page({ params }: PageProps) {
  const { brandSlug, threadId } = await params;
  const brand = getHearstAllBrands().find(
    (candidate) => candidate.brandSlug === brandSlug,
  );
  if (!brand) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage
        activeBrandSlug={brandSlug}
        activeThreadId={threadId}
      />
    </ThemeProvider>
  );
}
