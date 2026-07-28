"use client";

import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { LiveStoryBadge } from "@/components/hearst-plus/story-metadata";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  EyeOff,
  MessageCircle,
  Plus,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export const quietStoryActionButtonClass =
  "min-h-11 min-w-11 border-0 bg-transparent px-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-primary focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/30 sm:min-h-6 sm:min-w-0";

export type LifestyleStoryActionsProps = {
  story: LifestyleRiverStory;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
  onHide: () => void;
};

function getAdjacentStoryOpener(
  actionGroup: HTMLDivElement | null
): HTMLElement | null {
  const currentCard = actionGroup?.closest<HTMLElement>(
    'article[data-story-module="river"]'
  );
  if (!currentCard) return null;

  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(
      'article[data-story-module="river"]'
    )
  );
  const currentIndex = cards.indexOf(currentCard);
  if (currentIndex < 0) return null;

  const adjacentCard = cards[currentIndex + 1] ?? cards[currentIndex - 1];
  return (
    adjacentCard?.querySelector<HTMLElement>(
      'button[aria-label^="Open story:"]'
    ) ?? null
  );
}

export function LifestyleStoryActions({
  story,
  saved,
  commentCount,
  onOpen,
  onSave,
  onMoreLikeThis,
  onHide,
}: LifestyleStoryActionsProps) {
  const actionGroupRef = React.useRef<HTMLDivElement | null>(null);
  const commentLabel = `${commentCount} ${
    commentCount === 1 ? "comment" : "comments"
  }`;

  const handleHide = () => {
    const adjacentOpener = getAdjacentStoryOpener(actionGroupRef.current);
    onHide();
    window.requestAnimationFrame(() => {
      if (adjacentOpener?.isConnected) adjacentOpener.focus();
    });
  };

  return (
    <div
      ref={actionGroupRef}
      role="group"
      aria-label={`Actions for ${story.title}`}
      data-story-actions
      className="relative z-20 mt-5 flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-5"
      onClick={(event) => event.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="xs"
        className={cn(
          quietStoryActionButtonClass,
          saved && "text-primary hover:text-primary"
        )}
        onClick={onSave}
        aria-label={saved ? "Remove from saved stories" : "Save story"}
        aria-pressed={saved}
      >
        <Bookmark
          className="h-3.5 w-3.5"
          weight={saved ? "fill" : "regular"}
          aria-hidden
        />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        className={quietStoryActionButtonClass}
        onClick={onMoreLikeThis}
        aria-label={`Show more stories like ${story.title}`}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        More like this
      </Button>
      <Button
        variant="ghost"
        size="xs"
        className={quietStoryActionButtonClass}
        onClick={onOpen}
        aria-label={`Open story with ${commentLabel}`}
      >
        <MessageCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden />
        {commentCount}
      </Button>
      <span className="inline-flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          className={quietStoryActionButtonClass}
          onClick={handleHide}
          aria-label={`Hide story: ${story.title}`}
        >
          <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Hide
        </Button>
        <LiveStoryBadge story={story} />
      </span>
    </div>
  );
}
