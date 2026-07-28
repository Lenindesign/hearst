export function getSettledShortIndex(
  scrollTop: number,
  itemHeight: number,
  storyCount: number,
) {
  if (storyCount <= 0) return -1;

  return Math.max(
    0,
    Math.min(storyCount - 1, Math.round(scrollTop / Math.max(itemHeight, 1))),
  );
}

export function getShortPreloadIndexes(activeIndex: number, storyCount: number) {
  if (activeIndex < 0 || storyCount <= 0) return [];

  const indexes: number[] = [];
  for (
    let index = Math.max(0, activeIndex - 1);
    index <= Math.min(storyCount - 1, activeIndex + 1);
    index += 1
  ) {
    indexes.push(index);
  }
  return indexes;
}

export function getShortScrollBehavior(prefersReducedMotion: boolean): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}

export function shouldAutoplayActivatedShort({
  muted,
  playingRequested,
  storyChanged,
}: {
  muted: boolean;
  playingRequested: boolean;
  storyChanged: boolean;
}) {
  return playingRequested && (!storyChanged || muted);
}

export function isActiveShortEvent(eventStoryId: string, activeStoryId: string | null) {
  return eventStoryId === activeStoryId;
}
