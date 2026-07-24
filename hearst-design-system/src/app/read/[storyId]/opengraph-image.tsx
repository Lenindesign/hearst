import { getStaticHearstStoryById } from "@/lib/hearst-static-stories";
import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";

export const alt = "Hearst+ story";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  const story = getStaticHearstStoryById(decodeURIComponent(storyId));
  return createSocialGraphImage({
    eyebrow: `${story?.brand ?? "Hearst+"} · ${story?.topic ?? "Story"}`,
    title: story?.title ?? "A story worth making time for.",
    description: story?.summary ?? "Read trusted reporting from across the Hearst portfolio.",
    accent: "#74B9F5",
    background: "#102A43",
    imageUrl: story?.image,
  });
}
