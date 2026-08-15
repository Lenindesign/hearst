export type FeedType = "RSS" | "MRSS" | "TBD";
export type FeedStatus = "connected" | "pending" | "error";
export type HearstTVContentType = "news" | "video" | "other";

export type HearstTVStation = {
  id: string;
  stationName: string;
  callSign: string;
  market: string;
  state: string;
  network: string;
  logo: string | null;
  homepageUrl: string | null;
  enabled: boolean;
  category: "Hearst TV";
  geo?: {
    latitude: number;
    longitude: number;
  };
};

export type HearstTVFeed = {
  id: string;
  stationId: string;
  feedName: string;
  feedUrl: string;
  feedType: FeedType;
  enabled: boolean;
  status: FeedStatus;
  lastSuccessfulFetch: string | null;
  lastRefreshTimestamp: string | null;
  lastError: string | null;
};

export type HearstTVContent = {
  id: string;
  stationId: string;
  feedId: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  contentType: HearstTVContentType;
  guid: string;
  rawSource: string;
  isMock: boolean;
};

export type NormalizedFeedItemInput = {
  title?: string | null;
  description?: string | null;
  link?: string | null;
  mediaUrl?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  guid?: string | null;
  rawSource?: unknown;
};

const directorySource = "Hearst Television station directory seed";
export const feedUrlTbd = "Feed URL TBD";
export const kcraTopStoriesFeedUrl = "https://www.kcra.com/topstories-rss";
export const kcraLogoUrl = "https://www.kcra.com/favicon.ico";

