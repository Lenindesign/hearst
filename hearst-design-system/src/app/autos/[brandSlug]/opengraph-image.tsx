import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getBrandPosterData } from "@/lib/social-graph-route";

export const alt = "Hearst Autos brand stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  const data = getBrandPosterData("autos", brandSlug);
  return createSocialGraphImage({
    eyebrow: `${data?.brand.brand ?? "Hearst Autos"} · Autos`,
    title: data?.story?.title ?? `${data?.brand.brand ?? "Autos"} on Hearst+`,
    description: data?.story?.summary ?? `A personalized ${data?.brand.brand ?? "autos"} story feed within Hearst Autos.`,
    ...data?.config ?? { accent: "#78BDE8", background: "#102A3A" },
    imageUrl: data?.story?.image,
  });
}
