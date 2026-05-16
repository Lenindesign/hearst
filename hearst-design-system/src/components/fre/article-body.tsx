"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ArticleInlineImage {
  src: string;
  alt?: string;
  credit?: string;
  caption?: string;
  variant?: "default" | "wide";
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
  variant = "default",
}: ArticleInlineImage) {
  const isWide = variant === "wide";

  return (
    <figure
      className={cn(
        "my-[var(--spacing-token-2xl)] space-y-[var(--spacing-token-xs)]",
        isWide && "relative left-1/2 w-screen max-w-none -translate-x-1/2 py-[var(--spacing-token-xl)]",
      )}
    >
      <img
        src={src}
        alt={alt || ""}
        className={cn(
          "h-auto w-full object-cover",
          isWide ? "max-h-[78vh] rounded-none" : "rounded-lg",
        )}
      />
      {(caption || credit) && (
        <figcaption className={cn("text-[length:var(--text-token-4xs)] text-muted-foreground", isWide && "mx-auto max-w-[var(--width-content-max)] px-4 md:px-6 lg:px-12")}>
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
