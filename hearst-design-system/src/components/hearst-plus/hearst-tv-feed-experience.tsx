"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { FeedStatus, FeedType, HearstTVContentType, HearstTVFeed } from "@/lib/hearst-tv-feed-framework";
import {
  dedupeHearstTVContent,
  feedUrlTbd,
  findNearestHearstTVStation,
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
const defaultLocalNewsStation = "kcra";

function isConfiguredFeed(feed: StoredFeed) {
  return feed.enabled && feed.feedUrl !== feedUrlTbd;
}

function isConnectedFeed(feed: StoredFeed) {
  return isConfiguredFeed(feed)
    && feed.status === "connected"
    && (feed.id === "kcra-primary-feed" || Boolean(feed.lastSuccessfulFetch));
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
  const [selectedState, setSelectedState] = useState(allValue);
  const [selectedContentType, setSelectedContentType] = useState<"all" | HearstTVContentType>("all");
  const [geoMessage, setGeoMessage] = useState("Use location to prioritize the nearest Hearst TV market.");

  useEffect(() => {
    try {
      window.localStorage.setItem(feedStorageKey, JSON.stringify(feeds));
    } catch {
      // Local storage is optional for this prototype admin surface.
    }
  }, [feeds]);

  const states = useMemo(() => [...new Set(hearstTVStations.map((station) => station.state))].sort(), []);
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
        if (selectedState !== allValue && station.state !== selectedState) return false;
        if (selectedContentType !== "all" && item.contentType !== selectedContentType) return false;
        return true;
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .map((item) => ({
        ...item,
        hasConfiguredFeed: stationIdsWithConfiguredFeeds.has(item.stationId),
      }));
  }, [feeds, selectedContentType, selectedState, selectedStation]);
  const selectedStationRecord = selectedStation === allValue ? null : getHearstTVStationById(selectedStation);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoMessage("Geolocation is not available in this browser. Use the market or state filters.");
      return;
    }

    setGeoMessage("Checking your nearest Hearst TV market...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const match = findNearestHearstTVStation(position.coords.latitude, position.coords.longitude);
        if (!match) {
          setGeoMessage("No nearby Hearst TV market could be resolved. Use filters to choose a market.");
          return;
        }

        setSelectedStation(match.station.id);
        setSelectedState(allValue);
        setGeoMessage(`Showing the nearest prototype market: ${match.station.market} (${match.station.callSign}).`);
      },
      () => {
        setGeoMessage("Location access was not available. Use filters to choose a market.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
  }

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
          geoMessage={geoMessage}
          selectedContentType={selectedContentType}
          selectedState={selectedState}
          selectedStation={selectedStation}
          selectedStationRecord={selectedStationRecord}
          states={states}
          onContentTypeChange={setSelectedContentType}
          onLocationRequest={useCurrentLocation}
          onStateChange={setSelectedState}
          onStationChange={setSelectedStation}
        />
      ) : (
        <AdminView feeds={feeds} setFeeds={setFeeds} />
      )}
    </div>
  );
}

