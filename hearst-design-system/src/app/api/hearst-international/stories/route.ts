import { NextResponse } from "next/server";
import {
  getHearstInternationalFeed,
  getHearstInternationalFeedRssUrls,
} from "@/lib/hearst-international-feeds";
import { parseHearstInternationalRssItems } from "@/lib/hearst-international-rss";

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

      const stories = parseHearstInternationalRssItems(await response.text(), feed.name).slice(0, 24);
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
