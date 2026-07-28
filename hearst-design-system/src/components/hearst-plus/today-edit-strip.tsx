"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type TodayEditStory = {
  id: string;
  title: string;
  image?: string | null;
};

export type TodayEditSelection<T extends TodayEditStory = TodayEditStory> = {
  continueStory?: T;
  followedBrandStory?: T;
  trendingStory?: T;
  horoscopeStory?: T;
};

export type TodayEditStripProps<T extends TodayEditStory = TodayEditStory> = {
  selection: TodayEditSelection<T>;
  measurementEnabled?: boolean;
  onOpenStory: (storyId: string) => void;
  onContinueImpression?: (storyId: string) => void;
  onContinueOpen?: (storyId: string) => void;
  className?: string;
};

export function TodayEditStrip<T extends TodayEditStory>({
  selection,
  measurementEnabled = true,
  onOpenStory,
  onContinueImpression,
  onContinueOpen,
  className,
}: TodayEditStripProps<T>) {
  const titleId = React.useId();
  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  const previousButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const pendingKeyboardDirectionRef = React.useRef<-1 | 1 | null>(null);
  const previousCarouselWidthRef = React.useRef(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const {
    continueStory,
    followedBrandStory,
    trendingStory,
    horoscopeStory,
  } = selection;
  const carouselStoryKey = [
    horoscopeStory?.id,
    continueStory?.id,
    followedBrandStory?.id,
    trendingStory?.id,
  ].filter(Boolean).join(":");
  const updateCarouselControls = React.useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstCardOffset = (carousel.firstElementChild as HTMLElement | null)?.offsetLeft ?? 0;

    setCanScrollLeft(carousel.scrollLeft > firstCardOffset + 2);
    setCanScrollRight(carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 2);
  }, []);

  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const resetForWidthChange = () => {
      const nextWidth = Math.round(carousel.getBoundingClientRect().width);
      if (nextWidth !== previousCarouselWidthRef.current) {
        previousCarouselWidthRef.current = nextWidth;
        carousel.scrollLeft = 0;
      }
      updateCarouselControls();
    };

    resetForWidthChange();
    carousel.addEventListener("scroll", updateCarouselControls, { passive: true });
    const resizeObserver = new ResizeObserver(resetForWidthChange);
    resizeObserver.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateCarouselControls);
      resizeObserver.disconnect();
    };
  }, [updateCarouselControls]);

  React.useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollLeft = 0;
    updateCarouselControls();
  }, [carouselStoryKey, updateCarouselControls]);

  React.useEffect(() => {
    if (
      !measurementEnabled
      || !continueStory
      || !window.matchMedia("(min-width: 768px)").matches
    ) return;
    onContinueImpression?.(continueStory.id);
  }, [continueStory, measurementEnabled, onContinueImpression]);

  React.useEffect(() => {
    const pendingDirection = pendingKeyboardDirectionRef.current;
    if (pendingDirection === 1 && !canScrollRight && canScrollLeft) {
      pendingKeyboardDirectionRef.current = null;
      previousButtonRef.current?.focus();
    } else if (pendingDirection === -1 && !canScrollLeft && canScrollRight) {
      pendingKeyboardDirectionRef.current = null;
      nextButtonRef.current?.focus();
    }
  }, [canScrollLeft, canScrollRight]);

  if (!followedBrandStory || !trendingStory) return null;

  const scrollCarousel = (direction: -1 | 1, preserveKeyboardFocus: boolean) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    pendingKeyboardDirectionRef.current = preserveKeyboardFocus ? direction : null;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    carousel.scrollBy({
      left: direction * Math.max(320, carousel.clientWidth * 0.72),
      behavior:
        preserveKeyboardFocus || prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const modules = [
    ...(horoscopeStory ? [{
      story: horoscopeStory,
      label: "Horoscope",
      onClick: () => onOpenStory(horoscopeStory.id),
    }] : []),
    ...(continueStory ? [{
      story: continueStory,
      label: "Continue Reading",
      onClick: () => {
        onContinueOpen?.(continueStory.id);
        onOpenStory(continueStory.id);
      },
    }] : []),
    {
      story: followedBrandStory,
      label: "New From Your Brands",
      onClick: () => onOpenStory(followedBrandStory.id),
    },
    {
      story: trendingStory,
      label: "Trending Today",
      onClick: () => onOpenStory(trendingStory.id),
    },
  ];

  return (
    <section
      className={cn(
        "relative hidden w-full overflow-hidden rounded-[8px] border border-border bg-[var(--hp-strip)] shadow-[var(--hp-shadow-card)] md:block",
        className,
      )}
      aria-labelledby={titleId}
      data-story-module="todays-edit"
    >
      <h2 id={titleId} className="sr-only">Today&apos;s edit</h2>
      <div
        ref={carouselRef}
        className={cn(
          "flex w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] xl:grid xl:divide-x xl:divide-border xl:overflow-visible xl:snap-none xl:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden xl:[&::-webkit-scrollbar]:block",
          modules.length === 4
            ? "xl:grid-cols-4"
            : modules.length === 3
              ? "xl:grid-cols-3"
              : "xl:grid-cols-2",
        )}
      >
        {modules.map((module) => (
          <button
            key={module.label}
            type="button"
            onClick={module.onClick}
            data-story-id={module.story.id}
            className="group relative flex w-[88vw] shrink-0 snap-start scroll-ml-0 flex-col border-r border-border p-4 text-left transition-colors last:border-r-0 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 sm:w-[50vw] md:w-[38vw] lg:w-[30vw] xl:w-auto xl:min-w-0 xl:border-0"
          >
            <span>
              <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase leading-none tracking-widest text-[var(--hp-section-title)]">
                {module.label}
              </span>
              <span className="mt-3 flex items-start gap-3">
                {module.story.image ? (
                  <span
                    aria-hidden="true"
                    className="mt-0.5 block h-16 w-20 shrink-0 rounded-[8px] bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url("${module.story.image}")` }}
                  />
                ) : null}
                <span className="line-clamp-3 min-w-0 text-sm font-bold leading-snug text-foreground">
                  {module.story.title}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
      {canScrollLeft || canScrollRight ? (
        <div className="absolute right-3 top-3 hidden items-center gap-1.5 sm:flex xl:hidden">
          {canScrollLeft ? (
            <button
              ref={previousButtonRef}
              type="button"
              onClick={(event) => scrollCarousel(-1, event.detail === 0)}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full focus:outline-none"
              aria-label="Previous stories in today's edit"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors group-hover:bg-black/60 group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </span>
            </button>
          ) : null}
          {canScrollRight ? (
            <button
              ref={nextButtonRef}
              type="button"
              onClick={(event) => scrollCarousel(1, event.detail === 0)}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full focus:outline-none"
              aria-label="Next stories in today's edit"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors group-hover:bg-black/60 group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
                <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
