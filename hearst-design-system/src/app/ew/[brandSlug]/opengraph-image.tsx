import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getBrandPosterData } from "@/lib/social-graph-route";

export const alt = "Hearst Enthusiast and Wellness brand stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  const data = getBrandPosterData("ew", brandSlug);
  return createSocialGraphImage({
    eyebrow: `${data?.brand.brand ?? "Hearst Enthusiast & Wellness"} · Enthusiast & Wellness`,
    title: data?.story?.title ?? `${data?.brand.brand ?? "Enthusiast & Wellness"} on Hearst+`,
    description: data?.story?.summary ?? `A personalized ${data?.brand.brand ?? "brand"} story feed within Hearst Enthusiast & Wellness.`,
    ...data?.config ?? { accent: "#FF7184", background: "#3B1C28" },
    imageUrl: data?.story?.image,
  });
}
