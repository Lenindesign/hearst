import "server-only";

import type { LiveArticleBlock, LiveArticleData } from "@/lib/live-feed-types";

const allowedHosts = new Set([
  "www.autoweek.com",
  "www.bestproducts.com",
  "www.bicycling.com",
  "www.caranddriver.com",
  "www.cosmopolitan.com",
  "www.countryliving.com",
  "www.delish.com",
  "www.elle.com",
  "www.elledecor.com",
  "www.esquire.com",
  "www.goodhousekeeping.com",
  "www.harpersbazaar.com",
  "www.hotrod.com",
  "www.housebeautiful.com",
  "www.menshealth.com",
  "www.motortrend.com",
  "www.oprahdaily.com",
  "www.popularmechanics.com",
  "www.thepioneerwoman.com",
  "www.prevention.com",
  "www.redbookmag.com",
  "www.roadandtrack.com",
  "www.runnersworld.com",
  "www.seventeen.com",
  "www.townandcountrymag.com",
  "www.veranda.com",
  "www.womenshealthmag.com",
  "www.womansday.com",
]);

type HearstDomNode = {
  type?: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string | boolean>;
  children?: HearstDomNode[];
};

type HearstMedia = {
  id?: string;
  image_id?: string;
  media_id?: string;
  hips_url?: string;
  metadata?: { headline?: string; dek?: string; caption?: string };
  role?: number;
  image_metadata?: { seo_meta_title?: string; seo_meta_description?: string };
  photographer?: { name?: string };
  source?: { title?: string };
};

type HearstNextData = {
  props?: {
    pageProps?: {
      bodyDom?: HearstDomNode;
      dekDom?: HearstDomNode;
      introductoryText?: string;
      introductoryTextDom?: HearstDomNode;
      slides?: HearstMedia[];
      data?: { content?: Array<{ media?: HearstMedia[] }> };
    };
  };
};

function normalizeSpace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getNodeText(node: HearstDomNode): string {
  if (node.type === "text") return htmlToText(node.data ?? "");
  return htmlToText((node.children ?? []).map(getNodeText).join(" "));
}

function getMediaCredit(media: HearstMedia | undefined) {
  return [media?.photographer?.name, media?.source?.title].filter(Boolean).map((value) => htmlToText(String(value))).join(" / ") || undefined;
}

function findMedia(node: HearstDomNode, media: HearstMedia[]) {
  const id = String(node.attribs?.id ?? "");
  const mediaId = String(node.attribs?.mediaid ?? "");
  return media.find((item) =>
    item.id === id
    || item.image_id === id
    || item.media_id === mediaId
    || item.id === mediaId
    || item.image_id === mediaId
  );
}

function buildBlocks(bodyDom: HearstDomNode, media: HearstMedia[]) {
  const blocks: LiveArticleBlock[] = [];

  const visit = (node: HearstDomNode) => {
    const name = node.name?.toLowerCase();
    if (name === "p") {
      const text = getNodeText(node);
      if (text) blocks.push({ type: "paragraph", text });
      return;
    }
    if (["h2", "h3", "h4"].includes(name ?? "")) {
      const text = getNodeText(node);
      if (text) blocks.push({ type: "heading", text });
      return;
    }
    if (name === "blockquote") {
      const text = getNodeText(node);
      if (text) blocks.push({ type: "quote", text });
      return;
    }
    if (name === "ul" || name === "ol") {
      const items = (node.children ?? [])
        .filter((child) => child.name?.toLowerCase() === "li")
        .map(getNodeText)
        .filter(Boolean);
      if (items.length > 0) blocks.push({ type: "list", items });
      return;
    }
    if (name === "image") {
      const image = findMedia(node, media);
      if (!image?.hips_url) return;
      const caption = htmlToText(String(node.attribs?.caption ?? "")) || undefined;
      const alt = image.image_metadata?.seo_meta_description
        || image.image_metadata?.seo_meta_title
        || caption
        || "Editorial image";
      blocks.push({
        type: "image",
        url: image.hips_url,
        alt,
        caption,
        credit: getMediaCredit(image),
      });
      return;
    }

    (node.children ?? []).forEach(visit);
  };

  (bodyDom.children ?? []).forEach(visit);
  return blocks;
}

function pushTextBlock(blocks: LiveArticleBlock[], type: "paragraph" | "heading", value: string | undefined) {
  const text = htmlToText(value ?? "");
  if (
    !text
    || blocks.some((block) => block.type !== "image" && block.type !== "list" && block.text === text)
  ) return;
  blocks.push({ type, text });
}

function buildIntroBlocks(pageProps: NonNullable<HearstNextData["props"]>["pageProps"]) {
  const blocks: LiveArticleBlock[] = [];
  if (!pageProps) return blocks;

  pushTextBlock(blocks, "paragraph", pageProps.dekDom ? getNodeText(pageProps.dekDom) : undefined);
  pushTextBlock(
    blocks,
    "paragraph",
    pageProps.introductoryTextDom ? getNodeText(pageProps.introductoryTextDom) : pageProps.introductoryText
  );

  return blocks;
}

