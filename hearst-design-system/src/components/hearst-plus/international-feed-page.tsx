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
  getHearstInternationalFeedBrandSlug,
  getHearstInternationalFeedLogoUrl,
} from "@/lib/hearst-international-feeds";
import type { HearstDestinationStaticData } from "@/lib/hearst-destination-data-types";

type InternationalStory = {
  id: string;
  brand: string;
  title: string;
  url: string;
  description: string;
  imageUrl: string | null;
  publishedAt: string | null;
};

export function InternationalFeedPage({ initialFeedUrl }: { initialFeedUrl?: string }) {
  const [selectedUrl, setSelectedUrl] = React.useState(initialFeedUrl ?? hearstInternationalFeeds[0]?.url ?? "");
  const [stories, setStories] = React.useState<InternationalStory[]>([]);
  const [status, setStatus] = React.useState<"pending" | "connected" | "error">("pending");
  const [error, setError] = React.useState<string | null>(null);
  const selectedFeed = hearstInternationalFeeds.find((feed) => feed.url === selectedUrl) ?? hearstInternationalFeeds[0];
  const selectedCountry = selectedFeed ? hearstInternationalCountryNames[selectedFeed.country] ?? selectedFeed.country : "International";

  const internationalStories = stories.map<LifestyleRiverStory>((story) => ({
    id: `international-${encodeURIComponent(story.url)}`,
    brand: story.brand,
    brandSlug: selectedFeed ? getHearstInternationalFeedBrandSlug(selectedFeed) : "hearst-all",
    topic: "For You",
    title: story.title,
    summary: story.description,
    image: story.imageUrl ?? "",
    byline: `${story.brand} official edition`,
    readTime: "Source",
    popularity: 80,
    signal: "Trending",
    tags: [story.brand, selectedCountry, "International"],
    age: 0,
    publishedAt: story.publishedAt ?? undefined,
    sourceUrl: story.url,
  }));
  const selectedBrandSlug = selectedFeed ? getHearstInternationalFeedBrandSlug(selectedFeed) : "hearst-all";
  const selectedBrandName = selectedFeed?.name ?? "International";
  const sourceNote = {
    brand: selectedBrandName,
    brandSlug: selectedBrandSlug,
    feedCount: internationalStories.length,
    importedCount: internationalStories.length,
    selectedCount: internationalStories.length,
  };
  const staticDestinationData: HearstDestinationStaticData = {
    all: { stories: [], sourceNotes: [sourceNote] },
    lifestyle: { stories: [], sourceNotes: [sourceNote] },
    autos: { stories: [], sourceNotes: [sourceNote] },
    flux: { stories: [], sourceNotes: [sourceNote] },
    ew: { stories: [], sourceNotes: [sourceNote] },
  };

  const liveFeedData = {
    stories: internationalStories,
    sourceNotes: [sourceNote],
    dataSourceCopy: `Official ${selectedBrandName} international edition RSS feed.`,
    fetchedAt: new Date().toISOString(),
    isFallback: status !== "connected",
    productName: `${selectedBrandName} International`,
  };

  React.useEffect(() => {
    if (!selectedUrl) return;
    let cancelled = false;
    async function loadStories() {
      setStatus("pending");
      setError(null);
      try {
        const response = await fetch(`/api/hearst-international/stories?feed=${encodeURIComponent(selectedUrl)}`, { cache: "no-store" });
        const payload = await response.json() as { stories?: InternationalStory[]; status?: "pending" | "connected" | "error"; error?: string };
        if (!response.ok) throw new Error(payload.error || "International feed failed.");
        if (!cancelled) {
          setStories(payload.stories ?? []);
          setStatus(payload.status ?? "pending");
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

  if (status === "connected" && selectedFeed) {
    return (
      <HomePageTemplate
        initialBrandSlug={selectedBrandSlug}
        staticDestinationData={staticDestinationData}
        liveFeedData={liveFeedData}
        liveFeedMode="replace"
        mastheadLogoOverride={{
          src: getHearstInternationalFeedLogoUrl(selectedFeed),
          label: selectedFeed.name,
          className: "h-[52px] max-w-[440px] brightness-0 sm:h-[62px] sm:max-w-[520px]",
        }}
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
      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-8 lg:grid-cols-[240px_1fr_280px] lg:px-10">
        <aside className="min-w-0 lg:sticky lg:top-[108px] lg:self-start">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="international-feed-list">
            <h1 id="international-feed-list" className="text-xs font-bold uppercase tracking-[0.16em] text-primary">International feeds</h1>
            <div className="mt-4 grid gap-4">
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
          <header className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-6 shadow-[var(--hp-shadow-card)]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">International</p>
            <h2 className="mt-2 text-3xl font-bold">{selectedFeed?.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Stories from the official international edition feed.</p>
            <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">{status === "connected" ? `${stories.length} stories loaded` : status}</p>
          </header>
          {error ? <p className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 text-sm text-muted-foreground shadow-[var(--hp-shadow-card)]">{error}</p> : null}
          {stories.map((story) => (
            <article key={story.id} className="group/card grid overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] sm:grid-cols-[220px_minmax(0,1fr)]">
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
          {status === "pending" && stories.length === 0 ? <p className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-6 text-sm text-muted-foreground shadow-[var(--hp-shadow-card)]">Loading this edition’s stories…</p> : null}
          {status !== "pending" && stories.length === 0 && !error ? <p className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-6 text-sm text-muted-foreground shadow-[var(--hp-shadow-card)]">No stories are available for this edition yet.</p> : null}
        </section>
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:self-start">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="international-context">
            <h2 id="international-context" className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Edition context</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p><span className="font-bold text-foreground">{selectedCountry}</span> edition</p>
              <p>{selectedFeed?.name}</p>
              <p>{status === "connected" ? "Official RSS connected" : status === "pending" ? "Feed verification pending" : "Feed error"}</p>
            </div>
            {selectedFeed ? (
              <a href={selectedFeed.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-bold text-primary underline underline-offset-4">
                Visit official site
              </a>
            ) : null}
          </section>
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
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
