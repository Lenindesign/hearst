"use client";

import { Button } from "@/components/ui/button";

export function ProgressiveFeedSentinelStatus({
  error,
  hasLoadedStories,
  hasMore,
  isLoading,
  noun,
  onRetry,
}: {
  error: string | null;
  hasLoadedStories: boolean;
  hasMore: boolean;
  isLoading: boolean;
  noun: "stories" | "videos";
  onRetry?: () => void;
}) {
  if (error) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>More {noun} could not be loaded.</span>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  if (isLoading) {
    return <p className="sr-only">Loading more {noun}...</p>;
  }

  if (hasLoadedStories || hasMore) {
    return null;
  }

  return (
    <p className="text-sm text-muted-foreground">
      You&rsquo;re caught up on this {noun === "videos" ? "video feed" : "river"}.
    </p>
  );
}

export function LifestyleRiverLoadingState({ pageHeading }: { pageHeading: string }) {
  return (
    <div
      className="space-y-8"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading your personalized feed"
    >
      <span className="sr-only">Loading your personalized feed.</span>
      <section
        className="relative hidden w-full overflow-hidden rounded-[8px] border border-border bg-[var(--hp-strip)] shadow-[var(--hp-shadow-card)] md:block"
        aria-hidden="true"
      >
        <div className="flex w-full overflow-hidden xl:grid xl:grid-cols-4 xl:divide-x xl:divide-border">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex w-[88vw] shrink-0 flex-col border-r border-border p-4 last:border-r-0 sm:w-[58vw] md:w-[44vw] lg:w-[34vw] xl:w-auto xl:min-w-0 xl:border-0"
            >
              <span className="block h-[11px] w-28 rounded-full bg-muted motion-safe:animate-pulse" />
              <span className="mt-3 flex items-start gap-3">
                <span className="mt-0.5 h-16 w-20 shrink-0 rounded-[8px] bg-muted motion-safe:animate-pulse" />
                <span className="min-w-0 flex-1 space-y-2">
                  <span className="block h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
                  <span className="block h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside
          className="hidden min-h-[360px] rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 lg:block"
          aria-hidden="true"
        >
          <div className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            Your Daily Habit
          </div>
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="space-y-2 border-b border-border pb-4 last:border-b-0"
              >
                <div className="h-2.5 w-16 rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        </aside>
        <main
          className="min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)]"
          aria-label={pageHeading}
        >
          <h1 className="sr-only">{pageHeading}</h1>
          <div
            className="relative w-full min-w-0 overflow-hidden bg-black motion-safe:animate-pulse"
            aria-hidden="true"
          >
            <div className="relative isolate">
              <div className="relative h-[min(128vw,520px)] w-full overflow-hidden sm:h-auto sm:aspect-video">
                <div className="absolute inset-0 bg-muted" />
                <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent via-black/45 to-black sm:h-[220px] xl:h-[240px]" />
              </div>
            </div>
            <div className="h-[112px] bg-black sm:h-[144px]" />
            <div className="absolute inset-x-5 bottom-6 space-y-3 sm:inset-x-7 sm:bottom-7">
              <div className="h-3 w-32 rounded-full bg-white/35" />
              <div className="h-7 w-full max-w-xl rounded-full bg-white/35" />
              <div className="h-7 w-3/4 max-w-lg rounded-full bg-white/35" />
              <div className="h-3 w-5/6 max-w-xl rounded-full bg-white/25" />
            </div>
          </div>
          <div
            className="flex h-[125px] items-center justify-between gap-3 border-t border-border px-4 py-3 sm:h-[49px]"
            aria-hidden="true"
          >
            <div className="h-2 w-28 rounded-full bg-muted motion-safe:animate-pulse" />
            <div className="h-6 w-48 rounded-[6px] bg-muted motion-safe:animate-pulse" />
          </div>
        </main>
        <aside
          className="hidden h-[360px] rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 lg:block"
          aria-hidden="true"
        >
          <div className="h-3 w-36 rounded-full bg-muted motion-safe:animate-pulse" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-6 w-6 shrink-0 rounded-full bg-muted motion-safe:animate-pulse" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-full rounded-full bg-muted motion-safe:animate-pulse" />
                  <div className="h-3 w-4/5 rounded-full bg-muted motion-safe:animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
