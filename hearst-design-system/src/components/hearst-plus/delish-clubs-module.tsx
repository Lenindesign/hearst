"use client";

import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Check,
  ChefHat,
  Flame,
  GlobeHemisphereEast,
  Heart,
  MessageCircle,
  Star,
} from "@/components/ui/icons";
import type { LifestyleRiverProfile } from "@/components/lifestyle-river-types";
import type { HearstOnboardingResult } from "@/components/hearst-plus/onboarding-modal";
import { cn } from "@/lib/utils";

type DelishClub = {
  id: string;
  name: string;
  description: string;
  matchTags: string[];
  members: string;
  prompt: string;
  Icon: typeof ChefHat;
};

type DelishClubsModuleProps = {
  profile: LifestyleRiverProfile;
  onboardingResult?: HearstOnboardingResult | null;
};

type DelishClubState = {
  joinedClubIds: string[];
};

const delishClubStateKey = "hearst-delish-clubs-v1";

function getDelishGroupHref(clubId: string) {
  return clubId === "italian-weeknights"
    ? "/communities/delish/groups/italian-weeknights/"
    : "/communities/delish/";
}

const delishClubs: DelishClub[] = [
  {
    id: "italian-weeknights",
    name: "Italian Weeknights",
    description:
      "Pantry pastas, red sauce questions, and dinners that still happen after a long day.",
    matchTags: [
      "italian",
      "pasta",
      "spaghetti",
      "homemade pasta",
      "risotto",
      "quick dinners",
    ],
    members: "18.4K cooks",
    prompt: "What sauce saves dinner when time is short?",
    Icon: ChefHat,
  },
  {
    id: "taco-night",
    name: "Taco Night",
    description:
      "Fillings, salsas, sheet-pan shortcuts, and sides for the next tray on the table.",
    matchTags: [
      "mexican",
      "taco",
      "burrito",
      "global street food",
      "family-friendly",
    ],
    members: "14.1K cooks",
    prompt: "What always belongs on your taco tray?",
    Icon: Flame,
  },
  {
    id: "baking-club",
    name: "Baking Club",
    description:
      "Cookie swaps, cake saves, weekend bakes, and the fixes people actually tried.",
    matchTags: ["baking", "desserts", "bowl with spoon", "project", "both"],
    members: "21.7K bakers",
    prompt: "What bake is worth repeating?",
    Icon: Star,
  },
  {
    id: "healthy-meal-prep",
    name: "Healthy Meal Prep",
    description:
      "Prepable lunches, high-protein dinners, and the tricks that keep leftovers useful.",
    matchTags: [
      "healthy meals",
      "healthy",
      "high-protein",
      "vegetarian",
      "vegan",
      "plant-based meals",
    ],
    members: "11.9K cooks",
    prompt: "What prep habit makes the week easier?",
    Icon: Heart,
  },
  {
    id: "global-supper-club",
    name: "Global Supper Club",
    description:
      "Thai curry notes, tapas boards, Korean BBQ ideas, and favorite dishes to try next.",
    matchTags: [
      "thai",
      "korean bbq",
      "indian curry",
      "tapas",
      "mediterranean",
      "global street food",
    ],
    members: "9.8K cooks",
    prompt: "What dish should be on the next table?",
    Icon: GlobeHemisphereEast,
  },
];

function readDelishClubState(): DelishClubState {
  if (typeof window === "undefined") {
    return {
      joinedClubIds: [] as string[],
    };
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(delishClubStateKey) ?? "{}",
    );
    return {
      joinedClubIds: Array.isArray(parsed.joinedClubIds)
        ? parsed.joinedClubIds.filter(Boolean)
        : [],
    };
  } catch {
    return {
      joinedClubIds: [] as string[],
    };
  }
}

function writeDelishClubState(state: DelishClubState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(delishClubStateKey, JSON.stringify(state));
}

function normalizeSignal(value: string) {
  return value.trim().toLowerCase();
}

