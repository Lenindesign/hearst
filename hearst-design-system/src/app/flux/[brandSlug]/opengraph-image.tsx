import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getBrandPosterData } from "@/lib/social-graph-route";

export const alt = "Hearst Fashion and Luxury brand stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  const data = getBrandPosterData("flux", brandSlug);
  return createSocialGraphImage({
    eyebrow: `${data?.brand.brand ?? "Hearst Fashion & Luxury"} · Fashion & Luxury`,
    title: data?.story?.title ?? `${data?.brand.brand ?? "Fashion & Luxury"} on Hearst+`,
    description: data?.story?.summary ?? `A personalized ${data?.brand.brand ?? "brand"} story feed within Hearst Fashion & Luxury.`,
    ...data?.config ?? { accent: "#F2F2F2", background: "#171717" },
    imageUrl: data?.story?.image,
  });
}
