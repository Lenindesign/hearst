export type EntertainmentWebsiteChannelSlug =
  | "a-e"
  | "history"
  | "lifetime"
  | "lmn"
  | "fyi"
  | "vice-tv"
  | "biography";

export type EntertainmentWebsiteFeedConfig = {
  slug: EntertainmentWebsiteChannelSlug;
  brand: string;
  shortLabel: string;
  showHref: string;
  storyHref: string;
  websiteUrl: string;
  sourceUrls?: string[];
  favicon: string;
  logo: string;
  rssUrl: string | null;
  articlePathPrefixes: string[];
  description: string;
};

export type EntertainmentWebsiteStory = {
  id: string;
  channelSlug: EntertainmentWebsiteChannelSlug;
  brand: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string | null;
  guid: string;
};

export const entertainmentWebsiteFeedConfigs: EntertainmentWebsiteFeedConfig[] = [
  {
    slug: "a-e",
    brand: "A&E",
    shortLabel: "A&E",
    showHref: "/hearst-plus/entertainment/a-e/",
    storyHref: "/hearst-plus/entertainment/stories/a-e/",
    websiteUrl: "https://www.aetv.com/",
    favicon: "https://www.aetv.com/favicon.ico",
    logo: "/logos/aande.svg",
    rssUrl: null,
    articlePathPrefixes: ["/articles/"],
    description: "A&E website stories, franchise updates, and channel features when a verified feed is available.",
  },
  {
    slug: "history",
    brand: "HISTORY",
    shortLabel: "H",
    showHref: "/hearst-plus/entertainment/history/",
    storyHref: "/hearst-plus/entertainment/stories/history/",
    websiteUrl: "https://www.history.com/",
    sourceUrls: ["https://www.history.com/articles"],
    favicon: "https://www.history.com/favicon.ico",
    logo: "/logos/history.svg",
    rssUrl: null,
    articlePathPrefixes: ["/articles/"],
    description: "HISTORY website articles and historical explainers from the channel site.",
  },
  {
    slug: "lifetime",
    brand: "Lifetime",
    shortLabel: "LT",
    showHref: "/hearst-plus/entertainment/lifetime/",
    storyHref: "/hearst-plus/entertainment/stories/lifetime/",
    websiteUrl: "https://www.mylifetime.com/",
    sourceUrls: ["https://www.mylifetime.com/", "https://www.mylifetime.com/movies"],
    favicon: "https://www.mylifetime.com/favicon.ico",
    logo: "/logos/lifetime.svg",
    rssUrl: null,
    articlePathPrefixes: ["/movies/"],
    description: "Lifetime website movie coverage and official channel features from mylifetime.com.",
  },
  {
    slug: "lmn",
    brand: "LMN",
    shortLabel: "LMN",
    showHref: "/hearst-plus/entertainment/lmn/",
    storyHref: "/hearst-plus/entertainment/stories/lmn/",
    websiteUrl: "https://www.mylifetime.com/lmn",
    sourceUrls: ["https://www.mylifetime.com/lmn", "https://www.mylifetime.com/lmn/movies"],
    favicon: "https://www.mylifetime.com/favicon.ico",
    logo: "/logos/lmn.svg",
    rssUrl: null,
    articlePathPrefixes: ["/movies/"],
    description: "LMN movie-network features and official movie pages from mylifetime.com.",
  },
  {
    slug: "fyi",
    brand: "FYI",
    shortLabel: "FYI",
    showHref: "/hearst-plus/entertainment/fyi/",
    storyHref: "/hearst-plus/entertainment/stories/fyi/",
    websiteUrl: "https://www.fyi.tv/",
    sourceUrls: ["https://www.fyi.tv/", "https://www.fyi.tv/outdoors", "https://www.fyi.tv/torque"],
    favicon: "https://www.fyi.tv/favicon.ico",
    logo: "/logos/fyi.svg",
    rssUrl: null,
    articlePathPrefixes: ["/shows/"],
    description: "FYI lifestyle, outdoors, and torque channel pages from fyi.tv.",
  },
  {
    slug: "vice-tv",
    brand: "VICE TV",
    shortLabel: "Vice",
    showHref: "/hearst-plus/entertainment/vice-tv/",
    storyHref: "/hearst-plus/entertainment/stories/vice-tv/",
    websiteUrl: "https://www.vicetv.com/",
    favicon: "https://www.vicetv.com/favicon.ico",
    logo: "/logos/vice-tv.svg",
    rssUrl: null,
    articlePathPrefixes: [],
    description: "VICE TV official video stories from the channel site's public inventory API.",
  },
  {
    slug: "biography",
    brand: "BIOGRAPHY",
    shortLabel: "Bio",
    showHref: "/hearst-plus/entertainment/biography/",
    storyHref: "/hearst-plus/entertainment/stories/biography/",
    websiteUrl: "https://www.biography.com/",
    favicon: "https://www.biography.com/favicon.ico",
    logo: "/logos/biography.svg",
    rssUrl: "https://www.biography.com/rss/all.xml",
    articlePathPrefixes: [],
    description: "Biography profiles and articles from the official Biography feed.",
  },
];

export function getEntertainmentWebsiteFeedConfig(slug: string | null | undefined) {
  return entertainmentWebsiteFeedConfigs.find((config) => config.slug === slug);
}
