"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FEATURED_SLUGS, TITLES, TITLE_SLUGS, logoSrc } from "./newsstand-catalog";
import { NewsstandTitleModal } from "./newsstand-title-modal";

type Scene = {
  setProgress(p: number): void;
  setOptions(o: object): void;
  setPicked(slugs: string[]): void;
  shuffle(): void;
  resize(): void;
  dispose(): void;
};

// Single source for the offer shown beside every trial button. Replace before launch;
// `placeholder` adds a visible "Prototype pricing" note until real numbers land.
const OFFER = { price: "$X.XX", period: "month", trialDays: 7, terms: "Cancel anytime", placeholder: true };
const OFFER_LINE = `${OFFER.trialDays}-day free trial, then ${OFFER.price}/${OFFER.period}. ${OFFER.terms}.`;

const BRANDS = FEATURED_SLUGS.map((slug) => ({ slug, ...TITLES[slug] }));
const PICKS_KEY = "hearst-plus-newsstand-picks";

const primaryButton =
  "inline-flex items-center justify-center bg-foreground font-bold uppercase tracking-[0.08em] text-background transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/* eslint-disable @next/next/no-img-element */
export function NewsstandExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const stops = useRef<number[]>([0]);
  const reduced = useRef(false);
  const remeasure = useRef<() => void>(() => {});
  const hoverLabelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(-1);
  const [sceneReady, setSceneReady] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoverHint, setHoverHint] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const picksRestored = useRef(false);

  const togglePick = useCallback((slug: string) => {
    setPicked((cur) => {
      const on = !cur.includes(slug);
      setAnnouncement(`${TITLES[slug]?.name ?? slug} ${on ? "added to" : "removed from"} your newsstand`);
      return on ? [...cur, slug] : cur.filter((s) => s !== slug);
    });
  }, []);

  // Restore and persist picks (per-viewer convenience only). Restored after hydration so server and client markup match.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(PICKS_KEY) ?? "[]");
        if (Array.isArray(saved)) setPicked(saved.filter((s) => typeof s === "string" && s in TITLES));
      } catch {}
      picksRestored.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    sceneRef.current?.setPicked(picked);
    if (!picksRestored.current) return;
    try { localStorage.setItem(PICKS_KEY, JSON.stringify(picked)); } catch {}
  }, [picked, sceneReady]);

  useEffect(() => {
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    const measure = () => {
      const els = [...document.querySelectorAll<HTMLElement>("[data-stop]")];
      const max = document.documentElement.scrollHeight - innerHeight;
      stops.current = els.map((el, i) => {
        if (i === 0) return 0;
        // The plans section is the final stop; the footer below it keeps the outro view.
        if (i === els.length - 1) return Math.min(max, el.getBoundingClientRect().top + scrollY);
        return Math.min(max, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2);
      });
    };
    const update = () => {
      const s = stops.current, y = scrollY, last = s.length - 1;
      let p = 0;
      if (y >= s[last]) p = last;
      else for (let i = 0; i < last; i++) if (y >= s[i] && y < s[i + 1]) { p = i + (y - s[i]) / Math.max(1, s[i + 1] - s[i]); break; }
      sceneRef.current?.setProgress(p);
      setHovered(null);
      document.querySelectorAll<HTMLElement>("[data-panel]").forEach((el, i) => {
        const d = Math.abs(p - (i + 1));
        const opacity = Math.max(0, Math.min(1, 1.6 - d * 3.2));
        el.style.opacity = String(opacity);
        // Faded panels must not block clicks on the rack behind them.
        el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
        el.style.transform = reduced.current ? "none" : `translateY(${(p - (i + 1)) * -40}px)`;
      });
      const r = Math.round(p);
      setActive(r >= 1 && r <= 5 && Math.abs(p - r) < 0.4 ? r - 1 : -1);
    };
    remeasure.current = () => requestAnimationFrame(() => { measure(); update(); });
    const onResize = () => { sceneRef.current?.resize(); remeasure.current(); };
    addEventListener("resize", onResize);
    addEventListener("scroll", update, { passive: true });
    measure(); update();

    // three.js and the cover art are the heaviest part of the page. The headline and offer are plain
    // server-rendered HTML; the rack loads only after the page has finished loading and the browser is idle.
    let idleHandle: number | undefined;
    const start = () => {
      import("./rack-scene").then(async (m) => {
        if (disposed || !canvasRef.current) return;
        const s = await m.createRackScene(canvasRef.current, {
          reducedMotion: reduced.current,
          onPick: (slug: string) => setOpenSlug(slug),
          onHover: (slug: string | null, x: number, y: number, hint?: string) => {
            setHovered(slug);
            setHoverHint(hint ?? null);
            if (hoverLabelRef.current) hoverLabelRef.current.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
          },
        });
        if (disposed) return s.dispose();
        sceneRef.current = s;
        setSceneReady(true);
        measure(); update();
      });
    };
    const whenIdle = () => {
      idleHandle = typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(start, { timeout: 1500 })
        : window.setTimeout(start, 200);
    };
    if (document.readyState === "complete") whenIdle();
    else addEventListener("load", whenIdle, { once: true });

    return () => {
      disposed = true;
      removeEventListener("load", whenIdle);
      if (idleHandle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
        clearTimeout(idleHandle);
      }
      removeEventListener("resize", onResize);
      removeEventListener("scroll", update);
      sceneRef.current?.dispose();
    };
  }, [togglePick]);

  useEffect(() => {
    remeasure.current();
    if (joined) confirmRef.current?.focus({ preventScroll: true });
  }, [joined]);

  const behavior = (): ScrollBehavior => (reduced.current ? "auto" : "smooth");
  const goTo = (i: number) => scrollTo({ top: stops.current[i + 1], behavior: behavior() });
  const goToPlans = () => scrollTo({ top: stops.current[stops.current.length - 1], behavior: behavior() });
  const startTrial = () => {
    setJoined(true);
    sceneRef.current?.shuffle();
    goToPlans();
  };
  const closeModal = useCallback(() => setOpenSlug(null), []);

  const offerNote = (
    <span className="text-sm text-muted-foreground">
      {OFFER_LINE}
      {OFFER.placeholder ? <span className="ml-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Prototype pricing</span> : null}
    </span>
  );

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`fixed inset-0 z-0 block h-screen w-screen transition-opacity duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}
      />

      <p aria-live="polite" className="sr-only">{announcement}</p>

      <div
        ref={hoverLabelRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-30 whitespace-nowrap bg-foreground px-2.5 py-1.5 text-xs font-bold text-background transition-opacity ${hovered !== null ? "opacity-100" : "opacity-0"}`}
      >
        {hoverHint ?? (hovered ? `${TITLES[hovered]?.name ?? ""}${picked.includes(hovered) ? " ✓" : ""} · View` : "")}
      </div>

      {openSlug ? (
        <NewsstandTitleModal
          key={openSlug}
          slug={openSlug}
          picked={picked.includes(openSlug)}
          offerLine={OFFER_LINE}
          primaryButton={primaryButton}
          onTogglePick={() => togglePick(openSlug)}
          onStartTrial={() => { setOpenSlug(null); startTrial(); }}
          onClose={closeModal}
        />
      ) : null}

      <nav aria-label="Featured brands" className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 md:flex">
        {BRANDS.map((b, i) => (
          <button key={b.slug} onClick={() => goTo(i)} aria-label={b.name} aria-current={i === active}
            className="flex size-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span className={`block size-2.5 rounded-full border-2 border-foreground ${i === active ? "bg-primary" : "bg-background"}`} />
          </button>
        ))}
      </nav>

      {picked.length > 0 && !joined ? (
        <button
          onClick={goToPlans}
          className="fixed bottom-5 left-1/2 z-20 inline-flex min-h-11 -translate-x-1/2 items-center gap-3 whitespace-nowrap bg-background px-5 text-sm font-bold shadow-[0_12px_40px_rgba(0,0,0,.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>My newsstand <span className="text-primary">({picked.length})</span></span>
          <span className="text-xs uppercase tracking-[0.08em] text-muted-foreground"><span className="hidden sm:inline">Review and </span>join →</span>
        </button>
      ) : null}

      {/* The overlay passes clicks through to the rack; only cards and controls catch them. */}
      <main className="pointer-events-none relative z-10">
        <section data-stop className="flex min-h-screen items-start px-[6vw] pb-16 pt-24 md:items-center">
          <div className="flex max-w-[640px] flex-col gap-6 max-md:-mx-2 max-md:bg-background/90 max-md:p-5 max-md:backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Hearst+</p>
            <h1 className="headline text-balance text-[clamp(32px,6vw,116px)] font-black leading-[0.92] tracking-[-0.045em]">
              <span className="text-primary">Every</span> Hearst magazine. <span className="text-primary">One</span> subscription.
            </h1>
            <p className="max-w-[440px] text-pretty text-lg leading-7 text-muted-foreground">
              Esquire, Cosmopolitan, Harper&apos;s Bazaar, Good Housekeeping, Car and Driver and 22 more, with every issue and every archive, in one membership.
            </p>
            <div className="flex flex-col items-start gap-3">
              <button onClick={startTrial} className={`${primaryButton} pointer-events-auto min-h-[52px] px-7 text-sm`}>
                Start your {OFFER.trialDays}-day free trial
              </button>
              {offerNote}
            </div>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Scroll to browse the rack ↓</span>
              <button onClick={goToPlans} className="pointer-events-auto inline-flex min-h-11 items-center font-semibold text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Skip to plans
              </button>
            </p>
            <p className="hidden text-sm text-muted-foreground md:block">Tip: click any cover on the rack to see what&apos;s inside.</p>
          </div>
        </section>

        {BRANDS.map((b, i) => {
          const on = picked.includes(b.slug);
          return (
            <section key={b.slug} data-stop className="h-[120vh]">
              <div className={`sticky top-0 flex h-screen items-end justify-center px-6 pb-20 pt-[88px] md:pb-6 md:items-center md:pr-[72px] ${i % 2 ? "md:justify-start" : "md:justify-end"}`}>
                <article data-panel className="pointer-events-auto flex w-full max-w-[420px] flex-col gap-4 bg-background p-6 shadow-[0_12px_40px_rgba(0,0,0,.08)] md:p-8">
                  <p className="text-xs font-bold tracking-[0.16em] text-primary">{String(i + 1).padStart(2, "0")} / 05</p>
                  <img src={logoSrc(b.slug)} alt={b.name} className="h-9 w-auto max-w-[300px] self-start object-contain md:h-11" />
                  <h2 className="headline text-balance text-[26px] font-black leading-[1.04] tracking-[-0.03em] md:text-[32px]">{b.headline}</h2>
                  <p className="hidden text-pretty leading-relaxed text-muted-foreground md:block">{b.body}</p>
                  <p className="flex items-baseline gap-2 border-y border-border py-3 text-sm font-bold">
                    <span className="text-lg leading-none text-primary">+</span>Included: {b.included}
                  </p>
                  <div className="hidden flex-wrap gap-2 md:flex">
                    {b.tags.map((tag) => (
                      <span key={tag} className="border border-foreground px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]">{tag}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={startTrial} className={`${primaryButton} min-h-11 px-5 text-xs`}>Start free trial</button>
                    <button
                      onClick={() => togglePick(b.slug)}
                      aria-pressed={on}
                      className={`inline-flex min-h-11 items-center border px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${on ? "border-primary text-primary" : "border-foreground hover:border-primary hover:text-primary"}`}
                    >
                      {on ? "✓ In my newsstand" : "+ Add to my newsstand"}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{OFFER_LINE}</p>
                </article>
              </div>
            </section>
          );
        })}

        <section id="join" data-stop className="flex min-h-[110vh] items-start justify-center px-6 pb-12 pt-[104px]">
          <div className="pointer-events-auto flex w-full max-w-[880px] flex-col items-center gap-6 bg-background p-[clamp(28px,4vw,48px)] text-center shadow-[0_12px_40px_rgba(0,0,0,.08)]">
            {joined ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Welcome to Hearst+</p>
                <h2 ref={confirmRef} tabIndex={-1} className="headline text-[clamp(40px,6vw,80px)] font-black leading-[0.95] tracking-[-0.045em] focus:outline-none">
                  You&apos;re in<span className="text-primary">.</span>
                </h2>
                <p className="max-w-[520px] text-pretty text-lg text-muted-foreground">
                  Your {OFFER.trialDays}-day free trial starts today, with all {TITLE_SLUGS.length} titles included. {OFFER.terms}.
                </p>
                {picked.length > 0 ? (
                  <div className="flex w-full flex-col items-center gap-4">
                    <p className="text-sm font-bold">Your newsstand, first in your feed</p>
                    <ul className="flex max-w-[680px] flex-wrap items-center justify-center gap-x-10 gap-y-6">
                      {picked.map((slug) => (
                        <li key={slug}><img src={logoSrc(slug)} alt={TITLES[slug].name} className="h-[18px] w-auto max-w-[110px] object-contain" /></li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Pick favorites anytime to put them first in your feed.</p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/hearst-plus/" className={`${primaryButton} min-h-[52px] px-8 text-sm`}>Start reading</Link>
                  <button onClick={() => setJoined(false)} className="inline-flex min-h-[52px] items-center border border-foreground px-6 text-sm font-bold uppercase tracking-[0.08em] hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Edit my picks
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Prototype: no account or payment was created.</p>
              </>
            ) : (
              <>
                <h2 className="headline text-[clamp(40px,6vw,80px)] font-black leading-[0.95] tracking-[-0.045em]">
                  {TITLE_SLUGS.length} titles<span className="text-primary">.</span> Pick your favorites<span className="text-primary">.</span>
                </h2>
                <p className="max-w-[520px] text-pretty text-muted-foreground">
                  Every title is included. Choose the ones you read most and Hearst+ puts them first in your feed.
                </p>
                <ul aria-label="Choose your magazines" className="flex max-w-[760px] flex-wrap items-center justify-center gap-2">
                  {TITLE_SLUGS.map((slug) => {
                    const on = picked.includes(slug);
                    return (
                      <li key={slug}>
                        <button
                          onClick={() => togglePick(slug)}
                          aria-pressed={on}
                          aria-label={TITLES[slug].name}
                          className={`inline-flex min-h-11 items-center gap-2 border px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${on ? "border-primary bg-primary/10" : "border-transparent hover:border-border"}`}
                        >
                          <span aria-hidden className={`w-3 text-xs font-bold text-primary ${on ? "" : "invisible"}`}>✓</span>
                          <img src={logoSrc(slug)} alt="" loading="lazy" decoding="async" className="h-[15px] w-auto max-w-[92px] object-contain" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="h-px w-full bg-border" />
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Try Hearst+ free for {OFFER.trialDays} days</p>
                  <p className="text-4xl font-bold tracking-[-0.02em]">{OFFER.price}<span className="text-lg font-normal text-muted-foreground"> / {OFFER.period}</span></p>
                  <p className="text-sm text-muted-foreground">after your {OFFER.trialDays}-day free trial · {OFFER.terms}</p>
                  {OFFER.placeholder ? <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Prototype pricing</p> : null}
                </div>
                <button onClick={startTrial} className={`${primaryButton} min-h-[52px] px-8 text-sm`}>
                  {picked.length > 0 ? `Start free trial with ${picked.length} favorite${picked.length === 1 ? "" : "s"}` : "Start your free trial"}
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