export const hearstTVStations: HearstTVStation[] = [
  { id: "wcvb", stationName: "WCVB Channel 5", callSign: "WCVB-TV", market: "Boston", state: "MA", network: "ABC", logo: null, homepageUrl: "https://www.wcvb.com/", enabled: false, category: "Hearst TV", geo: { latitude: 42.3601, longitude: -71.0589 } },
  { id: "wmur", stationName: "WMUR News 9", callSign: "WMUR-TV", market: "Manchester", state: "NH", network: "ABC", logo: null, homepageUrl: "https://www.wmur.com/", enabled: false, category: "Hearst TV", geo: { latitude: 42.9956, longitude: -71.4548 } },
  { id: "wmtw", stationName: "WMTW 8", callSign: "WMTW", market: "Portland/Auburn", state: "ME", network: "ABC", logo: null, homepageUrl: "https://www.wmtw.com/", enabled: false, category: "Hearst TV", geo: { latitude: 43.6591, longitude: -70.2568 } },
  { id: "wpxt", stationName: "WPXT", callSign: "WPXT", market: "Portland", state: "ME", network: "CW", logo: null, homepageUrl: null, enabled: false, category: "Hearst TV", geo: { latitude: 43.6591, longitude: -70.2568 } },
  { id: "wptz", stationName: "NBC5", callSign: "WPTZ", market: "Burlington/Plattsburgh", state: "VT", network: "NBC", logo: null, homepageUrl: "https://www.mynbc5.com/", enabled: false, category: "Hearst TV", geo: { latitude: 44.4759, longitude: -73.2121 } },
  { id: "wtae", stationName: "WTAE Channel 4", callSign: "WTAE-TV", market: "Pittsburgh", state: "PA", network: "ABC", logo: null, homepageUrl: "https://www.wtae.com/", enabled: false, category: "Hearst TV", geo: { latitude: 40.4406, longitude: -79.9959 } },
  { id: "wgal", stationName: "WGAL News 8", callSign: "WGAL", market: "Lancaster/Harrisburg", state: "PA", network: "NBC", logo: null, homepageUrl: "https://www.wgal.com/", enabled: false, category: "Hearst TV", geo: { latitude: 40.0379, longitude: -76.3055 } },
  { id: "wbal", stationName: "WBAL-TV 11", callSign: "WBAL-TV", market: "Baltimore", state: "MD", network: "NBC", logo: null, homepageUrl: "https://www.wbaltv.com/", enabled: false, category: "Hearst TV", geo: { latitude: 39.2904, longitude: -76.6122 } },
  { id: "wxii", stationName: "WXII 12", callSign: "WXII-TV", market: "Winston-Salem/Greensboro", state: "NC", network: "NBC", logo: null, homepageUrl: "https://www.wxii12.com/", enabled: false, category: "Hearst TV", geo: { latitude: 36.0999, longitude: -80.2442 } },
  { id: "wyff", stationName: "WYFF News 4", callSign: "WYFF", market: "Greenville", state: "SC", network: "NBC", logo: null, homepageUrl: "https://www.wyff4.com/", enabled: false, category: "Hearst TV", geo: { latitude: 34.8526, longitude: -82.394 } },
  { id: "wesh", stationName: "WESH 2", callSign: "WESH", market: "Orlando/Daytona Beach", state: "FL", network: "NBC", logo: null, homepageUrl: "https://www.wesh.com/", enabled: false, category: "Hearst TV", geo: { latitude: 28.5383, longitude: -81.3792 } },
  { id: "wkcf", stationName: "CW18", callSign: "WKCF", market: "Orlando/Daytona Beach", state: "FL", network: "CW", logo: null, homepageUrl: null, enabled: false, category: "Hearst TV", geo: { latitude: 28.5383, longitude: -81.3792 } },
  { id: "wmor", stationName: "WMOR-TV", callSign: "WMOR-TV", market: "Tampa/St. Petersburg", state: "FL", network: "Independent", logo: null, homepageUrl: null, enabled: false, category: "Hearst TV", geo: { latitude: 27.9506, longitude: -82.4572 } },
  { id: "wpbf", stationName: "WPBF 25", callSign: "WPBF", market: "West Palm Beach", state: "FL", network: "ABC", logo: null, homepageUrl: "https://www.wpbf.com/", enabled: false, category: "Hearst TV", geo: { latitude: 26.7153, longitude: -80.0534 } },
  { id: "wdsu", stationName: "WDSU News", callSign: "WDSU", market: "New Orleans", state: "LA", network: "NBC", logo: null, homepageUrl: "https://www.wdsu.com/", enabled: false, category: "Hearst TV", geo: { latitude: 29.9511, longitude: -90.0715 } },
  { id: "wjcl", stationName: "WJCL 22", callSign: "WJCL", market: "Savannah", state: "GA", network: "ABC", logo: null, homepageUrl: "https://www.wjcl.com/", enabled: false, category: "Hearst TV", geo: { latitude: 32.0809, longitude: -81.0912 } },
  { id: "wvtm", stationName: "WVTM 13", callSign: "WVTM-TV", market: "Birmingham", state: "AL", network: "NBC", logo: null, homepageUrl: "https://www.wvtm13.com/", enabled: false, category: "Hearst TV", geo: { latitude: 33.5186, longitude: -86.8104 } },
  { id: "wapt", stationName: "16 WAPT", callSign: "WAPT", market: "Jackson", state: "MS", network: "ABC", logo: null, homepageUrl: "https://www.wapt.com/", enabled: false, category: "Hearst TV", geo: { latitude: 32.2988, longitude: -90.1848 } },
  { id: "wlky", stationName: "WLKY", callSign: "WLKY", market: "Louisville", state: "KY", network: "CBS", logo: null, homepageUrl: "https://www.wlky.com/", enabled: false, category: "Hearst TV", geo: { latitude: 38.2527, longitude: -85.7585 } },
  { id: "wlwt", stationName: "WLWT 5", callSign: "WLWT", market: "Cincinnati", state: "OH", network: "NBC", logo: null, homepageUrl: "https://www.wlwt.com/", enabled: false, category: "Hearst TV", geo: { latitude: 39.1031, longitude: -84.512 } },
  { id: "wisn", stationName: "WISN 12", callSign: "WISN", market: "Milwaukee", state: "WI", network: "ABC", logo: null, homepageUrl: "https://www.wisn.com/", enabled: false, category: "Hearst TV", geo: { latitude: 43.0389, longitude: -87.9065 } },
  { id: "kcci", stationName: "KCCI 8", callSign: "KCCI", market: "Des Moines", state: "IA", network: "CBS", logo: null, homepageUrl: "https://www.kcci.com/", enabled: false, category: "Hearst TV", geo: { latitude: 41.5868, longitude: -93.625 } },
  { id: "kmbc", stationName: "KMBC 9", callSign: "KMBC-TV", market: "Kansas City", state: "MO", network: "ABC", logo: null, homepageUrl: "https://www.kmbc.com/", enabled: false, category: "Hearst TV", geo: { latitude: 39.0997, longitude: -94.5786 } },
  { id: "kcwe", stationName: "KCWE", callSign: "KCWE", market: "Kansas City", state: "MO", network: "CW", logo: null, homepageUrl: null, enabled: false, category: "Hearst TV", geo: { latitude: 39.0997, longitude: -94.5786 } },
  { id: "ketv", stationName: "KETV 7", callSign: "KETV", market: "Omaha", state: "NE", network: "ABC", logo: null, homepageUrl: "https://www.ketv.com/", enabled: false, category: "Hearst TV", geo: { latitude: 41.2565, longitude: -95.9345 } },
  { id: "koco", stationName: "KOCO 5", callSign: "KOCO-TV", market: "Oklahoma City", state: "OK", network: "ABC", logo: null, homepageUrl: "https://www.koco.com/", enabled: false, category: "Hearst TV", geo: { latitude: 35.4676, longitude: -97.5164 } },
  { id: "khbs-khog", stationName: "40/29 News", callSign: "KHBS/KHOG-TV", market: "Fort Smith/Fayetteville", state: "AR", network: "ABC/CW", logo: null, homepageUrl: "https://www.4029tv.com/", enabled: false, category: "Hearst TV", geo: { latitude: 36.0626, longitude: -94.1574 } },
  { id: "koat", stationName: "KOAT 7", callSign: "KOAT-TV", market: "Albuquerque/Santa Fe", state: "NM", network: "ABC", logo: null, homepageUrl: "https://www.koat.com/", enabled: false, category: "Hearst TV", geo: { latitude: 35.0844, longitude: -106.6504 } },
  { id: "kcra", stationName: "KCRA 3", callSign: "KCRA-TV", market: "Sacramento", state: "CA", network: "NBC", logo: kcraLogoUrl, homepageUrl: "https://www.kcra.com/", enabled: true, category: "Hearst TV", geo: { latitude: 38.5816, longitude: -121.4944 } },
  { id: "kqca", stationName: "KQCA My58", callSign: "KQCA", market: "Sacramento", state: "CA", network: "MyNetworkTV", logo: null, homepageUrl: null, enabled: false, category: "Hearst TV", geo: { latitude: 38.5816, longitude: -121.4944 } },
  { id: "ksbw", stationName: "KSBW 8", callSign: "KSBW", market: "Monterey/Salinas", state: "CA", network: "NBC/ABC", logo: null, homepageUrl: "https://www.ksbw.com/", enabled: false, category: "Hearst TV", geo: { latitude: 36.6002, longitude: -121.8947 } },
  { id: "kitv", stationName: "KITV Island News", callSign: "KITV", market: "Honolulu", state: "HI", network: "ABC", logo: null, homepageUrl: "https://www.kitv.com/", enabled: false, category: "Hearst TV", geo: { latitude: 21.3099, longitude: -157.8581 } },
];

