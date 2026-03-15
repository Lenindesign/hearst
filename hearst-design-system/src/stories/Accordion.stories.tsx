import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the Hearst Design System?</AccordionTrigger>
          <AccordionContent>
            A multi-brand design system powering 29 Hearst magazine brands with shared components and brand-specific theming.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do brand themes work?</AccordionTrigger>
          <AccordionContent>
            Each brand has its own set of design tokens (colors, fonts, radii) injected as CSS variables. Components adapt automatically.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I use this with any framework?</AccordionTrigger>
          <AccordionContent>
            Yes. The component library outputs standard React components that work with Next.js, Vite, or any React setup.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
