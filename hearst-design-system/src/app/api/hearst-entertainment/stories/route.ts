import { NextResponse } from "next/server";
import {
  getEntertainmentWebsiteFeedConfig,
  type EntertainmentWebsiteFeedConfig,
  type EntertainmentWebsiteStory,
} from "@/lib/hearst-entertainment-story-feeds";

export const dynamic = "force-dynamic";

const feedFetchTimeoutMs = 8000;
const articleFetchTimeoutMs = 3500;
const viceTvStoriesUrl = "https://www.vicetv.com/api/v1/videos?locale=en_us&per_page=24&feedvisibility=1";

type ViceTvVideo = {
  id?: string;
  vms_id?: string;
  video_type?: string;
  title?: string;
  body?: string;
  dek?: string;
  summary?: string;
  slug?: string;
  url?: string;
  publish_date?: number | string | null;
  air_date?: number | string | null;
  updated_at?: number | string | null;
  thumbnail_url_16_9?: string | null;
  thumbnail_url?: string | null;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const channel = url.searchParams.get("channel");
  const config = getEntertainmentWebsiteFeedConfig(channel);

  if (!config) {
    return NextResponse.json(
      { stories: [], status: "error", error: "Entertainment channel is not configured." },
      { status: 404 },
    );
  }

  if (config.slug === "vice-tv") {
    try {
      const stories = await getViceTvStories();
      return NextResponse.json({
        stories,
        status: stories.length > 0 ? "connected" : "pending",
        channel: config,
        fetchedAt: new Date().toISOString(),
        error: stories.length > 0 ? undefined : "No official VICE TV video stories were returned.",
      });
    } catch (error) {
      return NextResponse.json({
        stories: [],
        status: "error",
        channel: config,
        error: error instanceof Error ? error.message : "VICE TV story feed failed.",
      });
    }
  }

  if (!config.rssUrl && config.articlePathPrefixes.length === 0) {
    return NextResponse.json({
      stories: [],
      status: "pending",
      channel: config,
      error: "Verified RSS or article-list source pending for this channel website.",
    });
  }

  try {
    const stories = config.rssUrl
      ? await getRssStories(config.rssUrl, config.slug, config.brand)
      : await getWebsiteArticleStories(config);

    return NextResponse.json({
      stories,
      status: stories.length > 0 ? "connected" : "pending",
      channel: config,
      fetchedAt: new Date().toISOString(),
      error: stories.length > 0 ? undefined : "No matching website article links were found for this channel.",
    });
  } catch (error) {
    return NextResponse.json({
      stories: [],
      status: "error",
      channel: config,
      error: error instanceof Error ? error.message : `${config.brand} story feed failed.`,
    });
  }
}

async function getViceTvStories(): Promise<EntertainmentWebsiteStory[]> {
  const response = await fetch(viceTvStoriesUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(feedFetchTimeoutMs),
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) throw new Error(`VICE TV API returned ${response.status}`);

  const videos = await response.json() as ViceTvVideo[];
  if (!Array.isArray(videos)) return [];

  return videos
    .map((video) => mapViceTvVideoToStory(video))
    .filter(isEntertainmentWebsiteStory)
    .sort(sortNewestFirst)
    .slice(0, 24);
}

function mapViceTvVideoToStory(video: ViceTvVideo): EntertainmentWebsiteStory | null {
  const title = stripHtml(video.title ?? "");
  const url = video.url;
  const guid = video.vms_id || video.id || url || title;

  if (!title || !url || !guid) return null;

  return {
    id: `vice-tv-${normalizeKey(guid).slice(0, 80)}`,
    channelSlug: "vice-tv",
    brand: "VICE TV",
    title,
    description: stripHtml(video.dek || video.summary || video.body || "Official VICE TV story from the channel site."),
    url,
    imageUrl: video.thumbnail_url_16_9 || video.thumbnail_url || null,
    publishedAt: getViceTvDate(video.publish_date || video.air_date || video.updated_at),
    guid,
  };
}

