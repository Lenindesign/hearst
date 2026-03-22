"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardEyebrow,
  ArticleCardTitle,
  ArticleCardMeta,
  ArticleCardMetaDot,
  ArticleCardAuthor,
  ArticleCardMetaItem,
} from "@/components/ui/article-card";
import { Separator } from "@/components/ui/separator";

/* ─── Big Story Feed / Column Right ─── */

export interface BigStoryFeedColRightProps {
  heroTitle: string;
  heroImage: string;
  heroHeight?: number;
  sidebarItems: { title: string; image: string }[];
  onHeroClick?: () => void;
  onSidebarClick?: (title: string) => void;
  className?: string;
}

export function BigStoryFeedColRight({
  heroTitle,
  heroImage,
  heroHeight = 420,
  sidebarItems,
  onHeroClick,
  onSidebarClick,
  className,
}: BigStoryFeedColRightProps) {
  return (
    <div className={cn("grid grid-cols-[1fr_360px] gap-6", className)}>
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer"
        onClick={onHeroClick}
      >
        <img
          src={heroImage}
          alt="Hero"
          className="w-full object-cover block"
          style={{ height: heroHeight }}
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-8 bg-gradient-to-t from-black/75 to-transparent text-white">
          <h2 className="text-[28px] leading-tight headline">{heroTitle}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {sidebarItems.map((item, i) => (
          <ArticleCard
            key={i}
            layout="horizontal"
            size="sm"
            className="cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent"
            onClick={() => onSidebarClick?.(item.title)}
          >
            <ArticleCardImage src={item.image} aspectRatio="4/3" className="!w-[100px] !min-h-[72px]" />
            <ArticleCardContent>
              <ArticleCardTitle className="text-sm">{item.title}</ArticleCardTitle>
            </ArticleCardContent>
          </ArticleCard>
        ))}
      </div>
    </div>
  );
}

/* ─── Big Story Feed / Stacked ─── */

export interface BigStoryFeedStackedProps {
  items: { title: string; eyebrow?: string; author?: string; date: string; image: string }[];
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  headlineFontSize?: number;
  showDividers?: boolean;
  onArticleClick?: (title: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function BigStoryFeedStacked({
  items,
  thumbnailWidth = 200,
  thumbnailHeight = 140,
  headlineFontSize,
  showDividers = true,
  onArticleClick,
  style,
  className,
}: BigStoryFeedStackedProps) {
  const titleSize = headlineFontSize && headlineFontSize <= 14 ? "text-sm" : "text-base";

  return (
    <div className={cn("flex flex-col gap-5 max-w-[680px]", className)} style={style}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ArticleCard
            layout="horizontal"
            size="sm"
            className="cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent"
            onClick={() => onArticleClick?.(item.title)}
          >
            <ArticleCardImage
              src={item.image}
              aspectRatio="4/3"
              className="rounded-md"
              style={{ width: thumbnailWidth, height: thumbnailHeight, minHeight: thumbnailHeight }}
            />
            <ArticleCardContent className="justify-center">
              {item.eyebrow && (
                <ArticleCardEyebrow>{item.eyebrow}</ArticleCardEyebrow>
              )}
              <ArticleCardTitle className={titleSize}>
                {item.title}
              </ArticleCardTitle>
              {(item.author || item.date) && (
                <ArticleCardMeta>
                  {item.author && <ArticleCardAuthor>By {item.author}</ArticleCardAuthor>}
                  {item.author && item.date && <ArticleCardMetaDot />}
                  {item.date && <ArticleCardMetaItem>{item.date}</ArticleCardMetaItem>}
                </ArticleCardMeta>
              )}
            </ArticleCardContent>
          </ArticleCard>
          {showDividers && i < items.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
}
