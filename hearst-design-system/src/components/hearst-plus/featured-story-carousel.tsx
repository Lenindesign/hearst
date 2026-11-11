"use client";

import React from "react";
import Image from "next/image";
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
import { useTheme } from "@/components/theme-provider";
import { usePrefersReducedMotion } from "@/components/hearst-plus/use-prefers-reduced-motion";
import { formatVideoDuration } from "@/components/hearst-plus/video-format";
import { getHearstAutoResearchCarRating } from "@/lib/hearst-auto-research-cars";

export type FeaturedStoryCarouselProps = {
  className?: string;
  stories: LifestyleRiverStory[];
  layoutMode?: "cards" | "list";
  reducePhotoHeight?: boolean;
  scrimDirection?: "bottom" | "left-to-right";
  /** Text card fill and text color. Defaults to black and white; pages pass their banner colors (see getFeaturedCardColors). */
  /** iconTile: the card is the brand's own color, so the brand icon sits on a white tile to stay visible. */
  cardColors?: { background: string; foreground: string; iconTile?: boolean };
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
  onOpenStoryComments?: (story: LifestyleRiverStory) => void;
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

function ResearchCarRating({ rating, lightMode }: { rating: string; lightMode: boolean }) {
  const [score, denominator = "10"] = rating.split("/");

  return (
    <span className={cn(
      "flex shrink-0 flex-col items-center text-center",
      lightMode ? "text-[var(--palette-content-brand,var(--brand-primary))]" : "text-white",
    )} aria-label={`Car and Driver rating ${rating}`}>
      <span className="flex items-baseline font-extrabold tabular-nums leading-none">
        <span className="text-[28px]">{score}</span>
        <span className="text-sm">/{denominator}</span>
      </span>
      <span className={cn("mt-1 inline-flex items-center gap-1 text-[10px] font-semibold leading-none", lightMode ? "opacity-85" : "text-white/85")}>
        <Image src="/cd.svg" alt="" width={12} height={12} aria-hidden="true" />
        Rating
      </span>
    </span>
  );
}

export function FeaturedStoryCarousel({
  className,
  stories,
  layoutMode = "cards",
  scrimDirection = "bottom",
  cardColors = { background: "black", foreground: "white" },
  renderImage,
  editionLabel,
  initialStoryId,
  getCommentCount = defaultCommentCount,
  isCurrentStory = defaultIsCurrentStory,
  onOpenStory,
  onOpenStoryComments,
  onEditionImpression,
  onEditionStoryOpen,
  onActiveStoryChange,
}: FeaturedStoryCarouselProps) {
  const { colorMode } = useTheme();
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
  const wheelSwipeRef = React.useRef({
    deltaX: 0,
    lastEventAt: 0,
    lockedUntil: 0,
    direction: 0,
  });
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

  const handleTrackpadSwipe = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!swipeEnabled || !hasMultipleStories) return;

    // macOS trackpad swipes arrive as a stream of horizontal wheel deltas,
    // rather than pointer/touch events. Ignore ordinary vertical scrolling.
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 2) {
      return;
    }
    if (event.cancelable) event.preventDefault();

    const gesture = wheelSwipeRef.current;
    const now = event.timeStamp;
    const direction = Math.sign(event.deltaX);
    if (now - gesture.lastEventAt > 180 || direction !== gesture.direction) {
      gesture.deltaX = 0;
      gesture.lockedUntil = 0;
    }
    gesture.direction = direction;
    gesture.lastEventAt = now;

    if (now <= gesture.lockedUntil) return;
    gesture.deltaX += event.deltaX;

    if (Math.abs(gesture.deltaX) < 55) return;

    // Trackpad wheel deltas describe page content movement, opposite the
    // direction of the user's two-finger gesture: left advances, right goes back.
    const slideDirection = gesture.deltaX > 0 ? 1 : -1;
    gesture.deltaX = 0;
    gesture.lockedUntil = now + 520;
    moveToIndex(activeIndex + slideDirection);
  };

  const handleSwipePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !swipeEnabled ||
      !hasMultipleStories ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) return;
    const target = event.currentTarget;
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
    // Capture only after a horizontal drag is underway. Capturing on pointer
    // down retargets an ordinary click from the active slide button to this
    // track container, so the hero's open-story handler never receives it.
    if (swipe.target?.setPointerCapture && !swipe.target.hasPointerCapture(event.pointerId)) {
      try {
        swipe.target.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can be unavailable in synthetic browser events.
      }
    }
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
      className={cn(
        "group relative min-w-0 overscroll-x-none overflow-hidden",
        className,
        layoutMode !== "list" && "shadow-none",
        layoutMode === "list" && "rounded-card bg-card shadow-[var(--hp-shadow-card)]",
      )}
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
          "relative w-full min-w-0 overscroll-x-none overflow-hidden",
          layoutMode !== "list" && "shadow-none",
          layoutMode !== "list" && "pb-6",
          layoutMode === "list" && "bg-card",
          swipeEnabled && "touch-pan-y",
        )}
        onPointerDown={handleSwipePointerDown}
        onPointerMove={handleSwipePointerMove}
        onPointerUp={(event) => finishSwipe(event)}
        onPointerCancel={(event) => finishSwipe(event, true)}
        onWheel={handleTrackpadSwipe}
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
            const researchCarRating = getHearstAutoResearchCarRating(story.id);
            const carouselHeadlineColor = layoutMode === "list" ? undefined : "text-[var(--featured-card-fg)]";
            const headlineClassName = cn(
              // Type metrics UI-TYPE-001: slides use the lead role T2, list rows the card role T3.
              layoutMode === "list"
                ? "headline type-t3 line-clamp-3 max-w-[min(42rem,100%)] break-words"
                : cn(
                    "headline type-t2 break-words",
                    scrimDirection === "left-to-right"
                      ? "line-clamp-none max-w-[min(42rem,33.333%)]"
                      : "line-clamp-3 max-w-[min(42rem,100%)]",
                  ),
            );

            return (
              <article
                key={`${isClone ? "clone" : "story"}-${visualIndex}-${story.id}`}
                className={cn(
                  cn(
                    "group/featured-slide relative w-full shrink-0 cursor-pointer text-left focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary/30",
                    layoutMode !== "list" && "shadow-none",
                    layoutMode === "list" && "bg-card",
                  ),
                  layoutMode !== "list" && "[container-type:inline-size]",
                  layoutMode === "list"
                    ? "grid h-[184px] grid-cols-[112px_minmax(0,1fr)] grid-rows-[184px] sm:h-[220px] sm:grid-cols-[38%_minmax(0,1fr)] sm:grid-rows-[220px]"
                    : "grid grid-rows-[auto_auto]",
                )}
                onClick={() => {
                  onEditionStoryOpen?.(story, index + 1);
                  onOpenStory(story);
                }}
                aria-label={`Open story: ${story.title}`}
                aria-hidden={isClone || index !== activeIndex}
                inert={isClone || index !== activeIndex ? true : undefined}
                data-feed-source={
                  isCurrentStory(story) ? "current" : "editorial"
                }
                data-carousel-clone={isClone ? "true" : undefined}
                data-media-kind={story.videoUrl ? "video" : "article"}
                data-story-id={story.id}
                data-story-module="featured-story"
              >
                <button
                  type="button"
                  className="absolute inset-0 z-10 cursor-pointer rounded-none bg-transparent text-transparent focus-visible:outline-none"
                  onClick={() => {
                    onEditionStoryOpen?.(story, index + 1);
                    onOpenStory(story);
                  }}
                  aria-label={`Open story: ${story.title}`}
                  tabIndex={!isClone && index === activeIndex ? 0 : -1}
                />
                <div className={cn(
                  "pointer-events-none relative isolate shadow-none",
                  layoutMode === "list" && "col-start-1 row-start-1 min-h-0",
                )}>
                  <div className={cn(
                    "relative w-full overflow-hidden rounded-card bg-transparent shadow-none",
                    layoutMode !== "list" && "featured-carousel-photo",
                    layoutMode === "list"
                      ? "h-full min-h-0"
                      : "h-auto aspect-[5/3]",
                  )}>
                    {layoutMode === "list" ? (
                      renderImage(story, index, index === activeIndex)
                    ) : (
                      <div
                        className={cn(
                          "absolute inset-y-0 left-[-5%] w-[110%]",
                          "ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                          isDragging || !trackTransitionEnabled
                            ? "!transition-none"
                            : "transition-transform delay-[16ms] duration-[284ms]",
                        )}
                        style={{
                          // The image content travels 8% less than its slide,
                          // leaving the text card to lead the carousel motion.
                          transform: `translate3d(calc(${(trackIndex - visualIndex) * (100 / 13.75)}% - ${dragOffset * 0.08}px), 0, 0)`,
                        }}
                      >
                        {renderImage(story, index, index === activeIndex)}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  data-slider-content
                  className={cn(
                    layoutMode === "list"
                      ? "relative col-start-2 row-start-1 flex min-w-0 flex-col justify-center bg-card p-4 pt-12 text-foreground sm:p-6 sm:pt-12"
                      : cn(
                          "pointer-events-none relative z-10 col-start-1 row-start-2 mx-[6px] -mt-10 flex h-[224px] min-w-0 flex-col rounded-card px-5 py-2.5 shadow-[0_6px_18px_rgba(0,0,0,0.20)] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none sm:mx-[18px] sm:-mt-12 sm:h-[240px] sm:px-6 sm:py-3",
                          isDragging || !trackTransitionEnabled
                            ? "!transition-none"
                            : "transition-transform duration-300",
                          "text-[var(--featured-card-fg)]",
                        ),
                  )}
                  style={layoutMode === "list" ? undefined : {
                    backgroundColor: cardColors.background,
                    "--featured-card-fg": cardColors.foreground,
                    // Let the text card lead by 10px while the photo
                    // catches up through its delayed, shorter parallax motion.
                    transform: `translate3d(${-(trackIndex - visualIndex) * 10}px, 0, 0)`,
                  } as React.CSSProperties}
                >
                  <div className={cn(
                    "mb-1.5 flex flex-wrap items-center gap-2 text-sm font-semibold",
                    layoutMode === "list" && "mb-2 text-xs sm:text-sm",
                    layoutMode !== "list" && "text-[var(--featured-card-fg)]",
                  )}>
                    <span className={cn("inline-flex shrink-0", cardColors.iconTile && layoutMode !== "list" && "rounded-[5px] bg-white p-[2px]")}>
                      <BrandSourceIcon
                        brand={story.brand}
                        brandSlug={story.brandSlug}
                        className="h-5 w-5 rounded-[4px] border-border"
                      />
                    </span>
                    <span className="font-bold" style={{ fontWeight: 700 }}>{story.brand}</span>
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
                    <button
                      type="button"
                      className={cn(
                        "pointer-events-auto relative z-20 inline-flex min-h-8 items-center gap-1 rounded-sm underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2",
                        colorMode === "light" ? "focus-visible:ring-[var(--palette-content-brand,var(--brand-primary))]" : "focus-visible:ring-white/80",
                      )}
                      aria-label={`Open ${slideCommentCount} comments for ${story.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        (onOpenStoryComments ?? onOpenStory)(story);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      {slideCommentCount}
                    </button>
                  </div>
                  {researchCarRating ? (
                    <div className="flex min-w-0 items-end justify-between gap-3">
                      <h2 className={cn("min-w-0 flex-1 decoration-2 underline-offset-4 group-hover/featured-slide:underline group-focus-visible/featured-slide:underline", carouselHeadlineColor, headlineClassName)}>{story.title}</h2>
                      <ResearchCarRating rating={researchCarRating} lightMode={colorMode === "light"} />
                    </div>
                  ) : (
                    <h2 className={cn("decoration-2 underline-offset-4 group-hover/featured-slide:underline group-focus-visible/featured-slide:underline", carouselHeadlineColor, headlineClassName)}>{story.title}</h2>
                  )}
                  {layoutMode !== "list" && story.summary ? (
                    <p className={cn(
                      "mt-3 line-clamp-2 max-w-3xl text-sm leading-[1.265] text-[var(--featured-card-fg)] opacity-85 sm:text-base",
                    )}>
                      {story.summary}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className={cn(
        "absolute top-5 z-10 flex items-center justify-between gap-3",
        layoutMode === "list"
          ? "left-[124px] right-3 top-3 sm:left-[calc(38%+1.5rem)] sm:right-6 sm:top-4"
          : "left-5 right-5",
      )}>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/45 px-2.5 py-1 text-xs font-bold text-white backdrop-blur"
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
    </article>
  );
}
