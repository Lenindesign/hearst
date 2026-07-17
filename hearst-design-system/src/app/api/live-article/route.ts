import { NextRequest, NextResponse } from "next/server";
import { getHearstLiveArticle, isAllowedHearstArticleUrl } from "@/lib/hearst-live-article";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get("url");
  if (!sourceUrl || !isAllowedHearstArticleUrl(sourceUrl)) {
    return NextResponse.json({ error: "Unsupported article URL" }, { status: 400 });
  }

  try {
    return NextResponse.json(await getHearstLiveArticle(sourceUrl));
  } catch (error) {
    console.error("Unable to load full Hearst article", error);
    return NextResponse.json({ error: "Full article is unavailable" }, { status: 502 });
  }
}
