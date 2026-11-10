"use client";

import React from "react";
import { HomePageTemplate, MainNav } from "@/components/home-page";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { SiteFooter } from "@/components/fre/site-footer";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import {
  hearstInternationalCountryNames,
  hearstInternationalFeedCountries,
  hearstInternationalFeeds,
  getHearstInternationalFeed,
  getHearstInternationalFeedBrandSlug,
  getHearstInternationalFeedLogoUrl,
} from "@/lib/hearst-international-feeds";

/** The default International view: every edition mixed into one river. */
const ALL_EDITIONS = "all";
const ALL_EDITIONS_LABEL = "All editions";

/** The section nav lists countries instead of topic categories; each filters the mixed river. */
const countryNavLinks = [ALL_EDITIONS_LABEL, ...hearstInternationalFeedCountries.map((code) => hearstInternationalCountryNames[code] ?? code)];
const countryNavHrefs: Record<string, string> = Object.fromEntries([
  [ALL_EDITIONS_LABEL, "/hearst-plus/international/"],
  ...hearstInternationalFeedCountries.map((code) => [hearstInternationalCountryNames[code] ?? code, `/hearst-plus/international/?country=${code}`]),
]);
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";

type InternationalStory = {
  id: string;
  brand: string;
  title: string;
  url: string;
  description: string;
  imageUrl: string | null;
  publishedAt: string | null;
  /** Present on mixed stories: the edition each story came from. */
  country?: string;
  feedUrl?: string;
};

