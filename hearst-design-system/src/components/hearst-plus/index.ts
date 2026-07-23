/**
 * Public component surface for Hearst+ stories and downstream prototypes.
 *
 * Implementations currently live in the production home-page module. Keeping
 * imports behind this boundary lets that module be split without rewriting
 * every Storybook story and consumer.
 */
export {
  DelishVerticalVideoCarousel,
  HomePageTemplate,
  LifestyleRiverCard,
  MainNav,
  RichPhotoGalleryCard,
  VerticalVideoCarousel,
  VideoFeedLeadCard,
  VideoIndexCard,
  VideoRailCard,
} from "@/components/home-page";

export type {
  FullscreenReaderImage,
  HomePageTemplateProps,
} from "@/components/home-page";
