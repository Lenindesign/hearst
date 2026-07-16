"use client";

import React from "react";
import type { LifestyleRiverProfile } from "./lifestyle-river-types";

const accountStorageKey = "hearst-reader-account-v1";
const sessionStorageKey = "hearst-reader-session-v1";
const readLaterCollectionName = "Read Later";

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

export type ReaderAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  preferences: LifestyleRiverProfile;
  commentsByStoryId: Record<string, ReaderComment[]>;
  collections: ReaderCollection[];
};

type StoredReaderAccount = ReaderAccount & {
  passwordHash: string;
};

type CreateAccountInput = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  preferences: LifestyleRiverProfile;
};

type GoogleAccountInput = Omit<CreateAccountInput, "password">;

type ReaderAccountContextValue = {
  account: ReaderAccount | null;
  isHydrated: boolean;
  createAccount: (input: CreateAccountInput) => Promise<ReaderAccount>;
  continueWithGoogle: (input: GoogleAccountInput) => Promise<ReaderAccount>;
  signIn: (email: string, password: string) => Promise<ReaderAccount>;
  signOut: () => void;
  updateAccount: (updates: Partial<Pick<ReaderAccount, "firstName" | "lastName">>) => void;
  updatePreferences: (preferences: LifestyleRiverProfile) => void;
  addComment: (comment: Omit<ReaderComment, "id" | "author" | "role" | "age" | "likes" | "createdAt">) => void;
  deleteComment: (storyId: string, commentId: string) => void;
  createCollection: (name: string) => ReaderCollection | null;
  deleteCollection: (collectionId: string) => void;
  toggleStoryInCollection: (collectionId: string, storyId: string) => void;
  deleteAccount: () => void;
};

const ReaderAccountContext = React.createContext<ReaderAccountContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readStoredAccount(): StoredReaderAccount | null {
  try {
    const value = window.localStorage.getItem(accountStorageKey);
    return value ? (JSON.parse(value) as StoredReaderAccount) : null;
  } catch {
    return null;
  }
}

function writeStoredAccount(account: StoredReaderAccount) {
  window.localStorage.setItem(accountStorageKey, JSON.stringify(account));
}

function publicAccount(account: StoredReaderAccount): ReaderAccount {
  const readerAccount = { ...account } as Partial<StoredReaderAccount>;
  delete readerAccount.passwordHash;
  return readerAccount as ReaderAccount;
}

