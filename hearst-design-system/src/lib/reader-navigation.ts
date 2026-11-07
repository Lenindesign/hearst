import { getHearstStoryRoute, normalizeReaderReturnHref } from "./story-routes";

const readerReturnScrollStoragePrefix = "hearst-plus-reader-return-scroll:";
const readerReturnSnapshotMaxAgeMs = 30 * 60 * 1000;

export interface ReaderReturnScrollSnapshot {
  href: string;
  scrollX: number;
  scrollY: number;
  storyId: string;
  storyIds: string[];
  /** Viewport top of the opened story card, used to re-anchor on return. */
  storyViewportTop?: number;
  createdAt: number;
}

export function appendReaderReturnHref(storyId: string, returnHref: string | null) {
  const route = getHearstStoryRoute(storyId);
  const safeReturnHref = normalizeReaderReturnHref(returnHref);

  if (!safeReturnHref) return route;

  return `${route}?from=${encodeURIComponent(safeReturnHref)}`;
}

export function appendAmbientReaderHref(storyId: string, returnHref: string | null) {
  const href = appendReaderReturnHref(storyId, returnHref);
  const url = new URL(href, "https://hearst.local");
  url.searchParams.set("ambient", "1");

  return `${url.pathname}${url.search}${url.hash}`;
}

export function removeAmbientReaderHref(href: string) {
  const url = new URL(href, "https://hearst.local");
  url.searchParams.delete("ambient");

  return `${url.pathname}${url.search}${url.hash}`;
}

function findRiverStoryElement(storyId: string) {
  if (typeof document === "undefined") return undefined;
  return Array.from(document.querySelectorAll<HTMLElement>("#hearst-story-river [data-story-id]"))
    .find((element) => element.dataset.storyId === storyId);
}

export function getReaderReturnScrollStorageKey(returnHref: string | null) {
  const safeReturnHref = normalizeReaderReturnHref(returnHref);

  if (!safeReturnHref) return null;

  return `${readerReturnScrollStoragePrefix}${safeReturnHref}`;
}

export function saveReaderReturnScrollSnapshot(
  storyId: string,
  returnHref: string | null,
  storyIds: string[] = [],
) {
  if (typeof window === "undefined") return;

  const safeReturnHref = normalizeReaderReturnHref(returnHref);
  const storageKey = getReaderReturnScrollStorageKey(safeReturnHref);

  if (!safeReturnHref || !storageKey) return;

  const storyElement = findRiverStoryElement(storyId);
  const snapshot: ReaderReturnScrollSnapshot = {
    href: safeReturnHref,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    storyId,
    storyIds,
    storyViewportTop: storyElement?.getBoundingClientRect().top,
    createdAt: Date.now(),
  };

  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {
    // Reader navigation remains usable when session storage is unavailable.
  }
}

export function parseReaderReturnScrollSnapshot(
  rawSnapshot: string,
  returnHref: string | null,
  now = Date.now(),
): ReaderReturnScrollSnapshot | null {
  const safeReturnHref = normalizeReaderReturnHref(returnHref);
  if (!safeReturnHref) return null;

  try {
    const snapshot = JSON.parse(rawSnapshot) as Partial<ReaderReturnScrollSnapshot>;
    const isValidSnapshot =
      snapshot.href === safeReturnHref
      && Number.isFinite(snapshot.scrollX)
      && Number.isFinite(snapshot.scrollY)
      && Number.isFinite(snapshot.createdAt)
      && typeof snapshot.storyId === "string";

    if (!isValidSnapshot) return null;

    const createdAt = snapshot.createdAt as number;
    if (now - createdAt > readerReturnSnapshotMaxAgeMs || createdAt > now) return null;

    return {
      href: safeReturnHref,
      scrollX: snapshot.scrollX as number,
      scrollY: snapshot.scrollY as number,
      storyId: snapshot.storyId as string,
      storyIds: Array.isArray(snapshot.storyIds)
        ? snapshot.storyIds.filter((storyId): storyId is string => typeof storyId === "string")
        : [],
      ...(Number.isFinite(snapshot.storyViewportTop) ? { storyViewportTop: snapshot.storyViewportTop } : {}),
      createdAt,
    };
  } catch {
    return null;
  }
}

