"use client";

import { useEffect, useRef, useState } from "react";

type Scene = { setProgress(p: number): void; setOptions(o: object): void; shuffle(): void; resize(): void; dispose(): void };

const BRANDS = [
  { name: "Esquire", logo: "logo.20861e6.svg", headline: "Man at his best, every month since 1933.",
    body: "Long-form profiles, sharp cultural criticism and the style advice that actually holds up. Hearst+ unlocks every new issue plus decades of the archive.",
    included: "[12 issues a year] + [archive back to 1933]", tags: ["Style", "Interviews", "Culture"] },
  { name: "Cosmopolitan", logo: "cosmo.svg", headline: "Bold advice on love, life and everything in between.",
    body: "The beauty finds, career moves and honest relationship talk your group chat is already quoting. Read every issue the day it drops, plus exclusive digital-only features.",
    included: "[12 issues a year] + [archive back to 1886]", tags: ["Beauty", "Relationships", "Careers"] },
  { name: "Harper's Bazaar", logo: "harpers.svg", headline: "Fashion, art and the people shaping both.",
    body: "America's first fashion magazine, still setting the agenda. Runway reports, landmark photography and conversations with the designers and artists defining what comes next.",
    included: "[10 issues a year] + [archive back to 1867]", tags: ["Fashion", "Art", "Beauty"] },
  { name: "Good Housekeeping", logo: "good-housekeeping.svg", headline: "Tested at the Institute, trusted at home.",
    body: "Lab-tested product picks, recipes that work the first time and smart fixes for every room, backed by the Good Housekeeping Institute's experts.",
    included: "[12 issues a year] + [archive back to 1885]", tags: ["Home", "Food", "Product tests"] },
  { name: "Car and Driver", logo: "caranddriver.svg", headline: "Straight-talking reviews from people who live to drive.",
    body: "Instrumented road tests, honest buyer's guides and first drives of the cars everyone's talking about. Know what to buy, and what to skip.",
    included: "[12 issues a year] + [archive back to 1955]", tags: ["Reviews", "Buyer's guides", "Motorsport"] },
];

const MORE = [
  ["logo.2856426.svg", "ELLE"], ["town.svg", "Town & Country"], ["mens.svg", "Men's Health"], ["womenshealth.svg", "Women's Health"],
  ["popular.svg", "Popular Mechanics"], ["runners.svg", "Runner's World"], ["house.svg", "House Beautiful"], ["elle-decor.svg", "ELLE Decor"],
  ["veranda.svg", "Veranda"], ["country.svg", "Country Living"], ["delish.svg", "Delish"], ["oprah.svg", "Oprah Daily"],
  ["prevention.svg", "Prevention"], ["redbook.svg", "Redbook"], ["roadandtrack.svg", "Road & Track"], ["seventeen.svg", "Seventeen"],
  ["womans.svg", "Woman's Day"], ["pioneer.svg", "The Pioneer Woman"], ["logo.063cc2c.svg", "Bicycling"], ["autoweek.svg", "Autoweek"],
  ["bestproducts.svg", "Best Products"], ["biography.svg", "Biography"],
];

const LOGO = (f: string) => `/images/newsstand/logos/${f}`;

