export type HearstInternationalRssStory = {
  id: string;
  brand: string;
  title: string;
  url: string;
  description: string;
  publishedAt: string | null;
  imageUrl: string | null;
};

export function parseHearstInternationalRssItems(xml: string, brand: string): HearstInternationalRssStory[] {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match, index) => {
    const item = match[0];
    const title = clean(getTag(item, "title"));
    const url = clean(getTag(item, "link"));
    const description = clean(getTag(item, "description"));
    const publishedAt = getTag(item, "pubDate") || getTag(item, "dc:date") || null;
    const guid = getTag(item, "guid") || url || `${brand}-${index}`;

    return {
      id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}-${hash(guid)}`,
      brand,
      title,
      url,
      description,
      publishedAt,
      imageUrl: getMediaUrl(item) || getImageFromHtml(description),
    };
  }).filter((story) => story.title && story.url);
}

function getTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return decode(match?.[1] ?? "");
}

function getMediaUrl(xml: string) {
  return xml.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
    || xml.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]
    || null;
}

function getImageFromHtml(html: string) {
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || null;
}

function clean(value: string) {
  return decode(value).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function hash(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) result = (result * 31 + value.charCodeAt(index)) | 0;
  return Math.abs(result).toString(36);
}
