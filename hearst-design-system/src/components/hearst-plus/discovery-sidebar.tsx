"use client";

import React from "react";
import { ChevronDown } from "@/components/ui/icons";
import type {
  LifestyleRiverProfile,
  LifestyleRiverStory,
} from "@/components/lifestyle-river-types";
import { cn } from "@/lib/utils";
import { BrandSourceIcon } from "./brand-source-icon";
import { CommunityJoinedGroupsCard } from "./community-joined-groups-card";
import { getLifestyleByline } from "./story-metadata";
import { TrendingStoryRail } from "./trending-rail";
import {
  communityGroups,
} from "@/lib/community-groups";

export type AutosOemFilterOption = {
  name: string;
  count: number;
  logo: string;
};

export interface LifestyleDiscoverySidebarProps {
  profile: LifestyleRiverProfile;
  topStories: LifestyleRiverStory[];
  savedStories?: LifestyleRiverStory[];
  trendingStories?: LifestyleRiverStory[];
  topics: { name: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
  brandFilterTitle?: string;
  communityBrandSlug?: string;
  brandFilterFirst?: boolean;
  showBrandCounts?: boolean;
  globalInventory?: boolean;
  activeBrandFilters: string[];
  autosOemOptions?: AutosOemFilterOption[];
  activeAutosOemFilters?: string[];
  collectionLabels: string[];
  onToggleBrandFilter: (brandName: string) => void;
  onToggleAutosOemFilter?: (makeName: string) => void;
  onClearAutosOemFilters?: () => void;
  onFollowTopic: (topic: string) => void;
  onOpenStory: (story: LifestyleRiverStory) => void;
}

interface DiscoverySidebarCardProps {
  title: string;
  summary: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  mobileActionLabel?: string;
  onMobileAction?: () => void;
}

/**
 * Shared card used by the production discovery sidebar.
 *
 * The sidebar is desktop-only today, but the card keeps its existing compact
 * disclosure behavior so the same production contract can support a future
 * responsive placement without parallel markup.
 */
export function DiscoverySidebarCard({
  title,
  summary,
  children,
  className,
  defaultOpen = false,
  mobileActionLabel,
  onMobileAction,
}: DiscoverySidebarCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]",
        className,
      )}
    >
      <div className="hidden lg:block">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
          {title}
        </p>
      </div>
      <div className="flex min-h-11 min-w-0 items-stretch gap-3 lg:hidden">
        <button
          type="button"
          className="min-h-11 min-w-0 flex-1 overflow-hidden text-left"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            {title}
          </span>
          <span className="mt-1 line-clamp-2 block max-w-full break-words text-xs font-normal normal-case tracking-normal text-muted-foreground lg:hidden">
            {summary}
          </span>
        </button>
        {mobileActionLabel && onMobileAction ? (
          <button
            type="button"
            onClick={onMobileAction}
            className="min-h-11 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))] transition-colors hover:text-[var(--hp-text-primary)] focus-visible:text-[var(--hp-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {mobileActionLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]"
          aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
          aria-expanded={open}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>
      <div className={cn("mt-4 lg:block", open ? "block" : "hidden")}>
        {children}
      </div>
    </section>
  );
}

/**
 * Production Hearst+ discovery sidebar.
 *
 * This is the source rendered by destination, publication, Autos, and video
 * routes. Storybook imports the same component so its state matrix remains a
 * specification of production rather than a parallel mock.
 */
