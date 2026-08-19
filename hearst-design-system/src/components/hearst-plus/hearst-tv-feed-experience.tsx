"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentReaderDialogShell, rememberContentReaderReturnFocus } from "@/components/hearst-plus/content-reader-dialog-shell";
import { ContentReaderMasthead } from "@/components/hearst-plus/content-reader-masthead";
import { FeaturedStoryCarousel } from "@/components/hearst-plus/featured-story-carousel";
import { LocalNewsSourceToggle } from "@/components/hearst-plus/local-news-source-toggle";
import { LifestyleRiverImage } from "@/components/hearst-plus/story-presentation";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FeedStatus, FeedType, HearstTVContentType, HearstTVFeed } from "@/lib/hearst-tv-feed-framework";
import {
  dedupeHearstTVContent,
  feedUrlTbd,
  getHearstTVFeedById,
  getHearstTVStationById,
  hearstTVFeeds,
  hearstTVSampleContent,
  hearstTVStations,
  type HearstTVContent,
  type HearstTVStation,
} from "@/lib/hearst-tv-feed-framework";

type ViewMode = "reader" | "admin";
type StoredFeed = HearstTVFeed;
type LocalNewsFeedResponse = {
  stories: HearstTVContent[];
  status: FeedStatus;
  fallback?: boolean;
  error?: string;
  feed?: {
    id: string;
    stationId: string;
    feedName: string;
    feedUrl: string;
    feedType: FeedType;
    lastSuccessfulFetch: string | null;
  };
};

const feedStorageKey = "hearst-tv-feed-admin-config:v1";
const allValue = "all";
const localNewsHeroStoryLimit = 3;
const localNewsRiverStoryLimit = 12;

function isConfiguredFeed(feed: StoredFeed) {
  return feed.enabled && feed.feedUrl !== feedUrlTbd;
}

function isConnectedFeed(feed: StoredFeed) {
  return isConfiguredFeed(feed)
    && feed.status === "connected";
}

export function HearstTVFeedExperience({ mode }: { mode: ViewMode }) {
  const [feeds, setFeeds] = useState<StoredFeed[]>(() => {
    if (typeof window === "undefined") return hearstTVFeeds;
    try {
      const stored = window.localStorage.getItem(feedStorageKey);
      return stored ? mergeStoredFeeds(JSON.parse(stored) as StoredFeed[]) : hearstTVFeeds;
    } catch {
      return hearstTVFeeds;
    }
  });
  const [selectedStation, setSelectedStation] = useState(allValue);
  const filterMessage = "Use the station filter to choose a Hearst TV market.";

  useEffect(() => {
    try {
      window.localStorage.setItem(feedStorageKey, JSON.stringify(feeds));
    } catch {
      // Local storage is optional for this prototype admin surface.
    }
  }, [feeds]);

  const enabledFeedCount = feeds.filter(isConfiguredFeed).length;
  const connectedFeedCount = feeds.filter(isConnectedFeed).length;

  const filteredContent = useMemo(() => {
    const stationIdsWithConfiguredFeeds = new Set(
      feeds
        .filter(isConfiguredFeed)
        .map((feed) => feed.stationId),
    );
    return dedupeHearstTVContent(hearstTVSampleContent)
      .filter((item) => {
        const station = getHearstTVStationById(item.stationId);
        if (!station) return false;
        if (selectedStation !== allValue && item.stationId !== selectedStation) return false;
        return true;
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .map((item) => ({
        ...item,
        hasConfiguredFeed: stationIdsWithConfiguredFeeds.has(item.stationId),
      }));
  }, [feeds, selectedStation]);
  const selectedStationRecord = selectedStation === allValue ? null : getHearstTVStationById(selectedStation);

  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] text-[var(--hp-text-primary)]">
      <section className="border-b border-[var(--hp-border)] bg-[var(--hp-surface)]">
        <div className="mx-auto max-w-[1360px] px-5 py-12 md:px-8 md:py-16">
          <p className="text-sm font-semibold text-[var(--hp-primary)]">Hearst TV content-feed capability</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-balance font-serif text-5xl font-bold leading-none text-[var(--hp-text-headline)] md:text-7xl">
                Local News
              </h1>
              <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-[var(--hp-text-secondary)]">
                A reusable feed framework for Hearst Television station content. Real RSS and MRSS feeds stay disabled
                until a verified endpoint is configured; sample cards demonstrate the native Hearst+ experience without
                pretending mock data is live.
              </p>
            </div>
            <div className="bg-[var(--hp-background)] p-5">
              <dl className="grid gap-px bg-[var(--hp-border)] sm:grid-cols-3 lg:grid-cols-1">
                <StatusStat label="Stations" value={String(hearstTVStations.length)} />
                <StatusStat label="Configured feeds" value={String(enabledFeedCount)} />
                <StatusStat label="Connected" value={String(connectedFeedCount)} />
              </dl>
            </div>
          </div>
        </div>
      </section>

      {mode === "reader" ? (
        <ReaderView
          feeds={feeds}
          filteredContent={filteredContent}
          filterMessage={filterMessage}
          selectedStation={selectedStation}
          selectedStationRecord={selectedStationRecord}
          onStationChange={setSelectedStation}
        />
      ) : (
        <AdminView feeds={feeds} setFeeds={setFeeds} />
      )}
    </div>
  );
}

