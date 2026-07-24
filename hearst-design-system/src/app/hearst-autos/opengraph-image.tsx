import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { socialGraphDestinationConfig } from "@/lib/social-graph-config";
import { createSocialGraphImage, socialGraphContentType, socialGraphSize } from "@/lib/social-graph-image";
export const alt = "Hearst Autos";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;
export default function OpenGraphImage() { const config = socialGraphDestinationConfig.autos; const story = getHearstDestinationStaticData().autos.stories[0]; return createSocialGraphImage({ eyebrow: config.label, title: story?.title ?? "The car stories worth your time.", description: story?.summary ?? "Trusted reporting and useful guidance from Hearst auto brands.", ...config, imageUrl: story?.image }); }
