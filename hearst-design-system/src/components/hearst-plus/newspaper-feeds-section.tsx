"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getHearstNewspaperFeedById,
  getHearstNewspaperPublicationById,
  hearstNewspaperFeeds,
  hearstNewspaperPublications,
  hearstNewspaperSampleContent,
  newspaperFeedUrlTbd,
  type HearstNewspaperContentType,
  type HearstNewspaperContent,
  type HearstNewspaperPublication,
} from "@/lib/hearst-newspaper-feed-framework";

const allValue = "all";
const defaultNewspaperPublication = "sfgate";

type NewspaperFeedResponse = {
  stories: HearstNewspaperContent[];
  status: "connected" | "pending" | "error";
  error?: string;
};

function isConnectedFeed(feed: (typeof hearstNewspaperFeeds)[number]) {
  return feed.enabled && feed.status === "connected" && feed.feedUrl !== newspaperFeedUrlTbd;
}

function formatPublicationOption(publication: HearstNewspaperPublication, connectedPublicationIds: Set<string>) {
  return `${connectedPublicationIds.has(publication.id) ? "🟢 " : ""}${publication.publicationName} · ${publication.market}`;
}

function formatContentType(type: HearstNewspaperContentType) {
  if (type === "news") return "News";
  if (type === "opinion") return "Opinion";
  return "Other";
}

