"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Pause,
  Play,
} from "@/components/ui/icons";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { cn } from "@/lib/utils";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { usePrefersReducedMotion } from "@/components/hearst-plus/use-prefers-reduced-motion";
import { formatVideoDuration } from "@/components/hearst-plus/video-format";

export type FeaturedStoryCarouselProps = {
  stories: LifestyleRiverStory[];
  layoutMode?: "cards" | "list";
  reducePhotoHeight?: boolean;
  scrimDirection?: "bottom" | "left-to-right";
  renderImage: (
    story: LifestyleRiverStory,
    index: number,
    active: boolean,
  ) => React.ReactNode;
  editionLabel?: string;
  initialStoryId?: string;
  getCommentCount?: (story: LifestyleRiverStory) => number;
  isCurrentStory?: (story: LifestyleRiverStory) => boolean;
  onOpenStory: (story: LifestyleRiverStory) => void;
  /** Unused: the slide row with Follow and the dot indicators is hidden. Kept so callers need no change. */
  onFollowBrand?: (brandName: string) => void;
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
  layoutMode = "cards",
  reducePhotoHeight = false,
  scrimDirection = "bottom",
  renderImage,
  editionLabel,
  initialStoryId,
  getCommentCount = defaultCommentCount,
  isCurrentStory = defaultIsCurrentStory,
  onOpenStory,
  onEditionImpression,
  onEditionStoryOpen,
  onActiveStoryChange,
}: FeaturedStoryCarouselProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const initialActualIndex = React.useMemo(() => {
    const initialIndex = initialStoryId
      ? stories.findIndex((story) => story.id === initialStoryId)
      : 0;
    return Math.max(0, initialIndex);
  }, [initialStoryId, stories]);
  const [activeIndex, setActiveIndex] = React.useState(initialActualIndex);
  const [trackIndex, setTrackIndex] = React.useState(() =>
    stories.length > 1 ? initialActualIndex + 1 : 0,
  );
  const [trackTransitionEnabled, setTrackTransitionEnabled] =
    React.useState(true);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [hoverPaused, setHoverPaused] = React.useState(false);
  const swipeRef = React.useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    startedAt: number;
    target: HTMLElement | null;
    hasSwipeIntent: boolean;
  } | null>(null);
  const suppressClickRef = React.useRef(false);
  const activeStory = stories[activeIndex] ?? stories[0];
  const hasMultipleStories = stories.length > 1;
  const swipeEnabled = editionLabel === "Today’s Picks";
  const visualStories = React.useMemo(() => {
    if (!hasMultipleStories) return stories;
    const firstStory = stories[0];
    const lastStory = stories[stories.length - 1];
    return [lastStory, ...stories, firstStory].filter(
      (story): story is LifestyleRiverStory => Boolean(story),
    );
  }, [hasMultipleStories, stories]);
  const adjacentPreloadSources = React.useMemo(() => {
    if (!hasMultipleStories) return [];

    const previousIndex =
      (activeIndex - 1 + stories.length) % stories.length;
    const nextIndex = (activeIndex + 1) % stories.length;

    return [
      stories[previousIndex]?.image,
      stories[nextIndex]?.image,
    ].filter((src): src is string => Boolean(src));
  }, [activeIndex, hasMultipleStories, stories]);

  React.useEffect(() => {
    if (editionLabel && stories.length > 0) onEditionImpression?.();
  }, [editionLabel, onEditionImpression, stories.length]);

  React.useEffect(() => {
    if (!activeStory) return;
    onActiveStoryChange?.(activeStory, activeIndex + 1);
  }, [activeIndex, activeStory, onActiveStoryChange]);

  React.useEffect(() => {
    if (stories.length === 0) return;
    queueMicrotask(() => {
      setActiveIndex((index) => Math.min(index, stories.length - 1));
      setTrackIndex((index) => {
        if (stories.length <= 1) return 0;
        return Math.min(Math.max(index, 1), stories.length);
      });
    });
  }, [stories.length]);

  React.useEffect(() => {
    if (typeof window === "undefined" || adjacentPreloadSources.length === 0) {
      return;
    }

    adjacentPreloadSources.forEach((src) => {
      const preloadImage = new window.Image();
      preloadImage.decoding = "async";
      preloadImage.src = src;
    });
  }, [adjacentPreloadSources]);

  const moveToIndex = React.useCallback((nextIndex: number) => {
    setDragOffset(0);
    setIsDragging(false);
    if (stories.length <= 1) {
      setActiveIndex(0);
      setTrackIndex(0);
      return;
    }

    const normalizedIndex =
      ((nextIndex % stories.length) + stories.length) % stories.length;
    setActiveIndex(normalizedIndex);
    setTrackIndex(nextIndex + 1);
  }, [stories.length]);
  const goToPrevious = React.useCallback(() => {
    moveToIndex(activeIndex - 1);
  }, [activeIndex, moveToIndex]);
  const goToNext = React.useCallback(() => {
    moveToIndex(activeIndex + 1);
  }, [activeIndex, moveToIndex]);

  const handleSwipePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !swipeEnabled ||
      !hasMultipleStories ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    swipeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startedAt: event.timeStamp,
      target,
      hasSwipeIntent: false,
    };
    if (target?.setPointerCapture) {
      try {
        target.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can be unavailable in synthetic browser events.
      }
    }
  };

  const handleSwipePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    swipe.lastX = event.clientX;
    swipe.lastY = event.clientY;
    const deltaX = event.clientX - swipe.startX;
    const deltaY = event.clientY - swipe.startY;
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2 || Math.abs(deltaX) < 8) return;
    swipe.hasSwipeIntent = true;
    event.preventDefault();
    setIsDragging(true);
    const maxOffset = event.currentTarget.clientWidth * 0.24;
    setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
  };

  const finishSwipe = (event: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    swipeRef.current = null;
    if (swipe.target?.hasPointerCapture(event.pointerId)) {
      try {
        swipe.target.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore unsupported pointer-capture releases.
      }
    }

    const deltaX = event.clientX - swipe.startX;
    const deltaY = event.clientY - swipe.startY;
    const elapsed = Math.max(event.timeStamp - swipe.startedAt, 1);
    const threshold = Math.min(64, event.currentTarget.clientWidth * 0.14);
    const shouldChangeSlide = !cancelled
      && Math.abs(deltaX) > Math.abs(deltaY) * 1.2
      && (Math.abs(deltaX) >= threshold || (Math.abs(deltaX) >= 24 && Math.abs(deltaX) / elapsed >= 0.45));

    if (swipe.hasSwipeIntent) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 400);
    }

    if (shouldChangeSlide) {
      if (swipe.target?.hasPointerCapture(event.pointerId)) {
        try {
          swipe.target.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore unsupported pointer-capture releases.
        }
      }
      moveToIndex(activeIndex + (deltaX < 0 ? 1 : -1));
      return;
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (
      paused ||
      hoverPaused ||
      isDragging ||
      prefersReducedMotion ||
      !hasMultipleStories
    ) return;

    const intervalId = window.setInterval(() => {
      moveToIndex(activeIndex + 1);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [
    activeIndex,
    hasMultipleStories,
    hoverPaused,
    isDragging,
    paused,
    prefersReducedMotion,
    moveToIndex,
  ]);

  const handleTrackTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.propertyName !== "transform" || stories.length <= 1) return;

    if (trackIndex === 0 || trackIndex === stories.length + 1) {
      setTrackTransitionEnabled(false);
      setTrackIndex(trackIndex === 0 ? stories.length : 1);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setTrackTransitionEnabled(true);
        });
      });
    }
  };

  if (!activeStory) return null;


  return (
    <article
      className="group relative min-w-0 overflow-hidden rounded-[8px] bg-black shadow-[var(--hp-shadow-card)]"
      aria-roledescription="carousel"
      aria-label={editionLabel ?? "Featured stories"}
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
      <p className="sr-only">
        Use the previous and next buttons to move between{" "}
        {editionLabel ? editionLabel : "featured stories"}
        {swipeEnabled ? ", or swipe on the featured story" : ""}.
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
        data-testid="featured-story-track"
        className={cn(
          "relative w-full min-w-0 overflow-hidden bg-black",
          swipeEnabled && "touch-pan-y",
        )}
        onPointerDown={handleSwipePointerDown}
        onPointerMove={handleSwipePointerMove}
        onPointerUp={(event) => finishSwipe(event)}
        onPointerCancel={(event) => finishSwipe(event, true)}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClickRef.current = false;
        }}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={cn(
            "flex w-full ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
            isDragging || !trackTransitionEnabled
              ? "transition-none"
              : "transition-transform duration-300",
          )}
          data-carousel-track-index={trackIndex}
          onTransitionEnd={handleTrackTransitionEnd}
          style={{
            transform: `translate3d(calc(-${trackIndex * 100}% + ${dragOffset}px), 0, 0)`,
          }}
        >
          {visualStories.map((story, visualIndex) => {
            const index = hasMultipleStories
              ? (visualIndex - 1 + stories.length) % stories.length
              : visualIndex;
            const isClone =
              hasMultipleStories &&
              (visualIndex === 0 || visualIndex === visualStories.length - 1);
            const slideCommentCount = getCommentCount(story);

            return (
              <button
                key={`${isClone ? "clone" : "story"}-${visualIndex}-${story.id}`}
                type="button"
                className={cn(
                  "group/featured-slide relative w-full shrink-0 bg-black text-left text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30",
                  layoutMode === "list"
                    ? "grid h-[184px] grid-cols-[112px_minmax(0,1fr)] grid-rows-[184px] sm:h-[220px] sm:grid-cols-[38%_minmax(0,1fr)] sm:grid-rows-[220px]"
                    : scrimDirection === "left-to-right"
                      ? "grid grid-rows-[auto]"
                    : "grid grid-rows-[auto_112px] sm:grid-rows-[auto_144px]",
                )}
                onClick={() => {
                  onEditionStoryOpen?.(story, index + 1);
                  onOpenStory(story);
                }}
                aria-label={`Open story: ${story.title}`}
                aria-hidden={isClone || index !== activeIndex}
                inert={isClone || index !== activeIndex ? true : undefined}
                tabIndex={!isClone && index === activeIndex ? 0 : -1}
                data-feed-source={
                  isCurrentStory(story) ? "current" : "editorial"
                }
                data-carousel-clone={isClone ? "true" : undefined}
                data-media-kind={story.videoUrl ? "video" : "article"}
                data-story-id={story.id}
              >
                <div className={cn(
                  "relative isolate",
                  layoutMode === "list" && "col-start-1 row-start-1 min-h-0",
                )}>
                  <div className={cn(
                    "relative w-full overflow-hidden",
                    layoutMode === "list"
                      ? "h-full min-h-0"
                      : reducePhotoHeight
                        ? "h-[min(81.92vw,333px)] sm:h-auto sm:aspect-[25/9]"
                        : "h-[min(128vw,520px)] sm:h-auto sm:aspect-video",
                  )}>
                    {renderImage(story, index, index === activeIndex)}
                    {scrimDirection === "left-to-right" ? (
                      <div
                        aria-hidden="true"
                        data-slider-layer="side-scrim"
                        className={cn(
                          "pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.32)_35%,transparent_72%)]",
                          layoutMode === "list" && "hidden",
                        )}
                      />
                    ) : (
                      /* A short fade so the photo's bottom edge melts into the black band under the headline. */
                      <div
                        aria-hidden="true"
                        data-slider-layer="gradient"
                        className={cn(
                          "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_bottom,transparent,var(--hp-image-scrim-solid))] sm:h-20",
                          layoutMode === "list" && "hidden",
                        )}
                      />
                    )}
                  </div>
                </div>
                <div data-slider-layer="frame" className={cn("bg-black", (layoutMode === "list" || scrimDirection === "left-to-right") && "hidden")} />
                {/* The default bottom scrim fades behind the text; full-width heroes can use a side scrim instead. */}
                {scrimDirection === "bottom" ? (
                  <div
                    aria-hidden="true"
                    data-slider-layer="bottom-scrim"
                    className={cn(
                      "pointer-events-none absolute inset-x-0 bottom-0 h-[min(48%,300px)] bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.12)_30%,rgba(0,0,0,0.42)_62%,rgba(0,0,0,0.75)_100%)]",
                      layoutMode === "list" && "hidden",
                    )}
                  />
                ) : null}
                <div
                  data-slider-content
                  className={cn(
                    layoutMode === "list"
                      ? "relative col-start-2 row-start-1 flex min-w-0 flex-col justify-center bg-card p-4 pt-12 text-foreground sm:p-6 sm:pt-12"
                      : "absolute inset-x-0 bottom-0 p-5 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_14px_rgba(0,0,0,0.4)] sm:p-7",
                  )}
                >
                  <div className={cn("mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold", layoutMode === "list" && "mb-2 text-xs sm:text-sm")}>
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
                      layoutMode === "list"
                        ? "headline line-clamp-3 max-w-[min(42rem,100%)] break-words text-balance text-[clamp(1rem,2.2vw,1.75rem)] leading-[1.12] sm:text-[clamp(1.35rem,2vw,2rem)]"
                      : cn(
                          "headline break-words text-balance text-[clamp(1.75rem,4vw,2.4rem)] sm:text-[clamp(2rem,2.5vw,2.25rem)]",
                          scrimDirection === "left-to-right"
                            ? "line-clamp-none max-w-[min(42rem,33.333%)]"
                            : "line-clamp-2 max-w-[min(42rem,100%)]",
                        ),
                      story.brandSlug === "house-beautiful" ||
                        story.brandSlug === "road-and-track"
                        ? "leading-[1.12]"
                        : "leading-[1.08]",
                    )}
                  >
                    {story.title}
                  </h2>
                </div>
              </button>
            );
          })}
        </div>
        <div className={cn(
          "absolute top-5 flex items-center justify-between gap-3",
          layoutMode === "list"
            ? "left-[124px] right-3 top-3 sm:left-[calc(38%+1.5rem)] sm:right-6 sm:top-4"
            : "left-5 right-5",
        )}>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/45 px-3 py-1 text-sm font-bold text-white backdrop-blur"
            aria-label={
              editionLabel
                ? `${editionLabel}, story ${activeIndex + 1} of ${stories.length}`
                : `Story ${activeIndex + 1} of ${stories.length}`
            }
          >
            {editionLabel && layoutMode !== "list" ? (
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
            <div className="flex items-center gap-1.5">
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
    </article>
  );
}
