"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ArticleInlineImage {
  src: string;
  alt?: string;
  credit?: string;
  caption?: string;
}

export interface ArticleBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ArticleBody({ children, className }: ArticleBodyProps) {
  return (
    <div
      className={cn(
        "prose-article space-y-[var(--spacing-token-xl)]",
        "[&>p]:text-[length:var(--text-token-md)] [&>p]:leading-[1.8] [&>p]:text-foreground",
        "[&>p>strong]:font-semibold",
        "[&>p>em]:italic",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ArticleInlineImage({
  src,
  alt,
  credit,
  caption,
}: ArticleInlineImage) {
  return (
    <figure className="my-[var(--spacing-token-2xl)] space-y-[var(--spacing-token-xs)]">
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-auto rounded-lg object-cover"
      />
      {(caption || credit) && (
        <figcaption className="text-[length:var(--text-token-4xs)] text-muted-foreground">
          {caption && <span className="italic">{caption}</span>}
          {caption && credit && <span> </span>}
          {credit && <span>{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function ArticleSubheading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-[length:var(--text-token-2xl)] lg:text-[length:var(--text-token-3xl)] leading-tight headline mt-[var(--spacing-token-3xl)] mb-[var(--spacing-token-md)]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function ArticleFootnote({
  number,
  children,
  className,
}: {
  number: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "text-[length:var(--text-token-4xs)] text-muted-foreground italic leading-relaxed pl-[var(--spacing-token-md)] border-l-2 border-border my-[var(--spacing-token-xs)]",
        className
      )}
    >
      <sup className="font-semibold not-italic text-foreground mr-[var(--spacing-token-3xs)]">{number}.</sup>
      {children}
    </aside>
  );
}