function getMediaAlt(media: HearstMedia, caption?: string) {
  return htmlToText(media.image_metadata?.seo_meta_description ?? "")
    || htmlToText(media.image_metadata?.seo_meta_title ?? "")
    || caption
    || "Editorial image";
}

function buildSlideBlocks(slides: HearstMedia[]) {
  const blocks: LiveArticleBlock[] = [];
  const seenImages = new Set<string>();

  slides.forEach((slide) => {
    if (!slide.hips_url || seenImages.has(slide.hips_url)) return;

    const headline = htmlToText(slide.metadata?.headline ?? "");
    const caption = htmlToText(slide.metadata?.caption ?? "");
    const dek = htmlToText(slide.metadata?.dek ?? "");

    if (headline) blocks.push({ type: "heading", text: headline });
    blocks.push({
      type: "image",
      url: slide.hips_url,
      alt: getMediaAlt(slide, caption || dek || headline),
      caption: caption || dek || undefined,
      credit: getMediaCredit(slide),
    });
    if (dek && dek !== caption) blocks.push({ type: "paragraph", text: dek });
    seenImages.add(slide.hips_url);
  });

  return blocks;
}

function parseNextData(html: string) {
  const match = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match?.[1]) throw new Error("Hearst article payload was not found");
  return JSON.parse(match[1]) as HearstNextData;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“");
}

function htmlToText(value: string) {
  return normalizeSpace(decodeHtmlEntities(value.replace(/<[^>]+>/g, " ")));
}

function getHtmlAttribute(attrs: string, name: string) {
  const match = attrs.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"));
  return match?.[1] ? decodeHtmlEntities(match[1]) : undefined;
}

function getArticleMetaDate(html: string, keys: string[]) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const key = getHtmlAttribute(tag, "property")
      ?? getHtmlAttribute(tag, "name")
      ?? getHtmlAttribute(tag, "itemprop");
    if (!key || !keys.includes(key.toLowerCase())) continue;

    const value = getHtmlAttribute(tag, "content");
    const timestamp = Date.parse(value ?? "");
    if (Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
  }

  return undefined;
}

function getArticleMetaText(html: string, keys: string[]) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const key = getHtmlAttribute(tag, "property")
      ?? getHtmlAttribute(tag, "name")
      ?? getHtmlAttribute(tag, "itemprop");
    if (!key || !keys.includes(key.toLowerCase())) continue;

    const value = htmlToText(getHtmlAttribute(tag, "content") ?? "");
    if (value) return value;
  }

  return undefined;
}

function getArticleJsonLdDate(html: string, keys: string[]) {
  const normalizedKeys = new Set(keys.map((key) => key.toLowerCase()));
  const scripts = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];

  const findDate = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
      for (const item of value) {
        const date = findDate(item);
        if (date) return date;
      }
      return undefined;
    }

    if (!value || typeof value !== "object") return undefined;

    for (const [key, candidate] of Object.entries(value)) {
      if (normalizedKeys.has(key.toLowerCase()) && typeof candidate === "string") {
        const timestamp = Date.parse(candidate);
        if (Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
      }
    }

    for (const candidate of Object.values(value)) {
      const date = findDate(candidate);
      if (date) return date;
    }

    return undefined;
  };

  for (const script of scripts) {
    const payload = script
      .replace(/^<script\b[^>]*>/i, "")
      .replace(/<\/script>$/i, "")
      .trim();
    if (!payload) continue;

    try {
      const date = findDate(JSON.parse(payload));
      if (date) return date;
    } catch {
      // Ignore malformed third-party structured data and continue to the next block.
    }
  }

  return undefined;
}

function getArticleDate(html: string, metaKeys: string[], jsonLdKeys: string[]) {
  return getArticleMetaDate(html, metaKeys) ?? getArticleJsonLdDate(html, jsonLdKeys);
}

function getArticleJsonLdAuthor(html: string) {
  const scripts = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];

  const findAuthor = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
      for (const item of value) {
        const author = findAuthor(item);
        if (author) return author;
      }
      return undefined;
    }

    if (!value || typeof value !== "object") return undefined;

    const entries = Object.entries(value);
    for (const [key, candidate] of entries) {
      if (key.toLowerCase() !== "author") continue;
      if (typeof candidate === "string") return htmlToText(candidate);
      const namedAuthor = findJsonLdName(candidate);
      if (namedAuthor) return namedAuthor;
    }

    for (const candidate of Object.values(value)) {
      const author = findAuthor(candidate);
      if (author) return author;
    }

    return undefined;
  };

  for (const script of scripts) {
    const payload = script
      .replace(/^<script\b[^>]*>/i, "")
      .replace(/<\/script>$/i, "")
      .trim();
    if (!payload) continue;

    try {
      const author = findAuthor(JSON.parse(payload));
      if (author) return author;
    } catch {
      // Ignore malformed third-party structured data and continue to the next block.
    }
  }

  return undefined;
}

