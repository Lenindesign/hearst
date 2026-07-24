import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getCategoryPosterData } from "@/lib/social-graph-route";
export const alt = "Hearst Fashion and Luxury category stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;
export default async function OpenGraphImage({ params }: { params: Promise<{ categorySlug: string }> }) { const { categorySlug } = await params; const data = getCategoryPosterData("flux", categorySlug); return createSocialGraphImage({ eyebrow: `Fashion & Luxury · ${data?.categoryLabel ?? "For You"}`, title: data?.story?.title ?? "Ideas with a point of view.", description: data?.story?.summary ?? "A personalized editorial mix across fashion, culture, design, and luxury.", ...data?.config ?? { accent: "#F2F2F2", background: "#171717" }, imageUrl: data?.story?.image }); }
