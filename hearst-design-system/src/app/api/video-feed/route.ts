import { NextRequest, NextResponse } from "next/server";
import { getPersonalizeVideoFeed } from "@/lib/personalize-live-feed";

export const dynamic = "force-dynamic";

const destinations = new Set(["all", "lifestyle", "autos", "flux", "ew"]);
// Personalize currently rejects sizes above 25 and does not expose working
// pagination. Keep this at the upstream maximum so the feed stays populated.
const fullVideoInventoryPerBrand = 25;
const defaultPageSize = 36;
const maximumPageSize = 48;

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const requestedDestination = request.nextUrl.searchParams.get("destination") ?? "all";
  const destination = destinations.has(requestedDestination)
    ? requestedDestination as "all" | "lifestyle" | "autos" | "flux" | "ew"
    : "all";
  const brandSlug = request.nextUrl.searchParams.get("brandSlug") || undefined;
  const offset = parsePositiveInteger(request.nextUrl.searchParams.get("offset"), 0);
  const limit = Math.min(
    maximumPageSize,
    Math.max(1, parsePositiveInteger(request.nextUrl.searchParams.get("limit"), defaultPageSize)),
  );
  const feed = await getPersonalizeVideoFeed({
    destination,
    brandSlug,
    sizePerBrand: fullVideoInventoryPerBrand,
  });
  const stories = feed.stories.slice(offset, offset + limit);
  const nextOffset = offset + stories.length;

  return NextResponse.json({
    stories,
    nextOffset,
    total: feed.stories.length,
    hasMore: nextOffset < feed.stories.length,
  });
}
