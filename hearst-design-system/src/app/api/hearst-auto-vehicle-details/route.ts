import { NextRequest, NextResponse } from "next/server";
import { getHearstAutoVehicleDetails } from "@/lib/hearst-auto-vehicle-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const storyTitle = request.nextUrl.searchParams.get("title")?.trim() ?? "";
  const storyUrl = request.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!storyTitle || storyTitle.length > 240 || !storyUrl) {
    return NextResponse.json({ error: "A Car and Driver story title and URL are required" }, { status: 400 });
  }

  try {
    const details = await getHearstAutoVehicleDetails(storyTitle, storyUrl);
    return NextResponse.json(details, {
      headers: { "Cache-Control": "private, max-age=0, must-revalidate" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Vehicle details are unavailable" },
      { status: 404 },
    );
  }
}
