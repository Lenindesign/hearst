export type VideoAspectRatio = "16:9" | "9:16";

type VideoDimensions = {
  videoHeight?: number;
  videoWidth?: number;
};

export function getExactVideoAspectRatio({
  videoHeight,
  videoWidth,
}: VideoDimensions): VideoAspectRatio | null {
  if (!videoWidth || !videoHeight || videoWidth <= 0 || videoHeight <= 0) {
    return null;
  }
  if (videoWidth * 9 === videoHeight * 16) return "16:9";
  if (videoWidth * 16 === videoHeight * 9) return "9:16";
  return null;
}

export function selectVideoAspectRatioQuotas<T extends VideoDimensions>(
  videos: T[],
  {
    landscapeLimit = 25,
    portraitLimit = 25,
  }: {
    landscapeLimit?: number;
    portraitLimit?: number;
  } = {},
) {
  let landscapeCount = 0;
  let portraitCount = 0;

  return videos.filter((video) => {
    const aspectRatio = getExactVideoAspectRatio(video);
    if (aspectRatio === "16:9" && landscapeCount < landscapeLimit) {
      landscapeCount += 1;
      return true;
    }
    if (aspectRatio === "9:16" && portraitCount < portraitLimit) {
      portraitCount += 1;
      return true;
    }
    return false;
  });
}

type RotatableVideo = {
  brandSlug: string;
  popularity: number;
  signal?: string;
};

const editionTimeZone = "America/New_York";

/** Whole days since the Unix epoch for the edition date in New York. */
export function getEditionDayNumber(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: editionTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return Math.floor(Date.UTC(value("year"), value("month") - 1, value("day")) / 86_400_000);
}

/**
 * Keeps video slots fresh day to day. The source returns each brand's
 * trending list, so the same brand's top video would otherwise lead every
 * day. Brands are interleaved round-robin (so the lead brand changes too),
 * the list is rotated one position per edition day, and popularity is
 * re-ranked from the new order so the river's scoring follows the rotation.
 */
export function rotateVideosForEdition<T extends RotatableVideo>(videos: T[], now = new Date()): T[] {
  if (videos.length < 2) return videos;

  const byBrand = new Map<string, T[]>();
  for (const video of videos) {
    const queue = byBrand.get(video.brandSlug) ?? [];
    queue.push(video);
    byBrand.set(video.brandSlug, queue);
  }
  const queues = [...byBrand.values()];
  const interleaved: T[] = [];
  for (let round = 0; interleaved.length < videos.length; round += 1) {
    for (const queue of queues) {
      if (round < queue.length) interleaved.push(queue[round]);
    }
  }

  const offset = ((getEditionDayNumber(now) % interleaved.length) + interleaved.length) % interleaved.length;
  const rotated = [...interleaved.slice(offset), ...interleaved.slice(0, offset)];

  return rotated.map((video, index) => ({
    ...video,
    popularity: Math.max(1, 99 - index),
    signal: index % 2 === 0 ? "Trending" : "Editor Pick",
  }));
}
