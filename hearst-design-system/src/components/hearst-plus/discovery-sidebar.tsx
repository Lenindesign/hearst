"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import type {
  LifestyleRiverProfile,
  LifestyleRiverStory,
} from "@/components/lifestyle-river-types";
import { cn } from "@/lib/utils";
import { BrandSourceIcon } from "./brand-source-icon";
import { getLifestyleByline } from "./story-metadata";

export type AutosOemFilterOption = {
  name: string;
  count: number;
  logo: string;
};

export interface LifestyleDiscoverySidebarProps {
  profile: LifestyleRiverProfile;
  topStories: LifestyleRiverStory[];
  topics: { name: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
  brandFilterTitle?: string;
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
      <div className={cn("mt-4 lg:block", open ? "block" : "hidden")}>{children}</div>
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
  topics,
  brands,
  brandFilterTitle = "Filter Brands",
  brandFilterFirst = false,
  showBrandCounts = true,
  globalInventory = false,
  activeBrandFilters,
  autosOemOptions = [],
  activeAutosOemFilters = [],
  collectionLabels,
  onToggleBrandFilter,
  onToggleAutosOemFilter,
  onClearAutosOemFilters,
  onFollowTopic,
  onOpenStory,
}: LifestyleDiscoverySidebarProps) {
  const activeTopicSummary = profile.followedTopics.slice(0, 3).join(", ");
  const brandStoryCount = brands.reduce((total, brand) => total + brand.count, 0);
  const brandSummary = !showBrandCounts
    ? `${brands.length} brands`
    : globalInventory
      ? `${brands.length} brands · ${brandStoryCount} stories`
      : activeBrandFilters.length > 0
        ? activeBrandFilters[0]
        : `All brands · ${brandStoryCount} stories`;
  const topicSummary = activeTopicSummary || `${topics.length} topics`;
  const collectionSummary = `${collectionLabels.length} collections`;
  const autosOemStoryCount = autosOemOptions.reduce((total, make) => total + make.count, 0);
  const autosOemSummary =
    activeAutosOemFilters.length > 0
      ? activeAutosOemFilters.join(", ")
      : `${autosOemOptions.length} makes · ${autosOemStoryCount} stories`;

  const dailyHabitModule = (
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
              {story.brand} · {getLifestyleByline(story)} · Popularity {story.popularity}
            </p>
          </button>
        ))}
      </div>
    </DiscoverySidebarCard>
  );

  const brandFilterModule = (
    <DiscoverySidebarCard
      title={brandFilterTitle}
      summary={brandSummary}
    >
      <div className="mt-4 space-y-3">
        {brands.map((brand) => {
          const active = activeBrandFilters.includes(brand.name);
          return (
            <button
              key={brand.name}
              type="button"
              onClick={() => onToggleBrandFilter(brand.name)}
              disabled={brand.count === 0}
              className={cn(
                "flex w-full min-w-0 items-center justify-between gap-3 border-b border-border pb-2 text-left text-sm transition-colors last:border-0 last:pb-0",
                active && "font-bold text-primary",
                brand.count === 0 && "cursor-not-allowed text-muted-foreground opacity-70",
              )}
              aria-pressed={active}
            >
              <span className="flex min-w-0 items-center gap-2">
                <BrandSourceIcon
                  brand={brand.name}
                  brandSlug={brand.slug}
                  className={cn(
                    "h-5 w-5 rounded-[4px]",
                    active ? "border-primary ring-2 ring-primary/20" : "border-border",
                  )}
                />
                <span className="min-w-0 truncate">{brand.name}</span>
              </span>
              {showBrandCounts ? (
                <span className="text-xs text-muted-foreground">{brand.count}</span>
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

  const autosOemFilterModule =
    autosOemOptions.length > 0 && onToggleAutosOemFilter ? (
      <DiscoverySidebarCard
        title="Filter by make"
        summary={autosOemSummary}
        mobileActionLabel={activeAutosOemFilters.length > 0 ? "Clear" : undefined}
        onMobileAction={
          activeAutosOemFilters.length > 0 ? onClearAutosOemFilters : undefined
        }
      >
        {activeAutosOemFilters.length > 0 && onClearAutosOemFilters ? (
          <div className="-mt-1 flex items-center justify-end">
            <button
              type="button"
              onClick={onClearAutosOemFilters}
              className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              Clear
            </button>
          </div>
        ) : null}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {autosOemOptions.map((make) => {
            const active = activeAutosOemFilters.includes(make.name);
            return (
              <button
                key={make.name}
                type="button"
                onClick={() => onToggleAutosOemFilter(make.name)}
                className={cn(
                  "group rounded-lg border border-border bg-background p-2 text-left transition-colors hover:border-primary/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30",
                  active && "border-primary bg-primary/10 text-primary ring-2 ring-primary/20",
                )}
                aria-pressed={active}
                aria-label={`Filter Autos stories by ${make.name}`}
              >
                <span className="relative flex h-12 items-center justify-center rounded-md bg-card">
                  <Image
                    src={make.logo}
                    alt=""
                    width={96}
                    height={32}
                    className="h-auto max-h-7 w-auto max-w-[86px] object-contain"
                    loading="lazy"
                    unoptimized
                  />
                </span>
                <span className="mt-2 flex items-center justify-between gap-2 text-xs font-bold">
                  <span className="min-w-0 truncate">{make.name}</span>
                  <span className="text-muted-foreground">{make.count}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Uses makes detected in the current Autos story inventory. Publication filters still
          control the story source.
        </p>
      </DiscoverySidebarCard>
    ) : null;

  return (
    <aside
      className="hidden min-w-0 space-y-5 lg:sticky lg:top-[108px] lg:block lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1"
      aria-label="Lifestyle discovery sidebar"
    >
      {brandFilterFirst ? brandFilterModule : dailyHabitModule}
      {brandFilterFirst ? dailyHabitModule : brandFilterModule}
      {autosOemFilterModule}

      <DiscoverySidebarCard
        title="Follow Topics"
        summary={topicSummary}
        className="hidden lg:block"
      >
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => {
            const active = profile.followedTopics.includes(topic.name);
            return (
              <Button
                key={topic.name}
                variant={active ? "default" : "outline"}
                size="xs"
                onClick={() => onFollowTopic(topic.name)}
                aria-pressed={active}
              >
                {topic.name}
              </Button>
            );
          })}
        </div>
      </DiscoverySidebarCard>

      <DiscoverySidebarCard
        title="Collections"
        summary={collectionSummary}
        className="hidden bg-muted/30 lg:block"
      >
        <div className="space-y-2 text-sm">
          {collectionLabels.map((label) => (
            <p key={label} className="font-bold">
              {label}
            </p>
          ))}
          <p className="text-xs text-[var(--hp-text-ui)]">
            Saved stories and more-like-this actions tune these collections over time.
          </p>
        </div>
      </DiscoverySidebarCard>
    </aside>
  );
}
