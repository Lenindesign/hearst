import type { Metadata } from "next";
import { EntertainmentWatchPage } from "@/components/hearst-plus/entertainment/entertainment-watch-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Entertainment | Hearst+",
  description: "A dark streaming-style Hearst+ prototype for A&E family entertainment brands.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Entertainment | Hearst+",
    "A dark streaming-style Hearst+ prototype for A&E family entertainment brands.",
  ),
};

type EntertainmentPageProps = {
  searchParams?: Promise<{ channel?: string }>;
};

const channelSlugToBrand = {
  "a-e": "A&E",
  history: "HISTORY",
  lifetime: "Lifetime",
  lmn: "LMN",
  fyi: "FYI",
  "vice-tv": "VICE TV",
  biography: "BIOGRAPHY",
} as const;

export default async function HearstPlusEntertainmentPage({ searchParams }: EntertainmentPageProps) {
  const params = await searchParams;
  const activeChannel = params?.channel
    ? channelSlugToBrand[params.channel as keyof typeof channelSlugToBrand]
    : undefined;

  return (
    <ThemeProvider defaultBrandSlug="hearst-entertainment">
      <EntertainmentWatchPage activeChannel={activeChannel} />
    </ThemeProvider>
  );
}
