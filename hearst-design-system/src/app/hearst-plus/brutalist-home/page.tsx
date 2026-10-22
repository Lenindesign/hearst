import type { Metadata } from "next";
import { BrutalistHomePage } from "@/components/hearst-plus/brutalist-home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getPersonalizeLiveFeed } from "@/lib/personalize-live-feed";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Brutalist editorial home | Hearst+",
  description: "A bold, image-first Hearst+ homepage with a full-width feature and graphic story sections.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Hearst+ Brutalist editorial home",
    "A bold, image-first Hearst+ homepage with a full-width feature and graphic story sections.",
  ),
};

export const dynamic = "force-dynamic";

export default async function HearstPlusBrutalistHomeRoute() {
  const [liveFeed] = await Promise.all([
    getPersonalizeLiveFeed({ destination: "all" }).catch(() => undefined),
  ]);
  const staticStories = getHearstDestinationStaticData({ storyLimitPerDestination: 32 }).all.stories;
  const seen = new Set<string>();
  const stories = [...(liveFeed?.stories ?? []), ...staticStories].filter((story) => {
    const identities = [story.id, story.sourceUrl?.trim().toLowerCase()].filter(Boolean) as string[];
    if (identities.some((identity) => seen.has(identity))) return false;
    identities.forEach((identity) => seen.add(identity));
    return true;
  });

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <BrutalistHomePage stories={stories} />
    </ThemeProvider>
  );
}
