"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Col, Grid, PageContainer } from "@/components/ui/grid";
import { FEATURED_SLUGS, PRINT_SUBSCRIBE_URL, TITLES, TITLE_SLUGS, appRoute, logoSrc } from "./newsstand-catalog";
import { NewsstandTitleModal } from "./newsstand-title-modal";

type Scene = {
  setProgress(p: number): void;
  setOptions(o: object): void;
  setPaused(paused: boolean): void;
  shuffle(): void;
  resize(): void;
  dispose(): void;
};

// Single source for the offer shown beside every trial button. Replace before launch;
// `placeholder` adds a visible "Prototype pricing" note until real numbers land.
const OFFER = { price: "$X.XX", period: "month", trialDays: 7, terms: "Cancel anytime", placeholder: true };
const OFFER_LINE = `${OFFER.trialDays}-day free trial, then ${OFFER.price}/${OFFER.period}. ${OFFER.terms}.`;

const BRANDS = FEATURED_SLUGS.map((slug) => ({ slug, ...TITLES[slug] }));

const primaryButton =
  "inline-flex items-center justify-center bg-foreground font-bold uppercase tracking-[0.08em] text-background transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
const secondaryButton =
  "inline-flex items-center justify-center border border-foreground font-bold uppercase tracking-[0.08em] transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

