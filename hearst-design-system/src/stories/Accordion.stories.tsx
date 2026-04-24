import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface AccordionStoryProps {
  items: { trigger: string; content: string }[];
  onValueChange: (value: unknown) => void;
  indicatorPosition?: "start" | "end";
  headline?: string;
  width?: string;
}

function AccordionRenderer({
  items,
  onValueChange,
  indicatorPosition = "end",
  headline,
  width = "w-96",
}: AccordionStoryProps) {
  return (
    <div className={width}>
      {headline ? (
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground headline">
          {headline}
        </h2>
      ) : null}
      <Accordion onValueChange={onValueChange as never}>
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger indicatorPosition={indicatorPosition}>
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

const meta: Meta = {
  title: "Components/Accordion",
  args: {
    items: [
      {
        trigger: "What is the Hearst Design System?",
        content: "A multi-brand design system powering 29 Hearst magazine brands with shared components and brand-specific theming.",
      },
      {
        trigger: "How do brand themes work?",
        content: "Each brand has its own set of design tokens (colors, fonts, radii) injected as CSS variables. Components adapt automatically.",
      },
      {
        trigger: "Can I use this with any framework?",
        content: "Yes. The component library outputs standard React components that work with Next.js, Vite, or any React setup.",
      },
    ],
    onValueChange: fn(),
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of accordion items with `trigger` (heading) and `content` (body) strings.",
      table: { category: "Content" },
    },
    headline: {
      control: "text",
      description: "Optional headline rendered above the accordion container.",
      table: { category: "Content" },
    },
    indicatorPosition: {
      control: { type: "inline-radio" },
      options: ["start", "end"],
      description: "Position of the expand/collapse chevron within each trigger.",
      table: { category: "Appearance", defaultValue: { summary: "end" } },
    },
    onValueChange: {
      action: "value-change",
      description: "Fires when an accordion item is expanded or collapsed. Receives the item value.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Collapsible content sections for FAQs, settings, or grouped information. Uses `component-accordion-*` tokens for background, border, and hover states. Supports keyboard navigation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => <AccordionRenderer {...(args as AccordionStoryProps)} />,
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        trigger: "How do I add a new brand?",
        content: "Add a new JSON file in tokens/brands/ with the brand slug, then run `npm run build` to generate the CSS variables and brand config.",
      },
    ],
  },
  render: (args) => <AccordionRenderer {...(args as AccordionStoryProps)} />,
};

export const ManyItems: Story = {
  args: {
    items: [
      { trigger: "What tokens are available?", content: "Over 1,000 design tokens covering colors, typography, spacing, borders, and component-specific values." },
      { trigger: "How do I sync with Figma?", content: "Run `npm run push-figma` to push the latest token values to Figma variables." },
      { trigger: "How do I sync with Pencil?", content: "Run `npm run push-pencil` to push tokens to Pencil variables." },
      { trigger: "What is the canonical name?", content: "The plain JSON key (e.g. `brand-1`). Tooling adds prefixes for each platform." },
      { trigger: "Where is the source of truth?", content: "The `tokens/` directory in Git is the single source of truth for all design tokens." },
    ],
  },
  render: (args) => <AccordionRenderer {...(args as AccordionStoryProps)} />,
};

export const WithHeadlineIndicatorStart: Story = {
  name: "With Headline / Indicator Start",
  args: {
    headline: "Accordion Headline",
    indicatorPosition: "start",
    width: "w-[612px]",
    items: [
      {
        trigger: "Lorem Ipsum is simply dummy text",
        content:
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      { trigger: "Why do we use it?", content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout." },
      { trigger: "Where does it come from?", content: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old." },
      { trigger: "Where can I get some?", content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable." },
      { trigger: "What are the accessibility considerations?", content: "Each item is keyboard-navigable via Tab and toggled with Enter or Space. Content panels use polite ARIA live regions so screen readers announce state changes cleanly." },
      { trigger: "Can multiple panels open at once?", content: "Yes. Pass `openMultiple` on the root `Accordion` to allow simultaneous open panels. The default only keeps one panel open at a time." },
    ],
  },
  render: (args) => <AccordionRenderer {...(args as AccordionStoryProps)} />,
  parameters: {
    docs: {
      description: {
        story:
          "Pencil spec: `size=sm, indicatorPosition=start, variant=default`. Pairs an optional headline with a 612px container and places the chevron at the start of each trigger row — commonly used for FAQs and editorial Q&A layouts.",
      },
    },
  },
};
