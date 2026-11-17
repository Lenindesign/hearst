"use client";

import React from "react";

/**
 * How the standard story reader is presented from 640px up: as the centered,
 * inset modal over the page, or as a full page that fills the window. Phones
 * always use the full viewport. The choice is global and persists across
 * readers and visits (APP_RULES › Reader modal).
 */
export type ReaderPresentation = "modal" | "page";

const storageKey = "hearst-reader-presentation";
const changeEvent = "hearst-reader-presentation-change";

function readPresentation(): ReaderPresentation {
  try {
    return window.localStorage.getItem(storageKey) === "page" ? "page" : "modal";
  } catch {
    return "modal";
  }
}

let memoryPresentation: ReaderPresentation | null = null;

function getSnapshot(): ReaderPresentation {
  return memoryPresentation ?? readPresentation();
}

function getServerSnapshot(): ReaderPresentation {
  return "modal";
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    memoryPresentation = null;
    onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function setReaderPresentation(presentation: ReaderPresentation) {
  memoryPresentation = presentation;
  try {
    window.localStorage.setItem(storageKey, presentation);
  } catch {
    // The in-memory choice still applies for this visit.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function useReaderPresentation(): ReaderPresentation {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
