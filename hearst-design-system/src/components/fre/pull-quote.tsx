"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PullQuoteProps {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
}

export function PullQuote({ children, attribution, className }: PullQuoteProps) {
  return (
    <blockquote
      className={cn(
        "my-[var(--spacing-token-3xl)] border-l-4 border-primary pl-[var(--spacing-token-xl)] lg:pl-[var(--spacing-token-2xl)]",
        className
      )}
    >
      <p className="text-[length:var(--text-token-2xl)] lg:text-[length:var(--text-token-3xl)] leading-snug headline italic text-foreground">
        &ldquo;{children}&rdquo;
      </p>
      {attribution && (
        <cite className="mt-[var(--spacing-token-sm)] block text-[length:var(--text-token-2xs)] font-semibold not-italic text-muted-foreground uppercase tracking-wider font-brand-secondary">
          &mdash; {attribution}
        </cite>
      )}
    </blockquote>
  );
}
