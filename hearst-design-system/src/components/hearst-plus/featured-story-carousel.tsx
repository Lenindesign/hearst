"use client";

import React from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Pause,
  Play,
  Plus,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { cn } from "@/lib/utils";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { LiveStoryBadge } from "@/components/hearst-plus/story-metadata";
import { usePrefersReducedMotion } from "@/components/hearst-plus/use-prefers-reduced-motion";
import { formatVideoDuration } from "@/components/hearst-plus/video-format";

const quietStoryActionButtonClass =
  "min-h-11 min-w-11 border-0 bg-transparent px-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-primary focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/30 sm:min-h-6 sm:min-w-0";

export type FeaturedStoryCarouselProps = {
  stories: LifestyleRiverStory[];
  renderImage: (
    story: LifestyleRiverStory,
    index: number,
    active: boolean,
  ) => React.ReactNode;
  editionLabel?: string;
  initialStoryId?: string;
  savedIds?: readonly string[];
  getCommentCount?: (story: LifestyleRiverStory) => number;
  isCurrentStory?: (story: LifestyleRiverStory) => boolean;
  onOpenStory: (story: LifestyleRiverStory) => void;
  onSave: (story: LifestyleRiverStory) => void;
  onMoreLikeThis: (story: LifestyleRiverStory) => void;
  onFollowBrand: (brandName: string) => void;
  onEditionImpression?: () => void;
  onEditionStoryOpen?: (story: LifestyleRiverStory, position: number) => void;
  onActiveStoryChange?: (story: LifestyleRiverStory, position: number) => void;
  indicatorPalette?: readonly string[];
};

function defaultCommentCount(story: LifestyleRiverStory) {
  return Math.max(3, Math.round(story.popularity / 7) + (story.age % 9));
}

function defaultIsCurrentStory(story: LifestyleRiverStory) {
  return story.id.startsWith("live-");
}

