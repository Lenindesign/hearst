import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";

export const alt = "Hearst+ editorial destinations";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default function OpenGraphImage() {
  return createSocialGraphImage({
    eyebrow: "Hearst+",
    title: "One daily destination across the Hearst portfolio.",
    description: "Personalized stories, trusted brands, and useful discovery in one reader-first experience.",
    accent: "#74B9F5",
    background: "#102A43",
  });
}
