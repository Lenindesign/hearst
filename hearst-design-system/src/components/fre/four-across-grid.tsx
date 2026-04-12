"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardTitle,
  ArticleCardMeta,
  ArticleCardMetaItem,
} from "@/components/ui/article-card";
import { LinkComponent } from "@/components/ui/link";

export interface FourAcrossGridProps {
  items: { title: string; image: string; subtitle?: string }[];
  columns?: number;
  gap?: number;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2";
  showNumbers?: boolean;
  onCardClick?: (title: string) => void;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export function FourAcrossGrid({
  items,
  columns = 4,
  gap,
  aspectRatio = "4/3",
  showNumbers = false,
  onCardClick,
  style,
  className,
  responsive = true,
}: FourAcrossGridProps) {
  const responsiveClass = responsive
    ? columns <= 3
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      : columns === 5
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        : "grid-cols-2 md:grid-cols-4"
    : "";

  return (
    <div
      className={cn("grid", responsiveClass, className)}
      style={{
        ...(!responsive ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {}),
        gap: gap ?? "var(--space-lg, 20px)",
        ...style,
      }}
    >
      {items.map((item, i) => (
        <ArticleCard
          key={i}
          layout="vertical"
          size="sm"
          className="cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent"
          onClick={() => onCardClick?.(item.title)}
        >
          <div className="relative">
            <ArticleCardImage src={item.image} aspectRatio={aspectRatio} className="rounded-lg" />
            {showNumbers && (
              <div className="absolute top-2 left-2 z-20 flex size-[var(--space-xl,24px)] items-center justify-center rounded-full text-xs font-bold bg-primary text-primary-foreground">
                {i + 1}
              </div>
            )}
          </div>
          <ArticleCardContent className="px-0 pt-0">
            <LinkComponent variant="neutral" underline={false} size="sm" className="font-semibold leading-snug headline">
              {item.title}
            </LinkComponent>
            {item.subtitle && (
              <ArticleCardMeta>
                <ArticleCardMetaItem>{item.subtitle}</ArticleCardMetaItem>
              </ArticleCardMeta>
            )}
          </ArticleCardContent>
        </ArticleCard>
      ))}
    </div>
  );
}
