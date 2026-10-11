"use client";

import React from "react";

// How the story river is shown: the default card blocks, or a compact list of rows. A per-reader convenience kept in
// this browser; the masthead toggle sets it and every river card reads it.
export type RiverLayout = "cards" | "list";

const STORAGE_KEY = "hearst-plus:river-layout";
const CHANGE_EVENT = "hearst-plus-river-layout-change";

function read(): RiverLayout {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "list" ? "list" : "cards";
  } catch {
    return "cards";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setRiverLayout(layout: RiverLayout) {
  try {
    window.localStorage.setItem(STORAGE_KEY, layout);
  } catch {
    // Storage blocked: the choice still applies until reload.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useRiverLayout(): RiverLayout {
  return React.useSyncExternalStore(subscribe, read, () => "cards");
}
