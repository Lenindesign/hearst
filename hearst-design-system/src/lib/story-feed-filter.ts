import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandSection } from "@/lib/hearst-routes";

export function storyMatchesLifestyleFilter(
  story: LifestyleRiverStory,
  filter: string,
) {
  if (filter === "For You" || filter === "Saved") return true;
  if (filter === "Videos") return Boolean(story.videoUrl);

  if (story.brandSlug === "car-and-driver") {
    if (filter === "Shop New Cars") {
      return story.topic === "EVs" || /\b20(?:26|27|28|29)\b/.test(story.title);
    }
    if (filter === "Shop Used Cars") {
      return /\b(?:19\d{2}|20(?:0\d|1\d|2[0-5]))\b/.test(story.title);
    }
    if (filter === "Research Cars") return true;
  }

  if (filter === "Lifestyle") return getHearstBrandSection(story.brandSlug) === "lifestyle";
  if (filter === "Autos") return getHearstBrandSection(story.brandSlug) === "autos";
  if (filter === "Cars") return getHearstBrandSection(story.brandSlug) === "autos";
  if (filter === "Fashion & Luxury") return getHearstBrandSection(story.brandSlug) === "flux";
  if (filter === "Enthusiast & Wellness") return getHearstBrandSection(story.brandSlug) === "ew";

  return story.topic === filter || story.topic.startsWith(`${filter} `);
}