function findJsonLdName(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return value.map(findJsonLdName).filter(Boolean).join(", ") || undefined;
  }

  if (!value || typeof value !== "object") return undefined;

  const name = Object.entries(value).find(([key]) => key.toLowerCase() === "name")?.[1];
  return typeof name === "string" ? htmlToText(name) : undefined;
}

function getArticleByline(html: string) {
  return getArticleMetaText(html, [
    "author",
    "article:author",
    "parsely-author",
    "sailthru.author",
  ]) ?? getArticleJsonLdAuthor(html);
}

function getImageUrlFromAttrs(attrs: string) {
  const source = getHtmlAttribute(attrs, "src")
    ?? getHtmlAttribute(attrs, "data-src")
    ?? getHtmlAttribute(attrs, "srcset")
    ?? getHtmlAttribute(attrs, "srcSet")
    ?? getHtmlAttribute(attrs, "imageSrcSet");
  if (!source) return undefined;

  return source.split(",")[0]?.trim().split(/\s+/)[0];
}

function shouldKeepFallbackText(text: string) {
  if (text.length < 12) return false;
  if (/^save$/i.test(text)) return false;
  if (/^see all \d+ photos\d*$/i.test(text)) return false;
  if (/^\d+:\d+\s*\/\s*\d+:\d+$/.test(text)) return false;
  return true;
}

function getReadableArticleHtml(html: string) {
  const readableIndex = html.indexOf("data-nitrous-content-readable=\"true\"");
  if (readableIndex < 0) return "";

  const articleHtml = html.slice(readableIndex);
  const endCandidates = [
    articleHtml.indexOf("data-ids=\"LayoutGridRail\""),
    articleHtml.indexOf("<footer"),
    articleHtml.indexOf("</main>"),
  ].filter((index) => index > 0);
  const endIndex = endCandidates.length > 0 ? Math.min(...endCandidates) : Math.min(articleHtml.length, 80_000);
  return articleHtml.slice(0, endIndex);
}

function buildReadableHtmlBlocks(html: string) {
  const articleHtml = getReadableArticleHtml(html);
  if (!articleHtml) return [];

  const blocks: LiveArticleBlock[] = [];
  const seenImages = new Set<string>();
  const tagPattern = /<(?:(p|h2|h3|h4)\b[^>]*>([\s\S]*?)<\/\1>|img\b([^>]*)>)/gi;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(articleHtml))) {
    const [, tagName, content, imageAttrs] = match;
    if (tagName) {
      const text = htmlToText(content);
      if (!shouldKeepFallbackText(text)) continue;
      blocks.push({
        type: tagName === "p" ? "paragraph" : "heading",
        text,
      });
      continue;
    }

    if (imageAttrs) {
      const url = getImageUrlFromAttrs(imageAttrs);
      if (!url || seenImages.has(url)) continue;
      blocks.push({
        type: "image",
        url,
        alt: htmlToText(getHtmlAttribute(imageAttrs, "alt") ?? "") || "Editorial image",
      });
      seenImages.add(url);
    }
  }

  return blocks;
}

export function isAllowedHearstArticleUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedHosts.has(url.hostname);
  } catch {
    return false;
  }
}

export async function getHearstLiveArticle(sourceUrl: string): Promise<LiveArticleData> {
  if (!isAllowedHearstArticleUrl(sourceUrl)) throw new Error("Unsupported article URL");

  const response = await fetch(sourceUrl, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "Mozilla/5.0 (compatible; HearstLiveFeedPrototype/1.0)",
    },
    next: { revalidate: 300 },
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Article source returned ${response.status}`);

  const finalUrl = response.url || sourceUrl;
  if (!isAllowedHearstArticleUrl(finalUrl)) throw new Error("Article redirected to an unsupported host");

  const html = await response.text();
  let blocks: LiveArticleBlock[] = [];

  try {
    const payload = parseNextData(html);
    const pageProps = payload.props?.pageProps;
    const bodyDom = pageProps?.bodyDom;
    const media = pageProps?.data?.content?.[0]?.media ?? [];
    const slides = pageProps?.slides ?? [];

    blocks = [
      ...(!bodyDom && slides.length > 0 ? buildIntroBlocks(pageProps) : []),
      ...(bodyDom ? buildBlocks(bodyDom, media) : []),
      ...buildSlideBlocks(slides),
    ];
  } catch {
    blocks = buildReadableHtmlBlocks(html);
  }

  if (blocks.length === 0) throw new Error("Article body was empty");
  return {
    blocks,
    sourceUrl: finalUrl,
    byline: getArticleByline(html),
    publishedAt: getArticleDate(html, [
      "article:published_time",
      "datepublished",
      "parsely-pub-date",
      "sailthru.date",
    ], ["datePublished"]),
    updatedAt: getArticleDate(html, [
      "article:modified_time",
      "datemodified",
      "last-modified",
      "lastmod",
    ], ["dateModified"]),
  };
}
