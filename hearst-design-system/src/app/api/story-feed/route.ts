import { NextRequest, NextResponse } from "next/server";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import type { HearstDestinationMode } from "@/lib/hearst-routes";
import { getPersonalizeLiveFeed } from "@/lib/personalize-live-feed";
import { storyMatchesLifestyleFilter } from "@/lib/story-feed-filter";

export const dynamic = "force-dynamic";

const destinations = new Set<HearstDestinationMode>(["all", "lifestyle", "autos", "flux", "ew"]);
const fullCatalogLimitPerDestination = 10_000;
const defaultPageSize = 80;
const maximumPageSize = 100;

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getStoryIdentity(story: LifestyleRiverStory) {
  const sourceUrl = story.sourceUrl?.trim().toLowerCase();
  if (sourceUrl) return `url:${sourceUrl}`;

  return `story:${story.brandSlug}:${story.title.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

function mergeUniqueStories(...storyGroups: LifestyleRiverStory[][]) {
  const seen = new Set<string>();

  return storyGroups.flat().filter((story) => {
    const identity = getStoryIdentity(story);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

export async function GET(request: NextRequest) {
  const requestedDestination = request.nextUrl.searchParams.get("destination") ?? "all";
  const destination = destinations.has(requestedDestination as HearstDestinationMode)
    ? requestedDestination as HearstDestinationMode
    : "all";
  const brandSlug = request.nextUrl.searchParams.get("brandSlug") || undefined;
  const category = request.nextUrl.searchParams.get("category") || undefined;
  const offset = parsePositiveInteger(request.nextUrl.searchParams.get("offset"), 0);
  const limit = Math.min(
    maximumPageSize,
    Math.max(1, parsePositiveInteger(request.nextUrl.searchParams.get("limit"), defaultPageSize)),
  );
  const [fullCatalog, expandedLiveFeed] = await Promise.all([
    Promise.resolve(getHearstDestinationStaticData({
      storyLimitPerDestination: fullCatalogLimitPerDestination,
    })),
    getPersonalizeLiveFeed({
      destination,
      brandSlug,
      sizePerBrand: 10,
      videoSizePerBrand: 4,
    }),
  ]);
  const staticStories = brandSlug
    ? fullCatalog[destination].stories.filter((story) => story.brandSlug === brandSlug)
    : fullCatalog[destination].stories;
  const mergedStories = mergeUniqueStories(staticStories, expandedLiveFeed.stories);
  const eligibleStories = category
    ? mergedStories.filter((story) => storyMatchesLifestyleFilter(story, category))
    : mergedStories;
  const stories = eligibleStories.slice(offset, offset + limit);
  const nextOffset = offset + stories.length;

  return NextResponse.json({
    stories,
    nextOffset,
    total: eligibleStories.length,
    hasMore: nextOffset < eligibleStories.length,
  });
}
