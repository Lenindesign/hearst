import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

const productionStories = hearstPlusStoryData.all.stories.slice(0, 5);

function CarouselPosition({ total }: { total: number }) {
  const { api } = useCarousel();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    const initialUpdate = requestAnimationFrame(update);
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      cancelAnimationFrame(initialUpdate);
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <p aria-live="polite" className="mt-3 text-center text-sm text-muted-foreground">
      Slide {current + 1} of {total}
    </p>
  );
}

function ProductionSlide({
  story,
  index,
  total,
}: {
  story: (typeof productionStories)[number];
  index: number;
  total: number;
}) {
  return (
    <article
      aria-label={`Slide ${index + 1} of ${total}`}
      className="flex h-full min-h-48 flex-col justify-between rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {story.brand} · {story.topic}
        </p>
        <h2 className="mt-3 line-clamp-3 text-xl font-semibold leading-tight headline">
          {story.title}
        </h2>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{story.readTime}</p>
    </article>
  );
}

const meta: Meta<typeof Carousel> = {
  title: "Hearst Plus/HDS Primitives/Carousel",
  component: Carousel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The Embla-backed production track primitive used by routed component examples and ContentCarousel. It supplies slide semantics, previous/next state, horizontal or vertical orientation, pointer dragging, and orientation-aware keyboard navigation. Product modules remain responsible for editorial ranking, indicators, and content anatomy.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Horizontal: Story = {
  render: () => (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center px-14 py-8">
      <Carousel
        aria-label="Production story carousel"
        className="w-full max-w-[560px] min-w-0"
        opts={{ align: "start" }}
        tabIndex={0}
      >
        <CarouselContent>
          {productionStories.slice(0, 3).map((story, index, stories) => (
            <CarouselItem key={story.id}>
              <ProductionSlide story={story} index={index} total={stories.length} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselPosition total={3} />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Production story carousel" });
    const previous = canvas.getByRole("button", { name: "Previous slide" });
    const next = canvas.getByRole("button", { name: "Next slide" });

    await waitFor(() => expect(next).toBeEnabled());
    await expect(previous).toBeDisabled();
    region.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(canvas.getByText("Slide 2 of 3")).toBeVisible());
    await expect(previous).toBeEnabled();
  },
};

export const ResponsiveMultipleItems: Story = {
  name: "Responsive multiple items",
  render: () => (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center px-14 py-8">
      <Carousel
        aria-label="Production story row"
        className="w-full max-w-[860px] min-w-0"
        opts={{ align: "start" }}
        tabIndex={0}
      >
        <CarouselContent>
          {productionStories.map((story, index, stories) => (
            <CarouselItem key={story.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <ProductionSlide story={story} index={index} total={stories.length} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center px-4 py-14">
      <Carousel
        aria-label="Vertical production story carousel"
        className="w-full max-w-[360px] min-w-0"
        orientation="vertical"
        tabIndex={0}
      >
        <CarouselContent className="h-64">
          {productionStories.slice(0, 3).map((story, index, stories) => (
            <CarouselItem key={story.id}>
              <ProductionSlide story={story} index={index} total={stories.length} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselPosition total={3} />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Vertical production story carousel" });

    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Next slide" })).toBeEnabled(),
    );
    region.focus();
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(canvas.getByText("Slide 2 of 3")).toBeVisible());
  },
};

export const OneSlide: Story = {
  name: "Single-slide boundary",
  render: () => (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center px-14 py-8">
      <Carousel
        aria-label="Single production story"
        className="w-full max-w-[560px] min-w-0"
      >
        <CarouselContent>
          <CarouselItem>
            <ProductionSlide story={productionStories[0]} index={0} total={1} />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Previous slide" })).toBeDisabled(),
    );
    await expect(canvas.getByRole("button", { name: "Next slide" })).toBeDisabled();
  },
};
