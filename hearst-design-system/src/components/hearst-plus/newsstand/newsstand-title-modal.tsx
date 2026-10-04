"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "@/components/ui/icons";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { getHearstAllBrands, getHearstBrandRoute } from "@/lib/hearst-routes";
import { TITLES, coverSrc, logoSrc } from "./newsstand-catalog";

// The title's publication page in the Hearst+ app, when one exists (Biography has none yet).
function appRoute(slug: string) {
  const brandSlug = slug.replace(/_/g, "-");
  return getHearstAllBrands().some((b) => b.brandSlug === brandSlug) ? getHearstBrandRoute(brandSlug) : null;
}

type Props = {
  slug: string;
  picked: boolean;
  offerLine: string;
  primaryButton: string;
  onTogglePick(): void;
  onStartTrial(): void;
  onClose(): void;
};

/* eslint-disable @next/next/no-img-element */
export function NewsstandTitleModal({ slug, picked, offerLine, primaryButton, onTogglePick, onStartTrial, onClose }: Props) {
  const portalTarget = useBodyPortalTarget();
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const skipRestoreRef = useRef(false);
  const dragRef = useRef<{ y: number; dy: number } | null>(null);
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
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) { event.preventDefault(); return; }
      const first = focusable[0], last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", onKeyDown);
    return () => removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Phone bottom sheet: dragging the cover panel down past a threshold dismisses it.
  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (matchMedia("(min-width: 768px)").matches || !dialogRef.current) return;
    dragRef.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    dialogRef.current.style.transition = "none";
  };
  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !dialogRef.current) return;
    drag.dy = Math.max(0, e.clientY - drag.y);
    dialogRef.current.style.transform = `translateY(${drag.dy}px)`;
  };
  const onDragEnd = () => {
    const drag = dragRef.current, dialog = dialogRef.current;
    dragRef.current = null;
    if (!drag || !dialog) return;
    if (drag.dy > 110) { onClose(); return; }
    dialog.style.transition = "transform 200ms ease-out";
    dialog.style.transform = "";
  };

  if (!portalTarget || !title) return null;

  return createPortal(
    <div ref={overlayRef} data-brand={theme.brand} className="fixed inset-0 z-[130] flex items-end justify-center bg-foreground/60 font-brand backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none md:items-center md:p-6">
      <div className="absolute inset-0" onClick={() => onClose()} aria-hidden="true" />
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
          className="relative flex shrink-0 items-center justify-center bg-black px-6 pb-6 pt-9 max-md:touch-none md:w-[46%] md:p-10"
        >
          <span aria-hidden className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/40 md:hidden" />
          {cover ? (
            <img
              src={cover}
              alt={`${title.name} cover`}
              className="aspect-[420/550] h-auto w-[42vw] max-w-[180px] object-cover shadow-[0_18px_50px_rgba(0,0,0,.6)] md:w-full md:max-w-[340px]"
            />
          ) : (
            // Digital-only or not yet photographed: a clean logo cover keeps the modal consistent.
            <div className="flex aspect-[420/550] w-[42vw] max-w-[180px] flex-col items-center justify-between bg-background p-6 shadow-[0_18px_50px_rgba(0,0,0,.6)] md:w-full md:max-w-[340px] md:p-8">
              <img src={logoSrc(slug)} alt={`${title.name} logo`} className="h-10 w-full object-contain md:h-14" />
              <p className="headline text-balance text-center text-xl font-black leading-tight md:text-2xl">{title.headline}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">On Hearst+</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6 md:w-[54%] md:overflow-y-auto md:p-10 md:pt-14">
          <img src={logoSrc(slug)} alt="" aria-hidden className="h-9 w-auto max-w-[260px] self-start object-contain" />
          <h2 id="newsstand-title-heading" className="headline text-balance text-[28px] font-black leading-[1.04] tracking-[-0.03em] md:text-[34px]">
            <span className="sr-only">{title.name}: </span>{title.headline}
          </h2>
          <p id="newsstand-title-body" className="text-pretty leading-relaxed text-muted-foreground">{title.body}</p>
          <p className="flex items-baseline gap-2 border-y border-border py-3 text-sm font-bold">
            <span className="text-lg leading-none text-primary">+</span>Included with Hearst+: {title.included}
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Topics">
            {title.tags.map((tag) => (
              <li key={tag} className="border border-foreground px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]">{tag}</li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => { skipRestoreRef.current = true; onStartTrial(); }}
              className={`${primaryButton} min-h-11 px-5 text-xs`}
            >
              Start free trial
            </button>
            <button
              onClick={onTogglePick}
              aria-pressed={picked}
              className={`inline-flex min-h-11 items-center border px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${picked ? "border-primary text-primary" : "border-foreground hover:border-primary hover:text-primary"}`}
            >
              {picked ? "✓ In my newsstand" : "+ Add to my newsstand"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{offerLine} All {Object.keys(TITLES).length} titles included.</p>
          {appHref ? (
            <Link
              href={appHref}
              className="inline-flex min-h-11 items-center gap-1.5 self-start border-t border-border pt-3 text-sm font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Preview {title.name} in the Hearst+ app <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      </section>
    </div>,
    portalTarget,
  );
}
