"use client";

import Image from "next/image";

import type { ContextualAdUnit } from "@/components/hearst-plus/content-reader-advertisement";

export type ContextualRiverAdvertisementProps = {
  ad?: ContextualAdUnit | null;
};

export function ContextualRiverAdvertisement({
  ad,
}: ContextualRiverAdvertisementProps) {
  if (!ad) return null;

  return (
    <article
      className="grid min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      aria-label={`Advertisement: ${ad.sponsor} — ${ad.title}`}
      style={{
        backgroundColor: ad.palette.background,
        color: ad.palette.foreground,
      }}
    >
      <div className="relative aspect-video min-w-0 overflow-hidden">
        <Image
          src={ad.imageUrl}
          alt=""
          width={704}
          height={396}
          sizes="(max-width: 1024px) 100vw, 640px"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/75"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 text-white">
          <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest">
            Advertisement
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black shadow-sm"
            style={{ backgroundColor: ad.palette.accent, color: "#fff" }}
            aria-hidden="true"
          >
            AD
          </span>
        </div>
        <p className="absolute inset-x-0 bottom-0 p-4 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-white">
          {ad.creativeLabel}
        </p>
      </div>

      <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest"
              style={{ color: ad.palette.accent }}
            >
              {ad.sponsor}
            </span>
          </div>
          <h2 className="headline mt-3 break-words text-2xl leading-tight sm:text-[1.7rem]">
            {ad.title}
          </h2>
          <p className="mt-3 text-sm leading-6 opacity-80">{ad.summary}</p>
        </div>

        <div
          className="mt-5 border-t pt-4"
          style={{ borderColor: ad.palette.soft }}
        >
          {ad.ctaHref ? (
            <a
              href={ad.ctaHref}
              aria-label={`${ad.cta}: ${ad.title}`}
              className="inline-flex min-h-11 items-center justify-center rounded-[4px] border px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              style={{
                borderColor: ad.palette.accent,
                backgroundColor: ad.palette.soft,
                color: ad.palette.foreground,
              }}
            >
              {ad.cta}
            </a>
          ) : (
            <div
              className="inline-flex min-h-11 flex-col justify-center rounded-[4px] border px-3 py-2"
              style={{
                borderColor: ad.palette.soft,
                backgroundColor: ad.palette.soft,
                color: ad.palette.foreground,
              }}
              aria-label={`Prototype CTA unavailable: ${ad.cta}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Prototype creative
              </span>
              <span className="mt-0.5 text-xs font-semibold">
                {ad.cta} · Destination not connected
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
