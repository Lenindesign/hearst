"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { Bookmark, ChevronLeft, ChevronRight, Info, Pause, Play, Plus, X } from "@/components/ui/icons";
import { useModalIsolation } from "@/components/ui/use-modal-isolation";
import { cn } from "@/lib/utils";
import type { ReaderArticleImage, ReaderArticleLoadState } from "./reader-article-body";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export type FullscreenReaderImage = ReaderArticleImage;

export type FullscreenGalleryState = {
  story: LifestyleRiverStory;
  images: FullscreenReaderImage[];
  initialIndex: number;
};

export function getFullscreenReaderImages(
  story: LifestyleRiverStory,
  liveArticle?: ReaderArticleLoadState,
) {
  const images: FullscreenReaderImage[] = [{
    src: story.image,
    alt: `${story.brand}: ${story.title}`,
  }];

  if (liveArticle?.status === "ready") {
    liveArticle.data.blocks.forEach((block) => {
      if (block.type !== "image" || images.some((image) => image.src === block.url)) return;
      images.push({
        src: block.url,
        alt: block.alt,
        caption: block.caption,
        credit: block.credit,
      });
    });
  }

  return images;
}

export interface FullscreenImageViewerProps {
  gallery: FullscreenGalleryState;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onMoreLikeThis: () => void;
}

type SwipeStartState = {
  x: number;
  y: number;
  time: number;
};

type DragStartState = SwipeStartState & {
  offsetX: number;
  offsetY: number;
};