export function ReaderAccountProvider({ children }: { children: React.ReactNode }) {
  const [storedAccount, setStoredAccount] = React.useState<StoredReaderAccount | null>(null);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    const nextStoredAccount = readStoredAccount();
    const activeSessionId = window.localStorage.getItem(sessionStorageKey);
    setStoredAccount(nextStoredAccount);
    setIsSignedIn(Boolean(nextStoredAccount && activeSessionId === nextStoredAccount.id));
    setIsHydrated(true);
  }, []);

  const persist = React.useCallback((next: StoredReaderAccount) => {
    setStoredAccount(next);
    writeStoredAccount(next);
  }, []);

  const createAccount = React.useCallback(async (input: CreateAccountInput) => {
    const email = normalizeEmail(input.email);
    const existing = readStoredAccount();
    if (existing && existing.email === email) {
      throw new Error("An account with this email already exists. Sign in instead.");
    }

    const now = new Date().toISOString();
    const next: StoredReaderAccount = {
      id: `reader-${Date.now()}`,
      firstName: input.firstName.trim(),
      lastName: input.lastName?.trim() ?? "",
      email,
      createdAt: now,
      preferences: input.preferences,
      commentsByStoryId: {},
      collections: [
        {
          id: `collection-${Date.now()}`,
          name: "Read Later",
          storyIds: [...input.preferences.savedIds],
          createdAt: now,
          updatedAt: now,
        },
      ],
      passwordHash: await hashPassword(input.password),
    };

    persist(next);
    window.localStorage.setItem(sessionStorageKey, next.id);
    setIsSignedIn(true);
    return publicAccount(next);
  }, [persist]);

  const continueWithGoogle = React.useCallback(async (input: GoogleAccountInput) => {
    const email = normalizeEmail(input.email);
    const existing = readStoredAccount();
    if (existing && existing.email === email) {
      setStoredAccount(existing);
      window.localStorage.setItem(sessionStorageKey, existing.id);
      setIsSignedIn(true);
      return publicAccount(existing);
    }

    const now = new Date().toISOString();
    const next: StoredReaderAccount = {
      id: `reader-google-${Date.now()}`,
      firstName: input.firstName.trim(),
      lastName: input.lastName?.trim() ?? "",
      email,
      createdAt: now,
      preferences: input.preferences,
      commentsByStoryId: {},
      collections: [
        {
          id: `collection-${Date.now()}`,
          name: "Read Later",
          storyIds: [...input.preferences.savedIds],
          createdAt: now,
          updatedAt: now,
        },
      ],
      passwordHash: await hashPassword(`google:${email}`),
    };

    persist(next);
    window.localStorage.setItem(sessionStorageKey, next.id);
    setIsSignedIn(true);
    return publicAccount(next);
  }, [persist]);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const existing = readStoredAccount();
    const passwordHash = await hashPassword(password);
    if (!existing || existing.email !== normalizeEmail(email) || existing.passwordHash !== passwordHash) {
      throw new Error("That email and password do not match the account saved in this browser.");
    }

    setStoredAccount(existing);
    window.localStorage.setItem(sessionStorageKey, existing.id);
    setIsSignedIn(true);
    return publicAccount(existing);
  }, []);

  const signOut = React.useCallback(() => {
    window.localStorage.removeItem(sessionStorageKey);
    setIsSignedIn(false);
  }, []);

  const updateStoredAccount = React.useCallback((updater: (current: StoredReaderAccount) => StoredReaderAccount) => {
    setStoredAccount((current) => {
      if (!current) return current;
      const next = updater(current);
      writeStoredAccount(next);
      return next;
    });
  }, []);

  const updateAccount = React.useCallback((updates: Partial<Pick<ReaderAccount, "firstName" | "lastName">>) => {
    updateStoredAccount((current) => ({ ...current, ...updates }));
  }, [updateStoredAccount]);

  const updatePreferences = React.useCallback((preferences: LifestyleRiverProfile) => {
    updateStoredAccount((current) => {
      const previouslySaved = new Set(current.preferences.savedIds);
      const nextSaved = new Set(preferences.savedIds);
      const addedStoryIds = preferences.savedIds.filter((id) => !previouslySaved.has(id));
      const removedStoryIds = current.preferences.savedIds.filter((id) => !nextSaved.has(id));

      return {
        ...current,
        preferences,
        collections: current.collections.map((collection) => {
          if (collection.name !== readLaterCollectionName || (addedStoryIds.length === 0 && removedStoryIds.length === 0)) {
            return collection;
          }

          return {
            ...collection,
            storyIds: [
              ...collection.storyIds.filter((id) => !removedStoryIds.includes(id)),
              ...addedStoryIds.filter((id) => !collection.storyIds.includes(id)),
            ],
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    });
  }, [updateStoredAccount]);

  const addComment = React.useCallback((comment: Omit<ReaderComment, "id" | "author" | "role" | "age" | "likes" | "createdAt">) => {
    updateStoredAccount((current) => {
      const nextComment: ReaderComment = {
        ...comment,
        id: `${comment.storyId}-reader-${Date.now()}`,
        author: `${current.firstName} ${current.lastName}`.trim(),
        role: "reader",
        age: "now",
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      return {
        ...current,
        commentsByStoryId: {
          ...current.commentsByStoryId,
          [comment.storyId]: [nextComment, ...(current.commentsByStoryId[comment.storyId] ?? [])],
        },
      };
    });
  }, [updateStoredAccount]);

  const deleteComment = React.useCallback((storyId: string, commentId: string) => {
    updateStoredAccount((current) => ({
      ...current,
      commentsByStoryId: {
        ...current.commentsByStoryId,
        [storyId]: (current.commentsByStoryId[storyId] ?? []).filter((comment) => comment.id !== commentId),
      },
    }));
  }, [updateStoredAccount]);

  const createCollection = React.useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName || !storedAccount) return null;
    const now = new Date().toISOString();
    const collection: ReaderCollection = {
      id: `collection-${Date.now()}`,
      name: trimmedName,
      storyIds: [],
      createdAt: now,
      updatedAt: now,
    };
    updateStoredAccount((current) => ({ ...current, collections: [...current.collections, collection] }));
    return collection;
  }, [storedAccount, updateStoredAccount]);

  const deleteCollection = React.useCallback((collectionId: string) => {
    updateStoredAccount((current) => ({
      ...current,
      collections: current.collections.filter(
        (collection) => collection.id !== collectionId || collection.name === readLaterCollectionName,
      ),
    }));
  }, [updateStoredAccount]);

  const toggleStoryInCollection = React.useCallback((collectionId: string, storyId: string) => {
    updateStoredAccount((current) => ({
      ...current,
      collections: current.collections.map((collection) => {
        if (collection.id !== collectionId) return collection;
        if (collection.name === readLaterCollectionName) return collection;
        const containsStory = collection.storyIds.includes(storyId);
        return {
          ...collection,
          storyIds: containsStory
            ? collection.storyIds.filter((id) => id !== storyId)
            : [...collection.storyIds, storyId],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, [updateStoredAccount]);

  const deleteAccount = React.useCallback(() => {
    window.localStorage.removeItem(accountStorageKey);
    window.localStorage.removeItem(sessionStorageKey);
    setStoredAccount(null);
    setIsSignedIn(false);
  }, []);

  const value = React.useMemo<ReaderAccountContextValue>(() => ({
    account: isSignedIn && storedAccount ? publicAccount(storedAccount) : null,
    isHydrated,
    createAccount,
    continueWithGoogle,
    signIn,
    signOut,
    updateAccount,
    updatePreferences,
    addComment,
    deleteComment,
    createCollection,
    deleteCollection,
    toggleStoryInCollection,
    deleteAccount,
  }), [
    addComment,
    createAccount,
    continueWithGoogle,
    createCollection,
    deleteAccount,
    deleteCollection,
    deleteComment,
    isHydrated,
    isSignedIn,
    signIn,
    signOut,
    storedAccount,
    toggleStoryInCollection,
    updateAccount,
    updatePreferences,
  ]);

  return <ReaderAccountContext.Provider value={value}>{children}</ReaderAccountContext.Provider>;
}

export function useReaderAccount() {
  const context = React.useContext(ReaderAccountContext);
  if (!context) throw new Error("useReaderAccount must be used within ReaderAccountProvider");
  return context;
}
