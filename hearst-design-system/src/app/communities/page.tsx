import type { Metadata } from "next";
import {
  CommunityForumsPage,
  getCommunitySort,
  getCommunityView,
} from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Communities | Hearst+",
  description:
    "Brand-hosted Hearst+ groups for story discussions, editor threads, and reader questions.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Communities | Hearst+",
    "Brand-hosted Hearst+ groups for story discussions, editor threads, and reader questions.",
  ),
};

type PageProps = {
  searchParams?: Promise<{ sort?: string | string[]; view?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage
        sortBy={getCommunitySort(resolvedSearchParams?.sort)}
        view={getCommunityView(resolvedSearchParams?.view)}
      />
    </ThemeProvider>
  );
}
