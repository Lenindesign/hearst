"use client";

import React from "react";
import Image from "next/image";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { AdaptiveVideo } from "@/components/adaptive-video";
import {
  Clock,
  Play,
  VolumeX,
  X,
} from "@/components/ui/icons";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { StorySaveIconButton } from "@/components/hearst-plus/story-actions";
import {
  getLifestyleByline,
  LifestyleBrandSource,
  LiveStoryBadge,
} from "@/components/hearst-plus/story-metadata";
import { formatVideoDuration } from "@/components/hearst-plus/video-format";
import { cn } from "@/lib/utils";

const videoPlaybackRequestedEvent = "hearst-plus-video-playback-requested";

function requestExclusiveVideoPlayback(surfaceId: string) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(videoPlaybackRequestedEvent, {
    detail: { surfaceId },
  }));
}

/**
 * Muted in-feed preview (LinkedIn-style): the single most visible video surface that is at least
 * PREVIEW_MIN_RATIO on screen plays muted without controls. Nothing previews while a video plays
 * with sound, when the reader prefers reduced motion, or when Save-Data is on.
 */
const PREVIEW_MIN_RATIO = 0.6;
const previewRatios = new Map<string, number>();
const fullPlaybackSurfaces = new Set<string>();
const previewListeners = new Set<() => void>();
let previewOwner: string | null = null;

function recomputePreviewOwner() {
  let next: string | null = null;
  if (fullPlaybackSurfaces.size === 0) {
    let best = PREVIEW_MIN_RATIO;
    for (const [id, ratio] of previewRatios) {
      if (ratio >= best) {
        best = ratio;
        next = id;
      }
    }
  }
  if (next === previewOwner) return;
  previewOwner = next;
  previewListeners.forEach((listener) => listener());
}

function subscribePreviewOwner(listener: () => void) {
  previewListeners.add(listener);
  return () => {
    previewListeners.delete(listener);
  };
}

function canAutoplayPreview() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !connection?.saveData;
}

