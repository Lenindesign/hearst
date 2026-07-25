import type { LifestyleRiverProfile, LifestyleRiverStory } from "@/components/lifestyle-river-types";

export type ReaderComment = {
  id: string;
  storyId: string;
  storyTitle: string;
  author: string;
  role: string;
  body: string;
  age: string;
  likes: number;
  createdAt: string;
};

export type ReaderCollection = {
  id: string;
  name: string;
  storyIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type ReaderSavedStory = LifestyleRiverStory & {
  savedAt: string;
};

export type ReaderAccount = {
  id: string;
  syncId?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  preferences: LifestyleRiverProfile;
  commentsByStoryId: Record<string, ReaderComment[]>;
  collections: ReaderCollection[];
  storySnapshots: Record<string, ReaderSavedStory>;
};

function mergeStringList(current: string[] = [], base: string[] = [], incoming: string[] = []) {
  const incomingSet = new Set(incoming);
  const baseSet = new Set(base);
  const removed = new Set(base.filter((value) => !incomingSet.has(value)));
  const merged = current.filter((value) => !removed.has(value));

  incoming.forEach((value) => {
    if (!baseSet.has(value) && !merged.includes(value)) merged.push(value);
  });

  return merged;
}

function changed<T>(incoming: T, base: T) {
  return JSON.stringify(incoming) !== JSON.stringify(base);
}

function mergeRecord<T>(
  current: Record<string, T> = {},
  base: Record<string, T> = {},
  incoming: Record<string, T> = {}
) {
  const merged = { ...current };

  Object.keys(base).forEach((key) => {
    if (!(key in incoming)) delete merged[key];
  });
  Object.entries(incoming).forEach(([key, value]) => {
    if (!(key in base) || changed(value, base[key])) merged[key] = value;
  });

  return merged;
}

function commentsById(comments: ReaderComment[] = []) {
  return Object.fromEntries(comments.map((comment) => [comment.id, comment]));
}

function mergeComments(
  current: Record<string, ReaderComment[]> = {},
  base: Record<string, ReaderComment[]> = {},
  incoming: Record<string, ReaderComment[]> = {}
) {
  const storyIds = new Set([
    ...Object.keys(current),
    ...Object.keys(base),
    ...Object.keys(incoming),
  ]);
  const merged: Record<string, ReaderComment[]> = {};

  storyIds.forEach((storyId) => {
    const next = Object.values(mergeRecord(
      commentsById(current[storyId]),
      commentsById(base[storyId]),
      commentsById(incoming[storyId])
    )).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    if (next.length > 0) merged[storyId] = next;
  });

  return merged;
}

function collectionsById(collections: ReaderCollection[] = []) {
  return new Map(collections.map((collection) => [collection.id, collection]));
}

function mergeCollections(
  current: ReaderCollection[] = [],
  base: ReaderCollection[] = [],
  incoming: ReaderCollection[] = []
) {
  const currentById = collectionsById(current);
  const baseById = collectionsById(base);
  const incomingById = collectionsById(incoming);
  const merged = new Map(currentById);

  baseById.forEach((_collection, id) => {
    if (!incomingById.has(id)) merged.delete(id);
  });

  incomingById.forEach((collection, id) => {
    const baseCollection = baseById.get(id);
    const currentCollection = currentById.get(id);
    if (!baseCollection) {
      merged.set(id, collection);
      return;
    }
    if (!currentCollection) {
      if (changed(collection, baseCollection)) merged.set(id, collection);
      return;
    }

    merged.set(id, {
      ...currentCollection,
      name: collection.name !== baseCollection.name ? collection.name : currentCollection.name,
      storyIds: mergeStringList(currentCollection.storyIds, baseCollection.storyIds, collection.storyIds),
      updatedAt: collection.updatedAt !== baseCollection.updatedAt ? collection.updatedAt : currentCollection.updatedAt,
    });
  });

  return Array.from(merged.values()).sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function normalizeReaderAccount(account: Omit<ReaderAccount, "storySnapshots"> & Partial<Pick<ReaderAccount, "storySnapshots">>): ReaderAccount {
  return {
    ...account,
    preferences: {
      followedTopics: account.preferences.followedTopics ?? [],
      followedBrands: account.preferences.followedBrands ?? [],
      savedTags: account.preferences.savedTags ?? [],
      boostedTags: account.preferences.boostedTags ?? [],
      savedIds: account.preferences.savedIds ?? [],
      hiddenIds: account.preferences.hiddenIds ?? [],
      personalizationMode: account.preferences.personalizationMode,
    },
    commentsByStoryId: account.commentsByStoryId ?? {},
    collections: account.collections ?? [],
    storySnapshots: account.storySnapshots ?? {},
  };
}

export function mergeReaderAccounts(
  currentInput: ReaderAccount,
  baseInput: ReaderAccount,
  incomingInput: ReaderAccount
): ReaderAccount {
  const current = normalizeReaderAccount(currentInput);
  const base = normalizeReaderAccount(baseInput);
  const incoming = normalizeReaderAccount(incomingInput);

  return {
    ...current,
    syncId: incoming.syncId ?? current.syncId,
    firstName: incoming.firstName !== base.firstName ? incoming.firstName : current.firstName,
    lastName: incoming.lastName !== base.lastName ? incoming.lastName : current.lastName,
    email: incoming.email !== base.email ? incoming.email : current.email,
    avatarUrl: incoming.avatarUrl !== base.avatarUrl ? incoming.avatarUrl : current.avatarUrl,
    preferences: {
      followedTopics: mergeStringList(current.preferences.followedTopics, base.preferences.followedTopics, incoming.preferences.followedTopics),
      followedBrands: mergeStringList(current.preferences.followedBrands, base.preferences.followedBrands, incoming.preferences.followedBrands),
      savedTags: mergeStringList(current.preferences.savedTags, base.preferences.savedTags, incoming.preferences.savedTags),
      boostedTags: mergeStringList(current.preferences.boostedTags, base.preferences.boostedTags, incoming.preferences.boostedTags),
      savedIds: mergeStringList(current.preferences.savedIds, base.preferences.savedIds, incoming.preferences.savedIds),
      hiddenIds: mergeStringList(current.preferences.hiddenIds, base.preferences.hiddenIds, incoming.preferences.hiddenIds),
      personalizationMode: incoming.preferences.personalizationMode !== base.preferences.personalizationMode
        ? incoming.preferences.personalizationMode
        : current.preferences.personalizationMode,
    },
    commentsByStoryId: mergeComments(current.commentsByStoryId, base.commentsByStoryId, incoming.commentsByStoryId),
    collections: mergeCollections(current.collections, base.collections, incoming.collections),
    storySnapshots: mergeRecord(current.storySnapshots, base.storySnapshots, incoming.storySnapshots),
  };
}

export function createStorySnapshot(story: LifestyleRiverStory, savedAt = new Date().toISOString()): ReaderSavedStory {
  return { ...story, savedAt };
}
