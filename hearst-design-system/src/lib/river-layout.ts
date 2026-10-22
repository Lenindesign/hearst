"use client";

import React from "react";

// The story river presentation is a per-reader preference shared across Hearst sections.
export type RiverLayout = "cards" | "list" | "full-width-hero";

const STORAGE_KEY = "hearst-plus:river-layout";
const CHANGE_EVENT = "hearst-plus-river-layout-change";

function read(): RiverLayout {
  try {
    const savedLayout = window.localStorage.getItem(STORAGE_KEY);
    return savedLayout === "list" || savedLayout === "full-width-hero" ? savedLayout : "cards";
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
