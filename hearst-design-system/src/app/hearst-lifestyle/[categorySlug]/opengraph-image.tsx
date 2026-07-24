import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getCategoryPosterData } from "@/lib/social-graph-route";
export const alt = "Hearst Lifestyle category stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;
export default async function OpenGraphImage({ params }: { params: Promise<{ categorySlug: string }> }) { const { categorySlug } = await params; const data = getCategoryPosterData("lifestyle", categorySlug); return createSocialGraphImage({ eyebrow: `Lifestyle · ${data?.categoryLabel ?? "For You"}`, title: data?.story?.title ?? "Stories for the life you live now.", description: data?.story?.summary ?? "A personalized editorial mix from trusted Hearst lifestyle brands.", ...data?.config ?? { accent: "#EE8CBC", background: "#3A1E35" }, imageUrl: data?.story?.image }); }
