export type ReadingHistoryEntry = {
  storyId: string;
  progress: number;
  lastOpenedAt: number;
};

export const readingHistoryStorageKey = "hearst-reading-history-v1";
export const readingHistoryChangedEvent = "hearst-reading-history-changed";
export const completedReadingProgress = 0.9;

const maximumReadingHistoryEntries = 30;
const minimumProgressChange = 0.02;

function clampProgress(progress: number) {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

export function normalizeReadingHistory(value: unknown): ReadingHistoryEntry[] {
  if (!Array.isArray(value)) return [];

  const seenStoryIds = new Set<string>();
  return value
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
    .map((entry) => ({
      storyId: typeof entry.storyId === "string" ? entry.storyId.trim() : "",
      progress: clampProgress(typeof entry.progress === "number" ? entry.progress : 0),
      lastOpenedAt: typeof entry.lastOpenedAt === "number" && Number.isFinite(entry.lastOpenedAt)
        ? entry.lastOpenedAt
        : 0,
    }))
    .filter((entry) => {
      if (!entry.storyId || seenStoryIds.has(entry.storyId)) return false;
      seenStoryIds.add(entry.storyId);
      return true;
    })
    .sort((first, second) => second.lastOpenedAt - first.lastOpenedAt)
    .slice(0, maximumReadingHistoryEntries);
}

export function updateReadingHistory(
  history: ReadingHistoryEntry[],
  storyId: string,
  progress: number | undefined,
  openedAt: number
) {
  const normalizedStoryId = storyId.trim();
  if (!normalizedStoryId) return normalizeReadingHistory(history);

  const currentHistory = normalizeReadingHistory(history);
  const existingEntry = currentHistory.find((entry) => entry.storyId === normalizedStoryId);
  const nextProgress = progress === undefined
    ? existingEntry?.progress ?? 0
    : clampProgress(progress);

  if (
    existingEntry
    && progress !== undefined
    && Math.abs(existingEntry.progress - nextProgress) < minimumProgressChange
    && (existingEntry.progress >= completedReadingProgress) === (nextProgress >= completedReadingProgress)
  ) {
    return currentHistory;
  }

  return normalizeReadingHistory([
    {
      storyId: normalizedStoryId,
      progress: nextProgress,
      lastOpenedAt: openedAt,
    },
    ...currentHistory.filter((entry) => entry.storyId !== normalizedStoryId),
  ]);
}

export function getContinueReadingStoryIds(history: ReadingHistoryEntry[]) {
  return normalizeReadingHistory(history)
    .filter((entry) => entry.progress < completedReadingProgress)
    .map((entry) => entry.storyId);
}

export function readReadingHistory() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(readingHistoryStorageKey);
    return normalizeReadingHistory(storedValue ? JSON.parse(storedValue) : []);
  } catch {
    return [];
  }
}

function writeReadingHistory(history: ReadingHistoryEntry[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(readingHistoryStorageKey, JSON.stringify(history));
    window.dispatchEvent(new Event(readingHistoryChangedEvent));
  } catch {
    // Reading remains available when browser storage is blocked or full.
  }
}

export function recordStoryOpened(storyId: string) {
  const currentHistory = readReadingHistory();
  writeReadingHistory(updateReadingHistory(currentHistory, storyId, undefined, Date.now()));
}

export function recordStoryProgress(storyId: string, progress: number) {
  const currentHistory = readReadingHistory();
  const nextHistory = updateReadingHistory(currentHistory, storyId, progress, Date.now());
  if (nextHistory === currentHistory) return;
  if (
    nextHistory.length === currentHistory.length
    && nextHistory.every((entry, index) =>
      entry.storyId === currentHistory[index]?.storyId
      && entry.progress === currentHistory[index]?.progress
      && entry.lastOpenedAt === currentHistory[index]?.lastOpenedAt
    )
  ) return;

  writeReadingHistory(nextHistory);
}