function publicationInitials(name: string) {
  return name
    .split(/\s+|-/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function NewspaperFeedsSection() {
  const connectedFeeds = hearstNewspaperFeeds.filter(isConnectedFeed);
  const connectedPublicationIds = useMemo(
    () => new Set(connectedFeeds.map((feed) => feed.publicationId)),
    [connectedFeeds],
  );
  const states = useMemo(() => [...new Set(hearstNewspaperPublications.map((publication) => publication.state))].sort(), []);
  const [selectedPublication, setSelectedPublication] = useState(defaultNewspaperPublication);
  const [selectedState, setSelectedState] = useState(allValue);
  const [selectedContentType, setSelectedContentType] = useState<"all" | HearstNewspaperContentType>("all");
  const [liveContent, setLiveContent] = useState<HearstNewspaperContent[]>([]);
  const [liveStatus, setLiveStatus] = useState<"connected" | "pending" | "error">("pending");
  const [liveError, setLiveError] = useState<string | null>(null);

  const defaultPublicationRecord = getHearstNewspaperPublicationById(defaultNewspaperPublication);
  const selectedPublicationRecord = selectedPublication === allValue
    ? null
    : getHearstNewspaperPublicationById(selectedPublication);
  const activePublicationRecord = selectedPublicationRecord ?? defaultPublicationRecord;
  const selectedPublicationFeed = selectedPublicationRecord
    ? hearstNewspaperFeeds.find((feed) => feed.publicationId === selectedPublicationRecord.id)
    : null;
  const activePublicationFeed = activePublicationRecord
    ? hearstNewspaperFeeds.find((feed) => feed.publicationId === activePublicationRecord.id)
    : null;
  const activeFeed = activePublicationFeed && isConnectedFeed(activePublicationFeed) ? activePublicationFeed : null;
  const heroFeed = selectedPublicationFeed ?? activeFeed;
  const heroFeedLabel = heroFeed && heroFeed.feedUrl !== newspaperFeedUrlTbd
    ? `RSS · ${heroFeed.feedUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
    : "Feed URL TBD";

  useEffect(() => {
    let cancelled = false;

    async function loadNewspaperFeed() {
      if (!activeFeed || !activePublicationRecord) {
        setLiveContent([]);
        setLiveStatus("pending");
        setLiveError(null);
        return;
      }

      setLiveStatus("pending");
      setLiveError(null);

      try {
        const params = new URLSearchParams({
          publicationId: activeFeed.publicationId,
          feedId: activeFeed.id,
          feedUrl: activeFeed.feedUrl,
        });
        const response = await fetch(`/api/hearst-newspapers/local-news?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Newspaper feed returned ${response.status}`);
        const payload = await response.json() as NewspaperFeedResponse;
        if (cancelled) return;
        setLiveContent(payload.stories ?? []);
        setLiveStatus(payload.status);
        setLiveError(payload.error ?? null);
      } catch (error) {
        if (cancelled) return;
        setLiveContent([]);
        setLiveStatus("error");
        setLiveError(error instanceof Error ? error.message : "Newspaper feed failed.");
      }
    }

    void loadNewspaperFeed();

    return () => {
      cancelled = true;
    };
  }, [activeFeed, activePublicationRecord]);

  const filteredContent = useMemo(() => {
    const livePublicationIds = new Set(liveContent.map((item) => item.publicationId));
    const sampleContent = hearstNewspaperSampleContent.filter((item) => !livePublicationIds.has(item.publicationId));
    const contentPool = selectedPublication === allValue
      ? [...liveContent, ...sampleContent]
      : liveContent.some((item) => item.publicationId === selectedPublication)
        ? liveContent
        : hearstNewspaperSampleContent.filter((item) => item.publicationId === selectedPublication);

    return contentPool
      .filter((item) => {
        const publication = getHearstNewspaperPublicationById(item.publicationId);
        if (!publication) return false;
        if (selectedPublication !== allValue && item.publicationId !== selectedPublication) return false;
        if (selectedState !== allValue && publication.state !== selectedState) return false;
        if (selectedContentType !== "all" && item.contentType !== selectedContentType) return false;
        return true;
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  }, [liveContent, selectedContentType, selectedPublication, selectedState]);

  return (
    <div className="space-y-6" data-hearst-plus-newspaper-river aria-labelledby="newspaper-feeds-title">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="newspaper-filter-title">
            <h2 id="newspaper-filter-title" className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">Newspapers</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Select a Hearst newspaper feed. Green dots mark publications with a verified RSS endpoint.
            </p>
            <div className="mt-4 grid gap-4">
              <FilterSelect
                id="inline-newspaper-publication-filter"
                label="Newspaper"
                value={selectedPublication}
                onChange={setSelectedPublication}
                options={[
                  { label: "All newspapers", value: allValue },
                  ...hearstNewspaperPublications.map((publication) => ({
                    label: formatPublicationOption(publication, connectedPublicationIds),
                    value: publication.id,
                  })),
                ]}
              />
              <FilterSelect
                id="inline-newspaper-state-filter"
                label="State"
                value={selectedState}
                onChange={setSelectedState}
                options={[
                  { label: "All states", value: allValue },
                  ...states.map((state) => ({ label: state, value: state })),
                ]}
              />
              <FilterSelect
                id="inline-newspaper-content-type-filter"
                label="Content type"
                value={selectedContentType}
                onChange={(value) => setSelectedContentType(value as "all" | HearstNewspaperContentType)}
                options={[
                  { label: "News, opinion, and other", value: "all" },
                  { label: "News", value: "news" },
                  { label: "Opinion", value: "opinion" },
                  { label: "Other", value: "other" },
                ]}
              />
            </div>
          </section>
        </aside>

        <main id="hearst-story-river" className="min-w-0 scroll-mt-28 space-y-4" aria-label="Hearst Newspapers RSS feeds">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-5 shadow-[var(--hp-shadow-card)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]">
              {selectedPublicationRecord ? `${selectedPublicationRecord.publicationName} · ${selectedPublicationRecord.market}` : "Hearst Newspapers"}
            </p>
            <h1 id="newspaper-feeds-title" className="headline mt-1 text-3xl leading-tight text-[var(--hp-text-headline)] sm:text-4xl">
              {selectedPublicationRecord ? `${selectedPublicationRecord.publicationName} Local News` : "Newspapers"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {heroFeed && heroFeed.feedUrl !== newspaperFeedUrlTbd
                ? `${selectedPublicationRecord ? selectedPublicationRecord.publicationName : activePublicationRecord?.publicationName ?? "The default publication"} is hydrated from a verified RSS endpoint and normalized into the same Hearst+ river model with publication attribution, timestamps, imagery, and click-throughs.`
                : "Unknown endpoints remain labeled as Feed URL TBD rather than treated as live content."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
              <span className="rounded-full bg-[var(--hp-surface-low)] px-3 py-1">{filteredContent.length} river items</span>
              <span className="rounded-full bg-[var(--hp-surface-low)] px-3 py-1">{heroFeedLabel}</span>
              {heroFeed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hp-surface-low)] px-3 py-1">
                  {liveStatus === "connected" && heroFeed.id === activeFeed?.id ? <span className="size-2 rounded-full bg-[#00874D]" aria-hidden="true" /> : null}
                  {liveStatus === "connected" ? "Connected" : liveStatus === "error" ? "Feed error" : "Connecting"}
                </span>
              ) : null}
            </div>
            {liveError ? <p className="mt-3 text-xs leading-5 text-muted-foreground">{liveError}</p> : null}
          </section>

          {filteredContent.slice(0, 12).map((item) => {
            const publication = getHearstNewspaperPublicationById(item.publicationId);
            const feed = getHearstNewspaperFeedById(item.feedId);
            if (!publication || !feed) return null;
            const connected = isConnectedFeed(feed);

            return (
              <article key={item.id} className="group/card relative min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50">
                <a href={item.url} target="_blank" rel="noreferrer" className="grid min-w-0 gap-0 text-left no-underline sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4 sm:p-4">
                  <span className="relative grid aspect-[16/9] min-h-0 place-items-center overflow-hidden rounded-[6px] bg-[var(--hp-surface-low)] text-center text-sm font-bold text-primary sm:aspect-[4/3]" aria-hidden="true">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      publicationInitials(publication.publicationName)
                    )}
                  </span>
                  <span className="block min-w-0 p-4 sm:p-0">
                    <span className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">{connected ? "Latest" : "Sample"}</span>
                      <span className="text-[length:var(--text-token-4xs)] text-muted-foreground">{publication.publicationName} · {publication.market}</span>
                      <span className="rounded-full bg-[var(--hp-surface-low)] px-2 py-1 text-primary">{formatContentType(item.contentType)}</span>
                    </span>
                    <span className="headline block break-words text-xl leading-tight text-foreground transition-colors group-hover/card:text-primary sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="mt-3 line-clamp-3 block text-sm leading-6 text-muted-foreground">{item.description}</span>
                    <span className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span>{item.isMock ? "Mock sample" : feed.feedName}</span>
                      <span>{connected ? "RSS connected" : "Feed URL TBD"}</span>
                    </span>
                  </span>
                </a>
              </article>
            );
          })}
          {filteredContent.length === 0 ? (
            <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--hp-shadow-card)]">
              No newspaper items match the current filters. Clear the newspaper, state, or content-type filter to restore the river.
            </section>
          ) : null}
        </main>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">Feed status</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="font-bold">{hearstNewspaperPublications.length}</span> Hearst newspapers</p>
              <p><span className="font-bold">{connectedFeeds.length}</span> connected feeds</p>
              <p><span className="font-bold">{hearstNewspaperFeeds.length - connectedFeeds.length}</span> pending</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Publications with a green dot have a verified RSS endpoint. Other records remain pending until a real endpoint is confirmed.
            </p>
          </section>
        </aside>
      </div>
    </div>
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
