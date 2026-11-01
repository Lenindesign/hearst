import "server-only";

export type VehicleDataField = { label: string; value: string };
export type VehicleDataSection = { heading: string; fields: VehicleDataField[] };
export type VehicleDataImage = { src: string; alt: string };

export type HearstAutoVehicleDetails = {
  title: string;
  sourceUrl: string;
  rating?: string;
  overview?: string;
  fields: VehicleDataField[];
  images: VehicleDataImage[];
  testedConfiguration?: {
    title: string;
    sections: VehicleDataSection[];
  };
};

const sourceHost = "www.caranddriver.com";
const reservedSections = new Set([
  "cars-for-sale", "compare", "features", "news", "reviews", "photos",
  "rankings", "shopping", "videos", "search", "subscribe", "author",
]);

function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&rsquo;/gi, "’")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rdquo;/gi, "”")
    .replace(/&ldquo;/gi, "“");
}

function htmlToText(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function pageText(html: string) {
  const decoded = decodeHtml(
    html
      .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<(?:br|\/p|\/li|\/h[1-6]|\/div|\/section|\/article|\/tr|\/td|\/th)\b[^>]*>/gi, "\n")
      .replace(/<[^>]*>/g, " "),
  ).replace(/<svg\b[\s\S]*?<\/svg>/gi, " ");
  return decoded
    .replace(/[\t\f\v ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function canonicalSourceUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== sourceHost) return null;
  url.hash = "";
  url.search = "";
  return url;
}

function isModelPageUrl(value: string) {
  const url = canonicalSourceUrl(value);
  if (!url) return false;
  const parts = url.pathname.split("/").filter(Boolean);
  return parts.length === 2 && !reservedSections.has(parts[0].toLowerCase());
}

function titleIdentity(title: string) {
  const match = title.match(/\b((?:19|20)\d{2})\s+(.+)/);
  if (!match) return null;
  const text = match[2]
    .split(/\s+(?:review|tested|first drive|drive:|is|brings|adds|has|could|might|gets|offers|arrives|returns|revealed|unveiled|will)\b/i)[0]
    .replace(/[.,:;!?].*$/, "")
    .trim();
  const words: string[] = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return words.length >= 2 ? { year: match[1], words } : null;
}

function readModelLink(articleHtml: string, storyTitle: string) {
  const identity = titleIdentity(storyTitle);
  if (!identity) return null;
  const candidates: Array<{ url: string; score: number }> = [];
  const linkPattern = /<a\b([^>]*?)href\s*=\s*(["'])([^"']+)\2([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(articleHtml))) {
    const href = decodeHtml(match[3]);
    let url: URL;
    try {
      url = new URL(href, `https://${sourceHost}`);
    } catch {
      continue;
    }
    if (url.hostname !== sourceHost || !isModelPageUrl(url.toString())) continue;
    const [make, model] = url.pathname.split("/").filter(Boolean);
    const pathWords = `${make} ${model}`.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const anchorWords = htmlToText(match[5]).toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const candidateWords = Array.from(new Set([...pathWords, ...anchorWords]));
    const matches = identity.words.filter((word) => candidateWords.includes(word));
    const pathMatches = pathWords.filter((word) => identity.words.includes(word));
    if (matches.length < 2 || pathMatches.length < 2) continue;
    const score = pathMatches.length * 10 + matches.length;
    candidates.push({ url: url.toString(), score });
  }

  const uniqueCandidates = Array.from(
    new Map(candidates.map((candidate) => [candidate.url, candidate])).values(),
  ).sort((a, b) => b.score - a.score);
  if (!uniqueCandidates.length) return null;
  if (uniqueCandidates[1]?.score === uniqueCandidates[0].score) return null;
  return canonicalSourceUrl(uniqueCandidates[0].url)?.toString() ?? null;
}

async function fetchCarAndDriverPage(url: string) {
  let currentUrl = url;
  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    const safeUrl = canonicalSourceUrl(currentUrl);
    if (!safeUrl) throw new Error("Car and Driver redirected to an unsupported URL");
    const response = await fetch(safeUrl.toString(), {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0 (compatible; HearstVehicleDetailsPrototype/1.0)",
      },
      next: { revalidate: 21_600 },
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location || redirectCount === 3) throw new Error("Car and Driver redirected too many times");
      currentUrl = new URL(location, safeUrl).toString();
      continue;
    }
    if (!response.ok) throw new Error(`Car and Driver page returned ${response.status}`);
    const finalUrl = canonicalSourceUrl(response.url || safeUrl.toString());
    if (!finalUrl) throw new Error("Car and Driver redirected to an unsupported URL");
    const html = await response.text();
    if (html.length > 8_000_000) throw new Error("Car and Driver page exceeded the size limit");
    return { html, url: finalUrl.toString() };
  }
  throw new Error("Car and Driver page could not be loaded");
}

