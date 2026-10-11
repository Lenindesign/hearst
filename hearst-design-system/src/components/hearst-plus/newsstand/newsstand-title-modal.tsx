"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "@/components/ui/icons";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { PRINT_SLUGS, PRINT_SUBSCRIBE_URL, TITLES, TITLE_SLUGS, appRoute, coverSrc, logoSrc } from "./newsstand-catalog";

type Props = {
  slug: string;
  offerLine: string;
  primaryButton: string;
  onStartTrial(): void;
  onClose(): void;
};

/* eslint-disable @next/next/no-img-element */
// The modal is a slider over every title: it opens on the picked magazine, and arrows, arrow keys or a sideways
// swipe on the cover move through the rest of the newsstand.
export function NewsstandTitleModal({ slug: initialSlug, offerLine, primaryButton, onStartTrial, onClose }: Props) {
  const [position, setPosition] = useState(() => Math.max(0, TITLE_SLUGS.indexOf(initialSlug)));
  const [direction, setDirection] = useState<1 | -1>(1);
  const slug = TITLE_SLUGS[position];
  const go = useCallback((delta: 1 | -1) => {
    setDirection(delta);
    setPosition((current) => (current + delta + TITLE_SLUGS.length) % TITLE_SLUGS.length);
  }, []);
  const portalTarget = useBodyPortalTarget();
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const skipRestoreRef = useRef(false);
  const dragRef = useRef<{ x: number; y: number; dx: number; dy: number; axis: "x" | "y" | null } | null>(null);
  const title = TITLES[slug];
  const cover = coverSrc(slug);
  const appHref = appRoute(slug);
  // The portal renders outside ThemeProvider's wrapper, so carry the page's brand tokens onto the overlay.
  const [theme] = useState(() => {
    const el = document.querySelector<HTMLElement>("[data-brand]");
    return { brand: el?.dataset.brand, style: el?.getAttribute("style") ?? "" };
  });
  const overlayRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { overlayRef.current?.setAttribute("style", theme.style); }, [theme]);

  useModalIsolation(true, dialogRef);

  useEffect(() => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      const target = restoreFocusRef.current;
      if (!skipRestoreRef.current) requestAnimationFrame(() => target?.focus());
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        go(event.key === "ArrowRight" ? 1 : -1);
        return;
      }
      if (event.key !== "Tab") return;
      const layer = overlayRef.current;
      if (!layer) return;
      const focusable = Array.from(layer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) { event.preventDefault(); return; }
      const first = focusable[0], last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", onKeyDown);
    return () => removeEventListener("keydown", onKeyDown);
  }, [onClose, go]);

  // On the cover panel a sideways swipe moves to the next or previous title. On the phone bottom sheet, dragging
  // down past a threshold dismisses it. The first 10px of movement decide which gesture it is.
  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, axis: null };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const dialog = dialogRef.current;
    if (!drag || !dialog) return;
    drag.dx = e.clientX - drag.x;
    drag.dy = e.clientY - drag.y;
    if (!drag.axis && Math.hypot(drag.dx, drag.dy) > 10) {
      const sheet = !matchMedia("(min-width: 768px)").matches;
      drag.axis = Math.abs(drag.dx) > Math.abs(drag.dy) || !sheet ? "x" : "y";
      if (drag.axis === "y") dialog.style.transition = "none";
    }
    if (drag.axis === "y") dialog.style.transform = `translateY(${Math.max(0, drag.dy)}px)`;
  };
  const onDragEnd = () => {
    const drag = dragRef.current, dialog = dialogRef.current;
    dragRef.current = null;
    if (!drag || !dialog) return;
    if (drag.axis === "x") {
      if (Math.abs(drag.dx) > 50) go(drag.dx < 0 ? 1 : -1);
      return;
    }
    if (drag.axis !== "y") return;
    if (drag.dy > 110) { onClose(); return; }
    dialog.style.transition = "transform 200ms ease-out";
    dialog.style.transform = "";
  };

  if (!portalTarget || !title) return null;

  return createPortal(
    <div ref={overlayRef} data-brand={theme.brand} className="fixed inset-0 z-[130] flex items-end justify-center bg-foreground/60 font-brand backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none md:items-center md:p-6">
      <div className="absolute inset-0" onClick={() => onClose()} aria-hidden="true" />
      {/* From md up the arrows sit at the far left and right of the screen, outside the modal. */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous magazine"
        className="absolute left-6 top-1/2 z-20 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:inline-flex"
      >
        <ChevronLeft className="size-6" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next magazine"
        className="absolute right-6 top-1/2 z-20 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:inline-flex"
      >
        <ChevronRight className="size-6" aria-hidden />
      </button>
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsstand-title-heading"
        aria-describedby="newsstand-title-body"
        className="relative z-10 flex max-h-[92dvh] w-full max-w-[860px] flex-col overflow-y-auto overscroll-contain rounded-t-[16px] bg-background pb-[env(safe-area-inset-bottom)] text-foreground shadow-2xl max-md:animate-in max-md:slide-in-from-bottom max-md:duration-300 motion-reduce:animate-none md:max-h-[calc(100dvh-3rem)] md:flex-row md:overflow-hidden md:rounded-none md:pb-0"
      >
        <button
          ref={closeRef}
          onClick={() => onClose()}
          aria-label={`Close ${title.name}`}
          className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          // Phones frame the cover in black; from md up the cover fills its half of the modal edge to edge.
          className="relative flex shrink-0 select-none flex-col items-center justify-center gap-4 overflow-hidden bg-black px-16 pb-5 pt-9 touch-none md:w-[46%] md:gap-0 md:p-0"
        >
          <span aria-hidden className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/40 md:hidden" />
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous magazine"
            className="absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 md:hidden items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next magazine"
            className="absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 md:hidden items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <div
            key={slug}
            className={`flex w-full justify-center md:h-full animate-in fade-in duration-300 motion-reduce:animate-none ${direction === 1 ? "slide-in-from-right-8" : "slide-in-from-left-8"}`}
          >
          {cover ? (
            <img
              src={cover}
              alt={`${title.name} cover`}
              className="aspect-[420/550] h-auto w-[42vw] max-w-[180px] object-cover shadow-[0_18px_50px_rgba(0,0,0,.6)] md:h-full md:w-full md:max-w-none md:shadow-none"
            />
          ) : (
            // Digital-only or not yet photographed: a clean logo cover keeps the modal consistent.
            <div className="flex aspect-[420/550] w-[42vw] max-w-[180px] flex-col items-center justify-between bg-background p-6 shadow-[0_18px_50px_rgba(0,0,0,.6)] md:h-full md:w-full md:max-w-none md:p-10 md:shadow-none">
              <img src={logoSrc(slug)} alt={`${title.name} logo`} className="h-10 w-full object-contain md:h-14" />
              <p className="headline text-balance text-center text-xl font-black leading-tight md:text-2xl">{title.headline}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">On Hearst+</p>
            </div>
          )}
          </div>
          <p className="text-xs font-semibold tabular-nums tracking-[0.08em] text-white/60 md:absolute md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:rounded-full md:bg-black/50 md:px-3 md:py-1 md:text-white md:backdrop-blur-sm" aria-hidden>
            {position + 1} / {TITLE_SLUGS.length}
          </p>
          <p className="sr-only" aria-live="polite">{title.name}, {position + 1} of {TITLE_SLUGS.length}</p>
        </div>

        <div key={`${slug}-copy`} className="flex flex-col gap-4 p-6 animate-in fade-in duration-300 motion-reduce:animate-none md:w-[54%] md:overflow-y-auto md:p-10 md:pt-14">
          <img src={logoSrc(slug)} alt="" aria-hidden className="h-9 w-auto max-w-[260px] self-start object-contain" />
          <h2 id="newsstand-title-heading" className="headline text-balance text-[28px] font-black leading-[1.04] tracking-[-0.03em] md:text-[34px]">
            <span className="sr-only">{title.name}: </span>{title.headline}
          </h2>
          <p id="newsstand-title-body" className="text-pretty leading-relaxed text-muted-foreground">{title.body}</p>
          {/* Hearst+ is the product: start the trial, or see this brand inside the app. Print is a quiet secondary path. */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => { skipRestoreRef.current = true; onStartTrial(); }}
              className={`${primaryButton} min-h-11 px-5 text-xs`}
            >
              Start free trial
            </button>
            {appHref ? (
              <Link
                href={appHref}
                className="inline-flex min-h-11 items-center gap-1.5 border border-foreground px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Preview in Hearst+ <span aria-hidden>→</span>
              </Link>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">{offerLine} Every Hearst brand in one app.</p>
          {PRINT_SLUGS.has(slug) ? (
            <a
              href={PRINT_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center self-start text-xs text-muted-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Prefer print? Subscribe to {title.name} magazine
            </a>
          ) : null}
        </div>
      </section>
    </div>,
    portalTarget,
  );
}
