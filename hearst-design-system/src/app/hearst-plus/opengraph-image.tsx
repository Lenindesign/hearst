import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { socialGraphDestinationConfig } from "@/lib/social-graph-config";

export const alt = "Hearst+ personalized editorial destination";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default function OpenGraphImage() {
  const config = socialGraphDestinationConfig.all;
  return createSocialGraphImage({
    eyebrow: config.label,
    title: "Five stories worth making time for today.",
    description: "A concise daily mix from trusted Hearst brands, tuned to what matters to you now.",
    ...config,
  });
}
