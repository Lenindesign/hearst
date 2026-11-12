"use client";

import { Button } from "@/components/ui/button";

export function ProgressiveFeedSentinelStatus({
  error,
  hasLoadedStories,
  hasMore,
  hideCaughtUp = false,
  isLoading,
  noun,
  onRetry,
}: {
  error: string | null;
  hasLoadedStories: boolean;
  hasMore: boolean;
  hideCaughtUp?: boolean;
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

  if (hideCaughtUp) {
    return null;
  }

  return (
    <p className="text-sm text-muted-foreground">
      You&rsquo;re caught up on this {noun === "videos" ? "video feed" : "river"}.
    </p>
  );
}

const skeletonBar = "rounded-full bg-muted motion-safe:animate-pulse";
const skeletonBlock = "bg-muted motion-safe:animate-pulse";

/**
 * Loading skeleton for the destination river. It mirrors the loaded layout box
 * for box (STYLE.md › Loading states) so nothing moves when the feed arrives:
 * the same rail grid, the featured carousel's 5:3 photo with its overlapping
 * 224 / 240 px text panel and 24 px track padding, river cards 26 px apart with
 * a 16:9 image, the Trending and Saved cards in the left rail, and the 300 x 600
 * rail ad above Local News on the right.
 */
export function LifestyleRiverLoadingState({ pageHeading }: { pageHeading: string }) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading your personalized feed"
    >
      <span className="sr-only">Loading your personalized feed.</span>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-[var(--layout-gap)] gap-y-6 md:grid-cols-[minmax(0,1fr)_var(--layout-rail)] rail:grid-cols-[var(--layout-rail-compact)_minmax(0,1fr)_var(--layout-rail)] rail-full:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]">
        <div className="hidden rail:block" aria-hidden="true">
          <div className="space-y-5 pr-1">
            <div className="rounded-card bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <div className="flex h-[15px] items-center"><div className={`h-3 w-40 ${skeletonBar}`} /></div>
              <div className="-mb-3 mt-3 divide-y divide-border/70">
                {Array.from({ length: 5 }, (_, index) => (
                  // Rows run 4px taller in the 240px compact rail, where headlines wrap more.
                  <div key={index} className="grid h-[106px] grid-cols-[48px_minmax(0,1fr)] items-start gap-3 py-3 rail-full:h-[102px]">
                    <div className={`h-12 w-12 rounded-[6px] ${skeletonBlock}`} />
                    <div className="space-y-2 pt-1">
                      <div className={`h-3 w-full ${skeletonBar}`} />
                      <div className={`h-3 w-11/12 ${skeletonBar}`} />
                      <div className={`h-3 w-3/5 ${skeletonBar}`} />
                      <div className={`mt-3 h-2.5 w-24 ${skeletonBar}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[395px] rounded-card bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <div className={`h-3 w-28 ${skeletonBar}`} />
              <div className={`mt-5 h-3 w-full ${skeletonBar}`} />
              <div className={`mt-2 h-3 w-2/3 ${skeletonBar}`} />
              <div className={`mt-4 h-9 w-full rounded-[4px] ${skeletonBlock}`} />
            </div>
          </div>
        </div>

        <main className="min-w-0 space-y-[26px]" aria-label={pageHeading}>
          <h1 className="sr-only">{pageHeading}</h1>
          {/* Featured carousel: same frame, panel overlap and track padding as FeaturedStoryCarousel (cards layout). */}
          <div className="mb-[-10px] pb-6" aria-hidden="true">
            <div className="grid grid-rows-[auto_auto]">
              <div className={`aspect-[5/3] w-full rounded-card ${skeletonBlock}`} />
              <div className="relative z-10 mx-[6px] -mt-10 flex h-[224px] flex-col justify-end gap-3 rounded-card bg-[var(--hp-surface)] px-5 py-5 shadow-[0_6px_18px_rgba(0,0,0,0.20)] sm:mx-[18px] sm:-mt-12 sm:h-[240px] sm:px-6">
                <div className={`h-3 w-32 ${skeletonBar}`} />
                <div className={`h-6 w-full max-w-xl ${skeletonBar}`} />
                <div className={`h-6 w-3/4 max-w-lg ${skeletonBar}`} />
                <div className={`h-3 w-5/6 max-w-xl ${skeletonBar}`} />
              </div>
            </div>
          </div>
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]" aria-hidden="true">
              <div className={`aspect-video w-full ${skeletonBlock}`} />
              <div className="h-[212px] space-y-3 px-5 py-5 sm:px-6 md:h-[220px] lg:h-[192px]">
                <div className={`h-3 w-44 ${skeletonBar}`} />
                <div className={`h-6 w-full ${skeletonBar}`} />
                <div className={`h-6 w-2/3 ${skeletonBar}`} />
                <div className={`h-3 w-5/6 ${skeletonBar}`} />
              </div>
            </div>
          ))}
        </main>

        <div className="hidden md:block" aria-hidden="true">
          <div className="space-y-5">
            <div className="h-[357px] rounded-card bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] rail:hidden">
              <div className="flex h-[15px] items-center"><div className={`h-3 w-40 ${skeletonBar}`} /></div>
              <div className="mt-3 divide-y divide-border/70">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="grid h-[102px] grid-cols-[48px_minmax(0,1fr)] items-start gap-3 py-3">
                    <div className={`h-12 w-12 rounded-[6px] ${skeletonBlock}`} />
                    <div className="space-y-2 pt-1">
                      <div className={`h-3 w-full ${skeletonBar}`} />
                      <div className={`h-3 w-3/5 ${skeletonBar}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[538px] overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] lg:h-[600px]">
              <div className={`h-[268px] w-full ${skeletonBlock}`} />
              <div className="space-y-3 p-6">
                <div className={`h-6 w-4/5 ${skeletonBar}`} />
                <div className={`h-3 w-full ${skeletonBar}`} />
                <div className={`h-3 w-2/3 ${skeletonBar}`} />
                <div className={`mt-8 h-11 w-full rounded-[4px] ${skeletonBlock}`} />
              </div>
            </div>
            <div className="h-[170px] rounded-card bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <div className={`h-3 w-28 ${skeletonBar}`} />
              <div className={`mt-5 h-3 w-full ${skeletonBar}`} />
              <div className={`mt-2 h-3 w-4/5 ${skeletonBar}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
