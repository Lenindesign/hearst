import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HomePageTemplate } from "@/components/hearst-plus";

function HDSHPModulesExample() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <HomePageTemplate />
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/HDS HP Modules",
  component: HDSHPModulesExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Reference composition of the current publication homepage modules used across Hearst production sites. Use the publication selector to review how the shared HDS architecture applies each brand's typography, color tokens, navigation, story lists, hero treatment, rails, and advertising surfaces.",
      },
    },
  },
} satisfies Meta<typeof HDSHPModulesExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicationHomepage: Story = {
  name: "Publication homepage modules",
  render: (_args, context) => (
    <HDSHPModulesExample key={context.globals.brand} />
  ),
};
