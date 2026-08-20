"use client";

import React from "react";
import Link from "next/link";
import { getHearstTVStationById, type HearstTVContent } from "@/lib/hearst-tv-feed-framework";

type LocalNewsFeedResponse = {
  stories: HearstTVContent[];
};

export function LocalNewsRail() {
  const [stories, setStories] = React.useState<HearstTVContent[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    fetch("/api/hearst-tv/local-news/?limit=3", { cache: "no-store" })
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
  }, []);

  if (stories.length === 0) return null;

  return (
    <section
      className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
      aria-labelledby="local-news-rail-title"
      data-story-module="local-news"
    >
      <h2
        id="local-news-rail-title"
        className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]"
      >
        Local News
      </h2>
      <ol className="-mb-3 mt-3 divide-y divide-border/70">
        {stories.map((story, index) => {
          const station = getHearstTVStationById(story.stationId);
          return (
            <li key={story.id}>
              <a
                href={story.url}
                target="_blank"
                rel="noreferrer"
                className="group grid min-h-20 w-full grid-cols-[56px_minmax(0,1fr)] items-start gap-3 rounded-[6px] py-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <span
                  className="relative block h-14 w-14 overflow-hidden rounded-[6px] border border-border bg-muted bg-cover bg-center"
                  style={story.imageUrl ? { backgroundImage: `url(${story.imageUrl})` } : undefined}
                  role={story.imageUrl ? "img" : undefined}
                  aria-label={story.imageUrl ? "" : undefined}
                >
                  {!story.imageUrl ? <span className="grid h-full place-items-center text-[10px] font-bold text-muted-foreground">NEWS</span> : null}
                  <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--hp-surface)] text-[11px] font-bold leading-none text-primary ring-1 ring-border">
                    <span className="translate-y-px tabular-nums leading-none">{index + 1}</span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-3 block font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
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
