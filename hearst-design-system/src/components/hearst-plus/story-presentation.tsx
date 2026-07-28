"use client";

import React from "react";
import Image from "next/image";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { ChefHat, ShoppingBag, Star } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";
import {
  getLifestyleImagePosition,
  isYearMakeModelStory,
  type LifestyleCardKind,
} from "./story-presentation-model";

export {
  getLifestyleCardKind,
  getLifestyleImagePosition,
  getLifestyleKindLabel,
  isExplicitGalleryStory,
  isYearMakeModelStory,
  lifestyleDefaultLeadStoryId,
  storyHasPlayableVideo,
  type LifestyleCardKind,
} from "./story-presentation-model";

export function LifestyleRiverImage({
  story,
  className,
  priority = false,
}: {
  story: LifestyleRiverStory;
  className?: string;
  priority?: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const imageKey = `${story.id}-${story.image}`;
  const [loadedImageKey, setLoadedImageKey] = React.useState<string | null>(null);
  const loaded = loadedImageKey === imageKey;

  return (
    <Image
      key={imageKey}
      src={story.image}
      alt={`${story.brand}: ${story.title}`}
      width={1200}
      height={675}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 640px"
      className={cn(
        "min-w-0 bg-muted object-cover",
        prefersReducedMotion ? "" : "transition-opacity duration-300 ease-out",
        loaded || priority ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{ objectPosition: getLifestyleImagePosition(story) }}
      preload={priority}
      onLoad={() => setLoadedImageKey(imageKey)}
    />
  );
}

export function LifestyleCardModule({
  story,
  kind,
}: {
  story: LifestyleRiverStory;
  kind: LifestyleCardKind;
}) {
  const recipeMinutes = 20 + ((story.age * 5) % 35);
  const productCount = 5 + (story.age % 8);

  if (kind === "gallery" || kind === "video") return null;

  if (kind === "recipe") {
    if (isYearMakeModelStory(story)) {
      return (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
          <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
            <p className="font-bold">{3 + (story.age % 5)} sec</p>
            <p className="text-foreground">0-60</p>
          </div>
          <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
            <p className="font-bold">{240 + ((story.age * 17) % 360)} hp</p>
            <p className="text-foreground">Estimate</p>
          </div>
          <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
            <p className="flex items-center justify-center gap-1 font-bold">
              <Star className="h-3.5 w-3.5" aria-hidden />
              Tested
            </p>
            <p className="text-foreground">Signal</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
        <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
          <p className="font-bold">{recipeMinutes} min</p>
          <p className="text-foreground">Total</p>
        </div>
        <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
          <p className="font-bold">{2 + (story.age % 5)}</p>
          <p className="text-foreground">Servings</p>
        </div>
        <div className="rounded-[8px] border border-border bg-background px-2 py-2 text-foreground">
          <p className="flex items-center justify-center gap-1 font-bold">
            <ChefHat className="h-3.5 w-3.5" aria-hidden />
            Easy
          </p>
          <p className="text-foreground">Level</p>
        </div>
      </div>
    );
  }

  if (kind === "shopping") {
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
          {productCount} editor picks
        </span>
        <span className="inline-flex items-center gap-1 text-foreground">
          <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
          Lab-informed picks
        </span>
      </div>
    );
  }

  return null;
}