function extractH1(html: string) {
  const value = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i)?.[1];
  return value ? htmlToText(value) : undefined;
}

function findTextIndex(text: string, value: string, fromIndex = 0) {
  return text.toLowerCase().indexOf(value.toLowerCase(), fromIndex);
}

function fieldsInRange(text: string, labels: string[], startAt = 0, endMarkers: string[] = []) {
  const positions = labels
    .map((label) => ({ label, index: text.indexOf(label, startAt) }))
    .filter((item) => item.index >= startAt)
    .sort((a, b) => a.index - b.index);
  const fields: VehicleDataField[] = [];

  positions.forEach((item, index) => {
    const valueStart = item.index + item.label.length;
    let valueEnd = positions[index + 1]?.index ?? text.length;
    for (const marker of endMarkers) {
      const markerIndex = text.indexOf(marker, valueStart);
      if (markerIndex >= 0) valueEnd = Math.min(valueEnd, markerIndex);
    }
    const value = text.slice(valueStart, valueEnd).replace(/^[\s:–-]+|[\s:–-]+$/g, "").trim();
    if (value && value.length <= 180) fields.push({ label: item.label, value });
  });

  return fields;
}

function extractSummaryFields(text: string) {
  const labels = [
    "EPA MPG",
    "EPA Est. Range",
    "Seating",
    "Powertrain",
    "Drivetrain",
    "Limited Warranty",
  ];
  const headingPattern = /\bSpecs\b/gi;
  const candidates: Array<{ fields: VehicleDataField[]; score: number; headingIndex: number }> = [];
  let heading: RegExpExecArray | null;

  while ((heading = headingPattern.exec(text))) {
    const summary = text.slice(heading.index, heading.index + 1_600);
    const endMarkers = ["By ", "Overview", "HIGHS", "LOWS"];
    let endAt = summary.length;
    for (const marker of endMarkers) {
      const index = findTextIndex(summary, marker, 5);
      if (index >= 0) endAt = Math.min(endAt, index);
    }
    const fields = fieldsInRange(summary.slice(0, endAt), labels, 0);
    if (fields.length) candidates.push({ fields, score: fields.length, headingIndex: heading.index });
  }

  candidates.sort((a, b) => b.score - a.score);
  const summaryFields = candidates[0]?.fields ?? [];
  const summaryHeading = candidates[0]?.headingIndex ?? text.length;
  const beforeSummary = text.slice(0, summaryHeading);
  const msrpMatches = Array.from(beforeSummary.matchAll(/\bMSRP\s+(\$[\d,]+(?:[–-]\$?[\d,]+)?)/gi));
  const msrp = msrpMatches.at(-1)?.[1];
  return [
    ...(msrp ? [{ label: "MSRP", value: msrp }] : []),
    ...summaryFields,
  ];
}

function extractOverview(text: string) {
  const headingPattern = /\nOverview\n/g;
  let heading: RegExpExecArray | null;
  while ((heading = headingPattern.exec(text))) {
    const startAt = heading.index + heading[0].length;
    const section = text.slice(startAt, startAt + 3_000);
    const endMarkers = [
      "Where This Vehicle Ranks",
      "Expert Tip:",
      "What's New for",
      "What’s New for",
      "Pricing and Which One to Buy",
    ];
    let endAt = section.length;
    for (const marker of endMarkers) {
      const index = findTextIndex(section, marker);
      if (index >= 0) endAt = Math.min(endAt, index);
    }
    const overview = section.slice(0, endAt).replace(/\bSUV\s+s\b/g, "SUVs").replace(/\s+/g, " ").trim();
    const words = overview.split(/\s+/).filter(Boolean);
    if (words.length < 8) continue;
    return overview;
  }
  return undefined;
}

function extractRating(text: string) {
  const match = text.match(/(?:C\/D\s+RATING\s+(\d+(?:\.\d+)?\s*\/\s*10)|(\d+(?:\.\d+)?\s*\/\s*10)\s+C\/D\s+RATING)/i);
  return (match?.[1] ?? match?.[2])?.replace(/\s+/g, "");
}

