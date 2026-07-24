import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { socialGraphDestinationConfig } from "@/lib/social-graph-config";
import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
export const alt = "Hearst Fashion and Luxury";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;
export default function OpenGraphImage() { const config = socialGraphDestinationConfig.flux; const story = getHearstDestinationStaticData().flux.stories[0]; return createSocialGraphImage({ eyebrow: config.label, title: story?.title ?? "Ideas with a point of view.", description: story?.summary ?? "Fashion, culture, design, and luxury from Hearst brands.", ...config, imageUrl: story?.image }); }
