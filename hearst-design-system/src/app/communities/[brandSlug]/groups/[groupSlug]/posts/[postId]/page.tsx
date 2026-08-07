import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityForumsPage } from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import {
  getCommunityStarterPost,
  getCommunityStarterPostParams,
} from "@/lib/community-groups";
import { getHearstAllBrands, getHearstBrandRoute } from "@/lib/hearst-routes";
import { socialGraphMetadata } from "@/lib/social-graph-image";

type PageProps = {
  params: Promise<{ brandSlug: string; groupSlug: string; postId: string }>;
};

export function generateStaticParams() {
  return getCommunityStarterPostParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug, groupSlug, postId } = await params;
  const brand = getHearstAllBrands().find(
    (candidate) => candidate.brandSlug === brandSlug,
  );
  const group = getCommunityStarterPost(brandSlug, groupSlug, postId);
  if (!brand || !group) return {};

  const title = `${group.prompt} | ${group.name} | Hearst+`;
  const description = group.description;
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
  const { brandSlug, groupSlug, postId } = await params;
  const brand = getHearstAllBrands().find(
    (candidate) => candidate.brandSlug === brandSlug,
  );
  const group = getCommunityStarterPost(brandSlug, groupSlug, postId);
  if (!brand || !group) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage
        activeBrandSlug={brandSlug}
        activeGroupSlug={groupSlug}
        activeThreadId={postId}
      />
    </ThemeProvider>
  );
}
