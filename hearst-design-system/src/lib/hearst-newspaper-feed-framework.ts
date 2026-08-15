export type HearstNewspaperContentType = "news" | "opinion" | "other";

export type HearstNewspaperPublication = {
  id: string;
  publicationName: string;
  market: string;
  state: string;
  homepageUrl: string;
  logo: string | null;
  enabled: boolean;
  category: "Hearst Newspapers";
};

export type HearstNewspaperFeed = {
  id: string;
  publicationId: string;
  feedName: string;
  feedUrl: string;
  feedType: "RSS" | "TBD";
  enabled: boolean;
  status: "connected" | "pending" | "error";
  lastSuccessfulFetch: string | null;
  lastRefreshTimestamp: string | null;
  lastError: string | null;
};

export type HearstNewspaperContent = {
  id: string;
  publicationId: string;
  feedId: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  contentType: HearstNewspaperContentType;
  guid: string;
  rawSource: string;
  isMock: boolean;
};

export type NormalizedNewspaperFeedItemInput = {
  title?: string | null;
  description?: string | null;
  link?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  guid?: string | null;
  rawSource?: unknown;
};

export const newspaperFeedUrlTbd = "Feed URL TBD";

export const hearstNewspaperPublications: HearstNewspaperPublication[] = [
  { id: "houston-chronicle", publicationName: "Houston Chronicle", market: "Houston", state: "TX", homepageUrl: "https://www.houstonchronicle.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "san-francisco-chronicle", publicationName: "San Francisco Chronicle", market: "San Francisco", state: "CA", homepageUrl: "https://www.sfchronicle.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "sfgate", publicationName: "SFGATE", market: "San Francisco Bay Area", state: "CA", homepageUrl: "https://www.sfgate.com/", logo: null, enabled: true, category: "Hearst Newspapers" },
  { id: "san-antonio-express-news", publicationName: "San Antonio Express-News", market: "San Antonio", state: "TX", homepageUrl: "https://www.expressnews.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "austin-american-statesman", publicationName: "Austin American-Statesman", market: "Austin", state: "TX", homepageUrl: "https://www.statesman.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "times-union", publicationName: "Times Union", market: "Albany", state: "NY", homepageUrl: "https://www.timesunion.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "ct-insider", publicationName: "CT Insider", market: "Connecticut", state: "CT", homepageUrl: "https://www.ctinsider.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "connecticut-post", publicationName: "Connecticut Post", market: "Bridgeport", state: "CT", homepageUrl: "https://www.ctpost.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "new-haven-register", publicationName: "New Haven Register", market: "New Haven", state: "CT", homepageUrl: "https://www.nhregister.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "stamford-advocate", publicationName: "Stamford Advocate", market: "Stamford", state: "CT", homepageUrl: "https://www.stamfordadvocate.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "greenwich-time", publicationName: "Greenwich Time", market: "Greenwich", state: "CT", homepageUrl: "https://www.greenwichtime.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "news-times", publicationName: "The News-Times", market: "Danbury", state: "CT", homepageUrl: "https://www.newstimes.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "the-hour", publicationName: "The Hour", market: "Norwalk", state: "CT", homepageUrl: "https://www.thehour.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "middletown-press", publicationName: "The Middletown Press", market: "Middletown", state: "CT", homepageUrl: "https://www.middletownpress.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "register-citizen", publicationName: "The Register Citizen", market: "Torrington", state: "CT", homepageUrl: "https://www.registercitizen.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "beaumont-enterprise", publicationName: "Beaumont Enterprise", market: "Beaumont", state: "TX", homepageUrl: "https://www.beaumontenterprise.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "laredo-morning-times", publicationName: "Laredo Morning Times", market: "Laredo", state: "TX", homepageUrl: "https://www.lmtonline.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "midland-reporter-telegram", publicationName: "Midland Reporter-Telegram", market: "Midland", state: "TX", homepageUrl: "https://www.mrt.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "plainview-herald", publicationName: "Plainview Herald", market: "Plainview", state: "TX", homepageUrl: "https://www.myplainview.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "midland-daily-news", publicationName: "Midland Daily News", market: "Midland", state: "MI", homepageUrl: "https://www.ourmidland.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "huron-daily-tribune", publicationName: "Huron Daily Tribune", market: "Bad Axe", state: "MI", homepageUrl: "https://www.michigansthumb.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "manistee-news-advocate", publicationName: "Manistee News Advocate", market: "Manistee", state: "MI", homepageUrl: "https://www.manisteenews.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "pioneer", publicationName: "Pioneer", market: "Big Rapids", state: "MI", homepageUrl: "https://www.bigrapidsnews.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "benzie-county-record-patriot", publicationName: "Benzie County Record Patriot", market: "Benzie County", state: "MI", homepageUrl: "https://www.recordpatriot.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "jacksonville-journal-courier", publicationName: "Jacksonville Journal-Courier", market: "Jacksonville", state: "IL", homepageUrl: "https://www.myjournalcourier.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "the-telegraph", publicationName: "The Telegraph", market: "Alton", state: "IL", homepageUrl: "https://www.thetelegraph.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
  { id: "edwardsville-intelligencer", publicationName: "Edwardsville Intelligencer", market: "Edwardsville", state: "IL", homepageUrl: "https://www.theintelligencer.com/", logo: null, enabled: false, category: "Hearst Newspapers" },
];

export const verifiedHearstNewspaperRssFeeds: Partial<Record<string, string>> = {
  "houston-chronicle": "https://www.chron.com/news/houston-texas/feed/houston-news-272.php",
  sfgate: "https://www.sfgate.com/bayarea/feed/bay-area-news-429.php",
  "san-antonio-express-news": "https://www.mysanantonio.com/news/local/feed/local-news-176.php",
  "times-union": "https://www.timesunion.com/news/feed/local-news-193.php",
};

export const hearstNewspaperFeeds: HearstNewspaperFeed[] = hearstNewspaperPublications.map((publication) => {
  const verifiedFeedUrl = verifiedHearstNewspaperRssFeeds[publication.id];
  const hasVerifiedFeed = Boolean(verifiedFeedUrl);

  return {
    id: `${publication.id}-primary-feed`,
    publicationId: publication.id,
    feedName: `${publication.publicationName} local news`,
    feedUrl: verifiedFeedUrl ?? newspaperFeedUrlTbd,
    feedType: hasVerifiedFeed ? "RSS" : "TBD",
    enabled: hasVerifiedFeed,
    status: hasVerifiedFeed ? "connected" : "pending",
    lastSuccessfulFetch: null,
    lastRefreshTimestamp: null,
    lastError: hasVerifiedFeed ? null : "Feed URL TBD. Add a verified newspaper RSS endpoint from the publication footer to activate.",
  };
});

export const hearstNewspaperSampleContent: HearstNewspaperContent[] = hearstNewspaperPublications.map((publication, index) => {
  const publishedAt = new Date(Date.UTC(2026, 7, 14, 16, 0) - index * 29 * 60 * 1000).toISOString();
  const feedId = `${publication.id}-primary-feed`;

  return {
    id: `mock-${publication.id}-local-newspaper-feed`,
    publicationId: publication.id,
    feedId,
    title: `${publication.market} local headlines from ${publication.publicationName}`,
    description: `A prototype ${publication.publicationName} item showing how Hearst+ can normalize newspaper RSS into the same Local News experience once a verified feed URL is added.`,
    url: publication.homepageUrl,
    imageUrl: publication.logo,
    publishedAt,
    contentType: index % 9 === 0 ? "opinion" : "news",
    guid: `mock:${publication.id}:local-newspaper-feed`,
    rawSource: "Hearst Newspapers directory seed",
    isMock: true,
  };
});

export function getHearstNewspaperPublicationById(publicationId: string) {
  return hearstNewspaperPublications.find((publication) => publication.id === publicationId);
}

export function getHearstNewspaperFeedById(feedId: string) {
  return hearstNewspaperFeeds.find((feed) => feed.id === feedId);
}

export function normalizeHearstNewspaperFeedItem(
  input: NormalizedNewspaperFeedItemInput,
  publication: HearstNewspaperPublication,
  feed: HearstNewspaperFeed,
): HearstNewspaperContent {
  const title = cleanText(input.title) || "Untitled local update";
  const url = input.link || publication.homepageUrl;
  const guid = input.guid || url || `${publication.id}-${title}`;
  const publishedAt = input.publishedAt && !Number.isNaN(Date.parse(input.publishedAt))
    ? new Date(input.publishedAt).toISOString()
    : new Date().toISOString();

  return {
    id: `${publication.id}-${normalizeDedupeKey(guid).slice(0, 72)}`,
    publicationId: publication.id,
    feedId: feed.id,
    title,
    description: cleanText(input.description) || "",
    url,
    imageUrl: input.imageUrl || publication.logo,
    publishedAt,
    contentType: inferContentType(input),
    guid,
    rawSource: JSON.stringify(input.rawSource ?? {}, null, 2),
    isMock: false,
  };
}

function inferContentType(input: NormalizedNewspaperFeedItemInput): HearstNewspaperContentType {
  const text = `${input.title ?? ""} ${input.description ?? ""}`.toLowerCase();
  if (/\b(opinion|editorial|column|letters?)\b/.test(text)) return "opinion";
  return "news";
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function normalizeDedupeKey(value: string) {
  return value.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
