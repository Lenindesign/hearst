import type { Metadata } from "next";
import Link from "next/link";

import { SINGLE_BRANDS } from "@/templates/single-brand-feed";

export const metadata: Metadata = {
  title: "Single-Brand Destinations — Hearst+",
  description:
    "The Hearst+ template limited to a single brand at a time: Delish, Cosmopolitan, Redbook.",
};

export default function SingleBrandIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Hearst+ Single-Brand Destinations</h1>
      <p className="mt-2 text-muted-foreground">
        The Hearst+ experience limited to one brand at a time — same layout,
        river, and modal reader, scoped to a single brand&apos;s feed and theme.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {SINGLE_BRANDS.map((brand) => (
          <li key={brand.slug}>
            <Link
              href={`/single-brand/${brand.slug}`}
              className="block rounded-xl border border-border p-5 transition-colors hover:bg-muted"
            >
              <span className="text-lg font-semibold">{brand.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
