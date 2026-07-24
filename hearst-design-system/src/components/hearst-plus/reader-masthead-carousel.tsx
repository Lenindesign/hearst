"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ReaderMastheadCarouselProps {
  activeKey?: string;
  children: React.ReactNode;
  className?: string;
}

export function ReaderMastheadCarousel({
  activeKey,
  children,
  className,
}: ReaderMastheadCarouselProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = React.useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollState = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maximumScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const nextState = {
      canScrollLeft: viewport.scrollLeft > 1,
      canScrollRight: viewport.scrollLeft < maximumScrollLeft - 1,
    };
    setScrollState((current) =>
      current.canScrollLeft === nextState.canScrollLeft
      && current.canScrollRight === nextState.canScrollRight
        ? current
        : nextState
    );
  }, []);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const frame = window.requestAnimationFrame(updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(viewport);
    viewport.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", updateScrollState);
    };
  }, [children, updateScrollState]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !activeKey) return;

    const frame = window.requestAnimationFrame(() => {
      const activeItem = Array.from(
        viewport.querySelectorAll<HTMLElement>("[data-reader-masthead-key]")
      ).find((item) => item.dataset.readerMastheadKey === activeKey);
      if (!activeItem) return;

      const viewportRect = viewport.getBoundingClientRect();
      const activeItemRect = activeItem.getBoundingClientRect();
      const activeItemCenter = viewport.scrollLeft
        + activeItemRect.left
        - viewportRect.left
        + activeItemRect.width / 2;
      const targetLeft = activeItemCenter - viewport.clientWidth / 2;
      viewport.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeKey]);

  const scrollByPage = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({
      left: direction * Math.max(180, viewport.clientWidth * 0.72),
      behavior: "smooth",
    });
  };

  return (
    <nav
      className={cn("ml-auto hidden min-w-0 flex-1 items-center gap-1 lg:flex", className)}
      aria-label="Other Hearst sections"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-7 w-7 shrink-0"
        disabled={!scrollState.canScrollLeft}
        onClick={() => scrollByPage(-1)}
        aria-label="Previous Hearst publications"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </Button>
      <div
        ref={viewportRef}
        className="min-w-0 flex-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max items-center gap-5 px-1">
          {children}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-7 w-7 shrink-0"
        disabled={!scrollState.canScrollRight}
        onClick={() => scrollByPage(1)}
        aria-label="Next Hearst publications"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Button>
    </nav>
  );
}