function extractModelImages(html: string): VehicleDataImage[] {
  const headingIndex = html.search(/<h1\b/i);
  if (headingIndex < 0) return [];
  const priceIndex = findTextIndex(html, "MSRP", headingIndex);
  const galleryHtml = html.slice(headingIndex, priceIndex > headingIndex ? priceIndex : headingIndex + 180_000);
  const imageTags = galleryHtml.match(/<(?:img|source)\b[^>]*>/gi) ?? [];
  const images: VehicleDataImage[] = [];

  for (const tag of imageTags) {
    const attributes = new Map<string, string>();
    const attributePattern = /([\w:-]+)\s*=\s*(["'])(.*?)\2/g;
    let attribute: RegExpExecArray | null;
    while ((attribute = attributePattern.exec(tag))) {
      attributes.set(attribute[1].toLowerCase(), decodeHtml(attribute[3]));
    }
    const sourceSet = attributes.get("srcset") ?? attributes.get("data-srcset") ?? "";
    const sourceSetUrls = sourceSet.split(",").map((entry) => entry.trim().split(/\s+/)[0]).filter(Boolean);
    const source = attributes.get("data-src")
      ?? attributes.get("data-original")
      ?? attributes.get("src")
      ?? sourceSetUrls.at(-1);
    if (!source || source.startsWith("data:") || source.startsWith("blob:")) continue;

    let url: URL;
    try {
      url = new URL(source, `https://${sourceHost}`);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" || url.hostname !== "hips.hearstapps.com") continue;
    if (!url.pathname.includes("/hmg-prod/images/")) continue;
    if (images.some((image) => image.src === url.toString())) continue;
    images.push({
      src: url.toString(),
      alt: attributes.get("alt")?.trim() || "Car and Driver vehicle photo",
    });
  }

  return images.slice(0, 12);
}

function extractTestedConfiguration(
  text: string,
  modelUrl: string,
): HearstAutoVehicleDetails["testedConfiguration"] {
  const startAt = findTextIndex(text, "SPECIFICATIONS");
  if (startAt < 0) return undefined;
  const endAt = findTextIndex(text, "MORE FEATURES AND SPECS", startAt);
  if (endAt < 0) return undefined;
  const sectionText = text.slice(startAt + "SPECIFICATIONS".length, endAt);
  const lines = sectionText.split("\n").map((line) => line.trim()).filter(Boolean);
  const titleIndex = lines.findIndex((line) => /^(?:19|20)\d{2}\s/.test(line));
  if (titleIndex < 0) return undefined;
  const title = lines[titleIndex];
  const pathParts = new URL(modelUrl).pathname.split("/").filter(Boolean);
  const testedWords: string[] = title.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const modelPathWords: string[] = pathParts
    .flatMap((part) => part.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .filter((word) => !/^20\d{2}$/.test(word));
  if (modelPathWords.length < 2 || !modelPathWords.every((word) => testedWords.includes(word))) {
    return undefined;
  }
  const sectionNames = new Set([
    "PRICE", "ENGINE", "TRANSMISSION", "CHASSIS", "DIMENSIONS",
    "POWERTRAIN", "C/D TEST RESULTS", "C/D FUEL ECONOMY", "C/D FUEL ECONOMY AND CHARGING", "EPA FUEL ECONOMY",
  ]);
  const sections: VehicleDataSection[] = [];
  let current: VehicleDataSection | undefined;
  for (const line of lines.slice(titleIndex + 1)) {
    const heading = line.toUpperCase();
    if (sectionNames.has(heading)) {
      current = { heading, fields: [] };
      sections.push(current);
      continue;
    }
    const separator = line.indexOf(":");
    if (current && separator > 0 && separator < 55) {
      const label = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      if (label && value && value.length <= 180) current.fields.push({ label, value });
    } else if (current && current.fields.length === 0 && line.length <= 180) {
      current.fields.push({ label: "", value: line });
    }
  }
  const populated = sections.filter((section) => section.fields.length > 0);
  return populated.length ? { title, sections: populated } : undefined;
}

function isMatchingModelPage(storyTitle: string, pageTitle: string) {
  const expected = titleIdentity(storyTitle);
  const actual = titleIdentity(pageTitle);
  if (!expected || !actual || expected.year !== actual.year) return false;
  return expected.words.every((word) => actual.words.includes(word));
}

export async function getHearstAutoVehicleDetails(
  storyTitle: string,
  storyUrl: string,
): Promise<HearstAutoVehicleDetails> {
  const safeStoryUrl = canonicalSourceUrl(storyUrl);
  if (!safeStoryUrl) throw new Error("Unsupported Car and Driver story URL");

  let modelUrl: string;
  if (isModelPageUrl(safeStoryUrl.toString())) {
    modelUrl = safeStoryUrl.toString();
  } else {
    const article = await fetchCarAndDriverPage(safeStoryUrl.toString());
    modelUrl = readModelLink(article.html, storyTitle) ?? "";
    if (!modelUrl) throw new Error("No unambiguous matching vehicle page was found");
  }

  const page = await fetchCarAndDriverPage(modelUrl);
  const title = extractH1(page.html);
  if (!title || !isMatchingModelPage(storyTitle, title)) {
    throw new Error("Car and Driver vehicle page did not match the story year and model");
  }

  const text = pageText(page.html);
  const fields = extractSummaryFields(text);
  if (fields.length === 0) throw new Error("No verified vehicle summary fields were found");
  return {
    title,
    sourceUrl: page.url,
    rating: extractRating(text),
    overview: extractOverview(text),
    fields,
    images: extractModelImages(page.html),
    testedConfiguration: extractTestedConfiguration(text, page.url),
  };
}