export function LifestyleDiscoverySidebar({
  profile,
  topStories,
  savedStories: savedStoryInventory = topStories,
  trendingStories,
  brands,
  brandFilterTitle = "Join Groups",
  communityBrandSlug,
  brandFilterFirst = false,
  showBrandCounts = true,
  globalInventory = false,
  activeBrandFilters,
  onToggleBrandFilter,
  onOpenStory,
}: LifestyleDiscoverySidebarProps) {
  const brandStoryCount = brands.reduce(
    (total, brand) => total + brand.count,
    0,
  );
  const isBrandCommunityModule =
    brandFilterTitle === "Join Groups" || brandFilterTitle === "Join Communities";
  const communityBrand = communityBrandSlug
    ? brands.find((brand) => brand.slug === communityBrandSlug)
    : undefined;
  const isSingleBrandCommunityModule =
    isBrandCommunityModule && Boolean(communityBrand);
  const visibleBrands = isSingleBrandCommunityModule
    ? communityBrand
      ? [communityBrand]
      : []
    : brands;
  const brandSummary = isSingleBrandCommunityModule
    ? activeBrandFilters.includes(communityBrand?.name ?? "")
      ? "Joined"
      : "One brand community"
    : isBrandCommunityModule
    ? activeBrandFilters.length > 0
      ? `${activeBrandFilters.length} joined`
      : `${brands.length} brand groups`
    : !showBrandCounts
      ? `${brands.length} brands`
      : globalInventory
        ? `${brands.length} brands · ${brandStoryCount} stories`
        : activeBrandFilters.length > 0
          ? activeBrandFilters[0]
          : `All brands · ${brandStoryCount} stories`;
  const communityGroupItems = communityGroups
    .flatMap((group) => {
      if (communityBrandSlug && group.brandSlug !== communityBrandSlug) return [];
      const brand = brands.find((item) => item.slug === group.brandSlug);
      return brand
        ? [{
            brand: brand.name,
            brandSlug: group.brandSlug,
            groupSlug: group.groupSlug,
            name: group.name,
            members: group.members,
          }]
        : [];
    })
    .slice(0, 3);
  const savedStories = savedStoryInventory
    .filter((story) => profile.savedIds.includes(story.id))
    .slice(0, 3);
  const dailyHabitModule = trendingStories ? (
    <TrendingStoryRail
      stories={trendingStories.slice(0, 3)}
      onOpenStory={onOpenStory}
      title="Trending Across Brands"
      className="hidden lg:block"
    />
  ) : (
    <DiscoverySidebarCard
      title="Your Daily Habit"
      summary={topStories[0]?.title || "Top stories ready"}
      className="hidden lg:block"
    >
      <div className="space-y-3">
        {topStories.slice(0, 3).map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => onOpenStory(story)}
            data-story-module="daily-habit"
            data-story-id={story.id}
            className="group block w-full border-b border-border pb-3 text-left last:border-0 last:pb-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label={`Open story: ${story.title}`}
          >
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              {story.topic}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
              {story.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {story.brand} · {getLifestyleByline(story)} · Popularity{" "}
              {story.popularity}
            </p>
          </button>
        ))}
      </div>
    </DiscoverySidebarCard>
  );

  const brandFilterModule = isBrandCommunityModule ? (
    <CommunityJoinedGroupsCard groups={communityGroupItems} />
  ) : (
    <DiscoverySidebarCard
      title={brandFilterTitle}
      summary={brandSummary}
    >
      <div
        className={cn(
          "mt-4",
          "space-y-3",
        )}
      >{visibleBrands.map((brand) => {
          const active = activeBrandFilters.includes(brand.name);
          return (
            <button
              key={brand.name}
              type="button"
              onClick={() => onToggleBrandFilter(brand.name)}
              disabled={brand.count === 0}
              className={cn(
                "flex w-full min-w-0 items-center justify-between gap-3 border-b border-border pb-2 text-left text-sm transition-colors last:border-0 last:pb-0",
                active &&
                  "font-bold text-primary",
                brand.count === 0 &&
                  "cursor-not-allowed text-muted-foreground opacity-70",
              )}
              aria-pressed={active}
              aria-label={`${active ? "Leave" : "Join"} ${brand.name} group`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <BrandSourceIcon
                  brand={brand.name}
                  brandSlug={brand.slug}
                  className={cn(
                    "h-5 w-5 rounded-[4px]",
                    active
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border",
                  )}
                />
                <span className="min-w-0 truncate">{brand.name}</span>
              </span>
              {showBrandCounts ? (
                <span className="text-xs text-muted-foreground">
                  {brand.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {globalInventory
            ? "Complete section inventory. Select a brand to open its publication."
            : activeBrandFilters.length > 0
              ? `Showing ${activeBrandFilters[0]}.`
              : "All brands are included in the river."}
      </p>
    </DiscoverySidebarCard>
  );

  const savedItemsModule = savedStories.length > 0 ? (
    <TrendingStoryRail
      stories={savedStories}
      onOpenStory={onOpenStory}
      title="Saved items"
    />
  ) : (
    <DiscoverySidebarCard title="Saved items" summary="Your saved stories">
      <p className="text-sm leading-6 text-muted-foreground">
        Save stories as you browse and they will appear here.
      </p>
    </DiscoverySidebarCard>
  );

  return (
    <aside
      className="hidden min-w-0 space-y-5 lg:sticky lg:top-[108px] lg:block lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1"
      aria-label="Lifestyle discovery sidebar"
    >
      {brandFilterFirst ? brandFilterModule : dailyHabitModule}
      {brandFilterFirst ? dailyHabitModule : brandFilterModule}
      {savedItemsModule}
    </aside>
  );
}