export function InternationalFeedPage({
  initialFeedUrl,
  initialCountry,
  initialStories,
}: {
  initialFeedUrl?: string;
  initialCountry?: string;
  /** The server's cached mix, when warm, so the river renders on first paint without a client fetch. */
  initialStories?: InternationalStory[];
}) {
  const [selectedUrl, setSelectedUrl] = React.useState(
    initialFeedUrl && getHearstInternationalFeed(initialFeedUrl) ? initialFeedUrl : ALL_EDITIONS,
  );
  const isMix = selectedUrl === ALL_EDITIONS;
  const countryCode = initialCountry?.toUpperCase();
  const initialCountryName = isMix && countryCode && hearstInternationalFeedCountries.includes(countryCode)
    ? hearstInternationalCountryNames[countryCode] ?? countryCode
    : undefined;
  const hasInitialStories = isMix && Boolean(initialStories?.length);
  const [stories, setStories] = React.useState<InternationalStory[]>(hasInitialStories ? initialStories ?? [] : []);
  const [status, setStatus] = React.useState<"pending" | "connected" | "error">(hasInitialStories ? "connected" : "pending");
  // Set with the stories, not per render, so the server and client agree on the "Latest story" time.
  const [fetchedAt, setFetchedAt] = React.useState(() => new Date().toISOString());
  /** The feed the current stories belong to; a server-provided mix needs no client fetch. */
  const loadedUrl = React.useRef<string | null>(hasInitialStories ? ALL_EDITIONS : null);
  const [error, setError] = React.useState<string | null>(null);
  const selectedFeed = isMix ? undefined : getHearstInternationalFeed(selectedUrl);
  const selectedCountry = selectedFeed ? hearstInternationalCountryNames[selectedFeed.country] ?? selectedFeed.country : "International";

  const internationalStories = stories.map<LifestyleRiverStory>((story) => {
    const storyFeed = getHearstInternationalFeed(story.feedUrl) ?? selectedFeed;
    const storyCountry = storyFeed ? hearstInternationalCountryNames[storyFeed.country] ?? storyFeed.country : selectedCountry;
    return {
    id: `international-${encodeURIComponent(story.url)}`,
    brand: story.brand,
    brandSlug: storyFeed ? getHearstInternationalFeedBrandSlug(storyFeed) : "hearst-all",
    topic: isMix ? storyCountry : "For You",
    title: story.title,
    summary: story.description,
    image: story.imageUrl ?? "",
    byline: isMix ? `${storyCountry} edition` : `${story.brand} official edition`,
    readTime: "Source",
    popularity: 80,
    signal: "Trending",
    tags: [story.brand, storyCountry, "International"],
    age: 0,
    publishedAt: story.publishedAt ?? undefined,
    sourceUrl: story.url,
    };
  });
  const selectedBrandSlug = selectedFeed ? getHearstInternationalFeedBrandSlug(selectedFeed) : "hearst-all";
  const selectedBrandName = selectedFeed?.name ?? "All international editions";
  const sourceNote = {
    brand: selectedBrandName,
    brandSlug: selectedBrandSlug,
    feedCount: internationalStories.length,
    importedCount: internationalStories.length,
    selectedCount: internationalStories.length,
  };
  // The river keeps stories whose brand has a source note, so the mix needs one note per edition.
  const sourceNotes = isMix
    ? Array.from(
        internationalStories.reduce((notes, story) => {
          const note = notes.get(story.brand) ?? { brand: story.brand, brandSlug: story.brandSlug, feedCount: 0, importedCount: 0, selectedCount: 0 };
          note.feedCount += 1;
          note.importedCount += 1;
          note.selectedCount += 1;
          return notes.set(story.brand, note);
        }, new Map<string, typeof sourceNote>()).values(),
      )
    : [sourceNote];
  const staticDestinationData: HearstDestinationStaticData = {
    all: { stories: [], sourceNotes },
    lifestyle: { stories: [], sourceNotes },
    autos: { stories: [], sourceNotes },
    flux: { stories: [], sourceNotes },
    ew: { stories: [], sourceNotes },
  };

  const liveFeedData = {
    stories: internationalStories,
    sourceNotes,
    dataSourceCopy: isMix
      ? "Official RSS feeds from every Hearst international edition, mixed by country and brand."
      : `Official ${selectedBrandName} international edition RSS feed.`,
    fetchedAt,
    isFallback: status !== "connected",
    productName: isMix ? "Hearst+ International" : `${selectedBrandName} International`,
  };

  React.useEffect(() => {
    if (!selectedUrl) return;
    if (loadedUrl.current === selectedUrl) return;
    let cancelled = false;
    async function loadStories() {
      setStatus("pending");
      setError(null);
      try {
        const response = await fetch(`/api/hearst-international/stories/?feed=${encodeURIComponent(selectedUrl)}`, { cache: "no-store" });
        const payload = await response.json() as { stories?: InternationalStory[]; status?: "pending" | "connected" | "error"; error?: string };
        if (!response.ok) throw new Error(payload.error || "International feed failed.");
        if (!cancelled) {
          const nextStories = payload.stories ?? [];
          loadedUrl.current = nextStories.length > 0 ? selectedUrl : null;
          setStories(nextStories);
          setFetchedAt(new Date().toISOString());
          // A finished request is never "pending": with no stories the page shows its empty or error state.
          setStatus(nextStories.length > 0 ? "connected" : "error");
          setError(payload.error ?? null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setStories([]);
          setStatus("error");
          setError(loadError instanceof Error ? loadError.message : "International feed failed.");
        }
      }
    }
    void loadStories();
    return () => {
      cancelled = true;
    };
  }, [selectedUrl]);

  // While stories load, render the real destination chrome and the shared river skeleton, so the page
  // keeps its final masthead, country navigation and column layout instead of placeholder copy.
  if (status === "pending" || (status === "connected" && stories.length > 0)) {
    return (
      <HomePageTemplate
        riverLoading={status === "pending"}
        initialBrandSlug={isMix ? undefined : selectedBrandSlug}
        staticDestinationData={staticDestinationData}
        liveFeedData={liveFeedData}
        liveFeedMode="replace"
        activeDestinationOverride="International"
        navLinksOverride={countryNavLinks}
        navLinkHrefOverrides={countryNavHrefs}
        initialFilter={initialCountryName}
        mastheadLogoOverride={selectedFeed ? {
          src: getHearstInternationalFeedLogoUrl(selectedFeed),
          label: selectedFeed.name,
          className: "h-[52px] max-w-[440px] brightness-0 sm:h-[62px] sm:max-w-[520px]",
        } : null}
      />
    );
  }

  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] font-brand text-[var(--hp-text-primary)]">
      <UtilityBar activeDestinationOverride="International" />
      <MainNav
        brandSlug="hearst-all"
        selectedBrand={{ name: selectedFeed?.name ?? "International", slug: "hearst-all" }}
        activeFilter="For You"
        mastheadLogoOverride={selectedFeed ? { src: getHearstInternationalFeedLogoUrl(selectedFeed), label: selectedFeed.name } : null}
      />
      <main className="mx-auto grid max-w-[var(--width-content-max)] grid-cols-1 gap-[var(--layout-gap)] px-4 py-8 md:px-6 lg:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)] xl:px-12">
        <aside className="min-w-0 lg:sticky lg:top-[108px] lg:self-start">
          <section className="rounded-card border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="international-feed-list">
            <h1 id="international-feed-list" className="text-xs font-bold uppercase tracking-[0.16em] text-primary">International feeds</h1>
            <div className="mt-4 grid gap-4">
              <button
                type="button"
                onClick={() => setSelectedUrl(ALL_EDITIONS)}
                className={`rounded px-3 py-2 text-left text-sm font-bold ${isMix ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                All editions
              </button>
              {hearstInternationalFeedCountries.map((country) => (
                <div key={country}>
                  <h2 className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{hearstInternationalCountryNames[country] ?? country}</h2>
                  <div className="grid gap-1">
                    {hearstInternationalFeeds.filter((feed) => feed.country === country).map((feed) => (
                      <button
                        key={`${country}-${feed.name}-${feed.url}`}
                        type="button"
                        onClick={() => setSelectedUrl(feed.url)}
                        className={`rounded px-3 py-2 text-left text-sm font-bold ${selectedUrl === feed.url ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                      >
                        {feed.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
        <section className="min-w-0 space-y-4" aria-label={`${selectedFeed?.name ?? "International"} story river`}>
          <header className="rounded-card border border-border bg-[var(--hp-surface)] p-6 shadow-[var(--hp-shadow-card)]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">International</p>
            <h2 className="mt-2 text-3xl font-bold">{selectedBrandName}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{isMix ? "Stories from every official international edition, mixed by country and brand." : "Stories from the official international edition feed."}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">{stories.length > 0 ? `${stories.length} stories loaded` : "No stories yet"}</p>
          </header>
          {error ? <p className="rounded-card border border-border bg-[var(--hp-surface)] p-4 text-sm text-muted-foreground shadow-[var(--hp-shadow-card)]">{error}</p> : null}
          {stories.map((story) => (
            <article key={story.id} className="group/card grid overflow-hidden rounded-card border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] sm:grid-cols-[220px_minmax(0,1fr)]">
              <a href={story.imageUrl ?? story.url} target="_blank" rel="noopener noreferrer" className="aspect-[16/10] bg-[var(--hp-surface-low)] sm:aspect-auto">
                {story.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={story.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </a>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{story.brand}</p>
                <h3 className="mt-2 text-xl font-bold leading-tight"><a href={story.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-primary">{story.title}</a></h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{story.description}</p>
              </div>
            </article>
          ))}
          {stories.length === 0 && !error ? <p className="rounded-card border border-border bg-[var(--hp-surface)] p-6 text-sm text-muted-foreground shadow-[var(--hp-shadow-card)]">No stories are available for this edition yet.</p> : null}
        </section>
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:self-start">
          <section className="rounded-card border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="international-context">
            <h2 id="international-context" className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Edition context</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p><span className="font-bold text-foreground">{selectedCountry}</span> edition</p>
              <p>{selectedFeed?.name}</p>
              <p>{status === "connected" ? "Official RSS connected" : "Official RSS unavailable right now"}</p>
            </div>
            {selectedFeed ? (
              <a href={selectedFeed.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-bold text-primary underline underline-offset-4">
                Visit official site
              </a>
            ) : null}
          </section>
          <section className="rounded-card border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">More from {selectedCountry}</h2>
            <div className="mt-3 grid gap-1">
              {hearstInternationalFeeds.filter((feed) => feed.country === selectedFeed?.country && feed.url !== selectedFeed?.url).slice(0, 5).map((feed) => (
                <button key={feed.url} type="button" onClick={() => setSelectedUrl(feed.url)} className="rounded px-2 py-2 text-left text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground">
                  {feed.name}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </main>
      <SiteFooter siteName="Hearst+ International" />
    </div>
  );
}