export function HearstTVLocalNewsRiver() {
  const [feeds] = useState<StoredFeed[]>(() => {
    if (typeof window === "undefined") return hearstTVFeeds;
    try {
      const stored = window.localStorage.getItem(feedStorageKey);
      return stored ? mergeStoredFeeds(JSON.parse(stored) as StoredFeed[]) : hearstTVFeeds;
    } catch {
      return hearstTVFeeds;
    }
  });
  const [selectedStation, setSelectedStation] = useState(defaultLocalNewsStation);
  const [selectedState, setSelectedState] = useState(allValue);
  const [selectedContentType, setSelectedContentType] = useState<"all" | HearstTVContentType>("all");
  const [geoMessage, setGeoMessage] = useState("KCRA 3 is the active local-news feed for this Hearst+ river. Use location to switch markets.");
  const [liveContent, setLiveContent] = useState<HearstTVContent[]>([]);
  const [liveFeedStatus, setLiveFeedStatus] = useState<FeedStatus>("pending");
  const [liveFeedError, setLiveFeedError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const states = useMemo(() => [...new Set(hearstTVStations.map((station) => station.state))].sort(), []);
  const selectedStationRecord = selectedStation === allValue ? null : getHearstTVStationById(selectedStation);
  const configuredStationIds = useMemo(
    () => new Set(feeds.filter(isConfiguredFeed).map((feed) => feed.stationId)),
    [feeds],
  );
  const activeFeed = useMemo(() => {
    const selectedFeed = selectedStation !== allValue
      ? feeds.find((feed) => feed.stationId === selectedStation && isConfiguredFeed(feed))
      : null;
    if (selectedStation !== allValue) return selectedFeed ?? null;
    return feeds.find((feed) => feed.stationId === defaultLocalNewsStation && isConfiguredFeed(feed)) ?? null;
  }, [feeds, selectedStation]);
  const activeFeedStation = activeFeed ? getHearstTVStationById(activeFeed.stationId) : null;
  const selectedStationFeed = selectedStationRecord
    ? feeds.find((feed) => feed.stationId === selectedStationRecord.id)
    : null;
  const heroFeed = selectedStationFeed ?? activeFeed;
  const heroStation = selectedStationRecord ?? activeFeedStation;
  const heroStationTitle = heroStation ? `${heroStation.stationName} Local News` : "Hearst TV Local News";
  const heroFeedLabel = heroFeed && heroFeed.feedUrl !== feedUrlTbd
    ? `${heroFeed.feedType} · ${formatFeedUrl(heroFeed.feedUrl)}`
    : "Feed URL TBD";
  const heroFeedStatus = heroFeed?.id === activeFeed?.id
    ? liveFeedStatus
    : heroFeed && isConnectedFeed(heroFeed)
      ? "connected"
      : heroFeed?.status ?? liveFeedStatus;

  useEffect(() => {
    let cancelled = false;

    async function loadLocalNews() {
      if (!activeFeed || !activeFeedStation) {
        setLiveContent([]);
        setLiveFeedStatus("pending");
        setLiveFeedError("Feed URL TBD. Add a verified RSS or MRSS endpoint to activate this station.");
        setUsingFallback(false);
        return;
      }

      setLiveFeedStatus("pending");
      setLiveFeedError(null);

      try {
        const params = new URLSearchParams({
          stationId: activeFeed.stationId,
          feedId: activeFeed.id,
          feedUrl: activeFeed.feedUrl,
          feedType: activeFeed.feedType,
        });
        const response = await fetch(`/api/hearst-tv/local-news?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Local news feed returned ${response.status}`);
        const payload = await response.json() as LocalNewsFeedResponse;

        if (cancelled) return;
        setLiveContent(payload.stories ?? []);
        setLiveFeedStatus(payload.status);
        setLiveFeedError(payload.error ?? null);
        setUsingFallback(Boolean(payload.fallback));
      } catch (error) {
        if (cancelled) return;
        setLiveContent([]);
        setLiveFeedStatus("error");
        setLiveFeedError(error instanceof Error ? error.message : "Local news feed failed.");
        setUsingFallback(true);
      }
    }

    void loadLocalNews();

    return () => {
      cancelled = true;
    };
  }, [activeFeed, activeFeedStation]);

  const filteredContent = useMemo(() => {
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
        if (selectedState !== allValue && station.state !== selectedState) return false;
        if (selectedContentType !== "all" && item.contentType !== selectedContentType) return false;
        return true;
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .map((item) => ({
        ...item,
        hasConfiguredFeed: configuredStationIds.has(item.stationId),
      }));
  }, [configuredStationIds, liveContent, selectedContentType, selectedState, selectedStation]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoMessage("Geolocation is not available in this browser. Use the market or state filters.");
      return;
    }

    setGeoMessage("Checking your nearest Hearst TV market...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const match = findNearestHearstTVStation(position.coords.latitude, position.coords.longitude);
        if (!match) {
          setGeoMessage("No nearby Hearst TV market could be resolved. Use filters to choose a market.");
          return;
        }

        setSelectedStation(match.station.id);
        setSelectedState(allValue);
        setGeoMessage(`Showing the nearest prototype market: ${match.station.market} (${match.station.callSign}).`);
      },
      () => {
        setGeoMessage("Location access was not available. Use filters to choose a market.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
  }

  return (
    <div className="space-y-6" data-hearst-plus-local-news-river>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="local-news-filter-title">
            <h2 id="local-news-filter-title" className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Local News
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{geoMessage}</p>
            <button
              type="button"
              onClick={useCurrentLocation}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[6px] bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Use my location
            </button>
            <div className="mt-4 grid gap-4">
              <FilterSelect
                id="inline-local-station-filter"
                label="Station"
                value={selectedStation}
                onChange={setSelectedStation}
                options={[
                  { label: "All stations", value: allValue },
                  ...hearstTVStations.map((station) => ({
                    label: formatStationOptionLabel(station, configuredStationIds.has(station.id)),
                    value: station.id,
                  })),
                ]}
              />
              <FilterSelect
                id="inline-local-state-filter"
                label="State"
                value={selectedState}
                onChange={setSelectedState}
                options={[
                  { label: "All states", value: allValue },
                  ...states.map((state) => ({ label: state, value: state })),
                ]}
              />
              <FilterSelect
                id="inline-local-content-type-filter"
                label="Content type"
                value={selectedContentType}
                onChange={(value) => setSelectedContentType(value as "all" | HearstTVContentType)}
                options={[
                  { label: "News, video, and other", value: "all" },
                  { label: "News", value: "news" },
                  { label: "Video", value: "video" },
                  { label: "Other", value: "other" },
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
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-5 shadow-[var(--hp-shadow-card)]">
            <div className="flex min-w-0 items-center gap-3">
              <StationLogo stationName={heroStation?.stationName ?? "Hearst TV"} logoUrl={heroStation?.logo} />
              <div className="min-w-0">
                <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
                  {heroStation ? `${heroStation.callSign} · ${heroStation.market}` : "Hearst TV local news"}
                </p>
                <h1 className="headline mt-1 text-3xl leading-tight sm:text-4xl">{heroStationTitle}</h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {heroFeed && heroFeed.feedUrl !== feedUrlTbd
                ? `Top stories from the configured ${heroStation?.callSign ?? "Hearst TV"} RSS feed, normalized into the same Hearst+ river model with station attribution, timestamps, imagery, and click-throughs.`
                : `${heroStation?.stationName ?? "This station"} does not have a verified RSS or MRSS endpoint yet. Prototype sample content keeps the river demonstrable until a real feed is added.`}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
              <span className="rounded-full bg-[var(--hp-surface-low)] px-3 py-1">{filteredContent.length} river items</span>
              <span className="rounded-full bg-[var(--hp-surface-low)] px-3 py-1">{heroFeedLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hp-surface-low)] px-3 py-1">
                {heroFeedStatus === "connected" ? <span className="size-2 rounded-full bg-[#00874D]" aria-hidden="true" /> : null}
                {formatFeedStatus(heroFeedStatus)}
              </span>
              {usingFallback && heroFeed?.id === activeFeed?.id ? <span className="rounded-full bg-[var(--hp-surface-low)] px-3 py-1">Fallback sample</span> : null}
            </div>
            {liveFeedError && heroFeed?.feedUrl !== feedUrlTbd ? <p className="mt-3 text-xs leading-5 text-muted-foreground">{liveFeedError}</p> : null}
          </section>

          {filteredContent.map((item) => {
            const station = getHearstTVStationById(item.stationId);
            const feed = feeds.find((candidate) => candidate.id === item.feedId) ?? getHearstTVFeedById(item.feedId);
            if (!station || !feed) return null;

            return (
              <article key={item.id} className="group/card relative min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50" data-story-module="river" data-story-id={item.id}>
                <a
                  href={item.url}
                  target={item.url === "#" ? undefined : "_blank"}
                  rel={item.url === "#" ? undefined : "noreferrer"}
                  className="grid min-w-0 gap-0 text-left no-underline sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4 sm:p-4"
                >
                  <span className="relative grid aspect-[16/9] min-h-0 place-items-center overflow-hidden rounded-[6px] bg-[var(--hp-surface-low)] text-center text-sm font-bold text-primary sm:aspect-[4/3]" aria-hidden="true">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      station.callSign
                    )}
                  </span>
                  <span className="block min-w-0 p-4 sm:p-0">
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
                    <span className="headline block break-words text-xl leading-tight text-foreground transition-colors group-hover/card:text-primary sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="mt-3 line-clamp-3 block text-sm leading-6 text-muted-foreground">{item.description}</span>
                    <span className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span>{item.isMock ? "Mock sample" : feed.feedName}</span>
                      <span>{item.hasConfiguredFeed ? "RSS connected" : "Feed URL TBD"}</span>
                    </span>
                  </span>
                </a>
              </article>
            );
          })}
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

function ReaderView({
  feeds,
  filteredContent,
  geoMessage,
  selectedContentType,
  selectedState,
  selectedStation,
  selectedStationRecord,
  states,
  onContentTypeChange,
  onLocationRequest,
  onStateChange,
  onStationChange,
}: {
  feeds: StoredFeed[];
  filteredContent: Array<(typeof hearstTVSampleContent)[number] & { hasConfiguredFeed: boolean }>;
  geoMessage: string;
  selectedContentType: "all" | HearstTVContentType;
  selectedState: string;
  selectedStation: string;
  selectedStationRecord: ReturnType<typeof getHearstTVStationById> | null;
  states: string[];
  onContentTypeChange: (value: "all" | HearstTVContentType) => void;
  onLocationRequest: () => void;
  onStateChange: (value: string) => void;
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
              <p className="mt-2 text-sm leading-6 text-[var(--hp-text-secondary)]">{geoMessage}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            <button
              type="button"
              onClick={onLocationRequest}
              className="inline-flex min-h-11 items-center justify-center bg-[var(--hp-action)] px-4 text-sm font-bold text-[var(--hp-action-text)] hover:bg-[var(--hp-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
            >
              Use my location
            </button>
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
            <FilterSelect
              id="state-filter"
              label="State"
              value={selectedState}
              onChange={(value) => onStateChange(value)}
              options={[
                { label: "All states", value: allValue },
                ...states.map((state) => ({ label: state, value: state })),
              ]}
            />
            <FilterSelect
              id="content-type-filter"
              label="Content type"
              value={selectedContentType}
              onChange={(value) => onContentTypeChange(value as "all" | HearstTVContentType)}
              options={[
                { label: "News, video, and other", value: "all" },
                { label: "News", value: "news" },
                { label: "Video", value: "video" },
                { label: "Other", value: "other" },
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
                Sorted newest first. The river updates to the nearest station when geolocation is allowed, or to the selected station, state, and content type.
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
                No local items match the current filters. Clear the station, state, or content-type filter to restore the river.
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
    <label htmlFor={id} className="block text-sm font-semibold text-[var(--hp-text-headline)]">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full border border-[var(--hp-border)] bg-[var(--hp-surface)] px-3 text-sm text-[var(--hp-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
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
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-border bg-background font-black leading-none text-primary ${small ? "size-4 text-[7px]" : "size-10 text-[10px]"}`}
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

function formatFeedStatus(status: FeedStatus) {
  if (status === "connected") return "Connected";
  if (status === "error") return "Feed error";
  return "Pending";
}

function formatStationOptionLabel(station: HearstTVStation, configured: boolean) {
  return `${configured ? "🟢 " : ""}${station.callSign} · ${station.market}`;
}

function formatFeedUrl(value: string) {
  try {
    const url = new URL(value);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname}`;
  } catch {
    return value;
  }
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
    if (feed.id === "kcra-primary-feed" && storedFeed.feedUrl === "Feed URL TBD") return feed;
    return storedFeed;
  });
  const custom = stored.filter((feed) => !hearstTVFeeds.some((seed) => seed.id === feed.id));
  return [...merged, ...custom];
}
