"use client";

import React from "react";
import Image from "next/image";
import { CaretDown } from "@phosphor-icons/react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { isYearMakeModelStory } from "./story-presentation-model";

type VehicleField = { label: string; value: string };
type VehicleSection = { heading: string; fields: VehicleField[] };
type VehicleImage = { src: string; alt: string };
type VehicleDetails = {
  title: string;
  sourceUrl: string;
  rating?: string;
  overview?: string;
  fields: VehicleField[];
  images: VehicleImage[];
  testedConfiguration?: { title: string; sections: VehicleSection[] };
};

export function VehicleDetailsReaderModule({
  story,
  afterHeading,
  onImages,
  onVehicleDetails,
}: {
  story: LifestyleRiverStory;
  afterHeading?: React.ReactNode;
  onImages?: (storyId: string, images: VehicleImage[]) => void;
  onVehicleDetails?: (storyId: string, details: Pick<VehicleDetails, "title" | "sourceUrl">) => void;
}) {
  const isSupportedStory = story.brandSlug === "car-and-driver" && isYearMakeModelStory(story) && Boolean(story.sourceUrl);
  const [detailState, setDetailState] = React.useState<{
    storyId: string;
    status: "loading" | "ready" | "unavailable";
    details?: VehicleDetails;
  }>({ storyId: story.id, status: "loading" });
  const status = !isSupportedStory
    ? "unavailable"
    : detailState.storyId === story.id
      ? detailState.status
      : "loading";
  const details = detailState.storyId === story.id ? detailState.details : undefined;

  React.useEffect(() => {
    if (!isSupportedStory || !story.sourceUrl) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ title: story.title, url: story.sourceUrl });
    void fetch(`/api/hearst-auto-vehicle-details/?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Vehicle details are unavailable");
        return response.json() as Promise<VehicleDetails>;
      })
      .then((result) => {
        if (!result.title || !result.sourceUrl || result.fields.length === 0) {
          throw new Error("Vehicle details are incomplete");
        }
        setDetailState({ storyId: story.id, status: "ready", details: result });
        onImages?.(story.id, result.images ?? []);
        onVehicleDetails?.(story.id, { title: result.title, sourceUrl: result.sourceUrl });
      })
      .catch(() => {
        if (!controller.signal.aborted) setDetailState({ storyId: story.id, status: "unavailable" });
      });

    return () => controller.abort();
  }, [isSupportedStory, onImages, onVehicleDetails, story.brandSlug, story.id, story.sourceUrl, story.title]);

  if (story.brandSlug !== "car-and-driver" || !isYearMakeModelStory(story)) return null;

  return (
    <section
      aria-busy={status === "loading"}
      aria-labelledby={`vehicle-details-${story.id}`}
      className="mx-auto mt-6 max-w-3xl"
    >
      <div className="@container grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 sm:gap-x-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Vehicle research</p>
          <h2 id={`vehicle-details-${story.id}`} className="headline !font-sans mt-1 min-w-0 break-words text-[clamp(1.5rem,7.5cqi,3rem)] font-bold leading-[1.08] tracking-tight text-foreground">
            {details?.title ?? story.title}
          </h2>
        </div>
        {details?.rating ? (
          <div className="flex min-w-[5rem] shrink-0 flex-col items-center pt-5 text-center" aria-label={`Car and Driver rating ${details.rating}`}>
            <span className="flex items-baseline font-extrabold tabular-nums leading-none text-foreground" style={{ fontFamily: '"Inter", Arial, sans-serif' }}>
              <span className="text-[42px]">{details.rating.split("/")[0]}</span>
              <span className="text-[18px]">/{details.rating.split("/")[1] ?? "10"}</span>
            </span>
            <span className="mt-1 inline-flex items-center gap-1 font-sans text-xs font-semibold text-muted-foreground">
              <Image src="/cd.svg" alt="" width={16} height={16} aria-hidden="true" />
              Rating
            </span>
          </div>
        ) : null}
      </div>

      {afterHeading}

      {status === "loading" ? (
        <p role="status" className="mt-4 text-sm text-muted-foreground">Loading source vehicle details…</p>
      ) : null}

      {status === "unavailable" ? (
        <p role="status" className="mt-4 text-sm text-muted-foreground">
          No matching vehicle record could be verified from this story’s Car and Driver page.
        </p>
      ) : null}

      {details ? (
        <>
          {details.overview ? (
            <div className="mt-5 max-w-2xl">
              <h4 className="text-xl font-semibold leading-tight text-foreground">Overview</h4>
              <p className="mt-1.5 text-[18px] leading-8 text-foreground/85">{details.overview}</p>
            </div>
          ) : null}

          <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-border bg-border sm:grid-cols-2">
            {details.fields.map((field) => (
              <div key={field.label} className="min-w-0 bg-[var(--brand-3)] px-4 py-3.5">
                <dt className="text-xs font-medium text-muted-foreground">{field.label}</dt>
                <dd className="mt-1 break-words text-sm font-semibold leading-snug text-foreground">{field.value}</dd>
              </div>
            ))}
          </dl>

          {details.testedConfiguration ? (
            <details className="group mt-6 border-t border-border pt-4">
              <summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center justify-between gap-2 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span>Car and Driver tested configuration</span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  {details.testedConfiguration.title}
                  <CaretDown aria-hidden="true" size={16} className="transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <div className="mt-3 divide-y divide-border border-y border-border">
                {details.testedConfiguration.sections.map((section) => (
                  <section key={section.heading} className="py-4">
                    <h5 className="text-xs font-bold uppercase tracking-wide text-primary">{section.heading}</h5>
                    <dl className="mt-3 grid gap-x-6 sm:grid-cols-2">
                      {section.fields.map((field, index) => (
                        <div key={`${section.heading}-${field.label}-${index}`} className="grid min-w-0 grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] gap-3 py-2 text-sm">
                          {field.label ? <dt className="min-w-0 break-words text-muted-foreground">{field.label}</dt> : <dt className="sr-only">Specification</dt>}
                          <dd className="min-w-0 break-words font-medium text-foreground">{field.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            </details>
          ) : null}

          <div className="mt-5 border-t border-border pt-3">
            <a
              href={details.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline decoration-border underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View vehicle details at Car and Driver
            </a>
          </div>
        </>
      ) : null}
    </section>
  );
}