export function VideoPlaySurface({
  story,
  featured = false,
  priority = false,
}: {
  story: LifestyleRiverStory;
  featured?: boolean;
  priority?: boolean;
}) {
  const surfaceId = React.useId();
  const [playing, setPlaying] = React.useState(false);
  const [docked, setDocked] = React.useState(false);
  const [dockDismissed, setDockDismissed] = React.useState(false);
  const [videoOrientation, setVideoOrientation] = React.useState<"landscape" | "portrait">("landscape");
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const isPreviewOwner = React.useSyncExternalStore(
    subscribePreviewOwner,
    () => previewOwner === surfaceId,
    () => false,
  );
  // Set when a preview ends or is refused; cleared when the surface leaves the viewport.
  const [previewSpent, setPreviewSpent] = React.useState(false);
  const resumeTimeRef = React.useRef(0);
  const previewing = !playing && isPreviewOwner && !previewSpent && Boolean(story.videoUrl);

  React.useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface || !story.videoUrl || !canAutoplayPreview()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        previewRatios.set(surfaceId, entry.intersectionRatio);
        if (entry.intersectionRatio === 0) setPreviewSpent(false);
        recomputePreviewOwner();
      },
      { threshold: [0, 0.25, 0.5, PREVIEW_MIN_RATIO, 0.75, 0.9, 1] },
    );
    observer.observe(surface);
    return () => {
      observer.disconnect();
      previewRatios.delete(surfaceId);
      recomputePreviewOwner();
    };
  }, [story.videoUrl, surfaceId]);

  React.useEffect(() => {
    if (!playing) return;
    fullPlaybackSurfaces.add(surfaceId);
    recomputePreviewOwner();
    return () => {
      fullPlaybackSurfaces.delete(surfaceId);
      recomputePreviewOwner();
    };
  }, [playing, surfaceId]);

  // Remember where the muted preview stopped so it resumes there when it scrolls back in.
  React.useEffect(() => {
    if (!previewing) return;
    const video = videoRef.current;
    return () => {
      if (video) resumeTimeRef.current = video.currentTime || resumeTimeRef.current;
    };
  }, [previewing]);

  const startFullPlayback = () => {
    requestExclusiveVideoPlayback(surfaceId);
    setDockDismissed(false);
    setPlaying(true);
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      void video.play().catch(() => undefined);
    }
  };

  React.useEffect(() => {
    if (!playing) return;

    const surface = surfaceRef.current;
    if (!surface) return;
    let dockFrame: number | null = null;

    const updateDockedState = (visibleRatio: number) => {
      if (dockDismissed) {
        setDocked(false);
        return;
      }

      if (visibleRatio < 0.22) {
        setDocked(true);
      } else if (visibleRatio > 0.72) {
        setDocked(false);
      }
    };

    const measureDockState = () => {
      dockFrame = null;
      const rect = surface.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
      const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
      const totalArea = Math.max(1, rect.width * rect.height);
      updateDockedState((visibleWidth * visibleHeight) / totalArea);
    };

    const scheduleDockMeasurement = () => {
      if (dockFrame !== null) return;
      dockFrame = window.requestAnimationFrame(measureDockState);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateDockedState(entry.intersectionRatio);
      },
      { threshold: [0, 0.22, 0.72, 1] },
    );

    observer.observe(surface);
    scheduleDockMeasurement();
    document.addEventListener("scroll", scheduleDockMeasurement, { capture: true, passive: true });
    window.addEventListener("resize", scheduleDockMeasurement);
    return () => {
      observer.disconnect();
      document.removeEventListener("scroll", scheduleDockMeasurement, { capture: true });
      window.removeEventListener("resize", scheduleDockMeasurement);
      if (dockFrame !== null) window.cancelAnimationFrame(dockFrame);
    };
  }, [dockDismissed, playing]);

  React.useEffect(() => {
    const stopIfAnotherVideoStarts = (event: Event) => {
      const requestedSurfaceId =
        event instanceof CustomEvent &&
        typeof event.detail?.surfaceId === "string"
          ? event.detail.surfaceId
          : null;

      if (requestedSurfaceId === surfaceId) return;

      videoRef.current?.pause();
      setDocked(false);
      setDockDismissed(false);
      setPlaying(false);
    };

    window.addEventListener(videoPlaybackRequestedEvent, stopIfAnotherVideoStarts);
    return () => {
      window.removeEventListener(videoPlaybackRequestedEvent, stopIfAnotherVideoStarts);
    };
  }, [surfaceId]);

  const stopDockedVideo = () => {
    videoRef.current?.pause();
    setDockDismissed(true);
    setDocked(false);
    setPlaying(false);
  };
  const updateVideoOrientation = (video: HTMLVideoElement) => {
    if (!video.videoWidth || !video.videoHeight) return;
    setVideoOrientation(video.videoHeight > video.videoWidth ? "portrait" : "landscape");
  };

  return (
    <div
      ref={surfaceRef}
      className={cn(
        "relative min-w-0 bg-black",
        featured ? "aspect-video rounded-t-[8px]" : "aspect-video rounded-[6px]"
      )}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      data-video-play-surface
      data-video-docked={docked ? "true" : undefined}
    >
      <div
        className={cn(
          "overflow-hidden bg-black transition-[border-radius,box-shadow,transform] duration-300 ease-out motion-reduce:transition-none",
          docked
            ? cn(
                "fixed bottom-4 right-4 z-50 h-auto rounded-[10px] shadow-2xl ring-1 ring-white/20 sm:bottom-6 sm:right-6",
                videoOrientation === "portrait"
                  ? "aspect-[9/16] w-[min(220px,calc(100vw-2rem))]"
                  : "aspect-video w-[min(360px,calc(100vw-2rem))] sm:w-[380px]"
              )
            : cn("absolute inset-0", featured ? "rounded-t-[8px]" : "rounded-[6px]")
        )}
        data-video-orientation={videoOrientation}
        data-video-dock-surface={docked ? "floating" : "inline"}
      >
        {(playing || previewing) && story.videoUrl ? (
          <AdaptiveVideo
            ref={videoRef}
            src={story.videoUrl}
            poster={story.image}
            controls={playing}
            muted={!playing}
            autoPlay
            playsInline
            preload="metadata"
            className="h-full w-full bg-black object-contain"
            aria-label={playing ? `Play video: ${story.title}` : `Muted preview: ${story.title}`}
            onLoadedMetadata={(event) => {
              updateVideoOrientation(event.currentTarget);
              const resumeAt = resumeTimeRef.current;
              if (resumeAt > 0 && resumeAt < (event.currentTarget.duration || 0) - 1) {
                event.currentTarget.currentTime = resumeAt;
              }
            }}
            onAutoplayBlocked={() => {
              if (!playing) setPreviewSpent(true);
            }}
            onPlay={() => {
              if (playing) requestExclusiveVideoPlayback(surfaceId);
            }}
            // Keep the video element mounted on pause. Native controls emit pause
            // while seeking, and unmounting here would reset playback to 0.
            onPause={() => setDocked(false)}
            onEnded={() => {
              resumeTimeRef.current = 0;
              if (!playing) {
                setPreviewSpent(true);
                return;
              }
              setDocked(false);
              setPlaying(false);
            }}
          />
        ) : null}
        {previewing ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                startFullPlayback();
              }}
              className="absolute inset-0 z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
              aria-label={`Play video with sound: ${story.title}`}
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                startFullPlayback();
              }}
              className="absolute bottom-3 right-3 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white shadow-sm transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={`Unmute video: ${story.title}`}
            >
              <VolumeX className="h-5 w-5" aria-hidden />
            </button>
          </>
        ) : null}
        {!playing && !previewing ? (
          <>
            <Image
              src={story.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="scale-110 object-cover opacity-60 blur-xl"
              aria-hidden
            />
            <Image
              src={story.image}
              alt=""
              width={1200}
              height={675}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="relative z-10 h-full w-full object-contain transition-transform duration-200 group-hover/video-card:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/video-card:scale-100"
              preload={priority}
            />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/15 to-black/5" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                startFullPlayback();
              }}
              className={cn(
                "absolute z-30 inline-flex items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/80 motion-reduce:transition-none",
                featured ? "bottom-5 left-5 h-14 w-14" : "left-3 top-3 h-11 w-11"
              )}
              aria-label={`Play video: ${story.title}`}
            >
              <Play
                className={cn(
                  "ml-0.5 fill-current",
                  featured ? "h-6 w-6" : "h-4 w-4"
                )}
                aria-hidden
              />
            </button>
          </>
        ) : null}
        {/* Poster affordance only: once playing, the native controls show the time and hide on roll-out. */}
        {story.videoDuration && !playing && !previewing ? (
          <span className="pointer-events-none absolute right-3 top-3 z-30 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
            <Clock className="h-3 w-3" aria-hidden />
            {formatVideoDuration(story.videoDuration)}
          </span>
        ) : null}
        {docked ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              stopDockedVideo();
            }}
            className="absolute right-2 top-2 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/75 text-white shadow-sm transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label={`Close mini player for ${story.title}`}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// Video cards carry no per-card action row (Save, comments, Hide, Open story); the play surface and
