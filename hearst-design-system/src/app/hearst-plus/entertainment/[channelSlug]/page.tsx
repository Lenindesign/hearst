import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntertainmentWatchPage } from "@/components/hearst-plus/entertainment/entertainment-watch-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

const channelSlugToBrand = {
  "a-e": "A&E",
  history: "HISTORY",
  lifetime: "Lifetime",
  lmn: "LMN",
  fyi: "FYI",
  "vice-tv": "VICE TV",
  biography: "BIOGRAPHY",
} as const;

type ChannelSlug = keyof typeof channelSlugToBrand;

type EntertainmentChannelPageProps = {
  params: Promise<{ channelSlug: string }>;
};

export function generateStaticParams() {
  return Object.keys(channelSlugToBrand)
    .filter((channelSlug) => channelSlug !== "a-e")
    .map((channelSlug) => ({ channelSlug }));
}

export async function generateMetadata({ params }: EntertainmentChannelPageProps): Promise<Metadata> {
  const { channelSlug } = await params;
  const channel = channelSlugToBrand[channelSlug as ChannelSlug];

  if (!channel) {
    return {
      title: "Entertainment | Hearst+",
    };
  }

  return {
    title: `${channel} | Hearst+ Entertainment`,
    description: `A dark streaming-style Hearst+ prototype for ${channel} shows.`,
    ...socialGraphMetadata(
      "/hearst-plus/opengraph-image/",
      `${channel} | Hearst+ Entertainment`,
      `A dark streaming-style Hearst+ prototype for ${channel} shows.`,
    ),
  };
}

export default async function HearstPlusEntertainmentChannelPage({ params }: EntertainmentChannelPageProps) {
  const { channelSlug } = await params;
  const channel = channelSlugToBrand[channelSlug as ChannelSlug];

  if (!channel) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <EntertainmentWatchPage activeChannel={channel} />
    </ThemeProvider>
  );
}
