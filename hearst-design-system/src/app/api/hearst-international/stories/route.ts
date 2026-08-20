import { NextResponse } from "next/server";
import {
  getHearstInternationalFeed,
  getHearstInternationalFeedRssUrls,
} from "@/lib/hearst-international-feeds";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sourceUrl = new URL(request.url).searchParams.get("feed");
  const feed = getHearstInternationalFeed(sourceUrl);

  if (!feed) {
    return NextResponse.json({ stories: [], status: "error", error: "International feed is not configured." }, { status: 404 });
  }

  const rssUrls = getHearstInternationalFeedRssUrls(feed);
  let lastError = "The configured RSS endpoint returned no stories.";

  for (const rssUrl of rssUrls) {
    try {
      const response = await fetch(rssUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: { accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8" },
      });

      if (!response.ok) throw new Error(`${feed.name} RSS returned ${response.status}`);

      const stories = parseRssItems(await response.text(), feed.name).slice(0, 24);
      if (stories.length > 0) {
        return NextResponse.json({ stories, status: "connected", feed, rssUrl });
      }
      lastError = `${rssUrl} returned no stories.`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "International RSS feed failed.";
    }
  }

  return NextResponse.json({
    stories: [],
    status: "pending",
    feed,
    rssUrl: rssUrls[rssUrls.length - 1],
    error: lastError,
  });
}

function parseRssItems(xml: string, brand: string) {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match, index) => {
    const item = match[0];
    const title = clean(getTag(item, "title"));
    const url = clean(getTag(item, "link"));
    const description = clean(getTag(item, "description"));
    const publishedAt = getTag(item, "pubDate") || getTag(item, "dc:date") || null;
    const guid = getTag(item, "guid") || url || `${brand}-${index}`;

    return {
      id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}-${hash(guid)}`,
      brand,
      title,
      url,
      description,
      publishedAt,
      imageUrl: getMediaUrl(item) || getImageFromHtml(description),
    };
  }).filter((story) => story.title && story.url);
}

function getTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return decode(match?.[1] ?? "");
}

function getMediaUrl(xml: string) {
  return xml.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
    || xml.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]
    || null;
}

function getImageFromHtml(html: string) {
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || null;
}

function clean(value: string) {
  return decode(value).replace(/<[^>]+>/g, "").replace(/\\s+/g, " ").trim();
}

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function hash(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) result = (result * 31 + value.charCodeAt(index)) | 0;
  return Math.abs(result).toString(36);
}
