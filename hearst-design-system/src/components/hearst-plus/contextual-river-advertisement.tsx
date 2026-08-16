"use client";

import Image from "next/image";
import * as React from "react";

import type { ContextualAdUnit } from "@/components/hearst-plus/content-reader-advertisement";
import { Car, DollarSign, Sparkles, TrendingUp } from "@/components/ui/icons";

export type ContextualRiverAdvertisementProps = {
  ad?: ContextualAdUnit | null;
};

export function ContextualRiverAdvertisement({
  ad,
}: ContextualRiverAdvertisementProps) {
  if (!ad) return null;

  if (ad.id === "autos-cd-deal-score") {
    return <CarAndDriverDealScoreCard ad={ad} />;
  }

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

type DealScoreVehicle = {
  id: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  imageUrl: string;
  score: number;
  verdict: string;
  targetRange: string;
  askingPrice: string;
  guidance: string;
  signals: { label: string; value: string }[];
};

const dealScoreVehicles: DealScoreVehicle[] = [
  {
    id: "2026-honda-cr-v-hybrid-sport-touring",
    year: "2026",
    make: "Honda",
    model: "CR-V Hybrid",
    trim: "Sport Touring AWD",
    imageUrl:
      "https://hips.hearstapps.com/mtg-prod/68f7e39e42ad0d0002a0414e/003-2026-honda-crv-hybrid-sport-touring.jpg",
    score: 87,
    verdict: "Strong buy if the dealer lands inside the target range.",
    targetRange: "$38.7K-$40.1K",
    askingPrice: "$41.3K",
    guidance:
      "Ask for $1,800 off before financing. The market supports a better price, but the incentive window is time-sensitive.",
    signals: [
      { label: "Incentives", value: "$1,250 active" },
      { label: "Inventory", value: "High supply nearby" },
      { label: "Price trend", value: "Down 3.8% in 30 days" },
      { label: "Demand", value: "Moderate shopper interest" },
    ],
  },
  {
    id: "2025-chevrolet-equinox-rs",
    year: "2025",
    make: "Chevrolet",
    model: "Equinox",
    trim: "RS AWD",
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2025-chevrolet-equinox-rs-awd-132-67110e2133505.jpg",
    score: 82,
    verdict: "Good deal if the discount survives the finance desk.",
    targetRange: "$32.2K-$33.6K",
    askingPrice: "$34.5K",
    guidance:
      "Open with $1,200 off and keep the payment term flexible. Similar listings are moving, but nearby supply gives the shopper leverage.",
    signals: [
      { label: "Incentives", value: "$750 active" },
      { label: "Inventory", value: "Healthy local supply" },
      { label: "Price trend", value: "Down 2.1% in 30 days" },
      { label: "Demand", value: "Steady shopper interest" },
    ],
  },
  {
    id: "2027-kia-sportage-hybrid-sx-prestige",
    year: "2027",
    make: "Kia",
    model: "Sportage Hybrid",
    trim: "SX Prestige AWD",
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/ab5611fc-d193-4368-bf4e-fe5560ee75fd.jpg",
    score: 74,
    verdict: "Fair offer, but wait for a cleaner incentive stack.",
    targetRange: "$36.9K-$38.0K",
    askingPrice: "$38.7K",
    guidance:
      "Push for $900 off or a dealer accessory credit. Demand is stronger here, so the best move is comparing two nearby offers.",
    signals: [
      { label: "Incentives", value: "$500 active" },
      { label: "Inventory", value: "Limited AWD supply" },
      { label: "Price trend", value: "Flat over 30 days" },
      { label: "Demand", value: "High shopper interest" },
    ],
  },
  {
    id: "2027-lucid-gravity-gt-s",
    year: "2027",
    make: "Lucid",
    model: "Gravity",
    trim: "GT-S AWD",
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/df1a3d12-34f0-4527-a421-c93b85ecd97c.png",
    score: 69,
    verdict: "Watchlist deal until inventory opens up.",
    targetRange: "$117.5K-$120.0K",
    askingPrice: "$123.4K",
    guidance:
      "Do not chase the first quote. Save this offer, request an out-the-door number, and revisit when more local inventory appears.",
    signals: [
      { label: "Incentives", value: "No major offers" },
      { label: "Inventory", value: "Scarce nearby" },
      { label: "Price trend", value: "Up 1.4% in 30 days" },
      { label: "Demand", value: "Very high interest" },
    ],
  },
];

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function CarAndDriverDealScoreCard({ ad }: { ad: ContextualAdUnit }) {
  const [selectedYear, setSelectedYear] = React.useState(dealScoreVehicles[0].year);
  const [selectedMake, setSelectedMake] = React.useState(dealScoreVehicles[0].make);
  const [selectedModel, setSelectedModel] = React.useState(dealScoreVehicles[0].model);

  const yearOptions = React.useMemo(
    () => uniqueValues(dealScoreVehicles.map((vehicle) => vehicle.year)),
    [],
  );
  const makeOptions = React.useMemo(
    () =>
      uniqueValues(
        dealScoreVehicles
          .filter((vehicle) => vehicle.year === selectedYear)
          .map((vehicle) => vehicle.make),
      ),
    [selectedYear],
  );
  const modelOptions = React.useMemo(
    () =>
      uniqueValues(
        dealScoreVehicles
          .filter(
            (vehicle) =>
              vehicle.year === selectedYear && vehicle.make === selectedMake,
          )
          .map((vehicle) => vehicle.model),
      ),
    [selectedMake, selectedYear],
  );
  const selectedVehicle =
    dealScoreVehicles.find(
      (vehicle) =>
        vehicle.year === selectedYear &&
        vehicle.make === selectedMake &&
        vehicle.model === selectedModel,
    ) ?? dealScoreVehicles[0];
  const vehicleName = `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.trim}`;

  const handleYearChange = (year: string) => {
    const nextVehicle =
      dealScoreVehicles.find((vehicle) => vehicle.year === year) ??
      dealScoreVehicles[0];
    setSelectedYear(nextVehicle.year);
    setSelectedMake(nextVehicle.make);
    setSelectedModel(nextVehicle.model);
  };

  const handleMakeChange = (make: string) => {
    const nextVehicle =
      dealScoreVehicles.find(
        (vehicle) => vehicle.year === selectedYear && vehicle.make === make,
      ) ?? dealScoreVehicles[0];
    setSelectedMake(nextVehicle.make);
    setSelectedModel(nextVehicle.model);
  };

  const handleModelChange = (model: string) => {
    const nextVehicle =
      dealScoreVehicles.find(
        (vehicle) =>
          vehicle.year === selectedYear &&
          vehicle.make === selectedMake &&
          vehicle.model === model,
      ) ?? dealScoreVehicles[0];
    setSelectedModel(nextVehicle.model);
  };

  const vehicleSelector = (
    <div className="rounded-[8px] border border-border bg-muted/25 p-3">
      <p className="text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Vehicle
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
          Year
          <select
            value={selectedYear}
            onChange={(event) => handleYearChange(event.target.value)}
            className="h-10 rounded-[4px] border border-border bg-background px-3 pr-8 text-sm font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Select vehicle year"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
          Make
          <select
            value={selectedMake}
            onChange={(event) => handleMakeChange(event.target.value)}
            className="h-10 rounded-[4px] border border-border bg-background px-3 pr-8 text-sm font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Select vehicle make"
          >
            {makeOptions.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
          Model
          <select
            value={selectedModel}
            onChange={(event) => handleModelChange(event.target.value)}
            className="h-10 rounded-[4px] border border-border bg-background px-3 pr-8 text-sm font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Select vehicle model"
          >
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
  const showVehicleSelector = false;

  return (
    <article
      className="min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      aria-label={`${ad.sponsor}: ${ad.title}`}
    >
      {showVehicleSelector ? (
        <header className="border-b border-border bg-[var(--hp-surface)] p-5 sm:p-6">
          {vehicleSelector}
        </header>
      ) : null}

      <div className="relative overflow-hidden bg-[#101820] text-white">
        <Image
          src={selectedVehicle.imageUrl}
          alt={vehicleName}
          width={704}
          height={396}
          sizes="(max-width: 1024px) 100vw, 640px"
          className="h-48 w-full object-cover opacity-55 sm:h-56"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,24,32,0.95)_0%,rgba(16,24,32,0.78)_48%,rgba(16,24,32,0.18)_100%)]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[length:var(--text-token-4xs)] font-black uppercase tracking-[0.24em] text-white/70">
                Car and Driver Marketplace
              </p>
              <h2 className="headline mt-3 max-w-md text-3xl leading-none sm:text-4xl">
                {ad.title}
              </h2>
            </div>
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-white/25 bg-white text-[#101820] shadow-lg">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#245F86]">
                  Score
                </p>
                <p className="text-3xl font-black leading-none">
                  {selectedVehicle.score}
                </p>
              </div>
            </div>
          </div>
          <p className="max-w-xl text-sm font-medium leading-6 text-white/82">
            {ad.summary}
          </p>
        </div>
      </div>

      <div className="bg-[var(--hp-surface)] p-5 sm:p-6">
        <section>
          <div className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-black uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
            AI Deal Score
          </div>
          <h3 className="mt-3 text-xl font-black leading-tight">
            {vehicleName}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {selectedVehicle.verdict}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[8px] border border-border bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <DollarSign className="h-4 w-4" aria-hidden />
                Target buy range
              </div>
              <p className="mt-2 text-xl font-black sm:text-2xl">
                {selectedVehicle.targetRange}
              </p>
            </div>
            <div className="rounded-[8px] border border-border bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <TrendingUp className="h-4 w-4" aria-hidden />
                Asking price
              </div>
              <p className="mt-2 text-xl font-black sm:text-2xl">
                {selectedVehicle.askingPrice}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm font-bold text-primary">
              Negotiation guidance
            </p>
            <p className="mt-1 text-sm leading-6">
              {selectedVehicle.guidance}
            </p>
          </div>
        </section>

        <section className="mt-5 border-t border-border pt-4">
          <p className="text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Signals behind the score
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {selectedVehicle.signals.map((signal) => (
              <div
                key={signal.label}
                className="min-w-0 rounded-[6px] border border-border bg-muted/20 px-3 py-2 text-xs leading-5 text-muted-foreground"
              >
                <span className="block">{signal.label}</span>
                <span className="mt-0.5 block truncate text-foreground">
                  {signal.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-[4px] bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Check my deal
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-border bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Compare offers
          </button>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs font-semibold leading-5 text-muted-foreground">
          <Car className="h-4 w-4 shrink-0" aria-hidden />
          Built for YMM cards where shoppers revisit trims, pricing, and local
          offers before submitting a lead.
        </p>
      </div>
    </article>
  );
}