export const hearstTVFeeds: HearstTVFeed[] = hearstTVStations.map((station) => ({
  id: `${station.id}-primary-feed`,
  stationId: station.id,
  feedName: `${station.callSign} local news`,
  feedUrl: station.id === "kcra" ? kcraTopStoriesFeedUrl : feedUrlTbd,
  feedType: station.id === "kcra" ? "RSS" : "TBD",
  enabled: station.id === "kcra",
  status: station.id === "kcra" ? "connected" : "pending",
  lastSuccessfulFetch: null,
  lastRefreshTimestamp: null,
  lastError: station.id === "kcra" ? null : "Feed URL TBD. Add a verified RSS or MRSS endpoint to activate.",
}));

export const hearstTVSampleContent: HearstTVContent[] = hearstTVStations.flatMap((station, index) => {
  const publishedAt = new Date(Date.UTC(2026, 7, 14, 14, 0) - index * 37 * 60 * 1000).toISOString();
  const contentType: HearstTVContentType = index % 7 === 0 ? "video" : index % 11 === 0 ? "other" : "news";
  const contentLabel = contentType === "video" ? "video update" : contentType === "other" ? "community guide" : "local brief";

  return [
    createMockContent(
      station.id,
      `${station.market} ${contentLabel}: weather, traffic, and local headlines`,
      `A prototype ${station.callSign} item showing how ${station.market} local news would update the Hearst+ river when that station is selected by geolocation or filter.`,
      contentType,
      publishedAt,
    ),
  ];
});

