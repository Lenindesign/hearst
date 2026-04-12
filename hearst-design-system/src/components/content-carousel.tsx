"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselCard {
  title: string;
  image?: string;
}

interface ContentCarouselProps {
  headline: string;
  cards: CarouselCard[];
  showIndicators?: boolean;
  className?: string;
}

export function ContentCarousel({
  headline,
  cards,
  showIndicators = false,
  className,
}: ContentCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className={cn("flex flex-col gap-[22px]", className)}>
      {/* Headline — Pencil: $type.headline.size (55px), bold, $type.headline.tracking (-1.4) */}
      <h2
        className="font-bold leading-none"
        style={{ fontSize: "clamp(32px, 4vw, 55px)", letterSpacing: "-0.025em" }}
      >
        {headline}
      </h2>

      {/* Carousel row — Pencil: gap $space.row.gap (18px), nav buttons + cards */}
      <Carousel
        setApi={setApi}
        opts={{ align: "start", slidesToScroll: 1 }}
        className="w-full"
      >
        <div className="flex items-center gap-[18px]">
          {/* Left nav — Pencil: 52x52, $radius.pill, $color.text.primary bg, $color.icon.inverse icon */}
          <button
            onClick={() => api?.scrollPrev()}
            className="shrink-0 w-[52px] h-[52px] rounded-full bg-foreground text-background flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-30"
            disabled={!api?.canScrollPrev()}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Cards track — Pencil: gap $space.cards.gap (8px), cards 255px wide */}
          <CarouselContent className="-ml-2 flex-1">
            {cards.map((card, i) => (
              <CarouselItem key={i} className="pl-2 basis-auto">
                <CardSlide card={card} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Right nav */}
          <button
            onClick={() => api?.scrollNext()}
            className="shrink-0 w-[52px] h-[52px] rounded-full bg-foreground text-background flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-30"
            disabled={!api?.canScrollNext()}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </Carousel>

      {/* Dot indicators — Pencil: 6px ellipses, gap 10, centered */}
      {showIndicators && count > 1 && (
        <div className="flex justify-center gap-2.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === current ? "bg-foreground" : "bg-muted-foreground/30"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardSlide({ card }: { card: CarouselCard }) {
  return (
    <div className="flex flex-col gap-2.5 w-[255px]">
      {/* Image — Pencil: 255×341, $color.surface.placeholder fallback */}
      <div className="w-[255px] h-[341px] bg-muted overflow-hidden rounded-sm">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      {/* Title — Pencil: $type.cardtitle.size (30px), bold, $type.cardtitle.tracking (-0.3) */}
      <h3
        className="font-bold leading-tight"
        style={{ fontSize: "clamp(20px, 2.5vw, 30px)", letterSpacing: "-0.01em" }}
      >
        {card.title}
      </h3>
    </div>
  );
}
