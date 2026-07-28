"use client";

import React from "react";

import {
  getContinueReadingStoryIds,
  readReadingHistory,
  readingHistoryChangedEvent,
  readingHistoryStorageKey,
  type ReadingHistoryEntry,
} from "@/lib/reading-history";
import {
  currentDailyEditionSelectionVersion,
  readDailyEditionRecords,
  resolveDailyEdition,
  writeDailyEditionRecords,
} from "@/lib/daily-edition";
import type { LifestyleRiverStory } from "../lifestyle-river-types";

const readerRiverAllocationStoragePrefix = "hearst-plus-river-allocation:";

export function writeSessionContinueReadingStoryIds(
  scopeKey: string,
  editionDate: string,
  storyIds: string[],
) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      `${readerRiverAllocationStoragePrefix}${editionDate}:${scopeKey}`,
      JSON.stringify(storyIds),
    );
  } catch {
    // The river remains usable when session storage is unavailable.
  }
}

export function useReadingHistoryState() {
  const [state, setState] = React.useState<{
    entries: ReadingHistoryEntry[];
    hydrated: boolean;
  }>({ entries: [], hydrated: false });

  React.useEffect(() => {
    const syncReadingHistory = () => {
      setState({ entries: readReadingHistory(), hydrated: true });
    };
    const syncStorageEvent = (event: StorageEvent) => {
      if (event.key === readingHistoryStorageKey) syncReadingHistory();
    };

    syncReadingHistory();
    window.addEventListener(readingHistoryChangedEvent, syncReadingHistory);
    window.addEventListener("storage", syncStorageEvent);
    return () => {
      window.removeEventListener(readingHistoryChangedEvent, syncReadingHistory);
      window.removeEventListener("storage", syncStorageEvent);
    };
  }, []);

  return state;
}

export function useReadingHistoryEntries() {
  return useReadingHistoryState().entries;
}

export function useContinueReadingStoryIds() {
  const entries = useReadingHistoryEntries();
  return React.useMemo(() => getContinueReadingStoryIds(entries), [entries]);
}

export function useDailyEditionStories(
  editionKey: string,
  stories: LifestyleRiverStory[],
  editionSize = 6
) {
  const storyIdentityKey = stories.slice(0, 40).map((story) => story.id).join("|");
  const [storyIds, setStoryIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (!editionKey || stories.length === 0) {
        setStoryIds([]);
        return;
      }

      const records = resolveDailyEdition(
        readDailyEditionRecords(),
        editionKey,
        stories,
        Date.now(),
        editionSize,
        currentDailyEditionSelectionVersion
      );
      writeDailyEditionRecords(records);
      setStoryIds(records.find((record) => record.editionKey === editionKey)?.storyIds ?? []);
    });
    return () => {
      cancelled = true;
    };
  // The bounded identity key intentionally tracks the ranked candidates that can seed the edition.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editionKey, editionSize, storyIdentityKey]);

  return React.useMemo(
    () => storyIds
      .map((storyId) => stories.find((story) => story.id === storyId))
      .filter((story): story is LifestyleRiverStory => Boolean(story)),
    [stories, storyIds]
  );
}

export function getSessionContinueReadingStoryIds(scopeKey: string, editionDate: string) {
  const initialStoryIds = getContinueReadingStoryIds(readReadingHistory());

  if (typeof window === "undefined") return initialStoryIds;

  const storageKey = `${readerRiverAllocationStoragePrefix}${editionDate}:${scopeKey}`;

  try {
    const storedValue = window.sessionStorage.getItem(storageKey);
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      if (Array.isArray(parsed)) {
        const storedStoryIds = parsed.filter((storyId): storyId is string => typeof storyId === "string");
        // Preserve the current visit's stable allocation, while allowing a
        // story opened since the allocation was created to enter the queue.
        return [
          ...initialStoryIds.filter((storyId) => !storedStoryIds.includes(storyId)),
          ...storedStoryIds,
        ];
      }
    }

    writeSessionContinueReadingStoryIds(scopeKey, editionDate, initialStoryIds);
  } catch {
    // The river remains usable when session storage is unavailable.
  }

  return initialStoryIds;
}
