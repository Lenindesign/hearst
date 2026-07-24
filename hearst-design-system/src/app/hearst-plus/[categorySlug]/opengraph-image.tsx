import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getCategoryPosterData } from "@/lib/social-graph-route";

export const alt = "Hearst+ category stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const data = getCategoryPosterData("all", categorySlug);
  return createSocialGraphImage({
    eyebrow: `Hearst+ · ${data?.categoryLabel ?? "For You"}`,
    title: data?.story?.title ?? "Stories worth making time for today.",
    description: data?.story?.summary ?? "A personalized editorial mix from trusted Hearst brands.",
    ...data?.config ?? { accent: "#74B9F5", background: "#102A43" },
    imageUrl: data?.story?.image,
  });
}
