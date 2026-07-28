import assert from "node:assert/strict";
import test from "node:test";

import type { LiveArticleData } from "@/lib/live-feed-types";
import {
  clearLiveArticleClientCache,
  getCanonicalLiveArticleUrl,
  getLiveArticleClientCacheStats,
  loadLiveArticle,
  primeLiveArticleClientCache,
  type LiveArticleFetcher,
} from "./live-article-client-cache";

function createArticle(sourceUrl: string): LiveArticleData {
  return {
    sourceUrl,
    blocks: [{ type: "paragraph", text: "Complete article body." }],
  };
}

function createResponse(article: LiveArticleData) {
  return {
    ok: true,
    status: 200,
    json: async () => article,
  };
}

test.beforeEach(() => {
  clearLiveArticleClientCache();
});

test("normalizes fragments and query-parameter order without changing article identity", () => {
  assert.equal(
    getCanonicalLiveArticleUrl("https://Example.com/story/?b=2&a=1#gallery"),
    "https://example.com/story/?a=1&b=2"
  );
});

test("shares one in-flight request and reuses the resolved article", async () => {
  const sourceUrl = "https://www.example.com/story/";
  const article = createArticle(sourceUrl);
  let requestCount = 0;
  const fetcher: LiveArticleFetcher = async () => {
    requestCount += 1;
    return createResponse(article);
  };

  const [previewArticle, readerArticle] = await Promise.all([
    loadLiveArticle(`${sourceUrl}#gallery`, fetcher),
    loadLiveArticle(sourceUrl, fetcher),
  ]);
  const cachedArticle = await loadLiveArticle(sourceUrl, fetcher);

  assert.equal(requestCount, 1);
  assert.equal(previewArticle, readerArticle);
  assert.equal(readerArticle, cachedArticle);
});

test("does not cache failed requests so a later consumer can retry", async () => {
  const sourceUrl = "https://www.example.com/retry/";
  const article = createArticle(sourceUrl);
  let requestCount = 0;
  const fetcher: LiveArticleFetcher = async () => {
    requestCount += 1;
    return requestCount === 1
      ? { ok: false, status: 502, json: async () => ({}) }
      : createResponse(article);
  };

  await assert.rejects(() => loadLiveArticle(sourceUrl, fetcher), /502/);
  const retriedArticle = await loadLiveArticle(sourceUrl, fetcher);

  assert.equal(requestCount, 2);
  assert.equal(retriedArticle, article);
});

test("can prime a deterministic article before a reader opens", async () => {
  const sourceUrl = "https://www.example.com/preview/?b=2&a=1";
  const article = createArticle(sourceUrl);
  let requestCount = 0;

  primeLiveArticleClientCache(`${sourceUrl}#story`, article);
  const resolvedArticle = await loadLiveArticle(
    "https://www.example.com/preview/?a=1&b=2",
    async () => {
      requestCount += 1;
      return createResponse(article);
    },
  );

  assert.equal(requestCount, 0);
  assert.equal(resolvedArticle, article);
});

test("bounds resolved article memory with least-recently-used eviction", async () => {
  const fetcher: LiveArticleFetcher = async (input) => {
    const sourceUrl = new URL(input, "https://hearst.local").searchParams.get("url") ?? "";
    return createResponse(createArticle(sourceUrl));
  };
  const maximumResolvedArticles = getLiveArticleClientCacheStats().maximumResolvedArticles;

  for (let index = 0; index < maximumResolvedArticles + 3; index += 1) {
    await loadLiveArticle(`https://www.example.com/story-${index}/`, fetcher);
  }

  assert.deepEqual(getLiveArticleClientCacheStats(), {
    activeRequests: 0,
    resolvedArticles: maximumResolvedArticles,
    maximumResolvedArticles,
  });
});
