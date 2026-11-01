import { NextRequest, NextResponse } from "next/server";
import { autosRiverStories } from "@/components/autos-river-data";
import { areHearstAutoStoriesAboutSameVehicle } from "@/lib/hearst-auto-related-stories";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title")?.trim() ?? "";
  const sourceUrl = request.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!title || title.length > 240 || sourceUrl.length > 2048) {
    return NextResponse.json({ error: "A vehicle story title is required" }, { status: 400 });
  }

  const anchor = { title, sourceUrl };
  const stories = autosRiverStories.filter((story) =>
    areHearstAutoStoriesAboutSameVehicle(anchor, story),
  );

  return NextResponse.json({ stories }, {
    headers: { "Cache-Control": "private, max-age=300" },
  });
}
