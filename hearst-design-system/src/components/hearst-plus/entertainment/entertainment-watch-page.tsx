"use client";

import { useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { MainNav } from "@/components/home-page";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { ChevronRight, Play } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type EntertainmentShow = {
  title: string;
  brand: "A&E" | "HISTORY" | "Lifetime" | "LMN" | "FYI" | "VICE TV" | "BIOGRAPHY";
  eyebrow: string;
  description: string;
  href: string;
  imageUrl?: string;
  meta: string;
};

const entertainmentNavLinks = [
  "Featured",
  "A&E",
  "HISTORY",
  "Lifetime",
  "LMN",
  "FYI",
  "VICE TV",
  "BIOGRAPHY",
];

const heroShows: EntertainmentShow[] = [
  {
    title: "Alone",
    brand: "HISTORY",
    eyebrow: "New episodes",
    description: "A survival competition built for a premium, cinematic lead slot with big photography and a direct path to the show.",
    href: "https://www.history.com/shows/alone",
    imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2026/04/alone-s13-3000x3000-primary-1x1-1.jpg?w=1180",
    meta: "13 seasons",
  },
  {
    title: "The First 48",
    brand: "A&E",
    eyebrow: "Featured crime",
    description: "A&E's long-running homicide series anchors the Entertainment surface with urgency, recognizability, and strong key art.",
    href: "https://www.aetv.com/shows/the-first-48",
    imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/the-first-48-s29-3000x3000-primary-1x1-1.jpg?w=1180",
    meta: "30 seasons",
  },
  {
    title: "Married at First Sight",
    brand: "Lifetime",
    eyebrow: "Relationship reality",
    description: "Lifetime programming gives the hero a social, character-driven counterpoint to HISTORY and A&E franchises.",
    href: "https://www.mylifetime.com/shows/married-at-first-sight",
    imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2017/03/mafs-s18-3000x3000-primary-1x1-1.jpg?w=1180",
    meta: "18 seasons",
  },
];

const channelRows: Array<{ brand: EntertainmentShow["brand"]; description: string; shows: EntertainmentShow[] }> = [
  {
    brand: "A&E",
    description: "Crime, documentary, and unscripted franchises from A&E.",
    shows: [
      heroShows[1],
      {
        title: "Storage Wars",
        brand: "A&E",
        eyebrow: "Reality",
        description: "Buyers compete for abandoned storage lockers, chasing the next unlikely treasure.",
        href: "https://www.aetv.com/shows/storage-wars",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/4/2015/09/storage-wars-s16-3000x3000-primary-1x1-1.jpg?w=1180",
        meta: "18 seasons",
      },
      {
        title: "Court Cam",
        brand: "A&E",
        eyebrow: "Crime",
        description: "Raw courtroom moments and legal drama built for quick discovery.",
        href: "https://www.aetv.com/shows",
        meta: "A&E shows",
      },
    ],
  },
  {
    brand: "HISTORY",
    description: "Survival, mystery, and documentary series from HISTORY.",
    shows: [
      heroShows[0],
      {
        title: "Ancient Aliens",
        brand: "HISTORY",
        eyebrow: "Documentary",
        description: "A long-running paranormal history franchise with deep episode inventory.",
        href: "https://www.history.com/shows/ancient-aliens",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2025/07/ancient-aliens-s21-3000x3000-primary-1x1-1.jpg?w=1180",
        meta: "22 seasons",
      },
      {
        title: "The UnXplained",
        brand: "HISTORY",
        eyebrow: "Mystery",
        description: "A HISTORY discovery lane for unexplained events, oddities, and speculative stories.",
        href: "https://www.history.com/shows",
        meta: "HISTORY shows",
      },
    ],
  },
  {
    brand: "Lifetime",
    description: "Relationship, family, and movie-led programming from Lifetime.",
    shows: [
      heroShows[2],
      {
        title: "Dance Moms",
        brand: "Lifetime",
        eyebrow: "Reality",
        description: "Competitive dance and family pressure in a compact binge row.",
        href: "https://www.mylifetime.com/shows/dance-moms",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/5/2015/05/dance-moms-s3-3000x3000-primary-1x1-1.jpg?w=1180",
        meta: "9 seasons",
      },
      {
        title: "Lifetime Movies",
        brand: "Lifetime",
        eyebrow: "Movies",
        description: "A direct lane into Lifetime's movie-first programming.",
        href: "https://www.mylifetime.com/movies",
        meta: "Movies",
      },
    ],
  },
  {
    brand: "LMN",
    description: "Suspense and movie-night programming for the Lifetime Movie Network lane.",
    shows: [
      {
        title: "LMN Movies",
        brand: "LMN",
        eyebrow: "Movie network",
        description: "A dedicated movie shelf for suspense, thrillers, and weekend programming.",
        href: "https://www.mylifetime.com/lmn",
        meta: "LMN",
      },
      {
        title: "Lifetime Movie Club",
        brand: "LMN",
        eyebrow: "Streaming",
        description: "Subscription movie discovery from the Lifetime ecosystem.",
        href: "https://www.lifetimemovieclub.com/",
        meta: "Movie club",
      },
      {
        title: "Lifetime Movies",
        brand: "LMN",
        eyebrow: "Movies",
        description: "A broader movie collection for the shared Lifetime and LMN audience.",
        href: "https://www.mylifetime.com/movies",
        meta: "Movies",
      },
    ],
  },
  {
    brand: "FYI",
    description: "Home, real estate, and lifestyle series from FYI.",
    shows: [
      {
        title: "Tiny House Nation",
        brand: "FYI",
        eyebrow: "Home",
        description: "Small-space renovation stories and ingenious homes from FYI.",
        href: "https://www.fyi.tv/shows/tiny-house-nation",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2017/01/watch-desktop-hero-tiny-house-nation-s4.jpg?w=1024",
        meta: "5 seasons",
      },
      {
        title: "Find My Country House: Australia",
        brand: "FYI",
        eyebrow: "Real estate",
        description: "Property hunting with a regional travel lens.",
        href: "https://www.fyi.tv/shows/tiny-house-nation",
        imageUrl: "https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/3/2024/05/Find_My_Country_House_AUSTRALIA_HORZ_3840x2160_FIN-scaled.jpg",
        meta: "FYI",
      },
      {
        title: "Waterfront House Hunting",
        brand: "FYI",
        eyebrow: "Real estate",
        description: "Destination real-estate browsing for lean-back discovery.",
        href: "https://www.fyi.tv/shows/tiny-house-nation",
        meta: "FYI",
      },
    ],
  },
  {
    brand: "VICE TV",
    description: "Documentary and culture programming from VICE TV.",
    shows: [
      {
        title: "Dark Side of the Ring",
        brand: "VICE TV",
        eyebrow: "Documentary",
        description: "Investigative wrestling stories from VICE TV.",
        href: "https://www.vicetv.com/en_us/show/dark-side-of-the-ring",
        meta: "Season 6",
      },
      {
        title: "Dark Side of the Ring: After Dark",
        brand: "VICE TV",
        eyebrow: "Aftershow",
        description: "A panel-format companion for the Dark Side franchise.",
        href: "https://www.vicetv.com/en_us/show/dark-side-of-the-ring-after-dark",
        meta: "VICE TV",
      },
      {
        title: "Tales From The Territories",
        brand: "VICE TV",
        eyebrow: "Documentary",
        description: "Wrestling territory history and culture reporting.",
        href: "https://www.vicetv.com/en_us/topic/dark-side-of-the-ring",
        meta: "VICE TV",
      },
    ],
  },
  {
    brand: "BIOGRAPHY",
    description: "People-led storytelling and evergreen profile discovery.",
    shows: [
      {
        title: "Biography",
        brand: "BIOGRAPHY",
        eyebrow: "Profiles",
        description: "A people-first channel row for evergreen life stories and notable figures.",
        href: "https://www.biography.com/",
        meta: "Profiles",
      },
      {
        title: "History Makers",
        brand: "BIOGRAPHY",
        eyebrow: "Culture",
        description: "A profile slot for figures with cultural impact and long-tail interest.",
        href: "https://www.biography.com/",
        meta: "Biography",
      },
      {
        title: "Icons",
        brand: "BIOGRAPHY",
        eyebrow: "Archive",
        description: "A compact row item for biography-led archive discovery.",
        href: "https://www.biography.com/",
        meta: "Biography",
      },
    ],
  },
];

const brandAccent: Record<EntertainmentShow["brand"], string> = {
  "A&E": "#2B78D0",
  HISTORY: "#E4AA33",
  Lifetime: "#F52A68",
  LMN: "#E51D50",
  FYI: "#00A982",
  "VICE TV": "#F5F5F5",
  BIOGRAPHY: "#9DD0FF",
};

function formatBrandInitials(brand: EntertainmentShow["brand"]) {
  if (brand === "HISTORY") return "H";
  if (brand === "Lifetime") return "L";
  if (brand === "VICE TV") return "VICE";
  if (brand === "BIOGRAPHY") return "BIO";
  return brand;
}

export function EntertainmentWatchPage() {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const activeHero = heroShows[activeHeroIndex] ?? heroShows[0];
  const activeRow = useMemo(() => channelRows.find((row) => row.brand === activeHero.brand), [activeHero.brand]);

  return (
    <div
      className="min-h-screen bg-[#050608] text-white"
      style={{
        "--primary": "#E4AA33",
        "--hp-primary": "#E4AA33",
        "--hp-nav": "#E4AA33",
        "--hp-section-title": "#F6D48A",
        "--hp-sidebar-heading": "#F6D48A",
        "--component-navigation-utility-background-knockout": "#050608",
        "--component-navigation-utility-megamenu-background-knockout": "#101216",
        "--component-navigation-utility-content-knockout": "#FFFFFF",
        "--component-navigation-utility-content-accent": "#F6D48A",
        "--component-navigation-utility-content-accent-hover": "#FFE0A0",
      } as React.CSSProperties}
    >
      <UtilityBar activeDestinationOverride="Entertainment" darkMode />
      <MainNav
        brandSlug="hearst-all"
        activeFilter="Featured"
        navLinksOverride={entertainmentNavLinks}
        darkMode
      />
      <main>
        <section className="relative min-h-[min(76vh,760px)] overflow-hidden border-b border-white/10">
          {activeHero.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeHero.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050608_0%,rgba(5,6,8,0.92)_28%,rgba(5,6,8,0.42)_68%,rgba(5,6,8,0.8)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050608] to-transparent" />
          <div className="relative mx-auto flex min-h-[min(76vh,760px)] max-w-[1440px] items-end px-5 pb-12 pt-28 md:px-8 lg:pb-16">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <BrandPill brand={activeHero.brand} />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">{activeHero.eyebrow}</span>
              </div>
              <h1 className="headline max-w-3xl text-balance text-5xl leading-none md:text-7xl">
                {activeHero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/78 md:text-lg md:leading-8">
                {activeHero.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={activeHero.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-white px-5 text-sm font-bold text-black no-underline transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <Play className="size-4" aria-hidden="true" />
                  View show
                </a>
                <span className="text-sm font-semibold text-white/70">{activeHero.meta}</span>
              </div>
              <div className="mt-8 flex items-center gap-2">
                {heroShows.map((show, index) => (
                  <button
                    key={show.title}
                    type="button"
                    onClick={() => setActiveHeroIndex(index)}
                    aria-label={`Show ${show.title} in the hero`}
                    aria-current={index === activeHeroIndex ? "true" : undefined}
                    className={cn(
                      "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                      index === activeHeroIndex ? "w-9 bg-white" : "w-2.5 bg-white/35 hover:bg-white/60",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col justify-between gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F6D48A]">Entertainment</p>
              <h2 className="headline mt-2 text-3xl leading-tight md:text-4xl">A&E family channels</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/62">
              A lean-back browse surface with one full-width feature area and dedicated channel rows below. No sidebars, no admin chrome.
            </p>
          </div>

          {activeRow ? <FeaturedRow row={activeRow} /> : null}
          <div className="mt-8 space-y-10">
            {channelRows.map((row) => (
              <ChannelRow key={row.brand} row={row} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter
        siteName={<BrandLogo slug="hearst-all" className="h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
        copyrightYear={2026}
        finePrintNote="Prototype only. Entertainment artwork and show links are sourced from the public A&E family websites where available."
      />
    </div>
  );
}

function FeaturedRow({ row }: { row: (typeof channelRows)[number] }) {
  return (
    <section className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 md:p-5" aria-labelledby="featured-entertainment-row">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Featured row</p>
          <h2 id="featured-entertainment-row" className="mt-1 text-xl font-bold text-white">{row.brand}</h2>
        </div>
        <BrandPill brand={row.brand} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {row.shows.map((show) => <ShowCard key={show.title} show={show} featured />)}
      </div>
    </section>
  );
}

function ChannelRow({ row }: { row: (typeof channelRows)[number] }) {
  return (
    <section aria-labelledby={`entertainment-${row.brand.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <BrandPill brand={row.brand} />
            <h2 id={`entertainment-${row.brand.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} className="text-2xl font-bold text-white">
              {row.brand}
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">{row.description}</p>
        </div>
        <a href={row.shows[0]?.href ?? "#"} target="_blank" rel="noreferrer" className="hidden min-h-11 items-center gap-1 text-sm font-bold text-white/72 no-underline hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:inline-flex">
          View channel
          <ChevronRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <div className="grid auto-cols-[minmax(15.5rem,22rem)] grid-flow-col gap-4 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] md:auto-cols-[minmax(19rem,24rem)]">
        {row.shows.map((show) => <ShowCard key={show.title} show={show} />)}
      </div>
    </section>
  );
}

function ShowCard({ show, featured = false }: { show: EntertainmentShow; featured?: boolean }) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.055] transition-colors hover:border-white/28">
      <a href={show.href} target="_blank" rel="noreferrer" className="block h-full min-w-0 text-white no-underline">
        <span className={cn("relative grid place-items-center overflow-hidden bg-white/[0.07]", featured ? "aspect-[16/10]" : "aspect-video")}>
          {show.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={show.imageUrl} alt={`Show artwork for ${show.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <span className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] p-6 text-center">
              <span className="text-3xl font-black tracking-tight" style={{ color: brandAccent[show.brand] }}>{formatBrandInitials(show.brand)}</span>
            </span>
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3">
            <BrandPill brand={show.brand} compact />
          </span>
        </span>
        <span className="block p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">{show.eyebrow}</span>
          <span className="mt-2 line-clamp-2 block text-xl font-bold leading-tight transition-colors group-hover:text-[#F6D48A]">{show.title}</span>
          <span className="mt-2 line-clamp-2 block text-sm leading-6 text-white/58">{show.description}</span>
          <span className="mt-4 block text-xs font-bold text-white/42">{show.meta}</span>
        </span>
      </a>
    </article>
  );
}

function BrandPill({ brand, compact = false }: { brand: EntertainmentShow["brand"]; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full bg-black/55 ring-1 ring-white/14", compact ? "px-2 py-1" : "px-3 py-1.5")}>
      <span
        aria-hidden="true"
        className={cn("grid shrink-0 place-items-center rounded-[4px] bg-white text-[9px] font-black leading-none text-black", compact ? "size-5" : "size-6")}
        style={{ color: brand === "VICE TV" ? "#050608" : brandAccent[brand] }}
      >
        {formatBrandInitials(brand)}
      </span>
      <span className={cn("font-bold leading-none text-white", compact ? "text-[11px]" : "text-xs")}>{brand}</span>
    </span>
  );
}
