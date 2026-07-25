import { getAmbientCommerceStories } from "@/lib/ambient-commerce-stories";
import {
  createSocialGraphImage,
  socialGraphContentType,
  socialGraphSize,
} from "@/lib/social-graph-image";

export const alt = "Shop the stories | Hearst+";
export const size = socialGraphSize;
export const contentType = socialGraphContentType;

export default function OpenGraphImage() {
  const leadStory = getAmbientCommerceStories()[0];

  return createSocialGraphImage({
    eyebrow: "Hearst+ · Shop the stories",
    title: "Useful product picks, in the stories that explain them.",
    description: "Editorial guides with verified product recommendations from across Hearst.",
    accent: "#74B9F5",
    background: "#102A43",
    imageUrl: leadStory?.image,
  });
}