/* eslint-disable @next/next/no-img-element */
export function NewsstandExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const stops = useRef<number[]>([0]);
  const reduced = useRef(false);
  const remeasure = useRef<() => void>(() => {});
  const measureNow = useRef<() => void>(() => {});
  const hoverLabelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(-1);
  const [sceneReady, setSceneReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoverHint, setHoverHint] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

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
      setActive(r >= 1 && r <= BRANDS.length && Math.abs(p - r) < 0.4 ? r - 1 : -1);
    };
    remeasure.current = () => requestAnimationFrame(() => { measure(); update(); });
    measureNow.current = measure;
    // Section positions drive the dots, Skip to plans and the camera, so re-measure on any layout change,
    // not only window resizes (late content, viewport changes inside embedded panes).
    const layoutObserver = new ResizeObserver(() => remeasure.current());
    layoutObserver.observe(document.body);
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
      layoutObserver.disconnect();
      removeEventListener("resize", onResize);
      removeEventListener("scroll", update);
      sceneRef.current?.dispose();
    };
  }, []);

  // Nothing on the rack needs to move while a title modal covers it.
  useEffect(() => { sceneRef.current?.setPaused(!!openSlug); }, [openSlug, sceneReady]);

  useEffect(() => {
    remeasure.current();
    if (joined) confirmRef.current?.focus({ preventScroll: true });
  }, [joined]);

  const behavior = (): ScrollBehavior => (reduced.current ? "auto" : "smooth");
  const goTo = (i: number) => { measureNow.current(); scrollTo({ top: stops.current[i + 1], behavior: behavior() }); };
  const goToPlans = () => { measureNow.current(); scrollTo({ top: stops.current[stops.current.length - 1], behavior: behavior() }); };
  const startTrial = () => {
    setJoined(true);
    sceneRef.current?.shuffle();
    goToPlans();
  };
  const closeModal = useCallback(() => setOpenSlug(null), []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`fixed inset-0 z-0 block h-screen w-screen transition-opacity duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={hoverLabelRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-30 whitespace-nowrap bg-foreground px-2.5 py-1.5 text-xs font-bold text-background transition-opacity ${hovered !== null ? "opacity-100" : "opacity-0"}`}
      >
        {hoverHint ?? (hovered ? `${TITLES[hovered]?.name ?? ""} · Preview` : "")}
      </div>

      {openSlug ? (
        <NewsstandTitleModal
          key={openSlug}
          slug={openSlug}
          offerLine={OFFER_LINE}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
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

      {/* The overlay passes clicks through to the rack; only cards and controls catch them. */}
      <main className="pointer-events-none relative z-10">
        {/* Overlay copy sits on the shared Hearst+ page container and 12-column grid; the 3D rack behind it is a full-bleed layer. */}
        <section data-stop className="flex min-h-screen items-start pb-16 pt-24 md:pt-[24vh]">
          <PageContainer>
            <Grid>
              <Col span="full" spanMd={6} spanLg={6} className="flex flex-col gap-6 max-md:-mx-2 max-md:bg-background/90 max-md:p-5 max-md:backdrop-blur-sm">
            <h1 className="headline text-balance text-[clamp(32px,6vw,116px)] font-black leading-[0.92] tracking-[-0.045em]">
              <span className="text-primary">Every</span> Hearst brand. <span className="text-primary">One</span> app.
            </h1>
            <p className="max-w-[440px] text-pretty text-lg leading-7 text-[var(--palette-alert-info-1000)]">
              Stories, videos and recipes from Esquire, Cosmopolitan, Harper&apos;s Bazaar, Good Housekeeping, Car and Driver and 22 more Hearst brands, in one personalized feed that gets better the more you read.
            </p>
            {/* Preview first: the page's main action is looking inside the app; the trial and price live in the plans section. */}
            <div className="flex flex-col items-start gap-3">
              <Link href="/hearst-plus/" className={`${primaryButton} pointer-events-auto min-h-[52px] gap-1.5 px-7 text-sm`}>
                Preview Hearst+ <span aria-hidden>→</span>
              </Link>
            </div>
              </Col>
            </Grid>
          </PageContainer>
        </section>

        {BRANDS.map((b, i) => {
          const appHref = appRoute(b.slug);
          return (
            <section key={b.slug} data-stop className="h-[120vh]">
              <div className="sticky top-0 flex h-screen items-end pb-20 pt-6 md:items-center md:pb-6">
                <PageContainer>
                  <Grid>
                    {/* Panels sit one column in from the edge (columns 2-5 or 8-11 on desktop) so each reads as a pair
                        with its magazine, which the scene frames just off center on the other side. On tablets the
                        right panel stops one column short so it clears the brand dots in the page margin. */}
                    <Col
                      span="full"
                      spanMd={4}
                      spanLg={4}
                      startMd={i % 2 ? 1 : 4}
                      startLg={i % 2 ? 2 : 8}
                      className="pointer-events-auto"
                    >
                {/* Brand panels are dark so the pulled-out cover, not the card, leads; logos are knocked out to white. */}
                <article data-panel className="flex w-full flex-col gap-5 bg-[#111] p-7 text-white shadow-[0_12px_40px_rgba(0,0,0,.35)] md:p-10 lg:p-12">
                  <img src={logoSrc(b.slug)} alt={b.name} className="h-9 w-auto max-w-[300px] self-start object-contain brightness-0 invert md:h-11" />
                  <h2 className="headline text-balance text-[26px] font-black leading-[1.04] tracking-[-0.03em] text-white md:text-[32px]">{b.headline}</h2>
                  <p className="hidden text-pretty leading-relaxed text-white/70 md:block">{b.body}</p>
                  {/* One action per brand panel: see this brand inside the app. The trial lives in the hero and plans. */}
                  {appHref ? (
                    <Link
                      href={appHref}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 self-start bg-white px-5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                    >
                      Preview in Hearst+ <span aria-hidden>→</span>
                    </Link>
                  ) : null}
                </article>
                    </Col>
                  </Grid>
                </PageContainer>
              </div>
            </section>
          );
        })}

        {/* The plans section closes the page on a solid full-bleed surface that covers the rack completely. */}
        <section id="join" data-stop className="pointer-events-auto flex min-h-screen items-center bg-background py-20">
          <PageContainer>
            <Grid>
              <Col span="full" spanMd={8} spanLg={8} startLg={3} className="flex flex-col items-center gap-6 text-center">
            {joined ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Welcome to Hearst+</p>
                <h2 ref={confirmRef} tabIndex={-1} className="headline text-[clamp(40px,6vw,80px)] font-black leading-[0.95] tracking-[-0.045em] focus:outline-none">
                  You&apos;re in<span className="text-primary">.</span>
                </h2>
                <p className="max-w-[520px] text-pretty text-lg text-muted-foreground">
                  Your {OFFER.trialDays}-day free trial starts today: every Hearst brand, in one personalized feed. {OFFER.terms}.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/hearst-plus/" className={`${primaryButton} min-h-[52px] px-8 text-sm`}>Open Hearst+</Link>
                </div>
                <p className="text-xs text-muted-foreground">Prototype: no account or payment was created.</p>
              </>
            ) : (
              <>
                <BrandLogo slug="hearst-all" label="Hearst+" className="block h-7 md:h-9 [&_svg]:h-full [&_svg]:w-auto" />
                <h2 className="headline text-balance text-[clamp(26px,2.8vw,40px)] font-black leading-[0.95] tracking-[-0.045em]">
                  {TITLE_SLUGS.length} brands<span className="text-primary">.</span> One app<span className="text-primary">.</span>
                </h2>
                <p className="max-w-[540px] text-pretty text-muted-foreground">
                  The best of every Hearst brand in one place: stories, videos, recipes and reviews, ranked for you, with saved collections and a morning brief.
                </p>
                {/* One dark ink for every logo, so the wall reads as a single calm block under the headline. */}
                <ul aria-label="Brands in Hearst+" className="flex max-w-[760px] flex-wrap items-center justify-center gap-x-8 gap-y-5">
                  {TITLE_SLUGS.map((slug) => (
                    <li key={slug}>
                      <img src={logoSrc(slug)} alt={TITLES[slug].name} loading="lazy" decoding="async" className="h-[15px] w-auto max-w-[92px] object-contain brightness-0" />
                    </li>
                  ))}
                </ul>
                <div className="h-px w-full bg-border" />
                {/* Preview leads; the trial sits beside it with the price in small text underneath. */}
                <div className="flex flex-wrap items-start justify-center gap-3">
                  <Link href="/hearst-plus/" className={`${primaryButton} min-h-[52px] gap-1.5 px-8 text-sm`}>
                    Preview the app <span aria-hidden>→</span>
                  </Link>
                  <div className="flex flex-col items-center gap-1.5">
                    <button onClick={startTrial} className={`${secondaryButton} min-h-[52px] px-6 text-sm`}>Start your free trial</button>
                    <p className="text-xs text-muted-foreground">
                      {OFFER.trialDays} days free, then {OFFER.price}/{OFFER.period} · {OFFER.terms}
                    </p>
                    {OFFER.placeholder ? <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Prototype pricing</p> : null}
                  </div>
                </div>
                <a
                  href={PRINT_SUBSCRIBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-xs text-muted-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Prefer print? Subscribe to Hearst magazines
                </a>
              </>
            )}
              </Col>
            </Grid>
          </PageContainer>
        </section>
      </main>
    </div>
  );
}