function getRecommendedClubs(
  profile: LifestyleRiverProfile,
  onboardingResult?: HearstOnboardingResult | null,
) {
  const signals = new Set(
    [
      ...profile.followedTopics,
      ...profile.savedTags,
      ...profile.boostedTags,
      ...(onboardingResult?.interests ?? []),
      ...(onboardingResult?.tags ?? []),
    ].map(normalizeSignal),
  );

  return [...delishClubs]
    .map((club, index) => ({
      club,
      index,
      score: club.matchTags.reduce(
        (score, tag) => score + (signals.has(normalizeSignal(tag)) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map((item) => item.club);
}

export function DelishClubsModule({
  profile,
  onboardingResult,
}: DelishClubsModuleProps) {
  const [state, setState] = React.useState(readDelishClubState);
  const recommendedClubs = React.useMemo(
    () => getRecommendedClubs(profile, onboardingResult),
    [onboardingResult, profile],
  );
  const featuredClub = recommendedClubs[0] ?? delishClubs[0];
  const FeaturedIcon = featuredClub.Icon;
  const featuredJoined = state.joinedClubIds.includes(featuredClub.id);

  const updateState = React.useCallback((nextState: DelishClubState) => {
    setState(nextState);
    writeDelishClubState(nextState);
  }, []);

  const toggleClub = (clubId: string) => {
    const alreadyJoined = state.joinedClubIds.includes(clubId);
    const joinedClubIds = alreadyJoined
      ? state.joinedClubIds.filter((id) => id !== clubId)
      : [...state.joinedClubIds, clubId];

    updateState({ ...state, joinedClubIds });
  };

  return (
    <section
      className="@container overflow-hidden rounded-[8px] border border-[var(--delish-club-border)] bg-[var(--delish-club-shell)] text-[var(--delish-club-ink)] shadow-[var(--hp-shadow-card)]"
      aria-labelledby="delish-clubs-title"
      style={
        {
          "--delish-club-shell": "#F8F9FB",
          "--delish-club-surface": "#FFFFFF",
          "--delish-club-ink": "#101828",
          "--delish-club-muted": "#5A6472",
          "--delish-club-red": "#EF3B35",
          "--delish-club-red-dark": "#D92731",
          "--delish-club-red-soft": "#FFF5F4",
          "--delish-club-border": "#D6DDE6",
          "--delish-club-border-strong": "#AEB7C3",
        } as React.CSSProperties
      }
    >
      <div className="grid gap-5 p-4 sm:p-5 @3xl:grid-cols-[minmax(0,1fr)_minmax(240px,0.5fr)] @3xl:items-start">
        <div>
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
            Delish Groups
          </p>
          <h2
            id="delish-clubs-title"
            className="mt-1 text-2xl font-black leading-tight text-[var(--delish-club-ink)]"
          >
            Pull up a kitchen table.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--delish-club-muted)]">
            One recommended group based on your Delish picks. Open it when
            you want the full discussion.
          </p>

          <article
            className={cn(
              "mt-5 rounded-[8px] border bg-[var(--delish-club-surface)] p-4 transition-colors",
              featuredJoined
                ? "border-[var(--delish-club-red)]"
                : "border-[var(--delish-club-border)]",
            )}
          >
            <div className="flex flex-col gap-4 @sm:flex-row @sm:items-start">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
                <FeaturedIcon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black leading-tight text-[var(--delish-club-ink)]">
                    {featuredClub.name}
                  </h3>
                  {featuredJoined ? (
                    <span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-[var(--delish-club-red)] bg-[var(--delish-club-red-soft)] px-2 text-xs font-bold text-[var(--delish-club-red)]">
                      <Check className="size-3.5" aria-hidden />
                      Joined
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--delish-club-muted)]">
                  {featuredClub.description}
                </p>
                <p className="mt-3 text-xs font-bold text-[var(--delish-club-muted)]">
                  {featuredClub.members}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--delish-club-border)] pt-4">
              <Button
                type="button"
                size="sm"
                variant={featuredJoined ? "outline" : "default"}
                onClick={() => toggleClub(featuredClub.id)}
                aria-pressed={featuredJoined}
                className={cn(
                  featuredJoined
                    ? "border-[var(--delish-club-red)] bg-white text-[var(--delish-club-red)] hover:bg-[#FFF5F4]"
                    : "bg-[var(--delish-club-red)] text-white hover:bg-[var(--delish-club-red-dark)]",
                )}
              >
                {featuredJoined ? "Joined" : "Join group"}
              </Button>
              <Link
                href={getDelishGroupHref(featuredClub.id)}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "border-[var(--delish-club-red)] bg-white text-[var(--delish-club-red)] hover:bg-[#FFF5F4] hover:text-[var(--delish-club-red-dark)]",
                })}
              >
                Open group
              </Link>
            </div>
          </article>
        </div>

        <aside className="rounded-[8px] border border-[var(--delish-club-border)] bg-[var(--delish-club-surface)] p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
              <MessageCircle className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                Today&apos;s prompt
              </p>
              <h3 className="mt-2 text-lg font-black leading-tight text-[var(--delish-club-ink)]">
                {featuredClub.prompt}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--delish-club-muted)]">
                The full thread, recipes, and weekly ideas live inside the
                group page.
              </p>
              <Link
                href={getDelishGroupHref(featuredClub.id)}
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className:
                    "mt-4 bg-[var(--delish-club-red)] text-white hover:bg-[var(--delish-club-red-dark)]",
                })}
              >
                Answer prompt
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
