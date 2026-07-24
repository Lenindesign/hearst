import { ImageResponse } from "next/og";

export const socialGraphSize = { width: 1200, height: 630 };
export const socialGraphContentType = "image/png";

export type SocialGraphPoster = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  background: string;
  imageUrl?: string;
};

export function createSocialGraphImage({
  eyebrow,
  title,
  description,
  accent,
  background,
  imageUrl,
}: SocialGraphPoster) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background,
          color: "#FFFFFF",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ width: "62%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 58px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800, letterSpacing: 8 }}>HEARST+</div>
            <div style={{ display: "flex", width: 1, height: 26, background: "rgba(255,255,255,.35)" }} />
            <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: accent }}>{eyebrow}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", width: 64, height: 7, marginBottom: 24, background: accent }} />
            <div style={{ display: "flex", maxWidth: 650, fontSize: 52, lineHeight: 1.04, fontWeight: 800, letterSpacing: -1.5 }}>{title}</div>
            <div style={{ display: "flex", maxWidth: 600, marginTop: 22, fontSize: 21, lineHeight: 1.35, color: "#D7E5F0" }}>{description}</div>
          </div>
          <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#AFC5D7" }}>A personalized editorial destination from Hearst Magazines</div>
        </div>
        <div style={{ position: "relative", width: "38%", display: "flex", overflow: "hidden", background: accent }}>
          {/* ImageResponse renders standard img nodes; next/image is not supported in this server renderer. */}
          {imageUrl ? <img src={imageUrl} alt="" width="456" height="630" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : null} {/* eslint-disable-line @next/next/no-img-element */}
          <div style={{ position: "absolute", inset: 0, display: "flex", background: imageUrl ? "linear-gradient(180deg, rgba(16,42,67,.05), rgba(16,42,67,.82))" : `linear-gradient(145deg, ${accent}, ${background})` }} />
          <div style={{ position: "absolute", right: 28, bottom: 28, display: "flex", padding: "10px 14px", border: "1px solid rgba(255,255,255,.55)", fontSize: 13, fontWeight: 700 }}>HEARST+ · FOR YOU</div>
        </div>
      </div>
    ),
    { ...socialGraphSize },
  );
}

export function socialGraphMetadata(imagePath: string, title: string, description: string) {
  return {
    openGraph: {
      title,
      description,
      type: "website" as const,
      images: [{ url: imagePath, width: socialGraphSize.width, height: socialGraphSize.height, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [imagePath],
    },
  };
}
