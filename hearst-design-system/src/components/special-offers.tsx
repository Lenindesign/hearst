"use client";

import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";

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
  return (
    <div
      className={cn(
        "rounded-lg border border-emerald-700/60 bg-gradient-to-b from-emerald-950/80 to-emerald-950/40 p-4",
        className
      )}
    >
      {title && (
        <p className="mb-3 text-xs font-medium tracking-wide text-emerald-400/60 uppercase">
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
    <div className="flex items-center gap-2.5 rounded-full bg-emerald-950/90 border border-emerald-800/40 px-4 py-2">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <DollarSign className="h-3.5 w-3.5" strokeWidth={3} />
      </span>

      <span className="text-sm font-semibold text-white whitespace-nowrap">
        {offer.label}
      </span>

      {offer.expires && (
        <span className="text-xs text-emerald-300/50 whitespace-nowrap">
          expires {offer.expires}
        </span>
      )}
    </div>
  );
}
