import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { socialGraphDestinationConfig } from "@/lib/social-graph-config";
import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
export const alt = "Hearst Lifestyle";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;
export default function OpenGraphImage() { const config = socialGraphDestinationConfig.lifestyle; const story = getHearstDestinationStaticData().lifestyle.stories[0]; return createSocialGraphImage({ eyebrow: config.label, title: story?.title ?? "A daily edit for the life you live now.", description: story?.summary ?? "Trusted stories from across Hearst lifestyle brands.", ...config, imageUrl: story?.image }); }
