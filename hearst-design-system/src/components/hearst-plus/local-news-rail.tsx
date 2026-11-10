"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "@/components/ui/icons";
import { getHearstTVStationById, type HearstTVContent } from "@/lib/hearst-tv-feed-framework";

type LocalNewsFeedResponse = {
  stories: HearstTVContent[];
};

export function LocalNewsRail({ layout = "rail" }: { layout?: "rail" | "grid" }) {
  const [stories, setStories] = React.useState<HearstTVContent[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    fetch(`/api/hearst-tv/local-news/?limit=${layout === "grid" ? 4 : 3}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<LocalNewsFeedResponse> : null)
      .then((payload) => {
        if (!cancelled) setStories(payload?.stories ?? []);
      })
      .catch(() => {
        if (!cancelled) setStories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [layout]);

  if (stories.length === 0) return null;

  const localMarkets = Array.from(new Set(
    stories
      .map((story) => getHearstTVStationById(story.stationId))
      .filter((station): station is NonNullable<typeof station> => Boolean(station))
      .map((station) => station.market),
  ));
  const localNewsLocation = localMarkets.length > 0
    ? localMarkets.slice(0, 2).join(" · ")
    : "Hearst TV markets";

  return (
    layout === "grid" ? (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Local news stories">
        {stories.slice(0, 4).map((story) => {
          const station = getHearstTVStationById(story.stationId);
          return <a key={story.id} href={`/hearst-plus/local-news/?story=${encodeURIComponent(story.id)}#tv-stations`} className="group overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
            <div className="aspect-video bg-muted bg-cover bg-center" style={story.imageUrl ? { backgroundImage: `url(${story.imageUrl})` } : undefined} role={story.imageUrl ? "img" : undefined} aria-label={story.imageUrl ? story.title : undefined} />
            <div className="p-4"><p className="type-k1 text-primary">{station?.callSign ?? "Hearst TV"} · {station?.market ?? "Local News"}</p><h3 className="headline type-t3 mt-2 line-clamp-3 font-bold underline-offset-4 group-hover:underline group-focus-visible:underline">{story.title}</h3></div>
          </a>;
        })}
      </div>
    ) :
    <section
      className="rounded-card border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
      aria-labelledby="local-news-rail-title"
      data-story-module="local-news"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="local-news-rail-title"
          className="flex items-center gap-1.5 type-k1 text-[var(--hp-section-title)]"
        >
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          Local News
        </h2>
        <span
          className="shrink-0 text-xs text-muted-foreground"
          aria-label={`Local news for ${localNewsLocation}`}
        >
          {localNewsLocation}
        </span>
      </div>
      <ol className="-mb-3 mt-3 divide-y divide-border/70">
        {stories.map((story, index) => {
          const station = getHearstTVStationById(story.stationId);
          return (
            <li key={story.id}>
              <a
                href={`/hearst-plus/local-news/?story=${encodeURIComponent(story.id)}#tv-stations`}
                className="group grid min-h-20 w-full grid-cols-[48px_minmax(0,1fr)] items-start gap-3 rounded-[6px] py-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <span className="relative block h-12 w-12">
                  <span
                    className="absolute inset-0 overflow-hidden rounded-[6px] border border-border bg-muted bg-cover bg-center"
                    style={story.imageUrl ? { backgroundImage: `url(${story.imageUrl})` } : undefined}
                    role={story.imageUrl ? "img" : undefined}
                    aria-label={story.imageUrl ? "" : undefined}
                  >
                    {!story.imageUrl ? <span className="grid h-full place-items-center text-[10px] font-bold text-muted-foreground">NEWS</span> : null}
                  </span>
                  <span className="absolute -left-[6px] -top-[6px] grid h-5 w-5 place-items-center rounded-full bg-[var(--hp-surface)] text-[11px] font-bold leading-none text-[var(--hp-text-primary)] ring-1 ring-border">
                    <span className="tabular-nums leading-none text-[var(--hp-text-primary)]">{index + 1}</span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-4 block type-t6 underline-offset-2 group-hover:underline group-focus-visible:underline">
                    {story.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {station?.callSign ?? "Hearst TV"} · Local News
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <Link
        href="/hearst-plus/local-news/"
        className="mt-3 block border-t border-border pt-3 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        View all local news
      </Link>
    </section>
  );
}
