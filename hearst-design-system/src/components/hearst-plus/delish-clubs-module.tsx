"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarBlank,
  Camera,
  Check,
  ChefHat,
  Flame,
  GlobeHemisphereEast,
  Heart,
  MessageCircle,
  Star,
  ThumbsUp,
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

type DelishChallenge = {
  id: string;
  title: string;
  description: string;
  options: string[];
};

type DelishClubTab = "discussion" | "recipes" | "challenges";

type DelishClubsModuleProps = {
  profile: LifestyleRiverProfile;
  onboardingResult?: HearstOnboardingResult | null;
};

type DelishClubState = {
  joinedClubIds: string[];
  votedOption: string;
  recipeTitle: string;
  recipeNote: string;
  recipeSubmitted: boolean;
};

const delishClubStateKey = "hearst-delish-clubs-v1";

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

const weeklyChallenge: DelishChallenge = {
  id: "five-ingredient-dinner",
  title: "5-Ingredient Dinner Challenge",
  description: "Vote for the recipe idea you would actually cook this week.",
  options: [
    "Lemon chicken skillet",
    "Creamy tomato pasta",
    "Crispy bean tacos",
  ],
};

const clubTabs: { id: DelishClubTab; label: string }[] = [
  { id: "discussion", label: "Discussion" },
  { id: "recipes", label: "Recipes" },
  { id: "challenges", label: "Challenges" },
];

