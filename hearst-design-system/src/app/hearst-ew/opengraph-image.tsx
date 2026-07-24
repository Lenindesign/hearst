import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { socialGraphDestinationConfig } from "@/lib/social-graph-config";
import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
export const alt = "Hearst Enthusiast and Wellness";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;
export default function OpenGraphImage() { const config = socialGraphDestinationConfig.ew; const story = getHearstDestinationStaticData().ew.stories[0]; return createSocialGraphImage({ eyebrow: config.label, title: story?.title ?? "Practical expertise for active living.", description: story?.summary ?? "Health, fitness, gear, and wellness from Hearst brands.", ...config, imageUrl: story?.image }); }
