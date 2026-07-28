import type { LiveArticleData } from "@/lib/live-feed-types";

type LiveArticleResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

export type LiveArticleFetcher = (input: string) => Promise<LiveArticleResponse>;

const maximumResolvedArticles = 32;
const resolvedArticles = new Map<string, LiveArticleData>();
const activeArticleRequests = new Map<string, Promise<LiveArticleData>>();

export function getCanonicalLiveArticleUrl(sourceUrl: string) {
  const url = new URL(sourceUrl);
  url.hash = "";
  url.searchParams.sort();
  return url.toString();
}

function getResolvedArticle(cacheKey: string) {
  const article = resolvedArticles.get(cacheKey);
  if (!article) return undefined;

  resolvedArticles.delete(cacheKey);
  resolvedArticles.set(cacheKey, article);
  return article;
}

function cacheResolvedArticle(cacheKey: string, article: LiveArticleData) {
  resolvedArticles.delete(cacheKey);
  resolvedArticles.set(cacheKey, article);

  while (resolvedArticles.size > maximumResolvedArticles) {
    const oldestCacheKey = resolvedArticles.keys().next().value;
    if (!oldestCacheKey) return;
    resolvedArticles.delete(oldestCacheKey);
  }
}

export function loadLiveArticle(
  sourceUrl: string,
  fetcher: LiveArticleFetcher = fetch
) {
  const cacheKey = getCanonicalLiveArticleUrl(sourceUrl);
  const cachedArticle = getResolvedArticle(cacheKey);
  if (cachedArticle) return Promise.resolve(cachedArticle);

  const activeRequest = activeArticleRequests.get(cacheKey);
  if (activeRequest) return activeRequest;

  const request = Promise.resolve()
    .then(() => fetcher(`/api/live-article/?url=${encodeURIComponent(cacheKey)}`))
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Article request failed with ${response.status}`);
      }

      const article = await response.json() as LiveArticleData;
      cacheResolvedArticle(cacheKey, article);
      return article;
    })
    .finally(() => {
      activeArticleRequests.delete(cacheKey);
    });

  activeArticleRequests.set(cacheKey, request);
  return request;
}

export function primeLiveArticleClientCache(
  sourceUrl: string,
  article: LiveArticleData,
) {
  cacheResolvedArticle(getCanonicalLiveArticleUrl(sourceUrl), article);
}

export function clearLiveArticleClientCache() {
  resolvedArticles.clear();
  activeArticleRequests.clear();
}

export function getLiveArticleClientCacheStats() {
  return {
    activeRequests: activeArticleRequests.size,
    resolvedArticles: resolvedArticles.size,
    maximumResolvedArticles,
  };
}
