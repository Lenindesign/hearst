import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandRoute } from "@/lib/hearst-routes";

const allowedReaderReturnPrefixes = [
  "/hearst-plus/",
  "/hearst-lifestyle/",
  "/hearst-autos/",
  "/hearst-flux/",
  "/hearst-ew/",
  "/lifestyle/",
  "/autos/",
  "/flux/",
  "/ew/",
  "/brands/",
];

export function getHearstStoryRoute(storyOrId: Pick<LifestyleRiverStory, "id"> | string) {
  const id = typeof storyOrId === "string" ? storyOrId : storyOrId.id;
  return `/read/${encodeURIComponent(id)}/`;
}

export function getHearstStoryReturnHref(story?: Pick<LifestyleRiverStory, "brandSlug"> | null) {
  return story ? getHearstBrandRoute(story.brandSlug) : "/hearst-plus/";
}

function decodeReaderReturnHref(value: string) {
  let decoded = value;

  for (let index = 0; index < 3; index += 1) {
    try {
      const nextDecoded = decodeURIComponent(decoded);
      if (nextDecoded === decoded) break;
      decoded = nextDecoded;
    } catch {
      return null;
    }
  }

  return decoded;
}

export function normalizeReaderReturnHref(value?: string | null) {
  if (!value) return null;

  const decoded = decodeReaderReturnHref(value);
  if (!decoded) return null;

  if (
    /[\u0000-\u001F\u007F\\]/.test(decoded)
    || !decoded.startsWith("/")
    || decoded.startsWith("//")
  ) return null;

  let parsed: URL;
  try {
    parsed = new URL(decoded, "https://hearst-plus.local");
  } catch {
    return null;
  }

  if (parsed.origin !== "https://hearst-plus.local") return null;
  if (parsed.pathname.startsWith("/read/")) return null;
  if (!allowedReaderReturnPrefixes.some((prefix) => parsed.pathname.startsWith(prefix))) return null;

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
