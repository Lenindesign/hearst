"use client";

import { cn } from "@/lib/utils";
import { DollarSign } from "@/components/ui/icons";

export interface Offer {
  label: string;
  expires?: string;
}

interface SpecialOffersProps {
  title?: string;
  offers: Offer[];
  className?: string;
}

export function SpecialOffers({
  title = "Special Offers and Incentives",
  offers,
  className,
}: SpecialOffersProps) {
  if (offers.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={title || "Special offers"}
      className={cn(
        "rounded-lg border border-[var(--component-special-offers-border-default)] bg-gradient-to-b from-[var(--component-special-offers-background-start)] to-[var(--component-special-offers-background-end)] p-4",
        className
      )}
    >
      {title && (
        <p className="mb-3 text-xs font-medium tracking-wide text-[var(--component-special-offers-title-content-default)] uppercase">
          {title}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {offers.map((offer, i) => (
          <OfferPill key={i} offer={offer} />
        ))}
      </div>
    </div>
  );
}

function OfferPill({ offer }: { offer: Offer }) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-2.5 rounded-full border border-[var(--component-special-offers-pill-border-default)] bg-[var(--component-special-offers-pill-background-default)] px-4 py-2 sm:flex-nowrap">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--component-special-offers-icon-background-default)] text-[var(--component-special-offers-content-default)]">
        <DollarSign className="h-3.5 w-3.5" strokeWidth={3} />
      </span>

      <span className="min-w-0 text-sm font-semibold text-[var(--component-special-offers-content-default)] sm:whitespace-nowrap">
        {offer.label}
      </span>

      {offer.expires && (
        <span className="text-xs text-[var(--component-special-offers-expiration-content-default)] whitespace-nowrap">
          expires {offer.expires}
        </span>
      )}
    </div>
  );
}
