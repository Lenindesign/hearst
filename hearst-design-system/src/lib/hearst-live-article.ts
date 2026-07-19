import "server-only";

import type { LiveArticleBlock, LiveArticleData } from "@/lib/live-feed-types";

const allowedHosts = new Set([
  "www.caranddriver.com",
  "www.motortrend.com",
  "www.hotrod.com",
  "www.goodhousekeeping.com",
  "www.cosmopolitan.com",
  "www.countryliving.com",
  "www.delish.com",
  "www.housebeautiful.com",
  "www.harpersbazaar.com",
  "www.thepioneerwoman.com",
  "www.prevention.com",
  "www.redbookmag.com",
  "www.seventeen.com",
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
  role?: number;
  image_metadata?: { seo_meta_title?: string; seo_meta_description?: string };
  photographer?: { name?: string };
  source?: { title?: string };
};

type HearstNextData = {
  props?: {
    pageProps?: {
      bodyDom?: HearstDomNode;
      slides?: unknown[];
      data?: { content?: Array<{ media?: HearstMedia[] }> };
    };
  };
};

function normalizeSpace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getNodeText(node: HearstDomNode): string {
  if (node.type === "text") return node.data ?? "";
  return normalizeSpace((node.children ?? []).map(getNodeText).join(" "));
}

function getMediaCredit(media: HearstMedia | undefined) {
  return [media?.photographer?.name, media?.source?.title].filter(Boolean).join(" / ") || undefined;
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
      const caption = normalizeSpace(String(node.attribs?.caption ?? "")) || undefined;
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

function parseNextData(html: string) {
  const match = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match?.[1]) throw new Error("Hearst article payload was not found");
  return JSON.parse(match[1]) as HearstNextData;
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

  const payload = parseNextData(await response.text());
  const pageProps = payload.props?.pageProps;
  const bodyDom = pageProps?.bodyDom;
  const media = pageProps?.data?.content?.[0]?.media ?? [];
  if (!bodyDom) throw new Error("Article body was not found");
  if ((pageProps?.slides?.length ?? 0) > 0) {
    throw new Error("Slide-based article bodies are not supported as complete articles");
  }

  const blocks = buildBlocks(bodyDom, media);
  if (blocks.length === 0) throw new Error("Article body was empty");
  return { blocks, sourceUrl: finalUrl };
}
