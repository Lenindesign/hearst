"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { AdaptiveVideo } from "@/components/adaptive-video";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { usePrefersReducedMotion } from "@/components/hearst-plus/use-prefers-reduced-motion";
import { formatVideoDuration } from "@/components/hearst-plus/video-format";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import {
  Bookmark,
  BookOpenText,
  ChevronDown,
  ChevronUpIcon,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "@/components/ui/icons";
import {
  getShortScrollBehavior,
  getSettledShortIndex,
  getShortPreloadIndexes,
  isActiveShortEvent,
  shouldAutoplayActivatedShort,
} from "@/lib/shorts-playback";
import { cn } from "@/lib/utils";

export type DelishShortsImmersiveViewerProps = {
  stories: LifestyleRiverStory[];
  openStoryId: string | null;
  savedIds: string[];
  onClose: () => void;
  onSelectStory: (storyId: string) => void;
  onOpenStory: (storyId: string) => void;
  onSave: (story: LifestyleRiverStory) => void;
};

export function DelishShortsImmersiveViewer({
  stories,
  openStoryId,
  savedIds,
  onClose,
  onSelectStory,
  onOpenStory,
  onSave,
}: DelishShortsImmersiveViewerProps) {
  const videoRefsRef = React.useRef(new Map<string, HTMLVideoElement>());
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const shortsScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollFrameRef = React.useRef<number | null>(null);
  const scrollSettleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const shortChromeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const shortChromeAutoPhaseRef = React.useRef(true);
  const scrollSelectionSourceRef = React.useRef<"scroll" | "programmatic" | null>(null);
  const lastActivatedStoryIdRef = React.useRef<string | null>(null);
  const swipeInstructionsId = React.useId();
  const portalTarget = useBodyPortalTarget();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = React.useState(true);
  const [muted, setMuted] = React.useState(true);
  const [shortChromeVisible, setShortChromeVisible] = React.useState(true);
  const activeIndex = stories.findIndex((story) => story.id === openStoryId);
  const activeStory = activeIndex >= 0 ? stories[activeIndex] : null;
  useModalIsolation(Boolean(activeStory && portalTarget), dialogRef);
  const [preloadedStoryIds, setPreloadedStoryIds] = React.useState<Set<string>>(() => {
    const initialIndex = Math.max(0, stories.findIndex((story) => story.id === openStoryId));
    return new Set(getShortPreloadIndexes(initialIndex, stories.length).map((index) => stories[index].id));
  });
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < stories.length - 1;

  const showShortChromeTemporarily = React.useCallback(() => {
    if (shortChromeTimerRef.current) clearTimeout(shortChromeTimerRef.current);
    shortChromeAutoPhaseRef.current = true;
    setShortChromeVisible(true);
    shortChromeTimerRef.current = setTimeout(() => {
      shortChromeTimerRef.current = null;
      shortChromeAutoPhaseRef.current = false;
      setShortChromeVisible(false);
    }, 3000);
  }, []);

  const selectStoryAtIndex = React.useCallback((nextIndex: number, behavior: ScrollBehavior = "smooth") => {
    const nextStory = stories[nextIndex];
    if (!nextStory) return;

    scrollSelectionSourceRef.current = "programmatic";
    setPreloadedStoryIds((currentIds) => {
      const nextIds = new Set(currentIds);
      getShortPreloadIndexes(nextIndex, stories.length).forEach((index) => {
        nextIds.add(stories[index].id);
      });
      return nextIds;
    });
    const scroller = shortsScrollerRef.current;
    if (scroller) {
      scroller.scrollTo({
        top: nextIndex * scroller.clientHeight,
        behavior,
      });
    }
  }, [stories]);

  const selectRelativeStory = React.useCallback((direction: -1 | 1) => {
    selectStoryAtIndex(
      activeIndex + direction,
      getShortScrollBehavior(prefersReducedMotion),
    );
  }, [activeIndex, prefersReducedMotion, selectStoryAtIndex]);

  const togglePlayback = React.useCallback(() => {
    const video = activeStory ? videoRefsRef.current.get(activeStory.id) : null;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [activeStory]);

  const handleShortsScroll = React.useCallback(() => {
    if (scrollFrameRef.current !== null) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const scroller = shortsScrollerRef.current;
      if (!scroller) return;

      if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
      scrollSettleTimerRef.current = setTimeout(() => {
        scrollSettleTimerRef.current = null;
        const settledScroller = shortsScrollerRef.current;
        if (!settledScroller) return;

        const nextIndex = getSettledShortIndex(
          settledScroller.scrollTop,
          settledScroller.clientHeight,
          stories.length,
        );
        const nextStory = stories[nextIndex];
        if (!nextStory || nextStory.id === openStoryId) return;

        if (scrollSelectionSourceRef.current !== "programmatic") {
          scrollSelectionSourceRef.current = "scroll";
        }
        setPreloadedStoryIds((currentIds) => {
          const nextIds = new Set(currentIds);
          getShortPreloadIndexes(nextIndex, stories.length).forEach((index) => {
            nextIds.add(stories[index].id);
          });
          return nextIds;
        });
        setPlaying(muted);
        showShortChromeTemporarily();
        onSelectStory(nextStory.id);
      }, 120);
    });
  }, [muted, onSelectStory, openStoryId, showShortChromeTemporarily, stories]);

  React.useEffect(() => {
    if (!activeStory) return;

    const activeVideo = videoRefsRef.current.get(activeStory.id);
    const activeStoryChanged = lastActivatedStoryIdRef.current !== activeStory.id;
    lastActivatedStoryIdRef.current = activeStory.id;

    videoRefsRef.current.forEach((video, storyId) => {
      if (storyId !== activeStory.id && !video.paused) video.pause();
    });

    if (!activeVideo) return;
    const shouldAutoplay = shouldAutoplayActivatedShort({
      muted,
      playingRequested: playing,
      storyChanged: activeStoryChanged,
    });
    if (!shouldAutoplay) {
      activeVideo.pause();
      if (activeStoryChanged && playing && !muted) setPlaying(false);
      return;
    }

    let secondFrame: number | null = null;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        void activeVideo.play().catch(() => setPlaying(false));
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) window.cancelAnimationFrame(secondFrame);
    };
  }, [activeStory, muted, playing, preloadedStoryIds]);

  React.useEffect(() => {
    const scroller = shortsScrollerRef.current;
    if (!scroller || activeIndex < 0) return;

    if (scrollSelectionSourceRef.current === "scroll") {
      scrollSelectionSourceRef.current = null;
      return;
    }

    scroller.scrollTo({
      top: activeIndex * scroller.clientHeight,
      behavior: "auto",
    });
    scrollSelectionSourceRef.current = null;
  }, [activeIndex, stories.length]);

  React.useEffect(() => {
    if (!activeStory) return;

    const revealFrame = window.requestAnimationFrame(() => {
      showShortChromeTemporarily();
    });

    return () => {
      window.cancelAnimationFrame(revealFrame);
      if (shortChromeTimerRef.current) clearTimeout(shortChromeTimerRef.current);
    };
  }, [activeStory, showShortChromeTemporarily]);

  React.useEffect(() => {
    if (!activeStory) return;

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        selectRelativeStory(-1);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectRelativeStory(1);
        return;
      }
      if (event.key === " " && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        togglePlayback();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLButtonElement>('[data-delish-short-close]')?.focus();
    });
    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [activeStory, onClose, selectRelativeStory, togglePlayback]);

  React.useEffect(() => () => {
    if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
    if (shortChromeTimerRef.current) clearTimeout(shortChromeTimerRef.current);
  }, []);

  if (!activeStory || !portalTarget) return null;

  const saved = savedIds.includes(activeStory.id);
  const controlButtonClass = "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-30";

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[260] overflow-hidden bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delish-short-title"
      aria-describedby={swipeInstructionsId}
      data-testid="delish-shorts-immersive-modal"
    >
      <p id={swipeInstructionsId} className="sr-only">
        Swipe up for the next Delish Short or swipe down for the previous one. You can also use the up and down arrow keys.
      </p>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="pointer-events-auto flex min-w-0 items-center gap-2 rounded-full bg-black/70 px-3 py-2 ring-1 ring-inset ring-white/10">
          <BrandSourceIcon brand="Delish" brandSlug="delish" className="h-6 w-6 shrink-0" />
          <span className="truncate text-sm font-black">Delish Shorts</span>
          <span className="text-xs text-white/60" aria-hidden="true">
            {activeIndex + 1}/{stories.length}
          </span>
          <span
            className="sr-only"
            role="status"
            aria-label={`Short ${activeIndex + 1} of ${stories.length}: ${activeStory.title}`}
            aria-live="polite"
            aria-atomic="true"
          >
            Short {activeIndex + 1} of {stories.length}: {activeStory.title}
          </span>
        </div>
        <button
          type="button"
          data-delish-short-close
          onClick={onClose}
          className={cn(controlButtonClass, "pointer-events-auto bg-black/70")}
          aria-label="Close Delish Shorts viewer"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex h-full items-center justify-center gap-4 px-0 sm:px-4">
        <div
          data-testid="delish-short-swipe-surface"
          className={cn(
            "relative max-h-[100dvh] select-none overflow-hidden bg-[var(--palette-neutral-darkest)] sm:max-h-[calc(100dvh-32px)] sm:rounded-[14px] sm:ring-1 sm:ring-inset sm:ring-white/10"
          )}
          style={{
            width: "min(100vw, calc((100dvh - 32px) * 9 / 16))",
            aspectRatio: "9 / 16",
          }}
          onDragStart={(event) => event.preventDefault()}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse" && !shortChromeAutoPhaseRef.current) {
              setShortChromeVisible(true);
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse" && !shortChromeAutoPhaseRef.current) {
              setShortChromeVisible(false);
            }
          }}
          onPointerDown={(event) => {
            if (event.pointerType === "touch") showShortChromeTemporarily();
          }}
          onFocusCapture={() => {
            if (shortChromeTimerRef.current) clearTimeout(shortChromeTimerRef.current);
            shortChromeAutoPhaseRef.current = false;
            setShortChromeVisible(true);
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setShortChromeVisible(false);
            }
          }}
        >
          <div
            ref={shortsScrollerRef}
            data-testid="delish-short-scroll-snap-track"
            className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={handleShortsScroll}
          >
            {stories.map((story, index) => {
              const isActive = index === activeIndex;
              const shouldRenderVideo = preloadedStoryIds.has(story.id);

              return (
                <div
                  key={story.id}
                  className="relative h-full snap-start snap-always overflow-hidden"
                  aria-hidden={!isActive}
                >
                  {shouldRenderVideo ? (
                    <AdaptiveVideo
                      ref={(video) => {
                        if (video) {
                          videoRefsRef.current.set(story.id, video);
                        } else {
                          videoRefsRef.current.delete(story.id);
                        }
                      }}
                      src={story.videoUrl}
                      poster={story.image}
                      autoPlay={false}
                      muted={muted}
                      playsInline
                      preload={Math.abs(index - activeIndex) <= 1 ? "auto" : "metadata"}
                      className="h-full w-full cursor-pointer bg-black object-contain"
                      aria-label={`Delish Short: ${story.title}`}
                      onClick={() => isActive && togglePlayback()}
                      onPlay={() => {
                        if (isActiveShortEvent(story.id, openStoryId)) setPlaying(true);
                      }}
                      onPause={() => {
                        if (isActiveShortEvent(story.id, openStoryId)) setPlaying(false);
                      }}
                      onEnded={() => {
                        if (isActiveShortEvent(story.id, openStoryId)) selectRelativeStory(1);
                      }}
                    />
                  ) : (
                    <Image
                      src={story.image}
                      alt=""
                      fill
                      sizes="min(100vw, 56vh)"
                      className="object-contain"
                      aria-hidden="true"
                    />
                  )}

                  <div
                    data-testid={isActive ? "delish-short-story-chrome" : undefined}
                    className={cn(
                      "absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pr-16 pt-12 transition-[opacity,transform] duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:px-5 sm:pb-5 sm:pr-5 sm:pt-14",
                      isActive && shortChromeVisible
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-3 opacity-0"
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/65">
                      <BrandSourceIcon brand="Delish" brandSlug="delish" className="h-4 w-4" />
                      <span>Delish · {story.topic}</span>
                      {story.videoDuration ? <span>· {formatVideoDuration(story.videoDuration)}</span> : null}
                    </div>
                    <h2
                      id={isActive ? "delish-short-title" : undefined}
                      className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-white/95 sm:text-lg"
                    >
                      {story.title}
                    </h2>
                    <button
                      type="button"
                      onClick={() => onOpenStory(story.id)}
                      tabIndex={isActive ? 0 : -1}
                      className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-[6px] text-xs font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:min-h-9"
                      aria-label={`Read the full story: ${story.title}`}
                    >
                      <BookOpenText className="h-3.5 w-3.5" aria-hidden />
                      Read story
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-28 right-3 z-30 flex flex-col gap-3 sm:hidden">
            <button type="button" onClick={() => onSave(activeStory)} className={controlButtonClass} aria-label={saved ? "Remove saved short" : "Save short"} aria-pressed={saved}>
              <Bookmark className="h-5 w-5" weight={saved ? "fill" : "regular"} aria-hidden />
            </button>
            <button type="button" onClick={() => setMuted((value) => !value)} className={controlButtonClass} aria-label={muted ? "Unmute short" : "Mute short"} aria-pressed={!muted}>
              {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
            </button>
            <button type="button" onClick={togglePlayback} className={controlButtonClass} aria-label={playing ? "Pause short" : "Play short"} aria-pressed={playing}>
              {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="h-5 w-5" weight="fill" aria-hidden />}
            </button>
          </div>
        </div>

        <div className="hidden flex-col items-center gap-3 sm:flex" aria-label="Delish Shorts viewer controls">
          <button type="button" onClick={() => selectRelativeStory(-1)} disabled={!hasPrevious} className={controlButtonClass} aria-label="Previous Delish Short">
            <ChevronUpIcon className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={() => selectRelativeStory(1)} disabled={!hasNext} className={controlButtonClass} aria-label="Next Delish Short">
            <ChevronDown className="h-5 w-5" aria-hidden />
          </button>
          <span className="my-1 h-px w-7 bg-white/15" aria-hidden />
          <button type="button" onClick={() => onSave(activeStory)} className={controlButtonClass} aria-label={saved ? "Remove saved short" : "Save short"} aria-pressed={saved}>
            <Bookmark className="h-5 w-5" weight={saved ? "fill" : "regular"} aria-hidden />
          </button>
          <button type="button" onClick={() => setMuted((value) => !value)} className={controlButtonClass} aria-label={muted ? "Unmute short" : "Mute short"} aria-pressed={!muted}>
            {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
          </button>
          <button type="button" onClick={togglePlayback} className={controlButtonClass} aria-label={playing ? "Pause short" : "Play short"} aria-pressed={playing}>
            {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="h-5 w-5" weight="fill" aria-hidden />}
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
