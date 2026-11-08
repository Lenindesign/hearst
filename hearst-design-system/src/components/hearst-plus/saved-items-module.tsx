"use client";

import React from "react";
import Image from "next/image";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { Button } from "@/components/ui/button";
import { Bookmark } from "@/components/ui/icons";
import { DiscoverySidebarCard } from "./discovery-sidebar";
import { TrendingStoryRail } from "./trending-rail";

export const SAVED_ITEMS_EMPTY_MESSAGE = "Save stories to build your reading list.";

export type SavedItemsModuleProps = {
  /** Saved stories resolved from the reader's account, already in display order. */
  savedStories: LifestyleRiverStory[];
  /** Ranked, unsaved, non-hidden suggestions shown only in the empty state. At most three render. */
  suggestions?: LifestyleRiverStory[];
  onOpenStory: (story: LifestyleRiverStory, context?: { suggestionPosition?: number }) => void;
  onSaveSuggestion?: (story: LifestyleRiverStory, position: number) => void;
  /** Omit when the reader is already on For You, where the action would do nothing. */
  onBrowseForYou?: () => void;
  title?: string;
  className?: string;
};

/**
 * Shared Saved Items sidebar module (APP_RULES: Saved Items uses the same
 * account-saved stories and empty state as the homepage). With saves it is the
 * ranked story rail; without saves it explains the module's value, offers
 * Browse For You and three suggestions with separate open and save actions.
 */
export function SavedItemsModule({
  savedStories,
  suggestions = [],
  onOpenStory,
  onSaveSuggestion,
  onBrowseForYou,
  title = "Saved Items",
  className,
}: SavedItemsModuleProps) {
  const titleIcon = <Bookmark className="h-4 w-4 shrink-0" aria-hidden />;

  if (savedStories.length > 0) {
    return (
      <TrendingStoryRail
        stories={savedStories.slice(0, 3)}
        onOpenStory={(story) => onOpenStory(story)}
        title={title}
        titleIcon={titleIcon}
        className={className}
      />
    );
  }

  const visibleSuggestions = suggestions.slice(0, 3);

  return (
    <DiscoverySidebarCard
      title={title}
      summary={SAVED_ITEMS_EMPTY_MESSAGE}
      titleIcon={titleIcon}
      className={className}
    >
      <div data-saved-items-state="empty">
        <p className="type-b2 hidden font-semibold text-[var(--hp-text-primary)] lg:block">
          {SAVED_ITEMS_EMPTY_MESSAGE}
        </p>
        {onBrowseForYou ? (
          <Button type="button" variant="outline" size="sm" className="mt-3 min-h-11 w-full rounded-[4px] sm:min-h-9" onClick={onBrowseForYou}>
            Browse For You
          </Button>
        ) : null}
        {visibleSuggestions.length > 0 ? (
          <div className="mt-4 border-t border-border pt-3">
            <p className="type-k1 text-muted-foreground">
              Suggested for you
            </p>
            <ul className="mt-1 divide-y divide-border/70">
              {visibleSuggestions.map((story, index) => (
                <li key={story.id} className="flex min-w-0 items-center gap-2 py-2">
                  <button
                    type="button"
                    onClick={() => onOpenStory(story, { suggestionPosition: index + 1 })}
                    className="group grid min-h-16 min-w-0 flex-1 grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-[6px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label={`Open suggested story: ${story.title}`}
                  >
                    <span className="relative block size-12 overflow-hidden rounded-[6px] bg-muted" aria-hidden>
                      <Image src={story.image} alt="" fill sizes="48px" className="object-cover" unoptimized />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 type-t6 underline-offset-2 group-hover:underline group-focus-visible:underline">
                        {story.title}
                      </span>
                      <span className="type-c1 mt-1 block truncate text-muted-foreground">{story.brand}</span>
                    </span>
                  </button>
                  {onSaveSuggestion ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="relative min-h-11 min-w-11 shrink-0 rounded-[4px] border-0 bg-transparent text-muted-foreground shadow-none hover:bg-muted/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 sm:min-h-8 sm:min-w-8"
                      aria-label={`Save suggested story: ${story.title}`}
                      title="Save story"
                      onClick={() => onSaveSuggestion(story, index + 1)}
                    >
                      <Bookmark className="size-4" aria-hidden />
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </DiscoverySidebarCard>
  );
}
