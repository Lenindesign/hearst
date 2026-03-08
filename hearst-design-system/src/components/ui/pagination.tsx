"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

function generatePages(
  current: number,
  total: number,
  maxVisible: number = 7
): (number | "ellipsis")[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const leftBound = Math.max(2, current - 1);
  const rightBound = Math.min(total - 1, current + 1);

  if (leftBound > 2) pages.push("ellipsis");
  for (let i = leftBound; i <= rightBound; i++) pages.push(i);
  if (rightBound < total - 1) pages.push("ellipsis");
  if (total > 1) pages.push(total);

  return pages;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: "md" | "sm";
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  size = "md",
  className,
}: PaginationProps) {
  const pages = generatePages(currentPage, totalPages);
  const isMd = size === "md";
  const btnSize = isMd ? "size-8" : "size-6";
  const textSize = isMd ? "text-sm" : "text-xs";

  return (
    <nav
      className={cn("flex items-center gap-2", className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          btnSize,
          "rounded-full border border-border flex items-center justify-center transition-colors",
          "hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className={isMd ? "size-5" : "size-4"} />
      </button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`ell-${i}`}
            className={cn(
              btnSize,
              textSize,
              "flex items-center justify-center font-bold select-none"
            )}
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              btnSize,
              textSize,
              "rounded-full flex items-center justify-center transition-colors",
              page === currentPage
                ? "bg-foreground text-background font-bold"
                : "hover:bg-muted font-normal"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          btnSize,
          "rounded-full border border-border flex items-center justify-center transition-colors",
          "hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        )}
        aria-label="Next page"
      >
        <ChevronRight className={isMd ? "size-5" : "size-4"} />
      </button>
    </nav>
  );
}

export { Pagination, generatePages };
