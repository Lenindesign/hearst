"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ArticleHeroProps {
  breadcrumbs: { label: string; href?: string }[];
  headline: string;
  dek?: string;
  image: string;
  imageAlt?: string;
  imageCredit?: string;
  className?: string;
}

export function ArticleHero({
  breadcrumbs,
  headline,
  dek,
  image,
  imageAlt,
  imageCredit,
  className,
}: ArticleHeroProps) {
  return (
    <header className={cn("space-y-[var(--spacing-token-xl)]", className)}>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-[var(--spacing-token-2xs)] text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest font-brand-secondary">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-muted-foreground">/</span>}
              <span className={i === breadcrumbs.length - 1 ? "text-primary" : "text-muted-foreground"}>
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      )}

      <h1 className="text-[length:var(--text-token-3xl)] lg:text-[length:var(--text-token-7xl)] leading-tight headline">
        {headline}
      </h1>

      {dek && (
        <p className="text-[length:var(--text-token-md)] lg:text-[length:var(--text-token-lg)] leading-relaxed text-muted-foreground">
          {dek}
        </p>
      )}

      <figure className="space-y-[var(--spacing-token-xs)]">
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={image}
            alt={imageAlt || headline}
            className="w-full h-auto object-cover"
          />
        </div>
        {imageCredit && (
          <figcaption className="text-[length:var(--text-token-4xs)] text-muted-foreground text-right">
            {imageCredit}
          </figcaption>
        )}
      </figure>
    </header>
  );
}
