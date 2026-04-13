"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardEyebrow,
  ArticleCardTitle,
  ArticleCardDescription,
  ArticleCardMeta,
  ArticleCardMetaDot,
  ArticleCardAuthor,
  ArticleCardMetaItem,
} from "@/components/ui/article-card";

/* ─── Big Story / Image Right ─── */

export interface BigStoryImageRightProps {
  label: string;
  headline: string;
  description: string;
  author: string;
  date: string;
  image: string;
  headlineFontSize?: number;
  headlineLineHeight?: number;
  imageHeight?: number;
  imagePosition?: "right" | "top";
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2";
  onArticleClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function BigStoryImageRight({
  label,
  headline,
  description,
  author,
  date,
  image,
  headlineFontSize,
  headlineLineHeight,
  imageHeight = 360,
  imagePosition = "right",
  aspectRatio,
  onArticleClick,
  style,
  className,
}: BigStoryImageRightProps) {
  const isTop = imagePosition === "top";
  const headlineClass = headlineFontSize
    ? ""
    : isTop ? "text-2xl lg:text-[length:var(--text-token-5xl)]" : "text-2xl lg:text-4xl";

  return (
    <ArticleCard
      layout={isTop ? "vertical" : "horizontal"}
      size="lg"
      className={cn(
        "cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent",
        !isTop && "!grid grid-cols-[1fr_auto] gap-6 items-center",
        className
      )}
      style={style}
      onClick={onArticleClick}
    >
      {isTop && (
        <ArticleCardImage
          src={image}
          aspectRatio={aspectRatio ?? "16/9"}
          className="rounded-lg"
          style={aspectRatio ? undefined : { height: imageHeight }}
        />
      )}
      <ArticleCardContent className={cn(isTop ? "px-0" : "px-0 py-0")}>
        <ArticleCardEyebrow>{label}</ArticleCardEyebrow>
        <ArticleCardTitle
          className={cn("leading-tight", headlineClass)}
          style={headlineFontSize ? { fontSize: headlineFontSize, ...(headlineLineHeight ? { lineHeight: `${headlineLineHeight}px` } : {}) } : undefined}
        >
          {headline}
        </ArticleCardTitle>
        <ArticleCardDescription className="line-clamp-none">
          {description}
        </ArticleCardDescription>
        {(author || date) && (
          <ArticleCardMeta>
            {author && <ArticleCardAuthor>By {author}</ArticleCardAuthor>}
            {author && date && <ArticleCardMetaDot />}
            {date && <ArticleCardMetaItem>{date}</ArticleCardMetaItem>}
          </ArticleCardMeta>
        )}
      </ArticleCardContent>
      {!isTop && (
        <ArticleCardImage
          src={image}
          aspectRatio={aspectRatio ?? "4/3"}
          className="rounded-lg !w-[200px] sm:!w-[260px]"
          style={aspectRatio ? undefined : { height: imageHeight }}
        />
      )}
    </ArticleCard>
  );
}

/* ─── Big Story / Text Only ─── */

export interface BigStoryTextOnlyProps {
  label: string;
  headline: string;
  description: string;
  author: string;
  date: string;
  headlineFontSize?: number;
  headlineLineHeight?: number;
  showBorderTop?: boolean;
  onArticleClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function BigStoryTextOnly({
  label,
  headline,
  description,
  author,
  date,
  headlineFontSize,
  headlineLineHeight,
  showBorderTop = true,
  onArticleClick,
  style,
  className,
}: BigStoryTextOnlyProps) {
  const headlineClass = headlineFontSize ? "" : "text-3xl lg:text-[length:var(--text-token-7xl)]";

  return (
    <ArticleCard
      layout="vertical"
      size="lg"
      className={cn(
        "cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent max-w-[720px] py-10",
        showBorderTop && "border-t-[3px] border-primary",
        className
      )}
      style={style}
      onClick={onArticleClick}
    >
      <ArticleCardContent className="px-0">
        <ArticleCardEyebrow>{label}</ArticleCardEyebrow>
        <ArticleCardTitle
          className={cn("leading-tight", headlineClass)}
          style={headlineFontSize ? { fontSize: headlineFontSize, ...(headlineLineHeight ? { lineHeight: `${headlineLineHeight}px` } : {}) } : undefined}
        >
          {headline}
        </ArticleCardTitle>
        <ArticleCardDescription className="text-base line-clamp-none">
          {description}
        </ArticleCardDescription>
        <ArticleCardMeta>
          <ArticleCardAuthor>By {author}</ArticleCardAuthor>
          <ArticleCardMetaDot />
          <ArticleCardMetaItem>{date}</ArticleCardMetaItem>
        </ArticleCardMeta>
      </ArticleCardContent>
    </ArticleCard>
  );
}
