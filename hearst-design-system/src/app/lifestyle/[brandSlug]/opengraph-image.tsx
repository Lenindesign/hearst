import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getBrandPosterData } from "@/lib/social-graph-route";

export const alt = "Hearst Lifestyle brand stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  const data = getBrandPosterData("lifestyle", brandSlug);
  return createSocialGraphImage({
    eyebrow: `${data?.brand.brand ?? "Hearst Lifestyle"} · Lifestyle`,
    title: data?.story?.title ?? `${data?.brand.brand ?? "Lifestyle"} on Hearst+`,
    description: data?.story?.summary ?? `A personalized ${data?.brand.brand ?? "lifestyle"} story feed within Hearst Lifestyle.`,
    ...data?.config ?? { accent: "#EE8CBC", background: "#3A1E35" },
    imageUrl: data?.story?.image,
  });
}