export function FeaturedStoryCarousel({
  stories,
  renderImage,
  editionLabel,
  initialStoryId,
  savedIds = [],
  getCommentCount = defaultCommentCount,
  isCurrentStory = defaultIsCurrentStory,
  onOpenStory,
  onSave,
  onMoreLikeThis,
  onFollowBrand,
  onEditionImpression,
  onEditionStoryOpen,
  onActiveStoryChange,
  indicatorPalette,
}: FeaturedStoryCarouselProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const initialIndex = initialStoryId
      ? stories.findIndex((story) => story.id === initialStoryId)
      : 0;
    return Math.max(0, initialIndex);
  });
  const [paused, setPaused] = React.useState(false);
  const [hoverPaused, setHoverPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const swipeStartRef = React.useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const swipeLastRef = React.useRef<{ x: number; y: number } | null>(null);
  const suppressSlideClickRef = React.useRef(false);
  const swipeInstructionsId = React.useId();
  const activeStory = stories[activeIndex] ?? stories[0];

  React.useEffect(() => {
    if (editionLabel && stories.length > 0) onEditionImpression?.();
  }, [editionLabel, onEditionImpression, stories.length]);

  React.useEffect(() => {
    if (!activeStory) return;
    onActiveStoryChange?.(activeStory, activeIndex + 1);
  }, [activeIndex, activeStory, onActiveStoryChange]);

  React.useEffect(() => {
    if (
      paused ||
      hoverPaused ||
      prefersReducedMotion ||
      isDragging ||
      stories.length < 2
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % stories.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [hoverPaused, isDragging, paused, prefersReducedMotion, stories.length]);

  if (!activeStory) return null;

  const saved = savedIds.includes(activeStory.id);
  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + stories.length) % stories.length);
  };
  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % stories.length);
  };
  const resetSwipe = () => {
    swipeStartRef.current = null;
    swipeLastRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (stories.length < 2 || event.button !== 0) return;

    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };
    swipeLastRef.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start) return;

    swipeLastRef.current = { x: event.clientX, y: event.clientY };
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaY) >= Math.abs(deltaX)) return;

    if (
      Math.abs(deltaX) >= 8 &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    const maxOffset = event.currentTarget.clientWidth * 0.22;
    setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start) return;

    const end = swipeLastRef.current ?? {
      x: event.clientX,
      y: event.clientY,
    };
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const elapsed = Math.max(performance.now() - start.time, 1);
    const velocity = Math.abs(deltaX) / elapsed;
    const threshold = Math.min(64, event.currentTarget.clientWidth * 0.14);
    const isHorizontalSwipe =
      Math.abs(deltaX) > Math.abs(deltaY) * 1.2 &&
      (Math.abs(deltaX) >= threshold ||
        (Math.abs(deltaX) >= 24 && velocity >= 0.45));

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (isHorizontalSwipe) {
      suppressSlideClickRef.current = true;
      if (deltaX < 0) goToNext();
      else goToPrevious();
      window.setTimeout(() => {
        suppressSlideClickRef.current = false;
      }, 0);
    }

    resetSwipe();
  };

  return (
    <article
      className="group relative min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      aria-roledescription="carousel"
      aria-label={editionLabel ?? "Featured stories"}
      aria-describedby={swipeInstructionsId}
      data-story-module={editionLabel ? "todays-picks" : "featured"}
      onFocusCapture={(event) => {
        const target = event.target;
        if (
          target instanceof HTMLElement &&
          target.dataset.carouselRotationControl === "true"
        ) {
          return;
        }
        setPaused(true);
      }}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      <p id={swipeInstructionsId} className="sr-only">
        Swipe left or right to move between{" "}
        {editionLabel ? editionLabel : "featured stories"}.
      </p>
      <p
        role="status"
        aria-live={paused || prefersReducedMotion ? "polite" : "off"}
        aria-atomic="true"
        aria-label="Featured story status"
        className="sr-only"
      >
        Story {activeIndex + 1} of {stories.length}: {activeStory.title}
      </p>
      <div
        className="relative w-full min-w-0 touch-pan-y select-none overflow-hidden bg-black"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetSwipe}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={cn(
            "flex w-full ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isDragging
              ? "transition-none"
              : "transition-transform duration-500",
          )}
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {stories.map((story, index) => {
            const slideCommentCount = getCommentCount(story);

            return (
              <button
                key={story.id}
                type="button"
                className="relative grid w-full shrink-0 grid-rows-[auto_112px] bg-black text-left text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 sm:grid-rows-[auto_144px]"
                onClick={(event) => {
                  if (suppressSlideClickRef.current) {
                    event.preventDefault();
                    return;
                  }
                  onEditionStoryOpen?.(story, index + 1);
                  onOpenStory(story);
                }}
                aria-label={`Open story: ${story.title}`}
                aria-hidden={index !== activeIndex}
                inert={index !== activeIndex ? true : undefined}
                tabIndex={index === activeIndex ? 0 : -1}
                data-feed-source={
                  isCurrentStory(story) ? "current" : "editorial"
                }
                data-media-kind={story.videoUrl ? "video" : "article"}
                data-story-id={story.id}
              >
                <div className="relative isolate">
                  <div className="relative h-[min(128vw,520px)] w-full overflow-hidden sm:h-auto sm:aspect-video">
                    {renderImage(story, index, index === activeIndex)}
                    <div
                      aria-hidden="true"
                      data-slider-layer="gradient"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] bg-[linear-gradient(to_bottom,transparent_0%,var(--hp-image-scrim-soft)_30%,var(--hp-image-scrim-strong)_72%,var(--hp-image-scrim-solid)_100%)] sm:h-[220px] xl:h-[240px]"
                    />
                  </div>
                </div>
                <div data-slider-layer="frame" className="bg-black" />
                <div
                  data-slider-content
                  className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <BrandSourceIcon
                      brand={story.brand}
                      brandSlug={story.brandSlug}
                      className="h-5 w-5 rounded-[4px] border-border"
                    />
                    <span>{story.brand}</span>
                    {story.videoUrl ? (
                      <>
                        <span aria-hidden>/</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-bold text-white backdrop-blur">
                          <Play className="h-3 w-3 fill-current" aria-hidden />
                          Video
                          {story.videoDuration
                            ? ` · ${formatVideoDuration(story.videoDuration)}`
                            : ""}
                        </span>
                      </>
                    ) : null}
                    <span aria-hidden>/</span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      {slideCommentCount}
                    </span>
                  </div>
                  <h2
                    className={cn(
                      "headline line-clamp-3 max-w-[min(42rem,100%)] break-words text-balance text-[clamp(2rem,4.5vw,2.75rem)] sm:text-[clamp(2.25rem,3.25vw,3rem)]",
                      story.brandSlug === "house-beautiful" ||
                        story.brandSlug === "road-and-track"
                        ? "leading-[1.12]"
                        : "leading-[1.08]",
                    )}
                  >
                    {story.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                    {story.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-sm font-bold text-white backdrop-blur"
            aria-label={
              editionLabel
                ? `${editionLabel}, story ${activeIndex + 1} of ${stories.length}`
                : `Story ${activeIndex + 1} of ${stories.length}`
            }
          >
            {editionLabel ? (
              <>
                <span>{editionLabel}</span>
                <span aria-hidden>·</span>
              </>
            ) : null}
            <span>
              {activeIndex + 1} of {stories.length}
            </span>
          </span>
          {stories.length > 1 ? (
            <div
              className="flex items-center gap-1.5"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="hidden h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:inline-flex"
                onClick={goToPrevious}
                aria-label="Previous featured story"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:h-7 sm:w-7"
                aria-label={
                  prefersReducedMotion
                    ? "Automatic rotation disabled because reduced motion is enabled"
                    : paused
                      ? "Resume slider"
                      : "Pause slider"
                }
                onClick={() => setPaused((value) => !value)}
                disabled={prefersReducedMotion}
                data-carousel-rotation-control="true"
              >
                {paused || prefersReducedMotion ? (
                  <Play className="h-4 w-4" aria-hidden />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden />
                )}
              </button>
              <button
                type="button"
                className="hidden h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60 sm:inline-flex"
                onClick={goToNext}
                aria-label="Next featured story"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-[var(--hp-surface)] px-4 py-3">
        <div
          className="flex min-w-0 flex-wrap gap-1.5"
          aria-label="Featured story slides"
        >
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-muted/60 sm:h-6 sm:w-auto"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show story ${index + 1}: ${story.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span
                aria-hidden
                style={
                  indicatorPalette?.length
                    ? {
                        backgroundColor:
                          indicatorPalette[index % indicatorPalette.length],
                      }
                    : undefined
                }
                className={cn(
                  "h-1.5 rounded-full transition-all motion-reduce:transition-none",
                  index === activeIndex ? "w-8" : "w-4",
                  !indicatorPalette?.length &&
                    (index === activeIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/30"),
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Button
            variant="ghost"
            size="xs"
            className={cn(
              quietStoryActionButtonClass,
              "h-11 sm:h-6",
              saved && "text-primary hover:text-primary",
            )}
            onClick={() => onSave(activeStory)}
            aria-pressed={saved}
          >
            <Bookmark
              className="hidden h-3.5 w-3.5 sm:block"
              weight={saved ? "fill" : "regular"}
              aria-hidden
            />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className={cn(quietStoryActionButtonClass, "h-11 sm:h-6")}
            onClick={() => onMoreLikeThis(activeStory)}
          >
            <Plus className="hidden h-3.5 w-3.5 sm:block" aria-hidden />
            More like this
          </Button>
          <span className="inline-flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              className="h-11 sm:h-6"
              onClick={() => onFollowBrand(activeStory.brand)}
              aria-label={`Follow ${activeStory.brand}`}
            >
              <span className="sm:hidden">Follow</span>
              <span className="hidden sm:inline">
                Follow {activeStory.brand}
              </span>
            </Button>
            <LiveStoryBadge story={activeStory} />
          </span>
        </div>
      </div>
    </article>
  );
}
