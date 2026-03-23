"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface ArticleBylineProps {
  author: string;
  photographedBy?: string;
  publishedDate: string;
  className?: string;
}

export function ArticleByline({
  author,
  photographedBy,
  publishedDate,
  className,
}: ArticleBylineProps) {
  return (
    <div className={cn("space-y-[var(--spacing-token-md)]", className)}>
      <Separator />
      <div className="flex flex-wrap items-baseline gap-x-[var(--spacing-token-2xs)] text-[length:var(--text-token-2xs)] leading-relaxed">
        <span className="font-semibold text-foreground">By {author}</span>
        {photographedBy && (
          <>
            <span className="text-muted-foreground">and</span>
            <span className="font-semibold text-foreground">Photographed by {photographedBy}</span>
          </>
        )}
        <span className="text-muted-foreground">Published: {publishedDate}</span>
      </div>
      <Separator />
    </div>
  );
}
