import { getHearstStoryRoute, normalizeReaderReturnHref } from "./story-routes";

const readerReturnScrollStoragePrefix = "hearst-plus-reader-return-scroll:";
const readerReturnSnapshotMaxAgeMs = 30 * 60 * 1000;

export interface ReaderReturnScrollSnapshot {
  href: string;
  scrollX: number;
  scrollY: number;
  storyId: string;
  storyIds: string[];
  createdAt: number;
}

export function appendReaderReturnHref(storyId: string, returnHref: string | null) {
  const route = getHearstStoryRoute(storyId);
  const safeReturnHref = normalizeReaderReturnHref(returnHref);

  if (!safeReturnHref) return route;

  return `${route}?from=${encodeURIComponent(safeReturnHref)}`;
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

  const snapshot: ReaderReturnScrollSnapshot = {
    href: safeReturnHref,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    storyId,
    storyIds,
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

  let attemptCount = 0;
  const attemptDelays = [0, 80, 200, 420];

  const restore = () => {
    const currentHref = `${window.location.pathname}${window.location.search}`;
    const isReturnPageVisible = currentHref === snapshot.href;
    const isFinalAttempt = attemptCount >= attemptDelays.length - 1;

    if (isReturnPageVisible || isFinalAttempt) {
      window.scrollTo(snapshot.scrollX, snapshot.scrollY);
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

    attemptCount += 1;
    window.setTimeout(restore, attemptDelays[attemptCount]);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(restore);
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
