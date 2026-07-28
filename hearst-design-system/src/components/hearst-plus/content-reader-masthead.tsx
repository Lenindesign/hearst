"use client";

import React from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { SpinnerGap, X } from "@/components/ui/icons";
import { LinkComponent } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { ReaderMastheadCarousel } from "./reader-masthead-carousel";

export interface ContentReaderMastheadItem {
  key: string;
  label: string;
  active: boolean;
  disabled: boolean;
  loading?: boolean;
}

export interface ContentReaderFilterItem {
  label: string;
  active: boolean;
  disabled: boolean;
}

interface ContentReaderMastheadProps {
  logoHref: string;
  contextLabel: string;
  logoSlug: string;
  logoColor?: string;
  visibleStoryCount: number;
  storyCount: number;
  activeMastheadKey?: string;
  mastheadItems: ContentReaderMastheadItem[];
  mastheadNavigationLabel: string;
  filterItems: ContentReaderFilterItem[];
  sectionLabel: string;
  onSelectMastheadItem: (key: string) => void | Promise<void>;
  onSelectFilter: (label: string) => void;
  onClose: () => void;
}

export function ContentReaderMasthead({
  logoHref,
  contextLabel,
  logoSlug,
  logoColor,
  visibleStoryCount,
  storyCount,
  activeMastheadKey,
  mastheadItems,
  mastheadNavigationLabel,
  filterItems,
  sectionLabel,
  onSelectMastheadItem,
  onSelectFilter,
  onClose,
}: ContentReaderMastheadProps) {
  return (
    <div className="sticky top-0 z-[110] border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 border-b border-border/70 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <LinkComponent
            href={logoHref}
            variant="neutral"
            underline={false}
            className="flex h-6 min-w-0 max-w-[230px] flex-1 items-center rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-7 sm:flex-none sm:basis-[230px]"
            aria-label={`Go to ${contextLabel} homepage`}
            data-reader-logo-link
          >
            <BrandLogo
              slug={logoSlug}
              color={logoColor}
              className="flex h-full w-full items-center justify-start [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-full lg:[&_svg]:w-auto"
            />
          </LinkComponent>
          <div className="hidden min-w-0 border-l border-border pl-4 sm:block">
            <p className="truncate text-xs font-bold text-foreground">
              Reading {contextLabel}
            </p>
            <p className="mt-0.5 truncate text-xs text-[var(--hp-text-ui)]">
              {visibleStoryCount} of {storyCount} stories loaded
            </p>
          </div>
        </div>
        <ReaderMastheadCarousel
          activeKey={activeMastheadKey}
          ariaLabel={mastheadNavigationLabel}
        >
          {mastheadItems.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              onClick={() => void onSelectMastheadItem(item.key)}
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                item.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary",
              )}
              aria-label={
                item.loading
                  ? `Loading ${item.label} stories`
                  : `Show ${item.label} stories in reader`
              }
              aria-current={item.active ? "page" : undefined}
              aria-busy={item.loading || undefined}
              data-reader-masthead-key={item.key}
            >
              {item.loading ? (
                <SpinnerGap
                  className="h-3.5 w-3.5 motion-safe:animate-spin"
                  aria-hidden
                />
              ) : null}
              {item.label}
              {item.loading ? (
                <span className="sr-only" role="status" aria-live="polite">
                  Loading {item.label} stories
                </span>
              ) : null}
            </button>
          ))}
        </ReaderMastheadCarousel>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close story reader"
          data-reader-close
          className="h-11 w-11 sm:h-7 sm:w-7"
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      <nav
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={`${sectionLabel} reader sections`}
      >
        <div className="mx-auto flex min-w-max items-center gap-6 px-4 sm:justify-center sm:px-6">
          {filterItems.map((filter) => (
            <button
              key={filter.label}
              type="button"
              disabled={filter.disabled}
              onClick={() => onSelectFilter(filter.label)}
              className={cn(
                "whitespace-nowrap border-b-2 px-0.5 py-3 text-sm transition-colors",
                filter.active
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-foreground hover:border-primary/40 hover:text-primary",
                filter.disabled && "cursor-not-allowed opacity-40",
              )}
              aria-current={filter.active ? "page" : undefined}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
