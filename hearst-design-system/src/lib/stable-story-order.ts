export interface StableStoryOrderState {
  scopeKey: string;
  storyIds: string[];
}

export function mergeStableStoryOrder(
  current: StableStoryOrderState,
  scopeKey: string,
  candidateStoryIds: string[]
): StableStoryOrderState {
  if (current.scopeKey !== scopeKey) {
    return { scopeKey, storyIds: candidateStoryIds };
  }

  const retainedStoryIds = new Set(current.storyIds);
  const appendedStoryIds = candidateStoryIds.filter((storyId) => !retainedStoryIds.has(storyId));

  return appendedStoryIds.length === 0
    ? current
    : { scopeKey, storyIds: [...current.storyIds, ...appendedStoryIds] };
}
