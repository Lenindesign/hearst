import type { HearstDestinationMode } from "@/lib/hearst-routes";

export const socialGraphDestinationConfig: Record<HearstDestinationMode, { label: string; accent: string; background: string }> = {
  all: { label: "Hearst+", accent: "#74B9F5", background: "#102A43" },
  lifestyle: { label: "Lifestyle", accent: "#EE8CBC", background: "#3A1E35" },
  autos: { label: "Autos", accent: "#78BDE8", background: "#102A3A" },
  flux: { label: "Fashion & Luxury", accent: "#F2F2F2", background: "#171717" },
  ew: { label: "Enthusiast & Wellness", accent: "#FF7184", background: "#3B1C28" },
};
