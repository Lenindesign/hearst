import { NextResponse } from "next/server";
import {
  feedUrlTbd,
  getHearstTVFeedById,
  getHearstTVStationById,
  kcraLogoUrl,
  normalizeHearstTVFeedItem,
  type FeedType,
  type HearstTVContent,
  type HearstTVFeed,
  type NormalizedFeedItemInput,
} from "@/lib/hearst-tv-feed-framework";

export const dynamic = "force-dynamic";

const kcraStationId = "kcra";

const fallbackItems: NormalizedFeedItemInput[] = [
  {
    title: "Sacramento local headlines from KCRA 3",
    description: "KCRA top stories are configured as the first active Hearst TV RSS source for the Hearst+ Local News river.",
    link: "https://www.kcra.com/",
    imageUrl: kcraLogoUrl,
    publishedAt: new Date(Date.UTC(2026, 7, 14, 15, 0)).toISOString(),
    guid: "fallback:kcra:top-headlines",
    rawSource: { source: "KCRA fallback sample" },
  },
  {
    title: "KCRA weather, traffic, and community updates",
    description: "Fallback sample used only when the live RSS endpoint cannot be reached from the local environment.",
    link: "https://www.kcra.com/weather",
    imageUrl: kcraLogoUrl,
    publishedAt: new Date(Date.UTC(2026, 7, 14, 14, 20)).toISOString(),
    guid: "fallback:kcra:weather-traffic-community",
    rawSource: { source: "KCRA fallback sample" },
  },
  {
    title: "Northern California news river powered by KCRA",
    description: "The reusable Hearst TV feed model preserves station, market, feed, timestamp, and source attribution for every story.",
    link: "https://www.kcra.com/topstories",
    imageUrl: kcraLogoUrl,
    publishedAt: new Date(Date.UTC(2026, 7, 14, 13, 45)).toISOString(),
    guid: "fallback:kcra:local-news-river",
    rawSource: { source: "KCRA fallback sample" },
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId") || kcraStationId;
  const requestedFeedId = url.searchParams.get("feedId");
  const requestedFeedUrl = url.searchParams.get("feedUrl")?.trim();
  const requestedFeedType = normalizeFeedType(url.searchParams.get("feedType"));
  const station = getHearstTVStationById(stationId);
  const seedFeed = getHearstTVFeedById(requestedFeedId || `${stationId}-primary-feed`);
  const feed = seedFeed ? {
    ...seedFeed,
    feedUrl: requestedFeedUrl && requestedFeedUrl !== feedUrlTbd ? requestedFeedUrl : seedFeed.feedUrl,
    feedType: requestedFeedType ?? seedFeed.feedType,
  } : null;

  if (!station || !feed) {
    return NextResponse.json(
      { stories: [], status: "error", error: "Station or feed configuration is missing." },
      { status: 500 },
    );
  }

  if (!isFetchableFeedUrl(feed.feedUrl)) {
    return NextResponse.json({
      stories: [],
      status: "pending",
      feed: formatResponseFeed(feed, station.id, null),
      fallback: false,
      error: "Feed URL TBD. Add a verified RSS or MRSS endpoint to activate this station.",
    });
  }

  try {
    const response = await fetch(feed.feedUrl, {
      cache: "no-store",
      headers: {
        accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`${station.callSign} RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const stories = parseRssItems(xml)
      .map((item) => normalizeHearstTVFeedItem(item, station, feed))
      .sort(sortNewestFirst);
    const lastSuccessfulFetch = new Date().toISOString();

    return NextResponse.json({
      stories,
      status: "connected",
      feed: formatResponseFeed(feed, station.id, lastSuccessfulFetch),
      fallback: false,
    });
  } catch (error) {
    const stories = station.id === kcraStationId
      ? fallbackItems
        .map((item) => normalizeHearstTVFeedItem(item, station, feed))
        .map((item): HearstTVContent => ({ ...item, isMock: true }))
        .sort(sortNewestFirst)
      : [];

    return NextResponse.json({
      stories,
      status: "error",
      feed: formatResponseFeed(feed, station.id, null),
      fallback: station.id === kcraStationId,
      error: error instanceof Error ? error.message : `${station.callSign} RSS fetch failed.`,
    });
  }
}

function normalizeFeedType(value: string | null): FeedType | null {
  if (value === "RSS" || value === "MRSS" || value === "TBD") return value;
  return null;
}

function isFetchableFeedUrl(value: string) {
  if (!value || value === feedUrlTbd) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function formatResponseFeed(feed: HearstTVFeed, stationId: string, lastSuccessfulFetch: string | null) {
  return {
    id: feed.id,
    stationId,
    feedName: feed.feedName,
    feedUrl: feed.feedUrl,
    feedType: feed.feedType,
    lastSuccessfulFetch,
  };
}

function parseRssItems(xml: string): NormalizedFeedItemInput[] {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => {
    const itemXml = match[0];
    const description = getTagValue(itemXml, "description");

    return {
      title: getTagValue(itemXml, "title"),
      description: stripHtml(description),
      link: getTagValue(itemXml, "link"),
      publishedAt: getTagValue(itemXml, "pubDate") || getTagValue(itemXml, "dc:date"),
      guid: getTagValue(itemXml, "guid"),
      imageUrl: getMediaUrl(itemXml) || getImageFromDescription(description),
      mediaUrl: getEnclosureUrl(itemXml),
      rawSource: itemXml,
    };
  });
}

function getTagValue(xml: string, tagName: string) {
  const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escapedTagName}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, "i"));
  return decodeXml(match?.[1] ?? "");
}

function getMediaUrl(xml: string) {
  return getAttribute(xml, "media:content", "url")
    || getAttribute(xml, "media:thumbnail", "url")
    || getAttribute(xml, "image", "url")
    || getEnclosureUrl(xml);
}

function getEnclosureUrl(xml: string) {
  return getAttribute(xml, "enclosure", "url");
}

function getAttribute(xml: string, tagName: string, attributeName: string) {
  const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagMatch = xml.match(new RegExp(`<${escapedTagName}\\b[^>]*>`, "i"));
  const tag = tagMatch?.[0];
  if (!tag) return "";

  const attributeMatch = tag.match(new RegExp(`${attributeName}=["']([^"']+)["']`, "i"));
  return decodeXml(attributeMatch?.[1] ?? "");
}

function getImageFromDescription(description: string) {
  const match = description.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  return decodeXml(match?.[1] ?? "");
}

function stripHtml(value: string) {
  return decodeXml(value.replace(/<[^>]+>/g, " "));
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sortNewestFirst(a: HearstTVContent, b: HearstTVContent) {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
}