// title open the story, and those actions live in the reader.
export function VideoFeedLeadCard({
  story,
  onOpen,
  variant = "videoIndex",
  eyebrowLabel,
  headingLevel = "h1",
}: {
  story: LifestyleRiverStory;
  onOpen: () => void;
  variant?: "videoIndex" | "hearstPlus";
  eyebrowLabel?: string;
  headingLevel?: "h1" | "h2";
}) {
  const useHearstPlusStyle = variant === "hearstPlus";
  const Headline = headingLevel;

  return (
    <article className="group/video-card overflow-hidden rounded-card border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
      <VideoPlaySurface story={story} featured priority />
      <div className="story-card-content p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="type-k1 text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            {eyebrowLabel ??
              (useHearstPlusStyle ? "Recommended video" : "Featured video")}
          </span>
          <LifestyleBrandSource story={story} />
          <LiveStoryBadge story={story} />
        </div>
        <button
          type="button"
          className="block cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={onOpen}
          aria-label={`Open story: ${story.title}`}
        >
          <Headline
            className={cn(
              "type-t2 underline-offset-4 group-hover/video-card:underline group-focus-visible/video-card:underline",
              useHearstPlusStyle
                ? "headline font-bold text-[var(--hp-text-headline)]"
                : "font-black text-foreground"
            )}
          >
            {story.title}
          </Headline>
        </button>
        <p
          className={cn(
            "type-d2 mt-2 line-clamp-2 max-w-3xl",
            useHearstPlusStyle
              ? "text-[var(--hp-text-secondary)]"
              : "text-muted-foreground"
          )}
        >
          {story.summary}
        </p>
      </div>
    </article>
  );
}