export function getHearstTVStationById(stationId: string) {
  return hearstTVStations.find((station) => station.id === stationId);
}

export function getHearstTVFeedById(feedId: string) {
  return hearstTVFeeds.find((feed) => feed.id === feedId);
}

export function dedupeHearstTVContent(items: HearstTVContent[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeDedupeKey(item.guid || item.url || item.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeHearstTVFeedItem(
  input: NormalizedFeedItemInput,
  station: HearstTVStation,
  feed: HearstTVFeed,
): HearstTVContent {
  const title = cleanText(input.title) || "Untitled local update";
  const url = input.link || station.homepageUrl || "#";
  const guid = input.guid || url || `${station.id}-${title}`;
  const publishedAt = input.publishedAt && !Number.isNaN(Date.parse(input.publishedAt))
    ? new Date(input.publishedAt).toISOString()
    : new Date().toISOString();

  return {
    id: `${station.id}-${normalizeDedupeKey(guid).slice(0, 72)}`,
    stationId: station.id,
    feedId: feed.id,
    title,
    description: cleanText(input.description) || "",
    url,
    imageUrl: input.imageUrl || input.mediaUrl || null,
    publishedAt,
    contentType: inferContentType(input, feed),
    guid,
    rawSource: JSON.stringify(input.rawSource ?? {}, null, 2),
    isMock: false,
  };
}

export function findNearestHearstTVStation(latitude: number, longitude: number) {
  return hearstTVStations
    .filter((station) => station.geo)
    .map((station) => ({
      station,
      distance: distanceInMiles(latitude, longitude, station.geo!.latitude, station.geo!.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)[0] ?? null;
}

function createMockContent(
  stationId: string,
  title: string,
  description: string,
  contentType: HearstTVContentType,
  publishedAt: string,
): HearstTVContent {
  const station = getHearstTVStationById(stationId);
  const feedId = `${stationId}-primary-feed`;

  return {
    id: `mock-${stationId}-${normalizeDedupeKey(title).slice(0, 48)}`,
    stationId,
    feedId,
    title,
    description,
    url: station?.homepageUrl || "#",
    imageUrl: null,
    publishedAt,
    contentType,
    guid: `mock:${stationId}:${title}`,
    rawSource: directorySource,
    isMock: true,
  };
}

function inferContentType(input: NormalizedFeedItemInput, feed: HearstTVFeed): HearstTVContentType {
  if (feed.feedType === "MRSS" || input.mediaUrl) return "video";
  if (feed.feedType === "RSS") return "news";
  return "other";
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function normalizeDedupeKey(value: string) {
  return value.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function distanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radiusMiles = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return radiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number) {
  return value * Math.PI / 180;
}
