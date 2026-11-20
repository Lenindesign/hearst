import type { LifestyleRiverProfile, LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { isCurrentFeedStory } from "@/lib/home-page-feed-model";
import {
  baseDestinationConfigs,
  getLifestyleScore,
  type LifestyleDemoState,
} from "@/lib/hearst-personalization-model";

/**
 * Story selection shared by the Hearst+ home (`home-page.tsx`) and the River
 * logic spec chapter (`/specs/#river`), so the spec runs the production code.
 *
 * `getPersonalizedLeadSliderStories` picks the lead slider (Today's Picks on
 * the Hearst+ For You view): stories sorted by personalization score, one per
 * publication first, then any. In blend mode it keeps two slots for the
 * current feed: one article and one video.
 */
/** Today's Picks only considers stories published in the last 72 hours. */
export const TODAYS_PICKS_FRESHNESS_WINDOW_HOURS = 72;

export function getPersonalizedLeadSliderStories(
  stories: LifestyleRiverStory[],
  profile: LifestyleRiverProfile,
  demoState: LifestyleDemoState,
  config = baseDestinationConfigs.lifestyle,
  count = 5,
  includeCurrentFeed = false
) {
  const selected: LifestyleRiverStory[] = [];
  const usedBrands = new Set<string>();
  const personalizedStories = stories
    .filter((story) => !/\.(?:mov|mp4|m4v|webm)$/i.test(story.title.trim()))
    .map((story, index) => ({
      story,
      index,
      score: getLifestyleScore(story, profile, demoState, config),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ story }) => story);
  const editorialStories = personalizedStories.filter((story) => !isCurrentFeedStory(story));
  const currentArticleStories = personalizedStories.filter((story) => isCurrentFeedStory(story) && !story.videoUrl);
  const currentVideoStories = personalizedStories.filter((story) => isCurrentFeedStory(story) && Boolean(story.videoUrl));

  const addStories = (candidates: LifestyleRiverStory[]) => {
    for (const story of candidates) {
      if (usedBrands.has(story.brandSlug)) continue;
      selected.push(story);
      usedBrands.add(story.brandSlug);
      if (selected.length === count) return true;
    }

    for (const story of candidates) {
      if (selected.some((item) => item.id === story.id)) continue;
      selected.push(story);
      if (selected.length === count) return true;
    }

    return false;
  };

  if (!includeCurrentFeed) {
    if (addStories(editorialStories.filter((story) => !story.videoUrl))) return selected;
    addStories(currentArticleStories);
    return selected;
  }

  addStories(editorialStories.slice(0, Math.max(0, count - 2)));
  if (selected.length < count) addStories(currentArticleStories.slice(0, 1));
  if (selected.length < count) addStories(currentVideoStories.slice(0, 1));
  if (selected.length < count) {
    addStories([...currentArticleStories, ...currentVideoStories, ...editorialStories]);
  }

  return selected;
}
