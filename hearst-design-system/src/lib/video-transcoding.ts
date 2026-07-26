export type VideoTranscoding = {
  codec?: string | null;
  display_name?: string;
  full_url?: string;
  height?: number;
  preset_name?: string;
  width?: number;
};

const preferredVideoSizes = ["720p", "480p", "360p", "1080p", "240p"];

function getDescriptor(transcoding: VideoTranscoding) {
  return [
    transcoding.codec,
    transcoding.display_name,
    transcoding.preset_name,
    transcoding.full_url,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isDirectMp4(transcoding: VideoTranscoding) {
  return /\.mp4(?:$|\?)/i.test(transcoding.full_url ?? "");
}

function hasUnsupportedCodecSignal(transcoding: VideoTranscoding) {
  return /(?:hevc|h[\s._-]*265|hev1|hvc1|vp9|av1|webm|dash|mpeg-dash|prores)/i.test(
    getDescriptor(transcoding),
  );
}

function hasH264Signal(transcoding: VideoTranscoding) {
  return /(?:h[\s._-]*264|avc1|avc)/i.test(getDescriptor(transcoding));
}

function matchesPreferredSize(name: string) {
  return (transcoding: VideoTranscoding) =>
    `${transcoding.display_name ?? ""} ${transcoding.preset_name ?? ""}`
      .toLowerCase()
      .includes(name);
}

export function getPreferredVideoTranscoding(
  transcodings: VideoTranscoding[],
) {
  const mp4Transcodings = transcodings.filter(
    (transcoding) =>
      isDirectMp4(transcoding) && !hasUnsupportedCodecSignal(transcoding),
  );
  const h264Transcodings = mp4Transcodings.filter(hasH264Signal);

  for (const name of preferredVideoSizes) {
    const match = h264Transcodings.find(matchesPreferredSize(name));
    if (match?.full_url) return match;
  }

  for (const name of preferredVideoSizes) {
    const match = mp4Transcodings.find(matchesPreferredSize(name));
    if (match?.full_url) return match;
  }

  return (
    h264Transcodings[0] ??
    mp4Transcodings[0] ??
    transcodings.find(
      (transcoding) =>
        /\.m3u8(?:$|\?)/i.test(transcoding.full_url ?? "") &&
        !hasUnsupportedCodecSignal(transcoding),
    )
  );
}