/* eslint-disable @next/next/no-img-element */
export function NewsstandExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const stops = useRef<number[]>([0]);
  const reduced = useRef(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    const measure = () => {
      const els = [...document.querySelectorAll<HTMLElement>("[data-stop]")];
      const max = document.documentElement.scrollHeight - innerHeight;
      stops.current = els.map((el, i) => {
        if (i === 0) return 0;
        if (i === els.length - 1) return max;
        return Math.min(max, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2);
      });
    };
    const update = () => {
      const s = stops.current, y = scrollY, last = s.length - 1;
      let p = 0;
      if (y >= s[last]) p = last;
      else for (let i = 0; i < last; i++) if (y >= s[i] && y < s[i + 1]) { p = i + (y - s[i]) / Math.max(1, s[i + 1] - s[i]); break; }
      sceneRef.current?.setProgress(p);
      document.querySelectorAll<HTMLElement>("[data-panel]").forEach((el, i) => {
        const d = Math.abs(p - (i + 1));
        el.style.opacity = String(Math.max(0, Math.min(1, 1.6 - d * 3.2)));
        el.style.transform = reduced.current ? "none" : `translateY(${(p - (i + 1)) * -40}px)`;
      });
      const r = Math.round(p);
      setActive(r >= 1 && r <= 5 && Math.abs(p - r) < 0.4 ? r - 1 : -1);
    };
    const onResize = () => { sceneRef.current?.resize(); requestAnimationFrame(() => { measure(); update(); }); };
    addEventListener("resize", onResize);
    addEventListener("scroll", update, { passive: true });
    measure(); update();
    // three.js is browser-only: load the scene on the client.
    import("./rack-scene").then(async (m) => {
      const s = await m.createRackScene(canvasRef.current, { reducedMotion: reduced.current });
      if (disposed) return s.dispose();
      sceneRef.current = s; measure(); update();
    });
    return () => {
      disposed = true;
      removeEventListener("resize", onResize);
      removeEventListener("scroll", update);
      sceneRef.current?.dispose();
    };
  }, []);

  const goTo = (i: number) => scrollTo({ top: stops.current[i + 1], behavior: reduced.current ? "auto" : "smooth" });
  const join = () => sceneRef.current?.shuffle();

  return (
    <div className="relative">
      <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-0 block h-screen w-screen" />

      <nav aria-label="Featured brands" className="fixed right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1">
        {BRANDS.map((b, i) => (
          <button key={b.name} onClick={() => goTo(i)} aria-label={b.name} aria-current={i === active}
            className="flex size-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span className={`block size-2.5 rounded-full border-2 border-foreground ${i === active ? "bg-primary" : "bg-background"}`} />
          </button>
        ))}
      </nav>

      <main className="relative z-10">
        <section data-stop className="flex min-h-screen items-start px-[6vw] pb-16 pt-24 md:items-center">
          <div className="flex max-w-[640px] flex-col gap-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Hearst+</p>
            <h1 className="headline text-balance text-[clamp(32px,6vw,116px)] font-black leading-[0.92] tracking-[-0.045em]">
              <span className="text-primary">Every</span> Hearst magazine. <span className="text-primary">One</span> subscription.
            </h1>
            <p className="max-w-[440px] text-pretty text-lg leading-7 text-muted-foreground">
              Esquire, Cosmopolitan, Harper&apos;s Bazaar, Good Housekeeping, Car and Driver and more, with every issue and every archive, in one membership.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <a href="#join" onClick={join} className="inline-flex min-h-[52px] items-center bg-foreground px-7 text-sm font-bold uppercase tracking-[0.08em] text-background transition-colors hover:bg-primary">
                Start your free trial
              </a>
              <span className="text-sm text-muted-foreground">[7-day] free trial · [Cancel anytime]</span>
            </div>
            <p className="text-sm text-muted-foreground">Scroll to browse the rack ↓</p>
          </div>
        </section>

        {BRANDS.map((b, i) => (
          <section key={b.name} data-stop className="h-[200vh]">
            <div className={`sticky top-0 flex h-screen items-end justify-center px-6 pb-6 pt-[88px] md:items-center md:pr-[72px] ${i % 2 ? "md:justify-start" : "md:justify-end"}`}>
              <article data-panel className="flex w-full max-w-[420px] flex-col gap-4 bg-background p-8 shadow-[0_12px_40px_rgba(0,0,0,.08)]">
                <p className="text-xs font-bold tracking-[0.16em] text-primary">{String(i + 1).padStart(2, "0")} / 05</p>
                <img src={LOGO(b.logo)} alt={b.name} className="h-11 w-auto max-w-[300px] self-start object-contain" />
                <h2 className="headline text-balance text-[32px] font-black leading-[1.04] tracking-[-0.03em]">{b.headline}</h2>
                <p className="text-pretty leading-relaxed text-muted-foreground">{b.body}</p>
                <p className="flex items-baseline gap-2 border-y border-border py-3 text-sm font-bold">
                  <span className="text-lg leading-none text-primary">+</span>Included: {b.included}
                </p>
                <div className="flex flex-wrap gap-2">
                  {b.tags.map((t) => (
                    <span key={t} className="border border-foreground px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]">{t}</span>
                  ))}
                </div>
              </article>
            </div>
          </section>
        ))}

        <section id="join" data-stop className="flex min-h-[110vh] items-start justify-center px-6 pb-12 pt-[104px]">
          <div className="flex w-full max-w-[880px] flex-col items-center gap-6 bg-background p-[clamp(28px,4vw,48px)] text-center shadow-[0_12px_40px_rgba(0,0,0,.08)]">
            <h2 className="headline text-[clamp(40px,6vw,80px)] font-black leading-[0.95] tracking-[-0.045em]">
              <span className="text-primary">+</span> 22 more titles
            </h2>
            <div className="flex max-w-[680px] flex-wrap items-center justify-center gap-x-12 gap-y-8 pb-2 pt-4">
              {MORE.map(([f, name]) => <img key={f} src={LOGO(f)} alt={name} className="h-[15px] w-auto max-w-[92px] object-contain" />)}
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Try Hearst+ free for [7 days]</p>
              <p className="text-4xl font-bold tracking-[-0.02em]">$[X.XX]<span className="text-lg font-normal text-muted-foreground"> / month</span></p>
              <p className="text-sm text-muted-foreground">after your [7-day] free trial · [Cancel anytime]</p>
            </div>
            <button onClick={join} className="inline-flex min-h-[52px] items-center bg-foreground px-8 text-sm font-bold uppercase tracking-[0.08em] text-background transition-colors hover:bg-primary">
              Start your free trial
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
