import type { Metadata } from "next";
import {
  CommunityForumsPage,
  getCommunitySort,
} from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Communities | Hearst+",
  description:
    "Hearst+ groups for story discussions, writer prompts, and reader posts across brands.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Communities | Hearst+",
    "Hearst+ groups for story discussions, writer prompts, and reader posts across brands.",
  ),
};

type PageProps = {
  searchParams?: Promise<{ sort?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage
        sortBy={getCommunitySort(resolvedSearchParams?.sort)}
      />
    </ThemeProvider>
  );
}
