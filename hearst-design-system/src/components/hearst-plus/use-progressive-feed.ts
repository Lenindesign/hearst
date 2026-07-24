"use client";

import React from "react";

type ProgressiveFeedPage<Story> = {
  stories: Story[];
  nextOffset: number;
  total: number;
  hasMore: boolean;
};

type ProgressiveFeedStatus = "idle" | "loading" | "error" | "complete";

type UseProgressiveFeedOptions<Story> = {
  enabled: boolean;
  endpoint: string;
  destination: string;
  brandSlug?: string | null;
  pageSize: number;
  getIdentity: (story: Story) => string;
};

type ProgressiveFeedState<Story> = {
  stories: Story[];
  hasMore: boolean;
  status: ProgressiveFeedStatus;
  error: string | null;
};

const initialState = <Story,>(enabled: boolean): ProgressiveFeedState<Story> => ({
  stories: [],
  hasMore: enabled,
  status: "idle",
  error: null,
});

export function useProgressiveFeed<Story>({
  enabled,
  endpoint,
  destination,
  brandSlug,
  pageSize,
  getIdentity,
}: UseProgressiveFeedOptions<Story>) {
  const [state, setState] = React.useState<ProgressiveFeedState<Story>>(
    () => initialState<Story>(enabled)
  );
  const nextOffsetRef = React.useRef(0);
  const hasMoreRef = React.useRef(enabled);
  const loadingRef = React.useRef(false);
  const controllerRef = React.useRef<AbortController | null>(null);
  const scopeKey = `${endpoint}:${destination}:${brandSlug ?? "all"}:${enabled ? "enabled" : "disabled"}`;

  React.useEffect(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    nextOffsetRef.current = 0;
    hasMoreRef.current = enabled;
    loadingRef.current = false;
    setState(initialState<Story>(enabled));

    return () => controllerRef.current?.abort();
  }, [enabled, scopeKey]);

  React.useEffect(() => {
    const pauseRequest = () => {
      const shouldPause = document.visibilityState === "hidden" || !navigator.onLine;
      if (!shouldPause) return;

      controllerRef.current?.abort();
      controllerRef.current = null;
      loadingRef.current = false;
      setState((current) => current.status === "loading"
        ? { ...current, status: "idle" }
        : current);
    };

    document.addEventListener("visibilitychange", pauseRequest);
    window.addEventListener("offline", pauseRequest);
    return () => {
      document.removeEventListener("visibilitychange", pauseRequest);
      window.removeEventListener("offline", pauseRequest);
    };
  }, []);

  const loadNextPage = React.useCallback(async () => {
    if (
      !enabled
      || loadingRef.current
      || !hasMoreRef.current
      || document.visibilityState === "hidden"
      || !navigator.onLine
    ) {
      return;
    }

    const requestedOffset = nextOffsetRef.current;
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;
    loadingRef.current = true;
    setState((current) => ({ ...current, status: "loading", error: null }));

    const searchParams = new URLSearchParams({
      destination,
      offset: String(requestedOffset),
      limit: String(pageSize),
    });
    if (brandSlug) searchParams.set("brandSlug", brandSlug);

    try {
      const response = await fetch(`${endpoint}?${searchParams.toString()}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Feed request returned ${response.status}`);

      const page = await response.json() as ProgressiveFeedPage<Story>;
      if (page.hasMore && page.nextOffset <= requestedOffset) {
        throw new Error("Feed pagination did not advance");
      }

      nextOffsetRef.current = page.nextOffset;
      hasMoreRef.current = page.hasMore;
      setState((current) => {
        const seen = new Set(current.stories.map(getIdentity));
        const nextStories = [
          ...current.stories,
          ...page.stories.filter((story) => {
            const identity = getIdentity(story);
            if (seen.has(identity)) return false;
            seen.add(identity);
            return true;
          }),
        ];

        return {
          stories: nextStories,
          hasMore: page.hasMore,
          status: page.hasMore ? "idle" : "complete",
          error: null,
        };
      });
    } catch (error) {
      if (controller.signal.aborted) return;

      setState((current) => ({
        ...current,
        status: "error",
        error: error instanceof Error ? error.message : "Unable to load more stories",
      }));
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      loadingRef.current = false;
    }
  }, [brandSlug, destination, enabled, endpoint, getIdentity, pageSize]);

  return {
    ...state,
    isLoading: state.status === "loading",
    loadNextPage,
  };
}
