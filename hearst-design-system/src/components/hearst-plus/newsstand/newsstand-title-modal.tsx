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

  if (!portalTarget || !title) return null;

  return createPortal(
    <div ref={overlayRef} data-brand={theme.brand} className="fixed inset-0 z-[130] flex items-center justify-center bg-foreground/60 p-3 font-brand backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={() => onClose()} aria-hidden="true" />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsstand-title-heading"
        aria-describedby="newsstand-title-body"
        className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[860px] flex-col overflow-y-auto bg-background text-foreground shadow-2xl sm:max-h-[calc(100dvh-3rem)] md:flex-row md:overflow-hidden"
      >
        <button
          ref={closeRef}
          onClick={() => onClose()}
          aria-label={`Close ${title.name}`}
          className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div className="flex shrink-0 items-center justify-center bg-black px-6 pb-6 pt-14 md:w-[46%] md:p-10">
          {cover ? (
            <img
              src={cover}
              alt={`${title.name} cover`}
              className="aspect-[420/550] h-auto w-[52vw] max-w-[220px] object-cover shadow-[0_18px_50px_rgba(0,0,0,.6)] md:w-full md:max-w-[340px]"
            />
          ) : (
            // Digital-only or not yet photographed: a clean logo cover keeps the modal consistent.
            <div className="flex aspect-[420/550] w-[52vw] max-w-[220px] flex-col items-center justify-between bg-background p-6 shadow-[0_18px_50px_rgba(0,0,0,.6)] md:w-full md:max-w-[340px] md:p-8">
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