type HearstTVLocalNewsRiverProps = {
  onOpenStory?: (storyId: string) => void;
  onStoriesChange?: (stories: LifestyleRiverStory[]) => void;
};

export function HearstTVLocalNewsRiver({
  onOpenStory,
  onStoriesChange,
}: HearstTVLocalNewsRiverProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedStation = searchParams.get("station");
  const routedStation = requestedStation && getHearstTVStationById(requestedStation)
    ? requestedStation
    : null;
  const [feeds] = useState<StoredFeed[]>(() => {
    if (typeof window === "undefined") return hearstTVFeeds;
    try {
      const stored = window.localStorage.getItem(feedStorageKey);
      return stored ? mergeStoredFeeds(JSON.parse(stored) as StoredFeed[]) : hearstTVFeeds;
    } catch {
      return hearstTVFeeds;
    }
  });
  const [manualSelectedStation, setManualSelectedStation] = useState(allValue);
  const selectedStation = routedStation ?? manualSelectedStation;
  const filterMessage = "Use the station filter to choose a Hearst TV market.";
  const [liveContent, setLiveContent] = useState<HearstTVContent[]>([]);
  const [liveFeedError, setLiveFeedError] = useState<string | null>(null);
  const [liveFeedLoading, setLiveFeedLoading] = useState(false);
  const [liveRiverLoading, setLiveRiverLoading] = useState(false);

  const configuredStationIds = useMemo(
    () => new Set(feeds.filter(isConfiguredFeed).map((feed) => feed.stationId)),
    [feeds],
  );
  const activeFeeds = useMemo(() => {
    if (selectedStation !== allValue) {
      const selectedFeed = feeds.find((feed) => feed.stationId === selectedStation && isConfiguredFeed(feed));
      return selectedFeed ? [selectedFeed] : [];
    }

    return feeds.filter(isConfiguredFeed);
  }, [feeds, selectedStation]);

  useEffect(() => {
    let cancelled = false;

    async function loadLocalNews() {
      if (activeFeeds.length === 0) {
        setLiveFeedLoading(false);
        setLiveRiverLoading(false);
        setLiveContent([]);
        setLiveFeedError(
          selectedStation === allValue
            ? null
            : "Feed URL TBD. Add a verified RSS or MRSS endpoint to activate this station.",
        );
        return;
      }

      setLiveFeedError(null);
      setLiveFeedLoading(true);
      setLiveRiverLoading(false);
      setLiveContent([]);

      const fetchFeedSlice = async (feed: StoredFeed, offset: number, limit: number) => {
        const station = getHearstTVStationById(feed.stationId);
        if (!station) return { stories: [], error: null };
        const params = new URLSearchParams({
          stationId: feed.stationId,
          feedId: feed.id,
          feedUrl: feed.feedUrl,
          feedType: feed.feedType,
          offset: String(offset),
          limit: String(limit),
        });
        const response = await fetch(`/api/hearst-tv/local-news?${params.toString()}`, {
          signal: AbortSignal.timeout(7000),
        });
        if (!response.ok) throw new Error(`Local news feed returned ${response.status}`);
        return await response.json() as LocalNewsFeedResponse;
      };

      const heroResults = await Promise.allSettled(
        activeFeeds.map((feed) => fetchFeedSlice(feed, 0, localNewsHeroStoryLimit)),
      );

      if (cancelled) return;

      const heroStories = heroResults.flatMap((result) => (
        result.status === "fulfilled" ? (result.value.stories ?? []) : []
      ));
      const heroErrors = heroResults.flatMap((result) => {
        if (result.status === "fulfilled") return result.value.error ? [result.value.error] : [];
        return [result.reason instanceof Error ? result.reason.message : "Local news feed failed."];
      });

      setLiveContent(heroStories);
      setLiveFeedLoading(false);
      if (selectedStation === allValue) {
        setLiveFeedError(heroStories.length > 0 ? null : heroErrors[0] ?? null);
      } else {
        setLiveFeedError(heroErrors[0] ?? null);
      }

      setLiveRiverLoading(true);
      const riverResults = await Promise.allSettled(
        activeFeeds.map((feed) => fetchFeedSlice(feed, localNewsHeroStoryLimit, localNewsRiverStoryLimit)),
      );

      if (cancelled) return;

      const riverStories = riverResults.flatMap((result) => (
        result.status === "fulfilled" ? (result.value.stories ?? []) : []
      ));

      setLiveContent(dedupeHearstTVContent([...heroStories, ...riverStories]));
      setLiveRiverLoading(false);
      if (selectedStation === allValue && heroStories.length === 0 && riverStories.length > 0) {
        setLiveFeedError(null);
      }
    }

    void loadLocalNews();

    return () => {
      cancelled = true;
    };
  }, [activeFeeds, selectedStation]);

  const filteredContent = useMemo(() => {
    if (liveFeedLoading && activeFeeds.length > 0) return [];

    const liveStationIds = new Set(liveContent.map((item) => item.stationId));
    const sampleContent = hearstTVSampleContent.filter((item) => !liveStationIds.has(item.stationId));
    const contentPool = selectedStation === allValue
      ? [...liveContent, ...sampleContent]
      : liveContent.some((item) => item.stationId === selectedStation)
        ? liveContent
        : hearstTVSampleContent.filter((item) => item.stationId === selectedStation);

    return dedupeHearstTVContent(contentPool)
      .filter((item) => {
        const station = getHearstTVStationById(item.stationId);
        if (!station) return false;
        if (selectedStation !== allValue && item.stationId !== selectedStation) return false;
        return true;
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .map((item) => ({
        ...item,
        hasConfiguredFeed: configuredStationIds.has(item.stationId),
      }));
  }, [activeFeeds.length, configuredStationIds, liveContent, liveFeedLoading, selectedStation]);
  const readerStories = useMemo(
    () => filteredContent.map((item) => mapLocalNewsContentToReaderStory(item)),
    [filteredContent],
  );
  const readerStoryById = useMemo(
    () => new Map(readerStories.map((story) => [story.id, story])),
    [readerStories],
  );
  const heroItems = filteredContent.slice(0, 3);
  const riverItems = filteredContent.slice(heroItems.length, heroItems.length + 12);

  useEffect(() => {
    onStoriesChange?.(readerStories);
  }, [onStoriesChange, readerStories]);

  useEffect(() => {
    return () => onStoriesChange?.([]);
  }, [onStoriesChange]);

  function handleStationChange(value: string) {
    setManualSelectedStation(value);
    const target = value === allValue
      ? "/hearst-plus/local-news/#tv-stations"
      : `/hearst-plus/local-news/?station=${encodeURIComponent(value)}#tv-stations`;
    router.replace(target, { scroll: false });
  }

  return (
    <div className="space-y-6" data-hearst-plus-local-news-river>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="local-news-filter-title">
            <LocalNewsSourceToggle activeSource="tv" />
            <h2 id="local-news-filter-title" className="mt-5 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Local News
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{filterMessage}</p>
            <div className="mt-4 grid gap-4">
              <FilterSelect
                id="inline-local-station-filter"
                label="Station"
                value={selectedStation}
                onChange={handleStationChange}
                options={[
                  { label: "All stations", value: allValue },
                  ...hearstTVStations.map((station) => ({
                    label: formatStationOptionLabel(station, configuredStationIds.has(station.id)),
                    value: station.id,
                  })),
                ]}
              />
            </div>
            <Link
              href="/hearst-plus/local-news/admin/"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Manage feeds
            </Link>
          </section>
        </aside>

        <main id="hearst-story-river" className="min-w-0 scroll-mt-28 space-y-4" aria-label="Hearst TV local news river">
          {liveFeedLoading && activeFeeds.length > 0 ? (
            <LocalNewsRiverSkeleton />
          ) : heroItems.length > 0 ? (
            <LocalNewsFeaturedCarousel
              key={heroItems.map((item) => item.id).join("|")}
              items={heroItems}
              onOpenStory={(story) => {
                if (onOpenStory) {
                  onOpenStory(story.id);
                  return;
                }

                if (story.sourceUrl) window.open(story.sourceUrl, "_blank", "noopener,noreferrer");
              }}
            />
          ) : (
            <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--hp-shadow-card)]">
              No TV station items match the current station. Clear the station filter to restore the river.
            </section>
          )}

          {!liveFeedLoading && liveFeedError ? (
            <p className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 text-xs leading-5 text-muted-foreground shadow-[var(--hp-shadow-card)]">
              {liveFeedError}
            </p>
          ) : null}

          {riverItems.map((item) => {
            const station = getHearstTVStationById(item.stationId);
            const feed = feeds.find((candidate) => candidate.id === item.feedId) ?? getHearstTVFeedById(item.feedId);
            const readerStory = readerStoryById.get(item.id);
            if (!station || !feed) return null;

            return (
              <article key={item.id} className="group/card relative min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50" data-story-module="river" data-story-id={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (readerStory && onOpenStory) {
                      onOpenStory(readerStory.id);
                      return;
                    }

                    if (item.url && item.url !== "#") {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="block w-full min-w-0 text-left no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
                  aria-label={`Open story: ${item.title}`}
                >
                  <span className="relative grid aspect-video min-h-0 w-full place-items-center overflow-hidden bg-[var(--hp-surface-low)] text-center text-sm font-bold text-primary" aria-hidden="true">
                    {item.imageUrl && readerStory ? (
                      <LifestyleRiverImage
                        story={readerStory}
                        alt=""
                        className="h-full w-full"
                        sizes="(max-width: 1024px) 100vw, 640px"
                        unoptimized
                      />
                    ) : (
                      station.callSign
                    )}
                  </span>
                  <span className="block min-w-0 p-4 sm:p-5">
                    <span className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
                        {item.isMock ? "Fallback" : "Latest"}
                      </span>
                      <span className="inline-flex min-h-7 items-center gap-1.5 rounded-[4px] text-[length:var(--text-token-4xs)] text-muted-foreground sm:min-h-0">
                        <StationLogo stationName={station.stationName} logoUrl={station.logo} small />
                        <span className="min-w-0 truncate">{station.stationName} · {station.market}</span>
                      </span>
                      <span className="rounded-full bg-[var(--hp-surface-low)] px-2 py-1 text-primary">{formatContentType(item.contentType)}</span>
                    </span>
                    <span className="headline block break-words text-2xl leading-tight text-foreground transition-colors group-hover/card:text-primary sm:text-[1.7rem]">
                      {item.title}
                    </span>
                    <span className="mt-3 line-clamp-3 block text-sm leading-6 text-muted-foreground">{item.description}</span>
                    <span className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span>{item.isMock ? "Mock sample" : feed.feedName}</span>
                      <span>{item.hasConfiguredFeed ? "RSS connected" : "Feed URL TBD"}</span>
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
          {liveRiverLoading && activeFeeds.length > 0 ? <LocalNewsRiverStorySkeletons /> : null}
          {!liveFeedLoading && !liveRiverLoading && filteredContent.length > 0 && riverItems.length === 0 ? (
            <p className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 text-sm leading-6 text-muted-foreground shadow-[var(--hp-shadow-card)]">
              More TV station stories will appear here as additional feed items match the selected station.
            </p>
          ) : null}
        </main>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Feed status
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="font-bold">{hearstTVStations.length}</span> Hearst TV stations</p>
              <p><span className="font-bold">{feeds.filter(isConfiguredFeed).length}</span> configured feeds</p>
              <p><span className="font-bold">{feeds.filter(isConnectedFeed).length}</span> connected</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Stations with a green dot have a real RSS or MRSS URL configured. TBD station records use prototype content until a verified endpoint is added in feed admin.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function LocalNewsRiverSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading local news stories" aria-busy="true">
      <section className="overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
        <div className="relative aspect-[16/9] min-h-[360px] overflow-hidden bg-[var(--hp-surface-low)]">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[var(--hp-surface-low)] via-white/80 to-[var(--hp-surface-low)]" />
          <div className="absolute left-6 top-6 h-8 w-48 animate-pulse rounded-full bg-white/80" />
          <div className="absolute inset-x-6 bottom-8 space-y-4">
            <div className="h-4 w-36 animate-pulse rounded-full bg-white/80" />
            <div className="h-10 w-3/4 animate-pulse rounded-full bg-white/90" />
            <div className="h-10 w-1/2 animate-pulse rounded-full bg-white/80" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
          <div className="flex gap-2">
            <span className="h-2 w-8 animate-pulse rounded-full bg-primary/35" />
            <span className="h-2 w-8 animate-pulse rounded-full bg-primary/20" />
            <span className="h-2 w-5 animate-pulse rounded-full bg-primary/20" />
          </div>
          <div className="hidden gap-3 sm:flex">
            <span className="h-4 w-12 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            <span className="h-4 w-24 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            <span className="h-4 w-20 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
          </div>
        </div>
      </section>
      {Array.from({ length: 3 }).map((_, index) => (
        <article key={index} className="overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
          <div className="aspect-video animate-pulse bg-[var(--hp-surface-low)]" />
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              <span className="h-4 w-16 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <span className="h-4 w-40 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <span className="h-4 w-20 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
            <div className="space-y-3">
              <div className="h-7 w-11/12 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <div className="h-7 w-2/3 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function LocalNewsRiverStorySkeletons() {
  return (
    <div className="space-y-4" aria-label="Loading more local news stories" aria-busy="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <article key={index} className="overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
          <div className="aspect-video animate-pulse bg-[var(--hp-surface-low)]" />
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              <span className="h-4 w-16 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <span className="h-4 w-40 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <span className="h-4 w-20 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
            <div className="space-y-3">
              <div className="h-7 w-11/12 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <div className="h-7 w-2/3 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function LocalNewsFeaturedCarousel({
  items,
  onOpenStory,
}: {
  items: Array<HearstTVContent & { hasConfiguredFeed?: boolean }>;
  onOpenStory: (story: LifestyleRiverStory) => void;
}) {
  const stories = useMemo(() => items.map((item) => mapLocalNewsContentToReaderStory(item)), [items]);
  const imageByStoryId = useMemo(
    () => new Map(items.map((item) => [item.id, item.imageUrl])),
    [items],
  );

  return (
    <FeaturedStoryCarousel
      stories={stories}
      editionLabel="Latest Local News"
      renderImage={(story, _index, active) => {
        const imageUrl = imageByStoryId.get(story.id);

        if (!imageUrl) {
          return <LocalNewsImagePlaceholder />;
        }

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading={active ? "eager" : "lazy"}
          />
        );
      }}
      getCommentCount={() => 0}
      isCurrentStory={() => true}
      onOpenStory={onOpenStory}
      onSave={() => undefined}
      onMoreLikeThis={() => undefined}
      onFollowBrand={() => undefined}
      indicatorPalette={["#087A68", "#3EA391", "#91CFC2"]}
    />
  );
}

function LocalNewsImagePlaceholder() {
  return (
    <div className="h-full w-full bg-[var(--hp-surface-low)]">
      <div className="h-full w-full animate-pulse bg-[linear-gradient(135deg,var(--hp-surface-low)_0%,rgba(255,255,255,0.82)_48%,var(--hp-surface-low)_100%)]" />
    </div>
  );
}

export function HearstTVLocalNewsReaderExperience() {
  const [readerStories, setReaderStories] = useState<LifestyleRiverStory[]>([]);
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const returnFocusElementRef = useRef<HTMLElement | null>(null);

  const openStory = (storyId: string) => {
    returnFocusElementRef.current = rememberContentReaderReturnFocus(document.activeElement);
    setOpenStoryId(storyId);
  };

  return (
    <>
      <HearstTVLocalNewsRiver
        onOpenStory={openStory}
        onStoriesChange={setReaderStories}
      />
      {openStoryId ? (
        <LocalNewsReaderModal
          key={openStoryId}
          stories={readerStories}
          openStoryId={openStoryId}
          returnFocusElementRef={returnFocusElementRef}
          onClose={() => setOpenStoryId(null)}
        />
      ) : null}
    </>
  );
}

function LocalNewsReaderModal({
  stories,
  openStoryId,
  returnFocusElementRef,
  onClose,
}: {
  stories: LifestyleRiverStory[];
  openStoryId: string;
  returnFocusElementRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const openIndex = Math.max(0, stories.findIndex((story) => story.id === openStoryId));
  const queue = stories.length > 0
    ? [...stories.slice(openIndex), ...stories.slice(0, openIndex)]
    : [];
  const visibleStories = queue.slice(0, visibleCount);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [openStoryId]);

  useEffect(() => {
    const root = contentRef.current;
    const node = sentinelRef.current;
    if (!root || !node || visibleCount >= queue.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) => Math.min(count + 1, queue.length));
        }
      },
      { root, rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [queue.length, visibleCount]);

  return (
    <ContentReaderDialogShell
      contentRef={contentRef}
      destination="local-news"
      mode="light"
      onClose={onClose}
      returnFocusElementRef={returnFocusElementRef}
      style={{
        "--primary": "#087A68",
        "--hp-primary": "#087A68",
        "--hp-section-title": "#087A68",
        "--hp-sidebar-heading": "#087A68",
      } as CSSProperties}
    >
      <ContentReaderMasthead
        logoHref="/hearst-plus/local-news/"
        contextLabel="Hearst Local News"
        logoSlug="hearst-local-news"
        visibleStoryCount={visibleStories.length}
        storyCount={queue.length}
        activeMastheadKey="local-news"
        mastheadItems={[{ key: "local-news", label: "Local News", active: true, disabled: true }]}
        mastheadNavigationLabel="Local News"
        filterItems={[{ label: "TV Stations", active: true, disabled: true }]}
        sectionLabel="Local News"
        onSelectMastheadItem={() => undefined}
        onSelectFilter={() => undefined}
        onClose={onClose}
      />
      <div className="grid gap-8 px-4 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-3xl space-y-10">
          {visibleStories.map((story, index) => (
            <article
              key={story.id}
              data-reader-story-id={story.id}
              className="rounded-[8px] border border-border bg-card px-5 py-5 text-foreground sm:px-7 sm:py-7"
            >
              {index > 0 ? (
                <div className="mb-8 flex items-center gap-4" aria-label="Up next">
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                    Up next
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </div>
              ) : null}
              <div className="aspect-video w-full overflow-hidden rounded-[4px] bg-[var(--hp-surface-low)]">
                {story.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={story.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <LocalNewsImagePlaceholder />
                )}
              </div>
              <div className="mx-auto mt-6 max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                  <span>{story.signal}</span>
                  <span>{story.brand}</span>
                  <span>{story.topic}</span>
                </div>
                <h2 className="headline text-4xl leading-[1.05] sm:text-5xl">
                  {story.title}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-border py-3 text-sm text-muted-foreground">
                  <span>{story.byline}</span>
                  {story.publishedAt ? <span>{formatDate(story.publishedAt)}</span> : null}
                  {story.sourceUrl ? (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-primary underline underline-offset-4"
                    >
                      Original station story
                    </a>
                  ) : null}
                </div>
                <div className="mt-6 space-y-4 text-[18px] leading-8 text-foreground/85">
                  <p>{story.summary}</p>
                  <p>
                    This local-news item is normalized from the configured Hearst TV RSS feed and keeps the original station attribution, timestamp, image, and source link.
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div ref={sentinelRef} className="flex justify-center py-8">
            {visibleCount < queue.length ? (
              <p className="text-sm text-muted-foreground">Loading the next local story...</p>
            ) : (
              <p className="text-sm text-muted-foreground">End of this local-news river.</p>
            )}
          </div>
        </div>
      </div>
    </ContentReaderDialogShell>
  );
}

function mapLocalNewsContentToReaderStory(
  item: HearstTVContent & { hasConfiguredFeed?: boolean },
): LifestyleRiverStory {
  const station = getHearstTVStationById(item.stationId);
  const publishedAt = Date.parse(item.publishedAt);
  const age = Number.isNaN(publishedAt)
    ? 0
    : Math.max(0, Math.round((Date.now() - publishedAt) / 36e5));

  return {
    id: item.id,
    brand: station?.stationName ?? "Hearst TV",
    brandSlug: "hearst-local-news",
    topic: "Local News",
    title: item.title,
    summary: item.description || `${station?.stationName ?? "Hearst TV"} local news update.`,
    image: item.imageUrl || "",
    byline: station ? `${station.callSign} local news` : "Hearst TV local news",
    readTime: item.contentType === "video" ? "Watch" : "2 min read",
    popularity: item.hasConfiguredFeed ? 92 : 58,
    signal: item.isMock ? "Editor Pick" : "Trending",
    tags: [
      "Local News",
      station?.market,
      station?.state,
      item.contentType === "video" ? "Video" : "News",
    ].filter((tag): tag is string => Boolean(tag)),
    age,
    publishedAt: item.publishedAt,
    sourceUrl: item.url === "#" ? undefined : item.url,
    mediaKind: item.contentType === "video" ? "video" : undefined,
  };
}

function ReaderView({
  feeds,
  filteredContent,
  filterMessage,
  selectedStation,
  selectedStationRecord,
  onStationChange,
}: {
  feeds: StoredFeed[];
  filteredContent: Array<(typeof hearstTVSampleContent)[number] & { hasConfiguredFeed: boolean }>;
  filterMessage: string;
  selectedStation: string;
  selectedStationRecord: ReturnType<typeof getHearstTVStationById> | null;
  onStationChange: (value: string) => void;
}) {
  return (
    <main>
      <section className="mx-auto grid max-w-[1360px] gap-8 px-5 py-8 md:px-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <aside className="bg-[var(--hp-surface)] p-4 lg:sticky lg:top-20" aria-labelledby="local-news-controls">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="local-news-controls" className="text-lg font-bold text-[var(--hp-text-headline)]">
                Local feed controls
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--hp-text-secondary)]">{filterMessage}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            <FilterSelect
              id="station-filter"
              label="Station"
              value={selectedStation}
              onChange={(value) => onStationChange(value)}
              options={[
                { label: "All stations", value: allValue },
                ...hearstTVStations.map((station) => ({
                  label: `${station.callSign} · ${station.market}`,
                  value: station.id,
                })),
              ]}
            />
          </div>
          <Link
            href="/hearst-plus/local-news/admin/"
            className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-[var(--hp-primary)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
          >
            Manage feeds
          </Link>
        </aside>

        <div>
          <div className="mb-5 flex flex-col justify-between gap-3 border-t border-[var(--hp-border)] pt-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-[var(--hp-primary)]">
                {selectedStationRecord ? `${selectedStationRecord.callSign} · ${selectedStationRecord.market}` : "All Hearst TV markets"}
              </p>
              <h2 id="latest-local-news" className="mt-1 text-2xl font-bold text-[var(--hp-text-headline)]">
                Local News river
              </h2>
              <p className="mt-2 text-sm text-[var(--hp-text-secondary)]">
                Sorted newest first. The river updates from the selected station.
              </p>
            </div>
            <span className="bg-[var(--hp-control)] px-3 py-2 text-xs font-bold text-[var(--hp-primary)]">
              {filteredContent.length} river items
            </span>
          </div>

          <div aria-labelledby="latest-local-news" className="grid gap-4">
            {filteredContent.map((item) => {
              const station = getHearstTVStationById(item.stationId);
              const feed = feeds.find((candidate) => candidate.id === item.feedId) ?? getHearstTVFeedById(item.feedId);
              if (!station || !feed) return null;

              return (
                <article key={item.id} className="grid min-w-0 gap-0 bg-[var(--hp-surface)] md:grid-cols-[12rem_minmax(0,1fr)]">
                  <div className="grid aspect-[16/9] place-items-center bg-[var(--hp-control)] text-center text-sm font-bold text-[var(--hp-primary)] md:aspect-auto">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span>{station.callSign}</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--hp-text-secondary)]">
                      <span>{station.stationName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{station.market}, {station.state}</span>
                      <span className="bg-[var(--hp-control)] px-2 py-1 text-[var(--hp-primary)]">{formatContentType(item.contentType)}</span>
                    </div>
                    <h3 className="mt-3 text-balance text-2xl font-bold leading-tight text-[var(--hp-text-headline)]">
                      <a
                        href={item.url}
                        target={item.url === "#" ? undefined : "_blank"}
                        rel={item.url === "#" ? undefined : "noreferrer"}
                        className="hover:text-[var(--hp-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--hp-text-secondary)]">{item.description}</p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--hp-border)] pt-4 text-xs text-[var(--hp-text-secondary)]">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span>{item.isMock ? "Mock sample" : feed.feedName}</span>
                      <span>{item.hasConfiguredFeed ? "Feed configured" : "Feed URL TBD"}</span>
                    </div>
                  </div>
                </article>
              );
            })}
            {filteredContent.length === 0 ? (
              <div className="bg-[var(--hp-surface)] p-6 text-sm leading-6 text-[var(--hp-text-secondary)]">
                No local items match the current station. Clear the station filter to restore the river.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminView({ feeds, setFeeds }: { feeds: StoredFeed[]; setFeeds: (feeds: StoredFeed[]) => void }) {
  const [stationId, setStationId] = useState(hearstTVStations[0]?.id ?? "");
  const [feedName, setFeedName] = useState("");
  const [feedUrl, setFeedUrl] = useState("");
  const [feedType, setFeedType] = useState<FeedType>("RSS");

  function updateFeed(feedId: string, patch: Partial<StoredFeed>) {
    setFeeds(feeds.map((feed) => (feed.id === feedId ? { ...feed, ...patch } : feed)));
  }

  function removeFeed(feedId: string) {
    setFeeds(feeds.filter((feed) => feed.id !== feedId));
  }

  function addFeed() {
    if (!stationId || !feedName.trim()) return;
    const normalizedUrl = feedUrl.trim() || "Feed URL TBD";
    setFeeds([
      ...feeds,
      {
        id: `${stationId}-${Date.now()}`,
        stationId,
        feedName: feedName.trim(),
        feedUrl: normalizedUrl,
        feedType: normalizedUrl === "Feed URL TBD" ? "TBD" : feedType,
        enabled: normalizedUrl !== "Feed URL TBD",
        status: normalizedUrl === "Feed URL TBD" ? "pending" : "connected",
        lastSuccessfulFetch: normalizedUrl === "Feed URL TBD" ? null : new Date().toISOString(),
        lastRefreshTimestamp: new Date().toISOString(),
        lastError: normalizedUrl === "Feed URL TBD" ? "Feed URL TBD. Add a verified endpoint to activate." : null,
      },
    ]);
    setFeedName("");
    setFeedUrl("");
    setFeedType("RSS");
  }

  async function refreshFeed(feedId: string) {
    const feed = feeds.find((candidate) => candidate.id === feedId);
    if (!feed) return;
    if (feed.feedUrl === feedUrlTbd || !feed.enabled) {
      updateFeed(feedId, {
        status: "pending",
        lastRefreshTimestamp: new Date().toISOString(),
        lastError: "Feed URL TBD. Manual refresh waits for a verified RSS or MRSS endpoint.",
      });
      return;
    }
    const refreshStartedAt = new Date().toISOString();
    updateFeed(feedId, {
      status: "pending",
      lastRefreshTimestamp: refreshStartedAt,
      lastError: null,
    });

    try {
      const params = new URLSearchParams({
        stationId: feed.stationId,
        feedId: feed.id,
        feedUrl: feed.feedUrl,
        feedType: feed.feedType,
      });
      const response = await fetch(`/api/hearst-tv/local-news?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Feed check returned ${response.status}`);
      const payload = await response.json() as LocalNewsFeedResponse;
      if (payload.status !== "connected") {
        throw new Error(payload.error || "Feed did not return a connected status.");
      }
      updateFeed(feedId, {
        status: "connected",
        lastSuccessfulFetch: payload.feed?.lastSuccessfulFetch ?? new Date().toISOString(),
        lastRefreshTimestamp: new Date().toISOString(),
        lastError: null,
      });
    } catch (error) {
      updateFeed(feedId, {
        status: "error",
        lastRefreshTimestamp: new Date().toISOString(),
        lastError: error instanceof Error ? error.message : "Feed refresh failed.",
      });
    }
  }

  return (
    <main className="mx-auto max-w-[1360px] px-5 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[var(--hp-border)] pb-6 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold text-[var(--hp-text-headline)]">Hearst TV feed admin</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--hp-text-secondary)]">
            Add, edit, enable, disable, and refresh reusable feed records. This prototype stores edits in browser local
            storage and does not fetch live feeds until a verified endpoint is provided.
          </p>
        </div>
        <Link
          href="/hearst-plus/local-news/"
          className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--hp-primary)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
        >
          View Local News
        </Link>
      </div>

      <section aria-labelledby="feed-create-title" className="mb-8 bg-[var(--hp-surface)] p-5">
        <h3 id="feed-create-title" className="text-xl font-bold text-[var(--hp-text-headline)]">Add a station feed</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_10rem_auto] lg:items-end">
          <FilterSelect
            id="admin-station"
            label="Station"
            value={stationId}
            onChange={setStationId}
            options={hearstTVStations.map((station) => ({ label: `${station.callSign} · ${station.market}`, value: station.id }))}
          />
          <TextField id="admin-feed-name" label="Feed name" value={feedName} onChange={setFeedName} placeholder="Morning news RSS" />
          <TextField id="admin-feed-url" label="RSS/MRSS URL" value={feedUrl} onChange={setFeedUrl} placeholder="Feed URL TBD" />
          <FilterSelect
            id="admin-feed-type"
            label="Feed type"
            value={feedType}
            onChange={(value) => setFeedType(value as FeedType)}
            options={[
              { label: "RSS", value: "RSS" },
              { label: "MRSS", value: "MRSS" },
              { label: "TBD", value: "TBD" },
            ]}
          />
          <button
            type="button"
            onClick={addFeed}
            className="inline-flex min-h-11 items-center justify-center bg-[var(--hp-action)] px-4 text-sm font-bold text-[var(--hp-action-text)] hover:bg-[var(--hp-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
          >
            Add feed
          </button>
        </div>
      </section>

      <section aria-labelledby="feed-status-title">
        <h3 id="feed-status-title" className="mb-4 text-xl font-bold text-[var(--hp-text-headline)]">Live Feed Status</h3>
        <div className="grid gap-4">
          {feeds.map((feed) => {
            const station = getHearstTVStationById(feed.stationId);
            if (!station) return null;

            return (
              <article key={feed.id} className="bg-[var(--hp-surface)] p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-[var(--hp-text-headline)]">{feed.feedName}</h4>
                      <StatusBadge status={feed.status} />
                    </div>
                    <p className="mt-1 text-sm text-[var(--hp-text-secondary)]">
                      {station.stationName} · {station.callSign} · {station.market}, {station.state} · {station.network}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-[var(--hp-text-secondary)]">
                      Last successful fetch: {feed.lastSuccessfulFetch ? formatDate(feed.lastSuccessfulFetch) : "Never"}
                      <br />
                      Last refresh: {feed.lastRefreshTimestamp ? formatDate(feed.lastRefreshTimestamp) : "Never"}
                    </p>
                    {feed.lastError ? (
                      <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">Error: {feed.lastError}</p>
                    ) : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_9rem_8rem]">
                    <TextField
                      id={`${feed.id}-url`}
                      label="Feed URL"
                      value={feed.feedUrl}
                      onChange={(value) => updateFeed(feed.id, { feedUrl: value || "Feed URL TBD" })}
                    />
                    <FilterSelect
                      id={`${feed.id}-type`}
                      label="Type"
                      value={feed.feedType}
                      onChange={(value) => updateFeed(feed.id, { feedType: value as FeedType })}
                      options={[
                        { label: "RSS", value: "RSS" },
                        { label: "MRSS", value: "MRSS" },
                        { label: "TBD", value: "TBD" },
                      ]}
                    />
                    <FilterSelect
                      id={`${feed.id}-enabled`}
                      label="Status"
                      value={feed.enabled ? "enabled" : "disabled"}
                      onChange={(value) => updateFeed(feed.id, { enabled: value === "enabled" })}
                      options={[
                        { label: "Enabled", value: "enabled" },
                        { label: "Disabled", value: "disabled" },
                      ]}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        void refreshFeed(feed.id);
                      }}
                      className="inline-flex min-h-11 items-center bg-[var(--hp-action)] px-3 text-sm font-bold text-[var(--hp-action-text)] hover:bg-[var(--hp-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
                    >
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFeed(feed.id)}
                      className="inline-flex min-h-11 items-center border border-[var(--hp-border-strong)] px-3 text-sm font-bold text-[var(--hp-primary)] hover:bg-[var(--hp-control-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function FilterSelect({
  id,
  label,
  onChange,
  options,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <div className="block text-sm font-semibold text-[var(--hp-text-headline)]">
      <label htmlFor={id}>{label}</label>
      <Select value={value} onValueChange={(nextValue) => {
        if (nextValue) onChange(nextValue);
      }}>
        <SelectTrigger
          id={id}
          className="mt-2 h-11 min-h-11 w-full rounded-lg border-input bg-background px-3 text-left text-sm font-semibold text-foreground shadow-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          className="max-h-[min(420px,var(--available-height))] rounded-lg border border-border bg-popover p-1 shadow-xl ring-1 ring-foreground/10"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="min-h-10 px-3 pr-9 text-sm font-semibold text-popover-foreground focus:bg-[var(--hp-control-hover)] focus:text-foreground"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TextField({
  id,
  label,
  onChange,
  placeholder,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-[var(--hp-text-headline)]">
      {label}
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full border border-[var(--hp-border)] bg-[var(--hp-surface)] px-3 text-sm text-[var(--hp-text-primary)] placeholder:text-[var(--hp-text-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
      />
    </label>
  );
}

function StatusStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--hp-surface)] p-4">
      <dt className="text-xs font-semibold text-[var(--hp-primary)]">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-[var(--hp-text-headline)]">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: FeedStatus }) {
  const label = status === "connected" ? "Connected" : status === "error" ? "Error" : "Pending";
  return (
    <span className="bg-[var(--hp-control)] px-2 py-1 text-xs font-bold text-[var(--hp-primary)]">
      {label}
    </span>
  );
}

function StationLogo({
  logoUrl,
  small = false,
  stationName,
}: {
  logoUrl?: string | null;
  small?: boolean;
  stationName: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = stationName
    .split(/\s+|-/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-border bg-background font-black leading-none text-primary ${small ? "h-4 w-9 text-[7px]" : "h-12 w-28 text-[10px]"}`}
    >
      <span>{initials}</span>
      {!failed && logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full bg-white object-contain p-0.5"
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}

function formatStationOptionLabel(station: HearstTVStation, configured: boolean) {
  return `${configured ? "🟢 " : ""}${station.callSign} · ${station.market}`;
}

function formatContentType(type: HearstTVContentType) {
  if (type === "news") return "News";
  if (type === "video") return "Video";
  return "Other";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function mergeStoredFeeds(stored: StoredFeed[]) {
  const storedById = new Map(stored.map((feed) => [feed.id, feed]));
  const merged = hearstTVFeeds.map((feed) => {
    const storedFeed = storedById.get(feed.id);
    if (!storedFeed) return feed;
    if (feed.feedUrl !== feedUrlTbd && storedFeed.feedUrl === feedUrlTbd) return feed;
    return storedFeed;
  });
  const custom = stored.filter((feed) => !hearstTVFeeds.some((seed) => seed.id === feed.id));
  return [...merged, ...custom];
}
