import { NextResponse } from "next/server";
import {
  getHearstNewspaperFeedById,
  getHearstNewspaperPublicationById,
  newspaperFeedUrlTbd,
  normalizeHearstNewspaperFeedItem,
  type HearstNewspaperContent,
  type HearstNewspaperFeed,
  type NormalizedNewspaperFeedItemInput,
} from "@/lib/hearst-newspaper-feed-framework";

export const dynamic = "force-dynamic";

const feedFetchTimeoutMs = 8000;
const articleImageFetchTimeoutMs = 3500;
const defaultStoryLimit = 15;
const maxStoryLimit = 30;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const publicationId = url.searchParams.get("publicationId");
  const requestedFeedId = url.searchParams.get("feedId");
  const requestedFeedUrl = url.searchParams.get("feedUrl")?.trim();
  const storyLimit = parseStoryLimit(url.searchParams.get("limit"));

  if (!publicationId) {
    return NextResponse.json(
      { stories: [], status: "error", error: "Publication is required." },
      { status: 400 },
    );
  }

  const publication = getHearstNewspaperPublicationById(publicationId);
  const seedFeed = getHearstNewspaperFeedById(requestedFeedId || `${publicationId}-primary-feed`);
  const feed = seedFeed ? {
    ...seedFeed,
    feedUrl: requestedFeedUrl && requestedFeedUrl !== newspaperFeedUrlTbd ? requestedFeedUrl : seedFeed.feedUrl,
  } : null;

  if (!publication || !feed) {
    return NextResponse.json(
      { stories: [], status: "error", error: "Publication or feed configuration is missing." },
      { status: 500 },
    );
  }

  if (!isFetchableFeedUrl(feed.feedUrl)) {
    return NextResponse.json({
      stories: [],
      status: "pending",
      feed: formatResponseFeed(feed, publication.id, null),
      fallback: false,
      error: "Feed URL TBD. Add a verified RSS endpoint to activate this newspaper.",
    });
  }

  try {
    const response = await fetch(feed.feedUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(feedFetchTimeoutMs),
      headers: {
        accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`${publication.publicationName} RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const enrichedItems = await hydrateMissingArticleImages(parseRssItems(xml).slice(0, storyLimit));
    const stories = enrichedItems
      .map((item) => normalizeHearstNewspaperFeedItem(item, publication, feed))
      .sort(sortNewestFirst);
    const lastSuccessfulFetch = new Date().toISOString();

    return NextResponse.json({
      stories,
      status: "connected",
      feed: formatResponseFeed(feed, publication.id, lastSuccessfulFetch),
      fallback: false,
    });
  } catch (error) {
    return NextResponse.json({
      stories: [],
      status: "error",
      feed: formatResponseFeed(feed, publication.id, null),
      fallback: false,
      error: error instanceof Error ? error.message : `${publication.publicationName} RSS fetch failed.`,
    });
  }
}

function parseStoryLimit(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return defaultStoryLimit;
  return Math.max(1, Math.min(maxStoryLimit, Math.trunc(parsed)));
}

function isFetchableFeedUrl(value: string) {
  if (!value || value === newspaperFeedUrlTbd) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function formatResponseFeed(feed: HearstNewspaperFeed, publicationId: string, lastSuccessfulFetch: string | null) {
  return {
    id: feed.id,
    publicationId,
    feedName: feed.feedName,
    feedUrl: feed.feedUrl,
    feedType: feed.feedType,
    lastSuccessfulFetch,
  };
}

function parseRssItems(xml: string): NormalizedNewspaperFeedItemInput[] {
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
      rawSource: itemXml,
    };
  });
}

async function hydrateMissingArticleImages(items: NormalizedNewspaperFeedItemInput[]) {
  return Promise.all(items.map(async (item) => {
    if (item.imageUrl || !item.link || !isFetchableFeedUrl(item.link)) return item;

    try {
      const response = await fetch(item.link, {
        cache: "no-store",
        signal: AbortSignal.timeout(articleImageFetchTimeoutMs),
        headers: {
          accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
          "user-agent": "Mozilla/5.0",
        },
      });
      if (!response.ok) return item;
      const html = await response.text();
      const imageUrl = getArticleImage(html);
      return imageUrl ? { ...item, imageUrl } : item;
    } catch {
      return item;
    }
  }));
}

function getArticleImage(html: string) {
  return getMetaContent(html, "property", "og:image")
    || getMetaContent(html, "name", "twitter:image")
    || getMetaContent(html, "property", "twitter:image");
}

function getMetaContent(html: string, attributeName: string, attributeValue: string) {
  const escapedValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagMatch = html.match(new RegExp(`<meta\\b(?=[^>]*\\b${attributeName}=["']${escapedValue}["'])[^>]*>`, "i"));
  const tag = tagMatch?.[0];
  if (!tag) return "";
  return getAttribute(tag, "meta", "content");
}

function getTagValue(xml: string, tagName: string) {
  const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escapedTagName}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, "i"));
  return decodeXml(match?.[1] ?? "");
}

function getMediaUrl(xml: string) {
  return getAttribute(xml, "media:content", "url")
    || getAttribute(xml, "media:thumbnail", "url")
    || getAttribute(xml, "enclosure", "url");
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
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sortNewestFirst(a: HearstNewspaperContent, b: HearstNewspaperContent) {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
}
