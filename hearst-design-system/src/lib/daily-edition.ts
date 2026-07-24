export type DailyEditionStory = {
  id: string;
  brand: string;
  topic: string;
};

export type DailyEditionRecord = {
  editionKey: string;
  storyIds: string[];
  createdAt: number;
  selectionVersion?: number;
};

export const dailyEditionStorageKey = "hearst-daily-editions-v1";
export const currentDailyEditionSelectionVersion = 2;

const maximumStoredEditions = 14;

export function getLocalEditionDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDailyEditionRecords(value: unknown): DailyEditionRecord[] {
  if (!Array.isArray(value)) return [];

  const seenEditionKeys = new Set<string>();
  return value
    .filter((record): record is Record<string, unknown> => Boolean(record) && typeof record === "object")
    .map((record) => ({
      editionKey: typeof record.editionKey === "string" ? record.editionKey.trim() : "",
      storyIds: Array.isArray(record.storyIds)
        ? Array.from(new Set(
            record.storyIds
              .filter((storyId): storyId is string => typeof storyId === "string" && storyId.trim().length > 0)
              .map((storyId) => storyId.trim())
          ))
        : [],
      createdAt: typeof record.createdAt === "number" && Number.isFinite(record.createdAt)
        ? record.createdAt
        : 0,
      ...(typeof record.selectionVersion === "number" && Number.isFinite(record.selectionVersion)
        ? { selectionVersion: record.selectionVersion }
        : {}),
    }))
    .filter((record) => {
      if (!record.editionKey || seenEditionKeys.has(record.editionKey)) return false;
      seenEditionKeys.add(record.editionKey);
      return true;
    })
    .sort((first, second) => second.createdAt - first.createdAt)
    .slice(0, maximumStoredEditions);
}

export function selectDailyEditionStoryIds(
  stories: DailyEditionStory[],
  existingStoryIds: string[] = [],
  editionSize = 6,
  deprioritizedStoryIds: string[] = []
) {
  if (editionSize <= 0) return [];

  const availableStories = stories.filter(
    (story, index) => story.id && stories.findIndex((candidate) => candidate.id === story.id) === index
  );
  const availableStoryIds = new Set(availableStories.map((story) => story.id));
  const selectedStories = existingStoryIds
    .filter((storyId, index) => availableStoryIds.has(storyId) && existingStoryIds.indexOf(storyId) === index)
    .map((storyId) => availableStories.find((story) => story.id === storyId))
    .filter((story): story is DailyEditionStory => Boolean(story))
    .slice(0, editionSize);
  const selectedIds = new Set(selectedStories.map((story) => story.id));
  const selectedBrands = new Set(selectedStories.map((story) => story.brand));
  const selectedTopics = new Set(selectedStories.map((story) => story.topic));
  const deprioritizedIds = new Set(deprioritizedStoryIds);

  const addMatchingStories = (
    matches: (story: DailyEditionStory) => boolean,
    includeDeprioritized = false
  ) => {
    for (const story of availableStories) {
      if (selectedStories.length >= editionSize) break;
      if (
        selectedIds.has(story.id)
        || (!includeDeprioritized && deprioritizedIds.has(story.id))
        || !matches(story)
      ) continue;
      selectedStories.push(story);
      selectedIds.add(story.id);
      selectedBrands.add(story.brand);
      selectedTopics.add(story.topic);
    }
  };

  if (selectedStories.length === 0 && availableStories[0]) {
    const leadStory = availableStories[0];
    selectedStories.push(leadStory);
    selectedIds.add(leadStory.id);
    selectedBrands.add(leadStory.brand);
    selectedTopics.add(leadStory.topic);
  }

  addMatchingStories((story) => !selectedBrands.has(story.brand) && !selectedTopics.has(story.topic));
  addMatchingStories((story) => !selectedBrands.has(story.brand));
  addMatchingStories((story) => !selectedTopics.has(story.topic));
  addMatchingStories(() => true);
  addMatchingStories(() => true, true);

  return selectedStories.map((story) => story.id);
}

export function resolveDailyEdition(
  records: DailyEditionRecord[],
  editionKey: string,
  stories: DailyEditionStory[],
  createdAt: number,
  editionSize = 6,
  selectionVersion?: number
) {
  const normalizedRecords = normalizeDailyEditionRecords(records);
  const existingRecord = normalizedRecords.find((record) =>
    record.editionKey === editionKey
    && (selectionVersion === undefined || record.selectionVersion === selectionVersion)
  );
  const editionScope = editionKey.includes(":")
    ? editionKey.slice(editionKey.indexOf(":") + 1)
    : editionKey;
  const previousRecord = existingRecord
    ? undefined
    : normalizedRecords.find((record) => {
        const recordScope = record.editionKey.includes(":")
          ? record.editionKey.slice(record.editionKey.indexOf(":") + 1)
          : record.editionKey;
        return recordScope === editionScope;
      });
  const storyIds = selectDailyEditionStoryIds(
    stories,
    existingRecord?.storyIds,
    editionSize,
    previousRecord?.storyIds
  );
  const nextRecord = {
    editionKey,
    storyIds,
    createdAt: existingRecord?.createdAt ?? createdAt,
    ...(selectionVersion === undefined ? {} : { selectionVersion }),
  };

  return normalizeDailyEditionRecords([
    nextRecord,
    ...normalizedRecords.filter((record) => record.editionKey !== editionKey),
  ]);
}

export function readDailyEditionRecords() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(dailyEditionStorageKey);
    return normalizeDailyEditionRecords(storedValue ? JSON.parse(storedValue) : []);
  } catch {
    return [];
  }
}

export function writeDailyEditionRecords(records: DailyEditionRecord[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(dailyEditionStorageKey, JSON.stringify(normalizeDailyEditionRecords(records)));
  } catch {
    // The edition still renders from the current feed when browser storage is unavailable.
  }
}
