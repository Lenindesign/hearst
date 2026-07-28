/**
 * Public component surface for Hearst+ stories and downstream prototypes.
 *
 * Keeping imports behind this boundary lets production modules continue to
 * split without rewriting every Storybook story and downstream consumer.
 */
export {
  HomePageTemplate,
  LifestyleRiverCard,
  MainNav,
  RichPhotoGalleryCard,
} from "@/components/home-page";

export {
  AmbientArticleReader,
  getAmbientInterstitialAdvertiser,
  getAmbientReaderState,
  isCompleteAmbientArticle,
} from "@/components/hearst-plus/ambient-reader";

export {
  DiscoverySidebarCard,
  LifestyleDiscoverySidebar,
} from "@/components/hearst-plus/discovery-sidebar";

export type {
  AutosOemFilterOption,
  LifestyleDiscoverySidebarProps,
} from "@/components/hearst-plus/discovery-sidebar";

export {
  TrendingStoryRail,
  TrendingVideoRail,
} from "@/components/hearst-plus/trending-rail";

export { TodayEditStrip } from "@/components/hearst-plus/today-edit-strip";

export type {
  TodayEditSelection,
  TodayEditStory,
  TodayEditStripProps,
} from "@/components/hearst-plus/today-edit-strip";

export {
  FeaturedStoryCarousel,
} from "@/components/hearst-plus/featured-story-carousel";

export type {
  FeaturedStoryCarouselProps,
} from "@/components/hearst-plus/featured-story-carousel";

export {
  LifestyleStoryActions,
} from "@/components/hearst-plus/story-actions";

export type {
  LifestyleStoryActionsProps,
} from "@/components/hearst-plus/story-actions";

export {
  VideoFeedLeadCard,
  VideoIndexCard,
  VideoPlaySurface,
  VideoRailCard,
} from "@/components/hearst-plus/video-cards";

export {
  DelishVerticalVideoCarousel,
  VerticalVideoCarousel,
} from "@/components/hearst-plus/vertical-video-carousel";

export type {
  VerticalVideoCarouselProps,
} from "@/components/hearst-plus/vertical-video-carousel";
export {
  DelishShortsImmersiveViewer,
} from "@/components/hearst-plus/delish-shorts-viewer";
export type {
  DelishShortsImmersiveViewerProps,
} from "@/components/hearst-plus/delish-shorts-viewer";

export {
  LifestyleRiverLoadingState,
  ProgressiveFeedSentinelStatus,
} from "@/components/hearst-plus/feed-states";

export {
  ReaderActionBar,
  ReaderPublicationDates,
} from "@/components/hearst-plus/reader-action-bar";

export type {
  PremiumReaderState,
  ReaderActionBarProps,
} from "@/components/hearst-plus/reader-action-bar";

export { ReaderArticleBody } from "@/components/hearst-plus/reader-article-body";

export type {
  ReaderArticleImage,
  ReaderArticleLoadState,
} from "@/components/hearst-plus/reader-article-body";

export {
  FullscreenImageViewer,
  getFullscreenReaderImages,
} from "@/components/hearst-plus/fullscreen-image-viewer";

export type {
  FullscreenGalleryState,
  FullscreenImageViewerProps,
  FullscreenReaderImage,
} from "@/components/hearst-plus/fullscreen-image-viewer";

export { buildReaderQueue } from "@/components/hearst-plus/reader-queue";

export type {
  BuildReaderQueueOptions,
  ReaderQueueModel,
} from "@/components/hearst-plus/reader-queue";

export type {
  HomePageTemplateProps,
} from "@/components/home-page";

export type {
  AmbientArticleReaderProps,
  AmbientInterstitialAdvertiser,
  AmbientReaderDensity,
} from "@/components/hearst-plus/ambient-reader";

export {
  getLifestyleCardKind,
  getLifestyleImagePosition,
  getLifestyleKindLabel,
  isExplicitGalleryStory,
  isYearMakeModelStory,
  LifestyleCardModule,
  lifestyleDefaultLeadStoryId,
  LifestyleRiverImage,
  storyHasPlayableVideo,
} from "@/components/hearst-plus/story-presentation";

export type {
  LifestyleCardKind,
} from "@/components/hearst-plus/story-presentation";

export {
  getLifestyleArticleRecommendations,
  getLifestyleCommentCount,
  getLifestyleContextStories,
  getLifestyleSeedComments,
  getReadyLiveArticle,
  scoreLifestyleRelatedStory,
} from "@/components/hearst-plus/content-reader-model";

export type {
  LifestyleReaderContext,
  LifestyleStoryComment,
} from "@/components/hearst-plus/content-reader-model";

export { ContentReaderMasthead } from "@/components/hearst-plus/content-reader-masthead";
export {
  ContentReaderDialogShell,
  rememberContentReaderReturnFocus,
} from "@/components/hearst-plus/content-reader-dialog-shell";

export type {
  ContentReaderFilterItem,
  ContentReaderMastheadItem,
} from "@/components/hearst-plus/content-reader-masthead";
export type {
  ContentReaderDialogShellProps,
} from "@/components/hearst-plus/content-reader-dialog-shell";

export {
  ContentReaderComments,
} from "@/components/hearst-plus/content-reader-comments";

export type {
  ContentReaderCommentsProps,
} from "@/components/hearst-plus/content-reader-comments";

export {
  ContentReaderRecommendations,
} from "@/components/hearst-plus/content-reader-recommendations";

export type {
  ContentReaderRecommendationsProps,
} from "@/components/hearst-plus/content-reader-recommendations";

export {
  ContentReaderContextRail,
} from "@/components/hearst-plus/content-reader-context-rail";

export type {
  ContentReaderContextRailProps,
} from "@/components/hearst-plus/content-reader-context-rail";

export {
  ContentReaderAdvertisement,
  selectContentReaderAdvertisement,
} from "@/components/hearst-plus/content-reader-advertisement";

export type {
  ContentReaderAdvertisementProps,
  ContextualAdUnit,
  ReaderAdvertisementDestination,
} from "@/components/hearst-plus/content-reader-advertisement";

export {
  ContextualRiverAdvertisement,
} from "@/components/hearst-plus/contextual-river-advertisement";

export type {
  ContextualRiverAdvertisementProps,
} from "@/components/hearst-plus/contextual-river-advertisement";

export {
  BrandPromotionRiverModule,
} from "@/components/hearst-plus/brand-promotion-river-module";

export type {
  BrandPromotionRiverModuleProps,
} from "@/components/hearst-plus/brand-promotion-river-module";

export {
  getBrandPromotionForSlot,
  scoreBrandPromotionStory,
} from "@/components/hearst-plus/brand-promotion-model";

export type {
  BrandPromotionMatch,
} from "@/components/hearst-plus/brand-promotion-model";

export {
  getOnboardingInterestOptions,
  HearstOnboardingModal,
} from "@/components/hearst-plus/onboarding-modal";

export type {
  HearstOnboardingConfig,
  HearstOnboardingDestination,
  HearstOnboardingModalProps,
  HearstOnboardingResult,
} from "@/components/hearst-plus/onboarding-modal";

export {
  StakeholderPersonalizationConsole,
} from "@/components/hearst-plus/stakeholder-personalization-console";

export type {
  StakeholderConsoleConfig,
  StakeholderDaypart,
  StakeholderDemoDaypart,
  StakeholderDemoState,
  StakeholderPersonalizationConsoleProps,
  StakeholderScoreBreakdown,
} from "@/components/hearst-plus/stakeholder-personalization-console";
