"use client";

import React from "react";
import Image from "next/image";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { AdaptiveVideo } from "@/components/adaptive-video";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Clock,
  EyeOff,
  MessageCircle,
  Play,
  X,
} from "@/components/ui/icons";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
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
        {playing && story.videoUrl ? (
          <AdaptiveVideo
            ref={videoRef}
            src={story.videoUrl}
            poster={story.image}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="h-full w-full bg-black object-contain"
            aria-label={`Play video: ${story.title}`}
            onLoadedMetadata={(event) => updateVideoOrientation(event.currentTarget)}
            onPlay={() => requestExclusiveVideoPlayback(surfaceId)}
            onPause={() => {
              setDocked(false);
              setPlaying(false);
            }}
            onEnded={() => {
              setDocked(false);
              setPlaying(false);
            }}
          />
        ) : (
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
              className="relative z-10 h-full w-full object-contain"
              preload={priority}
            />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/15 to-black/5" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                requestExclusiveVideoPlayback(surfaceId);
                setDockDismissed(false);
                setPlaying(true);
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
        )}
        {story.videoDuration ? (
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

export function VideoFeedLeadCard({
  story,
  saved,
  commentCount,
  onOpen,
  onSave,
  variant = "videoIndex",
  eyebrowLabel,
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  variant?: "videoIndex" | "hearstPlus";
  eyebrowLabel?: string;
}) {
  const useHearstPlusStyle = variant === "hearstPlus";

  return (
    <article className="group overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
      <VideoPlaySurface story={story} featured priority />
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            {eyebrowLabel ??
              (useHearstPlusStyle ? "Recommended video" : "Featured video")}
          </span>
          <LifestyleBrandSource story={story} />
          <LiveStoryBadge story={story} />
        </div>
        <button
          type="button"
          className="block text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={onOpen}
          aria-label={`Open story: ${story.title}`}
        >
          <h1
            className={cn(
              "text-balance",
              useHearstPlusStyle
                ? "headline text-3xl font-bold leading-tight text-[var(--hp-text-headline)] sm:text-4xl"
                : "text-3xl font-black leading-[1.02] tracking-[-0.025em] text-foreground sm:text-4xl"
            )}
          >
            {story.title}
          </h1>
        </button>
        <p
          className={cn(
            "mt-2 line-clamp-2 max-w-3xl text-base leading-7",
            useHearstPlusStyle
              ? "text-[var(--hp-text-secondary)]"
              : "text-muted-foreground"
          )}
        >
          {story.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved videos" : "Save video"}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0",
                saved ? "text-primary" : ""
              )}
            >
              <Bookmark
                className="h-4 w-4"
                weight={saved ? "fill" : "regular"}
                aria-hidden
              />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span>{commentCount}</span>
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-11 sm:h-7"
            onClick={onOpen}
          >
            Open story
          </Button>
        </div>
      </div>
    </article>
  );
}

export function VideoIndexCard({
  story,
  saved,
  commentCount,
  onOpen,
  onSave,
  onHide,
  variant = "videoIndex",
}: {
  story: LifestyleRiverStory;
  saved: boolean;
  commentCount: number;
  onOpen: () => void;
  onSave: () => void;
  onHide: () => void;
  variant?: "videoIndex" | "hearstPlus";
}) {
  const useHearstPlusStyle = variant === "hearstPlus";

  return (
    <article
      className="group overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50"
      data-story-module="river"
      data-story-id={story.id}
    >
      <VideoPlaySurface story={story} featured />
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          <BrandSourceIcon
            brand={story.brand}
            brandSlug={story.brandSlug}
            className="h-5 w-5"
          />
          <span className="truncate normal-case tracking-normal text-muted-foreground">
            {story.brand}
            {story.topic ? ` · ${story.topic}` : ""}
            {` · ${getLifestyleByline(story)}`}
          </span>
          <LiveStoryBadge story={story} />
        </div>
        <button
          type="button"
          className="block text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={onOpen}
        >
          <h3
            className={cn(
              "text-balance",
              useHearstPlusStyle
                ? "headline text-2xl font-bold leading-tight text-[var(--hp-text-headline)] sm:text-3xl"
                : "text-3xl font-black leading-[1.02] tracking-[-0.025em] text-foreground sm:text-4xl"
            )}
          >
            {story.title}
          </h3>
        </button>
        <p
          className={cn(
            "mt-2 line-clamp-2 max-w-3xl text-base leading-7",
            useHearstPlusStyle
              ? "text-[var(--hp-text-secondary)]"
              : "text-muted-foreground"
          )}
        >
          {story.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved videos" : "Save video"}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0",
                saved ? "text-primary" : ""
              )}
            >
              <Bookmark
                className="h-4 w-4"
                weight={saved ? "fill" : "regular"}
                aria-hidden
              />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span>{commentCount}</span>
            </button>
            <button
              type="button"
              onClick={onHide}
              aria-label="Hide video"
              className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-primary sm:min-h-0"
            >
              <EyeOff className="h-4 w-4" aria-hidden />
              <span>Hide</span>
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-11 sm:h-7"
            onClick={onOpen}
          >
            Open story
          </Button>
        </div>
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
        <span className="block text-xs font-semibold text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
          {story.brand}
        </span>
        <span className="mt-1 line-clamp-3 [display:-webkit-box] text-sm font-bold leading-snug text-foreground">
          {story.title}
        </span>
      </span>
    </button>
  );
}
