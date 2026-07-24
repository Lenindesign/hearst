import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

const wordPattern = /[\p{L}\p{N}]+/gu;

export function normalizeStorySearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[\u2018\u2019]/g, "'")
    .toLocaleLowerCase()
    .trim();
}

export function tokenizeStorySearchText(value: string) {
  return normalizeStorySearchText(value).match(wordPattern) ?? [];
}

function scoreField(
  fieldValue: string,
  query: string,
  queryTokens: string[],
  exactScore: number,
  tokenScore: number
) {
  const normalizedField = normalizeStorySearchText(fieldValue);
  if (!normalizedField) return 0;
  if (normalizedField === query) return exactScore;

  const fieldTokens = tokenizeStorySearchText(normalizedField);
  const supportsPrefix = queryTokens.every((token) => token.length >= 5);
  const tokenMatches = queryTokens.every((queryToken) =>
    fieldTokens.some((fieldToken) =>
      fieldToken === queryToken
      || (supportsPrefix && fieldToken.startsWith(queryToken))
    )
  );

  return tokenMatches ? tokenScore : 0;
}

export function searchLifestyleStories(
  stories: LifestyleRiverStory[],
  query: string,
  limit = 8
) {
  const normalizedQuery = normalizeStorySearchText(query);
  if (!normalizedQuery) {
    return [...stories]
      .sort((left, right) =>
        right.popularity - left.popularity
        || left.title.localeCompare(right.title)
      )
      .slice(0, Math.min(limit, 6));
  }

  const queryTokens = tokenizeStorySearchText(normalizedQuery);
  if (queryTokens.length === 0) return [];

  return stories
    .map((story) => {
      const score = Math.max(
        scoreField(story.title, normalizedQuery, queryTokens, 1_000, 800),
        scoreField(story.brand, normalizedQuery, queryTokens, 700, 600),
        scoreField(story.topic, normalizedQuery, queryTokens, 500, 400),
        ...story.tags.map((tag) =>
          scoreField(tag, normalizedQuery, queryTokens, 300, 200)
        )
      );
      return { score, story };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) =>
      right.score - left.score
      || right.story.popularity - left.story.popularity
      || left.story.title.localeCompare(right.story.title)
    )
    .slice(0, limit)
    .map(({ story }) => story);
}
