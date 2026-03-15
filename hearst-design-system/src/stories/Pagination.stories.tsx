import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "@/components/ui/pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  argTypes: {
    size: { control: "select", options: ["md", "sm"] },
    totalPages: { control: { type: "number", min: 1, max: 50 } },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function PaginationDemo({ totalPages = 10, size = "md" }: { totalPages?: number; size?: "md" | "sm" }) {
  const [page, setPage] = useState(1);
  return <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} size={size} />;
}

export const Default: Story = {
  render: () => <PaginationDemo />,
};

export const Small: Story = {
  render: () => <PaginationDemo size="sm" />,
};

export const FewPages: Story = {
  render: () => <PaginationDemo totalPages={3} />,
};

export const ManyPages: Story = {
  render: () => <PaginationDemo totalPages={30} />,
};