export function VideoIndexCard({
  story,
  onOpen,
  saved,
  onSave,
  variant = "videoIndex",
  compact = false,
}: {
  story: LifestyleRiverStory;
  onOpen: () => void;
  saved?: boolean;
  onSave?: () => void;
  variant?: "videoIndex" | "hearstPlus";
  compact?: boolean;
}) {
  const useHearstPlusStyle = variant === "hearstPlus";

  return (
    <article
      className="group/video-card overflow-hidden rounded-card border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors"
      data-story-module="river"
      data-story-id={story.id}
      data-story-brand={story.brandSlug}
    >
      <VideoPlaySurface story={story} featured />
      <div className={compact ? "p-3" : "p-4 sm:p-5"}>
        <div className="type-m1 relative z-20 mb-2 flex min-w-0 flex-wrap items-center gap-2 text-primary">
          <BrandSourceIcon
            brand={story.brand}
            brandSlug={story.brandSlug}
            className="h-5 w-5"
          />
          <span className="min-w-0 flex-1 truncate text-muted-foreground">
            {story.brand}
            {story.topic ? ` · ${story.topic}` : ""}
            {` · ${getLifestyleByline(story)}`}
          </span>
          <LiveStoryBadge story={story} />
          {onSave && saved !== undefined ? (
            <StorySaveIconButton saved={saved} onSave={onSave} className="ml-auto" />
          ) : null}
        </div>
        <button
          type="button"
          className="block cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={onOpen}
        >
          <h3
            className={cn(
              "underline-offset-4 group-hover/video-card:underline group-focus-visible/video-card:underline",
              compact
                ? "headline type-t5 line-clamp-3 font-bold text-[var(--hp-text-headline)]"
                : useHearstPlusStyle
                  ? "headline type-t3 font-bold text-[var(--hp-text-headline)]"
                  : "type-t3 font-black text-foreground"
            )}
          >
            {story.title}
          </h3>
        </button>
        <p
          className={cn(
            "mt-2 line-clamp-2 max-w-3xl",
            compact ? "type-b2" : "type-d2",
            useHearstPlusStyle
              ? "text-[var(--hp-text-secondary)]"
              : "text-muted-foreground"
          )}
        >
          {story.summary}
        </p>
      </div>
    </article>
  );
}

export function VideoRailCard({
  story,
  onOpen,
  rank,
}: {
  story: LifestyleRiverStory;
  onOpen: () => void;
  rank?: number;
}) {
  return (
    <button
      type="button"
      className="group grid w-full grid-cols-[96px_minmax(0,1fr)] gap-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
      onClick={onOpen}
      aria-label={
        rank
          ? `Trending video ${rank}: ${story.title}`
          : `Open video: ${story.title}`
      }
    >
      <span className="relative aspect-video overflow-hidden rounded-[6px] bg-muted">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
        />
        {rank ? (
          <span className="absolute left-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black tabular-nums text-primary-foreground shadow-sm">
            {rank}
          </span>
        ) : null}
        {story.videoDuration ? (
          <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
            {formatVideoDuration(story.videoDuration)}
          </span>
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="type-m1 block text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
          {story.brand}
        </span>
        <span className="type-t6 mt-1 line-clamp-3 [display:-webkit-box] text-foreground">
          {story.title}
        </span>
      </span>
    </button>
  );
}
