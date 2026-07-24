export type StoryModuleCandidate = {
  id: string;
  brand: string;
  popularity: number;
  tags: string[];
};

export type TodayEditStorySelection<T extends StoryModuleCandidate> = {
  continueStory?: T;
  followedBrandStory?: T;
  trendingStory?: T;
  collectionStory?: T;
};

export type StoryModuleAllocation<T extends StoryModuleCandidate> = {
  todayEdit: TodayEditStorySelection<T>;
  dailyHabitStories: T[];
  trendingStories: T[];
  riverStories: T[];
};

type StoryModuleAllocationOptions<T extends StoryModuleCandidate> = {
  stories: T[];
  heroStoryIds: Iterable<string>;
  continueStoryIds: string[];
  followedBrands: string[];
  savedTags: string[];
  dailyHabitCount?: number;
  trendingCount?: number;
  minimumRiverStories?: number;
};

export function allocateStoryModules<T extends StoryModuleCandidate>({
  stories,
  heroStoryIds,
  continueStoryIds,
  followedBrands,
  savedTags,
  dailyHabitCount = 3,
  trendingCount = 5,
  minimumRiverStories = 4,
}: StoryModuleAllocationOptions<T>): StoryModuleAllocation<T> {
  const usedStoryIds = new Set(heroStoryIds);
  const storiesById = new Map(stories.map((story) => [story.id, story]));
  const unusedStoryCount = () => stories.reduce(
    (count, story) => count + (usedStoryIds.has(story.id) ? 0 : 1),
    0
  );

  const takeUnused = (candidates: T[], preserveRiver = true) => {
    if (preserveRiver && unusedStoryCount() <= minimumRiverStories) return undefined;
    const story = candidates.find((candidate) => !usedStoryIds.has(candidate.id));
    if (story) usedStoryIds.add(story.id);
    return story;
  };

  const continueCandidates = continueStoryIds
    .map((storyId) => storiesById.get(storyId))
    .filter((story): story is T => Boolean(story));
  const continueStory = takeUnused(continueCandidates, false) ?? continueCandidates[0];
  const followedBrandStory = takeUnused([
    ...stories.filter((story) => followedBrands.includes(story.brand)),
    ...stories,
  ]);
  const popularityOrder = [...stories].sort(
    (first, second) => second.popularity - first.popularity
  );
  const trendingStory = takeUnused(popularityOrder);
  const collectionStory = takeUnused([
    ...stories.filter((story) => story.tags.some((tag) => savedTags.includes(tag))),
    ...stories,
  ]);

  const dailyHabitStories: T[] = [];
  for (const story of stories) {
    if (dailyHabitStories.length >= dailyHabitCount) break;
    if (unusedStoryCount() <= minimumRiverStories) break;
    if (usedStoryIds.has(story.id)) continue;
    usedStoryIds.add(story.id);
    dailyHabitStories.push(story);
  }

  const trendingStories: T[] = [];
  const trendingBrands = new Set<string>();
  const addTrendingStory = (story: T) => {
    if (
      trendingStories.length >= trendingCount
      || unusedStoryCount() <= minimumRiverStories
      || usedStoryIds.has(story.id)
    ) return;
    usedStoryIds.add(story.id);
    trendingBrands.add(story.brand);
    trendingStories.push(story);
  };

  for (const story of popularityOrder) {
    if (!trendingBrands.has(story.brand)) addTrendingStory(story);
  }
  popularityOrder.forEach(addTrendingStory);

  return {
    todayEdit: {
      continueStory,
      followedBrandStory,
      trendingStory,
      collectionStory,
    },
    dailyHabitStories,
    trendingStories,
    riverStories: stories.filter((story) => !usedStoryIds.has(story.id)),
  };
}
