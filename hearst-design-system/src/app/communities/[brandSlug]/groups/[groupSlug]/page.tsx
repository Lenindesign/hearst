import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CommunityForumsPage,
  getCommunitySort,
} from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import {
  getCommunityGroup,
  getCommunityGroupsForBrand,
} from "@/lib/community-groups";
import { getHearstAllBrands, getHearstBrandRoute } from "@/lib/hearst-routes";
import { socialGraphMetadata } from "@/lib/social-graph-image";

type PageProps = {
  params: Promise<{ brandSlug: string; groupSlug: string }>;
  searchParams?: Promise<{ sort?: string | string[] }>;
};

export function generateStaticParams() {
  return getCommunityGroupsForBrand().map(({ brandSlug, groupSlug }) => ({
    brandSlug,
    groupSlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug, groupSlug } = await params;
  const brand = getHearstAllBrands().find(
    (candidate) => candidate.brandSlug === brandSlug,
  );
  const group = getCommunityGroup(brandSlug, groupSlug);
  if (!brand || !group) return {};

  const title = `${group.name} | ${brand.brand} Group | Hearst+`;
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

export default async function Page({ params, searchParams }: PageProps) {
  const { brandSlug, groupSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const brand = getHearstAllBrands().find(
    (candidate) => candidate.brandSlug === brandSlug,
  );
  const group = getCommunityGroup(brandSlug, groupSlug);
  if (!brand || !group) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage
        activeBrandSlug={brandSlug}
        activeGroupSlug={groupSlug}
        sortBy={getCommunitySort(resolvedSearchParams?.sort)}
      />
    </ThemeProvider>
  );
}
