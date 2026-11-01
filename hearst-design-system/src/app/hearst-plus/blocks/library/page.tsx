import type { Metadata } from "next";
import { BlocksLibraryExperience } from "@/components/hearst-plus/blocks-library-experience";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getPersonalizeVideoFeed } from "@/lib/hearst-video-feed";
import { autosRiverStories } from "@/components/autos-river-data";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { communityGroups, communityParticipationThreads } from "@/lib/community-groups";
import { isExplicitGalleryStory } from "@/components/hearst-plus/story-presentation-model";
import { hearstEvents } from "@/lib/hearst-events";
import { isExactPortraitVideo } from "@/lib/hearst-video-destination-model";
import { getBrandPromotionForSlot } from "@/components/hearst-plus/brand-promotion-model";
import { localNewsContextualAd } from "@/components/hearst-plus/local-news-contextual-ad";

export const metadata: Metadata = {
  title: "Building Blocks Library | Hearst+",
  description: "A visual reference for the reusable layout patterns used in Hearst+ editorial blocks.",
};

export default async function BlocksLibraryPage() {
  const [videoFeed] = await Promise.all([
    getPersonalizeVideoFeed({ destination: "all", sizePerBrand: 5 }),
  ]);
  const stories = getHearstDestinationStaticData({ storyLimitPerDestination: 80 }).all.stories;
  const shortsStories = videoFeed.stories.filter(isExactPortraitVideo).slice(0, 6);
  const vehicleStory = autosRiverStories.find((story) => story.id === "car-and-driver-kia-ev9-2027") ?? autosRiverStories[0];
  const galleryStory = autosRiverStories.find(isExplicitGalleryStory) ?? vehicleStory;
  const communitySeed = communityParticipationThreads[0];
  const communityGroup = communityGroups.find((group) => group.brandSlug === communitySeed.brandSlug && group.groupSlug === communitySeed.groupSlug);
  const communityThread: CommunityFeedThread = {
    id: communitySeed.id,
    brand: "Delish",
    brandSlug: communitySeed.brandSlug,
    title: communitySeed.title,
    body: communitySeed.body,
    meta: `${communityGroup?.name ?? "Delish"}${communityGroup?.members ? ` · ${communityGroup.members}` : ""}`,
    kindLabel: communitySeed.kind === "writer" ? "Host thread" : "Reader post",
    replies: communitySeed.replies,
    helpfulBase: communitySeed.replies + 14,
    author: communitySeed.author,
    isHost: communitySeed.kind === "writer",
    href: `/communities/${communitySeed.brandSlug}/threads/${communitySeed.id}/`,
    posterImage: "/images/delish-community-feature.png",
    posterAlt: communitySeed.title,
    mediaType: communitySeed.mediaType,
    videoUrl: communitySeed.videoUrl,
  };
  const eventSample = hearstEvents.find((event) => event.status === "upcoming") ?? hearstEvents[0];
  const brandSpotlight = getBrandPromotionForSlot({
    stories,
    fallbackStories: stories,
    activeFilter: "For You",
    slotNumber: 2,
  });

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <BlocksLibraryExperience
        stories={stories}
        videoStories={videoFeed.stories}
        communityThread={communityThread}
        eventSample={eventSample}
        vehicleStory={vehicleStory}
        galleryStory={galleryStory}
        shortsStories={shortsStories}
        sponsoredAd={localNewsContextualAd}
        brandSpotlight={brandSpotlight}
      />
    </ThemeProvider>
  );
}