function readDelishClubState(): DelishClubState {
  if (typeof window === "undefined") {
    return {
      joinedClubIds: [] as string[],
      votedOption: "",
      recipeTitle: "",
      recipeNote: "",
      recipeSubmitted: false,
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
      votedOption:
        typeof parsed.votedOption === "string" ? parsed.votedOption : "",
      recipeTitle:
        typeof parsed.recipeTitle === "string" ? parsed.recipeTitle : "",
      recipeNote:
        typeof parsed.recipeNote === "string" ? parsed.recipeNote : "",
      recipeSubmitted: Boolean(parsed.recipeSubmitted),
    };
  } catch {
    return {
      joinedClubIds: [] as string[],
      votedOption: "",
      recipeTitle: "",
      recipeNote: "",
      recipeSubmitted: false,
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
  const [recipeFormOpen, setRecipeFormOpen] = React.useState(false);
  const [activeClubId, setActiveClubId] = React.useState("");
  const [activeClubTab, setActiveClubTab] =
    React.useState<DelishClubTab>("discussion");
  const [clubTableOpen, setClubTableOpen] = React.useState(false);
  const [postDraft, setPostDraft] = React.useState("");
  const recommendedClubs = React.useMemo(
    () => getRecommendedClubs(profile, onboardingResult),
    [onboardingResult, profile],
  );
  const featuredClub = recommendedClubs[0] ?? delishClubs[0];
  const secondaryClubs = recommendedClubs.slice(1);
  const FeaturedIcon = featuredClub.Icon;
  const featuredJoined = state.joinedClubIds.includes(featuredClub.id);
  const joinedClubs = React.useMemo(
    () => delishClubs.filter((club) => state.joinedClubIds.includes(club.id)),
    [state.joinedClubIds],
  );
  const activeClub =
    joinedClubs.find((club) => club.id === activeClubId) ?? joinedClubs[0];

  const updateState = React.useCallback((nextState: DelishClubState) => {
    setState(nextState);
    writeDelishClubState(nextState);
  }, []);

  const toggleClub = (clubId: string) => {
    const alreadyJoined = state.joinedClubIds.includes(clubId);
    const joinedClubIds = alreadyJoined
      ? state.joinedClubIds.filter((id) => id !== clubId)
      : [...state.joinedClubIds, clubId];

    if (!alreadyJoined) {
      setActiveClubId(clubId);
      setActiveClubTab("discussion");
      setClubTableOpen(false);
    } else if (activeClubId === clubId) {
      setActiveClubId(joinedClubIds[0] ?? "");
      if (joinedClubIds.length === 0) setClubTableOpen(false);
    }

    updateState({ ...state, joinedClubIds });
  };

  const submitRecipe = () => {
    updateState({
      ...state,
      recipeTitle: state.recipeTitle.trim(),
      recipeNote: state.recipeNote.trim(),
      recipeSubmitted: Boolean(state.recipeTitle.trim()),
    });
    if (state.recipeTitle.trim()) setRecipeFormOpen(false);
  };

  return (
    <section
      className="overflow-hidden rounded-[8px] border border-[var(--delish-club-border)] bg-[var(--delish-club-shell)] text-[var(--delish-club-ink)] shadow-[var(--hp-shadow-card)]"
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
      <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.72fr)]">
        <div className="border-b border-[var(--delish-club-border)] p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                Delish Clubs
              </p>
              <h2
                id="delish-clubs-title"
                className="mt-1 text-2xl font-black leading-tight text-[var(--delish-club-ink)]"
              >
                Pull up a kitchen table.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--delish-club-muted)]">
                Based on your Delish picks, start with one table and keep the
                rest close by.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant={recipeFormOpen ? "secondary" : "outline"}
              onClick={() => setRecipeFormOpen((open) => !open)}
              className="border-[var(--delish-club-red)] bg-white text-[var(--delish-club-red)] hover:bg-[#FFF5F4] hover:text-[var(--delish-club-red-dark)]"
            >
              <Camera className="size-4" aria-hidden />
              Share recipe
            </Button>
          </div>

          <div
            className={cn(
              "mt-5 rounded-[8px] border p-4 transition-colors",
              featuredJoined
                ? "border-[var(--delish-club-red)] bg-[var(--delish-club-red-soft)]"
                : "border-[var(--delish-club-border)] bg-[var(--delish-club-surface)]",
            )}
          >
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
                <FeaturedIcon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black leading-tight text-[var(--delish-club-ink)]">
                    {featuredClub.name}
                  </h3>
                  {featuredJoined ? (
                    <span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-[var(--delish-club-red)] bg-white px-2 text-xs font-bold text-[var(--delish-club-red)]">
                      <Check className="size-3.5" aria-hidden />
                      Joined
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--delish-club-muted)]">
                  {featuredClub.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--delish-club-border)] pt-3">
                  <p className="flex min-w-0 items-center gap-2 text-sm font-bold text-[var(--delish-club-ink)]">
                    <MessageCircle
                      className="size-4 shrink-0 text-[var(--delish-club-red)]"
                      aria-hidden
                    />
                    {featuredClub.prompt}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--delish-club-muted)]">
                      {featuredClub.members}
                    </span>
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
                      {featuredJoined ? "Leave" : "Join"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {secondaryClubs.length > 0 ? (
            <div className="mt-3 divide-y divide-[var(--delish-club-border)] rounded-[8px] border border-[var(--delish-club-border)] bg-[var(--delish-club-surface)]">
              {secondaryClubs.map((club) => {
                const joined = state.joinedClubIds.includes(club.id);
                const ClubIcon = club.Icon;

                return (
                  <div key={club.id} className="flex items-center gap-3 p-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
                      <ClubIcon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-snug text-[var(--delish-club-ink)]">
                        {club.name}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[var(--delish-club-muted)]">
                        {club.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={joined ? "outline" : "ghost"}
                      onClick={() => toggleClub(club.id)}
                      aria-pressed={joined}
                      className={cn(
                        "shrink-0",
                        joined
                          ? "border-[var(--delish-club-red)] bg-white text-[var(--delish-club-red)] hover:bg-[#FFF5F4]"
                          : "text-[var(--delish-club-red)] hover:bg-[var(--delish-club-red-soft)] hover:text-[var(--delish-club-red-dark)]",
                      )}
                    >
                      {joined ? "Joined" : "Join"}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <aside className="grid gap-4 bg-[var(--delish-club-shell)] p-4 sm:p-5">
          <article className="border-b border-[var(--delish-club-border)] pb-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
                <CalendarBlank className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                  Weekly challenge
                </p>
                <h3 className="mt-1 text-lg font-black leading-tight text-[var(--delish-club-ink)]">
                  {weeklyChallenge.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[var(--delish-club-muted)]">
                  {weeklyChallenge.description}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {weeklyChallenge.options.map((option) => {
                const selected = state.votedOption === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      updateState({ ...state, votedOption: option })
                    }
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-3 rounded-[8px] border px-3 py-2 text-left text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--delish-club-red)]/25",
                      selected
                        ? "border-[var(--delish-club-red)] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-ink)]"
                        : "border-[var(--delish-club-border)] bg-[var(--delish-club-surface)] text-[var(--delish-club-ink)] hover:border-[var(--delish-club-border-strong)]",
                    )}
                    aria-pressed={selected}
                  >
                    <span>{option}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs",
                        selected
                          ? "text-[var(--delish-club-red)]"
                          : "text-[var(--delish-club-muted)]",
                      )}
                    >
                      <ThumbsUp
                        className="size-4 text-[var(--delish-club-red)]"
                        aria-hidden
                      />
                      {selected ? "Your vote" : "Vote"}
                    </span>
                  </button>
                );
              })}
            </div>
          </article>

          <article>
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
                <Camera className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                  Share with Delish
                </p>
                <h3 className="mt-1 text-lg font-black leading-tight text-[var(--delish-club-ink)]">
                  {state.recipeSubmitted
                    ? "Recipe idea saved."
                    : "Bring a dish."}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[var(--delish-club-muted)]">
                  Add a recipe or short-video idea. Publishing would wait for
                  moderation.
                </p>
              </div>
            </div>

            {recipeFormOpen ? (
              <div className="mt-4 grid gap-3">
                <Input
                  size="lg"
                  label="Recipe title"
                  value={state.recipeTitle}
                  onChange={(event) =>
                    updateState({
                      ...state,
                      recipeTitle: event.target.value,
                      recipeSubmitted: false,
                    })
                  }
                  placeholder="Spicy rigatoni bake"
                />
                <Textarea
                  value={state.recipeNote}
                  onChange={(event) =>
                    updateState({
                      ...state,
                      recipeNote: event.target.value,
                      recipeSubmitted: false,
                    })
                  }
                  placeholder="What makes it worth sharing?"
                  className="min-h-24 rounded-[8px] border-[var(--delish-club-border-strong)] bg-white text-sm text-[var(--delish-club-ink)] focus-visible:border-[var(--delish-club-red)] focus-visible:ring-[var(--delish-club-red)]/10"
                />
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRecipeFormOpen(false)}
                  >
                    Not now
                  </Button>
                  <Button
                    type="button"
                    onClick={submitRecipe}
                    disabled={!state.recipeTitle.trim()}
                    className="bg-[var(--delish-club-red)] text-white hover:bg-[var(--delish-club-red-dark)]"
                  >
                    Save idea
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--delish-club-border)] pt-3">
                <p className="text-xs leading-5 text-[var(--delish-club-muted)]">
                  {state.recipeSubmitted && state.recipeTitle
                    ? `${state.recipeTitle} is saved locally for this prototype.`
                    : "Start with the dish. Photo and video upload can come after moderation rules are set."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRecipeFormOpen(true)}
                  className="border-[var(--delish-club-red)] bg-white text-[var(--delish-club-red)] hover:bg-[#FFF5F4] hover:text-[var(--delish-club-red-dark)]"
                >
                  {state.recipeSubmitted ? "Edit idea" : "Add idea"}
                </Button>
              </div>
            )}
          </article>
        </aside>
      </div>

      {activeClub ? (
        <div className="border-t border-[var(--delish-club-border)] bg-[var(--delish-club-surface)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                  Club table
                </p>
                <h3 className="mt-0.5 truncate text-base font-black leading-tight text-[var(--delish-club-ink)]">
                  {activeClub.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs leading-5 text-[var(--delish-club-muted)]">
                  Discussions, recipes, and challenges for the clubs you joined.
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setClubTableOpen((open) => !open)}
              className="border-[var(--delish-club-red)] bg-white text-[var(--delish-club-red)] hover:bg-[#FFF5F4] hover:text-[var(--delish-club-red-dark)]"
              aria-expanded={clubTableOpen}
            >
              {clubTableOpen ? "Hide club table" : "Open club table"}
            </Button>
          </div>

          {clubTableOpen ? (
            <>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-sm leading-6 text-[var(--delish-club-muted)]">
                    A starter forum for the cooks in this club: prompts, recipe
                    ideas, and small weekly challenges.
                  </p>
                </div>
                {joinedClubs.length > 1 ? (
                  <div className="flex max-w-full flex-wrap gap-2">
                    {joinedClubs.map((club) => (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() => setActiveClubId(club.id)}
                        className={cn(
                          "min-h-9 rounded-full border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--delish-club-red)]/25",
                          club.id === activeClub.id
                            ? "border-[var(--delish-club-red)] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]"
                            : "border-[var(--delish-club-border)] bg-white text-[var(--delish-club-muted)] hover:border-[var(--delish-club-border-strong)] hover:text-[var(--delish-club-ink)]",
                        )}
                        aria-pressed={club.id === activeClub.id}
                      >
                        {club.name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-b border-[var(--delish-club-border)]">
                {clubTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveClubTab(tab.id)}
                    className={cn(
                      "min-h-10 border-b-2 px-1 text-sm font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--delish-club-red)]/25",
                      activeClubTab === tab.id
                        ? "border-[var(--delish-club-red)] text-[var(--delish-club-red)]"
                        : "border-transparent text-[var(--delish-club-muted)] hover:text-[var(--delish-club-ink)]",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="rounded-[8px] border border-[var(--delish-club-border)] bg-white p-4">
                  {activeClubTab === "discussion" ? (
                    <div className="grid gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                          Today&apos;s prompt
                        </p>
                        <h4 className="mt-1 text-lg font-black leading-tight text-[var(--delish-club-ink)]">
                          {activeClub.prompt}
                        </h4>
                      </div>

                      <div className="grid gap-3">
                        {[
                          {
                            author: "Maya",
                            title:
                              "I keep a freezer tray of sauce cubes for late nights.",
                            meta: "24 replies",
                          },
                          {
                            author: "Jo",
                            title:
                              "What is your fastest dinner that still feels like a real meal?",
                            meta: "12 replies",
                          },
                          {
                            author: "Delish editors",
                            title: `The ${activeClub.name} starter thread: show us what is on your table.`,
                            meta: "Pinned",
                          },
                        ].map((thread) => (
                          <article
                            key={thread.title}
                            className="rounded-[8px] border border-[var(--delish-club-border)] bg-[var(--delish-club-shell)] p-3"
                          >
                            <div className="flex items-start gap-3">
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--delish-club-red)] text-sm font-black text-white">
                                {thread.author.slice(0, 1)}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[var(--delish-club-muted)]">
                                  {thread.author}
                                </p>
                                <h5 className="mt-0.5 text-sm font-black leading-5 text-[var(--delish-club-ink)]">
                                  {thread.title}
                                </h5>
                                <p className="mt-1 text-xs font-bold text-[var(--delish-club-red)]">
                                  {thread.meta}
                                </p>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeClubTab === "recipes" ? (
                    <div className="grid gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                          Recipe board
                        </p>
                        <h4 className="mt-1 text-lg font-black leading-tight text-[var(--delish-club-ink)]">
                          Saved ideas from the club
                        </h4>
                      </div>
                      {[
                        "One-pan weeknight dinner",
                        "The sauce everyone asks for",
                        state.recipeSubmitted && state.recipeTitle
                          ? state.recipeTitle
                          : "Reader-submitted short video idea",
                      ].map((recipe, index) => (
                        <article
                          key={`${recipe}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-[8px] border border-[var(--delish-club-border)] bg-[var(--delish-club-shell)] p-3"
                        >
                          <div>
                            <h5 className="text-sm font-black leading-5 text-[var(--delish-club-ink)]">
                              {recipe}
                            </h5>
                            <p className="mt-1 text-xs text-[var(--delish-club-muted)]">
                              {index === 2
                                ? "Waiting for moderation rules"
                                : "Ready for comments and saves"}
                            </p>
                          </div>
                          <Camera
                            className="size-4 shrink-0 text-[var(--delish-club-red)]"
                            aria-hidden
                          />
                        </article>
                      ))}
                    </div>
                  ) : null}

                  {activeClubTab === "challenges" ? (
                    <div className="grid gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--delish-club-red)]">
                          This week
                        </p>
                        <h4 className="mt-1 text-lg font-black leading-tight text-[var(--delish-club-ink)]">
                          {weeklyChallenge.title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-[var(--delish-club-muted)]">
                          Vote, cook, then come back with a photo or quick note.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {weeklyChallenge.options.map((option) => (
                          <div
                            key={option}
                            className={cn(
                              "rounded-[8px] border px-3 py-2 text-sm font-bold",
                              state.votedOption === option
                                ? "border-[var(--delish-club-red)] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-ink)]"
                                : "border-[var(--delish-club-border)] bg-[var(--delish-club-shell)] text-[var(--delish-club-muted)]",
                            )}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <aside className="rounded-[8px] border border-[var(--delish-club-border)] bg-[var(--delish-club-shell)] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--delish-club-red-soft)] text-[var(--delish-club-red)]">
                      <MessageCircle className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h4 className="text-base font-black leading-tight text-[var(--delish-club-ink)]">
                        Start a post
                      </h4>
                      <p className="mt-1 text-xs leading-5 text-[var(--delish-club-muted)]">
                        Prototype only. A real version would require accounts,
                        moderation, and reporting.
                      </p>
                    </div>
                  </div>
                  <Textarea
                    value={postDraft}
                    onChange={(event) => setPostDraft(event.target.value)}
                    placeholder={`Ask ${activeClub.name} a question`}
                    className="mt-4 min-h-24 rounded-[8px] border-[var(--delish-club-border-strong)] bg-white text-sm text-[var(--delish-club-ink)] focus-visible:border-[var(--delish-club-red)] focus-visible:ring-[var(--delish-club-red)]/10"
                  />
                  <Button
                    type="button"
                    className="mt-3 w-full bg-[var(--delish-club-red)] text-white hover:bg-[var(--delish-club-red-dark)]"
                    disabled={!postDraft.trim()}
                    onClick={() => setPostDraft("")}
                  >
                    Post to club
                  </Button>
                </aside>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
