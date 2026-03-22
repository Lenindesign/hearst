"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LinkComponent } from "@/components/ui/link";

export interface SiteHeaderProps {
  siteName: React.ReactNode;
  navItems: string[];
  showSearch?: boolean;
  showSignIn?: boolean;
  ctaLabel?: string;
  onNavClick?: (item: string) => void;
  onSearchClick?: () => void;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
  className?: string;
}

export function SiteHeader({
  siteName,
  navItems,
  showSearch = true,
  showSignIn = true,
  ctaLabel = "Subscribe",
  onNavClick,
  onSearchClick,
  onSignInClick,
  onCtaClick,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-3 border-b border-border bg-background font-brand",
        className
      )}
    >
      <div className="flex items-center gap-6">
        <div className="text-[22px] font-extrabold font-headline italic tracking-tight">
          {siteName}
        </div>
        <nav className="flex gap-5 text-[13px] font-medium">
          {navItems.map((item) => (
            <LinkComponent
              key={item}
              variant="neutral"
              underline={false}
              size="sm"
              className="font-medium"
              onClick={() => onNavClick?.(item)}
            >
              {item}
            </LinkComponent>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4 text-[13px]">
        {showSearch && (
          <LinkComponent variant="neutral" underline={false} size="sm" onClick={onSearchClick}>
            Search
          </LinkComponent>
        )}
        {showSignIn && (
          <LinkComponent variant="neutral" underline={false} size="sm" onClick={onSignInClick}>
            Sign In
          </LinkComponent>
        )}
        {ctaLabel && (
          <Button size="sm" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        )}
      </div>
    </header>
  );
}
