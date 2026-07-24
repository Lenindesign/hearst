import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getCategoryPosterData } from "@/lib/social-graph-route";

export const alt = "Hearst Enthusiast and Wellness category stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const data = getCategoryPosterData("ew", categorySlug);
  return createSocialGraphImage({
    eyebrow: `Enthusiast & Wellness · ${data?.categoryLabel ?? "For You"}`,
    title: data?.story?.title ?? "Practical expertise for active living.",
    description: data?.story?.summary ?? "A personalized editorial mix for health, fitness, gear, and wellness.",
    ...data?.config ?? { accent: "#FF7184", background: "#3B1C28" },
    imageUrl: data?.story?.image,
  });
}
