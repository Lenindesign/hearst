"use client";

import React from "react";

/**
 * Reader preferences set from the reader masthead (APP_RULES › Reader modal).
 * Both are global and persist across readers and visits.
 *
 * - Presentation: from 640px the standard reader is the centered, inset modal
 *   over the page or a full page that fills the window. Phones always use the
 *   full viewport.
 * - End of article: the next story in the queue loads below the article, or the
 *   article ends with related story cards in the home river's card format.
 */
export type ReaderPresentation = "modal" | "page";
export type ReaderEndOfArticle = "next" | "related";

function createPreference<T extends string>(
  storageKey: string,
  values: readonly T[],
  fallback: T,
) {
  const changeEvent = `${storageKey}-change`;
  let memoryValue: T | null = null;

  const read = (): T => {
    if (memoryValue) return memoryValue;
    try {
      const saved = window.localStorage.getItem(storageKey);
      return values.includes(saved as T) ? (saved as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const subscribe = (onChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      memoryValue = null;
      onChange();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(changeEvent, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(changeEvent, onChange);
    };
  };

  const set = (value: T) => {
    memoryValue = value;
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // The in-memory choice still applies for this visit.
    }
    window.dispatchEvent(new Event(changeEvent));
  };

  const useValue = (): T =>
    React.useSyncExternalStore(subscribe, read, () => fallback);

  return { set, useValue };
}

const presentation = createPreference<ReaderPresentation>(
  "hearst-reader-presentation",
  ["modal", "page"],
  "modal",
);

const endOfArticle = createPreference<ReaderEndOfArticle>(
  "hearst-reader-end-of-article",
  ["next", "related"],
  "next",
);

export const setReaderPresentation = presentation.set;
export const useReaderPresentation = presentation.useValue;
export const setReaderEndOfArticle = endOfArticle.set;
export const useReaderEndOfArticle = endOfArticle.useValue;
