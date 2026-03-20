import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Pagination } from "@/components/ui/pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  argTypes: {
    size: {
      control: "select",
      options: ["md", "sm"],
      description: "Pagination size. Use `sm` in compact layouts.",
      table: { category: "Appearance", defaultValue: { summary: "md" } },
    },
    totalPages: {
      control: { type: "number", min: 1, max: 50 },
      description: "Total number of pages. Controls how many page buttons appear.",
      table: { category: "Content" },
    },
    currentPage: {
      control: { type: "number", min: 1, max: 50 },
      description: "Currently active page (1-indexed).",
      table: { category: "State" },
    },
    onPageChange: {
      action: "page-change",
      description: "Fires when a page is selected. Receives the page number.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Page navigation for multi-page content like article feeds and search results. Automatically truncates with ellipsis for large page counts. Uses `--brand-primary` for the active page indicator.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function PaginationDemo({
  totalPages = 10,
  size = "md",
  onPageChange,
}: {
  totalPages?: number;
  size?: "md" | "sm";
  onPageChange?: (page: number) => void;
}) {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={(p) => {
        setPage(p);
        onPageChange?.(p);
      }}
      size={size}
    />
  );
}

export const Default: Story = {
  args: { totalPages: 10, size: "md" },
  render: (args) => (
    <PaginationDemo
      totalPages={args.totalPages}
      size={args.size}
      onPageChange={args.onPageChange}
    />
  ),
};

export const Small: Story = {
  args: { totalPages: 10, size: "sm" },
  render: (args) => (
    <PaginationDemo
      totalPages={args.totalPages}
      size={args.size}
      onPageChange={args.onPageChange}
    />
  ),
};

export const FewPages: Story = {
  args: { totalPages: 3, size: "md" },
  render: (args) => (
    <PaginationDemo
      totalPages={args.totalPages}
      size={args.size}
      onPageChange={args.onPageChange}
    />
  ),
};

export const ManyPages: Story = {
  args: { totalPages: 30, size: "md" },
  render: (args) => (
    <PaginationDemo
      totalPages={args.totalPages}
      size={args.size}
      onPageChange={args.onPageChange}
    />
  ),
};
