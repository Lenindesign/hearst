import type { LifestyleRiverProfile, LifestyleRiverStory } from "@/components/lifestyle-river-types";

export const profileOptionPreviewLimit = 6;
export const profileRecommendationLimit = 6;
const freshStoryAgeHours = 24 * 7;

function getFreshnessSignal(age: number) {
  if (age <= 6) return 18;
  if (age <= 24) return 12;
  if (age <= 72) return 6;
  if (age <= freshStoryAgeHours) return 2;
  return 0;
}

export function rankReaderProfileOptions(
  values: string[],
  stories: LifestyleRiverStory[],
  field: "topic" | "brand",
) {
  const scoreByValue = new Map<string, number>();

  values.forEach((value) => {
    const strongestStorySignals = stories
      .filter((story) => story[field] === value)
      .map((story) => story.popularity + getFreshnessSignal(story.age))
      .sort((a, b) => b - a)
      .slice(0, 3);
    scoreByValue.set(value, strongestStorySignals.reduce((total, score) => total + score, 0));
  });

  return [...values].sort((a, b) => {
    const scoreDifference = (scoreByValue.get(b) ?? 0) - (scoreByValue.get(a) ?? 0);
    return scoreDifference || a.localeCompare(b);
  });
}

function matchesFollowedTopic(story: LifestyleRiverStory, profile: LifestyleRiverProfile) {
  return profile.followedTopics.find(
    (topic) => story.topic === topic || story.topic.startsWith(`${topic} `),
  );
}

export function getReaderProfileRecommendations(
  stories: LifestyleRiverStory[],
  profile: LifestyleRiverProfile,
  limit = profileRecommendationLimit,
) {
  return stories
    .filter((story) =>
      story.age <= freshStoryAgeHours
      && !profile.savedIds.includes(story.id)
      && !profile.hiddenIds.includes(story.id)
    )
    .map((story) => {
      const followedTopic = matchesFollowedTopic(story, profile);
      const followedBrand = profile.followedBrands.includes(story.brand);
      return {
        story,
        score:
          story.popularity
          + getFreshnessSignal(story.age)
          + (followedTopic ? 34 : 0)
          + (followedBrand ? 16 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || a.story.age - b.story.age || a.story.title.localeCompare(b.story.title))
    .slice(0, limit)
    .map(({ story }) => story);
}

export function getReaderProfileRecommendationReason(
  story: LifestyleRiverStory,
  profile: LifestyleRiverProfile,
) {
  if (story.age <= 24) return "New today";
  const followedTopic = matchesFollowedTopic(story, profile);
  if (followedTopic) return `Because you follow ${followedTopic}`;
  if (profile.followedBrands.includes(story.brand)) return `From ${story.brand}, a brand you follow`;
  return "Popular across Hearst";
}
