export type StoryModuleCandidate = {
  id: string;
  brand: string;
  popularity: number;
  tags: string[];
  title?: string;
};

export type TodayEditStorySelection<T extends StoryModuleCandidate> = {
  continueStory?: T;
  followedBrandStory?: T;
  trendingStory?: T;
  horoscopeStory?: T;
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
  includeTodayEdit?: boolean;
  dailyHabitCount?: number;
  trendingCount?: number;
  minimumRiverStories?: number;
};

export function allocateStoryModules<T extends StoryModuleCandidate>({
  stories,
  heroStoryIds,
  continueStoryIds,
  followedBrands,
  includeTodayEdit = true,
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

  const continueCandidates = includeTodayEdit
    ? continueStoryIds
      .map((storyId) => storiesById.get(storyId))
      .filter((story): story is T => Boolean(story))
    : [];
  const continueStory = includeTodayEdit
    ? continueCandidates.find((candidate) => !usedStoryIds.has(candidate.id)) ?? continueCandidates[0]
    : undefined;
  const horoscopeStory = includeTodayEdit
    ? takeUnused(stories.filter((story) => {
        const searchableText = [story.title, ...story.tags].filter(Boolean).join(" ").toLowerCase();
        return searchableText.includes("horoscope") || searchableText.includes("zodiac");
      }))
    : undefined;
  const followedBrandStory = includeTodayEdit
    ? takeUnused([
        ...stories.filter((story) => followedBrands.includes(story.brand)),
        ...stories,
      ])
    : undefined;
  const popularityOrder = [...stories].sort(
    (first, second) => second.popularity - first.popularity
  );
  const trendingStory = includeTodayEdit ? takeUnused(popularityOrder) : undefined;

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
      horoscopeStory,
    },
    dailyHabitStories,
    trendingStories,
    riverStories: stories.filter((story) => !usedStoryIds.has(story.id)),
  };
}
