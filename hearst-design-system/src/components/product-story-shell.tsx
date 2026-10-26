import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { DraggableBrandLogoMarquee } from "@/components/brand-logo-marquee";
import { SiteFooter } from "@/components/fre/site-footer";
import { entertainmentWebsiteFeedConfigs } from "@/lib/hearst-entertainment-story-feeds";
import { hearstNewspaperPublications } from "@/lib/hearst-newspaper-feed-framework";
import { brands, type BrandTheme } from "@/lib/brands";
import { getHearstBrandRoute, getHearstDestinationRoute } from "@/lib/hearst-routes";
import { hearstTVStations } from "@/lib/hearst-tv-feed-framework";
import { brandLogos, resolveBrandLogoColor } from "@/lib/logos";
import { themeOptions } from "@/lib/theme-options";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { baseDestinationConfigs, getLifestyleScoreBreakdown } from "@/lib/hearst-personalization-model";

export const productImage = "https://hips.hearstapps.com/hmg-prod/images/4cf6b4aa-4f88-469f-a235-545368381794.jpeg";
const documentationSample = lifestyleRiverStories.find((story) => story.id === "delish-food-news-a74237374-jimmy-johns-picklewich-pickle-pals-2026")!;
const documentationSampleUrl = documentationSample.sourceUrl ?? getHearstBrandRoute(documentationSample.brandSlug);
const documentationSamplePublishedDate = documentationSample.publishedAt
  ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(documentationSample.publishedAt))
  : null;
const documentationSampleTheme = brands.find((brand) => brand.slug === documentationSample.brandSlug);
const documentationSampleProfile = {
  followedTopics: ["Food"],
  followedBrands: ["Delish"],
  savedTags: [],
  boostedTags: [],
  savedIds: [],
  hiddenIds: [],
};
const documentationSampleScore = getLifestyleScoreBreakdown(
  documentationSample,
  documentationSampleProfile,
  { daypart: "morning", returnHours: 0, contentDay: "today", isSimulated: true },
  baseDestinationConfigs.lifestyle,
);

function getThemeColor(slug: string, role: "1" | "2", fallback: string) {
  return themeOptions.find((option) => option.slug === slug)?.colors[role] || fallback;
}

const hearstPrimaryColor = getThemeColor("hearst-all", "1", "var(--primary)");
const lifestylePrimaryColor = getThemeColor("hearst-lifestyle", "1", "var(--primary)");
const autosPrimaryColor = getThemeColor("hearst-plus", "1", "var(--primary)");
const fluxPrimaryColor = getThemeColor("hearst-flux", "1", "var(--foreground)");
const wellnessPrimaryColor = getThemeColor("hearst-ew", "1", "var(--primary)");
const localNewsPrimaryColor = getThemeColor("hearst-local-news", "1", "var(--primary)");
const entertainmentPrimaryColor = getThemeColor("hearst-entertainment", "1", "var(--primary)");
const knockoutContentColor = "var(--palette-content-knockout, white)";
const neutralAccentColor = "var(--muted)";

export type ProductPageId = "reference" | "story" | "value" | "blueprint" | "ads" | "articles" | "tokens" | "hds" | "architecture" | "ai-in-hds" | "constitution" | "design-agent";

const productLinkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function ProductHeader({ current, appearance = "light" }: { current: ProductPageId; appearance?: "light" | "navy" }) {
  const isNavy = appearance === "navy";
  const linkFocus = isNavy
    ? "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
    : productLinkFocus;

  return (
    <header
      data-current-product-page={current}
      className={isNavy ? "border-b border-primary-foreground/20 bg-[var(--hp-utility-bar)] text-primary-foreground" : "border-b border-border bg-card"}
    >
      <div className="mx-auto flex max-w-[1360px] flex-col gap-2 px-5 py-3 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <Link
          href={getHearstDestinationRoute("all")}
          className={`flex min-h-11 items-center self-start ${linkFocus}`}
          aria-label="Hearst Magazines"
        >
          <LogoMark slug="hearst-all" name="Hearst Magazines" color={isNavy ? knockoutContentColor : hearstPrimaryColor} className="h-6 w-32 sm:w-40" />
        </Link>
        <nav aria-label="Prototype navigation" className="hidden items-center gap-2 text-sm font-semibold lg:flex">
          <Link
            className={`inline-flex min-h-11 items-center px-2 ${isNavy ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"} ${linkFocus}`}
            href={getHearstDestinationRoute("all")}
          >
            Open prototype
          </Link>
        </nav>
        <nav
          aria-label="Prototype navigation"
          className={`-mx-5 flex min-w-0 overflow-x-auto border-t px-5 text-xs font-bold md:-mx-10 md:px-10 lg:hidden ${isNavy ? "border-primary-foreground/20" : "border-border"}`}
          style={{ scrollbarWidth: "none" }}
        >
          <Link
            className={`inline-flex min-h-11 shrink-0 items-center px-3 ${isNavy ? "text-primary-foreground/80" : "text-muted-foreground"} ${linkFocus}`}
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
export const totalPortfolioSources =
  totalMagazineBrands + totalTVStations + totalNewspapers + totalEntertainmentChannels;

export const prototypeStats = [
  { value: String(totalMagazineStories), label: "snapshot stories", copy: "Image-backed public RSS records selected for this prototype snapshot across four magazine destinations. This is not a live feed count." },
  { value: String(totalPortfolioSources), label: "portfolio sources", copy: "Magazine brands, TV stations, newspapers and entertainment channels represented in one product frame." },
  { value: String(streams.length), label: "reader sections", copy: "Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, Local News and A&E Family." },
  { value: String(totalMagazineBrands), label: "magazine brands", copy: "Distinct publication identities represented in the four magazine destination snapshots." },
];

export const journeys = [
  { title: "Open a source-backed story", copy: "The sample Delish card shows the checked-in headline, topic, image, byline and read time. Its source link opens the original Delish article." },
  { title: "Change the next mix", copy: "In the prototype river, Save, Hide and More Like This update browser-local reader state. They do not update a production account or shared profile." },
  { title: "Choose local coverage", copy: "The Local News route lets a reader choose from configured station or newspaper sources. Feed availability varies by source and market." },
];

export const valueProps = [
  { title: "Reader", copy: "Browse magazine stories, configured local sources, video, communities and entertainment routes from one Hearst+ interface." },
  { title: "Editorial", copy: "Cards retain publication attribution and link to their source. The sample record above demonstrates the metadata shown in the river." },
  { title: "Business", copy: "The prototype can support evaluation of cross-source browsing and reader controls. It has no connected analytics, membership checkout or measured lift." },
  { title: "Product teams", copy: "The shared prototype composes destination routes, source-aware cards, reader controls and ranking with HDS tokens and publication themes." },
];

export function DemoNav() {
  const brandColor = documentationSampleTheme?.semanticColors["palette-content-brand"];
  const headlineStyle: CSSProperties | undefined = documentationSampleTheme
    ? {
        fontFamily: `"${documentationSampleTheme.fontHeadline}", Georgia, serif`,
        fontWeight: documentationSampleTheme.fontHeadlineWeight,
        fontStretch: documentationSampleTheme.fontHeadlineStretch || "normal",
      }
    : undefined;
  const bodyStyle: CSSProperties | undefined = documentationSampleTheme
    ? { fontFamily: `"${documentationSampleTheme.fontDefault}", Inter, system-ui, sans-serif` }
    : undefined;

  return (
    <figure
      aria-label="Sample Delish story record used by the Hearst+ prototype"
      className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--hp-shadow-card)]"
    >
      <figcaption className="sr-only">
        Public Delish RSS story record from the checked-in feed snapshot. The example demonstrates source attribution and opens the original Delish article.
      </figcaption>
      <Link href={documentationSampleUrl} target="_blank" rel="noreferrer" className="group block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image src={documentationSample.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground" style={brandColor ? { color: brandColor } : undefined}>{documentationSample.brand} · {documentationSample.topic} · {documentationSample.readTime}</p>
          <h3 className="mt-3 text-balance text-2xl leading-tight text-foreground sm:text-3xl" style={headlineStyle}>{documentationSample.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground" style={bodyStyle}>{documentationSample.summary} By {documentationSample.byline}.{documentationSamplePublishedDate ? ` Published ${documentationSamplePublishedDate}` : ""} In the sample feed snapshot.</p>
          <span className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary" style={brandColor ? { color: brandColor } : undefined}>Open the original Delish story <span aria-hidden="true" className="ml-2">↗</span></span>
        </div>
      </Link>
      <div className="border-t border-border bg-muted/40 px-5 py-3 text-xs leading-5 text-muted-foreground sm:px-6">
        Sample record from the checked-in public RSS snapshot. This card is a documentation example; the link opens {documentationSample.brand}.
      </div>
    </figure>
  );
}

export function StoryCard({ ad = false, storyId }: { ad?: boolean; storyId?: string }) {
  const story = storyId
    ? lifestyleRiverStories.find((candidate) => candidate.id === storyId) ?? documentationSample
    : documentationSample;
  const storyUrl = story.sourceUrl ?? getHearstBrandRoute(story.brandSlug);
  const storyTheme = brands.find((brand) => brand.slug === story.brandSlug);
  const storyHeadlineStyle: CSSProperties | undefined = storyTheme
    ? {
        fontFamily: `"${storyTheme.fontHeadline}", Georgia, serif`,
        fontWeight: storyTheme.fontHeadlineWeight,
        fontStretch: storyTheme.fontHeadlineStretch || "normal",
      }
    : undefined;
  const storyBodyStyle: CSSProperties | undefined = storyTheme
    ? { fontFamily: `"${storyTheme.fontDefault}", Inter, system-ui, sans-serif` }
    : undefined;
  const publishedDate = story.publishedAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(story.publishedAt))
    : "Date unavailable";

  if (!ad) {
    return (
      <article aria-label={`Sample ${story.brand} editorial story`} className="min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[var(--hp-shadow-card)]">
        <Link href={storyUrl} target="_blank" rel="noreferrer" className="group block focus-visible:outline-2 focus-visible:outline-primary">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <Image src={story.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{story.brand} · {story.topic}</p>
            <h3 className="mt-3 text-balance text-xl leading-tight text-card-foreground" style={storyHeadlineStyle}>{story.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground" style={storyBodyStyle}>{story.summary}</p>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground" style={storyBodyStyle}>By {story.byline ?? story.brand} · {story.readTime} · {publishedDate}</p>
          </div>
        </Link>
        <p className="border-t border-border bg-muted/40 px-5 py-3 text-xs leading-5 text-muted-foreground">Sample public story metadata from the checked-in feed snapshot. Selecting the card opens {story.brand}.</p>
      </article>
    );
  }
  return (
    <article
      aria-label={ad ? "Illustrative commercial concept card" : "Illustrative editorial story card"}
      className="min-w-0 border-t-4 bg-card p-5 shadow-sm"
      style={{ borderTopColor: ad ? lifestylePrimaryColor : hearstPrimaryColor }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground"><span>Commercial concept</span><span>Not integrated</span></div>
      <h3 className="font-serif text-2xl leading-tight text-foreground">Commercial placement example</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">No campaign, sponsor, creative, targeting, delivery, or click tracking is connected in this prototype. Ad behavior must be reviewed with commercial and legal teams before implementation.</p>
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
    <div className="@container/brand-portfolio grid min-w-0 gap-4">
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
          <div className={`mt-5 grid gap-3 ${compact ? "@xl/brand-portfolio:grid-cols-2" : "@xl/brand-portfolio:grid-cols-2 @2xl/brand-portfolio:grid-cols-3"}`}>
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
            <div className="mt-3 grid gap-3 @xl/brand-portfolio:grid-cols-2">
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
            <div className="mt-3 grid gap-3 @xl/brand-portfolio:grid-cols-2">
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
          <span className="text-xs font-semibold text-muted-foreground">{totalEntertainmentChannels} channel routes</span>
        </Link>
        <div className={`mt-5 grid gap-3 ${compact ? "@xl/brand-portfolio:grid-cols-2" : "@xl/brand-portfolio:grid-cols-2 @2xl/brand-portfolio:grid-cols-3"}`}>
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
    <div className="@container/destination-convergence overflow-hidden border border-border bg-card">
      <div className="grid gap-0 @xl/destination-convergence:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-border p-6 @xl/destination-convergence:border-b-0 @xl/destination-convergence:border-r">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Destination logic</p>
          <h3 className="mt-4 font-serif text-4xl leading-none">One personalized river, six clear sections.</h3>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">Readers can enter through a destination, brand, local market, publication, channel, show or topic. The product keeps those paths connected so intent can move across the portfolio without losing source trust.</p>
        </div>
        <div className="@container/convergence-body min-w-0 p-6">
          <div className="grid min-w-0 gap-4 @xl/convergence-body:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] @xl/convergence-body:items-center">
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
                  <span className="mt-1 block text-xs text-muted-foreground">{totalEntertainmentChannels} configured channel routes</span>
                </span>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">shows + stories</span>
              </Link>
            </div>
            <div className="hidden h-px w-full bg-primary @xl/convergence-body:block" />
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
    ["Magazine story", "Open Hearst+ Home", "Select Food and open the Delish sample", "Save or More Like This", "Action changes browser-local demo state"],
    ["Local source", "Open Local News", "Choose a configured station or newspaper", "Select a source", "Availability depends on the configured feed"],
    ["A&E show", "Open A&E Family", "Choose a configured channel and show route", "Open the show page", "The card is a show entry, not an article"],
    ["Community thread", "Open Communities", "Read a group thread and its replies", "Join or reply", "Sample interaction; no production account is connected"],
  ];

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-black uppercase tracking-[0.14em] text-primary">
            <th className="w-52 p-5">Flow</th>
            <th className="p-5">Start</th>
            <th className="p-5">Action</th>
            <th className="p-5">Reader input</th>
            <th className="p-5">Current behavior</th>
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
  const factorDescriptions: Record<string, string> = {
    popularity: "Popularity value stored on this sample record",
    followedTopic: "Food News matches the sample reader’s Food interest",
    followedBrand: "Sample reader follows Delish",
    recency: "Sample record age is 0 hours",
    timeOfDay: "Morning context from the prototype’s Lifestyle rules",
  };
  const factors = Object.entries(documentationSampleScore)
    .filter(([key, value]) => key !== "total" && value !== 0 && factorDescriptions[key])
    .map(([key, value]) => [key, value, factorDescriptions[key]]);

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <StoryCard />
      <div className="min-w-0 border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-5">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Why this ranked here</p>
            <h3 className="mt-3 font-serif text-3xl leading-none">Calculated sample score</h3>
          </div>
          <strong className="text-right text-xs font-bold uppercase tracking-[0.12em] text-primary">{documentationSampleScore.total}<br />points</strong>
        </div>
        <div className="mt-5 space-y-4">
          {factors.map(([name, score, reason]) => (
            <div key={name} className="grid gap-3 border-b border-border/60 pb-3 last:border-b-0 sm:grid-cols-[9rem_1fr_4rem] sm:items-center">
              <div>
                <strong className="text-sm">{name}</strong>
                <p className="mt-1 text-xs text-muted-foreground">{reason}</p>
              </div>
              <div className="h-px bg-border" />
              <span className="text-right text-xs font-bold text-muted-foreground">+{score}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          Example inputs: this checked-in Delish record, a reader who follows Food and Delish, no saves or boosted tags, a first morning visit, and no previous lead. The score is calculated by the current Lifestyle ranking function; changing the record, reader state, daypart, or return context changes it. The diversity pass runs after scoring.
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
  return (
    <div className="space-y-8">
      <div className="border border-border bg-card p-6">
        <div className="grid gap-5 border-b border-border pb-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Configured destinations</p>
            <h3 className="mt-4 font-serif text-4xl leading-none">Readers enter through six destinations.</h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">These links describe the prototype’s configured routes. The brand samples below show color and type only when a canonical brand token record exists in <code>tokens/brands</code>.</p>
        </div>
        <nav aria-label="Configured destinations" className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {brandSections.map((section) => (
            <Link key={section.name} href={section.route} className="flex min-h-12 items-center justify-between gap-3 border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span>{section.name}</span>
              <span className="text-xs font-normal text-muted-foreground">{section.brands.length} configured brands</span>
            </Link>
          ))}
        </nav>
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
              const theme = getBrandStyleTheme(slug);
              if (!theme) {
                return (
                  <article key={slug} className="grid min-w-0 gap-5 border border-border bg-muted/35 p-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                    <div className="flex min-w-0 flex-col justify-between">
                      <div>
                        <LogoMark slug={slug} name={name} color="var(--foreground)" className="h-8 w-36" />
                        <p className="mt-3 text-xs font-bold text-muted-foreground">{name}</p>
                      </div>
                      <span className="mt-5 text-xs font-bold text-muted-foreground">Canonical brand tokens unavailable</span>
                    </div>
                    <div className="min-w-0 self-center">
                      <p className="text-sm leading-6 text-muted-foreground">No brand token JSON is registered for this publication in the repository. Color and type samples are omitted until canonical values are available.</p>
                    </div>
                  </article>
                );
              }
              const brandColor = theme.semanticColors["palette-content-brand"];
              const brandSurface = theme.semanticColors["palette-background-subtle-brand"];
              const palettePrimary = theme.colors["1"] || brandColor;
              const paletteSecondary = theme.colors["2"] || brandSurface;
              if (!brandColor || !brandSurface || !palettePrimary || !paletteSecondary) {
                return (
                  <article key={slug} className="grid min-w-0 gap-5 border border-border bg-muted/35 p-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                    <div>
                      <LogoMark slug={slug} name={name} color="var(--foreground)" className="h-8 w-36" />
                      <p className="mt-3 text-xs font-bold text-muted-foreground">{name}</p>
                    </div>
                    <p className="self-center text-sm leading-6 text-muted-foreground">The registered brand token file is missing the semantic color roles required for this sample. Color and type samples are omitted rather than inferred.</p>
                  </article>
                );
              }
              const inherited = theme.slug === section.logoSlug;
              return (
                <StyleTile
                  key={slug}
                  name={name}
                  slug={slug}
                  href={getHearstBrandRoute(slug)}
                  color={brandColor}
                  palettePrimary={palettePrimary}
                  paletteSecondary={paletteSecondary}
                  headline={theme.fontHeadline}
                  headlineWeight={theme.fontHeadlineWeight}
                  headlineStretch={theme.fontHeadlineStretch}
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

function getBrandStyleTheme(slug: string): BrandTheme | null {
  const aliases: Record<string, string> = {
    "pioneer-woman": "the-pioneer-woman",
  };
  const normalizedSlug = aliases[slug] || slug;
  return brands.find((brand) => brand.slug === normalizedSlug) || null;
}

function StyleTile({ name, slug, href, color, palettePrimary, paletteSecondary, headline, headlineWeight, headlineStretch, body, sample, inherited = false }: { name: string; slug: string; href: string; color: string; palettePrimary: string; paletteSecondary: string; headline: string; headlineWeight: number; headlineStretch?: string; body: string; sample: string; inherited?: boolean }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-5 border border-border bg-muted/35 p-4 transition hover:border-primary/45 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <LogoMark slug={slug} name={name} color={color} className="h-8 w-36" />
          <p className="mt-3 text-xs font-bold text-muted-foreground group-hover:text-foreground">{name}</p>
        </div>
        <div className="mt-5">
          <div className="flex gap-2">
            <span className="h-9 flex-1 border border-border" style={{ backgroundColor: palettePrimary }} />
            <span className="h-9 flex-1 border border-border" style={{ backgroundColor: paletteSecondary }} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">{palettePrimary} · {paletteSecondary}</p>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">Type sample</span>
          {inherited && <span className="border border-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">section inherited</span>}
        </div>
        <p className="mt-3 max-w-full text-balance text-2xl leading-[1.05]" style={{ color, fontFamily: `"${headline}", Georgia, serif`, fontWeight: headlineWeight, fontStretch: headlineStretch || "normal" }}>{sample}</p>
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

  if (!resolveBrandLogoColor(slug, color)) {
    // Two-tone Hearst+ logos keep their own colors; a mask would flatten them.
    return (
      <span
        aria-hidden="true"
        className={`block shrink-0 bg-contain bg-no-repeat ${className}`}
        style={{ backgroundImage: `url(${src})`, backgroundPosition: position }}
      />
    );
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
