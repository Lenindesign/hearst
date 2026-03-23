"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type AdSize = "leaderboard" | "medium-rectangle" | "half-page" | "billboard" | "inline";

const adDimensions: Record<AdSize, { width: number; height: number; label: string }> = {
  leaderboard:       { width: 728, height: 90,  label: "Leaderboard 728×90" },
  "medium-rectangle": { width: 300, height: 250, label: "Med Rect 300×250" },
  "half-page":       { width: 300, height: 600, label: "Half Page 300×600" },
  billboard:         { width: 970, height: 250, label: "Billboard 970×250" },
  inline:            { width: 0,   height: 250, label: "Inline Ad" },
};

export interface AdPlaceholderProps {
  size: AdSize;
  className?: string;
}

export function AdPlaceholder({ size, className }: AdPlaceholderProps) {
  const { width, height, label } = adDimensions[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center border-2 border-dashed border-muted-foreground/20 bg-muted/30 rounded-sm",
        className
      )}
      style={{
        width: width > 0 ? `${width}px` : "100%",
        height: `${height}px`,
        maxWidth: "100%",
      }}
    >
      <div className="text-center space-y-1">
        <p className="text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Advertisement
        </p>
        <p className="text-[length:var(--text-token-4xs)] text-muted-foreground/40">
          {label}
        </p>
      </div>
    </div>
  );
}
