import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntertainmentChannelStoriesPage } from "@/components/hearst-plus/entertainment/entertainment-channel-stories-page";
import { ThemeProvider } from "@/components/theme-provider";
import {
  entertainmentWebsiteFeedConfigs,
  getEntertainmentWebsiteFeedConfig,
  type EntertainmentWebsiteChannelSlug,
} from "@/lib/hearst-entertainment-story-feeds";
import { socialGraphMetadata } from "@/lib/social-graph-image";

type EntertainmentStoriesPageProps = {
  params: Promise<{ channelSlug: string }>;
};

export function generateStaticParams() {
  return entertainmentWebsiteFeedConfigs.map((channel) => ({ channelSlug: channel.slug }));
}

export async function generateMetadata({ params }: EntertainmentStoriesPageProps): Promise<Metadata> {
  const { channelSlug } = await params;
  const channel = getEntertainmentWebsiteFeedConfig(channelSlug);
  if (!channel) return {};

  const title = `${channel.brand} Stories | Hearst+ Entertainment`;
  const description = `Internal Hearst+ story feed for ${channel.brand} channel website stories.`;
  return {
    title,
    description,
    ...socialGraphMetadata("/hearst-plus/opengraph-image/", title, description),
  };
}

export default async function EntertainmentStoriesChannelPage({ params }: EntertainmentStoriesPageProps) {
  const { channelSlug } = await params;
  const channel = getEntertainmentWebsiteFeedConfig(channelSlug);

  if (!channel) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-entertainment">
      <EntertainmentChannelStoriesPage channelSlug={channel.slug as EntertainmentWebsiteChannelSlug} />
    </ThemeProvider>
  );
}
