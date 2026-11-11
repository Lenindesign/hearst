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

type EntertainmentShowPageProps = {
  params: Promise<{ channelSlug: string; showSlug: string }>;
};

const showSlugsByChannel: Record<ChannelSlug, string[]> = {
  "a-e": ["the-first-48", "storage-wars", "court-cam", "intervention", "60-days-in", "hoarders"],
  history: ["alone", "ancient-aliens", "the-unxplained", "the-secret-of-skinwalker-ranch", "mountain-men", "forged-in-fire"],
  lifetime: ["married-at-first-sight", "dance-moms", "lifetime-movies", "the-chrisleys-back-to-reality", "dr-pimple-popper-breaking-out", "bring-it"],
  lmn: ["my-amish-double-life", "the-chrisleys-back-to-reality", "lifetime-movies", "textmewhenyougethome", "phrogging-hider-in-my-house", "girl-in-the-basement"],
  fyi: ["tiny-house-nation", "find-my-country-house-australia", "waterfront-house-hunting", "sell-this-house", "rachael-ray-in-tuscany", "living-smaller"],
  "vice-tv": ["dark-side-of-the-ring", "dark-side-of-the-ring-after-dark", "tales-from-the-territories", "hamiltons-pharmacopeia", "hate-thy-neighbor", "most-expensivest"],
  biography: ["biography", "history-makers", "icons", "inventors", "elvis-presley"],
};

export function generateStaticParams() {
  return Object.entries(showSlugsByChannel).flatMap(([channelSlug, showSlugs]) =>
    showSlugs.map((showSlug) => ({ channelSlug, showSlug })),
  );
}

export async function generateMetadata({ params }: EntertainmentShowPageProps): Promise<Metadata> {
  const { channelSlug, showSlug } = await params;
  const channel = channelSlugToBrand[channelSlug as ChannelSlug];
  const showTitle = showSlug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

  if (!channel) return { title: "Entertainment | Hearst+" };

  const title = `${showTitle} | ${channel} on Hearst+`;
  const description = `Explore ${showTitle}, previews, and related ${channel} shows on Hearst+.`;
  return {
    title,
    description,
    ...socialGraphMetadata("/images/hearst-plus-share.jpg", title, description),
  };
}

export default async function HearstPlusEntertainmentShowPage({ params }: EntertainmentShowPageProps) {
  const { channelSlug, showSlug } = await params;
  const channel = channelSlugToBrand[channelSlug as ChannelSlug];

  if (!channel || !showSlug) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-entertainment">
      <EntertainmentWatchPage activeChannel={channel} initialShowSlug={showSlug} />
    </ThemeProvider>
  );
}
