import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Carousel",
  description:
    "Embla-backed track primitive with slide semantics, pointer dragging, navigation state, and orientation-aware keyboard controls.",
  level: "atom",
  path: "ui/carousel.tsx",
  exports: [
    "Carousel",
    "CarouselContent",
    "CarouselItem",
    "CarouselPrevious",
    "CarouselNext",
    "useCarousel",
    "CarouselApi",
  ],
  whenToUse: [
    "A bounded horizontal or vertical sequence requires pointer and keyboard navigation",
    "A product module needs an Embla track while retaining ownership of content anatomy and ranking",
  ],
  whenNotToUse: [
    "All content should remain visible without interaction",
    "A vertical video experience requires native scroll-snap and media playback ownership",
  ],
  tokens: {
    colors: [],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: ["ui/button", "ui/icons"],
  usedBy: ["content-carousel", "carousel-page"],
  brandAware: true,
  responsive: true,
  variants: ["horizontal", "vertical"],
  slots: ["content", "item", "previous", "next"],
  caveats: [
    "The consuming product module owns slide labels, editorial ranking, progress indicators, and empty or single-slide treatment.",
  ],
};

export default metadata;
