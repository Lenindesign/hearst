import Image from "next/image";

import { cn } from "@/lib/utils";

export type DisplayAdCreative = {
  id: string;
  advertiser: string;
  /** Describes the creative for screen readers, including its message. */
  alt: string;
  imageUrl: string;
  width: number;
  height: number;
  href?: string;
};

/** Toyota Certified Used Vehicles half-page (300 × 600) sample creative. */
export const toyotaCertifiedUsedHalfPage: DisplayAdCreative = {
  id: "toyota-certified-used-300x600",
  advertiser: "Toyota",
  alt: "Toyota Certified Used Vehicles. Over 8 million sold so far. Find out why. Learn more.",
  imageUrl: "/images/ads/toyota-certified-used-300x600.png",
  width: 300,
  height: 600,
};

export type DisplayAdvertisementProps = {
  creative: DisplayAdCreative;
  className?: string;
};

/**
 * Fixed-size IAB display unit (e.g. 300 × 600 half page) for the right rail.
 * The creative renders at its native size, centered. The aside carries an
 * "Advertisement" accessible name; the creative itself shows the ad marking.
 */
export function DisplayAdvertisement({ creative, className }: DisplayAdvertisementProps) {
  const image = (
    <Image
      src={creative.imageUrl}
      alt={creative.alt}
      width={creative.width}
      height={creative.height}
      className="block h-auto w-full rounded-[8px]"
      unoptimized
    />
  );

  return (
    <aside
      aria-label={`Advertisement: ${creative.advertiser}`}
      data-ad-format="display"
      className={cn("mx-auto w-full min-w-0", className)}
      style={{ maxWidth: creative.width }}
    >
      {creative.href ? (
        <a
          href={creative.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {image}
        </a>
      ) : (
        image
      )}
    </aside>
  );
}
