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
  const [activeIndex, setActiveIndex] = React.useState(gallery.initialIndex);
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [zoomOrigin, setZoomOrigin] = React.useState("50% 50%");
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const [captionOpen, setCaptionOpen] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [imageVisible, setImageVisible] = React.useState(true);
  const controlsTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerPositionsRef = React.useRef(new Map<number, { x: number; y: number }>());
  const dragStartRef = React.useRef<{
    x: number;
    y: number;
    time: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const pinchStartRef = React.useRef<{ distance: number; zoom: number } | null>(null);
  const lastTapRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const activeImage = gallery.images[activeIndex] ?? gallery.images[0];
  const hasMultipleImages = gallery.images.length > 1;
  useModalIsolation(true, dialogRef);

  const resetTransform = React.useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setZoomOrigin("50% 50%");
  }, []);

  const selectImage = React.useCallback((nextIndex: number) => {
    const normalizedIndex = (nextIndex + gallery.images.length) % gallery.images.length;
    if (normalizedIndex === activeIndex) return;
    if (prefersReducedMotion) {
      setActiveIndex(normalizedIndex);
      resetTransform();
      setImageVisible(true);
      return;
    }
    setImageVisible(false);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setActiveIndex(normalizedIndex);
      resetTransform();
      window.requestAnimationFrame(() => setImageVisible(true));
    }, 180);
  }, [activeIndex, gallery.images.length, prefersReducedMotion, resetTransform]);

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
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
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

  const getPointerDistance = () => {
    const points = Array.from(pointerPositionsRef.current.values());
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointerPositionsRef.current.size === 1) {
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        offsetX: offset.x,
        offsetY: offset.y,
      };
    } else if (pointerPositionsRef.current.size === 2) {
      pinchStartRef.current = { distance: getPointerDistance(), zoom };
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!pointerPositionsRef.current.has(event.pointerId)) return;
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointerPositionsRef.current.size === 2 && pinchStartRef.current) {
      const ratio = getPointerDistance() / Math.max(1, pinchStartRef.current.distance);
      setClampedZoom(pinchStartRef.current.zoom * ratio);
      return;
    }
    if (zoom > 1 && dragStartRef.current) {
      setOffset({
        x: dragStartRef.current.offsetX + event.clientX - dragStartRef.current.x,
        y: dragStartRef.current.offsetY + event.clientY - dragStartRef.current.y,
      });
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
    const dragStart = dragStartRef.current;
    if (pointerPositionsRef.current.size === 1 && zoom === 1 && dragStart && hasMultipleImages) {
      const distanceX = event.clientX - dragStart.x;
      const distanceY = event.clientY - dragStart.y;
      if (Math.abs(distanceX) > 70 && Math.abs(distanceX) > Math.abs(distanceY) * 1.35) {
        selectImage(activeIndex + (distanceX < 0 ? 1 : -1));
      }
    }
    if (pointerPositionsRef.current.size === 1 && dragStart) {
      const distanceX = event.clientX - dragStart.x;
      const distanceY = event.clientY - dragStart.y;
      const isTap = Math.hypot(distanceX, distanceY) < 12 && event.timeStamp - dragStart.time < 360;
      const lastTap = lastTapRef.current;
      const isDoubleTap = Boolean(
        isTap
        && lastTap
        && event.timeStamp - lastTap.time < 320
        && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 44
      );
      if (isDoubleTap) {
        toggleTapZoom(event.clientX, event.clientY);
        lastTapRef.current = null;
      } else if (isTap) {
        showControls();
        lastTapRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
      }
    }
    pointerPositionsRef.current.delete(event.pointerId);
    if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
    if (pointerPositionsRef.current.size === 0) dragStartRef.current = null;
  };

  const chromeVisible = controlsVisible || captionOpen;
  const controlButtonClass =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-black/35 px-3 text-sm font-semibold text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-black/55 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 sm:h-9 sm:min-w-9";

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
      <Image
        key={activeImage.src}
        src={activeImage.src}
        alt={activeImage.alt}
        fill
        sizes="100vw"
        preload
        className={cn(
          "select-none object-contain transition-opacity duration-700 ease-out motion-reduce:transition-none",
          zoom > 1 ? "cursor-grab active:cursor-grabbing" : hasMultipleImages ? "cursor-ew-resize" : "cursor-zoom-in",
          imageVisible ? "opacity-100" : "opacity-0",
        )}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
          transformOrigin: zoomOrigin,
        }}
        draggable={false}
        onWheel={(event) => {
          event.preventDefault();
          setClampedZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

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
          <div className="pointer-events-auto flex max-w-full gap-2 overflow-x-auto rounded-[8px] bg-black/35 p-2 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={cn(
                  "relative h-12 w-16 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-inset transition-opacity motion-reduce:transition-none",
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
