import Link from "next/link";
import type { CSSProperties } from "react";
import { DraggableBrandLogoMarquee } from "@/components/brand-logo-marquee";
import { SiteFooter } from "@/components/fre/site-footer";
import { entertainmentWebsiteFeedConfigs } from "@/lib/hearst-entertainment-story-feeds";
import { hearstNewspaperPublications } from "@/lib/hearst-newspaper-feed-framework";
import type { BrandTheme } from "@/lib/brands";
import { getHearstBrandRoute, getHearstDestinationRoute } from "@/lib/hearst-routes";
import { hearstTVStations } from "@/lib/hearst-tv-feed-framework";
import { brandLogos } from "@/lib/logos";
import { themeOptions } from "@/lib/theme-options";

export const productImage = "https://hips.hearstapps.com/hmg-prod/images/4cf6b4aa-4f88-469f-a235-545368381794.jpeg";

function getThemeColor(slug: string, role: "1" | "2", fallback: string) {
  return themeOptions.find((option) => option.slug === slug)?.colors[role] || fallback;
}

const hearstPrimaryColor = getThemeColor("hearst-all", "1", "var(--primary)");
const lifestylePrimaryColor = getThemeColor("hearst-lifestyle", "1", "var(--primary)");
const autosPrimaryColor = getThemeColor("hearst-plus", "1", "var(--primary)");
const fluxPrimaryColor = getThemeColor("hearst-flux", "1", "var(--foreground)");
const wellnessPrimaryColor = getThemeColor("hearst-ew", "1", "var(--primary)");
const localNewsPrimaryColor = "#087A68";
const entertainmentPrimaryColor = "#B9913F";
const knockoutContentColor = "var(--palette-content-knockout, white)";
const neutralAccentColor = "var(--muted)";

const productPages = [
  { id: "story", label: "Product story", mobileLabel: "Story", href: "/about-hearst-magazines/" },
  { id: "value", label: "Why Hearst+", mobileLabel: "Why Hearst+", href: "/why-hearst-plus/" },
  { id: "blueprint", label: "Blueprint", mobileLabel: "Blueprint", href: "/hearst-product-blueprint/" },
  { id: "ads", label: "Ad logic", mobileLabel: "Ads", href: "/ad-logic/" },
  { id: "articles", label: "Article system", mobileLabel: "Articles", href: "/hearst-article-blueprint/" },
  { id: "tokens", label: "Token architecture", mobileLabel: "Tokens", href: "/token-architecture/" },
  { id: "hds", label: "HDS framework", mobileLabel: "HDS", href: "/hds-brand-framework/" },
  { id: "architecture", label: "App architecture", mobileLabel: "Architecture", href: "/architecture/" },
  { id: "ai-in-hds", label: "AI in HDS", mobileLabel: "AI in HDS", href: "/ai-in-hds/" },
] as const;

export type ProductPageId = (typeof productPages)[number]["id"];

const productLinkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function ProductHeader({ current }: { current: ProductPageId }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-2 px-5 py-3 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <Link
          href={getHearstDestinationRoute("all")}
          className={`flex min-h-11 items-center self-start ${productLinkFocus}`}
          aria-label="Hearst Magazines"
        >
          <LogoMark slug="hearst-all" name="Hearst Magazines" color={hearstPrimaryColor} className="h-6 w-32 sm:w-40" />
        </Link>
        <nav aria-label="Product pages" className="hidden items-center gap-2 text-sm font-semibold lg:flex">
          {productPages.map((page) => (
            <Link
              key={page.id}
              aria-current={current === page.id ? "page" : undefined}
              className={`inline-flex min-h-11 items-center px-2 ${productLinkFocus} ${
                current === page.id
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              href={page.href}
            >
              {page.label}
            </Link>
          ))}
          <Link
            className={`inline-flex min-h-11 items-center px-2 text-muted-foreground hover:text-foreground ${productLinkFocus}`}
            href={getHearstDestinationRoute("all")}
          >
            Open prototype
          </Link>
        </nav>
        <nav
          aria-label="Product pages"
          className="-mx-5 flex min-w-0 overflow-x-auto border-t border-border px-5 text-xs font-bold md:-mx-10 md:px-10 lg:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {productPages.map((page) => (
            <Link
              key={page.id}
              href={page.href}
              aria-current={current === page.id ? "page" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center px-3 ${productLinkFocus} ${
                current === page.id
                  ? "bg-accent text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {page.mobileLabel}
            </Link>
          ))}
          <Link
            className={`inline-flex min-h-11 shrink-0 items-center px-3 text-muted-foreground ${productLinkFocus}`}
            href={getHearstDestinationRoute("all")}
          >
            Prototype
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function ProductFooter() {
  return (
    <SiteFooter
      siteName={<LogoMark slug="hearst-all" name="Hearst+" color={knockoutContentColor} className="h-6 w-48" />}
      copyrightYear={2026}
    />
  );
}

export const streams = [
  { name: "Lifestyle", color: lifestylePrimaryColor, copy: "Home, food, style, wellness and entertainment" },
  { name: "Autos", color: autosPrimaryColor, copy: "Reviews, EVs, ownership and enthusiast culture" },
  { name: "Fashion & Luxury", color: fluxPrimaryColor, copy: "Fashion, design, culture, travel and ideas" },
  { name: "Enthusiast & Wellness", color: wellnessPrimaryColor, copy: "Fitness, health, gear and active living" },
  { name: "Local News", color: localNewsPrimaryColor, copy: "Hearst TV stations, newspapers and local source choice" },
  { name: "A&E Family", color: entertainmentPrimaryColor, copy: "Channel stories, show pages, previews and video discovery" },
];

export const brandSections = [
  {
    name: "Lifestyle",
    logoSlug: "hearst-lifestyle",
    route: getHearstDestinationRoute("lifestyle"),
    count: 259,
    color: lifestylePrimaryColor,
    brands: [
      ["Cosmopolitan", "cosmopolitan", 28],
      ["Country Living", "country-living", 28],
      ["Delish", "delish", 28],
      ["Good Housekeeping", "good-housekeeping", 28],
      ["House Beautiful", "house-beautiful", 28],
      ["The Pioneer Woman", "pioneer-woman", 28],
      ["Prevention", "prevention", 27],
      ["Redbook", "redbook", 30],
      ["Seventeen", "seventeen", 30],
      ["Woman's Day", "womans-day", 4],
    ],
  },
  {
    name: "Autos",
    logoSlug: "hearst-plus",
    route: getHearstDestinationRoute("autos"),
    count: 200,
    color: autosPrimaryColor,
    brands: [
      ["Autoweek", "autoweek", 36],
      ["Bring a Trailer", "bring-a-trailer", 20],
      ["Car and Driver", "car-and-driver", 36],
      ["HOT ROD", "hot-rod", 36],
      ["MotorTrend", "motortrend", 36],
      ["Road & Track", "road-and-track", 36],
    ],
  },
  {
    name: "Fashion & Luxury",
    logoSlug: "hearst-flux",
    route: getHearstDestinationRoute("flux"),
    count: 200,
    color: fluxPrimaryColor,
    brands: [
      ["Elle", "elle", 34],
      ["Elle Decor", "elle-decor", 34],
      ["Esquire", "esquire", 33],
      ["Harper's Bazaar", "harpers-bazaar", 33],
      ["Town & Country", "town-and-country", 33],
      ["Veranda", "veranda", 33],
    ],
  },
  {
    name: "Enthusiast & Wellness",
    logoSlug: "hearst-ew",
    route: getHearstDestinationRoute("ew"),
    count: 200,
    color: wellnessPrimaryColor,
    brands: [
      ["Best Products", "best-products", 29],
      ["Bicycling", "bicycling", 29],
      ["Men's Health", "mens-health", 29],
      ["Oprah Daily", "oprah-daily", 29],
      ["Popular Mechanics", "popular-mechanics", 28],
      ["Runner's World", "runners-world", 28],
      ["Women's Health", "womens-health", 28],
    ],
  },
] as const;

export const portfolioBrands = brandSections.flatMap((section) =>
  section.brands.map(([name, slug, count]) => ({
    name,
    slug,
    count,
    section: section.name,
  }))
);

export const totalMagazineStories = brandSections.reduce((sum, destination) => sum + destination.count, 0);
export const totalMagazineBrands = brandSections.reduce((sum, destination) => sum + destination.brands.length, 0);
export const totalTVStations = hearstTVStations.length;
export const totalNewspapers = hearstNewspaperPublications.length;
export const totalEntertainmentChannels = entertainmentWebsiteFeedConfigs.length;
export const totalEntertainmentShows = 42;
export const totalPortfolioSources =
  totalMagazineBrands + totalTVStations + totalNewspapers + totalEntertainmentChannels;

export const prototypeStats = [
  { value: String(totalMagazineStories), label: "magazine catalog", copy: "Validated stories with source dates, canonical URLs and real Hearst image metadata." },
  { value: String(totalPortfolioSources), label: "portfolio sources", copy: "Magazine brands, TV stations, newspapers and entertainment channels represented in one product frame." },
  { value: String(streams.length), label: "reader sections", copy: "Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, Local News and A&E Family." },
  { value: String(totalEntertainmentShows), label: "show surfaces", copy: "Promoted show entries extend discovery beyond article feeds into entertainment intent." },
];

export const journeys = [
  { title: "Discover", copy: "A useful daily edition brings together magazine stories, local headlines, show-led entertainment and video without asking readers to hunt site by site." },
  { title: "Deepen intent", copy: "Every save, follow, hide, local-source choice, show interest and More Like This action sharpens the mix while visible controls keep the reader in charge." },
  { title: "Build a habit", copy: "Freshness, continuity and remembered interests make Hearst+ worth returning to throughout the day." },
];

export const valueProps = [
  { title: "For readers", copy: "Less searching, more signal and one useful relationship with the brands, local sources, shows and communities they already care about." },
  { title: "For editorial", copy: "A new distribution surface that preserves magazine, station, newspaper and channel authority while creating discovery across adjacent reader intent." },
  { title: "For the business", copy: "A credible environment for evaluating direct return behavior, registration value, cross-source discovery and future paid membership paths." },
  { title: "For product teams", copy: "One composable system for destinations, sources, cards, readers, signals and ranking. The same model can power magazines, local news and entertainment." },
];

export function DemoNav() {
  const navItems = ["All", "Lifestyle", "Autos", "Fashion & Luxury", "Enthusiast & Wellness", "Local News", "A&E Family"];
  const storyTabs = ["For You", "Today", "Local", "Shows", "Saved"];

  return (
    <figure
      aria-label="Illustrative Hearst+ navigation and story treatment"
      className="overflow-hidden border border-border bg-card shadow-[var(--hp-shadow-card)]"
    >
      <figcaption className="sr-only">
        Static stakeholder diagram showing the intended Hearst+ navigation hierarchy and a sample editorial story. This is not an interactive product component.
      </figcaption>
      <div className="grid h-8 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-[#111827] px-4 text-[11px] font-semibold text-white">
        <span className="hidden items-center gap-3 sm:flex"><span>Shop</span><span>Newsletter</span></span>
        <div className="flex min-w-0 justify-center overflow-hidden">
          <div className="flex min-w-max items-center gap-1 rounded-full bg-white/[0.08] p-0.5">
            {navItems.map((item) => (
              <span key={item} className={`inline-flex min-h-6 items-center rounded-full px-2 text-[10px] font-bold leading-none ${item === "All" ? "bg-white text-black" : "text-white/85"}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <span className="rounded-full bg-[#B9913F] px-3 py-1 text-[10px] font-black text-[#111827]">Sign in</span>
      </div>
      <div className="flex h-20 items-center justify-between px-5">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Edition</span>
        <LogoMark slug="hearst-all" name="Hearst+" color={hearstPrimaryColor} className="h-6 w-48" position="center" />
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Search</span>
      </div>
      <div className="flex gap-2 overflow-hidden border-y border-border px-5 py-3 text-xs font-semibold">
        {storyTabs.map((item) => (
          <span key={item} className={`shrink-0 rounded-full px-3 py-1.5 ${item === "For You" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{item}</span>
        ))}
      </div>
      <div className="grid gap-0 bg-[#F8FAFC] p-4 md:grid-cols-[1.25fr_.95fr]">
        <div className="relative min-h-72 overflow-hidden bg-secondary">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${productImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white/80">Today&apos;s edit</span>
            <h3 className="mt-3 max-w-md font-serif text-4xl leading-[0.98]">A daily river across every Hearst interest.</h3>
          </div>
        </div>
        <div className="grid content-between border border-l-0 border-border bg-card p-5">
          <div>
            <span className="mb-3 block text-[11px] font-black uppercase tracking-[0.16em] text-primary">Recommended next</span>
            <h3 className="font-serif text-3xl leading-[1.02] text-foreground">Stories, local updates and shows in one place.</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">The real app connects destination navigation, source menus, reader controls and a shared story-card system.</p>
          </div>
          <div className="mt-6 grid gap-2 text-xs font-bold text-muted-foreground sm:grid-cols-3">
            <span className="border border-border px-3 py-2">Save</span>
            <span className="border border-border px-3 py-2">Follow</span>
            <span className="border border-border px-3 py-2">More like this</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

export function StoryCard({ ad = false }: { ad?: boolean }) {
  return (
    <article
      aria-label={ad ? "Illustrative commercial concept card" : "Illustrative editorial story card"}
      className="min-w-0 border-t-4 bg-card p-5 shadow-sm"
      style={{ borderTopColor: ad ? lifestylePrimaryColor : hearstPrimaryColor }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground"><span>{ad ? "Commercial concept" : "Editor pick"}</span><span>{ad ? "Not integrated" : "Country Living · Home"}</span></div>
      <h3 className="font-serif text-2xl leading-tight text-foreground">{ad ? "Summer home refresh" : "The ideas worth making time for today"}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{ad ? "A future evaluation pattern for disclosed commercial utility, not a completed campaign integration." : "A complete content model carries brand, topic, format, freshness and source signals."}</p>
      <div className="mt-5 flex gap-2 text-xs font-bold"><span className="border border-border px-3 py-2">{ad ? "Concept CTA" : "Save"}</span><span className="border border-border px-3 py-2">{ad ? "Disclosure" : "More like this"}</span></div>
    </article>
  );
}

export const systemSteps = [
  { title: "Ingest", copy: "Validated RSS snapshots and current Personalize recommendations" },
  { title: "Normalize", copy: "Source dates, bylines, canonical URLs, media, topics and brands" },
  { title: "Score", copy: "Popularity, freshness, reader signals, daypart and return context" },
  { title: "Guard", copy: "Hidden items, repetition, diversity and playable-media eligibility" },
];

export function MobileMenuIcon() { return <span aria-hidden="true" className="block h-3 w-5 border-y-2 border-current" />; }

export function BrandPortfolioGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid min-w-0 gap-4">
      {brandSections.map((section) => (
        <article key={section.name} className="min-w-0 overflow-hidden border border-border bg-card p-5">
          <Link href={section.route} className="group flex flex-wrap items-end justify-between gap-3">
            <div>
              <LogoMark slug={section.logoSlug} name={section.name} color={section.color} className="h-8 w-44" />
              <p className="sr-only">{section.name}</p>
              <span className="mt-1 block text-sm font-bold text-muted-foreground group-hover:text-foreground">{section.count} stories in this destination</span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{section.brands.length} brands</span>
          </Link>
          <div className={`mt-5 grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
            {section.brands.map(([name, slug, count]) => (
              <Link
                key={slug}
                href={getHearstBrandRoute(slug)}
                className="group flex min-h-16 items-center justify-between gap-3 border border-border bg-muted/35 px-3 py-3 hover:border-primary/45"
              >
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <LogoMark slug={slug} name={name} color={section.color} className="h-6 w-20 shrink-0 sm:w-28" />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-muted-foreground group-hover:text-foreground">{name}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">{count}</span>
              </Link>
            ))}
          </div>
        </article>
      ))}
      <article className="min-w-0 overflow-hidden border border-border bg-card p-5">
        <Link href="/hearst-plus/local-news/" className="group flex flex-wrap items-end justify-between gap-3">
          <div>
            <LogoMark slug="hearst-local-news" name="Local News" color={localNewsPrimaryColor} className="h-8 w-44" />
            <p className="sr-only">Local News</p>
            <span className="mt-1 block text-sm font-bold text-muted-foreground group-hover:text-foreground">{totalTVStations} TV stations and {totalNewspapers} newspapers</span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{totalTVStations + totalNewspapers} sources</span>
        </Link>
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <div className="min-w-0">
            <Link href="/hearst-plus/local-news/#tv-stations" className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
              TV Stations
            </Link>
            <div className={`mt-3 grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
              {hearstTVStations.map((station) => (
                <Link
                  key={station.id}
                  href={`/hearst-plus/local-news/?station=${encodeURIComponent(station.id)}#tv-stations`}
                  className="group flex min-h-16 items-center justify-between gap-3 border border-border bg-muted/35 px-3 py-3 hover:border-primary/45"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-8 w-12 shrink-0 items-center justify-center overflow-hidden bg-white text-[10px] font-black uppercase text-foreground">
                      {station.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={station.logo} alt="" loading="lazy" className="h-full w-full object-contain p-1" />
                      ) : (
                        station.callSign.replace(/[^a-z0-9]/gi, "").slice(0, 4)
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-muted-foreground group-hover:text-foreground">{station.callSign}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{station.market}</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <Link href="/hearst-plus/local-news/newspapers/#newspapers" className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
              Newspapers
            </Link>
            <div className={`mt-3 grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
              {hearstNewspaperPublications.map((publication) => {
                const logo = publication.mastheadLogo || publication.logo;
                return (
                  <Link
                    key={publication.id}
                    href={`/hearst-plus/local-news/newspapers/?publication=${encodeURIComponent(publication.id)}#newspapers`}
                    className="group flex min-h-16 items-center justify-between gap-3 border border-border bg-muted/35 px-3 py-3 hover:border-primary/45"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-8 w-20 shrink-0 items-center justify-center overflow-hidden bg-white text-[10px] font-black uppercase text-foreground">
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt="" loading="lazy" className="h-full w-full object-contain p-1" />
                        ) : (
                          publication.publicationName.replace(/[^a-z0-9]/gi, "").slice(0, 4)
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-muted-foreground group-hover:text-foreground">{publication.publicationName}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{publication.market}</span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </article>
      <article className="min-w-0 overflow-hidden border border-border bg-card p-5">
        <Link href="/hearst-plus/entertainment/" className="group flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="block text-sm font-black uppercase tracking-[0.16em]" style={{ color: entertainmentPrimaryColor }}>A&amp;E Family</span>
            <span className="mt-1 block text-sm font-bold text-muted-foreground group-hover:text-foreground">{totalEntertainmentChannels} channels with show pages and story feeds</span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{totalEntertainmentShows} show entries</span>
        </Link>
        <div className={`mt-5 grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
          {entertainmentWebsiteFeedConfigs.map((channel) => (
            <Link
              key={channel.slug}
              href={channel.showHref}
              className="group flex min-h-16 items-center justify-between gap-3 border border-border bg-muted/35 px-3 py-3 hover:border-primary/45"
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-8 w-20 shrink-0 items-center justify-center overflow-hidden bg-white text-[10px] font-black uppercase text-foreground">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={channel.logo}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full object-contain p-1.5 ${channel.slug === "a-e" || channel.slug === "biography" ? "brightness-0" : ""}`}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-muted-foreground group-hover:text-foreground">{channel.brand}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">Shows + stories</span>
                </span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">Open</span>
            </Link>
          ))}
        </div>
      </article>
    </div>
  );
}

export function BrandLogoMarquee() {
  return <DraggableBrandLogoMarquee brands={portfolioBrands} />;
}

export function DestinationConvergence() {
  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Destination logic</p>
          <h3 className="mt-4 font-serif text-4xl leading-none">One personalized river, six clear sections.</h3>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">Readers can enter through a destination, brand, local market, publication, channel, show or topic. The product keeps those paths connected so intent can move across the portfolio without losing source trust.</p>
        </div>
        <div className="p-6">
          <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] 2xl:items-center">
            <div className="min-w-0 space-y-3">
              {brandSections.map((section) => (
                <Link key={section.name} href={section.route} className="group flex items-center justify-between gap-4 border border-border bg-muted/35 p-4 hover:border-primary/45">
                  <span className="flex min-w-0 items-center gap-3">
                    <LogoMark slug={section.logoSlug} name={section.name} color={section.color} className="h-7 w-36" />
                    <span className="sr-only">{section.name}</span>
                  </span>
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{section.count} stories</span>
                </Link>
              ))}
              <Link href="/hearst-plus/local-news/" className="group flex items-center justify-between gap-4 border border-border bg-muted/35 p-4 hover:border-primary/45">
                <span className="min-w-0">
                  <span className="block text-sm font-black uppercase tracking-[0.14em]" style={{ color: localNewsPrimaryColor }}>Local News</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{totalTVStations} TV stations + {totalNewspapers} newspapers</span>
                </span>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">source choice</span>
              </Link>
              <Link href="/hearst-plus/entertainment/" className="group flex items-center justify-between gap-4 border border-border bg-muted/35 p-4 hover:border-primary/45">
                <span className="min-w-0">
                  <span className="block text-sm font-black uppercase tracking-[0.14em]" style={{ color: entertainmentPrimaryColor }}>A&amp;E Family</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{totalEntertainmentChannels} channels + {totalEntertainmentShows} show entries</span>
                </span>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">shows + stories</span>
              </Link>
            </div>
            <div className="hidden h-px w-full bg-primary 2xl:block" />
            <Link href={getHearstDestinationRoute("all")} className="flex min-h-56 min-w-0 flex-col justify-center bg-foreground p-6 text-white hover:bg-foreground/90">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--component-navigation-utility-content-accent)]">Unified river</span>
              <strong className="mt-4 max-w-sm text-wrap font-serif text-3xl leading-none sm:text-4xl">Personalized daily briefing</strong>
              <span className="mt-5 text-sm leading-6 text-white/75">A ranked mix that blends followed sources, current intent, local context, shows, freshness, utility and controlled discovery.</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JourneyMatrix() {
  const rows = [
    ["Daily edition", "Open the river", "Scan useful highlights", "Save, follow or continue", "A reason to return"],
    ["Local source check", "Choose a station or newspaper", "Read market-specific updates", "Set a preferred source", "Local utility remembered"],
    ["Show discovery", "Enter A&E Family", "Explore channels, stories and shows", "Open a preview or show page", "Entertainment intent captured"],
    ["Community return", "Open a group or thread", "See what readers are discussing", "Join, reply or save", "Habit reinforced"],
  ];

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-black uppercase tracking-[0.14em] text-primary">
            <th className="w-52 p-5">Journey</th>
            <th className="p-5">Entry</th>
            <th className="p-5">Explore</th>
            <th className="p-5">Signal</th>
            <th className="p-5">Outcome</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border last:border-b-0">
              {row.map((cell, index) => (
                <td key={cell} className={`p-5 align-top ${index === 0 ? "font-serif text-2xl leading-tight text-foreground" : "text-muted-foreground"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RankingExample() {
  const factors = [
    ["Popularity", "82", "Uses the story's source popularity signal"],
    ["Recency", "+48", "Published within the freshest six-hour window"],
    ["Followed topic", "+18", "Matches a topic the reader follows"],
    ["Followed brand", "+16", "Matches a publication the reader follows"],
    ["Saved tags", "+14", "Shares a tag with saved content"],
    ["More Like This", "+22", "Matches a reader-boosted tag"],
    ["Daypart", "+16", "Fits the active morning topic mix"],
    ["Return freshness", "+24", "Fresh since the previous visit"],
  ];

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <StoryCard />
      <div className="min-w-0 border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-5">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Why this ranked here</p>
            <h3 className="mt-3 font-serif text-3xl leading-none">Implemented score inputs</h3>
          </div>
          <strong className="text-right text-xs font-bold uppercase tracking-[0.12em] text-primary">Additive<br />points</strong>
        </div>
        <div className="mt-5 space-y-4">
          {factors.map(([name, score, reason]) => (
            <div key={name} className="grid gap-3 border-b border-border/60 pb-3 last:border-b-0 sm:grid-cols-[9rem_1fr_4rem] sm:items-center">
              <div>
                <strong className="text-sm">{name}</strong>
                <p className="mt-1 text-xs text-muted-foreground">{reason}</p>
              </div>
              <div className="h-px bg-border" />
              <span className="text-right text-xs font-bold text-muted-foreground">{score}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          Exact points vary by story and profile mode. Hidden items receive an exclusion penalty, a previous lead is suppressed on return, and the final pass prevents the same brand or topic from occupying three consecutive positions.
        </p>
      </div>
    </div>
  );
}

export function ArchitectureFlow() {
  const columns = [
    ["Sources", "Validated public RSS snapshots and current Personalize recommendations"],
    ["Normalize", "Brand, topic, format, source date, byline, media and canonical URL"],
    ["Eligibility", "Real imagery, playable video, active scope, exclusions and deduplication"],
    ["Decide", "Additive score, return context, diversity pass and explanation"],
    ["Deliver", "Server entry payload, cached pages, lazy river and in-app readers"],
  ];

  return (
    <div className="border border-border bg-card p-6">
      <div className="grid gap-3 lg:grid-cols-5">
        {columns.map(([title, copy], index) => (
          <div key={title} className="relative border border-border bg-muted/35 p-4">
            <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-8 font-bold">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 text-xs leading-5 text-muted-foreground md:grid-cols-3">
        <p><strong className="text-foreground">Server:</strong> Next.js route handlers combine the latest valid catalog with read-only recommendation APIs.</p>
        <p><strong className="text-foreground">Catalog:</strong> validated RSS story data, brand assets, semantic tokens, logos and fonts.</p>
        <p><strong className="text-foreground">Browser:</strong> progressive rendering, accessible controls, ranking interaction and local demo state.</p>
      </div>
    </div>
  );
}

export function PaletteSystem() {
  const palette = [
    ["Hearst Blue", hearstPrimaryColor, getThemeColor("hearst-all", "2", neutralAccentColor)],
    ["Deep Ink", "var(--foreground)", neutralAccentColor],
    ["Lifestyle", lifestylePrimaryColor, getThemeColor("hearst-lifestyle", "2", neutralAccentColor)],
    ["Autos", autosPrimaryColor, getThemeColor("hearst-plus", "2", neutralAccentColor)],
    ["Fashion & Luxury", fluxPrimaryColor, getThemeColor("hearst-flux", "2", neutralAccentColor)],
    ["Enthusiast & Wellness", wellnessPrimaryColor, getThemeColor("hearst-ew", "2", neutralAccentColor)],
  ];

  return (
    <div className="border border-border bg-card p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Color system</p>
          <h3 className="mt-4 font-serif text-4xl leading-none">Section color has a light-mode and dark-mode companion.</h3>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">The prototype uses section color for identity and a companion tint when the same identity appears on dark surfaces. This keeps brand recognition without sacrificing contrast.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {palette.map(([name, primary, companion]) => (
            <div key={name} className="border border-border p-4">
              <div className="flex gap-2">
                <span className="h-12 flex-1 border border-border" style={{ backgroundColor: primary }} />
                <span className="h-12 flex-1 border border-border" style={{ backgroundColor: companion }} />
              </div>
              <strong className="mt-3 block text-sm">{name}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{primary} · {companion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandStyleGuide() {
  const sectionThemes = brandSections.map((section) => {
    const theme = themeOptions.find((option) => option.slug === section.logoSlug);
    return { section, theme };
  });

  return (
    <div className="space-y-8">
      <div className="border border-border bg-card p-6">
        <div className="grid gap-5 border-b border-border pb-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Section style guides</p>
            <h3 className="mt-4 font-serif text-4xl leading-none">Destinations set the broad visual voice.</h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Each destination has a primary color, headline treatment and dark-mode companion. Individual brands inherit the section context when their own brand token is not available.</p>
        </div>
        <div className="mt-6 grid gap-3 xl:grid-cols-2">
          {sectionThemes.map(({ section, theme }) => (
            <StyleTile
              key={section.name}
              name={section.name}
              slug={section.logoSlug}
              href={section.route}
              color={section.color}
              accent={theme?.colors["2"] || neutralAccentColor}
              headline={theme?.fontHeadline || "Newsreader"}
              body={theme?.fontDefault || "Inter"}
              sample="Distinct editorial rhythm"
            />
          ))}
        </div>
      </div>

      {brandSections.map((section) => (
        <article key={section.name} className="border border-border bg-card p-6">
          <Link href={section.route} className="group flex flex-wrap items-end justify-between gap-4">
            <div>
              <LogoMark slug={section.logoSlug} name={section.name} color={section.color} className="h-8 w-44" />
              <p className="mt-2 text-sm font-bold text-muted-foreground group-hover:text-foreground">{section.name} brand styles</p>
            </div>
            <span className="text-xs font-bold text-muted-foreground">{section.brands.length} brands</span>
          </Link>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {section.brands.map(([name, slug]) => {
              const theme = getBrandStyleTheme(slug, section.logoSlug);
              const inherited = theme.slug === section.logoSlug;
              return (
                <StyleTile
                  key={slug}
                  name={name}
                  slug={slug}
                  href={getHearstBrandRoute(slug)}
                  color={theme.colors["1"] || section.color}
                  accent={theme.colors["2"] || neutralAccentColor}
                  headline={theme.fontHeadline}
                  body={theme.fontDefault}
                  sample={inherited ? "Section inherited theme" : "Brand voice sample"}
                  inherited={inherited}
                />
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

function getBrandStyleTheme(slug: string, sectionSlug: string): BrandTheme {
  const aliases: Record<string, string> = {
    "pioneer-woman": "the-pioneer-woman",
  };
  return (
    themeOptions.find((option) => option.slug === slug) ||
    themeOptions.find((option) => option.slug === aliases[slug]) ||
    themeOptions.find((option) => option.slug === sectionSlug) ||
    themeOptions[0]
  );
}

function StyleTile({ name, slug, href, color, accent, headline, body, sample, inherited = false }: { name: string; slug: string; href: string; color: string; accent: string; headline: string; body: string; sample: string; inherited?: boolean }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-5 border border-border bg-muted/35 p-4 transition hover:border-primary/45 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <LogoMark slug={slug} name={name} color="var(--foreground)" className="h-8 w-36" />
          <p className="mt-3 text-xs font-bold text-muted-foreground group-hover:text-foreground">{name}</p>
        </div>
        <div className="mt-5">
          <div className="flex gap-2">
            <span className="h-9 flex-1 border border-border" style={{ backgroundColor: color }} />
            <span className="h-9 flex-1 border border-border" style={{ backgroundColor: accent }} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">{color} · {accent}</p>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">Type sample</span>
          {inherited && <span className="border border-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">section inherited</span>}
        </div>
        <p className="mt-3 max-w-full text-balance text-2xl leading-[1.05] text-foreground" style={{ fontFamily: `"${headline}", Georgia, serif`, fontWeight: 700 }}>{sample}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground" style={{ fontFamily: `"${body}", Inter, system-ui, sans-serif` }}>Body copy uses the brand default font for metadata, controls and explanatory text.</p>
        <dl className="mt-4 grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-2">
          <div><dt className="font-bold text-foreground">Headline</dt><dd className="mt-1">{headline}</dd></div>
          <div><dt className="font-bold text-foreground">Body</dt><dd className="mt-1">{body}</dd></div>
        </dl>
      </div>
    </Link>
  );
}

function LogoMark({ slug, name, className = "h-8 w-32", color = "var(--foreground)", position = "left center" }: { slug: string; name: string; className?: string; color?: string; position?: string }) {
  const src = brandLogos[slug];
  if (!src || src.startsWith("http")) {
    return <span className="w-32 shrink-0 text-sm font-black uppercase tracking-[0.08em]" style={{ color }}>{name}</span>;
  }

  const style: CSSProperties = {
    backgroundColor: color,
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: position,
    maskPosition: position,
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };

  return <span aria-hidden="true" className={`block shrink-0 ${className}`} style={style} />;
}
