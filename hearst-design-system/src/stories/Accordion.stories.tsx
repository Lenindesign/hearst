import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface AccordionStoryProps {
  items: { trigger: string; content: string }[];
  onValueChange: (value: unknown) => void;
}

function AccordionRenderer({ items, onValueChange }: AccordionStoryProps) {
  return (
    <div className="w-96">
      <Accordion onValueChange={onValueChange as never}>
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
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
