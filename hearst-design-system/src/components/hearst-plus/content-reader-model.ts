import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { ReaderArticleLoadState } from "./reader-article-body";
import {
  getLifestyleCardKind,
  type LifestyleCardKind,
} from "./story-presentation-model";

export type LifestyleStoryComment = {
  id: string;
  author: string;
  role: string;
  body: string;
  age: string;
  likes: number;
};

export type LifestyleReaderContext = {
  sameTopic: LifestyleRiverStory[];
  sameBrand: LifestyleRiverStory[];
  sharedIntent: LifestyleRiverStory[];
  intentTags: string[];
};

export function getReadyLiveArticle(
  liveArticle?: ReaderArticleLoadState,
) {
  return liveArticle?.status === "ready" ? liveArticle.data : undefined;
}

export function getLifestyleCommentCount(
  story: LifestyleRiverStory,
  addedCount = 0,
) {
  return Math.max(
    3,
    Math.round(story.popularity / 7) + (story.age % 9) + addedCount,
  );
}

export function getLifestyleSeedComments(
  story: LifestyleRiverStory,
): LifestyleStoryComment[] {
  const kind = getLifestyleCardKind(story);
  const topic = story.topic.toLowerCase();
  const tag = story.tags[0] ?? topic;
  const authors = [
    ["Maya Chen", "saved this"],
    ["Jordan Ellis", "follows this topic"],
    ["Priya Shah", "regular reader"],
    ["Andre Miles", "collection builder"],
    ["Nora Patel", "morning reader"],
  ] as const;
  const offset = story.title.length % authors.length;
  const templates: Record<LifestyleCardKind, string[]> = {
    article: [
      `This is the kind of ${topic} context I want in the morning brief.`,
      "Helpful framing. I would read a follow-up with the practical next steps.",
      `The ${story.brand} angle is why this feels worth saving instead of skimming.`,
    ],
    gallery: [
      "The image selection is doing a lot of the work here. Saving this for reference.",
      `This belongs in a collection. I want more visual examples around ${tag}.`,
      "Good inspiration piece, especially if the next story keeps the same mood.",
    ],
    recipe: [
      "I would make this if the prep list stays simple.",
      `The ${topic} signal is right. I want the shopping list next to the recipe.`,
      "Saving this for the weekend. The short read time helps.",
    ],
    shopping: [
      "Useful if the picks stay edited down. I do not need a giant list.",
      "I would compare this with a tested option before buying.",
      "The brand attribution helps here. I want to know who chose the picks.",
    ],
    video: [
      "This is a good quick-watch candidate before opening the full story.",
      "I would keep this in the queue if the clip starts with the main point.",
      "The topic match is strong, but I still want a written recap below it.",
    ],
  };

  return templates[kind].map((body, index) => {
    const [author, role] = authors[(offset + index) % authors.length];
    return {
      id: `${story.id}-seed-comment-${index}`,
      author,
      role,
      body,
      age: `${index + 1}h ago`,
      likes: 2 + ((story.popularity + story.age + index) % 18),
    };
  });
}

export function getLifestyleContextStories(
  currentStory: LifestyleRiverStory,
  stories: LifestyleRiverStory[],
): LifestyleReaderContext {
  const otherStories = stories.filter(
    (story) => story.id !== currentStory.id,
  );
  const claimedStoryIds = new Set<string>();
  const takeDistinctStories = (candidates: LifestyleRiverStory[]) => {
    const selected = candidates
      .filter((story) => !claimedStoryIds.has(story.id))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);

    selected.forEach((story) => claimedStoryIds.add(story.id));
    return selected;
  };
  const sharedIntent = takeDistinctStories(
    otherStories.filter((story) =>
      story.tags.some((tag) => currentStory.tags.includes(tag)),
    ),
  );
  const sameBrand = takeDistinctStories(
    otherStories.filter((story) => story.brand === currentStory.brand),
  );
  const sameTopic = takeDistinctStories(
    otherStories.filter((story) => story.topic === currentStory.topic),
  );

  return {
    sameTopic,
    sameBrand,
    sharedIntent,
    intentTags: currentStory.tags.slice(0, 4),
  };
}

export function scoreLifestyleRelatedStory(
  currentStory: LifestyleRiverStory,
  story: LifestyleRiverStory,
) {
  const sharedTagCount = story.tags.filter((tag) =>
    currentStory.tags.includes(tag),
  ).length;
  const sameTopicScore = story.topic === currentStory.topic ? 80 : 0;
  const sameBrandScore = story.brand === currentStory.brand ? 34 : 0;
  const sharedTagScore = sharedTagCount * 14;
  const signalScore = story.signal === currentStory.signal ? 6 : 0;
  const popularityScore = Math.round(story.popularity / 8);
  const freshnessScore = Math.max(0, 10 - story.age);

  return (
    sameTopicScore
    + sameBrandScore
    + sharedTagScore
    + signalScore
    + popularityScore
    + freshnessScore
  );
}

export function getLifestyleArticleRecommendations(
  currentStory: LifestyleRiverStory,
  stories: LifestyleRiverStory[],
) {
  const otherStories = stories.filter(
    (story) => story.id !== currentStory.id,
  );
  const exactTopicStories = otherStories
    .filter((story) => story.topic === currentStory.topic)
    .sort(
      (a, b) =>
        scoreLifestyleRelatedStory(currentStory, b)
        - scoreLifestyleRelatedStory(currentStory, a),
    );
  const scoredStories = otherStories
    .map((story) => ({
      story,
      score: scoreLifestyleRelatedStory(currentStory, story),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ story }) => story);

  return [...exactTopicStories, ...scoredStories]
    .filter(
      (story, index, array) =>
        array.findIndex((candidate) => candidate.id === story.id) === index,
    )
    .slice(0, 4);
}