async function getRssStories(rssUrl: string, channelSlug: EntertainmentWebsiteStory["channelSlug"], brand: string) {
  const response = await fetch(rssUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(feedFetchTimeoutMs),
    headers: {
      accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!response.ok) throw new Error(`${brand} RSS returned ${response.status}`);

  const xml = await response.text();
  return parseRssItems(xml, channelSlug, brand)
    .sort(sortNewestFirst)
    .slice(0, 24);
}

async function getWebsiteArticleStories(config: EntertainmentWebsiteFeedConfig) {
  const candidates = (await Promise.all(getSourceUrls(config).map((sourceUrl) => getWebsiteArticleCandidates(sourceUrl, config))))
    .flat()
    .filter(dedupeCandidates())
    .slice(0, 18);
  const stories = await Promise.all(candidates.map((candidate) => hydrateWebsiteArticle(candidate, config)));
  return stories.filter(isEntertainmentWebsiteStory).sort(sortNewestFirst).slice(0, 24);
}

async function getWebsiteArticleCandidates(sourceUrl: string, config: EntertainmentWebsiteFeedConfig) {
  const response = await fetch(sourceUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(feedFetchTimeoutMs),
    headers: {
      accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) return [];

  return parseWebsiteArticleLinks(await response.text(), config);
}

function getSourceUrls(config: EntertainmentWebsiteFeedConfig) {
  return config.sourceUrls?.length ? config.sourceUrls : [config.websiteUrl];
}

function dedupeCandidates() {
  const seen = new Set<string>();
  return (candidate: { url: string; title: string }) => {
    if (seen.has(candidate.url)) return false;
    seen.add(candidate.url);
    return true;
  };
}

function parseRssItems(xml: string, channelSlug: EntertainmentWebsiteStory["channelSlug"], brand: string): EntertainmentWebsiteStory[] {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => {
    const itemXml = match[0];
    const description = stripHtml(getTagValue(itemXml, "description"));
    const title = stripHtml(getTagValue(itemXml, "title"));
    const link = getTagValue(itemXml, "link");
    const guid = getTagValue(itemXml, "guid") || link || title;
    const publishedAt = getTagValue(itemXml, "pubDate") || getTagValue(itemXml, "dc:date") || null;

    return {
      id: `${channelSlug}-${normalizeKey(guid || title).slice(0, 80)}`,
      channelSlug,
      brand,
      title,
      description,
      url: link,
      imageUrl: getMediaUrl(itemXml) || getImageFromDescription(getTagValue(itemXml, "description")),
      publishedAt,
      guid,
    };
  }).filter((story) => story.title && story.url);
}

function parseWebsiteArticleLinks(html: string, config: EntertainmentWebsiteFeedConfig) {
  const sourceUrl = new URL(config.websiteUrl);
  const seen = new Set<string>();

  return [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].flatMap((match) => {
    const href = decodeXml(match[1]);
    const label = stripHtml(match[2]);

    try {
      const url = new URL(href, config.websiteUrl);
      const isSameHost = url.hostname.replace(/^www\./, "") === sourceUrl.hostname.replace(/^www\./, "");
      const matchesArticlePath = config.articlePathPrefixes.some((prefix) => url.pathname.startsWith(prefix));
      const normalizedUrl = `${url.origin}${url.pathname}`;

      if (!isSameHost || !matchesArticlePath || seen.has(normalizedUrl)) return [];
      seen.add(normalizedUrl);

      return [{ url: normalizedUrl, title: label }];
    } catch {
      return [];
    }
  }).filter((candidate) => candidate.title.length > 8);
}

async function hydrateWebsiteArticle(
  candidate: { url: string; title: string },
  config: EntertainmentWebsiteFeedConfig,
): Promise<EntertainmentWebsiteStory | null> {
  try {
    const response = await fetch(candidate.url, {
      cache: "no-store",
      signal: AbortSignal.timeout(articleFetchTimeoutMs),
      headers: {
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "user-agent": "Mozilla/5.0",
      },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const title = stripSiteSuffix(
      getMetaContent(html, "property", "og:title")
      || getMetaContent(html, "name", "twitter:title")
      || candidate.title,
      config.brand,
    );
    const description = stripHtml(
      getMetaContent(html, "property", "og:description")
      || getMetaContent(html, "name", "description")
      || getMetaContent(html, "name", "twitter:description")
    );
    const imageUrl = getMetaContent(html, "property", "og:image")
      || getMetaContent(html, "name", "twitter:image")
      || null;
    const publishedAt = getMetaContent(html, "property", "article:published_time")
      || getMetaContent(html, "name", "publishdate")
      || null;

    return {
      id: `${config.slug}-${normalizeKey(candidate.url).slice(0, 80)}`,
      channelSlug: config.slug,
      brand: config.brand,
      title,
      description,
      url: candidate.url,
      imageUrl,
      publishedAt,
      guid: candidate.url,
    };
  } catch {
    return null;
  }
}

function getMetaContent(html: string, attributeName: string, attributeValue: string) {
  const escapedValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagMatch = html.match(new RegExp(`<meta\\b(?=[^>]*\\b${attributeName}=["']${escapedValue}["'])[^>]*>`, "i"));
  const tag = tagMatch?.[0];
  if (!tag) return "";
  return getAttribute(tag, "meta", "content") ?? "";
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
    || getAttribute(xml, "enclosure", "url");
}

function getImageFromDescription(description: string) {
  return description.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] ?? null;
}

function getAttribute(xml: string, tagName: string, attributeName: string) {
  const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedAttributeName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagMatch = xml.match(new RegExp(`<${escapedTagName}\\b[^>]*>`, "i"));
  if (!tagMatch) return null;
  return decodeXml(tagMatch[0].match(new RegExp(`${escapedAttributeName}=["']([^"']+)["']`, "i"))?.[1] ?? "");
}

function stripHtml(value: string) {
  return decodeXml(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sortNewestFirst(a: EntertainmentWebsiteStory, b: EntertainmentWebsiteStory) {
  return Date.parse(b.publishedAt ?? "") - Date.parse(a.publishedAt ?? "");
}

function isEntertainmentWebsiteStory(story: EntertainmentWebsiteStory | null): story is EntertainmentWebsiteStory {
  return Boolean(story);
}

function stripSiteSuffix(value: string, brand: string) {
  return value
    .replace(new RegExp(`\\s*[|-]\\s*${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), "")
    .replace(/\s*[|-]\s*A&E\s*$/, "")
    .trim();
}

function getViceTvDate(value: ViceTvVideo["publish_date"]) {
  if (!value) return null;
  const timestamp = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(timestamp)) return null;
  return new Date(timestamp).toISOString();
}
