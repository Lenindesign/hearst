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
