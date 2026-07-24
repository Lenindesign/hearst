import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
import { getCategoryPosterData } from "@/lib/social-graph-route";
export const alt = "Hearst Autos category stories";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;
export default async function OpenGraphImage({ params }: { params: Promise<{ categorySlug: string }> }) { const { categorySlug } = await params; const data = getCategoryPosterData("autos", categorySlug); return createSocialGraphImage({ eyebrow: `Autos · ${data?.categoryLabel ?? "For You"}`, title: data?.story?.title ?? "The car stories worth your time.", description: data?.story?.summary ?? "A personalized editorial mix for people who love cars.", ...data?.config ?? { accent: "#78BDE8", background: "#102A3A" }, imageUrl: data?.story?.image }); }