export function readReaderReturnScrollSnapshot(
  returnHref: string | null,
): ReaderReturnScrollSnapshot | null {
  if (typeof window === "undefined") return null;

  const storageKey = getReaderReturnScrollStorageKey(returnHref);
  if (!storageKey) return null;

  try {
    const rawSnapshot = window.sessionStorage.getItem(storageKey);
    if (!rawSnapshot) return null;

    const snapshot = parseReaderReturnScrollSnapshot(rawSnapshot, returnHref);
    if (!snapshot) window.sessionStorage.removeItem(storageKey);
    return snapshot;
  } catch {
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // Reader navigation remains usable when session storage is unavailable.
    }
    return null;
  }
}

export function restoreReaderReturnScrollSnapshot(returnHref: string | null) {
  if (typeof window === "undefined") return;

  const snapshot = readReaderReturnScrollSnapshot(returnHref);
  const storageKey = getReaderReturnScrollStorageKey(returnHref);

  if (!snapshot) return;

  // The river can reorder and images can settle after returning, so keep
  // re-anchoring the opened story to where it sat in the viewport. A raw
  // scroll offset is only used when that story card is not on the page.
  const attemptDelays = [0, 80, 200, 420, 800, 1400];

  const restore = (attemptIndex = 0) => {
    const currentHref = `${window.location.pathname}${window.location.search}`;
    const isReturnPageVisible = currentHref === snapshot.href;
    const isFinalAttempt = attemptIndex >= attemptDelays.length - 1;

    if (isReturnPageVisible || isFinalAttempt) {
      const storyElement = snapshot.storyViewportTop === undefined
        ? undefined
        : findRiverStoryElement(snapshot.storyId);
      if (storyElement && snapshot.storyViewportTop !== undefined) {
        const nextScrollY = Math.max(
          0,
          window.scrollY + storyElement.getBoundingClientRect().top - snapshot.storyViewportTop,
        );
        if (Math.abs(nextScrollY - window.scrollY) > 1) window.scrollTo(snapshot.scrollX, nextScrollY);
      } else if (attemptIndex === 0 || isFinalAttempt || !isReturnPageVisible) {
        window.scrollTo(snapshot.scrollX, snapshot.scrollY);
      }
    }

    if (isFinalAttempt) {
      if (storageKey && isReturnPageVisible) {
        window.setTimeout(() => {
          try {
            window.sessionStorage.removeItem(storageKey);
          } catch {
            // Reader navigation remains usable when session storage is unavailable.
          }
        }, 2000);
      }
      return;
    }

    window.setTimeout(() => restore(attemptIndex + 1), attemptDelays[attemptIndex + 1] - attemptDelays[attemptIndex]);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => restore());
  });
}

export function orderReaderReturnStories(
  snapshot: ReaderReturnScrollSnapshot | null,
  candidateStoryIds: string[],
) {
  if (!snapshot?.storyIds.length) return candidateStoryIds;

  const candidateStoryIdSet = new Set(candidateStoryIds);
  const retainedStoryIds = snapshot.storyIds.filter((storyId) => candidateStoryIdSet.has(storyId));
  if (!retainedStoryIds.includes(snapshot.storyId)) return candidateStoryIds;

  const retainedStoryIdSet = new Set(retainedStoryIds);
  const appendedStoryIds = candidateStoryIds.filter((storyId) => !retainedStoryIdSet.has(storyId));

  return [...retainedStoryIds, ...appendedStoryIds];
}

export function applyReaderReturnStoryOrder(
  returnHref: string | null,
  candidateStoryIds: string[],
) {
  return orderReaderReturnStories(
    readReaderReturnScrollSnapshot(returnHref),
    candidateStoryIds,
  );
}

export function getReaderOriginBrandSlug(returnHref?: string | null) {
  const safeReturnHref = normalizeReaderReturnHref(returnHref);
  if (!safeReturnHref) return null;

  const pathname = safeReturnHref.split(/[?#]/, 1)[0];
  const match = pathname.match(/^\/(?:brands|lifestyle|autos|flux|ew)\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}
