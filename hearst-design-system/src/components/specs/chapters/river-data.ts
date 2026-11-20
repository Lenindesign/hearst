/**
 * River logic spec data (HP-RIVER-SPEC). Runs the production selection code on
 * today's validated feed snapshot when the page is built, so every story, count
 * and score in the chapter follows each daily feed refresh. Nothing is typed.
 *
 * It reproduces the Hearst+ home (`/hearst-plus/`, For You) for a signed-out
 * reader on a first visit: the same pool (`getHearstDestinationStaticData` +
 * `getLocalStoryFeed`), ranking (`rankLifestyleRiver`), Today's Picks
 * (`getPersonalizedLeadSliderStories` + the daily edition) and module
 * allocation (`allocateStoryModules`). The video feed is fetched per request,
 * so its stories are not in these tables; the cadence rule places them.
 */
import "server-only";

import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { selectDailyEditionStoryIds } from "@/lib/daily-edition";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getLocalStoryFeed } from "@/lib/hearst-local-feed";
import {
  createDestinationConfigs,
  getLifestyleScoreBreakdown,
  rankLifestyleRiver,
  type LifestyleDemoDaypart,
  type LifestyleDemoState,
} from "@/lib/hearst-personalization-model";
import { getPersonalizedLeadSliderStories, TODAYS_PICKS_FRESHNESS_WINDOW_HOURS } from "@/lib/river-selection";
import { allocateStoryModules } from "@/lib/story-module-allocation";
import { getVisitDaypart } from "@/lib/visit-context";

export const riverBuiltAt = new Date();
const now = riverBuiltAt.getTime();
const hoursSince = (iso?: string) => {
  const time = Date.parse(iso ?? "");
  return Number.isFinite(time) ? (now - time) / 3_600_000 : undefined;
};

/* ---------- inventory: the four validated snapshots ---------- */
export const riverGroups = [
  ["Lifestyle", lifestyleRiverStories],
  ["Autos", autosRiverStories],
  ["Fashion & Luxury", fluxRiverStories],
  ["Enthusiast & Wellness", ewRiverStories],
] as const;

export const inventoryRows = riverGroups.map(([label, stories]) => {
  const ages = stories.map((story) => hoursSince(story.publishedAt)).filter((age): age is number => age !== undefined && age >= 0);
  const brands = new Set(stories.map((story) => story.brand));
  return {
    label,
    total: stories.length,
    brands: brands.size,
    within24: ages.filter((age) => age <= 24).length,
    within72: ages.filter((age) => age <= 72).length,
    within168: ages.filter((age) => age <= 168).length,
    newestHours: ages.length ? Math.round(Math.min(...ages)) : undefined,
    signals: Object.entries(stories.reduce<Record<string, number>>((counts, story) => {
      counts[story.signal] = (counts[story.signal] ?? 0) + 1;
      return counts;
    }, {})),
  };
});

/* ---------- the Hearst+ home pool, as the page builds it ---------- */
const staticData = getHearstDestinationStaticData();
const configs = createDestinationConfigs(staticData);
const localFeed = getLocalStoryFeed({ destination: "all" });
const config = configs.all;

function mergeUnique(...lists: LifestyleRiverStory[][]) {
  const seen = new Set<string>();
  return lists.flat().filter((story) => {
    const key = story.sourceUrl?.trim().toLowerCase() || story.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const pool = mergeUnique(staticData.all.stories, localFeed.stories);
export const poolSources = {
  staticFirstPage: staticData.all.stories.length,
  localFeed: localFeed.stories.length,
  merged: pool.length,
  brands: new Set(pool.map((story) => story.brand)).size,
};

/** A signed-out reader gets the destination's preset profile (`initialProfile`). */
export const signedOutProfile = { ...config.initialProfile, savedIds: [] };

export const buildDaypart: LifestyleDemoDaypart = getVisitDaypart(riverBuiltAt);
const firstVisit: LifestyleDemoState = {
  daypart: "morning",
  returnHours: 0,
  contentDay: "today",
  isSimulated: false,
};

const ranked = rankLifestyleRiver(pool, signedOutProfile, firstVisit, config);

export function scoreOf(story: LifestyleRiverStory, state = firstVisit) {
  return getLifestyleScoreBreakdown(story, signedOutProfile, state, config);
}

/* ---------- Today's Picks (lead slider) ---------- */
export const picksCandidates = ranked.flatMap((story) => {
  const age = hoursSince(story.publishedAt);
  if (age === undefined || age < 0 || age > TODAYS_PICKS_FRESHNESS_WINDOW_HOURS) return [];
  return [{ ...story, age: Math.floor(age) }];
});
const personalizedPicks = getPersonalizedLeadSliderStories(
  picksCandidates,
  signedOutProfile,
  firstVisit,
  config,
  Math.max(5, picksCandidates.length),
  true,
);
const pickIds = selectDailyEditionStoryIds(personalizedPicks, [], 5);
export const todaysPicks = pickIds
  .map((id) => personalizedPicks.find((story) => story.id === id))
  .filter((story): story is LifestyleRiverStory => Boolean(story));

/* ---------- module allocation: Daily Habit, Trending, river ---------- */
const allocation = allocateStoryModules({
  stories: ranked,
  heroStoryIds: pickIds,
  continueStoryIds: [],
  followedBrands: signedOutProfile.followedBrands,
  includeTodayEdit: false,
});
export const dailyHabit = allocation.dailyHabitStories;
export const trending = allocation.trendingStories;
export const river = allocation.riverStories;

/** The first page of the river (16 cards), with their score breakdown. */
export const riverFirstPage = river.slice(0, 16).map((story) => ({ story, score: scoreOf(story), age: hoursSince(story.publishedAt) }));

export const riverFirstPageBrands = Object.entries(
  riverFirstPage.reduce<Record<string, number>>((counts, { story }) => {
    counts[story.brand] = (counts[story.brand] ?? 0) + 1;
    return counts;
  }, {}),
).sort((a, b) => b[1] - a[1]);

/** How the lead changes by daypart for the same reader (top story of the ranking). */
export const daypartLeads = (["morning", "afternoon", "evening", "lateNight"] as const).map((daypart) => {
  const state = { ...firstVisit, daypart };
  const top = rankLifestyleRiver(pool, signedOutProfile, state, config)[0];
  return { daypart, label: config.dayparts[daypart].label, story: top, score: scoreOf(top, state) };
});

export const formatAge = (hours?: number) =>
  hours === undefined ? "undated" : hours < 1 ? "<1 h" : hours < 48 ? `${Math.round(hours)} h` : `${Math.round(hours / 24)} d`;

/** The destination's hard-coded editorial lead gets +24 on a first morning visit, if it is still in the pool. */
export const defaultLead = {
  id: config.defaultLeadStoryId,
  inPool: pool.some((story) => story.id === config.defaultLeadStoryId),
};

/** Popularity values in the pool: imported as max(55, 100 − index mod 46), so ties are common. */
export const popularityTies = pool.filter((story) => story.popularity === 100).length;
