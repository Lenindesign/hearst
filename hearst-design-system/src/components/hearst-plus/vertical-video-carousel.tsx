"use client";

import React from "react";
import Image from "next/image";

import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { mergeUniqueStories } from "@/components/hearst-plus/story-utils";
import { usePrefersReducedMotion } from "@/components/hearst-plus/use-prefers-reduced-motion";
import { formatVideoDuration } from "@/components/hearst-plus/video-format";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { ChevronLeft, ChevronRight, Play } from "@/components/ui/icons";
import { isExactPortraitVideo } from "@/lib/hearst-video-destination-model";
import { cn } from "@/lib/utils";

export type VerticalVideoCarouselProps = {
  stories: LifestyleRiverStory[];
  onOpen: (story: LifestyleRiverStory) => void;
  onSupplementalStories?: (stories: LifestyleRiverStory[]) => void;
  theme?: "dark" | "light";
  brandName?: string;
  brandSlug?: string;
  title?: string;
  summaryLabel?: string;
  filterBrandSlug?: string;
};

export function VerticalVideoCarousel({
  stories,
  onOpen,
  onSupplementalStories,
  theme = "dark",
  brandName,
  brandSlug,
  title,
  summaryLabel = "vertical",
  filterBrandSlug,
}: VerticalVideoCarouselProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const supplementalRequestRef = React.useRef<string | null>(null);
  const titleId = React.useId();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [canScrollBackward, setCanScrollBackward] = React.useState(false);
  const [canScrollForward, setCanScrollForward] = React.useState(false);
  const [supplementalStories, setSupplementalStories] = React.useState<LifestyleRiverStory[]>([]);
  const requestedBrandSlug = filterBrandSlug;
  const availableStories = React.useMemo(
    () => mergeUniqueStories(stories, supplementalStories),
    [stories, supplementalStories],
  );
  const portraitStories = React.useMemo(
    () => availableStories.filter((story) =>
      (!filterBrandSlug || story.brandSlug === filterBrandSlug)
      && isExactPortraitVideo(story)
    ),
    [availableStories, filterBrandSlug],
  );
  const firstStory = portraitStories[0];
  const displayBrandName = brandName ?? firstStory?.brand ?? "Hearst";
  const displayBrandSlug = brandSlug ?? firstStory?.brandSlug ?? "hearst-all";
  const displayTitle = title ?? `${displayBrandName} Shorts`;

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || !requestedBrandSlug || supplementalRequestRef.current === requestedBrandSlug) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      supplementalRequestRef.current = requestedBrandSlug;

      const params = new URLSearchParams({
        destination: "all",
        brandSlug: requestedBrandSlug,
        offset: "0",
        limit: "48",
      });

      void fetch(`/api/video-feed/?${params.toString()}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Video feed returned ${response.status}`);
          return response.json() as Promise<{ stories?: LifestyleRiverStory[] }>;
        })
        .then((payload) => {
          const nextStories = Array.isArray(payload.stories) ? payload.stories : [];
          setSupplementalStories(nextStories);
          onSupplementalStories?.(nextStories);
        })
        .catch(() => {
          supplementalRequestRef.current = null;
        });
    }, { rootMargin: "240px 0px" });

    observer.observe(section);
    return () => observer.disconnect();
  }, [onSupplementalStories, requestedBrandSlug]);

  const updateScrollState = React.useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    setCanScrollBackward(scroller.scrollLeft > 2);
    setCanScrollForward(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const frame = window.requestAnimationFrame(updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scroller);
    scroller.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateScrollState);
    };
  }, [portraitStories.length, updateScrollState]);

  const scrollCarousel = (direction: -1 | 1) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const firstCard = scroller.firstElementChild as HTMLElement | null;
    const cardStep = firstCard ? firstCard.offsetWidth + 12 : Math.max(180, scroller.clientWidth * 0.75);
    scroller.scrollBy({
      left: direction * cardStep * 2,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  if (portraitStories.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={cn(
        theme === "light"
          ? "rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] sm:p-5"
          : "border-y border-white/10 py-5",
      )}
      aria-labelledby={titleId}
      data-testid="vertical-video-carousel"
      data-publication={displayBrandSlug}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <BrandSourceIcon
            brand={displayBrandName}
            brandSlug={displayBrandSlug}
            className="h-8 w-8 shrink-0"
          />
          <div className="min-w-0">
            <h2
              id={titleId}
              className={cn(
                "text-lg font-black leading-tight sm:text-xl",
                theme === "light" ? "text-foreground" : "text-[var(--hp-text-headline)]",
              )}
            >
              {displayTitle}
            </h2>
            <p
              className={cn(
                "mt-0.5 text-xs",
                theme === "light" ? "text-muted-foreground" : "text-[var(--hp-text-secondary)]",
              )}
              role="status"
              aria-live="polite"
            >
              {portraitStories.length} {summaryLabel} {portraitStories.length === 1 ? "video" : "videos"}
            </p>
          </div>
        </div>

        <div
          className="hidden shrink-0 items-center gap-2 sm:flex"
          aria-label={`${displayTitle} carousel controls`}
        >
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            disabled={!canScrollBackward}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-35",
              theme === "light"
                ? "bg-background hover:bg-muted"
                : "bg-[var(--hp-control)] hover:bg-[var(--hp-control-hover)]",
            )}
            aria-label={`Previous ${displayTitle}`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            disabled={!canScrollForward}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-35",
              theme === "light"
                ? "bg-background hover:bg-muted"
                : "bg-[var(--hp-control)] hover:bg-[var(--hp-control-hover)]",
            )}
            aria-label={`Next ${displayTitle}`}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={`Vertical videos from ${displayBrandName}`}
      >
        {portraitStories.map((story) => (
          <article
            key={story.id}
            className="w-[164px] shrink-0 snap-start sm:w-[180px]"
            role="listitem"
          >
            <button
              type="button"
              onClick={() => onOpen(story)}
              className="group block w-full text-left focus-visible:outline-none"
              aria-label={`Open ${story.brand} short: ${story.title}`}
            >
              <span
                className={cn(
                  "relative block aspect-[9/16] overflow-hidden rounded-[8px] bg-[var(--hp-surface-low)] shadow-[var(--hp-shadow-card)] transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-primary/60 motion-reduce:transition-none",
                  theme === "light" ? "border border-border" : "border border-white/10",
                )}
              >
                <Image
                  src={story.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 164px, 180px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                />
                <span
                  className="absolute bottom-2 left-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-transform group-hover:scale-105"
                  aria-hidden
                >
                  <Play className="ml-0.5 h-3.5 w-3.5" weight="fill" />
                </span>
                {story.videoDuration ? (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/75 px-2 py-1 text-[10px] font-bold tabular-nums text-white">
                    {formatVideoDuration(story.videoDuration)}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "mt-2.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 transition-colors group-hover:text-primary",
                  theme === "light" ? "text-foreground" : "text-[var(--hp-text-primary)]",
                )}
              >
                {story.title}
              </span>
              <span
                className={cn(
                  "mt-1 block text-xs font-semibold",
                  theme === "light" ? "text-muted-foreground" : "text-[var(--hp-text-secondary)]",
                )}
              >
                {story.brand} · {story.topic}
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DelishVerticalVideoCarousel({
  stories,
  onOpen,
  onSupplementalStories,
  theme = "dark",
}: Pick<VerticalVideoCarouselProps, "stories" | "onOpen" | "onSupplementalStories" | "theme">) {
  return (
    <VerticalVideoCarousel
      stories={stories}
      onOpen={onOpen}
      onSupplementalStories={onSupplementalStories}
      theme={theme}
      brandName="Delish"
      brandSlug="delish"
      title="Delish Shorts"
      summaryLabel="vertical recipe"
      filterBrandSlug="delish"
    />
  );
}
