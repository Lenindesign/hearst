"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardTitle,
} from "@/components/ui/article-card";
import { Separator } from "@/components/ui/separator";

export interface RelatedArticle {
  title: string;
  image: string;
  href?: string;
}

export interface RelatedArticlesProps {
  title?: string;
  articles: RelatedArticle[];
  className?: string;
}

export function RelatedArticles({
  title = "Readers Also Read",
  articles,
  className,
}: RelatedArticlesProps) {
  return (
    <section className={cn("space-y-[var(--spacing-token-xl)]", className)}>
      <Separator />
      <h2 className="text-[length:var(--text-token-2xl)] headline">{title}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-token-md)]">
        {articles.map((article, i) => (
          <ArticleCard
            key={i}
            layout="vertical"
            size="sm"
            className="cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent"
          >
            <ArticleCardImage
              src={article.image}
              aspectRatio="4/3"
              className="rounded-lg"
            />
            <ArticleCardContent className="px-0 pt-[var(--spacing-token-xs)]">
              <ArticleCardTitle className="text-[length:var(--text-token-xs)] leading-snug headline">
                {article.title}
              </ArticleCardTitle>
            </ArticleCardContent>
          </ArticleCard>
        ))}
      </div>
    </section>
  );
}