export function FullscreenImageViewer({
  gallery,
  saved,
  onClose,
  onSave,
  onMoreLikeThis,
}: FullscreenImageViewerProps) {
  const [returnFocusElement] = React.useState<HTMLElement | null>(() => {
    if (
      typeof document === "undefined"
      || !(document.activeElement instanceof HTMLElement)
      || document.activeElement === document.body
    ) return null;

    return document.activeElement;
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const wheelStageRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(gallery.initialIndex);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [zoomOrigin, setZoomOrigin] = React.useState("50% 50%");
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const [captionOpen, setCaptionOpen] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const controlsTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerPositionsRef = React.useRef(new Map<number, { x: number; y: number }>());
  const swipeStartRef = React.useRef<SwipeStartState | null>(null);
  const swipeLastRef = React.useRef<{ x: number; y: number } | null>(null);
  const dragStartRef = React.useRef<DragStartState | null>(null);
  const pinchStartRef = React.useRef<{ distance: number; zoom: number } | null>(null);
  const lastTapRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const wheelGestureRef = React.useRef<{ offsetX: number; lastTime: number } | null>(null);
  const wheelResetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelCooldownUntilRef = React.useRef(0);
  const activeImage = gallery.images[activeIndex] ?? gallery.images[0];
  const hasMultipleImages = gallery.images.length > 1;
  const adjacentPreloadSources = React.useMemo(() => {
    if (!hasMultipleImages) return [];

    return [
      gallery.images[activeIndex - 1]?.src,
      gallery.images[activeIndex + 1]?.src,
    ].filter((src): src is string => Boolean(src));
  }, [activeIndex, gallery.images, hasMultipleImages]);
  useModalIsolation(true, dialogRef);

  const resetTransform = React.useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setZoomOrigin("50% 50%");
  }, []);

  const resetSwipe = React.useCallback(() => {
    swipeStartRef.current = null;
    swipeLastRef.current = null;
    dragStartRef.current = null;
    pinchStartRef.current = null;
    wheelGestureRef.current = null;
    if (wheelResetTimerRef.current) {
      clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = null;
    }
    setIsDragging(false);
    setDragOffset(0);
  }, []);

  const selectImage = React.useCallback((nextIndex: number) => {
    const normalizedIndex = (nextIndex + gallery.images.length) % gallery.images.length;
    if (normalizedIndex === activeIndex) return;
    setActiveIndex(normalizedIndex);
    resetSwipe();
    resetTransform();
  }, [activeIndex, gallery.images.length, resetSwipe, resetTransform]);

  const showControls = React.useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (!captionOpen) setControlsVisible(false);
    }, 2800);
  }, [captionOpen]);

  const setClampedZoom = React.useCallback((nextZoom: number) => {
    const clampedZoom = Math.min(4, Math.max(1, nextZoom));
    setZoom(clampedZoom);
    if (clampedZoom === 1) setOffset({ x: 0, y: 0 });
  }, []);

  const toggleTapZoom = React.useCallback((clientX: number, clientY: number) => {
    if (zoom <= 1) {
      setZoomOrigin(`${(clientX / window.innerWidth) * 100}% ${(clientY / window.innerHeight) * 100}%`);
    }
    setClampedZoom(zoom > 1 ? 1 : 2.5);
    if (zoom > 1) {
      setOffset({ x: 0, y: 0 });
      setZoomOrigin("50% 50%");
    }
  }, [setClampedZoom, zoom]);

  React.useEffect(() => {
    if (playing) return;
    const frame = window.requestAnimationFrame(showControls);
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, playing, showControls]);

  React.useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
    };
  }, []);

  React.useEffect(() => () => {
    if (!returnFocusElement) return;

    window.requestAnimationFrame(() => {
      if (
        returnFocusElement.isConnected
        && returnFocusElement.getClientRects().length > 0
        && !returnFocusElement.closest("[inert]")
      ) {
        returnFocusElement.focus();
      }
    });
  }, [returnFocusElement]);

  React.useEffect(() => {
    if (!playing || prefersReducedMotion || !hasMultipleImages) return;
    const intervalId = window.setInterval(() => selectImage(activeIndex + 1), 6500);
    return () => window.clearInterval(intervalId);
  }, [activeIndex, hasMultipleImages, playing, prefersReducedMotion, selectImage]);

  React.useEffect(() => {
    if (typeof window === "undefined" || adjacentPreloadSources.length === 0) return;

    adjacentPreloadSources.forEach((src) => {
      const preloadImage = new window.Image();
      preloadImage.decoding = "async";
      preloadImage.src = src;
    });
  }, [adjacentPreloadSources]);

  const getPointerDistance = React.useCallback(() => {
    const points = Array.from(pointerPositionsRef.current.values());
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }, []);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    showControls();
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    swipeLastRef.current = { x: event.clientX, y: event.clientY };

    if (pointerPositionsRef.current.size === 1) {
      if (zoom > 1) {
        dragStartRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: event.timeStamp,
          offsetX: offset.x,
          offsetY: offset.y,
        };
      } else {
        swipeStartRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: event.timeStamp,
        };
        setIsDragging(true);
      }
    } else if (pointerPositionsRef.current.size === 2) {
      pinchStartRef.current = { distance: getPointerDistance(), zoom };
    }
  }, [getPointerDistance, offset.x, offset.y, showControls, zoom]);

  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerPositionsRef.current.has(event.pointerId)) return;
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    swipeLastRef.current = { x: event.clientX, y: event.clientY };

    if (pointerPositionsRef.current.size === 2 && pinchStartRef.current) {
      const ratio = getPointerDistance() / Math.max(1, pinchStartRef.current.distance);
      setClampedZoom(pinchStartRef.current.zoom * ratio);
      return;
    }

    if (zoom > 1 && dragStartRef.current) {
      event.preventDefault();
      setOffset({
        x: dragStartRef.current.offsetX + (event.clientX - dragStartRef.current.x),
        y: dragStartRef.current.offsetY + (event.clientY - dragStartRef.current.y),
      });
      return;
    }

    const start = swipeStartRef.current;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15) return;

    event.preventDefault();
    const maxOffset = event.currentTarget.clientWidth * 0.22;
    setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
  }, [getPointerDistance, setClampedZoom, zoom]);

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    const dragStart = dragStartRef.current;
    const end = swipeLastRef.current ?? {
      x: event.clientX,
      y: event.clientY,
    };
    const origin = start ?? dragStart;

    if (!origin) {
      if (event.currentTarget.releasePointerCapture) {
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore release errors from unsupported test environments.
        }
      }
      pointerPositionsRef.current.delete(event.pointerId);
      if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
      if (pointerPositionsRef.current.size === 0) swipeStartRef.current = null;
      return;
    }

    const deltaX = end.x - origin.x;
    const deltaY = end.y - origin.y;
    const elapsed = Math.max(event.timeStamp - origin.time, 1);

    if (zoom > 1 && dragStart) {
      const isTap = Math.hypot(deltaX, deltaY) < 12 && elapsed < 360;
      if (isTap) {
        const lastTap = lastTapRef.current;
        const isDoubleTap = Boolean(
          lastTap
          && event.timeStamp - lastTap.time < 320
          && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 44,
        );
        if (isDoubleTap) {
          toggleTapZoom(event.clientX, event.clientY);
          lastTapRef.current = null;
        } else {
          showControls();
          lastTapRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
        }
      }
    } else if (start) {
      const velocity = Math.abs(deltaX) / elapsed;
      const threshold = Math.min(64, event.currentTarget.clientWidth * 0.14);
      const isHorizontalSwipe =
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2 &&
        (Math.abs(deltaX) >= threshold ||
          (Math.abs(deltaX) >= 24 && velocity >= 0.45));

      if (isHorizontalSwipe && hasMultipleImages) {
        selectImage(activeIndex + (deltaX < 0 ? 1 : -1));
      } else {
        const isTap = Math.hypot(deltaX, deltaY) < 12 && elapsed < 360;
        if (isTap) {
          const lastTap = lastTapRef.current;
          const isDoubleTap = Boolean(
            lastTap
            && event.timeStamp - lastTap.time < 320
            && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 44,
          );
          if (isDoubleTap) {
            toggleTapZoom(event.clientX, event.clientY);
            lastTapRef.current = null;
          } else {
            showControls();
            lastTapRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
          }
        }
      }
      setDragOffset(0);
      setIsDragging(false);
    }

    if (event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors from unsupported test environments.
      }
    }
    pointerPositionsRef.current.delete(event.pointerId);
    if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
    if (pointerPositionsRef.current.size === 0) {
      swipeStartRef.current = null;
      dragStartRef.current = null;
    }
  }, [activeIndex, hasMultipleImages, selectImage, showControls, toggleTapZoom, zoom]);

  const handlePointerCancel = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors from unsupported test environments.
      }
    }
    pointerPositionsRef.current.delete(event.pointerId);
    if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
    if (pointerPositionsRef.current.size === 0) {
      resetSwipe();
    }
  }, [resetSwipe]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && hasMultipleImages) selectImage(activeIndex - 1);
      if (event.key === "ArrowRight" && hasMultipleImages) selectImage(activeIndex + 1);
      if (event.key === "+" || event.key === "=") setClampedZoom(zoom + 0.35);
      if (event.key === "-") setClampedZoom(zoom - 0.35);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, hasMultipleImages, onClose, selectImage, setClampedZoom, zoom]);

  const handleWheel = React.useCallback((event: WheelEvent) => {
    const width = wheelStageRef.current?.clientWidth ?? window.innerWidth;
    const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width : 1;
    const deltaX = event.deltaX * deltaScale;
    const deltaY = event.deltaY * deltaScale;
    const isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 4;

    if (!isHorizontalGesture || zoom > 1 || !hasMultipleImages) {
      event.preventDefault();
      setClampedZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
      return;
    }

    event.preventDefault();
    showControls();

    const now = performance.now();
    if (now < wheelCooldownUntilRef.current) return;

    if (!wheelGestureRef.current || now - wheelGestureRef.current.lastTime > 240) {
      wheelGestureRef.current = { offsetX: 0, lastTime: now };
    }

    wheelGestureRef.current.offsetX += deltaX;
    wheelGestureRef.current.lastTime = now;

    const threshold = Math.min(64, width * 0.14);
    const maxOffset = width * 0.22;
    const visualOffset = Math.max(-maxOffset, Math.min(maxOffset, -wheelGestureRef.current.offsetX));
    setIsDragging(true);
    setDragOffset(visualOffset);

    if (Math.abs(wheelGestureRef.current.offsetX) >= threshold) {
      const direction = wheelGestureRef.current.offsetX > 0 ? 1 : -1;
      wheelCooldownUntilRef.current = now + 650;
      selectImage(activeIndex + direction);
      return;
    }

    if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
    wheelResetTimerRef.current = setTimeout(() => {
      wheelGestureRef.current = null;
      wheelResetTimerRef.current = null;
      setIsDragging(false);
      setDragOffset(0);
    }, 180);
  }, [activeIndex, hasMultipleImages, selectImage, setClampedZoom, showControls, zoom]);

  React.useEffect(() => {
    const stage = wheelStageRef.current;
    if (!stage) return;

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const chromeVisible = controlsVisible || captionOpen;
  const controlButtonClass =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-black/35 px-3 text-sm font-semibold text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-black/55 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 sm:h-9 sm:min-w-9";
  const slideTransitionClass = isDragging || zoom > 1
    ? "transition-none"
    : "transition-transform duration-300 ease-out motion-reduce:transition-none";
  const trackTransform = `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`;

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[240] flex touch-none items-center justify-center overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`Fullscreen gallery for ${gallery.story.title}`}
      onMouseMove={showControls}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={wheelStageRef}
        data-testid="fullscreen-image-track"
        className="absolute inset-0 h-full w-full overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={cn(
            "flex h-full w-full",
            slideTransitionClass,
          )}
          style={{ transform: trackTransform }}
        >
          {gallery.images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={image.src}
                className="relative h-full w-full shrink-0 overflow-hidden"
                aria-hidden={!isActive}
              >
                <Image
                  src={image.src}
                  alt={isActive ? image.alt : ""}
                  fill
                  sizes="100vw"
                  preload={isActive}
                  className={cn(
                    "select-none object-contain",
                    isActive && (zoom > 1 ? "cursor-grab active:cursor-grabbing" : hasMultipleImages ? "cursor-ew-resize" : "cursor-zoom-in"),
                  )}
                  style={{
                    transform: isActive
                      ? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`
                      : undefined,
                    transformOrigin: zoomOrigin,
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn(
        "pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-3 transition-opacity duration-300 motion-reduce:transition-none",
        chromeVisible ? "opacity-100" : "opacity-0",
      )}>
        <div className="pointer-events-auto inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-black/35 px-3 text-sm font-semibold text-white/80 ring-1 ring-inset ring-white/15">
          {activeIndex + 1} of {gallery.images.length}
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className={cn(controlButtonClass, "max-sm:px-0")}
            onClick={onSave}
            aria-pressed={saved}
            aria-label={saved ? "Remove saved story" : "Save story"}
          >
            <Bookmark className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
            <span className="max-sm:sr-only">{saved ? "Saved" : "Save story"}</span>
          </button>
          <button
            type="button"
            className={cn(controlButtonClass, "max-sm:px-0")}
            onClick={onMoreLikeThis}
            aria-label="More like this"
          >
            <Plus className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
            <span className="max-sm:sr-only">More like this</span>
          </button>
          <button type="button" className={controlButtonClass} onClick={() => setClampedZoom(zoom - 0.35)} aria-label="Zoom out">−</button>
          <button type="button" className={controlButtonClass} onClick={() => setClampedZoom(zoom + 0.35)} aria-label="Zoom in">+</button>
          {hasMultipleImages ? (
            <button
              type="button"
              className={controlButtonClass}
              onClick={() => setPlaying((value) => !value)}
              aria-label={prefersReducedMotion
                ? "Slideshow disabled because reduced motion is enabled"
                : playing
                  ? "Pause slideshow"
                  : "Play slideshow"}
              aria-pressed={playing}
              disabled={prefersReducedMotion}
            >
              {playing
                ? <Pause className="h-4 w-4" aria-hidden="true" />
                : <Play className="h-4 w-4" aria-hidden="true" />}
            </button>
          ) : null}
          {activeImage.caption || activeImage.credit ? (
            <button
              type="button"
              className={controlButtonClass}
              onClick={() => setCaptionOpen((value) => !value)}
              aria-label="Show caption and credit"
              aria-expanded={captionOpen}
            >
              <Info className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            className={controlButtonClass}
            onClick={onClose}
            aria-label="Close fullscreen gallery"
            autoFocus
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            className={cn(
              controlButtonClass,
              "absolute left-4 top-1/2 -translate-y-1/2 px-0 transition-opacity duration-300 motion-reduce:transition-none",
              chromeVisible ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            onClick={() => selectImage(activeIndex - 1)}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn(
              controlButtonClass,
              "absolute right-4 top-1/2 -translate-y-1/2 px-0 transition-opacity duration-300 motion-reduce:transition-none",
              chromeVisible ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            onClick={() => selectImage(activeIndex + 1)}
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className={cn(
        "pointer-events-none absolute inset-x-4 bottom-4 flex flex-col items-center gap-3 transition-opacity duration-300 motion-reduce:transition-none",
        chromeVisible ? "opacity-100" : "opacity-0",
      )}>
        {captionOpen && (activeImage.caption || activeImage.credit) ? (
          <div className="pointer-events-auto w-full max-w-3xl bg-black/55 px-4 py-3 text-center text-sm leading-6 text-white/85 backdrop-blur-sm">
            {activeImage.caption ? <p>{activeImage.caption}</p> : null}
            {activeImage.credit ? <p className="mt-1 text-xs text-white/60">Photo: {activeImage.credit}</p> : null}
          </div>
        ) : null}
        {hasMultipleImages ? (
          <div className="pointer-events-auto flex max-w-full snap-x snap-mandatory gap-2 overflow-x-auto rounded-[8px] bg-black/35 p-2 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={cn(
                  "relative h-12 w-16 shrink-0 snap-start overflow-hidden rounded-[4px] ring-1 ring-inset transition-opacity motion-reduce:transition-none",
                  index === activeIndex ? "ring-white opacity-100" : "ring-white/20 opacity-55 hover:opacity-90",
                )}
                onClick={() => selectImage(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
        <p className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white/65 backdrop-blur-sm">
          {zoom > 1 ? "Drag to pan · double-tap to reset" : "Double-tap or pinch to zoom"}
        </p>
      </div>
    </div>,
    document.body,
  );
}
